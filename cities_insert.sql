
INSERT INTO cities (name, state_id, latitude, longitude)
WITH data AS (
  SELECT * FROM (
    VALUES
      -- Andhra Pradesh
      ('Visakhapatnam', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 17.6868, 83.2185),
      ('Vijayawada', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 16.5062, 80.6480),
      ('Guntur', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 16.3067, 80.4365),
      ('Nellore', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 14.4426, 79.9865),
      ('Kurnool', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 15.8281, 78.0373),
      
      -- Arunachal Pradesh
      ('Itanagar', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.0844, 93.6053),
      ('Naharlagun', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.1044, 93.6953),
      ('Pasighat', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 28.0678, 95.3932),
      
      -- Assam
      ('Guwahati', (SELECT id FROM states WHERE name = 'Assam'), 26.1445, 91.7362),
      ('Silchar', (SELECT id FROM states WHERE name = 'Assam'), 24.8333, 92.7789),
      ('Dibrugarh', (SELECT id FROM states WHERE name = 'Assam'), 27.4728, 94.9120),
      ('Jorhat', (SELECT id FROM states WHERE name = 'Assam'), 26.7509, 94.2037),
      ('Nagaon', (SELECT id FROM states WHERE name = 'Assam'), 26.3452, 92.6840),
      
      -- Bihar
      ('Patna', (SELECT id FROM states WHERE name = 'Bihar'), 25.5941, 85.1376),
      ('Gaya', (SELECT id FROM states WHERE name = 'Bihar'), 24.7914, 85.0002),
      ('Muzaffarpur', (SELECT id FROM states WHERE name = 'Bihar'), 26.1209, 85.3647),
      ('Bhagalpur', (SELECT id FROM states WHERE name = 'Bihar'), 25.2425, 87.0079),
      ('Darbhanga', (SELECT id FROM states WHERE name = 'Bihar'), 26.1542, 85.8918),
      
      -- Maharashtra
      ('Mumbai', (SELECT id FROM states WHERE name = 'Maharashtra'), 19.0760, 72.8777),
      ('Pune', (SELECT id FROM states WHERE name = 'Maharashtra'), 18.5204, 73.8567),
      ('Nagpur', (SELECT id FROM states WHERE name = 'Maharashtra'), 21.1458, 79.0882),
      ('Thane', (SELECT id FROM states WHERE name = 'Maharashtra'), 19.2183, 72.9781),
      ('Nashik', (SELECT id FROM states WHERE name = 'Maharashtra'), 20.0059, 73.7629),
      
      -- Tamil Nadu
      ('Chennai', (SELECT id FROM states WHERE name = 'Tamil Nadu'), 13.0827, 80.2707),
      ('Coimbatore', (SELECT id FROM states WHERE name = 'Tamil Nadu'), 11.0168, 76.9558),
      ('Madurai', (SELECT id FROM states WHERE name = 'Tamil Nadu'), 9.9252, 78.1198),
      ('Salem', (SELECT id FROM states WHERE name = 'Tamil Nadu'), 11.6643, 78.1460),
      ('Tiruppur', (SELECT id FROM states WHERE name = 'Tamil Nadu'), 11.1085, 77.3411),
      
      -- Gujarat
      ('Ahmedabad', (SELECT id FROM states WHERE name = 'Gujarat'), 23.0225, 72.5714),
      ('Surat', (SELECT id FROM states WHERE name = 'Gujarat'), 21.1702, 72.8311),
      ('Vadodara', (SELECT id FROM states WHERE name = 'Gujarat'), 22.3072, 73.1812),
      ('Rajkot', (SELECT id FROM states WHERE name = 'Gujarat'), 22.3039, 70.8022),
      ('Gandhinagar', (SELECT id FROM states WHERE name = 'Gujarat'), 23.2156, 72.6369),
      
      -- Delhi
      ('New Delhi', (SELECT id FROM states WHERE name = 'Delhi'), 28.6139, 77.2090),
      
      -- Uttar Pradesh
      ('Lucknow', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 26.8467, 80.9462),
      ('Kanpur', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 26.4499, 80.3319),
      ('Varanasi', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 25.3176, 82.9739),
      ('Agra', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 27.1767, 78.0081),
      ('Noida', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 28.5355, 77.3910),
      
      -- West Bengal
      ('Kolkata', (SELECT id FROM states WHERE name = 'West Bengal'), 22.5726, 88.3639),
      ('Howrah', (SELECT id FROM states WHERE name = 'West Bengal'), 22.5958, 88.2636),
      ('Durgapur', (SELECT id FROM states WHERE name = 'West Bengal'), 23.5204, 87.3119),
      
      -- Telangana
      ('Hyderabad', (SELECT id FROM states WHERE name = 'Telangana'), 17.3850, 78.4867),
      ('Warangal', (SELECT id FROM states WHERE name = 'Telangana'), 18.0000, 79.5833),
      
      -- Rajasthan
      ('Jaipur', (SELECT id FROM states WHERE name = 'Rajasthan'), 26.9124, 75.7873),
      ('Jodhpur', (SELECT id FROM states WHERE name = 'Rajasthan'), 26.2389, 73.0243),
      ('Udaipur', (SELECT id FROM states WHERE name = 'Rajasthan'), 24.5854, 73.7125),
      
      -- Kerala
      ('Thiruvananthapuram', (SELECT id FROM states WHERE name = 'Kerala'), 8.5241, 76.9366),
      ('Kochi', (SELECT id FROM states WHERE name = 'Kerala'), 9.9312, 76.2673),
      ('Kozhikode', (SELECT id FROM states WHERE name = 'Kerala'), 11.2588, 75.7804),
      
      -- Punjab
      ('Chandigarh', (SELECT id FROM states WHERE name = 'Punjab'), 30.7333, 76.7794),
      ('Ludhiana', (SELECT id FROM states WHERE name = 'Punjab'), 30.9010, 75.8573),
      ('Amritsar', (SELECT id FROM states WHERE name = 'Punjab'), 31.6340, 74.8723),
      
      -- Madhya Pradesh
      ('Bhopal', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 23.2599, 77.4126),
      ('Indore', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 22.7196, 75.8577),
      ('Gwalior', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 26.2183, 78.1828)
  ) AS t(name, state_id, latitude, longitude)
)
SELECT name, state_id, latitude, longitude
FROM data d
WHERE NOT EXISTS (
  SELECT 1 FROM cities c 
  WHERE c.name = d.name 
  AND c.state_id = d.state_id
)
ON CONFLICT (name, state_id) DO NOTHING;

