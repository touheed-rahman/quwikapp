
-- Insert cities for Alabama
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Auburn'),
    ('Birmingham'),
    ('Dothan'),
    ('Florence / Muscle Shoals'),
    ('Gadsden-anniston'),
    ('Huntsville / Decatur'),
    ('Mobile'),
    ('Montgomery'),
    ('Tuscaloosa')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Alabama' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Alaska
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Anchorage / Mat-su'),
    ('Fairbanks'),
    ('Kenai Peninsula'),
    ('Southeast Alaska')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Alaska' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Arizona
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Flagstaff / Sedona'),
    ('Mohave County'),
    ('Phoenix'),
    ('Prescott'),
    ('Show Low'),
    ('Sierra Vista'),
    ('Tucson'),
    ('Yuma')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Arizona' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Arkansas
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Fayetteville'),
    ('Fort Smith'),
    ('Jonesboro'),
    ('Little Rock'),
    ('Texarkana')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Arkansas' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for California
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Bakersfield'),
    ('Chico'),
    ('Fresno / Madera'),
    ('Gold Country'),
    ('Hanford-Corcoran'),
    ('Humboldt County'),
    ('Imperial County'),
    ('Inland Empire'),
    ('Los Angeles'),
    ('Mendocino County'),
    ('Merced'),
    ('Modesto'),
    ('Monterey Bay'),
    ('North Bay'),
    ('Orange County'),
    ('Palm Springs'),
    ('Redding'),
    ('Sacramento'),
    ('San Diego'),
    ('San Francisco Bay Area'),
    ('San Luis Obispo'),
    ('Santa Barbara'),
    ('Santa Maria'),
    ('Siskiyou County'),
    ('Stockton'),
    ('Susanville'),
    ('Ventura County'),
    ('Visalia-Tulare'),
    ('Yuba-Sutter')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'California' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Colorado
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Boulder'),
    ('Colorado Springs'),
    ('Denver'),
    ('Eastern CO'),
    ('Fort Collins / North CO'),
    ('High Rockies'),
    ('Pueblo'),
    ('Western Slope')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Colorado' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Connecticut
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Eastern CT'),
    ('Hartford'),
    ('New Haven'),
    ('Northwest CT')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Connecticut' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Delaware
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Delaware')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Delaware' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Florida
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Daytona Beach'),
    ('Florida Keys'),
    ('Fort Lauderdale'),
    ('Fort Myers / SW Florida'),
    ('Gainesville'),
    ('Heartland Florida'),
    ('Jacksonville'),
    ('Lakeland'),
    ('Miami / Dade'),
    ('North Central FL'),
    ('Ocala'),
    ('Okaloosa / Walton'),
    ('Orlando'),
    ('Panama City'),
    ('Pensacola'),
    ('Sarasota-Bradenton'),
    ('South Florida'),
    ('Space Coast'),
    ('St Augustine'),
    ('Tallahassee'),
    ('Tampa Bay Area'),
    ('Treasure Coast'),
    ('West Palm Beach')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Florida' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;

-- Insert cities for Georgia
INSERT INTO cities (id, name, state_id, latitude, longitude)
SELECT gen_random_uuid(), city_name, states.id, 0.0, 0.0
FROM (
  VALUES
    ('Albany'),
    ('Athens')
) AS cities(city_name)
CROSS JOIN (SELECT id FROM states WHERE name = 'Georgia' AND country_code = 'US' LIMIT 1) states
ON CONFLICT (name, state_id) DO NOTHING;
