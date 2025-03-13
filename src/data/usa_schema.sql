
-- Schema for USA Locations

-- Create country table if not exists
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create states table if not exists
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL REFERENCES countries(code),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, country_code)
);

-- Create cities table if not exists
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state_id UUID NOT NULL REFERENCES states(id),
  latitude DOUBLE PRECISION DEFAULT 0,
  longitude DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name, state_id)
);

-- Insert default country
INSERT INTO countries (name, code)
VALUES ('United States', 'US')
ON CONFLICT (code) DO NOTHING;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_states_modtime
BEFORE UPDATE ON states
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_cities_modtime
BEFORE UPDATE ON cities
FOR EACH ROW EXECUTE FUNCTION update_modified_column();
