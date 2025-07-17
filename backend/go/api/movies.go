package api

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createMovieRequest struct {
	Title           string    `json:"title" binding:"required"`
	Description     string    `json:"description"`
	DurationMinutes int32     `json:"duration_minutes" binding:"required"`
	Language        string    `json:"language" binding:"required"`
	GenreId         int32     `json:"genre_id" binding:"required"`
	ReleaseDate     time.Time `json:"release_date" binding:"required"`
}

type updateMovieRequest struct {
	Title           string    `json:"title"`
	Description     string    `json:"description"`
	DurationMinutes int32     `json:"duration_minutes"`
	Language        string    `json:"language"`
	GenreId         int32     `json:"genre_id"`
	ReleaseDate     time.Time `json:"release_date"`
}

type movieResponse struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	GenreID         int32     `json:"genre_id"`
	Description     string    `json:"description"`
	DurationMinutes int32     `json:"duration_minutes"`
	Language        string    `json:"language"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func newMovieResponse(m db.Movie) movieResponse {
	return movieResponse{
		ID:              m.ID,
		Title:           m.Title,
		GenreID:         m.GenreID,
		Description:     m.Description,
		DurationMinutes: m.DurationMinutes,
		Language:        m.Language,
		CreatedAt:       m.CreatedAt,
		UpdatedAt:       m.UpdatedAt,
	}
}

func (server *Server) CreateMovie(ctx *gin.Context) {
	var req createMovieRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := server.store.CreateMovie(ctx, db.CreateMovieParams{
		Title:           req.Title,
		GenreID:         req.GenreId,
		Description:     req.Description,
		DurationMinutes: req.DurationMinutes,
		Language:        req.Language,
		ReleaseDate:     req.ReleaseDate,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newMovieResponse(movie))
}

func (server *Server) GetMovie(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := server.store.GetMovie(ctx, uri.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "movie not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newMovieResponse(movie))
}

func (server *Server) ListMovies(ctx *gin.Context) {
	movies, err := server.store.ListMovies(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]movieResponse, len(movies))
	for i, movie := range movies {
		responses[i] = newMovieResponse(movie)
	}

	ctx.JSON(http.StatusOK, responses)
}

func (server *Server) UpdateMovie(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var req updateMovieRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := server.store.UpdateMovie(ctx, db.UpdateMovieParams{
		ID:              uri.ID,
		Title:           req.Title,
		GenreID:         req.GenreId,
		Language:        req.Language,
		Description:     req.Description,
		DurationMinutes: req.DurationMinutes,
		ReleaseDate:     req.ReleaseDate,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newMovieResponse(movie))
}

func (server *Server) DeleteMovie(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := server.store.DeleteMovie(ctx, uri.ID); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "movie deleted"})
}

type GetTheatersAndShowtimesByMovieRow struct {
	TheaterID   int32     `db:"theater_id"`
	TheaterName string    `db:"theater_name"`
	Location    string    `db:"location"`
	ScreenID    int32     `db:"screen_id"`
	ShowtimeID  int32     `db:"showtime_id"`
	StartTime   time.Time `db:"start_time"`
}

// type TheaterShowtimeResponse struct {
// 	TheaterID  int32     `json:"theater_id"`
// 	Name       string    `json:"name"`
// 	Location   string    `json:"location"`
// 	ScreenID   int32     `json:"screen_id"`
// 	ShowtimeID int32     `json:"showtime_id"`
// 	StartTime  time.Time `json:"start_time"`
// }

func (s *Server) GetShowtimesByMovie(ctx *gin.Context) {
	movieIDParam := ctx.Param("id")
	movieID, err := strconv.Atoi(movieIDParam)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid movie_id"})
		return
	}

	showtimes, err := s.store.GetTheatersAndShowtimesByMovie(ctx, int32(movieID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch showtimes"})
		return
	}

	ctx.JSON(http.StatusOK, showtimes)
}
