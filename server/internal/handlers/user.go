package handlers

import (
	"github.com/Habeebamoo/Clivo/server/internal/models"
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

func (uhdl *UserHandler) GetProfile(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId Missing", nil)
		return
	}

	userId := userIdAny.(string)

	//call service
	user, statusCode, err := uhdl.service.GetUserProfile(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", user)
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
	username := c.Param("username")
	articleTitle := c.Param("title")

	if username == "" || articleTitle == "" {
		utils.Error(c, 400, "Article Not Found", nil)
		return
	}

	//call service
	article, statusCode, err := uhdl.service.GetArticle(username, articleTitle)
	if err != nil {
		utils.Error(c, statusCode, "Article Not Found", nil)
		return
	}

	utils.Success(c, statusCode, "", article)
}

func (uhdl *UserHandler) GetArticleComments(c *gin.Context) {
	username := c.Param("username")
	articleTitle := c.Param("title")

	if username == "" || articleTitle == "" {
		utils.Error(c, 400, "Article Not Found", nil)
		return
	}

	//call service
	comments, statusCode, err := uhdl.service.GetArticleComments(username, articleTitle)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", comments)
}

func (uhdl *UserHandler) GetCommentReplys(c *gin.Context) {
	commentId := c.Param("id")

	if commentId == "" {
		utils.Error(c, 400, "Invalid Comment", nil)
		return
	}

	//call service
	comments, statusCode, err := uhdl.service.GetCommentReplys(commentId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", comments)
}

func (uhdl *UserHandler) UpdateProfile(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "Unauthorized Access", nil)
		return
	}

	userId := userIdAny.(string)

	//receive form data
	name := c.PostForm("name")
	email := c.PostForm("email")
	website := c.PostForm("website")
	bio := c.PostForm("bio")
	picture, _, err := c.Request.FormFile("picture")

	if name == "" || email == "" || website == "" || bio == "" {
		utils.Error(c, 400, "No fields must be empty", nil)
		return
	}

	//build request
	profileUpdateReq := models.ProfileUpdateRequest{
		Name: name,
		Email: email,
		Website: website,
		Bio: bio,
		Picture: &picture,
		FileAvailable: err == nil,
	}

	//call service
	statusCode, err := uhdl.service.UpdateUserProfile(userId, profileUpdateReq)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, 201, "Profile Update Successfully", nil)
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