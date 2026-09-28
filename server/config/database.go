package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/ta-shanto/golang-blog/server/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, relying on system environment variables")
	}

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Dhaka", host, user, dbname, port)
	if password != "" {
		dsn += fmt.Sprintf(" password=%s", password)
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to the database!", err)
	}

	DB = database
	log.Println("Database connection successfully opened")
}

func SeedDatabase() {
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		adminUser := models.User{
			Name:     "James Castle",
			Email:    "admin@gmail.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		DB.Create(&adminUser)
		log.Println("Default admin user created: admin@gmail.com (password: admin123)")
	}

	var postCount int64
	DB.Model(&models.Post{}).Count(&postCount)
	if postCount == 0 {
		posts := []models.Post{
			{
				Title:     "God is good... ALL the time!",
				Category:  "Faith",
				Summary:   "We often utter these familiar words in times of serene abundance, yet their true weight and enduring beauty only dawn upon our weary hearts when tested against sudden grief and seasons of unexpected testing. Sitting on the front porch this quiet dawn, watching the mist lift off the pasture, I was reminded once more of providence unbidden.",
				Content:   "We often utter these familiar words in times of serene abundance, yet their true weight and enduring beauty only dawn upon our weary hearts when tested against sudden grief and seasons of unexpected testing. Sitting on the front porch this quiet dawn, watching the mist lift off the pasture, I was reminded once more of providence unbidden.\n\nThere is a peculiar quiet that settles over the valley before the sun breaks the treeline. In that stillness, one remembers that faithfulness is not measured by the absence of storm, but by the quiet anchor that holds through the night.\n\nEvery generation before us has had to learn this in the field, beside the sickbed, and over cold ledger books in the winter. What we discover is not an abstract theory, but a living presence that sustains when human strength falters.",
				ImageURL:  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
				Views:     142,
				Likes:     38,
				Published: true,
			},
			{
				Title:     "Sundays at the Round Oak Table",
				Category:  "Family",
				Summary:   "Passing the heavy porcelain roast dish from hand to hand while three generations converse at once. There is an unspoken liturgy to an old family table that modern convenience can never reproduce.",
				Content:   "Passing the heavy porcelain roast dish from hand to hand while three generations converse at once. There is an unspoken liturgy to an old family table that modern convenience can never reproduce.\n\nThe oak was seasoned when my great-grandfather bought it in town. It bears the knife marks of boys who became soldiers and the cup rings of mothers who spent fifty years pouring coffee for neighbors in grief and joy.",
				ImageURL:  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=80",
				Views:     98,
				Likes:     24,
				Published: true,
			},
			{
				Title:     "What the Town Clerk's Ledger of 1884 Forgot to Mention",
				Category:  "History",
				Summary:   "Between the property tax disputes and cattle brand registrations sits a tiny penciled margin note recording the sudden freeze that killed the peach blossoms in April.",
				Content:   "Between the property tax disputes and cattle brand registrations sits a tiny penciled margin note recording the sudden freeze that killed the peach blossoms in April.\n\nOfficial records preserve what councils vote upon; margins preserve what broke men's hearts and tested their resolve to remain on the land.",
				ImageURL:  "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80",
				Views:     115,
				Likes:     31,
				Published: true,
			},
			{
				Title:     "The Quiet Dignity of Slow Machinery",
				Category:  "Commentary",
				Summary:   "Why our obsession with frictionless velocity is robbing small towns of craft, conversation, and the patience required to fix what is broken rather than discard it.",
				Content:   "Why our obsession with frictionless velocity is robbing small towns of craft, conversation, and the patience required to fix what is broken rather than discard it.\n\nA machine with exposed gears demands respect and attention. You must grease it; you must listen to its cadence; you must understand its metal bones.",
				ImageURL:  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
				Views:     87,
				Likes:     29,
				Published: true,
			},
			{
				Title:     "Porch Lanterns and Fireflies: Small Town Independence Day",
				Category:  "Culture",
				Summary:   "Before the synchronized drone spectacles, there was the single brass trumpet playing taps from the bandstand while children caught lightning bugs in mason jars.",
				Content:   "Before the synchronized drone spectacles, there was the single brass trumpet playing taps from the bandstand while children caught lightning bugs in mason jars.\n\nThe air smelled of damp cut grass and spent paper firecrackers, and people lingered until the fireflies outshone the distant roman candles.",
				ImageURL:  "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500&auto=format&fit=crop&q=80",
				Views:     204,
				Likes:     54,
				Published: true,
			},
		}

		for _, p := range posts {
			DB.Create(&p)
		}

		// Add sample comments for post 2
		var p2 models.Post
		if err := DB.Where("title = ?", "Sundays at the Round Oak Table").First(&p2).Error; err == nil {
			comments := []models.Comment{
				{PostID: p2.ID, Author: "Sarah Jenkins", Content: "This brought tears to my eyes. Reminded me of my grandmother's parlor."},
				{PostID: p2.ID, Author: "David Miller", Content: "Wonderful reflection on what truly matters across generations."},
				{PostID: p2.ID, Author: "Mary Claire", Content: "The table remains a sanctuary."},
				{PostID: p2.ID, Author: "Pastor Thomas", Content: "Amen to the quiet unspoken liturgies of life."},
				{PostID: p2.ID, Author: "Evelyn Reed", Content: "Beautifully written, James."},
				{PostID: p2.ID, Author: "Arthur Pendelton", Content: "Cherish every gathering."},
			}
			for _, c := range comments {
				DB.Create(&c)
			}
		}

		log.Println("Database successfully seeded with reference chronicle articles!")
	}
}
