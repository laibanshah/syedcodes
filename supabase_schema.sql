-- Create resources table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  resource_type text NOT NULL CHECK (resource_type IN ('link', 'file')),
  url text,
  file_path text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist to allow recreation
DROP POLICY IF EXISTS "Allow public read access on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated update on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated delete on resources" ON public.resources;

-- Policies for resources table
CREATE POLICY "Allow public read access on resources" 
ON public.resources FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on resources" 
ON public.resources FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on resources" 
ON public.resources FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on resources" 
ON public.resources FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Bucket for resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

-- Drop storage policies if they exist to allow recreation
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

-- Policies for storage bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resources');

CREATE POLICY "Authenticated Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Updates" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'resources' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated Deletes" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'resources' AND auth.role() = 'authenticated');
