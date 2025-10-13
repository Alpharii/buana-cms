package entity

import "gorm.io/gorm"

type Profile struct{
	gorm.Model
	FirstName 		string	`json:"first_name"`
	LastName  		string	`json:"last_name"`
	Company	  		string	`json:"company"`
	ProfilePicture	string	`json:"profile_picture"`
}