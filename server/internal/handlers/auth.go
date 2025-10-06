package handlers

import (
	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service services.AuthService
}

func NewAuthHandler(service services.AuthService) AuthHandler {
	return AuthHandler{service}
}

func (ahdl *AuthHandler) GoogleLogin(c *gin.Context) {
	//redirect to google oauth
}

func (ahdl *AuthHandler) GoogleCallBack(c *gin.Context) {
	//google oauth logic here

	//fake user info from google logic
	name := c.Query("name")
	email := c.Query("email")
	picture := c.Query("picture")

	userInfo := map[string]string{"name": name, "email": email, "picture": picture}

	//call service to know if user exists and determine statuscode (200 or 201)

	//send userinfo back to client
	utils.Success(c, 200, "", userInfo)
}

func (ahdl *AuthHandler) SignIn(c *gin.Context) {
	//client sends this back after google auth
	var user models.UserRequest
	if err := c.ShouldBindJSON(&user); err != nil {
		utils.Error(c, 400, "Invalid JSON Format", nil)
		return
	}

	if err := user.Validate(); err != nil {
		utils.Error(c, 400, utils.FormatText(err.Error()), nil)
		return
	}

	token, statusCode, err := ahdl.service.SignInUser(user)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	// send cookie
	utils.SetCookies(c, token)

	utils.Success(c, statusCode, "Signed In Successfully", nil)
}

func (ahdl *AuthHandler) GetProfile(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId Missing", nil)
		return
	}

	userId := userIdAny.(string)

	//call service
	user, statusCode, err := ahdl.service.GetUserProfile(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", user)
}