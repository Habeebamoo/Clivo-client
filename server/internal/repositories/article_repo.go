package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type ArticleRepository interface {
	CreateArticle(models.Article) (int, error)
	GetArticleById(string) (models.Article, int, error)
	GetArticleAuthorById(string) (models.UserResponse, int, error)
}

type ArticleRepo struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &ArticleRepo{db: db}
}

func (ar *ArticleRepo) CreateArticle(article models.Article) (int, error) {
	res := ar.db.Create(&article)
	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 201, nil
}

func (ar *ArticleRepo) GetArticleById(articleId string) (models.Article, int, error) {
	var article models.Article
	res := ar.db.First(&article, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return article, 404, fmt.Errorf("article does not exists")
		}
		return article, 500, fmt.Errorf("internal server error")
	}

	return article, 200, nil
}

func (ar *ArticleRepo) GetArticleAuthorById(authorId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, p.username, p.bio, p.picture, p.profile_link, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", authorId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.UserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.UserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

