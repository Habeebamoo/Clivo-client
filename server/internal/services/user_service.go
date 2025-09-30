package services

import (
	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
)

type UserService interface {
	GetUser(string) (models.UserResponse, int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo}
}

func (us *UserSvc) GetUser(userId string) (models.UserResponse, int, error) {
	return us.repo.GetUser(userId)
}