-- name: CreateSeat :one
INSERT INTO seats (theater_id, row, col, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetSeat :one
SELECT * FROM seats
WHERE id = $1;

-- name: ListSeatsByTheater :many
SELECT * FROM seats
WHERE theater_id = $1
ORDER BY row, col;

-- name: UpdateSeatStatus :one
UPDATE seats
SET status = $2
WHERE id = $1
RETURNING *;

-- name: DeleteSeat :exec
DELETE FROM seats
WHERE id = $1;
