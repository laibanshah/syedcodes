import { createClient } from "@supabase/supabase-js";

/**
 * One Supabase client, authenticated with the PUBLISHABLE key (sb_publishable_...).
 *
 * - Visitors (and the server while rendering public pages) only ever read data,
 *   which Row Level Security allows for everyone.
 * - The admin panel signs in with email + password in the browser; that session
 *   is what authorises every write (RLS policy "to authenticated").
 *
 * There is no secret / service-role key anywhere in this project any more.
 *
 * NEXT_PUBLIC_* values must be referenced statically (process.env.NAME) so that
 * Next.js can inline them into the browser bundle.
 */
export const SUPABASE_URL_ENV = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  // Legacy name, read only so an old Netlify/.env.local setup keeps working until you rename it.
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL_ENV && publishableKey);

if (!isSupabaseConfigured && typeof window === "undefined") {
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are not set. " +
      "Public pages will render built-in fallback content until you set them (.env.local locally, " +
      "Site configuration > Environment variables on Netlify)."
  );
}

// Placeholders keep createClient from throwing at build time when the variables are missing.
export const SUPABASE_URL = SUPABASE_URL_ENV || "https://placeholder-project.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = publishableKey || "placeholder-publishable-key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export type { Project, Service, AboutSection, ContactLink, Setting } from "./types";
