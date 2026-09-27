package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
)

type CreatePostInput struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type UpdatePostInput struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

// GET /posts
// Find all posts
func FindPosts(c *gin.Context) {
	var posts []models.Post
	config.DB.Find(&posts)

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// POST /posts
// Create new post
func CreatePost(c *gin.Context) {
	var input CreatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create post
	post := models.Post{Title: input.Title, Content: input.Content, AuthorID: 1, Published: true}
	config.DB.Create(&post)

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// GET /posts/:id
// Find a post
func FindPost(c *gin.Context) {
	var post models.Post

	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// PUT /posts/:id
// Update a post
func UpdatePost(c *gin.Context) {
	var post models.Post
	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	var input UpdatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	config.DB.Model(&post).Updates(input)

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// DELETE /posts/:id
// Delete a post
func DeletePost(c *gin.Context) {
	var post models.Post
	if err := config.DB.Where("id = ?", c.Param("id")).First(&post).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Record not found!"})
		return
	}

	config.DB.Delete(&post)

	c.JSON(http.StatusOK, gin.H{"data": true})
}
