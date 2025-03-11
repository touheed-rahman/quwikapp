
-- Create invoices bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for invoices bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'invoices' AND storage.foldername(name) = 'public');

CREATE POLICY "Authenticated users can upload invoices" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'invoices' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their invoices" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'invoices' AND auth.role() = 'authenticated');
