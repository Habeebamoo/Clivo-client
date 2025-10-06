package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type AdminRepository interface {
	GetUsers() ([]models.UserResponse, int, error)
	GetUser(string) (models.UserResponse, int, error)
	UpdateUserVerification(string, bool) (int, error)
	UpdateUserRestriction(string, bool) (int, error)
	GetUserIdByUsername(string) (string, int, error)
	GetUserArticles(string) ([]models.Article, int, error)
	DeleteArticle(string) (int, error)
}

type AdminRepo struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) AdminRepository {
	return &AdminRepo{db}
}

func (ar *AdminRepo) GetUsers() ([]models.UserResponse, int, error) {
	var users []models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.interests, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Scan(&users)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return users, 200, nil
		}
		return users, 500, fmt.Errorf("internal server error")
	}

	return users, 200, nil
}

func (ar *AdminRepo) GetUser(userId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.interests, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return user, 404, fmt.Errorf("User Not Found")
		}
		return user, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ar *AdminRepo) UpdateUserVerification(userId string, way bool) (int, error) {
	res := ar.db.Model(&models.User{}).
							Where("user_id = ?", userId).
							Update("verified", way)

	if res.Error != nil {
		if res.RowsAffected == 0 {
			return 500, fmt.Errorf("failed to update user")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (ar *AdminRepo) UpdateUserRestriction(userId string, way bool) (int, error) {
	res := ar.db.Model(&models.User{}).
							Where("user_id = ?", userId).
							Update("is_banned", way)

	if res.Error != nil {
		if res.RowsAffected == 0 {
			return 500, fmt.Errorf("failed to update user")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (ar *AdminRepo) GetUserIdByUsername(username string) (string, int, error) {
	//get user profile
	var userProfile models.Profile
	res := ar.db.First(&userProfile, "username = ?", username)

	//error check
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return "", 404, fmt.Errorf("user not found")
		}
		return "", 500, fmt.Errorf("internal server error")
	}

	return userProfile.UserId, 200, nil
}

func (ar *AdminRepo) GetUserArticles(userId string) ([]models.Article, int, error) {
	var articles []models.Article
	res := ar.db.Find(&articles, "author_id = ?", userId)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articles, 404, fmt.Errorf("articles not found")
		}
		return articles, 500, fmt.Errorf("internal server error")
	}

	return articles, 200, nil
}

func (ar *AdminRepo) DeleteArticle(articleId string) (int, error) {
	res := ar.db.Model(&models.Article{}).
							Where("article_id = ?", articleId).
							Delete(models.Article{})
	
	if res.Error != nil {
		if res.RowsAffected == 0 {
			return 500, fmt.Errorf("failed to delete article")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
} 

