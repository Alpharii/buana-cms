package salesorder

import (
	"errors"

	"buana-cms/internal/entity"

	"gorm.io/gorm"
)

type Service struct {
	DB *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{DB: db}
}

// ✅ CREATE ORDER
func (s *Service) CreateSalesOrder(order *entity.SalesOrder) error {
	tx := s.DB.Begin()

	totalHarga := 0.0
	for i := range order.Items {
		item := &order.Items[i]
		item.Subtotal = item.HargaSatuan * float64(item.Jumlah)
		totalHarga += item.Subtotal

		// ✅ kurangi stok barang (pakai model struct, bukan string)
		if err := tx.Model(&entity.Barang{}).
			Where("id = ?", item.BarangID).
			UpdateColumn("stok", gorm.Expr("stok - ?", item.Jumlah)).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	order.TotalHarga = totalHarga
	if err := tx.Create(order).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// ✅ GET ALL
func (s *Service) GetAllSalesOrders() ([]entity.SalesOrder, error) {
	var list []entity.SalesOrder
	err := s.DB.
		Preload("Klien").
		Preload("User").
		Preload("User.Profile").
		Preload("Items").
		Preload("Items.Barang").
		Find(&list).Error
	return list, err
}
func (s *Service) GetSalesOrdersByDateRange(start, end string) ([]entity.SalesOrder, error) {
	var list []entity.SalesOrder

	// parsing tanggal ke time.Time (opsional, untuk validasi)
	// format dari frontend: yyyy-mm-dd
	// kalau tidak perlu validasi, bisa langsung gunakan string saja di where clause
	err := s.DB.
		Preload("Klien").
		Preload("User").
		Preload("Items").
		Preload("Items.Barang").
		Where("tanggal BETWEEN ? AND ?", start, end).
		Find(&list).Error

	return list, err
}


// ✅ GET BY ID
func (s *Service) GetSalesOrderByID(id uint) (*entity.SalesOrder, error) {
	var order entity.SalesOrder
	err := s.DB.
		Preload("Klien").
		Preload("User").
		Preload("Items").
		Preload("Items.Barang").
		First(&order, id).Error

	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (s *Service) UpdateSalesOrder(id uint, updated *entity.SalesOrder) error {
	var existing entity.SalesOrder
	if err := s.DB.Preload("Items").First(&existing, id).Error; err != nil {
		return err
	}

	tx := s.DB.Begin()

	// Kembalikan stok lama
	for _, item := range existing.Items {
		if err := tx.Model(&entity.Barang{}).
			Where("id = ?", item.BarangID).
			UpdateColumn("stok", gorm.Expr("stok + ?", item.Jumlah)).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Hapus semua item lama
	if err := tx.Where("sales_order_id = ?", existing.ID).Delete(&entity.SalesOrderItem{}).Error; err != nil {
		tx.Rollback()
		return err
	}


	// Tambah item baru dan hitung total
	total := 0.0
	for _, newItem := range updated.Items {
		newItem.SalesOrderID = existing.ID
		newItem.Subtotal = newItem.HargaSatuan * float64(newItem.Jumlah)
		total += newItem.Subtotal

		// Kurangi stok baru
		if err := tx.Model(&entity.Barang{}).
			Where("id = ?", newItem.BarangID).
			UpdateColumn("stok", gorm.Expr("stok - ?", newItem.Jumlah)).Error; err != nil {
			tx.Rollback()
			return err
		}

		if err := tx.Create(&newItem).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Update field utama + total harga
	if err := tx.Model(&existing).Updates(map[string]interface{}{
		"no_order":    updated.NoOrder,
		"tanggal":     updated.Tanggal,
		"klien_id":    updated.KlienID,
		"status":      updated.Status,
		"total_harga": total,
	}).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// ✅ DELETE (hanya draft)
func (s *Service) DeleteSalesOrder(id uint) error {
	var order entity.SalesOrder
	if err := s.DB.Preload("Items").First(&order, id).Error; err != nil {
		return err
	}

	if order.Status != "draft" {
		return errors.New("hanya order draft yang bisa dihapus")
	}

	tx := s.DB.Begin()

	// ✅ kembalikan stok barang
	for _, item := range order.Items {
		if err := tx.Model(&entity.Barang{}).
			Where("id = ?", item.BarangID).
			UpdateColumn("stok", gorm.Expr("stok + ?", item.Jumlah)).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	if err := tx.Delete(&order).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
