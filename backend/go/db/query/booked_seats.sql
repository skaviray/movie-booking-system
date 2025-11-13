-- name: CreateBookedSeat :one
INSERT INTO booked_seats (
  booking_id,
  seat_id,
  show_time_id,
  price
) VALUES (
  $1, $2, $3, $4
)
RETURNING *;

-- name: CreateBookedSeatsBatch :copyfrom
INSERT INTO booked_seats (
  booking_id,
  seat_id,
  show_time_id,
  price
) VALUES ($1, $2, $3, $4);

-- name: GetBookedSeat :one
SELECT * FROM booked_seats
WHERE id = $1 LIMIT 1;

-- -- name: ListBookedSeatsByBooking :many
-- SELECT bs.*, s.row, s.col, s.screen_id
-- FROM booked_seats bs
-- JOIN seats s ON s.id = bs.seat_id
-- WHERE bs.booking_id = $1
-- ORDER BY bs.id;

-- -- name: ListBookedSeatsByShowtime :many
-- SELECT bs.*, s.row, s.col, s.screen_id, b.showtime_id
-- FROM booked_seats bs
-- JOIN bookings b ON b.id = bs.booking_id
-- JOIN seats s ON s.id = bs.seat_id
-- WHERE b.showtime_id = $1
-- ORDER BY bs.id;

-- -- name: DeleteBookedSeatsByBooking :exec
-- DELETE FROM booked_seats
-- WHERE booking_id = $1;

-- -- name: DeleteBookedSeat :exec
-- DELETE FROM booked_seats
-- WHERE id = $1;
