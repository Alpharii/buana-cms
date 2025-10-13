package mstkategori

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

func (s *Service) CreateKategori(k *entity.Kategori) error {
	return s.DB.Create(k).Error
}

func (s *Service) GetAllKategori() ([]entity.Kategori, error) {
	var list []entity.Kategori
	err := s.DB.Find(&list).Error
	return list, err
}

func (s *Service) GetKategoriByID(id uint) (*entity.Kategori, error) {
	var k entity.Kategori
	if err := s.DB.First(&k, id).Error; err != nil {
		return nil, err
	}
	return &k, nil
}

func (s *Service) UpdateKategori(id uint, updated *entity.Kategori) error {
	var k entity.Kategori
	if err := s.DB.First(&k, id).Error; err != nil {
		return err
	}
	return s.DB.Model(&k).Updates(updated).Error
}

func (s *Service) DeleteKategori(id uint) error {
	return s.DB.Delete(&entity.Kategori{}, id).Error
}
