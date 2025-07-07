package mstklien

import "gorm.io/gorm"

type Klien struct {
	gorm.Model
	NamaKlien  string `json:"nama_klien"`
	JenisUsaha string `json:"jenis_usaha"`
	NamaToko   string `json:"nama_toko"`
	Alamat     string `json:"alamat"`
	NoTelepon  string `json:"no_telepon"`
	Email      string `json:"email"`
	NamaPIC    string `json:"nama_pic"`
}
