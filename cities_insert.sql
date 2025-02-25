
INSERT INTO cities (name, state_id, latitude, longitude)
WITH data AS (
  SELECT * FROM (
    VALUES
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
