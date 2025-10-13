package user

import (
	"buana-cms/internal/entity"

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
	var data entity.User
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

func (h *Handler) Login(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	user, err := h.Service.FindByEmail(input.Email)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "user not found"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "invalid password"})
	}

	// Generate JWT
	token, err := h.Service.GenerateJWT(user.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token})
}

func (h *Handler) Me(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	var user entity.User
	if err := h.Service.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil
	}
	return c.JSON(user)
}
