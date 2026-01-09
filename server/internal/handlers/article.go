package handlers

import (
	"encoding/json"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

type ArticleHandler struct {
	service services.ArticleService
}

func NewArticleHandler(service services.ArticleService) ArticleHandler {
	return ArticleHandler{service: service}
}

//create article
func (ah *ArticleHandler) CreateArticle(c *gin.Context) {
	//use this in production instead of (userId in article request)
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId is missing", nil)
		return
	}

	userId := userIdAny.(string)

	//validate request
	title := c.PostForm("title")
	content := c.PostForm("content")
	tags := c.PostFormArray("tags[]")

	var jsonContent json.RawMessage = []byte(content)

	if title == "" || content == "" || len(tags) == 0 {
		utils.Error(c, 400, "All fields must be complete", nil)
		return
	}

	picture, file, err := c.Request.FormFile("picture")
	if err != nil {
		utils.Error(c, 400, "All fields must be complete", nil)
		return	
	}

	if file.Size > 2 << 20 {
		utils.Error(c, 400, "Image must be 2MB or less", nil)
		return	
	}

	//bind body
	articleReq := models.ArticleRequest{
		Title: title,
		Content: jsonContent,
		Picture: &picture,
		Tags: tags,
	}

	//call article service
	statusCode, err := ah.service.CreateArticle(articleReq, userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Article Created Successfully", nil)
}

//Get 1 article
// func (ah *ArticleHandler) GetMyArticle(c *gin.Context) {
// 	_, exists := c.Get("userId")
// 	if !exists {
// 		utils.Error(c, 401, "UserId is missing", nil)
// 		return
// 	}

// 	//validate request
// 	articleId := c.Param("id")
// 	if articleId == "" {
// 		utils.Error(c, 400, "Article Id Missing", nil)
// 		return
// 	}

// 	//call service
// 	article, statusCode, err := ah.service.GetArticle(articleId)
// 	if err != nil {
// 		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
// 		return
// 	}

// 	utils.Success(c, statusCode, "", article)
// }

//Get all my articles
func (ah *ArticleHandler) GetAllMyArticles(c *gin.Context) {
	//use this in production instead of (userId in article request)
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId is missing", nil)
		return
	}

	userId := userIdAny.(string)

	//call service
	articles, statusCode, err := ah.service.GetMyArticles(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, 200, "", articles)
}

func (ah *ArticleHandler) GetUserFeed(c *gin.Context) {
	userIdAny, _ := c.Get("userId")
	userId := userIdAny.(string)

	//call service
	articles, statusCode, err := ah.service.GetUserFeed(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", articles)
}

func (ah *ArticleHandler) GetUserFyp(c *gin.Context) {
	userIdAny, _ := c.Get("userId")
	userId := userIdAny.(string)

	//call service
	articles, statusCode, err := ah.service.GetUserFyp(userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", articles)
}

// func (ah *ArticleHandler) GetUserFyp(c *gin.Context) {
// 	userIdAny, _ := c.Get("userId")
// 	userId := userIdAny.(string)

// 	//call service
// 	articles, statusCode, err := ah.service.GetUserFyp(userId)
// 	if err != nil {
// 		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
// 		return
// 	}

// 	utils.Success(c, statusCode, "", articles)
// } 

func (ah *ArticleHandler) DeleteArticle(c *gin.Context) {
	userIdAny, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId is missing", nil)
		return
	}

	userId := userIdAny.(string)

	articleId := c.Param("id")
	if articleId == "" {
		utils.Error(c, 400, "Article ID Missing", nil)
		return
	}

	//call service
	statusCode, err := ah.service.DeleteArticle(articleId, userId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Article has been deleted", nil)
}

func (ah *ArticleHandler) LikeArticle(c *gin.Context) {
	var articleLikeRequest models.Like
	if err := c.ShouldBindJSON(&articleLikeRequest); err != nil {
		utils.Error(c, 400, "Invalid JSON Format", nil)
		return
	}

	//validate request
	if err := articleLikeRequest.Validate(); err != nil {
		utils.Error(c, 400, utils.FormatText(err.Error()), nil)
		return
	}

	//call service
	statusCode, err := ah.service.LikeArticle(articleLikeRequest)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", nil)
}

func (ah *ArticleHandler) HasLikedArticle(c *gin.Context) {
	articleId := c.Param("articleId")
	userId := c.Param("userId")

	if articleId == "" || userId == "" {
		utils.Error(c, 400, "Params Missing", nil)
		return
	}

	articleLikeRequest := models.Like{
		ArticleId: articleId,
		LikerUserId: userId,
	}

	//call service
	liked := ah.service.HasUserLiked(articleLikeRequest)

	response := map[string]bool{ "liked": liked }
	utils.Success(c, 200, "", response)

}

func (ah *ArticleHandler) CommentArticle(c *gin.Context) {
	var replyRequest models.CommentRequest
	if err := c.ShouldBindJSON(&replyRequest); err != nil {
		utils.Error(c, 400, "Invalid JSON Format", nil)
		return
	}

	//validate request
	if err := replyRequest.Validate(); err != nil {
		utils.Error(c, 400, utils.FormatText(err.Error()), nil)
		return
	}

	//call service
	statusCode, err := ah.service.CommentArticle(replyRequest)
		if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Comment Sent.", nil)
}

func (ah *ArticleHandler) ReplyComment(c *gin.Context) {
	var replyRequest models.ReplyRequest
	if err := c.ShouldBindJSON(&replyRequest); err != nil {
		utils.Error(c, 400, "Invalid JSON Format", nil)
		return
	}

	//validate request
	if err := replyRequest.Validate(); err != nil {
		utils.Error(c, 400, utils.FormatText(err.Error()), nil)
		return
	}

	//call service
	statusCode, err := ah.service.ReplyComment(replyRequest)
		if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Reply Sent.", nil)
}