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
	GetUserByEmail(email string) (models.User, int, error)
	UserExists(email string) bool
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

func (ar *AuthRepo) UserExists(email string) bool {
	var user models.User
	res := ar.db.First(&user, "email = ?", email)
	
	//no user
	if res.Error == gorm.ErrRecordNotFound {
		return false
	}

	return true
}