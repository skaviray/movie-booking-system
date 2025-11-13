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
CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  is_gold BOOLEAN DEFAULT FALSE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE theaters (
    id BIGSERIAL PRIMARY KEY,
    theatre_name TEXT NOT NULL,
    location INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    poster TEXT  NOT NULL,
    likes INT DEFAULT 0 NOT NULL,
    trailer TEXT DEFAULT '' NOT NULL,
    runtime BIGSERIAL NOT NULL,
    language TEXT NOT NULL,
    release_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE screens (
    id BIGSERIAL PRIMARY KEY,
    theater_id BIGSERIAL NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rows INTEGER NOT NULL,
    columns INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(theater_id, name)
);
CREATE TABLE showtimes (
    id BIGSERIAL PRIMARY KEY,
    screen_id BIGSERIAL NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    movie_id BIGSERIAL NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(screen_id, start_time)
);
CREATE TABLE seats (
    id BIGSERIAL PRIMARY KEY,
    screen_id BIGSERIAL NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
    seat_name VARCHAR(10) NOT NULL,   -- e.g., A1, B2
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(screen_id, seat_name)
);
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  showtime_id BIGSERIAL NOT NULL REFERENCES showtimes(id),
  customer_id BIGSERIAL NOT NULL REFERENCES customers(id), -- optional if registered
  order_id VARCHAR NOT NULL UNIQUE,
  payment_id VARCHAR UNIQUE,
  amount FLOAT NOT NULL,
  currency VARCHAR,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- ====================================
-- Booked Seats Table (maps booking → seat)
-- ====================================
CREATE TABLE booked_seats (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGSERIAL NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    show_time_id BIGSERIAL NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
    seat_id BIGSERIAL NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
    price FLOAT NOT NULL,
    UNIQUE(seat_id, show_time_id)
);

-- CREATE TABLE locked_seats (
--   id BIGSERIAL PRIMARY KEY,
--   show_time_id BIGSERIAL NOT NULL REFERENCES showtimes(id) ON DELETE CASCADE,
--   seat_id BIGSERIAL NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
--   customer_id BIGSERIAL, -- optional if logged in
--   locked_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
--   expires_at TIMESTAMPTZ NOT NULL,
--   booking_id BIGSERIAL, -- NULL until payment succeeds
--   UNIQUE (seat_id, show_time_id)
-- );
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
DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname='public' 
          AND tablename IN ('users','customers','locations','theaters','screens','seats','movies','showtimes', 'bookings')
    LOOP
        EXECUTE format(
            'CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON %1$s FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
            tbl.tablename
        );
    END LOOP;
END $$;


-- CREATE OR REPLACE FUNCTION trigger_set_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Apply trigger to relevant tables
-- -- Users
-- CREATE TRIGGER set_updated_at_users
-- BEFORE UPDATE ON users
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Customers
-- CREATE TRIGGER set_updated_at_customers
-- BEFORE UPDATE ON customers
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Locations
-- CREATE TRIGGER set_updated_at_locations
-- BEFORE UPDATE ON locations
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Movies
-- CREATE TRIGGER set_updated_at_movies
-- BEFORE UPDATE ON movies
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Theaters
-- CREATE TRIGGER set_updated_at_theaters
-- BEFORE UPDATE ON theaters
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Screens
-- CREATE TRIGGER set_updated_at_screens
-- BEFORE UPDATE ON screens
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Showtimes
-- CREATE TRIGGER set_updated_at_showtimes
-- BEFORE UPDATE ON showtimes
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- -- Seats
-- CREATE TRIGGER set_updated_at_seats
-- BEFORE UPDATE ON seats
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE INDEX idx_booked_seats_booking_id ON booked_seats(booking_id);
CREATE INDEX idx_booked_seats_seat_id ON booked_seats(seat_id);