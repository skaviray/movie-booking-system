package api

import (
	"database/sql"
	"net/http"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createMovieRequest struct {
	Title           string  `json:"title" binding:"required"`
	GenreID         int32   `json:"genre_id" binding:"required"`
	NumberInStock   int32   `json:"number_in_stock" binding:"required"`
	DailyRentalRate float64 `json:"daily_rental_rate" binding:"required"`
}

type updateMovieRequest struct {
	ID              int64   `json:"id" binding:"required"`
	Title           string  `json:"title" binding:"required"`
	GenreID         int32   `json:"genre_id" binding:"required"`
	NumberInStock   int32   `json:"number_in_stock" binding:"required"`
	DailyRentalRate float64 `json:"daily_rental_rate" binding:"required"`
}

type movieResponse struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	GenreID         int32     `json:"genre_id"`
	NumberInStock   int32     `json:"number_in_stock"`
	DailyRentalRate float64   `json:"daily_rental_rate"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

func newMovieResponse(m db.Movie) movieResponse {
	return movieResponse{
		ID:              m.ID,
		Title:           m.Title,
		GenreID:         m.GenreID,
		NumberInStock:   m.NumberInStock,
		DailyRentalRate: m.DailyRentalRate,
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
		GenreID:         req.GenreID,
		NumberInStock:   req.NumberInStock,
		DailyRentalRate: req.DailyRentalRate,
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
	// var query struct {
	// 	Limit  int32 `form:"limit" binding:"required,min=1"`
	// 	Offset int32 `form:"offset" binding:"required,min=0"`
	// }

	// if err := ctx.ShouldBindQuery(&query); err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// params := db.ListMoviesParams{
	// 	Limit:  query.Limit,
	// 	Offset: query.Offset,
	// }

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
	var req updateMovieRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	movie, err := server.store.UpdateMovie(ctx, db.UpdateMovieParams{
		ID:              req.ID,
		Title:           req.Title,
		GenreID:         req.GenreID,
		NumberInStock:   req.NumberInStock,
		DailyRentalRate: req.DailyRentalRate,
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

// func (server *Server) setupMovieRoutes(router *gin.Engine) {
// 	movieRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
// 	movieRoutes.POST("/movies", server.CreateMovie)
// 	movieRoutes.GET("/movies", server.ListMovies)
// 	movieRoutes.GET("/movies/:id", server.GetMovie)
// 	movieRoutes.PATCH("/movies", server.UpdateMovie)
// 	movieRoutes.DELETE("/movies/:id", server.DeleteMovie)
// }
