package db

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store interface {
	Querier
	CreateSeatsBulk(ctx context.Context, arg CreateSeatsParams) error
	BookSeatsTx(
		ctx context.Context,
		bookingID int64,
		paymentId string,
		showtimeID int64,
		seatIDs []int64,
		customerID int64,
		seatPrice float64) (*Booking, error)
	CreateBookingOrder(
		ctx context.Context,
		showtimeID int64,
		seatIDs []int64,
		customerID int64,
		amount float64,
	) (Booking, error)
}

type SQLStore struct {
	*Queries
	db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) Store {
	return &SQLStore{
		Queries: New(db),
		db:      db,
	}
}

type CreateSeatsParams struct {
	ScreenID int64
	Rows     int32
	Columns  int32
}

// CreateSeatsBulk inserts all seats for a screen
func (store *SQLStore) CreateSeatsBulk(ctx context.Context, arg CreateSeatsParams) error {
	values := []string{}
	args := []interface{}{}
	argPos := 1

	for r := 1; r <= int(arg.Rows); r++ {
		for c := 1; c <= int(arg.Columns); c++ {
			seatName := fmt.Sprintf("%s%d", string(rune(64+r)), c) // A1, B2
			values = append(values, fmt.Sprintf("($%d, $%d)", argPos, argPos+1))
			args = append(args, arg.ScreenID, seatName)
			argPos += 2
		}
	}

	query := fmt.Sprintf("INSERT INTO seats (screen_id, seat_name) VALUES %s ON CONFLICT DO NOTHING", strings.Join(values, ","))

	_, err := store.db.Exec(ctx, query, args...)
	return err
}

type ExecTxFunc func(*Queries) error

// execTx runs a function within a database transaction.
func (store *SQLStore) ExecTx(ctx context.Context, fn ExecTxFunc) error {
	tx, err := store.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return fmt.Errorf("could not begin transaction: %w", err)
	}
	q := New(tx)
	err = fn(q)
	if err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return fmt.Errorf("tx err: %v, rollback err: %v", err, rbErr)
		}
		return err
	}

	return tx.Commit(ctx)
}

func (store *SQLStore) CreateBookingOrder(
	ctx context.Context,
	showtimeID int64,
	seatIDs []int64,
	customerID int64,
	amount float64,
) (Booking, error) {

	// totalAmount := amount // in INR

	// 1️⃣ Lock seats and check availability (do not insert booking yet)
	availableSeats, err := store.Queries.GetSeatsByShowTimeIdAndSeatIdsForUpdate(ctx, GetSeatsByShowTimeIdAndSeatIdsForUpdateParams{
		ShowtimeID: showtimeID,
		SeatIds:    seatIDs,
	})
	if err != nil {
		return Booking{}, err
	}
	for _, s := range availableSeats {
		if s.Status != "available" {
			return Booking{}, fmt.Errorf("seat %d already booked", s.SeatID)
		}
	}
	orderID := uuid.New().String()
	booking, err := store.CreateBooking(ctx, CreateBookingParams{
		ShowtimeID: showtimeID,
		CustomerID: customerID,
		OrderID:    orderID,
		Amount:     amount,
	})
	if err != nil {
		return Booking{}, err
	}
	return booking, nil
}

func (store *SQLStore) BookSeatsTx(
	ctx context.Context,
	bookingID int64,
	paymentId string,
	showtimeID int64,
	seatIDs []int64,
	customerID int64,
	seatPrice float64,
) (*Booking, error) {

	var booking *Booking
	err := store.ExecTx(ctx, func(q *Queries) error {
		// 1️⃣ Check seat availability with lock
		availableSeatsWithLock, err := q.GetSeatsByShowTimeIdAndSeatIdsForUpdate(ctx, GetSeatsByShowTimeIdAndSeatIdsForUpdateParams{
			ShowtimeID: showtimeID,
			SeatIds:    seatIDs,
		})
		if err != nil {
			return fmt.Errorf("failed to check seat availability: %w", err)
		}
		fmt.Println(availableSeatsWithLock)
		fmt.Println(len(availableSeatsWithLock), len(seatIDs))
		if len(availableSeatsWithLock) < len(seatIDs) {
			return fmt.Errorf("some seats are already booked")
		}
		time.Sleep(time.Second * 15)
		// 2 Check seat availability Again
		availableSeats, err := q.GetSeatsByShowTimeIdAndSeatIds(ctx, GetSeatsByShowTimeIdAndSeatIdsParams{
			ShowtimeID: showtimeID,
			SeatIds:    seatIDs,
		})
		if err != nil {
			return fmt.Errorf("failed to check seat availability: %w", err)
		}
		fmt.Println(availableSeats)
		fmt.Println(len(availableSeats), len(seatIDs))
		if len(availableSeats) < len(seatIDs) {
			return fmt.Errorf("some seats are already booked")
		}
		// Convert to map for fast lookup
		availableMap := make(map[int64]bool)
		fmt.Println(availableMap)
		for _, s := range availableSeats {
			if s.Status == "available" {
				availableMap[s.SeatID] = true
			}
		}
		for _, seatID := range seatIDs {
			if !availableMap[seatID] {
				return fmt.Errorf("seat %d is already booked", seatID)
			}
		}
		booking, err := store.GetBookingById(ctx, bookingID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				message := fmt.Sprintf("unable to find the booking with id %d", booking.ID)
				return errors.New(message)
			} else {
				return err
			}
		}
		store.UpdateBookingStatus(ctx, UpdateBookingStatusParams{
			ID: booking.ID,
			// PaymentID: ,
		})

		for _, seatID := range seatIDs {
			_, err := q.CreateBookedSeat(ctx, CreateBookedSeatParams{
				BookingID:  bookingID,
				SeatID:     seatID,
				ShowTimeID: showtimeID,
				Price:      seatPrice,
			})
			if err != nil {
				return fmt.Errorf("failed to create booked seat: %w", err)
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return booking, nil
}
