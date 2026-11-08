-- ============================================================
-- 003  Admin-managed content: pricing plans, policy sections, page text,
--      Lantern of Light, and the "project-images" storage bucket.
-- Safe to re-run. Seeds only when the tables are empty.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price text NOT NULL,
  currency text NOT NULL DEFAULT 'IST',
  description text NOT NULL DEFAULT '',
  features text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  cta_label text NOT NULL DEFAULT 'Get Started',
  cta_link text NOT NULL DEFAULT '/#contact',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.policy_sections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  items text[] NOT NULL DEFAULT '{}',
  sub_title text,
  sub_items text[] NOT NULL DEFAULT '{}',
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_sections ENABLE ROW LEVEL SECURITY;

-- IMPORTANT: turn OFF public sign-ups (Authentication > Sign In / Providers > Email >
-- "Allow new users to sign up") so that only the admin account you created can log in.
DROP POLICY IF EXISTS "Public read pricing_tiers" ON public.pricing_tiers;
DROP POLICY IF EXISTS "Admin write pricing_tiers" ON public.pricing_tiers;
CREATE POLICY "Public read pricing_tiers" ON public.pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Admin write pricing_tiers" ON public.pricing_tiers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read policy_sections" ON public.policy_sections;
DROP POLICY IF EXISTS "Admin write policy_sections" ON public.policy_sections;
CREATE POLICY "Public read policy_sections" ON public.policy_sections FOR SELECT USING (true);
CREATE POLICY "Admin write policy_sections" ON public.policy_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed with the content that used to be hard-coded (only if empty)
INSERT INTO public.pricing_tiers (name, price, currency, description, features, featured, cta_label, cta_link, order_index)
SELECT * FROM (VALUES
  ('Landing pages/ Portfolio', 'Rs 5,999', 'IST', 'Perfect for personal portfolios and single-page websites', ARRAY['Source code', 'Free Domain (.netlify.app or .vercel.app)', 'Free Hosting (on netlify or on vercel)', 'Mobile Responsive Design', 'Modern, glassmorphic, apple like, renaissance UI/UX', 'Fast Loading Speed', 'Basic SEO Setup', 'Secure Deployment', 'One Month Free Support', 'Single page website', 'Hard coded', 'You can later upgrade hosting, storage, or domain anytime according to your needs. Custom domains from platforms like Namecheap or GoDaddy can also be connected.']::text[], false, 'Get Started', '/#contact', 0),
  ('Blogging platform/business with backend', 'Rs 11,999', 'IST', 'Full-featured blogging platform with admin panel', ARRAY['Free Domain (.netlify.app or .vercel.app) + custom domain if you like', 'Free Hosting (on netlify or on vercel)', 'Free 5GB Cloud Storage (Supabase)', 'Mobile Responsive Design', 'Admin panel & Dashboard', 'Authentication', 'Basic cyber security', 'Fast Loading Speed', 'Basic SEO Setup', 'Secure Deployment', 'One Month Free Support', 'Source code', 'Multiple pages']::text[], true, 'Get Started', '/#contact', 1),
  ('E-Commerce website with stripe and all', 'Rs 21,999', 'IST', 'Complete e-commerce solution with payment integration', ARRAY['Stripe Connectivity', 'Wishlist/ Add to cart', 'User signup feature', 'Free Domain (.netlify.app or .vercel.app) + custom domain if you like', 'Free Hosting (on netlify or on vercel)', 'Free 5GB Cloud Storage (Supabase)', 'Mobile Responsive Design', 'Admin panel & Dashboard', 'Authentication', 'Basic cyber security', 'Fast Loading Speed', 'Basic SEO Setup', 'Secure Deployment', 'One Month Free Support', 'Source code', 'Multiple pages']::text[], false, 'Get Started', '/#contact', 2)
) AS v(name, price, currency, description, features, featured, cta_label, cta_link, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_tiers);

INSERT INTO public.policy_sections (title, items, sub_title, sub_items, order_index)
SELECT * FROM (VALUES
  ('Payment', ARRAY['50% Advance Before Starting The Project', 'Remaining 50% Before Final Deployment', 'Refund will be provided if the user cancels the project before pushing the source code but the initial 50% refund will only be provided if the user cancels the project within 12 hours of the payment', 'After full payment, the website will be fully deployed and handed over successfully', 'The client should create a new email address and grant temporary access to me in that email i will host the website and provide source code']::text[], NULL, '{}'::text[], 0),
  ('Revisions & Support', ARRAY['You will get revisions and iterations during development but for adding additional features you will need to pay extra', 'If any issue or accidental error happens within 1 month, we will provide free support', 'After that we charge 1000 (IST) per month for support, but we will provide you website in such a way that you wont be needing that']::text[], 'To Start The Project, We Only Need', ARRAY['50% Advance Payment', 'An Email ID for project setup and management (For Tier 2 & 3 websites only)']::text[], 1)
) AS v(title, items, sub_title, sub_items, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.policy_sections);

INSERT INTO public.settings (key, value) VALUES
  ('pricing_page', '{"label":"Pricing","title":"Choose Your Plan","description":"Transparent pricing for every project size. No hidden fees, no surprises.","policy_label":"Policy","policy_title":"Work Policy","policy_description":"Clear guidelines to ensure a smooth and successful collaboration"}'::jsonb),
  ('lantern', '{"title":"Lantern of Light","subtitle":"Spiritual & Islamic Community","description":"A spiritual and Islamic community presentation focused on guiding hearts, sharing wisdom, and fostering a supportive environment built on faith and unity.","image":"/assets/lol.png","button_label":"Join WhatsApp community","button_url":"https://whatsapp.com/channel/0029VaeYmbP5PO0zmfC6Yl2J"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Storage: "project-images" bucket (project screenshots, Lantern image)
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
UPDATE storage.buckets SET file_size_limit = NULL, allowed_mime_types = NULL WHERE id = 'project-images';
-- The only remaining cap is the project-wide limit: Dashboard > Storage > Settings >
-- "Upload file size limit" (free plan max 50 MB; paid plans can go much higher).

DROP POLICY IF EXISTS "Public read project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin insert project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update project-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete project-images" ON storage.objects;
-- Old policies from the first setup guide (they only allowed the service-role key)
DROP POLICY IF EXISTS "Public read access for project images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete" ON storage.objects;
CREATE POLICY "Public read project-images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Admin insert project-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Admin update project-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
CREATE POLICY "Admin delete project-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');
