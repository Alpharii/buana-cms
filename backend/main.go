package main

import (
	"buana-cms/config"
	"buana-cms/internal/user"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Cannot load .env")
	}

	config.ConnectDB()
	config.DB.AutoMigrate(&user.User{})

	app := fiber.New()

	api := app.Group("/api")

	// Inisialisasi user module
	userService := user.NewService(config.DB)
	userHandler := user.NewHandler(userService)
	user.RegisterRoutes(api.Group("/users"), userHandler)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
