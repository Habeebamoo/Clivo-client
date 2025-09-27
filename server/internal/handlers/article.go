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

func (ah *ArticleHandler) CreateArticle(c *gin.Context) {
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
	statusCode, err := ah.service.CreateArticle(articleReq)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "Article Created Successfully", nil)
}

func (ah *ArticleHandler) GetArticle(c *gin.Context) {
	//validate request
	articleId := c.Param("id")
	if articleId == "" {
		utils.Error(c, 400, "Article Id Missing", nil)
		return
	}

	//call service
	article, statusCode, err := ah.service.GetArticle(articleId)
	if err != nil {
		utils.Error(c, statusCode, utils.FormatText(err.Error()), nil)
		return
	}

	utils.Success(c, statusCode, "", article)
}

func (ah *ArticleHandler) FetchArticles(c *gin.Context) {

}

func (ah *ArticleHandler) UpdateArticle(c *gin.Context) {

}

func (ah *ArticleHandler) DeleteArticle(c *gin.Context) {

}