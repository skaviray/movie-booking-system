-- name: CreateShowtime :one
INSERT INTO showtimes (movie_id, screen_id, start_time, price)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetShowtime :one
SELECT * FROM showtimes WHERE id = $1;

-- name: ListShowtimes :many
SELECT * FROM showtimes ORDER BY start_time;

-- name: UpdateShowtime :one
UPDATE showtimes
SET start_time = $2, price = $3, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteShowtime :exec
DELETE FROM showtimes WHERE id = $1;
