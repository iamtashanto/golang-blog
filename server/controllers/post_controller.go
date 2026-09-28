package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
	"gorm.io/gorm"
)

type CreatePostInput struct {
	Title     string `json:"title" binding:"required"`
	Summary   string `json:"summary"`
	Content   string `json:"content" binding:"required"`
	Category  string `json:"category"`
	ImageURL  string `json:"image_url"`
	Published *bool  `json:"published"`
}

type UpdatePostInput struct {
	Title     string `json:"title"`
	Summary   string `json:"summary"`
	Content   string `json:"content"`
	Category  string `json:"category"`
	ImageURL  string `json:"image_url"`
	Published *bool  `json:"published"`
}

// GET /posts
// Find posts with search, category filter, and sorting
func FindPosts(c *gin.Context) {
	var posts []models.Post
	query := config.DB.Model(&models.Post{}).Preload("Comments")

	// Filter by Category
	category := c.Query("category")
	if category != "" && category != "All" {
		query = query.Where("LOWER(category) = ?", strings.ToLower(category))
	}

	// Search filter
	search := c.Query("search")
	if search != "" {
		searchTerm := "%" + strings.ToLower(search) + "%"
		query = query.Where("LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(summary) LIKE ?", searchTerm, searchTerm, searchTerm)
	}

	// Filter published (if public request, show only published; if admin param present, show all)
	includeDrafts := c.Query("all")
	if includeDrafts != "true" {
		query = query.Where("published = ?", true)
	}

	// Sorting
	sort := c.DefaultQuery("sort", "latest")
	switch sort {
	case "popular", "views":
		query = query.Order("views desc, created_at desc")
	case "likes":
		query = query.Order("likes desc, created_at desc")
	case "oldest":
		query = query.Order("created_at asc")
	default:
		query = query.Order("created_at desc")
	}

	if err := query.Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// GET /posts/:id
// Find single post and increment view count
func FindPost(c *gin.Context) {
	var post models.Post
	id := c.Param("id")

	if err := config.DB.Preload("Comments", func(db *gorm.DB) *gorm.DB {
		return db.Order("comments.created_at desc")
	}).Where("id = ?", id).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Increment view count in background/safely
	config.DB.Model(&models.Post{}).Where("id = ?", post.ID).UpdateColumn("views", gorm.Expr("views + ?", 1))
	post.Views += 1

	c.JSON(http.StatusOK, gin.H{"data": post})
}

// POST /posts/:id/like
// Like a post
func LikePost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post

	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	config.DB.Model(&post).UpdateColumn("likes", gorm.Expr("likes + ?", 1))
	post.Likes += 1

	c.JSON(http.StatusOK, gin.H{"likes": post.Likes, "message": "Post liked successfully"})
}

// POST /posts
// Create new post (Protected)
func CreatePost(c *gin.Context) {
	var input CreatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category := input.Category
	if category == "" {
		category = "General"
	}

	published := true
	if input.Published != nil {
		published = *input.Published
	}

	// Auto generate summary if empty
	summary := input.Summary
	if summary == "" {
		if len(input.Content) > 160 {
			summary = input.Content[:160] + "..."
		} else {
			summary = input.Content
		}
	}

	post := models.Post{
		Title:     input.Title,
		Summary:   summary,
		Content:   input.Content,
		Category:  category,
		ImageURL:  input.ImageURL,
		Published: published,
	}

	if err := config.DB.Create(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": post})
}

// PUT /posts/:id
// Update post (Protected)
func UpdatePost(c *gin.Context) {
	var post models.Post
	id := c.Param("id")

	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	var input UpdatePostInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if input.Title != "" {
		updates["title"] = input.Title
	}
	if input.Summary != "" {
		updates["summary"] = input.Summary
	}
	if input.Content != "" {
		updates["content"] = input.Content
	}
	if input.Category != "" {
		updates["category"] = input.Category
	}
	if input.ImageURL != "" {
		updates["image_url"] = input.ImageURL
	}
	if input.Published != nil {
		updates["published"] = *input.Published
	}

	if err := config.DB.Model(&post).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
		return
	}

	config.DB.First(&post, id)
	c.JSON(http.StatusOK, gin.H{"data": post})
}

// DELETE /posts/:id
// Delete post (Protected)
func DeletePost(c *gin.Context) {
	var post models.Post
	id := c.Param("id")

	if err := config.DB.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	config.DB.Delete(&post)
	c.JSON(http.StatusOK, gin.H{"data": "Post deleted successfully"})
}

// GET /categories
// List categories with counts
func GetCategories(c *gin.Context) {
	type CategoryCount struct {
		Category string `json:"category"`
		Count    int    `json:"count"`
	}

	var results []CategoryCount
	config.DB.Model(&models.Post{}).
		Where("published = ?", true).
		Select("category, count(*) as count").
		Group("category").
		Scan(&results)

	c.JSON(http.StatusOK, gin.H{"data": results})
}

// GET /archive
// Chronological archive of posts
func GetArchive(c *gin.Context) {
	var posts []models.Post
	config.DB.Where("published = ?", true).Order("created_at desc").Find(&posts)
	c.JSON(http.StatusOK, gin.H{"data": posts})
}

// GET /admin/stats
// Admin overview statistics
func GetStats(c *gin.Context) {
	var totalPosts int64
	var publishedPosts int64
	var totalViews int64
	var totalLikes int64
	var totalComments int64

	config.DB.Model(&models.Post{}).Count(&totalPosts)
	config.DB.Model(&models.Post{}).Where("published = ?", true).Count(&publishedPosts)
	config.DB.Model(&models.Comment{}).Count(&totalComments)

	type SumResult struct {
		TotalViews int64
		TotalLikes int64
	}
	var sumRes SumResult
	config.DB.Model(&models.Post{}).Select("COALESCE(SUM(views), 0) as total_views, COALESCE(SUM(likes), 0) as total_likes").Scan(&sumRes)
	totalViews = sumRes.TotalViews
	totalLikes = sumRes.TotalLikes

	c.JSON(http.StatusOK, gin.H{
		"total_posts":     totalPosts,
		"published_posts": publishedPosts,
		"draft_posts":     totalPosts - publishedPosts,
		"total_views":     totalViews,
		"total_likes":     totalLikes,
		"total_comments":  totalComments,
	})
}
