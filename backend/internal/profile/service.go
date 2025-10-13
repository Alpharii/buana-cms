package profile

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

// ✅ Get all profiles
func (s *Service) GetAllProfiles() ([]entity.Profile, error) {
	var profiles []entity.Profile
	if err := s.DB.Find(&profiles).Error; err != nil {
		return nil, err
	}
	return profiles, nil
}

// ✅ Get by ID
func (s *Service) GetProfileByID(id uint) (*entity.Profile, error) {
	var profile entity.Profile
	if err := s.DB.First(&profile, id).Error; err != nil {
		return nil, err
	}
	return &profile, nil
}

// ✅ Get by Name (first_name OR last_name)
func (s *Service) GetProfileByName(name string) ([]entity.Profile, error) {
	var profiles []entity.Profile
	query := "%" + name + "%"
	if err := s.DB.
		Where("first_name ILIKE ? OR last_name ILIKE ?", query, query).
		Find(&profiles).Error; err != nil {
		return nil, err
	}
	return profiles, nil
}

// ✅ Update own profile (by ID)
func (s *Service) UpdateProfile(id uint, updated *entity.Profile) error {
	var existing entity.Profile
	if err := s.DB.First(&existing, id).Error; err != nil {
		return err
	}

	return s.DB.Model(&existing).Updates(map[string]interface{}{
		"first_name":      updated.FirstName,
		"last_name":       updated.LastName,
		"company":         updated.Company,
		"profile_picture": updated.ProfilePicture,
	}).Error
}
