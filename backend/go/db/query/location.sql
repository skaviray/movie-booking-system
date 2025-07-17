-- name: CreateLocation :one
INSERT INTO locations (city, state, country, address)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetLocation :one
SELECT * FROM locations WHERE id = $1;

-- name: ListLocations :many
SELECT * FROM locations ORDER BY id;

-- name: UpdateLocation :one
UPDATE locations
SET city = $2, state = $3, country = $4, address = $5, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteLocation :exec
DELETE FROM locations WHERE id = $1;
