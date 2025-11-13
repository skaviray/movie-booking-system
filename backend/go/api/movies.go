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

type createMovieRequest struct {
	Title       string    `json:"title" binding:"required"`
	Description string    `json:"description"`
	Poster      string    `json:"poster" binding:"required,url"`
	Trailer     string    `json:"trailer" binding:"required,url"`
	Runtime     int64     `json:"runtime" binding:"required"`
	Language    string    `json:"language" binding:"required"`
	ReleaseDate time.Time `json:"release_date" binding:"required"`
}

type updateMovieRequest struct {
	Title       string    `json:"title"`
	Poster      string    `json:"poster" binding:"required,url"`
	Trailer     string    `json:"trailer" binding:"required,url"`
	Description string    `json:"description"`
	Runtime     int64     `json:"runtime"`
	Language    string    `json:"language"`
	GenreId     int64     `json:"genre_id"`
	ReleaseDate time.Time `json:"release_date"`
}

type movieResponse struct {
	ID          int64     `json:"id"`
	Title       string    `json:"title"`
	Poster      string    `json:"poster"`
	Trailer     string    `json:"trailer"`
	Likes       int32     `json:"likes"`
	GenreID     int64     `json:"genre_id"`
	Description string    `json:"description"`
	Runtime     int64     `json:"runtime"`
	Language    string    `json:"language"`
	ReleaseData time.Time `json:"release_data"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func newMovieResponse(m db.Movie) movieResponse {
	return movieResponse{
		ID:          m.ID,
		Title:       m.Title,
		Poster:      m.Poster,
		Likes:       m.Likes,
		Trailer:     m.Trailer,
		Description: m.Description,
		Runtime:     m.Runtime,
		Language:    m.Language,
		CreatedAt:   m.CreatedAt.Time,
		UpdatedAt:   m.UpdatedAt.Time,
		ReleaseData: m.ReleaseDate.Time,
	}
}

func (server *Server) CreateMovie(ctx *gin.Context) {
	var req createMovieRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := server.store.CreateMovie(ctx, db.CreateMovieParams{
		Title:       req.Title,
		Poster:      req.Poster,
		Trailer:     req.Trailer,
		Description: req.Description,
		Runtime:     req.Runtime,
		Language:    req.Language,
		ReleaseDate: pgtype.Date{
			Time:  req.ReleaseDate,
			Valid: true,
		},
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
		ID:          uri.ID,
		Title:       req.Title,
		Poster:      req.Poster,
		Trailer:     req.Trailer,
		Language:    req.Language,
		Description: req.Description,
		Runtime:     req.Runtime,
		ReleaseDate: pgtype.Date{
			Time:  req.ReleaseDate,
			Valid: true,
		},
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
	_, err := server.store.GetMovie(ctx, uri.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			message := fmt.Sprintf("unable to find the movie with id %d ", uri.ID)
			ctx.JSON(http.StatusNotFound, gin.H{"error": message})
			return
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
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

// func (s *Server) GetShowtimesByMovie(ctx *gin.Context) {
// 	movieIDParam := ctx.Param("id")
// 	movieID, err := strconv.Atoi(movieIDParam)
// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid movie_id"})
// 		return
// 	}

// 	showtimes, err := s.store.GetTheatersAndShowtimesByMovie(ctx, int32(movieID))
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "could not fetch showtimes"})
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, showtimes)
// }
