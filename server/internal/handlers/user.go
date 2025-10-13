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

func (uhdl *UserHandler) FollowUser(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "Unauthorized Access", nil)
		return
	}

	userId := userIdAny.(string)

	userFollowing := c.Param("id")
	if userFollowing == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := uhdl.service.FollowUser(userId, userFollowing)
	if err != nil {
		utils.Error(c, statusCode, "", nil)
		return
	}

	utils.Success(c, statusCode, "", nil)
}

func (uhdl *UserHandler) UnFollowUser(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "Unauthorized Access", nil)
		return
	}

	userId := userIdAny.(string)

	userFollowing := c.Param("id")
	if userFollowing == "" {
		utils.Error(c, 400, "UserId Missing", nil)
		return
	}

	//call service
	statusCode, err := uhdl.service.UnFollowUser(userId, userFollowing)
	if err != nil {
		utils.Error(c, statusCode, "", nil)
		return
	}

	utils.Success(c, statusCode, "", nil)
}

func (uhdl *UserHandler) GetUser(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		utils.Error(c, 400, "User Not Found", nil)
		return
	}

	//call service
	user, statusCode, err := uhdl.service.GetUser(username)
	if err != nil {
		utils.Error(c, statusCode, "User Not Found", nil)
		return
	}

	utils.Success(c, statusCode, "", user)
}

func (uhdl *UserHandler) GetUserArticles(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		utils.Error(c, 400, "Username Missing", nil)
		return
	}

	//call service
	articles, statusCode, err := uhdl.service.GetArticles(username)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", articles)
}

func (uhdl *UserHandler) GetUserArticle(c *gin.Context) {
	articleId := c.Param("id")
	if articleId == "" {
		utils.Error(c, 400, "Article Not Found", nil)
		return
	}

	//call service
	article, statusCode, err := uhdl.service.GetArticle(articleId)
	if err != nil {
		utils.Error(c, statusCode, "Article Not Found", nil)
		return
	}

	utils.Success(c, statusCode, "", article)
}

func (uhdl *UserHandler) GetUserFollowers(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "Unauthorized Access", nil)
		return
	}

	userId := userIdAny.(string)

	//call service
	followers, statusCode, err := uhdl.service.GetFollowers(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}
	
	utils.Success(c, statusCode, "", followers)
}

func (uhdl *UserHandler) GetUsersFollowing(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "Unauthorized Access", nil)
		return
	}

	userId := userIdAny.(string)

	//call service
	followers, statusCode, err := uhdl.service.GetFollowing(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}
	
	utils.Success(c, statusCode, "", followers)
}