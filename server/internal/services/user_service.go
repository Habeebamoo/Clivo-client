package services

import (
	"strings"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
)

type UserService interface {
	GetUser(string) (models.SafeUserResponse, int, error)
	GetArticle(string) (models.SafeArticleResponse, int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo}
}

func (us *UserSvc) GetUser(username string) (models.SafeUserResponse, int, error) {
	return us.repo.GetUser(username)
}

func (us *UserSvc) GetArticle(articleId string) (models.SafeArticleResponse, int, error) {
	//get article
	article, code, err := us.repo.GetArticleById(articleId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	//get article likes
	articleLikes, err := us.repo.GetArticleLikes(article.ArticleId)
	if err != nil {
		return models.SafeArticleResponse{}, 500, err
	}

	//get article tags
	articleTags, code, err := us.repo.GetArticleTags(article.ArticleId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	articleTagsFormated := strings.Split(articleTags.Tag, ", ")

	//get user
	author, code, err := us.repo.GetArticleAuthorById(article.AuthorId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	//build response
	articleRespose := models.SafeArticleResponse{
		ArticleId: article.ArticleId,
		AuthorPicture: author.Picture,
		AuthorFullname: author.Name,
		AuthorVerified: author.Verified,
		Title: article.Title,
		Content: article.Content,
		Picture: article.Picture,
		Tags: articleTagsFormated,
		Likes: articleLikes,
		ReadTime: article.ReadTime,
		CreatedAt: article.CreatedAt,
	}

	return articleRespose, 200, nil
}