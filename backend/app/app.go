package app

import (
	"buana-cms/config"
	mstbarang "buana-cms/internal/mst-barang"
	mstklien "buana-cms/internal/mst-klien"
	"buana-cms/internal/user"

	"github.com/gofiber/fiber/v2"
)

func InitModules(app *fiber.App) {
	api := app.Group("/api")

	// user
	userService := user.NewService(config.DB)
	userHandler := user.NewHandler(userService)
	user.RegisterRoutes(api.Group("/users"), userHandler)

	// barang
	barangService := mstbarang.NewService(config.DB)
	barangHandler := mstbarang.NewHandler(barangService)
	mstbarang.RegisterRoutes(api, barangHandler)

	// klien
	klienService := mstklien.NewService(config.DB)
	klienHandler := mstklien.NewHandler(klienService)
	mstklien.RegisterRoutes(api, klienHandler)
}
