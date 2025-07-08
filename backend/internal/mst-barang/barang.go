package mstbarang

import (
	mstkategori "buana-cms/internal/mst-category"

	"gorm.io/gorm"
)

type Barang struct {
	gorm.Model
	NamaBarang string  `json:"nama_barang"`
	Harga      float64 `json:"harga"`
	Deskripsi  string  `json:"deskripsi"`
	Stok       int     `json:"stok"`
	Satuan     string  `json:"satuan"`
	Gambar     string  `json:"gambar"`

	KategoriID uint                      `json:"kategori_id"`
	Kategori   mstkategori.Kategori `gorm:"foreignKey:KategoriID" json:"kategori,omitempty"`
}
