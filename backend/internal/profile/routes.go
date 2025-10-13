package profile

import (
	"buana-cms/pkg/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(router fiber.Router, h *Handler) {
	protected := router.Group("/profile", middleware.Protected())

	// public
	protected.Get("/", h.GetAll)
	protected.Get("/:id", h.GetByID)
	protected.Get("/search", h.GetByName)

	// private (user sendiri)
	protected.Put("/me", h.UpdateOwnProfile)
}
