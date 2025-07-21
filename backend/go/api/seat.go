package api

import (
	"net/http"
	"strconv"

	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createSeatRequest struct {
	ScreenId int32  `json:"screen_id" binding:"required"`
	Row      int32  `json:"row" binding:"required"`
	Col      int32  `json:"col" binding:"required"`
	Status   string `json:"status" binding:"required"` // available, reserved, booked
}

type UpdateSeatReq struct {
	Status string `json:"status" binding:"required"`
}

func (s *Server) CreateSeat(ctx *gin.Context) {
	var req createSeatRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.CreateSeatParams{
		ScreenID: req.ScreenId,
		Row:      req.Row,
		Col:      req.Col,
		Status:   req.Status,
	}
	seat, err := s.store.CreateSeat(ctx, args)
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
	seat, err := s.store.GetSeat(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "seat not found"})
		return
	}
	ctx.JSON(http.StatusOK, seat)
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
	args := db.UpdateSeatStatusParams{
		ID:     int64(id),
		Status: req.Status,
	}
	seat, err := s.store.UpdateSeatStatus(ctx, args)
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
	if err := s.store.DeleteSeat(ctx, int64(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "seat deleted"})
}
