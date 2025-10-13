package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `gorm:"unique" json:"username"`
	Email    string `gorm:"unique" json:"email"`
	Password string `json:"password"`

	ProfileID uint            `json:"profile_id"`
	Profile   Profile `gorm:"foreignKey:ProfileID" json:"profile,omitempty"`

	// Relasi ke SalesOrder (1 user bisa punya banyak order)
	SalesOrders []SalesOrder `gorm:"foreignKey:UserID" json:"sales_orders,omitempty"`
}
