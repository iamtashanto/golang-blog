package models

import (
	"time"

	"gorm.io/gorm"
)

type ContactMessage struct {
	gorm.Model
	Name      string    `gorm:"type:varchar(150);not null" json:"name"`
	Email     string    `gorm:"type:varchar(150);not null" json:"email"`
	Subject   string    `gorm:"type:varchar(255)" json:"subject"`
	Message   string    `gorm:"type:text;not null" json:"message"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
