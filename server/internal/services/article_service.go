package services

import (
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type ArticleService interface {
	CreateArticle(models.ArticleRequest) (int, error)
	GetArticle(string) (models.ArticleResponse, int, error)
}

type ArticleSvc struct {
	repo repositories.ArticleRepository
}

func NewArticleService(repo repositories.ArticleRepository) ArticleService {
	return &ArticleSvc{repo: repo}
}

func (as *ArticleSvc) CreateArticle(articleReq models.ArticleRequest) (int, error) {
	//calculate read time
  readTime := ""

	//upload article image
	articleImage := ""

	//assign article
	article := models.Article{
		ArticleId: utils.GenerateRandomId(),
		AuthorId: articleReq.UserId,
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
	author, code, err := as.repo.GetArticleAuthorById(id)
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