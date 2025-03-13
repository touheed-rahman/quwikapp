
-- Update coordinates for major US cities
-- Note: In a real implementation, you would use the geocoding utility to get accurate coordinates
-- This is a placeholder with approximate coordinates for major cities

-- Alabama
UPDATE cities SET latitude = 32.6099, longitude = -85.4808 WHERE name = 'Auburn' AND state_id = (SELECT id FROM states WHERE name = 'Alabama' AND country_code = 'US');
UPDATE cities SET latitude = 33.5186, longitude = -86.8104 WHERE name = 'Birmingham' AND state_id = (SELECT id FROM states WHERE name = 'Alabama' AND country_code = 'US');
UPDATE cities SET latitude = 31.2232, longitude = -85.3905 WHERE name = 'Dothan' AND state_id = (SELECT id FROM states WHERE name = 'Alabama' AND country_code = 'US');

-- California
UPDATE cities SET latitude = 37.7749, longitude = -122.4194 WHERE name = 'San Francisco Bay Area' AND state_id = (SELECT id FROM states WHERE name = 'California' AND country_code = 'US');
UPDATE cities SET latitude = 34.0522, longitude = -118.2437 WHERE name = 'Los Angeles' AND state_id = (SELECT id FROM states WHERE name = 'California' AND country_code = 'US');
UPDATE cities SET latitude = 32.7157, longitude = -117.1611 WHERE name = 'San Diego' AND state_id = (SELECT id FROM states WHERE name = 'California' AND country_code = 'US');

-- Florida
UPDATE cities SET latitude = 25.7617, longitude = -80.1918 WHERE name = 'Miami / Dade' AND state_id = (SELECT id FROM states WHERE name = 'Florida' AND country_code = 'US');
UPDATE cities SET latitude = 28.5383, longitude = -81.3792 WHERE name = 'Orlando' AND state_id = (SELECT id FROM states WHERE name = 'Florida' AND country_code = 'US');
UPDATE cities SET latitude = 27.9506, longitude = -82.4572 WHERE name = 'Tampa Bay Area' AND state_id = (SELECT id FROM states WHERE name = 'Florida' AND country_code = 'US');

-- New York (you'll need to add New York to the states first)
-- UPDATE cities SET latitude = 40.7128, longitude = -74.0060 WHERE name = 'New York City' AND state_id = (SELECT id FROM states WHERE name = 'New York' AND country_code = 'US');
