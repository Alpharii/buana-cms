package uploadimage

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{Service: service}
}

// UploadTempImageHandler menangani upload gambar sementara
func (h *Handler) UploadTempImageHandler(c *fiber.Ctx) error {
	result, err := UploadTempImage(c, "file") // ambil dari field "file"
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "File uploaded successfully",
		"url":     result["url"],
		"path":    result["path"],
	})
}