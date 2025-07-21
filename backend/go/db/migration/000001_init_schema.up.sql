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
-- Customers Location
-- ================================

CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India' NOT NULL,
    address TEXT NOT NULL,
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
    title TEXT NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    poster TEXT  NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    trailer TEXT DEFAULT '' NOT NULL,
    duration_minutes INT NOT NULL,
    language TEXT NOT NULL,
    genre_id INTEGER NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================
-- Theaters Table
-- ====================================
CREATE TABLE theaters (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);



-- ====================================
-- Screens Table
-- ====================================
CREATE TABLE screens (
    id BIGSERIAL PRIMARY KEY,
    theater_id INTEGER NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(theater_id, name)
);

-- ====================================
-- Showtimes Table
-- ====================================
CREATE TABLE showtimes (
    id BIGSERIAL PRIMARY KEY,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    screen_id INT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    -- end_time TIMESTAMP GENERATED ALWAYS AS (start_time + (movies.duration_minutes || ' minutes')::interval) STORED,
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);


-- ====================================
-- Seats Table
-- ====================================
CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,
    screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    row INTEGER NOT NULL,
    col INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(screen_id, row, col)
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
-- Users
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Customers
CREATE TRIGGER set_updated_at_customers
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Locations
CREATE TRIGGER set_updated_at_locations
BEFORE UPDATE ON locations
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Genres
CREATE TRIGGER set_updated_at_genres
BEFORE UPDATE ON genres
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Movies
CREATE TRIGGER set_updated_at_movies
BEFORE UPDATE ON movies
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Theaters
CREATE TRIGGER set_updated_at_theaters
BEFORE UPDATE ON theaters
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Screens
CREATE TRIGGER set_updated_at_screens
BEFORE UPDATE ON screens
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Showtimes
CREATE TRIGGER set_updated_at_showtimes
BEFORE UPDATE ON showtimes
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Seats
CREATE TRIGGER set_updated_at_seats
BEFORE UPDATE ON seats
FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

