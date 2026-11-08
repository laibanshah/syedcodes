-- ============================================================
-- 004  >>> THE ONE TO RUN IF YOUR DATABASE ALREADY EXISTS <<<
--
-- Why: the app no longer uses the secret / service-role key. Every admin write now
-- comes from the signed-in admin's browser session, so Row Level Security must allow
-- the "authenticated" role to write to the tables that the secret key used to write:
--   projects, services, about_section, contact_links, settings
-- (pricing_tiers, policy_sections and resources already allow this.)
--
-- Also: adds the "branding" storage bucket (logo, favicon, owner photo)
-- and makes sure projects.featured exists.
-- Safe to re-run.
-- ============================================================

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

-- ---------- Admin writes (authenticated = the admin account) ----------
DROP POLICY IF EXISTS "Admin write projects" ON public.projects;
DROP POLICY IF EXISTS "Admin write services" ON public.services;
DROP POLICY IF EXISTS "Admin write about_section" ON public.about_section;
DROP POLICY IF EXISTS "Admin write contact_links" ON public.contact_links;
DROP POLICY IF EXISTS "Admin write settings" ON public.settings;
CREATE POLICY "Admin write projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write about_section" ON public.about_section FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write contact_links" ON public.contact_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin write settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ---------- Branding bucket ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO UPDATE SET public = true;
UPDATE storage.buckets SET file_size_limit = NULL, allowed_mime_types = NULL WHERE id = 'branding';

DROP POLICY IF EXISTS "Public read branding" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert branding" ON storage.objects;
DROP POLICY IF EXISTS "Admin update branding" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete branding" ON storage.objects;
CREATE POLICY "Public read branding" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
CREATE POLICY "Admin insert branding" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'branding');
CREATE POLICY "Admin update branding" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'branding');
CREATE POLICY "Admin delete branding" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'branding');

-- Resumable (TUS) uploads need no extra SQL: they use the same storage policies as above.
