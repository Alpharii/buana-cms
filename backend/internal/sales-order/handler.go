package salesorder

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	Service *Service
}

func NewHandler(s *Service) *Handler {
	return &Handler{Service: s}
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var input struct {
		NoOrder  string `json:"no_order"`
		Tanggal  string `json:"tanggal"`
		UserID   uint   `json:"user_id"`
		KlienID  uint   `json:"klien_id"`
		Status   string `json:"status"`
		Items    []struct {
			BarangID     uint    `json:"barang_id"`
			Jumlah       int     `json:"jumlah"`
			HargaSatuan  float64 `json:"harga_satuan"`
		} `json:"items"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	tanggal, _ := time.Parse(time.RFC3339, input.Tanggal)

	order := SalesOrder{
		NoOrder:  input.NoOrder,
		Tanggal:  tanggal,
		UserID:   input.UserID,
		KlienID:  input.KlienID,
		Status:   input.Status,
	}

	for _, i := range input.Items {
		order.Items = append(order.Items, SalesOrderItem{
			BarangID:    i.BarangID,
			Jumlah:      i.Jumlah,
			HargaSatuan: i.HargaSatuan,
		})
	}

	if err := h.Service.CreateSalesOrder(&order); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(order)
}

func (h *Handler) GetAll(c *fiber.Ctx) error {
	data, err := h.Service.GetAllSalesOrders()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(data)
}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}
	data, err := h.Service.GetSalesOrderByID(uint(id))
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "not found"})
	}
	return c.JSON(data)
}

func (h *Handler) Update(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	var input struct {
		NoOrder string `json:"no_order"`
		Tanggal string `json:"tanggal"`
		KlienID uint   `json:"klien_id"`
		Status  string `json:"status"`
		Items   []struct {
			BarangID    uint    `json:"barang_id"`
			Jumlah      int     `json:"jumlah"`
			HargaSatuan float64 `json:"harga_satuan"`
		} `json:"items"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid input"})
	}

	tanggal, _ := time.Parse(time.RFC3339, input.Tanggal)

	order := SalesOrder{
		NoOrder: input.NoOrder,
		Tanggal: tanggal,
		KlienID: input.KlienID,
		Status:  input.Status,
	}

	for _, i := range input.Items {
		order.Items = append(order.Items, SalesOrderItem{
			BarangID:    i.BarangID,
			Jumlah:      i.Jumlah,
			HargaSatuan: i.HargaSatuan,
		})
	}

	if err := h.Service.UpdateSalesOrder(uint(id), &order); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Sales order updated"})
}

func (h *Handler) Delete(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "invalid id"})
	}

	if err := h.Service.DeleteSalesOrder(uint(id)); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Deleted"})
}
