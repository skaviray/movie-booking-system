package api

import (
	"database/sql"
	"net/http"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type genreResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func newGenreResponse(g db.Genre) genreResponse {
	return genreResponse{
		ID:        g.ID,
		Name:      g.Name,
		CreatedAt: g.CreatedAt,
		UpdatedAt: g.UpdatedAt,
	}
}

func (server *Server) CreateGenre(ctx *gin.Context) {
	var req struct {
		Name string `json:"name" binding:"required,min=3"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre, err := server.store.CreateGenre(ctx, req.Name)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, newGenreResponse(genre))
}

func (server *Server) GetGenre(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre, err := server.store.GetGenre(ctx, uri.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "genre not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, newGenreResponse(genre))
}

func (server *Server) ListGenres(ctx *gin.Context) {
	// var query struct {
	// 	Limit  int32 `form:"limit" binding:"required,gte=1"`
	// 	Offset int32 `form:"offset" binding:"required,gte=0"`
	// }
	// if err := ctx.ShouldBindQuery(&query); err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }
	// params := db.ListGenresParams{
	// 	Limit:  query.Limit,
	// 	Offset: query.Offset,
	// }

	genres, err := server.store.ListGenres(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	res := make([]genreResponse, len(genres))
	for i, g := range genres {
		res[i] = newGenreResponse(g)
	}
	ctx.JSON(http.StatusOK, res)
}

func (server *Server) UpdateGenre(ctx *gin.Context) {
	var req struct {
		ID   int64  `json:"id" binding:"required"`
		Name string `json:"name" binding:"required,min=3"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	genre, err := server.store.UpdateGenre(ctx, db.UpdateGenreParams{
		ID:   req.ID,
		Name: req.Name,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, newGenreResponse(genre))
}

func (server *Server) DeleteGenre(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := server.store.DeleteGenre(ctx, uri.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "genre deleted"})
}
