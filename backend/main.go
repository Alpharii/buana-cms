package main

import (
	"buana-cms/app"
	"buana-cms/config"
	mstbarang "buana-cms/internal/mst-barang"
	mstkategori "buana-cms/internal/mst-category"
	mstklien "buana-cms/internal/mst-klien"
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

	// Auto migrate all models
	config.DB.AutoMigrate(
		&user.User{},
		&mstkategori.Kategori{},
		&mstbarang.Barang{},
		&mstklien.Klien{},
	)

	appInstance := fiber.New()

	// Inisialisasi semua module
	app.InitModules(appInstance)

	log.Fatal(appInstance.Listen(":" + os.Getenv("PORT")))
}
