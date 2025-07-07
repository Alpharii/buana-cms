package mstklien

import "gorm.io/gorm"

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

func (s *Service) CreateKlien(k *Klien) error {
	return s.DB.Create(k).Error
}

func (s *Service) GetAllKlien() ([]Klien, error) {
	var list []Klien
	err := s.DB.Find(&list).Error
	return list, err
}

func (s *Service) GetKlienByID(id uint) (*Klien, error) {
	var k Klien
	if err := s.DB.First(&k, id).Error; err != nil {
		return nil, err
	}
	return &k, nil
}

func (s *Service) UpdateKlien(id uint, updated *Klien) error {
	var k Klien
	if err := s.DB.First(&k, id).Error; err != nil {
		return err
	}
	return s.DB.Model(&k).Updates(updated).Error
}

func (s *Service) DeleteKlien(id uint) error {
	return s.DB.Delete(&Klien{}, id).Error
}
