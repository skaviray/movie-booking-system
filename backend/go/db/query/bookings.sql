-- name: CreateBooking :one
INSERT INTO bookings (
  showtime_id,
  customer_id,
  order_id,
  payment_id,
  amount
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING *;

-- name: GetBookingById :one
SELECT * FROM bookings
WHERE id = $1 LIMIT 1;

-- -- name: ListBookings :many
-- SELECT * FROM bookings
-- ORDER BY updated_at DESC
-- LIMIT $1 OFFSET $2;

-- name: GetBookingsByShowtime :many
SELECT * FROM bookings
WHERE showtime_id = $1
ORDER BY updated_at DESC;

-- name: UpdateBookingStatus :one
UPDATE bookings
SET payment_id= $2, status = $3
WHERE id = $1
RETURNING *;

-- -- name: DeleteBooking :exec
-- DELETE FROM bookings
-- WHERE id = $1;
