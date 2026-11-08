# SyedCodes.UI portfolio

Next.js 16 (App Router) · Tailwind CSS 4 · Supabase · deployed on Netlify.

## Run locally

```bash
cp env.example .env.local     # then fill in the two Supabase values
npm install
npm run dev                   # http://localhost:3000   (admin: /admin)
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Environment variables (local `.env.local` and Netlify → Site configuration → Environment variables)

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR-PROJECT.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` (Supabase → Project Settings → API Keys) |
| `NEXT_PUBLIC_SITE_URL` | optional; Netlify’s own `URL` is used if unset |

No secret / service-role key is used. Admin edits run with the admin’s own login and are authorised by
Row Level Security.

## Database

See [`supabase/README.md`](supabase/README.md) — SQL lives in `supabase/migrations/`.

## Notes

- The site is light-only (`color-scheme: only light`), so browser/OS dark modes can’t darken it.
- Public pages are static and refresh within 5 minutes, or instantly when you save in `/admin`.
- Big uploads (> 6 MB) use a built-in resumable uploader (TUS) with a progress bar.
