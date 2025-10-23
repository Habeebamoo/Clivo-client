package services

import (
	"slices"
	"strings"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type UserService interface {
	GetUserProfile(string) (models.UserProfileResponse, int, error)
	FollowUser(string, string) (int, error)
	UnFollowUser(string, string) (int, error)
	GetUser(string) (models.SafeUserResponse, int, error)
	GetArticle(string) (models.SafeArticleResponse, int, error)
	GetArticles(string) ([]models.SafeArticleResponse, int, error)
	GetArticleComments(string) ([]models.CommentResponse, int, error)
	GetFollowers(string) ([]models.SafeUserResponse, int, error)
	GetFollowing(string) ([]models.SafeUserResponse, int, error)
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo}
}

func (as *UserSvc) GetUserProfile(userId string) (models.UserProfileResponse, int, error) {
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

func (us *UserSvc) FollowUser(followerId string, followingId string) (int, error) {
	follow := models.Follow{
		FollowerId: followerId,
		FollowingId: followingId,
	}

	//create follow
	code, err := us.repo.CreateFollow(follow)
	if err != nil {
		return code, err
	}

	//use transactions
	//update follower (user that followed) profile
	err = us.repo.IncrementFollows(follow.FollowerId, "following")
	if err != nil {
		return code, err
	}

	//update following (user that is been followed)
	err = us.repo.IncrementFollows(follow.FollowingId, "followers")
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

	code, err := us.repo.RemoveFollow(follow)
	if err != nil {
		return code, err
	}

	//use transactions
	//update follower (user that followed) profile
	err = us.repo.DecrementFollows(follow.FollowerId, "following")
	if err != nil {
		return code, err
	}

	//update following (user that is been followed)
	err = us.repo.DecrementFollows(follow.FollowingId, "followers")
	if err != nil {
		return code, err
	}

	return 200, nil
	//notify user following
}

func (us *UserSvc) GetUser(username string) (models.SafeUserResponse, int, error) {
	return us.repo.GetUserByUsername(username)
}

func (us *UserSvc) GetArticle(articleId string) (models.SafeArticleResponse, int, error) {
	//get article
	article, code, err := us.repo.GetArticleById(articleId)
	if err != nil {
		return models.SafeArticleResponse{}, code, err
	}

	//get article likes
	articleLikes, err := us.repo.GetArticleLikes(article.ArticleId)
	if err != nil {
		return models.SafeArticleResponse{}, 500, err
	}

	//get article tags
	articeTags, err := us.repo.GetArticleTags(article.ArticleId)
	if err != nil {
		return models.SafeArticleResponse{}, 500, err
	}

	var tags []string
	for _, articleTag := range articeTags {
		tags = append(tags, articleTag.Tag)
	}

	//get user
	author, code, err := us.repo.GetArticleAuthorById(article.AuthorId)
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
		Tags: tags,
		Likes: articleLikes,
		ReadTime: article.ReadTime,
		Slug: article.Slug,
		CreatedAt: utils.GetTimeAgo(article.CreatedAt),
	}

	return articleRespose, 200, nil
}

func (us *UserSvc) GetArticles(username string) ([]models.SafeArticleResponse, int, error) {
	//get articles
	articles, code, err := us.repo.GetArticlesByUsername(username)
	if err != nil {
		return []models.SafeArticleResponse{}, code, err
	}

	if len(articles) == 0 {
		return []models.SafeArticleResponse{}, 200, nil
	}

	//get user
	user, code, err := us.repo.GetUserByUsername(username)
	if err != nil {
		return []models.SafeArticleResponse{}, code, err
	}

	//build response
	var userArticles []models.SafeArticleResponse

	for _, article := range articles {
		//get likes
		likes, err := us.repo.GetArticleLikes(article.ArticleId)
		if err != nil {
			return []models.SafeArticleResponse{}, 500, err
		}

		createdAt := utils.GetTimeAgo(article.CreatedAt)

		//get tags
		articeTags, err := us.repo.GetArticleTags(article.ArticleId)
		if err != nil {
			return []models.SafeArticleResponse{}, 500, err
		}

		var tags []string
		for _, articleTag := range articeTags {
			tags = append(tags, articleTag.Tag)
		}

		safeArticle := models.SafeArticleResponse{
			ArticleId: article.ArticleId,
			AuthorPicture: user.Picture,
			AuthorFullname: user.Name,
			AuthorProfileUrl: user.ProfileUrl,
			AuthorVerified: user.Verified,
			Title: article.Title,
			Content: article.Content,
			Picture: article.Picture,
			Tags: tags,
			Likes: likes,
			ReadTime: article.ReadTime,
			Slug: article.Slug,
			CreatedAt: createdAt,
		}

		userArticles = append(userArticles, safeArticle)
	}

	return userArticles, 200, nil
}

func (as *UserSvc) GetArticleComments(articleId string) ([]models.CommentResponse, int, error) {
	//get comments
	comments, code, err := as.repo.GetArticleComments(articleId)
	if err != nil {
		return []models.CommentResponse{}, code, err
	}

	//format comments
	commentsReponse := []models.CommentResponse{}

	for _, c := range comments {
		user, code, err := as.repo.GetUserById(c.CommenterUserId)
		if err != nil {
			return commentsReponse, code, err
		}

		comment := models.CommentResponse{
			Content: c.Content,
			ArticleId: articleId, 
			Name: user.Name,
			Username: user.Username,
			Verified: user.Verified,
			Picture: user.Picture,
		}

		commentsReponse = append(commentsReponse, comment)
	}

	//sort by latest
	slices.Reverse(commentsReponse)

	return commentsReponse, 200, nil
}

func (us *UserSvc) GetFollowers(userId string) ([]models.SafeUserResponse, int, error) {
	followersId, code, err := us.repo.GetUserFollowersId(userId)
	if err != nil {
		return []models.SafeUserResponse{}, code, err
	}

	var followers []models.SafeUserResponse

	for _, followerId := range followersId {
		follower, code, err := us.repo.GetUserById(followerId)
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
	usersFollowingId, code, err := us.repo.GetUsersFollowingId(userId)
	if err != nil {
		return []models.SafeUserResponse{}, code, err
	}

	var usersFollowing []models.SafeUserResponse

	for _, userfollowingId := range usersFollowingId {
		userFollowing, code, err := us.repo.GetUserById(userfollowingId)
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