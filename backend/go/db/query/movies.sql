-- name: CreateMovie :one
INSERT INTO movies (title, description,poster,likes,trailer, duration_minutes, language, genre_id, release_date)
VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9)
RETURNING *;

-- name: GetMovie :one
SELECT * FROM movies WHERE id = $1;

-- name: ListMovies :many
SELECT * FROM movies ORDER BY id;

-- name: UpdateMovie :one
UPDATE movies
SET title=$2, description=$3,poster=$4,likes=$5,trailer=$6, duration_minutes=$7, language=$8, genre_id=$9, release_date=$10, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteMovie :exec
DELETE FROM movies WHERE id = $1;
