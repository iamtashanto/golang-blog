package main

import (
	"log"

	"github.com/ta-shanto/golang-blog/server/config"
	"github.com/ta-shanto/golang-blog/server/models"
)

func main() {
	log.Println("Starting database connection for seeding...")
	config.ConnectDatabase()

	log.Println("Migrating database schemas...")
	err := config.DB.AutoMigrate(
		&models.Post{},
		&models.User{},
		&models.Comment{},
		&models.Subscriber{},
		&models.ContactMessage{},
		&models.SiteSetting{},
	)
	if err != nil {
		log.Fatalf("Auto-migration failed: %v", err)
	}

	log.Println("Executing seed...")
	config.SeedDatabase()
	log.Println("Seeding finished successfully! You can now login with:")
	log.Println(" -> Email:    admin@gmail.com (or admin@castlechronicle.org)")
	log.Println(" -> Password: admin123")
}
