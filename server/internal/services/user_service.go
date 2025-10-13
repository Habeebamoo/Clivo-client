package services

import (
	"slices"
	"strings"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type UserService interface {
	FollowUser(string, string) (int, error)
	UnFollowUser(string, string) (int, error)
	GetUser(string) (models.SafeUserResponse, int, error)
	GetArticle(string) (models.SafeArticleResponse, int, error)
	GetArticles(string) ([]models.SafeArticleResponse, int, error)
	GetFollowers(string) ([]models.SafeUserResponse, int, error)
	GetFollowing(string) ([]models.SafeUserResponse, int, error)
}

type UserSvc struct {
	userRepo repositories.UserRepository
	articleRepo repositories.ArticleRepository
}

func NewUserService(userRepo repositories.UserRepository, articleRepo repositories.ArticleRepository) UserService {
	return &UserSvc{userRepo, articleRepo}
}

func (us *UserSvc) FollowUser(followerId string, followingId string) (int, error) {
	follow := models.Follow{
		FollowerId: followerId,
		FollowingId: followingId,
	}

	//create follow
	code, err := us.userRepo.CreateFollow(follow)
	if err != nil {
		return code, err
	}

	//use transactions
	//update follower (user that followed) profile
	err = us.userRepo.IncrementFollows(follow.FollowerId, "following")
	if err != nil {
		return code, err
	}

	//update following (user that is been followed)
	err = us.userRepo.IncrementFollows(follow.FollowingId, "followers")
	if err != nil {
		return code, err
	}

	return 201, nil
	//notify user following
}

func (us *UserSvc) UnFollowUser(followerId string, followingId string) (int, error) {
	follow := models.Follow{
		FollowerId: followerId,
		FollowingId: followingId,
	}

	code, err := us.userRepo.RemoveFollow(follow)
	if err != nil {
		return code, err
	}

	//use transactions
	//update follower (user that followed) profile
	err = us.userRepo.DecrementFollows(follow.FollowerId, "following")
	if err != nil {
		return code, err
	}

	//update following (user that is been followed)
	err = us.userRepo.DecrementFollows(follow.FollowingId, "followers")
	if err != nil {
		return code, err
	}

	return 200, nil
	//notify user following
}

func (us *UserSvc) GetUser(username string) (models.SafeUserResponse, int, error) {
	return us.userRepo.GetUserByUsername(username)
}

func (us *UserSvc) GetArticle(articleId string) (models.SafeArticleResponse, int, error) {
	//get article
	article, code, err := us.userRepo.GetArticleById(articleId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	//get article likes
	articleLikes, err := us.userRepo.GetArticleLikes(article.ArticleId)
	if err != nil {
		return models.SafeArticleResponse{}, 500, err
	}

	//format article tags
	articleTagsFormated := strings.Split(article.Tags, ", ")

	//get user
	author, code, err := us.userRepo.GetArticleAuthorById(article.AuthorId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	//build response
	articleRespose := models.SafeArticleResponse{
		ArticleId: article.ArticleId,
		AuthorPicture: author.Picture,
		AuthorFullname: author.Name,
		AuthorProfileUrl: author.ProfileUrl,
		AuthorVerified: author.Verified,
		Title: article.Title,
		Content: article.Content,
		Picture: article.Picture,
		Tags: articleTagsFormated,
		Likes: articleLikes,
		ReadTime: article.ReadTime,
		Slug: article.Slug,
		CreatedAt: utils.GetTimeAgo(article.CreatedAt),
	}

	return articleRespose, 200, nil
}

func (us *UserSvc) GetArticles(username string) ([]models.SafeArticleResponse, int, error) {
	//get articles
	articles, code, err := us.userRepo.GetArticlesByUsername(username)
	if err != nil {
		return []models.SafeArticleResponse{}, code, err
	}

	if len(articles) == 0 {
		return []models.SafeArticleResponse{}, 200, nil
	}

	//get user
	user, code, err := us.userRepo.GetUserByUsername(username)
	if err != nil {
		return []models.SafeArticleResponse{}, code, err
	}

	//build response
	var userArticles []models.SafeArticleResponse

	for _, article := range articles {
		//get likes
		likes, err := us.userRepo.GetArticleLikes(article.ArticleId)
		if err != nil {
			return []models.SafeArticleResponse{}, 500, err
		}

		createdAt := utils.GetTimeAgo(article.CreatedAt)

		articleTags := strings.Split(article.Tags, ", ")

		safeArticle := models.SafeArticleResponse{
			ArticleId: article.ArticleId,
			AuthorPicture: user.Picture,
			AuthorFullname: user.Name,
			AuthorProfileUrl: user.ProfileUrl,
			AuthorVerified: user.Verified,
			Title: article.Title,
			Content: article.Content,
			Picture: article.Picture,
			Tags: articleTags,
			Likes: likes,
			ReadTime: article.ReadTime,
			Slug: article.Slug,
			CreatedAt: createdAt,
		}

		userArticles = append(userArticles, safeArticle)
	}

	return userArticles, 200, nil
}

func (us *UserSvc) GetFollowers(userId string) ([]models.SafeUserResponse, int, error) {
	followersId, code, err := us.userRepo.GetUserFollowersId(userId)
	if err != nil {
		return []models.SafeUserResponse{}, code, err
	}

	var followers []models.SafeUserResponse

	for _, followerId := range followersId {
		follower, code, err := us.articleRepo.GetArticleAuthorById(followerId)
		//error check
		if err != nil {
			return followers, code, err
		}

		//build response
		user := models.SafeUserResponse{
			Name: follower.Name,
			Verified: follower.Verified,
			Username: follower.Username,
			Bio: follower.Bio,
			Picture: follower.Picture,
			ProfileUrl: follower.ProfileUrl,
			Website: follower.Website,
			Following: follower.Following,
			Followers: follower.Followers,
		}

		followers = append(followers, user)
	}

	//sort by recent
	slices.Reverse(followers)

	return followers, 200, nil
}

func (us *UserSvc) GetFollowing(userId string) ([]models.SafeUserResponse, int, error) {
	usersFollowingId, code, err := us.userRepo.GetUsersFollowingId(userId)
	if err != nil {
		return []models.SafeUserResponse{}, code, err
	}

	var usersFollowing []models.SafeUserResponse

	for _, userfollowingId := range usersFollowingId {
		userFollowing, code, err := us.articleRepo.GetArticleAuthorById(userfollowingId)
		//error check
		if err != nil {
			return usersFollowing, code, err
		}

		//build response
		user := models.SafeUserResponse{
			Name: userFollowing.Name,
			Verified: userFollowing.Verified,
			Username: userFollowing.Username,
			Bio: userFollowing.Bio,
			Picture: userFollowing.Picture,
			ProfileUrl: userFollowing.ProfileUrl,
			Website: userFollowing.Website,
			Following: userFollowing.Following,
			Followers: userFollowing.Followers,
		}

		usersFollowing = append(usersFollowing, user)
	}

	//sort by recent
	slices.Reverse(usersFollowing)

	return usersFollowing, 200, nil
}