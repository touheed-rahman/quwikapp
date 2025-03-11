
-- Create function to handle feature order creation
CREATE OR REPLACE FUNCTION create_feature_order(order_data json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_order_id uuid;
  result json;
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
    
    SELECT row_to_json(o) INTO result
    FROM (SELECT * FROM feature_orders WHERE id = new_order_id) o;
    
    RETURN result;
END;
$$;

-- Create function to update feature order invoice URL
CREATE OR REPLACE FUNCTION update_feature_order_invoice(order_id uuid, invoice_url text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_order json;
BEGIN
    UPDATE feature_orders 
    SET invoice_url = invoice_url
    WHERE id = order_id;
    
    SELECT row_to_json(o) INTO updated_order
    FROM (SELECT * FROM feature_orders WHERE id = order_id) o;
    
    RETURN updated_order;
END;
$$;
