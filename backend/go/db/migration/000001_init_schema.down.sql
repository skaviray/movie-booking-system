-- ====================================
-- Drop Triggers
-- ====================================
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
DROP TRIGGER IF EXISTS set_updated_at_customers ON customers;
DROP TRIGGER IF EXISTS set_updated_at_genres ON genres;
DROP TRIGGER IF EXISTS set_updated_at_movies ON movies;

-- ====================================
-- Drop Trigger Function
-- ====================================
DROP FUNCTION IF EXISTS trigger_set_updated_at;

-- ====================================
-- Drop Tables (reverse dependency order)
-- ====================================
DROP TABLE IF EXISTS rentals;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
