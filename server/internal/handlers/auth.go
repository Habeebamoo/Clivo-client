package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/config"
	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

type AuthHandler struct {
	service services.AuthService
}

func NewAuthHandler(service services.AuthService) AuthHandler {
	return AuthHandler{service}
}

func (ahdl *AuthHandler) GoogleLogin(c *gin.Context) {
	//redirect to google oauth
	state := "statedemo"
	url := config.OauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusFound, url)
}

func (ahdl *AuthHandler) GoogleCallBack(c *gin.Context) {
	//google oauth logic here
	ctx := context.Background()

	//custom http client that forces IPv4
	httpClient := &http.Client{
		Transport: &http.Transport{
			DialContext: (&net.Dialer{
				Timeout: 10*time.Second,
				KeepAlive: 10*time.Second,
				DualStack: false,
			}).DialContext,
		},
		Timeout: 15*time.Second,
	}

	//frontend url
	clientOrigin, _ := config.Get("CLIENT_URL")

	//validate state
	state := c.Query("state")
	if state != "statedemo" {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "Unauthorized Access")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	//get code
	code := c.Query("code")
	if code == "" {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "Code not found")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	//get token
	token, err := config.OauthConfig.Exchange(context.WithValue(context.Background(), oauth2.HTTPClient, httpClient), code)
	if err != nil {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "Token exchange error")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	//exchange token
	client := config.OauthConfig.Client(ctx, token)

	//fetch user info
	resp, err := client.Get("https://openidconnect.googleapis.com/v1/userinfo")
	if err != nil {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "OpenId connect")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	if resp.StatusCode != http.StatusOK {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "OpenId connect")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	defer resp.Body.Close()

	var userInfo map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "Internal server error")
		c.Redirect(http.StatusFound, redirectUrl)
		return
	}

	//user info
	name := userInfo["name"].(string)
	email := userInfo["email"].(string)
	picture := userInfo["picture"].(string)

	userReq := models.UserRequest{
		Name: name,
		Email: email,
		Picture: picture,
		Interets: []string{},
	}

	//cheks if user exists
	userExists := ahdl.service.UserExists(email)

	if userExists {
		//call service (user signin)
		token, _, err := ahdl.service.SignInUser(userReq)
		if err != nil {
			//redirect to clivo welcome page
			clientOrigin, _ := config.Get("CLIENT_URL")
			c.Redirect(http.StatusFound, clientOrigin)
		}

		//set cookies
		utils.SetCookies(c, token)

		//redirect to clivo home
		clientOrigin, _ := config.Get("CLIENT_URL")
		redirectURL := fmt.Sprintf("%s/home", clientOrigin)
		c.Redirect(http.StatusFound, redirectURL)

	} else {
		//encode user info
		encodedUserInfo, err := utils.EncodeUser(models.UserPayload{Name: userReq.Name, Email: userReq.Email, Picture: userReq.Picture})
		if err != nil {
			redirectUrl := fmt.Sprintf("%s/auth/error?reason=%s", clientOrigin, "Internal server error")
			c.Redirect(http.StatusFound, redirectUrl)
			return
		}

		//redirect to clivo interest page
		clientOrigin, _ := config.Get("CLIENT_URL")
		redirectURL := fmt.Sprintf("%s/interests?token=%s", clientOrigin, encodedUserInfo)
		c.Redirect(http.StatusFound, redirectURL)
	}
}

func (ahdl *AuthHandler) SignIn(c *gin.Context) {
	var interests []string
	if err := c.ShouldBindJSON(&interests); err != nil {
		utils.Error(c, 400, "", nil)
		return
	}

	//validate interests
	if len(interests) == 0 {
		utils.Error(c, 400, "", nil)
		return	
	}

	//extract token
	encodedUserInfo := c.Query("token")
	if encodedUserInfo == "" {
		utils.Error(c, 400, "", nil)
		return
	}

	//validate encoded userinfo
	decodedUser, err := utils.DecodeUser(encodedUserInfo)
	if err != nil {
		utils.Error(c, 500, "", nil)
		return
	}

	user := models.UserRequest{
		Name: decodedUser.Name,
		Email: decodedUser.Email,
		Picture: decodedUser.Picture,
		Interets: interests,
	}

	if err := user.Validate(); err != nil {
		utils.Error(c, 400, "", nil)
		return
	}

	token, statusCode, err := ahdl.service.SignUpUser(user)
	if err != nil {
		utils.Error(c, statusCode, "", nil)
		return
	}

	// send cookie
	utils.SetCookies(c, token)

	utils.Success(c, 200, "", nil)
}