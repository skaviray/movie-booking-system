package api

// func (server *Server) CreateOrder(c *gin.Context) {
// 	var req struct {
// 		ShowtimeID int64   `json:"showtime_id" binding:"required"`
// 		SeatIDs    []int64 `json:"seat_ids" binding:"required"`
// 		CustomerId int64   `json:"customer_id" binding:"required"`
// 		Amount     int64   `json:"amount" binding:"required"`
// 	}
// 	fmt.Println(req.Amount)
// 	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
// 		c.JSON(http.StatusBadRequest, utils.ErrorResponse(err))
// 		return
// 	}
// 	details, err := server.store.CreatePaymentOrder(c, req.ShowtimeID, req.SeatIDs, req.CustomerId, float64(req.Amount))
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, details)
// }

// func (server *Server) VerifySignature(c *gin.Context) {
// 	var req struct {
// 		BookingId  int64   `json:"booking_id"`
// 		OrderID    string  `json:"order_id"`
// 		PaymentID  string  `json:"payment_id"`
// 		Signature  string  `json:"signature"`
// 		ShowTimeID int64   `json:"showtime_id" binding:"required"`
// 		SeatIDs    []int64 `json:"seat_ids" binding:"required"`
// 		CustomerID int64   `json:"customer_id"`
// 		Amount     float64 `json:"amount" binding:"required"`
// 	}

// 	if err := c.ShouldBindJSON(&req); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
// 		return
// 	}

// 	secret := server.config.RazorpaySecret
// 	payload := req.OrderID + "|" + req.PaymentID

// 	h := hmac.New(sha256.New, []byte(secret))
// 	h.Write([]byte(payload))
// 	expectedSignature := hex.EncodeToString(h.Sum(nil))

// 	if expectedSignature != req.Signature {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Signature verification failed"})
// 		return
// 	}
// 	booking, err := server.store.BookSeatsTx(c,
// 		req.OrderID,
// 		req.PaymentID,
// 		req.ShowTimeID,
// 		req.SeatIDs,
// 		req.CustomerID,
// 		req.Amount)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{
// 		"status":  "success",
// 		"booking": booking,
// 	})
// 	// c.JSON(http.StatusOK, gin.H{"status": "Payment verified"})
// }
