package api

import (
	"database/sql"
	"net/http"
	"time"
	db "vividly-backend/db/sqlc"

	"github.com/gin-gonic/gin"
)

type createCustomerRequest struct {
	Name   string `json:"name" binding:"required,min=5,max=50"`
	IsGold bool   `json:"is_gold"`
	Phone  string `json:"phone" binding:"required,min=5,max=50"`
}

type updateCustomerRequest struct {
	ID     int64  `json:"id" binding:"required"`
	Name   string `json:"name" binding:"required,min=5,max=50"`
	IsGold bool   `json:"is_gold"`
	Phone  string `json:"phone" binding:"required,min=5,max=50"`
}

type customerResponse struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	IsGold    bool      `json:"is_gold"`
	Phone     string    `json:"phone"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func newCustomerResponse(c db.Customer) customerResponse {
	return customerResponse{
		ID:        c.ID,
		Name:      c.Name,
		IsGold:    c.IsGold,
		Phone:     c.Phone,
		CreatedAt: c.CreatedAt,
		UpdatedAt: c.UpdatedAt,
	}
}

func (server *Server) CreateCustomer(ctx *gin.Context) {
	var req createCustomerRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	arg := db.CreateCustomerParams{
		Name:   req.Name,
		IsGold: req.IsGold,
		Phone:  req.Phone,
	}

	customer, err := server.store.CreateCustomer(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newCustomerResponse(customer))
}

func (server *Server) GetCustomer(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer, err := server.store.GetCustomer(ctx, uri.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newCustomerResponse(customer))
}

func (server *Server) ListCustomers(ctx *gin.Context) {
	// var query struct {
	// 	Limit  int32 `form:"limit" binding:"required,min=1"`
	// 	Offset int32 `form:"offset" binding:"required,min=0"`
	// }

	// if err := ctx.ShouldBindQuery(&query); err != nil {
	// 	ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// s := db.ListCustomersParams{
	// 	Limit:  query.Limit,
	// 	Offset: query.Offset,
	// }

	customers, err := server.store.ListCustomers(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	responses := make([]customerResponse, len(customers))
	for i, customer := range customers {
		responses[i] = newCustomerResponse(customer)
	}

	ctx.JSON(http.StatusOK, responses)
}

func (server *Server) UpdateCustomer(ctx *gin.Context) {
	var req updateCustomerRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer, err := server.store.UpdateCustomer(ctx, db.UpdateCustomerParams{
		ID:     req.ID,
		Name:   req.Name,
		IsGold: req.IsGold,
		Phone:  req.Phone,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, newCustomerResponse(customer))
}

func (server *Server) DeleteCustomer(ctx *gin.Context) {
	var uri struct {
		ID int64 `uri:"id" binding:"required"`
	}

	if err := ctx.ShouldBindUri(&uri); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := server.store.DeleteCustomer(ctx, uri.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "customer deleted"})
}

// func (server *Server) setupCustomerRoutes(router *gin.Engine) {
// 	customerRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
// 	customerRoutes.POST("/customers", server.CreateCustomer)
// 	customerRoutes.GET("/customers", server.ListCustomers)
// 	customerRoutes.GET("/customers/:id", server.GetCustomer)
// 	customerRoutes.PATCH("/customers", server.UpdateCustomer)
// 	customerRoutes.DELETE("/customers/:id", server.DeleteCustomer)
// }
