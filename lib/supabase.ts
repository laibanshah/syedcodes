import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Public client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client with service role key for bypassing RLS
// On the client-side, we fall back to the public client to prevent initialization errors
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Types for our database tables
export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image_url: string | null;
  tech_stack: string[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  title: string | null;
  content: string | null;
  updated_at: string;
}

export interface ContactLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  updated_at: string;
}
