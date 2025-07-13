package api

import (
	"context"
	"fmt"
	"time"
	db "vividly-backend/db/sqlc"
	"vividly-backend/token"
	"vividly-backend/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	config     utils.Config
	store      db.Store
	tokenMaker token.Maker
	router     *gin.Engine
}

func New(store db.Store, config utils.Config) (*Server, error) {
	maker, err := token.NewPasetoMaker(config.SecretKey)
	if err != nil {
		return nil, fmt.Errorf("unable to create token maker: %c", err)
	}
	server := &Server{
		config:     config,
		store:      store,
		tokenMaker: maker,
	}
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		v.RegisterValidation("currency", validCurrency)
	}
	server.setupRouter()
	return server, nil
}
func (server *Server) setupRouter() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Adjust based on your frontend URL
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "PUT"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/register", server.CreateUser)
		authRoutes.POST("/login", server.LoginUser)
		authRoutes.GET("/movies/:id", server.GetMovie)
		authRoutes.GET("/movies", server.ListMovies)
		authRoutes.POST("/movies", server.CreateMovie)
		authRoutes.PUT("/movies/:id", server.UpdateMovie)
		authRoutes.DELETE("/movies/:id", server.DeleteMovie)
		authRoutes.GET("/genres", server.ListGenres)
		authRoutes.GET("/genres/:id", server.GetGenre)
		authRoutes.POST("/users", server.CreateUser)

	}

	protected := router.Group("/").Use(authMiddleware(server.tokenMaker))
	// protected.GET("/", server.GetUser)
	protected.POST("/users", server.CreateUser)
	protected.GET("/users/:id", server.GetUser)
	protected.GET("/users", server.ListUsers)
	protected.PATCH("/users/password", server.UpdateUserPassword)
	protected.DELETE("/users/:id", server.DeleteUser)
	// customers Routes
	protected.POST("/customers", server.CreateCustomer)
	protected.GET("/customers", server.ListCustomers)
	protected.GET("/customers/:id", server.GetCustomer)
	protected.PATCH("/customers", server.UpdateCustomer)
	protected.DELETE("/customers/:id", server.DeleteCustomer)
	// Movies Routes
	authRoutes.PATCH("/movies", server.UpdateMovie)
	// protected.DELETE("/movies/:id", server.DeleteMovie)
	// Genres Routess
	protected.POST("/genres", server.CreateGenre)
	protected.PATCH("/genres", server.UpdateGenre)
	protected.DELETE("/genres/:id", server.DeleteGenre)
	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func (server *Server) CreateDefaultAdminUser() error {
	ctx := context.Background()
	email := "admin@example.com"
	password := "Admin123@" // You can hash this

	// Check if admin exists
	_, err := server.store.GetUserByEmail(ctx, email)
	if err == nil {
		return nil // Admin already exists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}
	arg := db.CreateUserParams{
		Username:          "admin",
		HashedPassword:    string(hashedPassword),
		Email:             email,
		FullName:          "System Admin",
		PasswordChangedAt: time.Now(),
		IsAdmin:           true,
	}

	_, err = server.store.CreateUser(ctx, arg)
	if err != nil {
		return fmt.Errorf("failed to create default admin user: %w", err)
	}

	return nil
}
