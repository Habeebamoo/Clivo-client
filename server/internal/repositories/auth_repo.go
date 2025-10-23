package repositories

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type AuthRepository interface {
	CreateUser(models.User) (models.User, int, error)
	CreateUserProfile(models.Profile) (int, error)
	CreateUserInterests([]models.UserInterests) (int, error)
	GetUserByEmail(string) (models.User, int, error)
	GetUserById(userId string) (models.UserResponse, int, error)
	UserExists(string) bool
	UsernameExists(string) (bool)
}

type AuthRepo struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &AuthRepo{db: db}
}

func (ar *AuthRepo) CreateUser(user models.User) (models.User, int, error) {
	res := ar.db.Create(&user)

	if res.Error != nil {
		if strings.Contains(res.Error.Error(), "duplicate key value") {
			return models.User{}, http.StatusConflict, fmt.Errorf("user already exist")
		}
		return models.User{}, 500, fmt.Errorf("internal server error")
	}

	return user, 201, nil
}

func (ar *AuthRepo) CreateUserProfile(profile models.Profile) (int, error) {
	res := ar.db.Create(&profile)

	if res.Error != nil {
		if strings.Contains(res.Error.Error(), "duplicate key value") {
			return http.StatusConflict, fmt.Errorf("user profile already exist")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 201, nil	
}

func (ar *AuthRepo) CreateUserInterests(userInterests []models.UserInterests) (int, error) {
	res := ar.db.Create(&userInterests)
	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 201, nil	
}

func (ar *AuthRepo) GetUserByEmail(email string) (models.User, int, error) {
	var user models.User
	res := ar.db.First(&user, "email = ?", email)
	
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return user, 404, fmt.Errorf("user not found")
		}
		return user, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ar *AuthRepo) GetUserById(userId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.UserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.UserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ar *AuthRepo) UserExists(email string) bool {
	var user models.User
	res := ar.db.First(&user, "email = ?", email)
	
	//no user
	if res.Error == gorm.ErrRecordNotFound {
		return false
	}

	return true
}

func (ar *AuthRepo) UsernameExists(username string) bool {
	var existingUser models.Profile
	res := ar.db.First(&existingUser, "username = ?", username)

	//no user
	if res.Error == gorm.ErrRecordNotFound {
		return false
	}

	return true

}