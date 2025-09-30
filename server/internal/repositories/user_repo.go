package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUser(string) (models.SafeUserResponse, int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db}
}

func (ur *UserRepo) GetUser(userId string) (models.SafeUserResponse, int, error) {
	var user models.SafeUserResponse
	res := ur.db.Table("users u").
				Select("u.name, u.verified, p.username, p.bio, p.picture, p.profile_link, p.following, p.followers").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

