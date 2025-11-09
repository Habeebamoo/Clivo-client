package middlewares

import (
	"log"

	"github.com/Habeebamoo/Clivo/server/internal/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	frontendUrl, err := config.Get("CLIENT_URL")
	if err != nil {
		log.Fatal(err)
	} 

	return cors.New(cors.Config{
		AllowOrigins: []string{frontendUrl},
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "X-API-KEY"},
		AllowCredentials: true,
		MaxAge: 3600,
	})
}