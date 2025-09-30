package server

import (
	"github.com/Habeebamoo/Clivo/server/internal/handlers"
	"github.com/Habeebamoo/Clivo/server/internal/middlewares"
	response "github.com/Habeebamoo/Clivo/server/pkg/utils"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(authHandler handlers.AuthHandler, articleHandler handlers.ArticleHandler, userHandler handlers.UserHandler) *gin.Engine {
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
		article.GET("", articleHandler.GetMyArticles)
		article.GET("/:id", articleHandler.GetArticle)
		article.GET("/all", articleHandler.FetchArticles)
	}

	return r
}