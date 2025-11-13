package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

type createShowTime struct {
	MovieId   int64     `json:"movie_id" binding:"required"`
	ScreenId  int64     `json:"screen_id" binding:"required"`
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime   time.Time `json:"end_time" binding:"required"`
	Price     float64   `json:"price" binding:"required"`
}

type updateShowTimeRequest struct {
	StartTime time.Time `json:"start_time" binding:"required"`
	EndTime   time.Time `json:"end_time" binding:"required"`
	Price     float64   `json:"price" binding:"required"`
}

type showTimeResponse struct {
	ID        int64     `json:"id"`
	MovieId   int64     `json:"movie_id"`
	ScreenId  int64     `json:"screen_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func newShowTimeResponse(show db.Showtime) showTimeResponse {
	return showTimeResponse{
		ID:        show.ID,
		MovieId:   show.MovieID,
		ScreenId:  show.ScreenID,
		StartTime: show.StartTime.Time,
		Price:     show.Price,
		CreatedAt: show.CreatedAt.Time,
		UpdatedAt: show.UpdatedAt.Time,
	}
}

func (server *Server) CreateShowTime(ctx *gin.Context) {
	var req createShowTime
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.CreateShowtimeParams{
		MovieID:  req.MovieId,
		ScreenID: req.ScreenId,
		StartTime: pgtype.Timestamp{
			Time:  req.StartTime,
			Valid: true,
		},
		EndTime: pgtype.Timestamp{
			Time:  req.EndTime,
			Valid: true,
		},
		Price: req.Price,
	}
	show, err := server.store.CreateShowtime(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newShowTimeResponse(show))
}

func (server *Server) GetShowTime(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	show, err := server.store.GetShowtime(ctx, uri.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "ShowTime not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newShowTimeResponse(show))
}

func (server *Server) ListShowTimes(ctx *gin.Context) {
	showTimes, err := server.store.ListShowtimes(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]showTimeResponse, len(showTimes))
	for i, show := range showTimes {
		responses[i] = newShowTimeResponse(show)
	}

	ctx.JSON(http.StatusOK, responses)
}

func (server *Server) UpdateShowTime(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var req updateShowTimeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	args := db.UpdateShowtimeParams{
		ID: uri.ID,
		StartTime: pgtype.Timestamp{
			Time:  req.StartTime,
			Valid: true,
		},
		EndTime: pgtype.Timestamp{
			Time:  req.EndTime,
			Valid: true,
		},
		Price: req.Price,
	}
	show, err := server.store.UpdateShowtime(ctx, args)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newShowTimeResponse(show))
}

func (server *Server) DeleteShowTime(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := server.store.GetShowtime(ctx, uri.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the showtime %d", uri.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	if err := server.store.DeleteShowtime(ctx, uri.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Showtime deleted"})
}

func (s *Server) GetShowtimesByMovieId(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}
	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := s.store.GetMovie(ctx, uri.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the movie with id %d", uri.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	showtimes, err := s.store.GetShowtimesByMovieID(ctx, uri.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, showtimes)
}
