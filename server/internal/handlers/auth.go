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


	// sign in user

	//fake payload
	var user models.UserRequest
	if err := c.ShouldBindJSON(&user); err != nil {
		utils.Error(c, 400, "Invalid JSON Format", nil)
		return
	}

	//demo validation
	if user.Name == "" || user.Email == "" || user.Picture == "" {
		utils.Error(c, 400, "Missing fields", nil)
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