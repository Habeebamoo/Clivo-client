package handlers

import (
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

	//bind body
	var articleReq models.ArticleRequest
	if err := c.ShouldBindJSON(&articleReq); err != nil {
		utils.Error(c, 400, "Invaild JSON Format", nil)
		return
	}

	//validate request
	if err := articleReq.Validate(); err != nil {
		utils.Error(c, 400, utils.FormatText(err.Error()), nil)
		return
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

//fetch all articles
func (ah *ArticleHandler) FetchArticles(c *gin.Context) {
	_, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId is missing", nil)
		return
	}

	//call service
	articles, statusCode, err := ah.service.FetchArticles()
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, 200, "", articles)
}

func (ah *ArticleHandler) DeleteArticle(c *gin.Context) {
	_, exists := c.Get("userId")
	if !exists {
		utils.Error(c, 401, "UserId is missing", nil)
		return
	}

	articleId := c.Param("id")
	if articleId == "" {
		utils.Error(c, 400, "Article ID Missing", nil)
		return
	}

	//call service
	statusCode, err := ah.service.DeleteArticle(articleId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Article has been deleted", nil)
}