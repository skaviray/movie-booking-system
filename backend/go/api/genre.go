package api

import (
	"net/http"
	"strconv"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createGenreRequest struct {
	Name string `json:"name" binding:"required"`
}

type updateGenreRequest struct {
	Name string `json:"name"`
}

func (s *Server) CreateGenre(ctx *gin.Context) {
	var req createGenreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre, err := s.store.CreateGenre(ctx, req.Name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, genre)
}

func (s *Server) GetGenre(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	genre, err := s.store.GetGenre(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Genre not found"})
		return
	}
	ctx.JSON(http.StatusOK, genre)
}

func (s *Server) ListGenres(ctx *gin.Context) {
	genres, err := s.store.ListGenres(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, genres)
}

func (s *Server) UpdateGenre(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	var req updateGenreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var updateParams db.UpdateGenreParams
	updateParams.ID = id
	updateParams.Name = req.Name
	genre, err := s.store.UpdateGenre(ctx, updateParams)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, genre)
}

func (s *Server) DeleteGenre(ctx *gin.Context) {
	id, _ := strconv.ParseInt(ctx.Param("id"), 10, 64)
	if err := s.store.DeleteGenre(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.Status(http.StatusNoContent)
}
