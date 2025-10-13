package entity

import "gorm.io/gorm"

type Kategori struct {
	gorm.Model
	Nama      string `json:"nama"`
	Deskripsi string `json:"deskripsi"`
}
