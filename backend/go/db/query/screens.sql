-- name: CreateScreen :one
INSERT INTO screens (theater_id, name, rows, columns)
VALUES ($1, $2, $3,$4)
RETURNING *;

-- name: GetScreen :one
SELECT * FROM screens WHERE id = $1;

-- name: ListScreens :many
SELECT * FROM screens ORDER BY id;

-- name: ListScreensByTheater :many
SELECT * FROM screens WHERE theater_id = $1;

-- name: UpdateScreen :one
UPDATE screens
SET name = $2, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteScreen :exec
DELETE FROM screens WHERE id = $1;
