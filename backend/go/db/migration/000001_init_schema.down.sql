-- ====================================
-- Drop Triggers
-- ====================================
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
DROP TRIGGER IF EXISTS set_updated_at_locations ON locations;
DROP TRIGGER IF EXISTS set_updated_at_genres ON genres;
DROP TRIGGER IF EXISTS set_updated_at_movies ON movies;
DROP TRIGGER IF EXISTS set_updated_at_theaters ON theaters;
DROP TRIGGER IF EXISTS set_updated_at_screens ON screens;
DROP TRIGGER IF EXISTS set_updated_at_showtimes ON showtimes;
DROP TRIGGER IF EXISTS set_updated_at_seats ON seats;

-- ====================================
-- Drop Trigger Function
-- ====================================
DROP FUNCTION IF EXISTS trigger_set_updated_at;

-- ====================================
-- ===============================
-- DROP TABLES (in dependency order)
-- ===============================

-- Seats → depends on screens
DROP TABLE IF EXISTS seats;

-- Showtimes → depends on movies, screens
DROP TABLE IF EXISTS showtimes;

-- Screens → depends on theaters
DROP TABLE IF EXISTS screens;

-- Theaters → depends on locations
DROP TABLE IF EXISTS theaters;

-- Movies → depends on genres
DROP TABLE IF EXISTS movies;

-- Genres
DROP TABLE IF EXISTS genres;

-- Locations
DROP TABLE IF EXISTS locations;

-- Customers
DROP TABLE IF EXISTS customers;

-- Users
DROP TABLE IF EXISTS users;
