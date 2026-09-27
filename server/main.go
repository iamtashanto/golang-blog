package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
)

func main() {
	// Initialize Database connection
	config.ConnectDatabase()

	// Auto Migrate the models
	err := config.DB.AutoMigrate(&models.Post{})
	if err != nil {
		log.Fatalf("Failed to auto-migrate: %v", err)
	}

	// Setup Gin router
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// Start the server
	log.Println("Server is running on port 8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
