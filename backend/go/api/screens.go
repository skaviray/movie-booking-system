package api

import (
	"database/sql"
	"net/http"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type CreateScreenRequest struct {
	TheatreId int64  `json:"theater_id" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Rows      int32  `json:"rows" binding:"required"`
	Cols      int32  `json:"cols" binding:"required"`
}

type UpdateScreenRequest struct {
	TheatreId int64  `json:"theater_id" binding:"required"`
	Name      string `json:"name" binding:"required"`
}

type ScreenResponse struct {
	ID        int64     `json:"id"`
	TheatreId int32     `json:"theater_id"`
	Name      string    `json:"name"`
	Rows      int32     `json:"rows"`
	Cols      int32     `json:"cols"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func newScreenResponse(s db.Screen) ScreenResponse {
	return ScreenResponse{
		ID:        s.ID,
		TheatreId: s.TheaterID,
		Name:      s.Name,
		Rows:      s.Rows,
		Cols:      s.Cols,
		CreatedAt: s.CreatedAt,
		UpdatedAt: s.UpdatedAt,
	}
}
func (server *Server) CreateScreen(ctx *gin.Context) {
	var req CreateScreenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.CreateScreenParams{
		TheaterID: int32(req.TheatreId),
		Name:      req.Name,
		Rows:      req.Rows,
		Cols:      req.Cols,
	}
	screen, err := server.store.CreateScreen(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newScreenResponse(screen))
}

func (server *Server) GetScreen(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	screen, err := server.store.GetScreen(ctx, uri.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "screen not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newScreenResponse(screen))
}

func (server *Server) ListScreens(ctx *gin.Context) {
	screens, err := server.store.ListScreens(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]ScreenResponse, len(screens))
	for i, screen := range screens {
		responses[i] = newScreenResponse(screen)
	}

	ctx.JSON(http.StatusOK, responses)
}

func (server *Server) UpdateScreen(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var req UpdateScreenRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.UpdateScreenParams{
		ID:   uri.ID,
		Name: req.Name,
	}
	screen, err := server.store.UpdateScreen(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newScreenResponse(screen))
}

func (server *Server) DeleteScreen(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := server.store.DeleteScreen(ctx, uri.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "screen deleted"})
}
