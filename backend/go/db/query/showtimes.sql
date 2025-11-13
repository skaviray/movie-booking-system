-- name: CreateShowtime :one
INSERT INTO showtimes (screen_id, movie_id, start_time, end_time, price)
VALUES ($1, $2, $3,$4,$5)
RETURNING *;

-- name: GetShowtime :one
SELECT * FROM showtimes WHERE id = $1;

-- name: ListShowtimes :many
SELECT * FROM showtimes ORDER BY start_time;

-- name: ListShowtimesByMovieId :many
SELECT * FROM showtimes WHERE movie_id = $1 ORDER BY start_time;

-- name: GetShowtimesByMovieID :many
SELECT
    st.id AS showtime_id,
    st.start_time,
    st.end_time,
    st.price,
    t.id AS theater_id,
    t.theatre_name,
    s.id AS screen_id,
    s.name AS screen_name,
    l.city,
    l.location_name
FROM showtimes st
JOIN screens s ON st.screen_id = s.id
JOIN theaters t ON s.theater_id = t.id
JOIN locations l ON t.location = l.id
WHERE st.movie_id = $1
ORDER BY st.start_time;

-- name: UpdateShowtime :one
UPDATE showtimes
SET start_time = $2, end_time = $3, price=$4, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: DeleteShowtime :exec
DELETE FROM showtimes WHERE id = $1;
