package main

import (
	"buana-cms/app"
	"buana-cms/config"
	"buana-cms/internal/entity"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Cannot load .env")
	}

	config.ConnectDB()

	// Auto migrate all models
	config.DB.AutoMigrate(
		&entity.User{},
		&entity.Profile{},
		&entity.Kategori{},
		&entity.Barang{},
		&entity.Klien{},
		&entity.SalesOrder{},
		&entity.SalesOrderItem{},
	)

	appInstance := fiber.New()

	appInstance.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// Serve file statis dari folder ./temp/image
	appInstance.Static("/temp/image", "./temp/image")

	// Serve file statis dari folder ./public/image
	appInstance.Static("/public/image", "./public/image")

	// Inisialisasi semua module
	app.InitModules(appInstance)

	log.Fatal(appInstance.Listen(":" + os.Getenv("PORT")))
}
