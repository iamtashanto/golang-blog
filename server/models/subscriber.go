package models

import (
	"time"

	"gorm.io/gorm"
)

type Subscriber struct {
	gorm.Model
	Email     string    `gorm:"uniqueIndex;not null" json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
