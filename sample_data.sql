INSERT INTO movies (id, title, poster, trailer, likes, release_date, created_at, updated_at, runtime,language, description)
VALUES
(1, 'OG', 'https://m.media-amazon.com/images/I/71r3e+pdc8L._UF894,1000_QL80_.jpg', 'https://youtu.be/_8J8LwoVH_0?si=ytq_bVP9K_1ZQ17D', 2500, '2010-07-16', NOW(), NOW(), 148, 'Telugu', 'Inception'),
(2, 'The Dark Knight', 'https://m.media-amazon.com/images/M/MV5BMzRiNjU5ODAtZmNhYi00ZTJlLTk2NDUtMGRjYjg1ZDhjZjVkXkEyXkFqcGc@._V1_.jpg', 'https://youtu.be/uFGAaTPgNNE?si=nqb8dNpLo4RDz_-2', 3000, '2008-07-18', NOW(), NOW(), 152, 'Telugu','The Dark Knight' ),
(3, 'Raja Saab', 'https://m.media-amazon.com/images/M/MV5BNzE1MzlhMWUtZjY3NS00OWI1LTliZjUtYTEyZTk1NDU5NjRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg', 'https://youtu.be/i-8w5yDwukA?si=EGMydOPo4O_OQRII', 2800, '2014-11-07', NOW(), NOW(), 169, 'Telugu', 'Interstellar');

INSERT INTO locations (id, location_name, city, address)
VALUES
(1, 'Kungalv','Goteborg', 'Kungalv'),
(2, 'kista', 'Stockholm', 'Kista'),
(3, 'centrum', 'Karskrona', 'centrum');

INSERT INTO theaters (id,theatre_name, location)
VALUES
(1, 'Bioplatset', 1),
(2, 'Filmstaden', 2),
(3, 'Filmstaden',  3);

INSERT INTO screens (theater_id, name, rows, columns) VALUES
(1, 'Screen A', 5, 6),
(1, 'Screen B', 6, 8),
(2, 'Screen C', 5, 5),
(3, 'Screen D', 4, 6);


INSERT INTO showtimes (screen_id, movie_id, start_time, end_time, price) VALUES
(1, 1, '2025-11-14 09:00', '2025-11-14 12:00', 250),
(1, 2, '2025-11-15 13:00', '2025-11-15 15:00', 300),
(1, 3, '2025-11-16 16:00', '2025-11-16 18:00', 280),
(2, 1, '2025-11-17 11:00', '2025-11-17 12:00', 250),
(2, 3, '2025-11-18 13:00', '2025-11-18 15:00', 280),
(3, 2, '2025-11-19 11:00', '2025-11-19 13:00', 300),
(4, 3, '2025-11-20 12:00', '2025-11-20 14:00', 280);




-- Generate seats for all screens based on rows × columns layout
INSERT INTO seats (screen_id, seat_name)
SELECT
    s.id AS screen_id,
    chr(64 + r.row_num)::text || c.col_num::text AS seat_name
FROM screens s
CROSS JOIN LATERAL generate_series(1, s.rows) AS r(row_num)
CROSS JOIN LATERAL generate_series(1, s.columns) AS c(col_num)
ORDER BY s.id, seat_name;


-- Reset sequence for theaters
SELECT setval('theaters_id_seq', COALESCE((SELECT MAX(id)+1 FROM theaters), 1), false);

-- Reset sequence for screens
SELECT setval('screens_id_seq', COALESCE((SELECT MAX(id)+1 FROM screens), 1), false);

-- Reset sequence for movies
SELECT setval('movies_id_seq', COALESCE((SELECT MAX(id)+1 FROM movies), 1), false);

-- Reset sequence for showtimes
SELECT setval('showtimes_id_seq', COALESCE((SELECT MAX(id)+1 FROM showtimes), 1), false);

-- Reset sequence for seats
SELECT setval('seats_id_seq', COALESCE((SELECT MAX(id)+1 FROM seats), 1), false);

-- Reset sequence for locations
SELECT setval('locations_id_seq', COALESCE((SELECT MAX(id)+1 FROM locations), 1), false);
