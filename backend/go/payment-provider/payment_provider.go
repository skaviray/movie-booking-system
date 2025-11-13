package paymentprovider

type Item struct {
	Name        string `json:"name" binding:"required"`
	Amount      int64  `json:"amount" binding:"required"`
	Currency    string `json:"currency" binding:"required"`
	Quantity    int64  `json:"quantity" binding:"required"`
	Description string `json:"description" binding:"required"`
}
type PaymentRequest struct {
	Items      []Item            `json:"items" binding:"required"`
	Metadata   map[string]string `json:"metadata" binding:"required"`
	SuccessURL string            `json:"success_url" binding:"required"`
	CancelURL  string            `json:"cancel_url" binding:"required"`
}

type PaymentSession struct {
	URL string
	ID  string
}
type PaymentProvider interface {
	CreatePaymentSession(req PaymentRequest) (string, error)
	VerifyWebhookSignature(body []byte, signature string) (bool, *Metadata, string, error)
	HandleWebhookEvent(event []byte) error
}
