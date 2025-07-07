package user

import (
	"errors"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (s *Service) Create(user *User) error {
	return s.DB.Create(user).Error
}

func (s *Service) FindByEmail(email string) (*User, error) {
	var user User
	if err := s.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}
