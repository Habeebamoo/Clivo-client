package handlers

import (
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	service services.AdminService
}

func NewAdminHandler(service services.AdminService) AdminHandler {
	return AdminHandler{service}
}

func (ahdl *AdminHandler) GetUsers(c *gin.Context) {
	//call service
	users, statusCode, err := ahdl.service.GetUsers()
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", users)
}

func (ahdl *AdminHandler) GetUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	user, statusCode, err := ahdl.service.GetUser(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", user)
}

func (ahdl *AdminHandler) VerifyUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := ahdl.service.VerifyUser(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "User Verification Successfull", nil)
}

func (ahdl *AdminHandler) UnVerifyUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := ahdl.service.UnVerifyUser(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "User Un-Verfication Successfull", nil)
}

func (ahdl *AdminHandler) RestrictUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := ahdl.service.BanUser(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "User Restriction Successfull", nil)
}

func (ahdl *AdminHandler) UnRestrictUser(c *gin.Context) {
	userId := c.Param("id")
	if userId == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := ahdl.service.UnBanUser(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "User Restriction Lifting Successfull", nil)
}

func (ahdl *AdminHandler) DeleteArticle(c *gin.Context) {

}