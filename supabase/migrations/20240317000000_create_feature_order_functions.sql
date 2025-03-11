
-- Create function to handle feature order creation
CREATE OR REPLACE FUNCTION create_feature_order(order_data json)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
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
        RETURNING *
    );
END;
$$;

-- Create function to update feature order invoice URL
CREATE OR REPLACE FUNCTION update_feature_order_invoice(order_id uuid, invoice_url text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE feature_orders 
    SET invoice_url = invoice_url
    WHERE id = order_id;
END;
$$;
