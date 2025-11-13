package api

import (
	"context"
	"fmt"
	"time"
	db "vividly-backend/db/sqlc"
	paymentprovider "vividly-backend/payment-provider"
	"vividly-backend/token"
	"vividly-backend/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/razorpay/razorpay-go"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	config          utils.Config
	store           db.Store
	tokenMaker      token.Maker
	razorPayClient  *razorpay.Client
	paymentProvider paymentprovider.PaymentProvider
	router          *gin.Engine
}

func New(store db.Store, config utils.Config) (*Server, error) {
	maker, err := token.NewPasetoMaker(config.SecretKey)
	var paymentProvider paymentprovider.PaymentProvider
	if config.PSP == "razorpay" {
		paymentProvider = paymentprovider.NewRazorPayProvider(config.RazorpayKey, config.RazorpaySecret)
	} else {
		paymentProvider = paymentprovider.NewStripeProvider(config.Stripe_Secret_Key, config.Stripe_Webhook_Secret)
	}

	razorPayClient := razorpay.NewClient(config.RazorpayKey, config.RazorpaySecret)
	if err != nil {
		return nil, fmt.Errorf("unable to create token maker: %c", err)
	}
	server := &Server{
		config:          config,
		store:           store,
		tokenMaker:      maker,
		paymentProvider: paymentProvider,
		razorPayClient:  razorPayClient,
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
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://localhost:3002"}, // Adjust based on your frontend URL
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	authRoutes := router.Group("/api")
	{
		// User Public Routes
		authRoutes.POST("/register", server.CreateUser)
		authRoutes.POST("/login", server.LoginUser)
		authRoutes.POST("/users", server.CreateUser)
		authRoutes.GET("/userinfo", server.GetUserInfo)

		// Movies Public Routes
		authRoutes.GET("/movies", server.ListMovies)
		authRoutes.GET("/movies/:id", server.GetMovie)
		authRoutes.GET("/movies/:id/showtimes", server.GetShowtimesByMovieId)

		// Movies Locations Routes
		authRoutes.GET("/locations", server.ListLocations)
		authRoutes.GET("/locations/:id", server.GetLocation)
		authRoutes.GET("/locations/:id/theaters", server.GetTheaterByLocationId)

		// Theatre public routes
		// authRoutes.GET("/theaters/:id/seats", server.ListSeatsByTheater)
		authRoutes.GET("/theatres/:id", server.GetTheater)
		authRoutes.GET("/theatres", server.ListTheaters)

		// Screens public routes
		authRoutes.GET("/screens", server.ListScreens)
		authRoutes.GET("/screens/:id", server.GetScreen)

		// showtime public routes
		authRoutes.GET("/showtimes", server.ListShowTimes)
		authRoutes.GET("/showtimes/:id", server.GetShowTime)
		authRoutes.GET("/showtimes/:id/available-seats", server.GetAvailableSeatsByShowTimeId)

		// Seats Public Routes
		authRoutes.POST("/seats", server.CreateSeat)
		authRoutes.PUT("/seats", server.CreateSeat)
		// authRoutes.POST("/book-seats", server.BookSeats)
		// Payment routes
		// authRoutes.POST("/create-order", server.CreateOrder)
		// authRoutes.POST("/verify-payment", server.VerifySignature)
		authRoutes.POST("/payment", server.CreatePayment)
		authRoutes.POST("/webhook", server.HandleWebhook)
		// Customer Routes
		authRoutes.POST("/customers", server.CreateCustomer)
		authRoutes.GET("/customers", server.ListCustomers)
		authRoutes.GET("/customers/:id", server.GetCustomer)
	}

	protected := router.Group("/api").Use(server.authMiddleware(), server.isAdmin())
	// protected.GET("/", server.GetUser)
	// protected.POST("/users", server.CreateUser)
	protected.GET("/users/:id", server.GetUser)
	protected.GET("/users", server.ListUsers)
	protected.PATCH("/users/password", server.UpdateUserPassword)
	protected.DELETE("/users/:id", server.DeleteUser)

	// customers Routes
	protected.PATCH("/customers", server.UpdateCustomer)
	protected.DELETE("/customers/:id", server.DeleteCustomer)

	// Location Routes
	protected.POST("/locations", server.CreateLocation)
	protected.PUT("/locations/:id", server.UpdateLocation)
	protected.DELETE("/locations/:id", server.DeleteLocation)

	// Movies Routes
	protected.POST("/movies", server.CreateMovie)
	protected.PUT("/movies/:id", server.UpdateMovie)
	protected.DELETE("/movies/:id", server.DeleteMovie)

	//Theater Routes
	protected.POST("/theatres", server.CreateTheater)
	protected.PUT("/theatres/:id", server.UpdateTheater)
	protected.DELETE("/theatres/:id", server.DeleteTheater)

	//Seats Routes
	protected.GET("/seats/:id", server.GetSeat)

	//Screen Routes
	protected.POST("/screens", server.CreateScreen)
	protected.PUT("/screens/:id", server.UpdateScreen)
	protected.DELETE("/screens/:id", server.DeleteScreen)
	// Showtimes Protected Routes
	authRoutes.POST("/showtimes", server.CreateShowTime)
	authRoutes.PUT("/showtimes/:id", server.UpdateShowTime)
	authRoutes.DELETE("/showtimes/:id", server.DeleteShowTime)
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
		Username:       "admin",
		HashedPassword: string(hashedPassword),
		Email:          email,
		FullName:       "System Admin",
		PasswordChangedAt: pgtype.Timestamptz{
			Time:  time.Now(),
			Valid: true,
		},
		IsAdmin: true,
	}

	_, err = server.store.CreateUser(ctx, arg)
	if err != nil {
		return fmt.Errorf("failed to create default admin user: %w", err)
	}

	return nil
}
