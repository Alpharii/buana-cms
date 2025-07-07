package user

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	Service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{Service: s}
}

func (h *Handler) Register(c *fiber.Ctx) error {
	var data User
	if err := c.BodyParser(&data); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(data.Password), 14)
	data.Password = string(hash)

	if err := h.Service.Create(&data); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "cannot create user"})
	}

	return c.JSON(data)
}
