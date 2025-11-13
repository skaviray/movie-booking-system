-- ====================================
-- Drop triggers
-- ====================================
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
DROP TRIGGER IF EXISTS set_updated_at_locations ON locations;
DROP TRIGGER IF EXISTS set_updated_at_theaters ON theaters;
DROP TRIGGER IF EXISTS set_updated_at_screens ON screens;
DROP TRIGGER IF EXISTS set_updated_at_seats ON seats;
DROP TRIGGER IF EXISTS set_updated_at_movies ON movies;
DROP TRIGGER IF EXISTS set_updated_at_show_times ON show_times;

-- Drop trigger function
DROP FUNCTION IF EXISTS trigger_set_updated_at();

-- ====================================
-- Drop tables in reverse dependency order
-- ====================================
DROP TABLE IF EXISTS booked_seats CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS show_times CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS screens CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS theaters CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
