package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	db "vividly-backend/db/sqlc"
	"vividly-backend/utils"

	"github.com/gin-gonic/gin"
)

type createLocationRequest struct {
	LocationName string `json:"location_name" binding:"required"`
	City         string `json:"city" binding:"required"`
	Address      string `json:"address" binding:"required"`
}

func (s *Server) CreateLocation(ctx *gin.Context) {
	var req createLocationRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	arg := db.CreateLocationParams{
		LocationName: req.LocationName,
		City:         req.City,
		Address:      req.Address,
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
	_, err := s.store.GetLocation(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the location %d", id)
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	if err := s.store.DeleteLocation(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusNoContent)
}

func (s *Server) GetTheaterByLocationId(ctx *gin.Context) {
	var uri struct {
		Id int64 `uri:"id" binding:"required"`
	}
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	theaters, err := s.store.GetTheatersByLocation(ctx, uri.Id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusOK, theaters)
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
	}
	ctx.JSON(http.StatusOK, theaters)
}
