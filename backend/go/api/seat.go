package api

import (
	"net/http"
	"strconv"

	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

func (s *Server) CreateSeat(ctx *gin.Context) {
	var req struct {
		TheaterID int32  `json:"theater_id" binding:"required"`
		Row       int32  `json:"row" binding:"required"`
		Col       int32  `json:"col" binding:"required"`
		Status    string `json:"status" binding:"required"` // available, reserved, booked
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	seat, err := s.store.CreateSeat(ctx, db.CreateSeatParams{
		TheaterID: req.TheaterID,
		Row:       req.Row,
		Col:       req.Col,
		Status:    req.Status,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, seat)
}

func (s *Server) GetSeat(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid seat id"})
		return
	}
	seat, err := s.store.GetSeat(ctx, int32(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "seat not found"})
		return
	}
	ctx.JSON(http.StatusOK, seat)
}

func (s *Server) ListSeatsByTheater(ctx *gin.Context) {
	theaterID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid theater id"})
		return
	}
	seats, err := s.store.ListSeatsByTheater(ctx, int32(theaterID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, seats)
}

func (s *Server) UpdateSeatStatus(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid seat id"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"` // available, reserved, booked
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	seat, err := s.store.UpdateSeatStatus(ctx, db.UpdateSeatStatusParams{
		ID:     int32(id),
		Status: req.Status,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, seat)
}

func (s *Server) DeleteSeat(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid seat id"})
		return
	}
	if err := s.store.DeleteSeat(ctx, int32(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "seat deleted"})
}
