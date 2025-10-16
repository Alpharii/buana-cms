package entity

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string `gorm:"unique" json:"username"`
	Email    string `gorm:"unique" json:"email"`
	Password string `json:"password"`

	// foreign key ke Profile
	ProfileID uint     `json:"profile_id"`
	Profile   Profile  `gorm:"foreignKey:ProfileID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"profile,omitempty"`

	// relasi ke SalesOrder (1 user bisa punya banyak order)
	// tidak membuat kolom di tabel user — hanya virtual relationship
	SalesOrders []SalesOrder `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"sales_orders,omitempty"`
}
