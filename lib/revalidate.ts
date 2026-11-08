"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_PATHS = new Set(["/", "/pricing", "/projects", "/resources"]);

/**
 * Lets the signed-in admin refresh cached public pages after editing content
 * straight from the browser. The caller's Supabase access token is verified
 * with Supabase Auth, so anonymous visitors cannot trigger this.
 *
 * Pass "layout" to refresh every page (used for logo / favicon changes, which
 * appear on all pages).
 */
export async function revalidateSite(accessToken: string, paths: string[]): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !accessToken) throw new Error("Not configured");

  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data.user) throw new Error("Unauthorized");

  for (const p of paths) {
    if (p === "layout") revalidatePath("/", "layout");
    else if (ALLOWED_PATHS.has(p)) revalidatePath(p);
  }
}
