import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isMissingEnv = !supabaseUrl || !supabaseAnonKey;

if (isMissingEnv) {
  console.warn(
    '⚠️ Warning: Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. ' +
    'The app will fall back to static preview data during build-time to prevent build failures. ' +
    'Please set these environment variables in your local .env.local file or in Netlify for full database functionality.'
  );
}

// Fallback mock values to prevent createClient from throwing on empty/invalid arguments during build
const urlToUse = supabaseUrl || 'https://placeholder-project.supabase.co';
const anonKeyToUse = supabaseAnonKey || 'placeholder-anon-key';

// Public client for frontend operations
export const supabase = createClient(urlToUse, anonKeyToUse);

// Admin client with service role key for bypassing RLS
// On the client-side, we fall back to the public client to prevent initialization errors
export const supabaseAdmin = supabaseServiceKey
  ? createClient(urlToUse, supabaseServiceKey)
  : supabase;

// Types for our database tables
export type { Project, Service, AboutSection, ContactLink, Setting } from './types';
