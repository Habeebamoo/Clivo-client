package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser(string) (models.UserResponse, int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db}
}

func (ur *UserRepo) GetUser(userId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ur.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, p.username, p.bio, p.picture, p.interests, p.profile_link, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.UserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.UserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

