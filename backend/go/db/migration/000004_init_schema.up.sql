-- ====================================
-- Trigger Function (Must come first!)
-- ====================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- Theaters Table
-- ====================================
CREATE TABLE theaters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rows INT NOT NULL,
    columns INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ====================================
-- Seats Table
-- ====================================
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    theater_id INTEGER NOT NULL REFERENCES theaters(id) ON DELETE CASCADE,
    row INTEGER NOT NULL,
    col INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'available', -- available, reserved, booked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(theater_id, row, col)
);

-- ====================================
-- Triggers
-- ====================================
CREATE TRIGGER set_updated_at_theatres
BEFORE UPDATE ON theaters
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_seats
BEFORE UPDATE ON seats
FOR EACH ROW
EXECUTE FUNCTION trigger_set_updated_at();
