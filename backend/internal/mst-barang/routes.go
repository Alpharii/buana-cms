package mstbarang

import (
	"buana-cms/pkg/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(router fiber.Router, h *Handler) {
	protected := router.Group("/barang", middleware.Protected())

	protected.Post("/", h.Create)
	protected.Get("/", h.GetAll)
	protected.Get("/:id", h.GetByID)
	protected.Put("/:id", h.Update)
	protected.Delete("/:id", h.Delete)
}
