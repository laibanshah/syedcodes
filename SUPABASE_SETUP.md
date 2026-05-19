# Supabase Setup Guide

This guide will help you set up Supabase for your portfolio admin panel.

## ✅ You Already Have

- ✅ Supabase project created
- ✅ `project-images` storage bucket created
- ✅ Environment variables set in `.env.local` with:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (secret key to bypass RLS)

## Step 1: Create Database Tables

Go to your Supabase project dashboard > **SQL Editor** and run the following SQL commands **one by one** or as a single script:

### Create Tables

```sql
-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  link TEXT NOT NULL,
  image_url TEXT,
  tech_stack TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- About section table
CREATE TABLE about_section (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  content TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contact links table
CREATE TABLE contact_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- General settings table
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Insert Default Data

```sql
-- Insert default about section
INSERT INTO about_section (title, content) VALUES 
('The Architect Behind the Code', 'I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites. My client-focused approach ensures every pixel is perfect and every interaction feels professional.');

-- Insert default services
INSERT INTO services (title, description, icon_name, order_index) VALUES
('Static Websites', 'Fast, secure, and beautiful static sites tailored for small businesses and personal portfolios.', 'Globe', 0),
('Dynamic Web Apps', 'Complex, interactive web applications built with React and Next.js for scalable solutions.', 'Monitor', 1),
('Admin Dashboards', 'Custom dashboards for managing data, users, and content with intuitive UI.', 'Server', 2),
('Authentication Systems', 'Secure login, registration, and role-based access control for your applications.', 'Lock', 3),
('Blogging Platforms', 'SEO-optimized, content-rich blogging systems with easy-to-use CMS integration.', 'PenTool', 4),
('Business Websites', 'Corporate websites designed to establish trust, generate leads, and showcase services.', 'Briefcase', 5);

-- Insert default contact links
INSERT INTO contact_links (platform, url, icon_name, order_index) VALUES
('LinkedIn', 'https://www.linkedin.com/in/laiban-shah-394483408', 'FaLinkedin', 0),
('GitHub', 'https://github.com/laibanshah', 'FaGithub', 1),
('Instagram', 'https://www.instagram.com/syedcodes.ui/', 'FaInstagram', 2),
('YouTube', 'https://www.youtube.com/@lantern_oflight', 'FaYoutube', 3),
('WhatsApp', 'https://wa.me/message/YOUR_WHATSAPP_LINK', 'FaWhatsapp', 4),
('Email', 'mailto:lanternoflight11@gmail.com', 'Mail', 5);

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('hero', '{"title": "Welcome to SyedCodes.UI", "subtitle": "Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression."}'),
('social_links', '{"linkedin": "https://www.linkedin.com/in/laiban-shah-394483408", "github": "https://github.com/laibanshah", "instagram": "https://www.instagram.com/syedcodes.ui/", "youtube": "https://www.youtube.com/@lantern_oflight"}');
```

## Step 2: Enable RLS (Row Level Security)

Run this SQL to enable RLS on all tables and set up policies:

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can read)
CREATE POLICY "Public read access for projects"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for services"
ON services FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for about_section"
ON about_section FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for contact_links"
ON contact_links FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read access for settings"
ON settings FOR SELECT
TO public
USING (true);

-- Service role can bypass RLS (for admin operations)
-- The code uses SUPABASE_SERVICE_ROLE_KEY for write operations
-- No additional policies needed for writes since we use service role key
```

## Step 3: Set Up Storage Policies for Images

Run this SQL to set up storage policies for the `project-images` bucket:

```sql
-- Storage policies for project-images bucket
CREATE POLICY "Public read access for project images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Service role can upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Service role can delete"
ON storage.objects FOR DELETE
TO service_role
USING (bucket_id = 'project-images');
```

## Step 4: Verify Your Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `about_section`
   - `contact_links`
   - `projects`
   - `services`
   - `settings`
3. Click on each table to verify the default data was inserted
4. Go to **Storage** and verify `project-images` bucket exists

## Step 5: Run Your Application

1. Start your development server:
```bash
npm run dev
```

2. Access your admin panel at: `http://localhost:3000/admin`

## Step 6: Using the Admin Panel

### Projects Tab
- Click "Add Project" to create a new project
- Fill in the title, description, link, and tech stack (comma-separated)
- Upload an image for the project screenshot
- Click "Create Project" to save
- Edit or delete projects using the buttons on each project card

### Services Tab
- Click "Add Service" to create a new service
- Fill in the title, description, and select an icon
- Click "Create Service" to save
- Edit or delete services as needed

### About Tab
- Edit the title and content for your about section
- Click "Save Changes" to update
- Preview your changes in real-time

### Contact Tab
- Click "Add Link" to add a new contact/social link
- Fill in the platform name, URL, and select an icon
- Click "Create Link" to save
- Edit or delete links as needed

### Settings Tab
- **Hero Section**: Update the hero title and subtitle
- **Social Links**: Update your social media URLs
- Click "Save" to apply changes

## Step 8: View Your Projects

1. Click "View Projects" on the hero section or visit `/projects`
2. See your projects displayed in a beautiful card layout
3. Hover over cards to see interactive effects
4. Click "Visit Site" to go to the project URL

## Troubleshooting

### Images not uploading
- Make sure the `project-images` bucket is public
- Check that storage policies are correctly set
- Verify your anon key has the right permissions

### Admin panel not loading data
- Check that environment variables are set correctly
- Verify the SQL was run successfully in Supabase
- Check browser console for errors

### RLS errors
- Make sure RLS policies are set up correctly
- Verify that public read access is enabled
- Check that authenticated users have write permissions

## Security Notes

- The current setup uses the anon key for client-side operations
- For production, consider implementing proper authentication
- You may want to add email/password authentication to protect the admin panel
- Consider adding a service role key for server-side operations

## Next Steps

1. Add authentication to protect the admin panel
2. Implement image optimization
3. Add more validation to forms
4. Consider adding a preview mode for projects
5. Add analytics tracking
