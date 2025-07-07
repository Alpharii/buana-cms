package user

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
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

func (s *Service) GenerateJWT(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": strconv.Itoa(int(userID)),
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}