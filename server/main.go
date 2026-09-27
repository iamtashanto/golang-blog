package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/controllers"
	"github.com/ta-shanto/golang-blog/server/middlewares"
	"github.com/ta-shanto/golang-blog/server/models"
)

func main() {
	// Initialize Database connection
	config.ConnectDatabase()

	// Auto Migrate the models
	err := config.DB.AutoMigrate(&models.Post{}, &models.User{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}

	// Setup Gin router
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Auth routes
	r.POST("/auth/register", controllers.Register)
	r.POST("/auth/login", controllers.Login)

	// Public Post routes
	r.GET("/posts", controllers.FindPosts)
	r.GET("/posts/:id", controllers.FindPost)

	// Protected Admin Post routes
	adminRoutes := r.Group("/")
	adminRoutes.Use(middlewares.RequireAuth(), middlewares.RequireAdmin())
	{
		adminRoutes.POST("/posts", controllers.CreatePost)
		adminRoutes.PUT("/posts/:id", controllers.UpdatePost)
		adminRoutes.DELETE("/posts/:id", controllers.DeletePost)
	}

	// Start the server
	log.Println("Server is running on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
