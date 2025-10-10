package services

import (
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
}

type UserSvc struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &UserSvc{repo}
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

	//format article tags
	articleTagsFormated := strings.Split(article.Tags, ", ")

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