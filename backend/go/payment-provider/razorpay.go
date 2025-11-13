package paymentprovider

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/razorpay/razorpay-go"
)

type RazorpayProvider struct {
	KeyID     string
	KeySecret string
	Client    *razorpay.Client
}

func NewRazorPayProvider(KeyID, keySecret string) PaymentProvider {
	pp := &RazorpayProvider{
		KeyID:     KeyID,
		KeySecret: keySecret,
	}
	return pp
}
func (pp *RazorpayProvider) CreatePaymentSession(req PaymentRequest) (string, error) {
	total := int64(0)
	currency := "INR"

	for _, item := range req.Items {
		total += item.Amount * item.Quantity
		currency = item.Currency
	}

	data := map[string]interface{}{
		"amount":   total,
		"currency": currency,
		"receipt":  "receipt#1",
	}
	order, err := pp.Client.Order.Create(data, nil)
	if err != nil {
		return "", err
	}

	return fmt.Sprintf("%v", order["id"]), nil
}

func (pp *RazorpayProvider) VerifyWebhookSignature(body []byte, signature string) (bool, *Metadata, string, error) {
	h := hmac.New(sha256.New, []byte(pp.KeySecret))
	h.Write(body)
	expected := hex.EncodeToString(h.Sum(nil))
	if expected != signature {
		return false, &Metadata{}, "", errors.New("invalid signature")
	}
	return true, &Metadata{}, "", nil
}

func (pp *RazorpayProvider) HandleWebhookEvent(event []byte) error {
	var evt map[string]interface{}
	if err := json.Unmarshal(event, &evt); err != nil {
		return err
	}

	fmt.Println("Received Razorpay webhook:", evt["event"])
	return nil
}

// type RazorpayClient struct {
// 	client *razorpay.Client
// }

// func NewRazorpayClient() *RazorpayClient {
// 	return &RazorpayClient{
// 		client: razorpay.NewClient("rzp_test_RJoNelTlP0Q253", "gGKl6Bq2BGkLc2QJWUUXe8Wy"),
// 	}
// }

// func (r *RazorpayClient) CreateOrder(amount float64, currency, receipt string) (map[string]interface{}, error) {
// 	data := map[string]interface{}{
// 		"amount":          amount,   // amount in paise
// 		"currency":        currency, // "INR"
// 		"receipt":         receipt,  // unique id to track order
// 		"payment_capture": 1,        // auto-capture
// 	}
// 	return r.client.Order.Create(data, nil)
// }
