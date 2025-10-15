package profile

import (
	"buana-cms/internal/entity"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	Service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{Service: s}
}

// ✅ GET ALL
func (h *Handler) GetAll(c *fiber.Ctx) error {
	data, err := h.Service.GetAllProfiles()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(data)
}

// ✅ GET BY ID
func (h *Handler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid ID"})
	}

	start := c.Query("start")
	end := c.Query("end")

	profile, err := h.Service.GetProfileWithUserAndSales(uint(id), start, end)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(profile)
}

// ✅ GET BY NAME (search)
func (h *Handler) GetByName(c *fiber.Ctx) error {
	name := c.Query("name")
	if name == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Missing query param: name"})
	}
	data, err := h.Service.GetProfileByName(name)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(data)
}

// ✅ EDIT OWN PROFILE (with JWT)
func (h *Handler) UpdateOwnProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id") // di-set oleh middleware.Protected()

	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	var input entity.Profile
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Ambil profile_id dari tabel user
	var user entity.User
	if err := h.Service.DB.First(&user, userID).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	if err := h.Service.UpdateProfile(user.ProfileID, &input); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Profile updated successfully"})
}
