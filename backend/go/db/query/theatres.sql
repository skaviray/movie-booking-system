-- name: CreateTheater :one
INSERT INTO theaters (name, location)
VALUES ($1, $2)
RETURNING *;

-- name: GetTheater :one
SELECT * FROM theaters WHERE id = $1;

-- name: ListTheaters :many
SELECT * FROM theaters ORDER BY id;

-- name: UpdateTheater :one
UPDATE theaters
SET name = $2, location = $3, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteTheater :exec
DELETE FROM theaters WHERE id = $1;
