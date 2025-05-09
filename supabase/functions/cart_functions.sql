
-- Function to get cart items
CREATE OR REPLACE FUNCTION public.get_cart_items(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  listing_id UUID,
  title VARCHAR,
  price NUMERIC,
  image VARCHAR,
  quantity INTEGER,
  user_id UUID,
  seller_id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cart_items.id,
    cart_items.listing_id,
    cart_items.title,
    cart_items.price,
    cart_items.image,
    cart_items.quantity,
    cart_items.user_id,
    cart_items.seller_id
  FROM 
    cart_items
  WHERE 
    cart_items.user_id = user_id_param;
END;
$$;

-- Function to add cart item
CREATE OR REPLACE FUNCTION public.add_cart_item(
  listing_id_param UUID,
  title_param VARCHAR,
  price_param NUMERIC,
  image_param VARCHAR,
  quantity_param INTEGER,
  seller_id_param UUID
)
RETURNS TABLE (
  id UUID,
  listing_id UUID,
  title VARCHAR,
  price NUMERIC,
  image VARCHAR,
  quantity INTEGER,
  user_id UUID,
  seller_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var UUID;
  result_record RECORD;
BEGIN
  -- Get the authenticated user ID
  user_id_var := auth.uid();
  
  -- Check if user is authenticated
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if the item already exists in the cart
  SELECT * INTO result_record FROM cart_items 
  WHERE user_id = user_id_var AND listing_id = listing_id_param;
  
  IF FOUND THEN
    -- Update quantity if item exists
    UPDATE cart_items 
    SET quantity = result_record.quantity + quantity_param 
    WHERE id = result_record.id
    RETURNING id, listing_id, title, price, image, quantity, user_id, seller_id INTO result_record;
  ELSE
    -- Insert new item
    INSERT INTO cart_items (
      user_id, 
      listing_id, 
      seller_id,
      title, 
      price, 
      image, 
      quantity
    ) 
    VALUES (
      user_id_var,
      listing_id_param,
      seller_id_param,
      title_param,
      price_param,
      image_param,
      quantity_param
    )
    RETURNING id, listing_id, title, price, image, quantity, user_id, seller_id INTO result_record;
  END IF;
  
  RETURN QUERY SELECT 
    result_record.id,
    result_record.listing_id,
    result_record.title,
    result_record.price,
    result_record.image,
    result_record.quantity,
    result_record.user_id,
    result_record.seller_id;
END;
$$;

-- Function to update cart item quantity
CREATE OR REPLACE FUNCTION public.update_cart_item_quantity(
  item_id_param UUID,
  quantity_param INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Get the authenticated user ID
  user_id_var := auth.uid();
  
  -- Check if user is authenticated
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Update the item quantity (only if the item belongs to the authenticated user)
  UPDATE cart_items 
  SET quantity = quantity_param
  WHERE id = item_id_param AND user_id = user_id_var;
END;
$$;

-- Function to remove a cart item
CREATE OR REPLACE FUNCTION public.remove_cart_item(
  item_id_param UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Get the authenticated user ID
  user_id_var := auth.uid();
  
  -- Check if user is authenticated
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Delete the item (only if it belongs to the authenticated user)
  DELETE FROM cart_items 
  WHERE id = item_id_param AND user_id = user_id_var;
END;
$$;

-- Function to clear the cart
CREATE OR REPLACE FUNCTION public.clear_cart(
  user_id_param UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Get the authenticated user ID
  user_id_var := auth.uid();
  
  -- Check if user is authenticated
  IF user_id_var IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check if the provided user_id matches the authenticated user
  IF user_id_var <> user_id_param THEN
    RAISE EXCEPTION 'Not authorized to clear this cart';
  END IF;
  
  -- Delete all items in the user's cart
  DELETE FROM cart_items WHERE user_id = user_id_var;
END;
$$;
