package mstbarang

import (
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (s *Service) CreateBarang(b *Barang) error {
	return s.DB.Create(b).Error
}

func (s *Service) GetAllBarang() ([]Barang, error) {
	var data []Barang
	if err := s.DB.Preload("Kategori").Find(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (s *Service) GetBarangByID(id uint) (*Barang, error) {
	var b Barang
	if err := s.DB.Preload("Kategori").First(&b, id).Error; err != nil {
		return nil, err
	}
	return &b, nil
}

func (s *Service) UpdateBarang(id uint, updated *Barang) error {
	var b Barang
	if err := s.DB.First(&b, id).Error; err != nil {
		return err
	}
	return s.DB.Model(&b).Updates(updated).Error
}

func (s *Service) DeleteBarang(id uint) error {
	return s.DB.Delete(&Barang{}, id).Error
}
