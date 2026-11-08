-- ============================================================
-- 001  Core tables: projects, services, about, contact links, settings
-- Safe to re-run. Does NOT overwrite existing data.
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  link text NOT NULL,
  image_url text,
  tech_stack text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- Older installs may not have the "featured" column yet.
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.about_section (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  content text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  url text NOT NULL,
  icon_name text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Starter content (only when the table is empty)
INSERT INTO public.about_section (title, content)
SELECT 'The Architect Behind the Code',
       'I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites. My client-focused approach ensures every pixel is perfect and every interaction feels professional.'
WHERE NOT EXISTS (SELECT 1 FROM public.about_section);

INSERT INTO public.services (title, description, icon_name, order_index)
SELECT * FROM (VALUES
  ('Static Websites', 'Fast, secure, and beautiful static sites tailored for small businesses and personal portfolios.', 'Globe', 0),
  ('Dynamic Web Apps', 'Complex, interactive web applications built with React and Next.js for scalable solutions.', 'Monitor', 1),
  ('Admin Dashboards', 'Custom dashboards for managing data, users, and content with intuitive UI.', 'Server', 2),
  ('Authentication Systems', 'Secure login, registration, and role-based access control for your applications.', 'Lock', 3),
  ('Blogging Platforms', 'SEO-optimized, content-rich blogging systems with easy-to-use CMS integration.', 'PenTool', 4),
  ('Business Websites', 'Corporate websites designed to establish trust, generate leads, and showcase services.', 'Briefcase', 5)
) AS v(title, description, icon_name, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.services);

INSERT INTO public.contact_links (platform, url, icon_name, order_index)
SELECT * FROM (VALUES
  ('LinkedIn', 'https://www.linkedin.com/in/laiban-shah-394483408', 'FaLinkedin', 0),
  ('GitHub', 'https://github.com/laibanshah', 'FaGithub', 1),
  ('Instagram', 'https://www.instagram.com/syedcodes.ui/', 'FaInstagram', 2),
  ('YouTube', 'https://www.youtube.com/@lantern_oflight', 'FaYoutube', 3),
  ('Email', 'mailto:lanternoflight11@gmail.com', 'Mail', 4)
) AS v(platform, url, icon_name, order_index)
WHERE NOT EXISTS (SELECT 1 FROM public.contact_links);

INSERT INTO public.settings (key, value) VALUES
  ('hero', '{"title": "Welcome to SyedCodes.UI", "subtitle": "Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression."}'::jsonb),
  ('social_links', '{"linkedin": "https://www.linkedin.com/in/laiban-shah-394483408", "github": "https://github.com/laibanshah", "instagram": "https://www.instagram.com/syedcodes.ui/", "youtube": "https://www.youtube.com/@lantern_oflight"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Row Level Security: everyone can read; writes are added in 004.
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for projects" ON public.projects;
DROP POLICY IF EXISTS "Public read access for services" ON public.services;
DROP POLICY IF EXISTS "Public read access for about_section" ON public.about_section;
DROP POLICY IF EXISTS "Public read access for contact_links" ON public.contact_links;
DROP POLICY IF EXISTS "Public read access for settings" ON public.settings;
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read access for services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public read access for about_section" ON public.about_section FOR SELECT USING (true);
CREATE POLICY "Public read access for contact_links" ON public.contact_links FOR SELECT USING (true);
CREATE POLICY "Public read access for settings" ON public.settings FOR SELECT USING (true);
