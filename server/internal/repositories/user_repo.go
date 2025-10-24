package repositories

import (
	"fmt"

	"github.com/Habeebamoo/Clivo/server/internal/models"
	"gorm.io/gorm"
)

type UserRepository interface {
	GetUserById(userId string) (models.UserResponse, int, error)
	CreateFollow(models.Follow) (int, error)
	RemoveFollow(models.Follow) (int, error)
	IncrementFollows(string, string) error
	DecrementFollows(string, string) error
	GetUserFollowersId(string) ([]string, int, error)
	GetUsersFollowingId(string) ([]string, int, error)
	GetUserByUsername(string) (models.SafeUserResponse, int, error)
	GetArticlesByUsername(string) ([]models.Article, int, error)
	GetArticleById(string) (models.Article, int, error)
	GetArticleBySlug(string, string) (models.Article, int, error)
	GetArticleAuthorById(string) (models.SafeUserResponse, int, error)
	GetArticleAuthorIdByUsername(string) (string, int, error)
	GetArticleLikes(string) (int, error)
	GetArticleTags(string) ([]models.ArticleTags, error)
	GetArticleComments(string) ([]models.Comment, int, error)
}

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &UserRepo{db}
}

func (ar *UserRepo) GetUserById(userId string) (models.UserResponse, int, error) {
	var user models.UserResponse
	res := ar.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.UserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.UserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ur *UserRepo) CreateFollow(followReq models.Follow) (int, error) {
	res := ur.db.Create(&followReq)
	if res.Error != nil {
		return 500, fmt.Errorf("internal server error")
	}

	return 201, nil
}

func (ur *UserRepo) RemoveFollow(followReq models.Follow) (int, error) {
	res := ur.db.Model(&models.Follow{}).Where(&followReq).Delete(models.Follow{})
	if res.Error != nil {
		if res.RowsAffected == 0 {
			return 500, fmt.Errorf("failed to unfollow user")
		}
		return 500, fmt.Errorf("internal server error")
	}

	return 200, nil
}

func (ur *UserRepo) IncrementFollows(userId string, column string) error {
	res := ur.db.Model(&models.Profile{}).
							Where("user_id = ?", userId).
							Update(column, gorm.Expr(fmt.Sprintf("%s + ?", column), 1))

	if res.Error != nil {
		if res.RowsAffected == 0 {
			return fmt.Errorf("failed to updated profile")
		}
		return fmt.Errorf("internal server error")
	}

	return nil
}

func (ur *UserRepo) DecrementFollows(userId string, column string) error {
	res := ur.db.Model(&models.Profile{}).
							Where("user_id = ?", userId).
							Update(column, gorm.Expr(fmt.Sprintf("%s - ?", column), 1))

	if res.Error != nil {
		if res.RowsAffected == 0 {
			return fmt.Errorf("failed to updated profile")
		}
		return fmt.Errorf("internal server error")
	}
	
	return nil
}

func (ur *UserRepo) GetUserFollowersId(userId string) ([]string, int, error) {
	var followersId []string
	res := ur.db.Raw(`SELECT follower_id FROM follows WHERE following_id = ?`, userId).Scan(&followersId)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return followersId, 404, nil
		}
		return followersId, 500, fmt.Errorf("internal server error")
	}

	return followersId, 200, nil
}

func (ur *UserRepo) GetUsersFollowingId(userId string) ([]string, int, error) {
	var followingId []string
	res := ur.db.Raw(`SELECT following_id FROM follows WHERE follower_id = ?`, userId).Scan(&followingId)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return followingId, 404, nil
		}
		return followingId, 500, fmt.Errorf("internal server error")
	}

	return followingId, 200, nil
}

func (ur *UserRepo) GetUserByUsername(username string) (models.SafeUserResponse, int, error) {
	//get userId
	var userProfile models.Profile
	res := ur.db.First(&userProfile, "username = ?", username)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	var user models.SafeUserResponse
	res = ur.db.Table("users u").
				Select("u.name, u.verified, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", userProfile.UserId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("user does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ur *UserRepo) GetArticlesByUsername(username string) ([]models.Article, int, error) {
	//get user
	var user models.UserResponse
	res := ur.db.Table("users u").
				Select("u.user_id, u.name, u.email, u.role, u.verified, u.is_banned, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers, u.created_at").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("p.username = ?", username).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return []models.Article{}, 404, fmt.Errorf("user not found")
		}
		return []models.Article{}, 500, fmt.Errorf("internal server error")
	}

	//get articles
	var articles []models.Article
	res = ur.db.Find(&articles, "author_id = ?", user.UserId)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return articles, 200, nil
		}
		return articles, 500, fmt.Errorf("internal server error")
	}

	return articles, 200, nil
}

func (ur *UserRepo) GetArticleById(articleId string) (models.Article, int, error) {
	var article models.Article
	res := ur.db.First(&article, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return article, 404, fmt.Errorf("article does not exists")
		}
		return article, 500, fmt.Errorf("internal server error")
	}

	return article, 200, nil
}

func (ur *UserRepo) GetArticleBySlug(authorId, slug string) (models.Article, int, error) {
	var article models.Article
	res := ur.db.Where(&models.Article{AuthorId: authorId, Slug: slug}).First(&article)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return article, 404, fmt.Errorf("article does not exists")
		}
		return article, 500, fmt.Errorf("internal server error")
	}

	return article, 200, nil
}

func (ur *UserRepo) GetArticleAuthorById(authorId string) (models.SafeUserResponse, int, error) {
	var user models.SafeUserResponse
	res := ur.db.Table("users u").
				Select("u.name, u.verified, p.username, p.bio, p.picture, p.profile_url, p.website, p.following, p.followers").
				Joins("JOIN profiles p ON u.user_id = p.user_id").
				Where("u.user_id = ?", authorId).
				Scan(&user)

	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return models.SafeUserResponse{}, 404, fmt.Errorf("author does not exists")
		}
		return models.SafeUserResponse{}, 500, fmt.Errorf("internal server error")
	}

	return user, 200, nil
}

func (ur *UserRepo) GetArticleAuthorIdByUsername(username string) (string, int, error) {
	var profile models.Profile
	res := ur.db.Model(&models.Profile{}).Where("username = ?", username).First(&profile)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return "", 404, fmt.Errorf("user not found")
		}
		return "", 500, fmt.Errorf("internal server error")
	}

	return profile.UserId, 200, nil
}

func (ur *UserRepo) GetArticleLikes(articleId string) (int, error) {
	var likes int64
	res := ur.db.Model(&models.Like{}).Where("article_id = ?", articleId).Count(&likes)
	if res.Error != nil {
		if res.Error ==  gorm.ErrRecordNotFound {
			return 0, nil
		}
		return 0, fmt.Errorf("failed to get likes")
	}

	return int(likes), nil
}

func (ur *UserRepo) GetArticleTags(articleId string) ([]models.ArticleTags, error) {
	var tags []models.ArticleTags
	res := ur.db.Find(&tags, "article_id = ?", articleId)

	if res.Error != nil {
		return tags, fmt.Errorf("internal server error")
	}

	return tags, nil
}

func (ur *UserRepo) GetArticleComments(articleId string) ([]models.Comment, int, error) {
	var comments []models.Comment
	res := ur.db.Find(&comments, "article_id = ?", articleId)
	if res.Error != nil {
		if res.Error == gorm.ErrRecordNotFound {
			return []models.Comment{}, 200, nil
		}
		return []models.Comment{}, 500, fmt.Errorf("internal server error")
	}

	return comments, 200, nil
}


