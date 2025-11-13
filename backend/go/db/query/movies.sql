-- name: CreateMovie :one
INSERT INTO movies (title, description,poster,likes,trailer, runtime, language, release_date)
VALUES ($1, $2, $3, $4, $5, $6,$7,$8)
RETURNING *;

-- name: GetMovie :one
SELECT * FROM movies WHERE id = $1;

-- name: ListMovies :many
SELECT * FROM movies ORDER BY id;

-- name: UpdateMovie :one
UPDATE movies
SET title=$2, description=$3,poster=$4,likes=$5,trailer=$6, runtime=$7, language=$8, release_date=$9, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteMovie :exec
DELETE FROM movies WHERE id = $1;
