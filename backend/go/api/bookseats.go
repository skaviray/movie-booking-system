package api

// type BookSeatsRequest struct {
// 	ShowTimeID    int64   `json:"showtime_id" binding:"required"`
// 	SeatIDs       []int64 `json:"seat_ids" binding:"required"`
// 	CustomerID    int64   `json:"customer_id"`
// 	CustomerName  string  `json:"customer_name"`
// 	CustomerEmail string  `json:"customer_email"`
// 	CustomerPhone string  `json:"customer_phone"`
// 	SeatPrice     float64 `json:"seat_price" binding:"required"`
// }

// func (s *Server) BookSeats(ctx *gin.Context) {
// 	var req BookSeatsRequest
// 	if err := ctx.ShouldBindJSON(&req); err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}
// 	booking, err := s.store.BookSeatsTx(ctx, req.ShowTimeID, req.SeatIDs, req.CustomerID, req.CustomerName, req.CustomerEmail, req.CustomerPhone, req.SeatPrice)
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse(err))
// 		return
// 	}
// 	ctx.JSON(http.StatusCreated, booking)
// }
