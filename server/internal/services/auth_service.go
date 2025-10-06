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
	GetUserProfile(string) (models.UserProfileResponse, int, error)
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
		IsBanned: false,
		CreatedAt: time.Now(),
	}

	createdUser, statusCode, err := as.repo.CreateUser(user)
	if err != nil {
		return "", statusCode, err
	}

	//create profile
	demoUserBio := fmt.Sprintf("Hey, I am %s", createdUser.Name);
	userinterests :=	strings.Join(userReq.Interets, ", ")

	//calculate and get unique username for user
	username := utils.GenerateUniqueUsername(utils.GetUsernameFromEmail(userReq.Email), as.repo.UsernameExists) 

	//get user profile
	profile := utils.GetUserProfile(username)

	userProfile := models.Profile{
		UserId: createdUser.UserId,
		Username: username,
		Bio: demoUserBio,
		Picture: userReq.Picture,
		Interests: userinterests,
		ProfileUrl: profile,
		Website: "",
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

func (as *AuthSvc) GetUserProfile(userId string) (models.UserProfileResponse, int, error) {
	//get user
	user, code, err := as.repo.GetUserById(userId)
	if err != nil {
		return models.UserProfileResponse{}, code, err
	}

	//build response
	userInterests := strings.Split(user.Interests, ", ")

	//calculate time
	createdAt := utils.GetTimeAgo(user.CreatedAt)

	userProfile := models.UserProfileResponse{
		UserId: user.UserId,
		Name: user.Name,
		Email: user.Email,
		Role: user.Role,
		Verified: user.Verified,
		IsBanned: user.IsBanned,
		Bio: user.Bio,
		Picture: user.Picture,
		Interests: userInterests,
		ProfileUrl: user.ProfileUrl,
		Website: user.Website,
		Following: user.Following,
		Followers: user.Following,
		CreatedAt: createdAt,
	}

	return userProfile, 200, nil
}