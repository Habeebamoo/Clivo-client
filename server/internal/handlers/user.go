package handlers

import (
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service services.UserService
}

func NewUserHandler(service services.UserService) UserHandler {
	return UserHandler{service}
}

func (uhdl *UserHandler) GetUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "User Not Found", nil)
		return
	}

	//call service
	user, statusCode, err := uhdl.service.GetUser(userId)
	if err != nil {
		utils.Error(c, statusCode, "", user)
		return
	}

	utils.Success(c, statusCode, "", user)
}