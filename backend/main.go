package main

import (
	"buana-cms/config"
	mstbarang "buana-cms/internal/mst-barang"
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
	config.DB.AutoMigrate(&user.User{}, &mstbarang.Barang{})

	app := fiber.New()

	api := app.Group("/api")

	// user module
	userService := user.NewService(config.DB)
	userHandler := user.NewHandler(userService)
	user.RegisterRoutes(api.Group("/users"), userHandler)

	//baranf module
	barangService := mstbarang.NewService(config.DB)
	barangHandler := mstbarang.NewHandler(barangService)
	mstbarang.RegisterRoutes(api, barangHandler)

	log.Fatal(app.Listen(":" + os.Getenv("PORT")))
}
