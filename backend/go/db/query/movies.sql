-- name: CreateMovie :one
INSERT INTO movies (title, genre_id, number_in_stock, daily_rental_rate)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetMovie :one
SELECT * FROM movies WHERE id = $1 LIMIT 1;

-- name: ListMovies :many
SELECT * FROM movies
ORDER BY id;
-- LIMIT $1 OFFSET $2;

-- name: UpdateMovie :one
UPDATE movies
SET title = $2,
    genre_id = $3,
    number_in_stock = $4,
    daily_rental_rate = $5
WHERE id = $1
RETURNING *;

-- name: DeleteMovie :exec
DELETE FROM movies WHERE id = $1;
