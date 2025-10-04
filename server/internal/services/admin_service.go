package services

import (
	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
)

type AdminService interface {
	GetUsers() ([]models.UserResponse, int, error)
	GetUser(string) (models.UserResponse, int, error)
	VerifyUser(string) (int, error)
	UnVerifyUser(string) (int, error)
}

type AdminSvc struct {
	repo repositories.AdminRepository
}

func NewAdminService(repo repositories.AdminRepository) AdminService {
	return &AdminSvc{repo}
}

func (as *AdminSvc) GetUsers() ([]models.UserResponse, int, error) {
	return as.repo.GetUsers()
}

func (as *AdminSvc) GetUser(userId string) (models.UserResponse, int, error) {
	return as.repo.GetUser(userId)
}

func (as *AdminSvc) VerifyUser(userId string) (int, error) {
	//get user
	user, code, err := as.repo.GetUser(userId)
	if err != nil {
		return code, err
	}

	//check is user is already verified
	if user.Verified {
		return 200, nil
	}

	//verify if not
	return as.repo.UpdateUserVerification(userId, true)

	//notify user
}

func (as *AdminSvc) UnVerifyUser(userId string) (int, error) {
	//get user
	user, code, err := as.repo.GetUser(userId)
	if err != nil {
		return code, err
	}

	//check is user is already verified
	if !user.Verified {
		return 200, nil
	}

	//un-verify if not
	return as.repo.UpdateUserVerification(userId, false)

	//notify user
}