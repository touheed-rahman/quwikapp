
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
      ('Tirupati', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 13.6288, 79.4192),
      ('Kakinada', (SELECT id FROM states WHERE name = 'Andhra Pradesh'), 16.9371, 82.2475),
      
      -- Arunachal Pradesh
      ('Itanagar', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.0844, 93.6053),
      ('Naharlagun', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.1044, 93.6953),
      ('Pasighat', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 28.0678, 95.3932),
      ('Tawang', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.5859, 91.8662),
      ('Ziro', (SELECT id FROM states WHERE name = 'Arunachal Pradesh'), 27.5359, 93.8320),
      
      -- Assam
      ('Guwahati', (SELECT id FROM states WHERE name = 'Assam'), 26.1445, 91.7362),
      ('Silchar', (SELECT id FROM states WHERE name = 'Assam'), 24.8333, 92.7789),
      ('Dibrugarh', (SELECT id FROM states WHERE name = 'Assam'), 27.4728, 94.9120),
      ('Jorhat', (SELECT id FROM states WHERE name = 'Assam'), 26.7509, 94.2037),
      ('Nagaon', (SELECT id FROM states WHERE name = 'Assam'), 26.3452, 92.6840),
      ('Tinsukia', (SELECT id FROM states WHERE name = 'Assam'), 27.4895, 95.3676),
      ('Tezpur', (SELECT id FROM states WHERE name = 'Assam'), 26.6528, 92.8011),
      
      -- Bihar
      ('Patna', (SELECT id FROM states WHERE name = 'Bihar'), 25.5941, 85.1376),
      ('Gaya', (SELECT id FROM states WHERE name = 'Bihar'), 24.7914, 85.0002),
      ('Muzaffarpur', (SELECT id FROM states WHERE name = 'Bihar'), 26.1209, 85.3647),
      ('Bhagalpur', (SELECT id FROM states WHERE name = 'Bihar'), 25.2425, 87.0079),
      ('Darbhanga', (SELECT id FROM states WHERE name = 'Bihar'), 26.1542, 85.8918),
      ('Purnia', (SELECT id FROM states WHERE name = 'Bihar'), 25.7771, 87.4753),
      ('Arrah', (SELECT id FROM states WHERE name = 'Bihar'), 25.5607, 84.6705),
      
      -- Chhattisgarh
      ('Raipur', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 21.2514, 81.6296),
      ('Bhilai', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 21.1938, 81.3509),
      ('Bilaspur', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 22.0797, 82.1409),
      ('Korba', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 22.3595, 82.7501),
      ('Raigarh', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 21.9, 83.4),
      ('Jagdalpur', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 19.0723, 82.0382),
      ('Ambikapur', (SELECT id FROM states WHERE name = 'Chhattisgarh'), 23.1185, 83.1971),
      
      -- Goa
      ('Panaji', (SELECT id FROM states WHERE name = 'Goa'), 15.4909, 73.8278),
      ('Margao', (SELECT id FROM states WHERE name = 'Goa'), 15.2721, 73.9581),
      ('Vasco da Gama', (SELECT id FROM states WHERE name = 'Goa'), 15.3961, 73.8120),
      ('Mapusa', (SELECT id FROM states WHERE name = 'Goa'), 15.5933, 73.8129),
      ('Ponda', (SELECT id FROM states WHERE name = 'Goa'), 15.4027, 74.0078),
      ('Calangute', (SELECT id FROM states WHERE name = 'Goa'), 15.5440, 73.7559),
      
      -- Gujarat
      ('Ahmedabad', (SELECT id FROM states WHERE name = 'Gujarat'), 23.0225, 72.5714),
      ('Surat', (SELECT id FROM states WHERE name = 'Gujarat'), 21.1702, 72.8311),
      ('Vadodara', (SELECT id FROM states WHERE name = 'Gujarat'), 22.3072, 73.1812),
      ('Rajkot', (SELECT id FROM states WHERE name = 'Gujarat'), 22.3039, 70.8022),
      ('Gandhinagar', (SELECT id FROM states WHERE name = 'Gujarat'), 23.2156, 72.6369),
      ('Bhavnagar', (SELECT id FROM states WHERE name = 'Gujarat'), 21.7645, 72.1519),
      ('Jamnagar', (SELECT id FROM states WHERE name = 'Gujarat'), 22.4707, 70.0577),
      
      -- Haryana
      ('Chandigarh', (SELECT id FROM states WHERE name = 'Haryana'), 30.7333, 76.7794),
      ('Faridabad', (SELECT id FROM states WHERE name = 'Haryana'), 28.4089, 77.3178),
      ('Gurgaon', (SELECT id FROM states WHERE name = 'Haryana'), 28.4595, 77.0266),
      ('Panipat', (SELECT id FROM states WHERE name = 'Haryana'), 29.3909, 76.9635),
      ('Ambala', (SELECT id FROM states WHERE name = 'Haryana'), 30.3752, 76.7821),
      ('Yamunanagar', (SELECT id FROM states WHERE name = 'Haryana'), 30.1290, 77.2674),
      ('Rohtak', (SELECT id FROM states WHERE name = 'Haryana'), 28.8955, 76.6066),
      
      -- Himachal Pradesh
      ('Shimla', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 31.1048, 77.1734),
      ('Dharamshala', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 32.2189, 76.3234),
      ('Manali', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 32.2432, 77.1892),
      ('Solan', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 30.9081, 77.0967),
      ('Kullu', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 31.9592, 77.1089),
      ('Mandi', (SELECT id FROM states WHERE name = 'Himachal Pradesh'), 31.7080, 76.9320),
      
      -- Jharkhand
      ('Ranchi', (SELECT id FROM states WHERE name = 'Jharkhand'), 23.3441, 85.3096),
      ('Jamshedpur', (SELECT id FROM states WHERE name = 'Jharkhand'), 22.8046, 86.2029),
      ('Dhanbad', (SELECT id FROM states WHERE name = 'Jharkhand'), 23.7957, 86.4304),
      ('Bokaro', (SELECT id FROM states WHERE name = 'Jharkhand'), 23.6693, 86.1511),
      ('Hazaribagh', (SELECT id FROM states WHERE name = 'Jharkhand'), 23.9925, 85.3637),
      ('Deoghar', (SELECT id FROM states WHERE name = 'Jharkhand'), 24.4914, 86.6947),
      
      -- Karnataka
      ('Bengaluru', (SELECT id FROM states WHERE name = 'Karnataka'), 12.9716, 77.5946),
      ('Mysuru', (SELECT id FROM states WHERE name = 'Karnataka'), 12.2958, 76.6394),
      ('Hubballi', (SELECT id FROM states WHERE name = 'Karnataka'), 15.3647, 75.1240),
      ('Mangaluru', (SELECT id FROM states WHERE name = 'Karnataka'), 12.8698, 74.8383),
      ('Belagavi', (SELECT id FROM states WHERE name = 'Karnataka'), 15.8497, 74.4977),
      ('Kalaburagi', (SELECT id FROM states WHERE name = 'Karnataka'), 17.3297, 76.8343),
      
      -- Kerala
      ('Thiruvananthapuram', (SELECT id FROM states WHERE name = 'Kerala'), 8.5241, 76.9366),
      ('Kochi', (SELECT id FROM states WHERE name = 'Kerala'), 9.9312, 76.2673),
      ('Kozhikode', (SELECT id FROM states WHERE name = 'Kerala'), 11.2588, 75.7804),
      ('Thrissur', (SELECT id FROM states WHERE name = 'Kerala'), 10.5276, 76.2144),
      ('Kannur', (SELECT id FROM states WHERE name = 'Kerala'), 11.8745, 75.3704),
      ('Kollam', (SELECT id FROM states WHERE name = 'Kerala'), 8.8932, 76.6141),
      ('Alappuzha', (SELECT id FROM states WHERE name = 'Kerala'), 9.4981, 76.3388),
      
      -- Madhya Pradesh
      ('Bhopal', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 23.2599, 77.4126),
      ('Indore', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 22.7196, 75.8577),
      ('Gwalior', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 26.2183, 78.1828),
      ('Jabalpur', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 23.1815, 79.9864),
      ('Ujjain', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 23.1765, 75.7885),
      ('Sagar', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 23.8388, 78.7378),
      ('Dewas', (SELECT id FROM states WHERE name = 'Madhya Pradesh'), 22.9676, 76.0534),
      
      -- Maharashtra
      ('Mumbai', (SELECT id FROM states WHERE name = 'Maharashtra'), 19.0760, 72.8777),
      ('Pune', (SELECT id FROM states WHERE name = 'Maharashtra'), 18.5204, 73.8567),
      ('Nagpur', (SELECT id FROM states WHERE name = 'Maharashtra'), 21.1458, 79.0882),
      ('Thane', (SELECT id FROM states WHERE name = 'Maharashtra'), 19.2183, 72.9781),
      ('Nashik', (SELECT id FROM states WHERE name = 'Maharashtra'), 20.0059, 73.7629),
      ('Aurangabad', (SELECT id FROM states WHERE name = 'Maharashtra'), 19.8762, 75.3433),
      ('Solapur', (SELECT id FROM states WHERE name = 'Maharashtra'), 17.6599, 75.9064),
      
      -- Delhi
      ('New Delhi', (SELECT id FROM states WHERE name = 'Delhi'), 28.6139, 77.2090),
      ('Delhi', (SELECT id FROM states WHERE name = 'Delhi'), 28.7041, 77.1025),
      
      -- Rest of relevant states and cities...
      -- Add other states as needed
      
      -- Uttar Pradesh, West Bengal, etc.
      ('Lucknow', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 26.8467, 80.9462),
      ('Kanpur', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 26.4499, 80.3319),
      ('Varanasi', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 25.3176, 82.9739),
      ('Agra', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 27.1767, 78.0081),
      ('Noida', (SELECT id FROM states WHERE name = 'Uttar Pradesh'), 28.5355, 77.3910),
      
      ('Kolkata', (SELECT id FROM states WHERE name = 'West Bengal'), 22.5726, 88.3639),
      ('Howrah', (SELECT id FROM states WHERE name = 'West Bengal'), 22.5958, 88.2636),
      ('Durgapur', (SELECT id FROM states WHERE name = 'West Bengal'), 23.5204, 87.3119)
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
