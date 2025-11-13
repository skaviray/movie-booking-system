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

type createTheatreRequest struct {
	Name     string `json:"name" binding:"required"`
	Location int32  `json:"location" binding:"required"`
	// Rows     int32  `json:"rows" binding:"required"`
	// Columns  int32  `json:"columns" binding:"required"`
}

func (s *Server) CreateTheater(ctx *gin.Context) {
	var req createTheatreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.CreateTheaterParams{
		TheatreName: req.Name,
		Location:    req.Location,
		// Rows:    req.Rows,
		// Columns: req.Columns,
	}
	theater, err := s.store.CreateTheater(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, theater)
}

func (s *Server) GetTheater(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid theater id"})
		return
	}
	theater, err := s.store.GetTheater(ctx, int64(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "theater not found"})
		return
	}
	ctx.JSON(http.StatusOK, theater)
}

func (s *Server) ListTheaters(ctx *gin.Context) {
	theaters, err := s.store.ListTheaters(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, theaters)
}

func (s *Server) UpdateTheater(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid theater id"})
		return
	}

	var req createTheatreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.UpdateTheaterParams{
		ID:          int64(id),
		TheatreName: req.Name,
		Location:    req.Location,
	}
	theater, err := s.store.UpdateTheater(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, theater)
}

func (s *Server) DeleteTheater(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid theater id"})
		return
	}
	_, err = s.store.GetTheater(ctx, int64(id))
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the theater %d", int64(id))
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	if err := s.store.DeleteTheater(ctx, int64(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "theater deleted"})
}
