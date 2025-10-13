package mstbarang

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

func (s *Service) CreateBarang(b *entity.Barang) error {
	return s.DB.Create(b).Error
}

func (s *Service) GetAllBarang() ([]entity.Barang, error) {
	var data []entity.Barang
	if err := s.DB.Preload("Kategori").Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (s *Service) GetBarangByID(id uint) (*entity.Barang, error) {
	var b entity.Barang
	if err := s.DB.Preload("Kategori").First(&b, id).Error; err != nil {
		return nil, err
	}
	return &b, nil
}

func (s *Service) UpdateBarang(id uint, updated *entity.Barang) error {
	var b entity.Barang
	if err := s.DB.First(&b, id).Error; err != nil {
		return err
	}
	return s.DB.Model(&b).Updates(updated).Error
}

func (s *Service) DeleteBarang(id uint) error {
	return s.DB.Delete(&entity.Barang{}, id).Error
}
