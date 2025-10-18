package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// MoveTempImageToProfile memindahkan file dari /temp/image → /public/image/profile
// dan mengembalikan URL final (misal: /public/image/profile/xxxx.png)
func MoveTempImageToProfile(tempURL string) (string, error) {
	if tempURL == "" {
		return "", nil
	}

	// Pastikan ini file dari temp/image
	if !strings.Contains(tempURL, "/temp/image/") {
		return tempURL, nil // bukan file sementara, biarkan saja
	}

	oldPath := "." + tempURL // misal ./temp/image/12345_avatar.png
	newDir := "./public/image/profile"

	// pastikan folder tujuan ada
	if err := os.MkdirAll(newDir, os.ModePerm); err != nil {
		return "", fmt.Errorf("cannot create public directory: %v", err)
	}

	newFile := filepath.Join(newDir, filepath.Base(tempURL))
	if err := os.Rename(oldPath, newFile); err != nil {
		return "", fmt.Errorf("failed to move image: %v", err)
	}

	finalURL := "/public/image/profile/" + filepath.Base(tempURL)
	return finalURL, nil
}
