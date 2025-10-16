package entity

import (
	"time"
	"gorm.io/gorm"
)

type SalesOrder struct {
	gorm.Model
	NoOrder    string    `json:"no_order"`
	Tanggal    time.Time `json:"tanggal"`
	UserID     uint      `json:"user_id"`
	User       User      `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"user"`
	
	KlienID    uint      `json:"klien_id"`
	Klien      Klien     `gorm:"foreignKey:KlienID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"klien"`
	
	TotalHarga float64   `json:"total_harga"`
	Status     string    `json:"status"`
	
	// relasi ke item
	Items []SalesOrderItem `gorm:"foreignKey:SalesOrderID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"items"`
}

type SalesOrderItem struct {
	gorm.Model
	SalesOrderID uint    		   `json:"sales_order_id"`
	SalesOrder   SalesOrder 	   `gorm:"foreignKey:SalesOrderID"`
	BarangID     uint    		   `json:"barang_id"`
	Barang       Barang			   `gorm:"foreignKey:BarangID"`
	Jumlah       int     		   `json:"jumlah"`
	HargaSatuan  float64 		   `json:"harga_satuan"`
	Subtotal     float64 		   `json:"subtotal"`
}
