package api

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	db "vividly-backend/db/sqlc"
	paymentprovider "vividly-backend/payment-provider"
	"vividly-backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgtype"
)

func (s *Server) CreatePayment(c *gin.Context) {
	var req paymentprovider.PaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	var metadata paymentprovider.Metadata

	m, err := json.Marshal(req.Metadata)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	if err := json.Unmarshal(m, &metadata); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	showtimeId, _ := strconv.ParseInt(metadata.ShowTime, 10, 64)

	amount, err := strconv.ParseFloat(metadata.Amount, 64)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	parts := strings.Split(metadata.Seats, ",")
	var seatIds []int64
	for _, p := range parts {
		n, err := strconv.ParseInt(strings.TrimSpace(p), 10, 64)
		if err != nil {
			fmt.Println("Error converting:", p, err)
			continue
		}
		seatIds = append(seatIds, n)
	}
	fmt.Println(showtimeId)
	fmt.Println(seatIds)
	fmt.Println(amount)
	booking, err := s.store.CreateBookingOrder(c, showtimeId, seatIds, 1, amount)
	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	metadata.BookingId = strconv.FormatInt(booking.ID, 10)
	updatedMetadata := make(map[string]string)
	stripeMetadata, err := json.Marshal(metadata)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	if err := json.Unmarshal(stripeMetadata, &updatedMetadata); err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	fmt.Println(updatedMetadata)
	req.Metadata = updatedMetadata
	data, err := s.paymentProvider.CreatePaymentSession(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
		return
	}
	c.JSON(http.StatusOK, gin.H{"url": data})
}

func (s *Server) HandleWebhook(c *gin.Context) {
	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
		return
	}
	signature := c.GetHeader("Stripe-Signature")
	if signature == "" {
		signature = c.GetHeader("X-Razorpay-Signature")
	}
	var metadata *paymentprovider.Metadata
	verified, metadata, payment_id, err := s.paymentProvider.VerifyWebhookSignature(body, signature)
	if payment_id != "" {
		fmt.Println(metadata.BookingId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		bookingId, err := strconv.ParseInt(metadata.BookingId, 10, 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		booking, err := s.store.GetBookingById(c, bookingId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		booking, err = s.store.UpdateBookingStatus(c, db.UpdateBookingStatusParams{
			ID: booking.ID,
			PaymentID: pgtype.Text{
				String: payment_id,
				Valid:  true,
			},
			Status: pgtype.Text{
				String: "paid",
				Valid:  true,
			},
		})
		if err != nil {
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		fmt.Println(booking)
		var seatIds []int64
		parts := strings.Split(metadata.Seats, ",")
		for _, p := range parts {
			n, err := strconv.ParseInt(strings.TrimSpace(p), 10, 64)
			if err != nil {
				c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
				return
			}
			// _, err = s.store.CreateBookedSeat(c, db.CreateBookedSeatParams{
			// 	SeatID:     n,
			// 	BookingID:  booking.ID,
			// 	ShowTimeID: 1,
			// 	Price:      100,
			// })
			// if err != nil {
			// 	c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			// 	return
			// }
			seatIds = append(seatIds, n)
		}
		bookings, err := s.store.BookSeatsTx(c, booking.ID, payment_id, booking.ShowtimeID, seatIds, 1, 100)
		if err != nil {
			fmt.Println(err.Error())
			c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
			return
		}
		fmt.Println(bookings)
	}
	c.JSON(http.StatusOK, verified)
}

// type CreatePaymentRequest struct {
// 	ShowtimeID int64   `json:"showtime_id" binding:"required"`
// 	BookingID  int64   `json:"booking_id" binding:"required"`
// 	SeatIDs    []int64 `json:"seat_ids" binding:"required"`
// 	Amount     int64   `json:"amount" binding:"required"`
// }

// func (server *Server) CreateCheckoutSession(c *gin.Context) {
// 	var req CreatePaymentRequest
// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	stripe.Key = server.config.STRIPE_SECRET_KEY
// 	params := &stripe.PaymentIntentParams{
// 		Amount:    stripe.Int64(req.Amount),
// 		Currency:  stripe.String("SEK"),
// 		ReturnURL: stripe.String(""),
// 		Metadata: map[string]string{
// 			"booking_id": fmt.Sprintf("d", req.BookingID),
// 		},
// 	}
// 	session, err := paymentintent.New(params)
// 	if err != nil {
// 		log.Printf("session.New: %v", err)
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"clientSecret": session.ClientSecret,
// 	})
// }

// func (server *Server) GetCheckoutSession(c *gin.Context) {
// 	sessionId := c.Query("session_id")
// 	s, err := session.Get(sessionId, nil)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"status":         string(s.Status),
// 		"customer_email": s.CustomerDetails.Email,
// 	})
// }
