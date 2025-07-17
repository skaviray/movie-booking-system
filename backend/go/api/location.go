package api

import (
	"net/http"
	"strconv"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createLocationRequest struct {
	City    string `json:"city" binding:"required"`
	State   string `json:"state"`
	Country string `json:"country" binding:"required"`
	Address string `json:"address" binding:"required"`
}

func (s *Server) CreateLocation(ctx *gin.Context) {
	var req createLocationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	arg := db.CreateLocationParams{
		City:    req.City,
		State:   req.State,
		Country: req.Country,
		Address: req.Address,
	}
	location, err := s.store.CreateLocation(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, location)
}

func (s *Server) GetLocation(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	loc, err := s.store.GetLocation(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
		return
	}
	ctx.JSON(http.StatusOK, loc)
}

func (s *Server) ListLocations(ctx *gin.Context) {
	locs, err := s.store.ListLocations(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, locs)
}

func (s *Server) UpdateLocation(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	var req createLocationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.UpdateLocationParams{
		ID:      id,
		City:    req.City,
		State:   req.State,
		Country: req.Country,
		Address: req.Address,
	}
	loc, err := s.store.UpdateLocation(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, loc)
}

func (s *Server) DeleteLocation(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err := s.store.DeleteLocation(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusNoContent)
}
