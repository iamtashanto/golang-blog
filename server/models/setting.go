package models

import (
	"time"

	"gorm.io/gorm"
)

type SiteSetting struct {
	gorm.Model
	SiteTitle   string    `gorm:"default:'The Castle Chronicle'" json:"site_title"`
	Tagline     string    `gorm:"default:'REFLECTIONS ON FAMILY, FAITH, CULTURE & HISTORY'" json:"tagline"`
	AuthorName  string    `gorm:"default:'James Castle'" json:"author_name"`
	AuthorTitle string    `gorm:"default:'Essayist, Father & Historian'" json:"author_title"`
	AuthorBio   string    `gorm:"type:text" json:"author_bio"`
	AuthorImage string    `gorm:"type:text" json:"author_image"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
