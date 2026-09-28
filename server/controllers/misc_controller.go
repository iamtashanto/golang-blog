package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
)

type SubscribeInput struct {
	Email string `json:"email" binding:"required,email"`
}

type ContactInput struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required,email"`
	Subject string `json:"subject"`
	Message string `json:"message" binding:"required"`
}

// POST /newsletter
func SubscribeNewsletter(c *gin.Context) {
	var input SubscribeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please provide a valid email address"})
		return
	}

	sub := models.Subscriber{Email: input.Email}
	if err := config.DB.Create(&sub).Error; err != nil {
		// If duplicate email, return success gently
		c.JSON(http.StatusOK, gin.H{"message": "You are already subscribed to the chronicle dispatch!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully subscribed to the chronicle dispatch!"})
}

// GET /admin/subscribers
func GetSubscribers(c *gin.Context) {
	var subs []models.Subscriber
	config.DB.Order("created_at desc").Find(&subs)
	c.JSON(http.StatusOK, gin.H{"data": subs})
}

// POST /contact
func SendContactMessage(c *gin.Context) {
	var input ContactInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please fill out all required fields"})
		return
	}

	msg := models.ContactMessage{
		Name:    input.Name,
		Email:   input.Email,
		Subject: input.Subject,
		Message: input.Message,
	}

	if err := config.DB.Create(&msg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to record message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Your correspondence has been received by the editorial desk."})
}

// GET /admin/messages
func GetContactMessages(c *gin.Context) {
	var msgs []models.ContactMessage
	config.DB.Order("created_at desc").Find(&msgs)
	c.JSON(http.StatusOK, gin.H{"data": msgs})
}

// GET /rss or GET /feed.xml
func GenerateRSSFeed(c *gin.Context) {
	var posts []models.Post
	config.DB.Where("published = ?", true).Order("created_at desc").Limit(20).Find(&posts)

	rssXML := `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>The Castle Chronicle</title>
  <link>http://localhost:3000</link>
  <description>Reflections on Family, Faith, Culture &amp; History</description>
  <language>en-us</language>
  <lastBuildDate>` + time.Now().Format(time.RFC1123Z) + `</lastBuildDate>
`

	for _, p := range posts {
		rssXML += fmt.Sprintf(`  <item>
    <title><![CDATA[%s]]></title>
    <link>http://localhost:3000/posts/%d</link>
    <description><![CDATA[%s]]></description>
    <category><![CDATA[%s]]></category>
    <pubDate>%s</pubDate>
    <guid>http://localhost:3000/posts/%d</guid>
  </item>
`, p.Title, p.ID, p.Summary, p.Category, p.CreatedAt.Format(time.RFC1123Z), p.ID)
	}

	rssXML += `</channel>
</rss>`

	c.Header("Content-Type", "application/xml; charset=utf-8")
	c.String(http.StatusOK, rssXML)
}
