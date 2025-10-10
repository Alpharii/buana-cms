package salesorder

import (
	mstbarang "buana-cms/internal/mst-barang"
	mstklien "buana-cms/internal/mst-klien"
	"buana-cms/internal/user"
	"time"

	"gorm.io/gorm"
)

type SalesOrder struct {
	gorm.Model
	NoOrder    string  			`json:"no_order"`
	Tanggal    time.Time 		`json:"tanggal"`
	UserID     uint      		`json:"user_id"`
	User       user.User  		`gorm:"foreignKey:UserID"`
	KlienID    uint      		`json:"klien_id"`
	Klien      mstklien.Klien   `gorm:"foreignKey:KlienID"`
	TotalHarga float64   		`json:"total_harga"`
	Status     string    		`json:"status"` // draft, approved, done
	Items      []SalesOrderItem `json:"items" gorm:"foreignKey:SalesOrderID"`
}

type SalesOrderItem struct {
	gorm.Model
	SalesOrderID uint    		   `json:"sales_order_id"`
	SalesOrder   SalesOrder 	   `gorm:"foreignKey:SalesOrderID"`
	BarangID     uint    		   `json:"barang_id"`
	Barang       mstbarang.Barang  `gorm:"foreignKey:BarangID"`
	Jumlah       int     		   `json:"jumlah"`
	HargaSatuan  float64 		   `json:"harga_satuan"`
	Subtotal     float64 		   `json:"subtotal"`
}
