package user

import "github.com/gofiber/fiber/v2"

func RegisterRoutes(router fiber.Router, h *Handler) {
	router.Post("/register", h.Register)
}
