package user

import (
	"buana-cms/pkg/middleware"

	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(router fiber.Router, h *Handler) {
	router.Post("/register", h.Register)
	router.Post("/login", h.Login)

	protected := router.Group("/me", middleware.Protected())
	protected.Get("/", h.Me)
}
