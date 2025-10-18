package uploadimage

import (
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

// UploadTempImage menyimpan file upload ke folder temp/image dan mengembalikan URL & path lokal
func UploadTempImage(c *fiber.Ctx, formField string) (map[string]string, error) {
	file, err := c.FormFile(formField)
	if err != nil {
		return nil, fmt.Errorf("file is required: %v", err)
	}

	tempDir := "./temp/image"
	if err := os.MkdirAll(tempDir, os.ModePerm); err != nil {
		return nil, fmt.Errorf("cannot create temp directory: %v", err)
	}

	// Normalisasi nama file: hapus spasi, karakter aneh, dan ubah ke lowercase
	originalName := strings.ToLower(file.Filename)
	normalizedName := strings.ReplaceAll(originalName, " ", "_")

	// Hapus karakter selain huruf, angka, titik, dan underscore
	re := regexp.MustCompile(`[^a-zA-Z0-9._-]`)
	normalizedName = re.ReplaceAllString(normalizedName, "")

	// Buat nama unik dengan timestamp
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), normalizedName)
	filePath := filepath.Join(tempDir, filename)

	// Simpan file ke folder temp
	if err := c.SaveFile(file, filePath); err != nil {
		return nil, fmt.Errorf("failed to save file: %v", err)
	}

	// Buat URL sementara (akses di frontend)
	url := fmt.Sprintf("/temp/image/%s", filename)

	return map[string]string{
		"url":  url,
		"path": filePath,
	}, nil
}