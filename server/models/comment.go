package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	PostID    uint      `gorm:"index;not null" json:"post_id"`
	Author    string    `gorm:"type:varchar(100);not null" json:"author"`
	Email     string    `gorm:"type:varchar(150)" json:"email"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
