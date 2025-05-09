
-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL,
  title VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  image VARCHAR NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT quantity_positive CHECK (quantity > 0),
  UNIQUE(user_id, listing_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE SET NULL,
  seller_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC NOT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('created', 'inspection', 'verified', 'shipped', 'delivered')),
  commission_rate NUMERIC NOT NULL DEFAULT 0.1,
  commission_amount NUMERIC NOT NULL,
  net_amount NUMERIC NOT NULL,
  tracking_number VARCHAR,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add updated_at trigger for cart_items
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_cart_items_updated_at();

-- Add updated_at trigger for orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at();

-- Add RLS policies for cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY cart_items_user_select ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY cart_items_user_insert ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY cart_items_user_update ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY cart_items_user_delete ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_user_select ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = seller_id);

CREATE POLICY orders_user_insert ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
