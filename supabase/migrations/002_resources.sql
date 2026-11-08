-- ============================================================
-- 002  Resources page: table + "resources" storage bucket
-- Safe to re-run.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  resource_type text NOT NULL CHECK (resource_type IN ('link', 'file')),
  url text,
  file_path text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated update on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated delete on resources" ON public.resources;
DROP POLICY IF EXISTS "Public read resources" ON public.resources;
DROP POLICY IF EXISTS "Admin write resources" ON public.resources;
CREATE POLICY "Public read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admin write resources" ON public.resources FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage bucket (public read, no per-bucket size / type limits)
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO UPDATE SET public = true;
UPDATE storage.buckets SET file_size_limit = NULL, allowed_mime_types = NULL WHERE id = 'resources';

-- Old, too-generic policy names from the first version of this project
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

DROP POLICY IF EXISTS "Public read resources files" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert resources files" ON storage.objects;
DROP POLICY IF EXISTS "Admin update resources files" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete resources files" ON storage.objects;
CREATE POLICY "Public read resources files" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Admin insert resources files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'resources');
CREATE POLICY "Admin update resources files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'resources');
CREATE POLICY "Admin delete resources files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'resources');
