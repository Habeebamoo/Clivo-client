package server

import (
	"github.com/Habeebamoo/Clivo/server/internal/handlers"
	"github.com/Habeebamoo/Clivo/server/internal/middlewares"
	response "github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(authHandler handlers.AuthHandler, articleHandler handlers.ArticleHandler, userHandler handlers.UserHandler, adminHandler handlers.AdminHandler) *gin.Engine {
	r := gin.Default()

	//middlewares chain
	r.Use(middlewares.CORS())
	r.Use(middlewares.CustomRecovery())

	api := r.Group("/api")

	//health check
	api.GET("/health", func(c *gin.Context) {
		response.Success(c, 200, "All systems are working fine", nil)
	})

	//free routes (access anywhere)
	api.GET("/user/:username", userHandler.GetUser)
	api.GET("/user/:username/articles", userHandler.GetUserArticles)
	api.GET("/user/:username/:title", userHandler.GetUserArticle)
	api.GET("/user/:username/:title/comments", userHandler.GetArticleComments)
	api.GET("/comments/:id/replys", userHandler.GetCommentReplys)

	//authentication routes
	auth := api.Group("/auth")
	{
		auth.GET("/google", authHandler.GoogleLogin)
		auth.GET("/google/callback", authHandler.GoogleCallBack)
		auth.POST("/signin", middlewares.RequireAPIKey(), authHandler.SignIn)
	}

	//user routes
	user := api.Group("/user", middlewares.RequireAPIKey(), middlewares.AuthenticateUser())
	{
		user.GET("/me", userHandler.GetProfile)
		user.POST("/follow/:id", userHandler.FollowUser)
		user.POST("/unfollow/:id", userHandler.UnFollowUser)
		user.GET("/followers", userHandler.GetUserFollowers)
		user.GET("/following", userHandler.GetUsersFollowing)
		user.PATCH("/profile", userHandler.UpdateProfile)
	}

	//posts/articles routes
	article := api.Group("/article", middlewares.RequireAPIKey(), middlewares.AuthenticateUser())
	{
		article.POST("", articleHandler.CreateArticle)
		article.GET("", articleHandler.GetAllMyArticles)
		article.GET("/feed", articleHandler.GetUserFeed)
		article.GET("/fyp", articleHandler.GetUserFyp)
		article.DELETE("/:id", articleHandler.DeleteArticle)
		article.POST("/like", articleHandler.LikeArticle)
		article.GET("/:articleId/liked/:userId", articleHandler.HasLikedArticle)
		article.POST("/comment/:id", articleHandler.CommentArticle)
		article.POST("/comment/:id/reply", articleHandler.ReplyComment)
	}

	//admin routes
	admin := api.Group("/admin", middlewares.RequireAPIKey(), middlewares.VerifyAdmin())
	{
		admin.GET("/users", adminHandler.GetUsers)
		admin.GET("/users/:id", adminHandler.GetUser)
		admin.POST("/verify/:id", adminHandler.VerifyUser)
		admin.POST("/unverify/:id", adminHandler.UnVerifyUser)
		admin.POST("/restrict/:id", adminHandler.RestrictUser)
		admin.POST("/unrestrict/:id", adminHandler.UnRestrictUser)
		admin.GET("/:username/articles", adminHandler.GetArticlesByUsername)
		admin.DELETE("/article/:id", adminHandler.DeleteArticle)
	}

	return r
}