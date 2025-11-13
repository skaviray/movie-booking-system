-- name: CreateSeat :one
INSERT INTO seats (seat_name, screen_id)
VALUES ($1, $2)
RETURNING *;

-- name: GetSeat :one
SELECT * FROM seats WHERE id = $1;

-- name: ListSeatsByScreen :many
SELECT * FROM seats WHERE screen_id = $1;

-- name: GetAvailableSeatsByShowTimeId :many
SELECT
    s.id AS seat_id,
    s.seat_name,
    CASE
        WHEN bs.id IS NOT NULL THEN 'booked'
        ELSE 'available'
    END AS status
FROM seats s
JOIN screens sc
    ON s.screen_id = sc.id
JOIN showtimes st
    ON sc.id = st.screen_id
LEFT JOIN booked_seats bs
    ON bs.seat_id = s.id
   AND bs.show_time_id = st.id
WHERE st.id = $1
ORDER BY s.seat_name;

-- name: GetSeatsByShowTimeIdAndSeatIdsForUpdate :many
SELECT
    s.id AS seat_id,
    s.seat_name,
    CASE
        WHEN bs.id IS NOT NULL THEN 'booked'
        ELSE 'available'
    END AS status
FROM seats s
JOIN screens sc
    ON s.screen_id = sc.id
JOIN showtimes st
    ON sc.id = st.screen_id
LEFT JOIN booked_seats bs
    ON bs.seat_id = s.id
   AND bs.show_time_id = st.id
WHERE st.id = @showtime_id AND s.id = ANY(@seat_ids::bigint[])
ORDER BY s.seat_name
FOR UPDATE OF s;

-- name: GetSeatsByShowTimeIdAndSeatIds :many
SELECT
    s.id AS seat_id,
    s.seat_name,
    CASE
        WHEN bs.id IS NOT NULL THEN 'booked'
        ELSE 'available'
    END AS status
FROM seats s
JOIN screens sc
    ON s.screen_id = sc.id
JOIN showtimes st
    ON sc.id = st.screen_id
LEFT JOIN booked_seats bs
    ON bs.seat_id = s.id
   AND bs.show_time_id = st.id
WHERE st.id = @showtime_id AND s.id = ANY(@seat_ids::bigint[])
ORDER BY s.seat_name;