-- name: GetTheatersAndShowtimesByMovie :many
SELECT
  t.id AS theater_id,
  t.name AS theater_name,
  t.location,
  s.id AS screen_id,
  st.id AS showtime_id,
  st.start_time
FROM
  theaters t
JOIN
  screens s ON t.id = s.theater_id
JOIN
  showtimes st ON s.id = st.screen_id
WHERE
  st.movie_id = $1
ORDER BY
  t.name, st.start_time;
