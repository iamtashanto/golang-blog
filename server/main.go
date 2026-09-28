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
	err := config.DB.AutoMigrate(
		&models.Post{},
		&models.User{},
		&models.Comment{},
		&models.Subscriber{},
		&models.ContactMessage{},
		&models.SiteSetting{},
	)
	if err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}

	// Seed database with default articles if empty
	config.SeedDatabase()

	// Setup Gin router
	r := gin.Default()

	// Configure CORS
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(corsConfig))

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// RSS 2.0 Feed
	r.GET("/rss", controllers.GenerateRSSFeed)
	r.GET("/feed.xml", controllers.GenerateRSSFeed)

	// Publication Settings (Dynamic)
	r.GET("/settings", controllers.GetSettings)

	// Auth routes
	r.POST("/auth/register", controllers.Register)
	r.POST("/auth/login", controllers.Login)
	r.GET("/auth/me", middlewares.RequireAuth(), controllers.GetMe)

	// Public Blog routes
	r.GET("/posts", controllers.FindPosts)
	r.GET("/posts/:id", controllers.FindPost)
	r.POST("/posts/:id/like", controllers.LikePost)
	r.GET("/posts/:id/comments", controllers.GetCommentsByPost)
	r.POST("/posts/:id/comments", controllers.CreateComment)
	r.GET("/categories", controllers.GetCategories)
	r.GET("/archive", controllers.GetArchive)
	r.GET("/stats", controllers.GetStats)

	// Newsletter & Correspondence
	r.POST("/newsletter", controllers.SubscribeNewsletter)
	r.POST("/contact", controllers.SendContactMessage)

	// Protected Admin routes
	adminRoutes := r.Group("/")
	adminRoutes.Use(middlewares.RequireAuth(), middlewares.RequireAdmin())
	{
		adminRoutes.POST("/posts", controllers.CreatePost)
		adminRoutes.PUT("/posts/:id", controllers.UpdatePost)
		adminRoutes.DELETE("/posts/:id", controllers.DeletePost)
		adminRoutes.DELETE("/comments/:id", controllers.DeleteComment)
		adminRoutes.GET("/admin/comments", controllers.GetAllComments)
		adminRoutes.GET("/admin/stats", controllers.GetStats)
		adminRoutes.GET("/admin/subscribers", controllers.GetSubscribers)
		adminRoutes.GET("/admin/messages", controllers.GetContactMessages)
		adminRoutes.PUT("/admin/settings", controllers.UpdateSettings)
	}

	// Start the server
	log.Println("Server is running on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
