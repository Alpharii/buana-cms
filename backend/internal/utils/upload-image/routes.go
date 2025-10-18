package uploadimage

import (
	"github.com/gofiber/fiber/v2"
)

func RegisterRoutes(router fiber.Router, h *Handler) {
	protected := router.Group("/upload")

	// Endpoint upload gambar sementara
	protected.Post("/temp-image", h.UploadTempImageHandler)
}
