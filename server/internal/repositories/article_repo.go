package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type ArticleRepository interface {
	CreateArticle(models.Article) (int, error)
	CreateArticleSlug(string, string) (int, error)
	CreateArticleTags([]models.ArticleTags) (int, error)
	GetArticleById(string) (models.Article, int, error)
	GetArticles(string) ([]models.Article, int, error)
	GetArticleTags(string) ([]models.ArticleTags, error)
	GetUserFeed(string) ([]models.Article, int, error)
	GetPopularArticles() ([]models.Article, int, error)
	GetArticleAuthorById(string) (models.UserResponse, int, error)
	DeleteArticle(string) (int, error)
	IsLikedBy(models.Like) bool
	CreateLike(models.Like) (int, error)
	RemoveLike(models.Like) (int, error)
	CreateComment(models.Comment) (int, error)
	GetArticleLikes(string) (int, error)
}

type ArticleRepo struct {
	db *gorm.DB
}

func NewArticleRepository(db *gorm.DB) ArticleRepository {
	return &ArticleRepo{db: db}
}

func (ar *ArticleRepo) CreateArticle(article models.Article) (int, error) {
	//create article
	res := ar.db.Create(&article)
	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 201, nil
}

func (ar *ArticleRepo) CreateArticleSlug(articleId string, slug string) (int, error) {
	res := ar.db.Model(&models.Article{}).Where("article_id = ?", articleId).Update("slug", slug)
	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}
	
	return 201, nil
}

func (ar *ArticleRepo) CreateArticleTags(tags []models.ArticleTags) (int, error) {
	res := ar.db.Create(&tags)

	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}
	
	return 201, nil
}

func (ar *ArticleRepo) GetArticleById(articleId string) (models.Article, int, error) {
	var article models.Article
	res := ar.db.First(&article, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return article, 404, fmt.Errorf("article does not exists")
		}
		return article, 500, fmt.Errorf("internal server error")
	}

	return article, 200, nil
}

func (ar *ArticleRepo) GetArticles(userId string) ([]models.Article, int, error) {
	var articles []models.Article
	res := ar.db.Find(&articles, "author_id = ?", userId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articles, 200, nil
		}
		return articles, 500, fmt.Errorf("internal server error")
	}

	return articles, 200, nil
}

func (ar *ArticleRepo) GetArticleTags(articleId string) ([]models.ArticleTags, error) {
	var tags []models.ArticleTags
	res := ar.db.Find(&tags, "article_id = ?", articleId)

	if res.Error != nil {
		return tags, fmt.Errorf("internal server error")
	}

	return tags, nil
}

func (ar *ArticleRepo) GetUserFeed(userId string) ([]models.Article, int, error) {
	var articles []models.Article
	res := ar.db.Raw(`
		SELECT a.*
		FROM articles a
		WHERE a.author_id IN (
			SELECT following_id FROM follows WHERE follower_id = ?
			UNION
			SELECT follower_id FROM follows WHERE following_id = ?
		)
		ORDER BY a.created_at DESC
		LIMIT ?
		`, userId, userId, 20).
		Scan(&articles)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articles, 404, fmt.Errorf("no articles found")
		}
		return articles, 500, fmt.Errorf("internal server error")
	}

	return articles, 200, nil
}

func (ar *ArticleRepo) GetPopularArticles() ([]models.Article, int, error) {
	var articles []models.Article
	res := ar.db.Raw(`
		SELECT a.*
		FROM articles a
		WHERE a.author_id IN (
			SELECT user_id FROM users WHERE verified = ?
		)
		ORDER BY a.created_at DESC
		LIMIT ?
	`, true, 5).
	Scan(&articles)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articles, 404, fmt.Errorf("no articles found")
		}
		return articles, 500, fmt.Errorf("internal server error")
	}

	fmt.Println(articles)

	return articles, 200, nil
}

func (ar *ArticleRepo) GetArticleAuthorById(authorId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", authorId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.UserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.UserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ar *ArticleRepo) DeleteArticle(articleId string) (int, error) {
	res := ar.db.Model(&models.Article{}).Where("article_id = ?", articleId).Delete(models.Article{})
	if res.Error != nil {
		if res.RowsAffected == 0 {
			return 500, fmt.Errorf("failed to delete article")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (ar *ArticleRepo) IsLikedBy(likeReq models.Like) bool {
	var like models.Like
	res := ar.db.Where(&likeReq).First(&like)
	
	if res.Error == gorm.ErrRecordNotFound {
		return false
	}

	return true
}

func (ar *ArticleRepo) CreateLike(likeReq models.Like) (int, error) {
	res := ar.db.Create(&likeReq)
	if res.Error != nil {
		return 500, fmt.Errorf("failed to like post")
	}

	return 201, nil
}

func (ar *ArticleRepo) RemoveLike(likeReq models.Like) (int, error) {
	res := ar.db.Model(&models.Like{}).Where(&likeReq).Delete(models.Like{})
	if res.Error != nil {
		return 500, fmt.Errorf("failed to unlike post")
	}

	return 200, nil
}

func (ar *ArticleRepo) CreateComment(commentReq models.Comment) (int, error) {
	res := ar.db.Create(&commentReq)
	if res.Error != nil {
		return 500, fmt.Errorf("failed to comment post")
	}

	return 201, nil
}

func (ar *ArticleRepo) GetArticleLikes(articleId string) (int, error) {
	var likes int64
	res := ar.db.Model(&models.Like{}).Where("article_id = ?", articleId).Count(&likes)
	if res.Error != nil {
		if res.Error ==  gorm.ErrRecordNotFound {
			return 0, nil
		}
		return 0, fmt.Errorf("failed to get likes")
	}

	return int(likes), nil
}


