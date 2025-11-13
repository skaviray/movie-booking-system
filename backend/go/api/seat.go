package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createSeatRequest struct {
	ScreenId int64  `json:"screen_id" binding:"required"`
	SeatName string `json:"row" binding:"required"`
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
		SeatName: req.SeatName,
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

func (s *Server) GetAvailableSeatsByShowTimeId(ctx *gin.Context) {
	var uri struct {
		Id int64 `uri:"id" binding:"required"`
	}
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := s.store.GetShowtime(ctx, uri.Id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the movie with id %d", uri.Id)
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	seats, err := s.store.GetAvailableSeatsByShowTimeId(ctx, uri.Id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, seats)
}
