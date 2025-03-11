
-- First, create the feature_orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS feature_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    buyer_id UUID NOT NULL REFERENCES profiles(id),
    seller_id UUID NOT NULL REFERENCES profiles(id),
    amount NUMERIC NOT NULL,
    payment_status TEXT NOT NULL,
    invoice_number TEXT NOT NULL,
    order_type TEXT NOT NULL,
    feature_type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_address TEXT NOT NULL,
    invoice_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to handle feature order creation
CREATE OR REPLACE FUNCTION create_feature_order(order_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_order_id uuid;
  result jsonb;
BEGIN
    INSERT INTO feature_orders (
        listing_id,
        buyer_id,
        seller_id,
        amount,
        payment_status,
        invoice_number,
        order_type,
        feature_type,
        contact_name,
        contact_phone,
        contact_address
    )
    VALUES (
        (order_data->>'listing_id')::uuid,
        (order_data->>'buyer_id')::uuid,
        (order_data->>'seller_id')::uuid,
        (order_data->>'amount')::numeric,
        order_data->>'payment_status',
        order_data->>'invoice_number',
        order_data->>'order_type',
        order_data->>'feature_type',
        order_data->>'contact_name',
        order_data->>'contact_phone',
        order_data->>'contact_address'
    )
    RETURNING id INTO new_order_id;
    
    SELECT row_to_json(o)::jsonb INTO result
    FROM (SELECT * FROM feature_orders WHERE id = new_order_id) o;
    
    RETURN result;
END;
$$;

-- Create function to update feature order invoice URL
CREATE OR REPLACE FUNCTION update_feature_order_invoice(order_id uuid, invoice_url text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_order jsonb;
BEGIN
    UPDATE feature_orders 
    SET invoice_url = invoice_url,
        updated_at = now()
    WHERE id = order_id;
    
    SELECT row_to_json(o)::jsonb INTO updated_order
    FROM (SELECT * FROM feature_orders WHERE id = order_id) o;
    
    RETURN updated_order;
END;
$$;

-- Create function to count free feature requests
CREATE OR REPLACE FUNCTION get_feature_request_count(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  request_count integer;
BEGIN
    SELECT COUNT(*) INTO request_count
    FROM feature_orders
    WHERE seller_id = user_id
    AND amount = 0; -- Free feature requests
    
    RETURN request_count;
END;
$$;

-- Create function to check if user has free features available
CREATE OR REPLACE FUNCTION has_free_features_available(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_count integer;
  max_free_features constant integer := 3; -- Maximum allowed free feature requests
BEGIN
    SELECT COUNT(*) INTO free_count
    FROM feature_orders
    WHERE seller_id = user_id
    AND amount = 0; -- Free feature requests
    
    RETURN free_count < max_free_features;
END;
$$;

-- Create table for feature pricing
CREATE TABLE IF NOT EXISTS feature_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    subcategory TEXT,
    feature_type TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    original_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for coupon codes
CREATE TABLE IF NOT EXISTS feature_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    discount_amount NUMERIC,
    min_order_amount NUMERIC,
    max_discount NUMERIC,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Function to get feature price
CREATE OR REPLACE FUNCTION get_feature_price(category_name text, subcategory_name text, feature_type_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  pricing jsonb;
BEGIN
    -- Try to get specific subcategory pricing
    SELECT row_to_json(p)::jsonb INTO pricing
    FROM feature_pricing p
    WHERE p.category = category_name
    AND p.subcategory = subcategory_name
    AND p.feature_type = feature_type_name;
    
    -- If not found, try category-level pricing
    IF pricing IS NULL THEN
      SELECT row_to_json(p)::jsonb INTO pricing
      FROM feature_pricing p
      WHERE p.category = category_name
      AND p.subcategory IS NULL
      AND p.feature_type = feature_type_name;
    END IF;
    
    -- If still not found, get default pricing
    IF pricing IS NULL THEN
      SELECT row_to_json(p)::jsonb INTO pricing
      FROM feature_pricing p
      WHERE p.category = 'default'
      AND p.feature_type = feature_type_name;
    END IF;
    
    RETURN pricing;
END;
$$;

-- Initialize default pricing
INSERT INTO feature_pricing (category, subcategory, feature_type, price, original_price)
VALUES
  ('default', NULL, 'homepage', 499, 499),
  ('default', NULL, 'productPage', 299, 299),
  ('default', NULL, 'both', 799, 799)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_feature_order(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_feature_order_invoice(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_request_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION has_free_features_available(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_feature_price(text, text, text) TO authenticated;
GRANT SELECT, INSERT, UPDATE ON feature_orders TO authenticated;
GRANT SELECT ON feature_pricing TO authenticated;
GRANT SELECT ON feature_coupons TO authenticated;
