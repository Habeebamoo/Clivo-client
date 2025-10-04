package server

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Habeebamoo/Clivo/server/internal/config"
	"github.com/Habeebamoo/Clivo/server/internal/database"
	"github.com/Habeebamoo/Clivo/server/internal/handlers"
	"github.com/Habeebamoo/Clivo/server/internal/repositories"
	"github.com/Habeebamoo/Clivo/server/internal/services"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ConnectDB() (*gorm.DB) {
	//init database
	db, err := database.Initialize()
	if err != nil {
		log.Fatal(err)
	}

	return db
}

func ConfigureApp(db *gorm.DB) *gin.Engine {
	//initialized repositories
	authRepo := repositories.NewAuthRepository(db)
	articleRepo := repositories.NewArticleRepository(db)
	userRepo := repositories.NewUserRepository(db)
	adminRepo := repositories.NewAdminRepository(db)

	//initialized services
	authService := services.NewAuthService(authRepo)
	articleService := services.NewArticleService(articleRepo, authRepo)
	userService := services.NewUserService(userRepo)
	adminService := services.NewAdminService(adminRepo)

	//initialized handlers
	authHandler := handlers.NewAuthHandler(authService)
	articleHandler := handlers.NewArticleHandler(articleService)
	userHandler := handlers.NewUserHandler(userService)
	adminHandler := handlers.NewAdminHandler(adminService)

	//initialized routes
	return SetupRoutes(authHandler, articleHandler, userHandler, adminHandler)
}

func Run(router *gin.Engine) {
	PORT, _ := config.Get("PORT")
	if PORT == "" {
		PORT = "8080"
	}

	//router
	srv := &http.Server{
		Addr: ":"+PORT,
		Handler: router,
	}

	//start server
	log.Println("Server running on PORT ", PORT)

	go func() {
		if err := srv.ListenAndServe(); err != nil && err == http.ErrServerClosed {
			log.Fatal("Server error ", err)
		}
	}()

	//Graceful shutdown
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	<-c

	log.Println("Shutting down server")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Failed to shutdown server")
	}

	log.Println("Server exiting neatly...")
}