package services

import (
	"fmt"
	"slices"
	"strings"
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/config"
	"github.com/Habeebamoo/Clivo/server/internal/models"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/pkg/utils"
)

type ArticleService interface {
	CreateArticle(models.ArticleRequest, string) (int, error)
	GetArticle(string) (models.ArticleResponse, int, error)
	GetMyArticles(string) ([]models.ArticleResponse, int, error)
	FetchArticles() ([]models.SafeArticleResponse, int, error)
	DeleteArticle(string, string) (int, error)
	LikeArticle(models.Like) (int, error)
	CommentArticle(models.Comment) (int, error)
	GetArticleComments(string) ([]models.CommentResponse, int, error)
}

type ArticleSvc struct {
	articleRepo repositories.ArticleRepository
	authRepo repositories.AuthRepository
}

func NewArticleService(articleRepo repositories.ArticleRepository, authRepo repositories.AuthRepository) ArticleService {
	return &ArticleSvc{articleRepo: articleRepo, authRepo: authRepo}
}

func (as *ArticleSvc) CreateArticle(articleReq models.ArticleRequest, userId string) (int, error) {
	//calculate read time
  readTime := ""

	//upload article image
	articleImage := ""

	//userId is currently email

	//assign article
	article := models.Article{
		ArticleId: utils.GenerateRandomId(),
		AuthorId: userId,
		Title: articleReq.Title,
		Content: articleReq.Content,
		CreatedAt: time.Now(),
		ReadTime: readTime,
		Slug: "",
		Picture: articleImage,
	}

	//create article
	code, err := as.articleRepo.CreateArticle(article)
	if err != nil {
		return code, err
	}

	//updated slug
	clientOrigin, err := config.Get("CLIENT_URL")
	if err != nil {
		return 500, err
	}

	artcileSlug := fmt.Sprintf("%s/posts/%s", clientOrigin, article.ArticleId)

	code, err = as.articleRepo.CreateArticleSlug(article.ArticleId, artcileSlug)
	if err != nil {
		return code, err
	}

	//create article tags
	tags := strings.Join(articleReq.Tags, ", ")

	articleTags := models.Tag{
		ArticleId: article.ArticleId,
		Tag: tags,
	}

	return as.articleRepo.CreateArticleTags(articleTags)

	//notify followers here
}

func (as *ArticleSvc) GetArticle(id string) (models.ArticleResponse, int, error) {
	//get article
	article, code, err := as.articleRepo.GetArticleById(id)
	if err != nil {
		return models.ArticleResponse{}, code, err
	}

	//get article likes
	articleLikes, err := as.articleRepo.GetArticleLikes(article.ArticleId)
	if err != nil {
		return models.ArticleResponse{}, 500, err
	}

	//get article tags
	articleTags, code, err := as.articleRepo.GetArticleTags(id)
	if err != nil {
		return models.ArticleResponse{}, code, err
	}

	articleTagsFormated := strings.Split(articleTags.Tag, ", ")

	//get user
	author, code, err := as.articleRepo.GetArticleAuthorById(article.AuthorId)
	if err != nil {
		return models.ArticleResponse{}, code, err
	}

	//build response
	articleRespose := models.ArticleResponse{
		ArticleId: article.ArticleId,
		AuthorId: article.AuthorId,
		AuthorPicture: author.Picture,
		AuthorFullname: author.Name,
		AuthorVerified: author.Verified,
		Title: article.Title,
		Content: article.Content,
		Picture: article.Picture,
		Tags: articleTagsFormated,
		Likes: articleLikes,
		ReadTime: article.ReadTime,
		Slug: article.Slug,
		CreatedAt: article.CreatedAt,
	}

	return articleRespose, 200, nil
}

func (as *ArticleSvc) GetMyArticles(userId string) ([]models.ArticleResponse, int, error) {
	//get articles
	articles, code, err := as.articleRepo.GetArticles(userId)
	if err != nil {
		return []models.ArticleResponse{}, code, err
	}

	//call service to format all articles
	userArticles := []models.ArticleResponse{}

	for _, article := range articles {
		formatedArticle, code, err := as.GetArticle(article.ArticleId)
		if err != nil {
			return []models.ArticleResponse{}, code, err
		}

		userArticles = append(userArticles, formatedArticle)
	}

	return userArticles, 200, nil
}

func (as *ArticleSvc) FetchArticles() ([]models.SafeArticleResponse, int, error) {
	//get articles
	articles, code, err := as.articleRepo.FetchArticles()
	if err != nil {
		return []models.SafeArticleResponse{}, code, err
	}

	//call service to format all articles
	articlesRes := []models.SafeArticleResponse{}

	for _, article := range articles {
		formatedArticle, code, err := as.GetArticle(article.ArticleId)
		if err != nil {
			return []models.SafeArticleResponse{}, code, err
		}

		//send an article (excluding author userId)
		safeFormatedArticle := models.SafeArticleResponse{
			ArticleId: formatedArticle.ArticleId,
			AuthorPicture: formatedArticle.AuthorPicture,
			AuthorFullname: formatedArticle.AuthorFullname,
			AuthorVerified: formatedArticle.AuthorVerified,
			Title: formatedArticle.Title,
			Content: formatedArticle.Content,
			Picture: formatedArticle.Picture,
			Tags: formatedArticle.Tags,
			Likes: formatedArticle.Likes,
			ReadTime: formatedArticle.ReadTime,
			Slug: article.Slug,
			CreatedAt: formatedArticle.CreatedAt,
		}

		articlesRes = append(articlesRes, safeFormatedArticle)
	}

	//sort by recent
	slices.Reverse(articlesRes)

	return articlesRes, 200, nil
}

func (as *ArticleSvc) DeleteArticle(articleId string, userId string) (int, error) {
	//get article
	_, code, err := as.GetArticle(articleId)
	if err != nil {
		return code, err
	}

	// //extra validation to make sure only the author can delete
	// if article.AuthorId != userId {
	// 	return 401, fmt.Errorf("Unauthorized Access")
	// }
	// //might not be needed :)

	return as.articleRepo.DeleteArticle(articleId)
}

func (as *ArticleSvc) LikeArticle(likeReq models.Like) (int, error) {
	//checkis user ha already liked
	alreadyLiked := as.articleRepo.IsLikedBy(likeReq)

	if alreadyLiked {
		return as.articleRepo.RemoveLike(likeReq)
	}

	return as.articleRepo.CreateLike(likeReq)
}

func (as *ArticleSvc) CommentArticle(commentReq models.Comment) (int, error) {
	return as.articleRepo.CreateComment(commentReq)
}

func (as *ArticleSvc) GetArticleComments(articleId string) ([]models.CommentResponse, int, error) {
	//get comments
	comments, code, err := as.articleRepo.GetArticleComments(articleId)
	if err != nil {
		return []models.CommentResponse{}, code, err
	}

	//format comments
	commentsReponse := []models.CommentResponse{}

	for _, c := range comments {
		user, code, err := as.authRepo.GetUserById(c.CommenterUserId)
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

		commentsReponse =append(commentsReponse, comment)
	}

	//sort by latest
	slices.Reverse(commentsReponse)

	return commentsReponse, 200, nil
}