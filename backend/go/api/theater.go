package api

import (
	"net/http"
	"strconv"

	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

func (s *Server) CreateTheater(ctx *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Rows    int32  `json:"rows" binding:"required"`
		Columns int32  `json:"columns" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	theater, err := s.store.CreateTheater(ctx, db.CreateTheaterParams{
		Name:    req.Name,
		Rows:    req.Rows,
		Columns: req.Columns,
	})
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
	theater, err := s.store.GetTheater(ctx, int32(id))
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

	var req struct {
		Name    string `json:"name" binding:"required"`
		Rows    int32  `json:"rows" binding:"required"`
		Columns int32  `json:"columns" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	theater, err := s.store.UpdateTheater(ctx, db.UpdateTheaterParams{
		ID:      int32(id),
		Name:    req.Name,
		Rows:    req.Rows,
		Columns: req.Columns,
	})
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
	if err := s.store.DeleteTheater(ctx, int32(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "theater deleted"})
}
