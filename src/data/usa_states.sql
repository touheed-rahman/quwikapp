
-- Insert USA states if they don't exist
INSERT INTO states (id, name, country_code)
VALUES 
  (gen_random_uuid(), 'Alabama', 'US'),
  (gen_random_uuid(), 'Alaska', 'US'),
  (gen_random_uuid(), 'Arizona', 'US'),
  (gen_random_uuid(), 'Arkansas', 'US'),
  (gen_random_uuid(), 'California', 'US'),
  (gen_random_uuid(), 'Colorado', 'US'),
  (gen_random_uuid(), 'Connecticut', 'US'),
  (gen_random_uuid(), 'Delaware', 'US'),
  (gen_random_uuid(), 'Florida', 'US'),
  (gen_random_uuid(), 'Georgia', 'US')
ON CONFLICT (name, country_code) DO NOTHING;