-- Also insert an SQL to create new countries, states, and cities for worldwide release
-- This should be run after adding new countries and states to your database

-- Add International Cities
INSERT INTO states (name)
VALUES 
  ('United States'),
  ('United Kingdom'),
  ('Canada'),
  ('Australia'),
  ('Germany'),
  ('France'),
  ('Japan'),
  ('Singapore'),
  ('UAE'),
  ('South Africa')
ON CONFLICT (name) DO NOTHING;

-- Now insert international cities
INSERT INTO cities (name, state_id, latitude, longitude)
WITH data AS (
  SELECT * FROM (
    VALUES
      -- United States
      ('New York', (SELECT id FROM states WHERE name = 'United States'), 40.7128, -74.0060),
      ('Los Angeles', (SELECT id FROM states WHERE name = 'United States'), 34.0522, -118.2437),
      ('Chicago', (SELECT id FROM states WHERE name = 'United States'), 41.8781, -87.6298),
      ('Houston', (SELECT id FROM states WHERE name = 'United States'), 29.7604, -95.3698),
      ('San Francisco', (SELECT id FROM states WHERE name = 'United States'), 37.7749, -122.4194),
      
      -- United Kingdom
      ('London', (SELECT id FROM states WHERE name = 'United Kingdom'), 51.5074, -0.1278),
      ('Manchester', (SELECT id FROM states WHERE name = 'United Kingdom'), 53.4808, -2.2426),
      ('Birmingham', (SELECT id FROM states WHERE name = 'United Kingdom'), 52.4862, -1.8904),
      ('Edinburgh', (SELECT id FROM states WHERE name = 'United Kingdom'), 55.9533, -3.1883),
      ('Glasgow', (SELECT id FROM states WHERE name = 'United Kingdom'), 55.8642, -4.2518),
      
      -- Canada
      ('Toronto', (SELECT id FROM states WHERE name = 'Canada'), 43.6532, -79.3832),
      ('Vancouver', (SELECT id FROM states WHERE name = 'Canada'), 49.2827, -123.1207),
      ('Montreal', (SELECT id FROM states WHERE name = 'Canada'), 45.5017, -73.5673),
      ('Calgary', (SELECT id FROM states WHERE name = 'Canada'), 51.0447, -114.0719),
      ('Ottawa', (SELECT id FROM states WHERE name = 'Canada'), 45.4215, -75.6972),
      
      -- Australia
      ('Sydney', (SELECT id FROM states WHERE name = 'Australia'), -33.8688, 151.2093),
      ('Melbourne', (SELECT id FROM states WHERE name = 'Australia'), -37.8136, 144.9631),
      ('Brisbane', (SELECT id FROM states WHERE name = 'Australia'), -27.4698, 153.0251),
      ('Perth', (SELECT id FROM states WHERE name = 'Australia'), -31.9505, 115.8605),
      ('Adelaide', (SELECT id FROM states WHERE name = 'Australia'), -34.9285, 138.6007),
      
      -- Germany
      ('Berlin', (SELECT id FROM states WHERE name = 'Germany'), 52.5200, 13.4050),
      ('Munich', (SELECT id FROM states WHERE name = 'Germany'), 48.1351, 11.5820),
      ('Frankfurt', (SELECT id FROM states WHERE name = 'Germany'), 50.1109, 8.6821),
      ('Hamburg', (SELECT id FROM states WHERE name = 'Germany'), 53.5511, 9.9937),
      ('Cologne', (SELECT id FROM states WHERE name = 'Germany'), 50.9375, 6.9603),
      
      -- France
      ('Paris', (SELECT id FROM states WHERE name = 'France'), 48.8566, 2.3522),
      ('Lyon', (SELECT id FROM states WHERE name = 'France'), 45.7640, 4.8357),
      ('Marseille', (SELECT id FROM states WHERE name = 'France'), 43.2965, 5.3698),
      ('Nice', (SELECT id FROM states WHERE name = 'France'), 43.7102, 7.2620),
      ('Bordeaux', (SELECT id FROM states WHERE name = 'France'), 44.8378, -0.5792),
      
      -- Japan
      ('Tokyo', (SELECT id FROM states WHERE name = 'Japan'), 35.6762, 139.6503),
      ('Osaka', (SELECT id FROM states WHERE name = 'Japan'), 34.6937, 135.5023),
      ('Kyoto', (SELECT id FROM states WHERE name = 'Japan'), 35.0116, 135.7681),
      ('Yokohama', (SELECT id FROM states WHERE name = 'Japan'), 35.4437, 139.6380),
      ('Sapporo', (SELECT id FROM states WHERE name = 'Japan'), 43.0618, 141.3545),
      
      -- Singapore
      ('Singapore City', (SELECT id FROM states WHERE name = 'Singapore'), 1.3521, 103.8198),
      
      -- UAE
      ('Dubai', (SELECT id FROM states WHERE name = 'UAE'), 25.2048, 55.2708),
      ('Abu Dhabi', (SELECT id FROM states WHERE name = 'UAE'), 24.4539, 54.3773),
      ('Sharjah', (SELECT id FROM states WHERE name = 'UAE'), 25.3463, 55.4209),
      
      -- South Africa
      ('Cape Town', (SELECT id FROM states WHERE name = 'South Africa'), -33.9249, 18.4241),
      ('Johannesburg', (SELECT id FROM states WHERE name = 'South Africa'), -26.2041, 28.0473),
      ('Durban', (SELECT id FROM states WHERE name = 'South Africa'), -29.8587, 31.0218),
      ('Pretoria', (SELECT id FROM states WHERE name = 'South Africa'), -25.7479, 28.2293)
  ) AS t(name, state_id, latitude, longitude)
)
SELECT name, state_id, latitude, longitude
FROM data d
WHERE NOT EXISTS (
  SELECT 1 FROM cities c 
  WHERE c.name = d.name 
  AND c.state_id = d.state_id
)
ON CONFLICT (name, state_id) DO NOTHING;
