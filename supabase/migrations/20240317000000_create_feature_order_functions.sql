
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION create_feature_order(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION update_feature_order_invoice(uuid, text) TO authenticated;
GRANT SELECT, INSERT, UPDATE ON feature_orders TO authenticated;
