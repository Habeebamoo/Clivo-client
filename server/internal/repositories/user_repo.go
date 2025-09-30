package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser(string) (models.SafeUserResponse, int, error)
	GetArticleById(string) (models.Article, int, error)
	GetArticleAuthorById(string) (models.SafeUserResponse, int, error)
	GetArticleTags(string) (models.Tag, int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db}
}

func (ur *UserRepo) GetUser(username string) (models.SafeUserResponse, int, error) {
	//get userId
	var userProfile models.Profile
	res := ur.db.First(&userProfile, "username = ?", username)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	var user models.SafeUserResponse
	res = ur.db.Table("users u").
				Select("u.name, u.verified, p.username, p.bio, p.picture, p.profile_link, p.following, p.followers").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userProfile.UserId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ur *UserRepo) GetArticleById(articleId string) (models.Article, int, error) {
	var article models.Article
	res := ur.db.First(&article, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return article, 404, fmt.Errorf("article does not exists")
		}
		return article, 500, fmt.Errorf("internal server error")
	}

	return article, 200, nil
}

func (ur *UserRepo) GetArticleAuthorById(authorId string) (models.SafeUserResponse, int, error) {
	var user models.SafeUserResponse
	res := ur.db.Table("users u").
				Select("u.name, u.verified, p.username, p.bio, p.picture, p.profile_link, p.following, p.followers").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", authorId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ur *UserRepo) GetArticleTags(articleId string) (models.Tag, int, error) {
	var articleTags models.Tag
	res := ur.db.First(&articleTags, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articleTags, 404, fmt.Errorf("article tags not found")
		}
		return articleTags, 500, fmt.Errorf("internal server error")
	}
	
	return articleTags, 200, nil
}


