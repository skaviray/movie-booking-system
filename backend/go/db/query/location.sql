-- name: CreateLocation :one
INSERT INTO locations (location_name,city, address)
VALUES ($1, $2,$3)
RETURNING *;

-- name: GetLocation :one
SELECT * FROM locations WHERE id = $1;

-- name: ListLocations :many
SELECT * FROM locations ORDER BY id;

-- name: UpdateLocation :one
UPDATE locations
SET city = $2, address = $3, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteLocation :exec
DELETE FROM locations WHERE id = $1;

-- name: GetTheatersByLocation :many
SELECT 
    t.id AS theater_id,
    t.theatre_name AS theater_name
FROM theaters t
JOIN locations l ON t.location = l.id
WHERE l.id = $1;