package services

import (
	"fmt"
	"strings"
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type AuthService interface {
	SignInUser(models.UserRequest) (string, int, error)
}

type AuthSvc struct {
	repo repositories.AuthRepository
}

func NewAuthService(repo repositories.AuthRepository) AuthService {
	return &AuthSvc{repo}
}

func (as *AuthSvc) SignInUser(userReq models.UserRequest) (string, int, error) {
	//checks if user already exists and return jwt token
	exists := as.repo.UserExists(userReq.Email) 

	if exists {
		//get user
		foundUser, code, err := as.repo.GetUserByEmail(userReq.Email)
		if err != nil {
			return "", code, err
		}

		//sign jwt
		token, err := utils.SignToken(models.TokenPayload{ UserId: foundUser.UserId, Role: foundUser.Role })
		if err != nil {
			return "", 401, err
		}

		return token, 200, nil
	}

	//user was not found
	//now creating userReq
	user := models.User{
		UserId: utils.GenerateRandomId(),
		Name: userReq.Name,
		Email: userReq.Email,
		Role: "user",
		Verified: false,
		CreatedAt: time.Now(),
	}

	createdUser, statusCode, err := as.repo.CreateUser(user)
	if err != nil {
		return "", statusCode, err
	}

	//create profile
	demoUserBio := fmt.Sprintf("Hey, I am %s", createdUser.Name);
	username := fmt.Sprintf("@_%s", userReq.Name)
	userinterests :=	strings.Join(userReq.Interets, ", ")

	userProfile := models.Profile{
		UserId: createdUser.UserId,
		Username: username,
		Bio: demoUserBio,
		Picture: userReq.Picture,
		Interests: userinterests,
		ProfileLink: "clivo",
		Following: 0,
		Followers: 0,
	}

	//call repo
	code, err := as.repo.CreateUserProfile(userProfile)
	if err != nil {
		return "", code, err
	}

	//sign jwt token
	token, err := utils.SignToken(models.TokenPayload{ UserId: createdUser.UserId, Role: createdUser.Role })
	if err != nil {
		return "", 401, err
	}

	return token, 201, nil

	//send email notification to admin
}