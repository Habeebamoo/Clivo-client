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
	r.Use(middlewares.RequireAPIKey())
	r.Use(middlewares.CustomRecovery())

	api := r.Group("/api")

	//health check
	api.GET("/health", func(c *gin.Context) {
		response.Success(c, 200, "All systems are working fine", nil)
	})

	//free routes (access anywhere)
	api.GET("/user/:username", userHandler.GetUser)
	api.GET("/posts/:id", userHandler.GetUserArticle)

	//authentication routes
	auth := api.Group("/auth")
	{
		auth.GET("/google", authHandler.GoogleLogin)
		auth.GET("/google/callback", authHandler.GoogleCallBack)
		auth.POST("/login", authHandler.SignIn)
	}

	//posts/articles routes
	article := api.Group("/article", middlewares.AuthenticateUser())
	{
		article.POST("", articleHandler.CreateArticle)
		article.GET("", articleHandler.GetAllMyArticles)
		article.GET("/all", articleHandler.FetchArticles)
		article.DELETE("/:id", articleHandler.DeleteArticle)
		article.POST("/like/:id", articleHandler.LikeArticle)
		article.POST("/comment/:id", articleHandler.CommentArticle)
		article.GET("/:id/comments", articleHandler.GetArticleComments)
	}

	//admin routes
	admin := api.Group("/admin", middlewares.VerifyAdmin())
	{
		admin.GET("/users", adminHandler.GetUsers)
		admin.GET("/users/:id", adminHandler.GetUser)
		admin.POST("/verify/:id", adminHandler.VerifyUser)
		admin.POST("/unverify/:id", adminHandler.UnVerifyUser)
		admin.POST("/restrict/:id", adminHandler.RestrictUser)
		admin.POST("/unrestrict/:id", adminHandler.UnRestrictUser)
		admin.DELETE("/article/:id", adminHandler.DeleteArticle)
	}

	return r
}