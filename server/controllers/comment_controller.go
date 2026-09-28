package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
)

type CreateCommentInput struct {
	Author  string `json:"author" binding:"required"`
	Email   string `json:"email"`
	Content string `json:"content" binding:"required"`
}

// GET /posts/:id/comments
func GetCommentsByPost(c *gin.Context) {
	var comments []models.Comment
	postID := c.Param("id")

	if err := config.DB.Where("post_id = ?", postID).Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comments})
}

// POST /posts/:id/comments
func CreateComment(c *gin.Context) {
	var input CreateCommentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var post models.Post
	postID := c.Param("id")
	if err := config.DB.First(&post, postID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	comment := models.Comment{
		PostID:  post.ID,
		Author:  input.Author,
		Email:   input.Email,
		Content: input.Content,
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to post comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": comment})
}

// DELETE /comments/:id
func DeleteComment(c *gin.Context) {
	var comment models.Comment
	if err := config.DB.First(&comment, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	config.DB.Delete(&comment)
	c.JSON(http.StatusOK, gin.H{"data": "Comment deleted successfully"})
}

// GET /admin/comments
func GetAllComments(c *gin.Context) {
	var comments []models.Comment
	if err := config.DB.Order("created_at desc").Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": comments})
}
