-- ====================================
-- Users Table
-- ====================================
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  hashed_password VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE,
  full_name VARCHAR NOT NULL,
  password_changed_at TIMESTAMPTZ NOT NULL DEFAULT '0001-01-01 00:00:00Z',
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- Customers Table
-- ====================================
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  is_gold BOOLEAN DEFAULT FALSE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================
-- Genres Table
-- ====================================
CREATE TABLE genres (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  CHECK (LENGTH(name) >= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================
-- Movies Table
-- ====================================
CREATE TABLE movies (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre_id INT NOT NULL REFERENCES genres(id) ON DELETE RESTRICT,
  number_in_stock INT NOT NULL CHECK (number_in_stock >= 0 AND number_in_stock <= 255),
  daily_rental_rate FLOAT NOT NULL CHECK (daily_rental_rate >= 0 AND daily_rental_rate <= 255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================
-- Rentals Table
-- ====================================
CREATE TABLE rentals (
  id BIGSERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  movie_id INT NOT NULL REFERENCES movies(id) ON DELETE RESTRICT,
  date_out TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_returned TIMESTAMP,
  rental_fee NUMERIC(10, 2) CHECK (rental_fee >= 0)
);

-- ====================================
-- Trigger to auto-update `updated_at`
-- ====================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_customers
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_genres
BEFORE UPDATE ON genres
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_movies
BEFORE UPDATE ON movies
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

