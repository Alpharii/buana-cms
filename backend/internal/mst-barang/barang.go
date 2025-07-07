package mstbarang

import "gorm.io/gorm"

type Barang struct {
	gorm.Model
	NamaBarang string  `json:"nama_barang"`
	Harga      float64 `json:"harga"`
	Deskripsi  string  `json:"deskripsi"`
	Stok       int     `json:"stok"`
	Satuan     string  `json:"satuan"`
	// KategoriID uint    `json:"kategori_id"` // opsional dulu
	Gambar string `json:"gambar"`
}
