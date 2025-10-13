package mstklien

import (
	"buana-cms/internal/entity"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (s *Service) CreateKlien(k *entity.Klien) error {
	return s.DB.Create(k).Error
}

func (s *Service) GetAllKlien() ([]entity.Klien, error) {
	var list []entity.Klien
	err := s.DB.Find(&list).Error
	return list, err
}

func (s *Service) GetKlienByID(id uint) (*entity.Klien, error) {
	var k entity.Klien
	if err := s.DB.First(&k, id).Error; err != nil {
		return nil, err
	}
	return &k, nil
}

func (s *Service) UpdateKlien(id uint, updated *entity.Klien) error {
	var k entity.Klien
	if err := s.DB.First(&k, id).Error; err != nil {
		return err
	}
	return s.DB.Model(&k).Updates(updated).Error
}

func (s *Service) DeleteKlien(id uint) error {
	return s.DB.Delete(&entity.Klien{}, id).Error
}
