-- name: CreateSeat :one
INSERT INTO seats (screen_id, row, col, status)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetSeat :one
SELECT * FROM seats WHERE id = $1;

-- name: ListSeatsByScreen :many
SELECT * FROM seats WHERE screen_id = $1 ORDER BY row, col;

-- name: UpdateSeatStatus :one
UPDATE seats
SET status = $2, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteSeat :exec
DELETE FROM seats WHERE id = $1;
