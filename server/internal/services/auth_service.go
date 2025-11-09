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
	SignUpUser(models.UserRequest) (string, int, error)
	SignInUser(models.UserRequest) (string, int, error)
	UserExists(string) (bool)
}

type AuthSvc struct {
	repo repositories.AuthRepository
}

func NewAuthService(repo repositories.AuthRepository) AuthService {
	return &AuthSvc{repo}
}

func (as *AuthSvc) SignUpUser(userReq models.UserRequest) (string, int, error) {
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

	//create user interests
	var userInterests []models.UserInterests

	for _, interest := range userReq.Interets {
		userInterests = append(userInterests, models.UserInterests{UserId: createdUser.UserId, Tag: interest})
	}

	for _, ui := range userReq.Interets {
		fmt.Println(ui)
	}

	code, err := as.repo.CreateUserInterests(userInterests)
	if err != nil {
		return "", code, err
	}

	//create profile
	demoUserBio := fmt.Sprintf("Hey, I am %s", createdUser.Name);

	//calculate and get unique username for user
	username := utils.GenerateUniqueUsername(utils.GetUsernameFromEmail(userReq.Email), as.repo.UsernameExists) 

	//get user profile
	profile := utils.GetUserProfile(username)

	userProfile := models.Profile{
		UserId: createdUser.UserId,
		Username: username,
		Bio: demoUserBio,
		Picture: userReq.Picture,
		ProfileUrl: profile,
		Website: "",
		Following: 0,
		Followers: 0,
	}

	//call repo
	code, err = as.repo.CreateUserProfile(userProfile)
	if err != nil {
		return "", code, err
	}

	//sign jwt token
	token, err := utils.SignToken(models.TokenPayload{ UserId: createdUser.UserId, Role: createdUser.Role })
	if err != nil {
		return "", 401, err
	}

	//send email notification to both admin and user
	go func() {
		NewEmailService().SendWelcomeEmail(user.Name, user.Email, username)
		NewEmailService().SendWelcomeEmailToAdmin(user.Name, user.Email, username, strings.Join(userReq.Interets, ", "))
	}()

	return token, 201, nil
}

func (as *AuthSvc) SignInUser(userReq models.UserRequest) (string, int, error) {
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

func (as *AuthSvc) UserExists(email string) bool {
	exists := as.repo.UserExists(email)

	if exists {
		return true
	} else {
		return false
	}
}