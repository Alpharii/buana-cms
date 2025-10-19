package utils

import (
	"log"
	"os"
	"path/filepath"
	"time"
)

func ClearTempFolder(folderPath string) {
	files, err := os.ReadDir(folderPath)
	if err != nil {
		log.Println("Tidak bisa membaca folder:", err)
		return
	}

	for _, file := range files {
		filePath := filepath.Join(folderPath, file.Name())
		err := os.RemoveAll(filePath)
		if err != nil {
			log.Println("Gagal menghapus:", filePath, err)
		}
	}
	log.Println("✅ Folder", folderPath, "berhasil dikosongkan.")
}

func ScheduleTempClear(folderPath string, interval time.Duration) {
	go func() {
		ticker := time.NewTicker(interval)
		for {
			ClearTempFolder(folderPath)
			<-ticker.C
		}
	}()
}