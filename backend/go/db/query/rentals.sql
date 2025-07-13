-- name: CreateRental :one
INSERT INTO rentals (customer_id, movie_id, date_out, date_returned, rental_fee)
VALUES ($1, $2, COALESCE($3, NOW()), $4, $5)
RETURNING *;

-- name: GetRental :one
SELECT * FROM rentals WHERE id = $1 LIMIT 1;

-- name: ListRentals :many
SELECT * FROM rentals
ORDER BY id;
-- LIMIT $1 OFFSET $2;

-- name: UpdateRentalReturn :one
UPDATE rentals
SET date_returned = $2,
    rental_fee = $3
WHERE id = $1
RETURNING *;

-- name: DeleteRental :exec
DELETE FROM rentals WHERE id = $1;

-- name: LookupRental :one
SELECT * FROM rentals
WHERE customer_id = $1 AND movie_id = $2
LIMIT 1;
