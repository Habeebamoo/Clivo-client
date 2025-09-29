package services

import (
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type ArticleService interface {
	CreateArticle(models.ArticleRequest, string) (int, error)
	GetArticle(string) (models.ArticleResponse, int, error)
	GetMyArticles(string) ([]models.ArticleResponse, int, error)
}

type ArticleSvc struct {
	repo repositories.ArticleRepository
}

func NewArticleService(repo repositories.ArticleRepository) ArticleService {
	return &ArticleSvc{repo: repo}
}

func (as *ArticleSvc) CreateArticle(articleReq models.ArticleRequest, userId string) (int, error) {
	//calculate read time
  readTime := ""

	//upload article image
	articleImage := ""

	//userId is currently email

	//assign article
	article := models.Article{
		ArticleId: utils.GenerateRandomId(),
		AuthorId: userId,
		Title: articleReq.Title,
		Content: articleReq.Content,
		CreatedAt: time.Now(),
		ReadTime: readTime,
		Picture: articleImage,
	}

	return as.repo.CreateArticle(article)

	//notify followers here
}

func (as *ArticleSvc) GetArticle(id string) (models.ArticleResponse, int, error) {
	//get article
	article, code, err := as.repo.GetArticleById(id)
	if err != nil {
		return models.ArticleResponse{}, code, err
	}

	//get article likes
	articleLikes := 0

	//get article tags
	articleTags := []string{"Tech", "Science"}

	//get user
	author, code, err := as.repo.GetArticleAuthorById(article.AuthorId)
	if err != nil {
		return models.ArticleResponse{}, code, err
	}

	//build response
	articleRespose := models.ArticleResponse{
		ArticleId: article.ArticleId,
		AuthorId: article.AuthorId,
		AuthorPicture: author.Picture,
		AuthorFullname: author.Name,
		AuthorVerified: author.Verified,
		Title: article.Title,
		Content: article.Content,
		Picture: article.Picture,
		Tags: articleTags,
		Likes: articleLikes,
		ReadTime: article.ReadTime,
		CreatedAt: article.CreatedAt,
	}

	return articleRespose, 200, nil
}

func (as *ArticleSvc) GetMyArticles(userId string) ([]models.ArticleResponse, int, error) {
	//get articles
	articles, code, err := as.repo.GetArticles(userId)
	if err != nil {
		return []models.ArticleResponse{}, code, err
	}

	//call service to format all articles
	userArticles := []models.ArticleResponse{}

	for _, article := range articles {
		formatedArticle, code, err := as.GetArticle(article.ArticleId)
		if err != nil {
			return []models.ArticleResponse{}, code, err
		}

		userArticles = append(userArticles, formatedArticle)
	}

	return userArticles, 200, nil
}