package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	Title     string    `gorm:"type:varchar(255);not null" json:"title"`
	Slug      string    `gorm:"type:varchar(255);index" json:"slug"`
	Summary   string    `gorm:"type:text" json:"summary"`
	Content   string    `gorm:"type:text;not null" json:"content"`
	Category  string    `gorm:"type:varchar(100);default:'General';index" json:"category"`
	ImageURL  string    `gorm:"type:text" json:"image_url"`
	Views     int       `gorm:"default:0" json:"views"`
	Likes     int       `gorm:"default:0" json:"likes"`
	AuthorID  uint      `json:"author_id"`
	Published bool      `gorm:"default:true" json:"published"`
	Comments  []Comment `gorm:"foreignKey:PostID;constraint:OnDelete:CASCADE" json:"comments,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
