# Supabase setup

All database / storage SQL for this project lives in `migrations/`. Run files in the
**SQL Editor** (Dashboard → SQL Editor → New query → paste → Run). Every file is safe to re-run.

| File | What it does | Run it if… |
|------|--------------|------------|
| `001_core_tables.sql` | projects, services, about, contact links, settings + public read access | brand-new project |
| `002_resources.sql` | resources table + `resources` bucket | brand-new project |
| `003_admin_content.sql` | pricing, policy, page text, `project-images` bucket | brand-new project |
| **`004_publishable_keys_and_branding.sql`** | admin write access for the signed-in admin (replaces the secret key), `branding` bucket, `projects.featured` | **every project — this is the only new one for an existing database** |

## Existing database (you already ran the old SQL files)

Run **only `004_publishable_keys_and_branding.sql`**. Nothing else changed.

## Brand-new database

Run `001` → `002` → `003` → `004` in order.

## Also in the Supabase dashboard

1. **API keys**: Project Settings → API Keys → copy the **Publishable key** (`sb_publishable_…`) into
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The secret key is no longer used anywhere — you can delete
   `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_SECRET_KEY` from `.env.local` and Netlify.
2. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up”. Any signed-in
   user can edit the site, so only the admin account you created should exist.
3. **Storage → Settings → Upload file size limit**: raise it if you upload files bigger than 50 MB
   (free plan maximum is 50 MB).
