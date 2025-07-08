package mstkategori

import (
	"github.com/gofiber/fiber/v2"
	"buana-cms/pkg/middleware"
)

func RegisterRoutes(router fiber.Router, h *Handler) {
	protected := router.Group("/kategori", middleware.Protected())

	protected.Post("/", h.Create)
	protected.Get("/", h.GetAll)
	protected.Get("/:id", h.GetByID)
	protected.Put("/:id", h.Update)
	protected.Delete("/:id", h.Delete)
}
