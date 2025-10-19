package main

import (
	"buana-cms/app"
	"buana-cms/config"
	"buana-cms/internal/entity"
	"buana-cms/pkg/utils"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Cannot load .env")
	}

	config.ConnectDB()

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

	// ✅ Kosongkan folder temp saat startup
	utils.ClearTempFolder("./temp/image")

	// ✅ Jalankan pembersihan rutin tiap 48 jam
	utils.ScheduleTempClear("./temp/image", 48*time.Hour)

	// Serve file statis
	appInstance.Static("/temp/image", "./temp/image")
	appInstance.Static("/public/image", "./public/image")

	// Inisialisasi module
	app.InitModules(appInstance)

	log.Fatal(appInstance.Listen(":" + os.Getenv("PORT")))
}