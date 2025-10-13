package user

import (
	"buana-cms/internal/entity"
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

// Buat user baru beserta profile kosong (dipanggil saat register)
func (s *Service) Create(user *entity.User) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		profile := entity.Profile{
			FirstName:      "",
			LastName:       "",
			Company:        "",
			ProfilePicture: "",
		}

		if err := tx.Create(&profile).Error; err != nil {
			return err
		}

		user.ProfileID = profile.ID

		if err := tx.Create(user).Error; err != nil {
			return err
		}

		return nil
	})
}

func (s *Service) FindByEmail(email string) (*entity.User, error) {
	var user entity.User
	if err := s.DB.Where("email = ?", email).Preload("Profile").First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}

// Verifikasi login dan buat profile kosong jika belum ada
func (s *Service) Login(email, password string) (*entity.User, error) {
	user, err := s.FindByEmail(email)
	if err != nil {
		return nil, errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid password")
	}

	if user.ProfileID == 0 {
		profile := entity.Profile{}
		if err := s.DB.Create(&profile).Error; err != nil {
			return nil, errors.New("failed to create empty profile")
		}
		user.ProfileID = profile.ID
		if err := s.DB.Save(user).Error; err != nil {
			return nil, errors.New("failed to link profile to user")
		}
	}

	return user, nil
}

func (s *Service) GenerateJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": strconv.Itoa(int(userID)),
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
