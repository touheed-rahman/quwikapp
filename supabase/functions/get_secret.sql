
CREATE OR REPLACE FUNCTION get_secret(name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN current_setting('app.settings.' || name);
END;
$$;
