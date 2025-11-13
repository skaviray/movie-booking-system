package utils

import (
	"github.com/razorpay/razorpay-go"
)

type RazorpayClient struct {
	client *razorpay.Client
}

func NewRazorpayClient() *RazorpayClient {
	return &RazorpayClient{
		client: razorpay.NewClient("rzp_test_RJoNelTlP0Q253", "gGKl6Bq2BGkLc2QJWUUXe8Wy"),
	}
}

// CreateOrder creates a Razorpay order for the total amount (in paise)
func (r *RazorpayClient) CreateOrder(amount float64, currency, receipt string) (map[string]interface{}, error) {
	data := map[string]interface{}{
		"amount":          amount,   // amount in paise
		"currency":        currency, // "INR"
		"receipt":         receipt,  // unique id to track order
		"payment_capture": 1,        // auto-capture
	}
	return r.client.Order.Create(data, nil)
}
