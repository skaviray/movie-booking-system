package paymentprovider

import (
	"encoding/json"
	"fmt"

	"github.com/stripe/stripe-go/v83"
	"github.com/stripe/stripe-go/v83/checkout/session"
	"github.com/stripe/stripe-go/v83/webhook"
)

type StripeProvider struct {
	SecretKey     string
	WebhookSecret string
}

type Metadata struct {
	Seats     string `json:"seats" binding:"required"`
	ShowTime  string `json:"showtime" binding:"required"`
	ScreenId  string `json:"screen_id" binding:"required"`
	Amount    string `json:"amount" binding:"required"`
	BookingId string `json:"booking_id" binding:"required"`
}

func NewStripeProvider(secretKey, webHookSecret string) PaymentProvider {
	pp := &StripeProvider{
		SecretKey:     secretKey,
		WebhookSecret: webHookSecret,
	}
	return pp
}

func (pp *StripeProvider) CreatePaymentSession(req PaymentRequest) (string, error) {
	stripe.Key = pp.SecretKey
	params := &stripe.CheckoutSessionParams{
		Mode:               stripe.String("payment"),
		PaymentMethodTypes: []*string{stripe.String("card")},
		SuccessURL:         stripe.String(req.SuccessURL),
		CancelURL:          stripe.String(req.CancelURL),
		ShippingAddressCollection: &stripe.CheckoutSessionShippingAddressCollectionParams{
			AllowedCountries: []*string{stripe.String("GB"), stripe.String("IN"), stripe.String("SE"), stripe.String("US")},
		},
		CustomerEmail: stripe.String("kavirayani1991@gmail.com"),
	}
	for _, item := range req.Items {
		lineItem := &stripe.CheckoutSessionLineItemParams{
			PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
				Currency:   stripe.String(item.Currency),
				UnitAmount: stripe.Int64(item.Amount),
				ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
					Name:        &item.Name,
					Description: &item.Description,
				},
			},
			Quantity: stripe.Int64(item.Quantity),
		}
		params.LineItems = append(params.LineItems, lineItem)
	}
	if req.Metadata != nil {
		params.Metadata = req.Metadata
	}
	sess, err := session.New(params)
	if err != nil {
		return "", nil
	}
	return sess.URL, nil
}

func (pp *StripeProvider) VerifyWebhookSignature(body []byte, signature string) (bool, *Metadata, string, error) {
	event, err := webhook.ConstructEvent(body, signature, pp.WebhookSecret)
	if err != nil {
		return false, &Metadata{}, "", err
	}
	var metadata Metadata
	var payment_id string
	if event.Type == "checkout.session.completed" {
		fmt.Println(event.Data.Object)
		var session stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &session); err != nil {
			return false, &Metadata{}, payment_id, err
		}
		fmt.Println(session.Metadata)
		data, err := json.Marshal(session.Metadata)
		if err != nil {
			return false, &Metadata{}, payment_id, err
		}
		if err := json.Unmarshal(data, &metadata); err != nil {
			return false, &Metadata{}, payment_id, err
		}
		payment_id = session.PaymentIntent.ID
	}
	return true, &metadata, payment_id, nil
}

func (pp *StripeProvider) HandleWebhookEvent(event []byte) error {
	return nil
}
