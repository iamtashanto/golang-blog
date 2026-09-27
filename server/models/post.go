package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	AuthorID  uint      `json:"author_id"`
	Published bool      `gorm:"default:false" json:"published"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
