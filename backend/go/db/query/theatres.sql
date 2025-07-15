-- name: CreateTheater :one
INSERT INTO theaters (name, rows, columns)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetTheater :one
SELECT * FROM theaters
WHERE id = $1;

-- name: ListTheaters :many
SELECT * FROM theaters
ORDER BY id;

-- name: UpdateTheater :one
UPDATE theaters
SET name = $2, rows = $3, columns = $4
WHERE id = $1
RETURNING *;

-- name: DeleteTheater :exec
DELETE FROM theaters
WHERE id = $1;
