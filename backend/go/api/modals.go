package api

import (
	"time"
)

// User represents a user account in the system
type User struct {
	ID                int64     `json:"id"`
	Username          string    `json:"username"`
	HashedPassword    string    `json:"hashed_password"`
	Email             string    `json:"email"`
	FullName          string    `json:"full_name"`
	PasswordChangedAt time.Time `json:"password_changed_at"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
	IsAdmin           bool      `json:"is_admin"`
}

// Customer represents a movie rental customer
type Customer struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	IsGold    bool      `json:"is_gold"`
	Phone     string    `json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Genre represents the genre/category of a movie
type Genre struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Movie represents a rentable movie title
type Movie struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	GenreID         int64     `json:"genre_id"`
	NumberInStock   int16     `json:"number_in_stock"`
	DailyRentalRate float64   `json:"daily_rental_rate"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// Rental represents the record of a movie rented by a customer
type Rental struct {
	ID           int64      `json:"id"`
	CustomerID   int64      `json:"customer_id"`
	MovieID      int64      `json:"movie_id"`
	DateOut      time.Time  `json:"date_out"`
	DateReturned *time.Time `json:"date_returned"`
	RentalFee    *float64   `json:"rental_fee"`
}
