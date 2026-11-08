import { supabase } from "./supabase";
import type { Project, Service, ContactLink, BrandingContent } from "./types";
import { DEFAULT_BRANDING, withMeta } from "./content-defaults";

/**
 * Public, read-only data for server components.
 * Runs on the server while a page is rendered/revalidated, with the publishable key.
 * If a query fails (tables missing, project paused...) the site still renders using the
 * fallbacks below instead of crashing.
 */

const FALLBACK_SERVICES = withMeta(
  [
    { title: "Static Websites", description: "Fast, secure, and beautiful static sites tailored for small businesses and personal portfolios.", icon_name: "Globe", order_index: 0 },
    { title: "Dynamic Web Apps", description: "Complex, interactive web applications built with React and Next.js for scalable solutions.", icon_name: "Monitor", order_index: 1 },
    { title: "Admin Dashboards", description: "Custom dashboards for managing data, users, and content with intuitive UI.", icon_name: "Server", order_index: 2 },
    { title: "Authentication Systems", description: "Secure login, registration, and role-based access control for your applications.", icon_name: "Lock", order_index: 3 },
    { title: "Blogging Platforms", description: "SEO-optimized, content-rich blogging systems with easy-to-use CMS integration.", icon_name: "PenTool", order_index: 4 },
    { title: "Business Websites", description: "Corporate websites designed to establish trust, generate leads, and showcase services.", icon_name: "Briefcase", order_index: 5 },
  ],
  "fallback-service"
) as Service[];

const FALLBACK_CONTACT_LINKS = withMeta(
  [
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/laiban-shah-394483408", icon_name: "FaLinkedin", order_index: 0 },
    { platform: "GitHub", url: "https://github.com/laibanshah", icon_name: "FaGithub", order_index: 1 },
    { platform: "Instagram", url: "https://www.instagram.com/syedcodes.ui/", icon_name: "FaInstagram", order_index: 2 },
    { platform: "YouTube", url: "https://www.youtube.com/@lantern_oflight", icon_name: "FaYoutube", order_index: 3 },
    { platform: "Email", url: "mailto:lanternoflight11@gmail.com", icon_name: "Mail", order_index: 4 },
  ],
  "fallback-contact"
) as ContactLink[];

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching projects:", error.message);
      return [];
    }
    return (data ?? []) as Project[];
  } catch (e) {
    console.error("Exception fetching projects:", e);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching featured projects:", error.message);
      return [];
    }
    return (data ?? []) as Project[];
  } catch (e) {
    console.error("Exception fetching featured projects:", e);
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) {
      console.error("Error fetching services:", error.message);
      return FALLBACK_SERVICES;
    }
    return (data ?? []) as Service[];
  } catch (e) {
    console.error("Exception fetching services:", e);
    return FALLBACK_SERVICES;
  }
}

export async function getContactLinks(): Promise<ContactLink[]> {
  try {
    const { data, error } = await supabase
      .from("contact_links")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) {
      console.error("Error fetching contact links:", error.message);
      return FALLBACK_CONTACT_LINKS;
    }
    return (data ?? []) as ContactLink[];
  } catch (e) {
    console.error("Exception fetching contact links:", e);
    return FALLBACK_CONTACT_LINKS;
  }
}

/** Reads one JSON value from the `settings` table. Returns `fallback` if missing or on error. */
export async function getSettingValue<T extends object>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) {
      console.error(`Error fetching setting ${key}:`, error.message);
      return fallback;
    }
    if (!data?.value || typeof data.value !== "object") return fallback;
    return { ...fallback, ...(data.value as Partial<T>) };
  } catch (e) {
    console.error(`Exception fetching setting ${key}:`, e);
    return fallback;
  }
}

export interface HeroSettings {
  title?: string;
  subtitle?: string;
}

export const HERO_KEY = "hero";
export const SOCIAL_KEY = "social_links";
export const BRANDING_KEY = "branding";

export function getHeroSettings(): Promise<HeroSettings> {
  return getSettingValue<HeroSettings>(HERO_KEY, {});
}

export async function getSocialLinks(): Promise<{ platform: string; url: string }[] | undefined> {
  const value = await getSettingValue<Record<string, string>>(SOCIAL_KEY, {});
  const entries = Object.entries(value).filter(([, url]) => typeof url === "string" && url);
  if (!entries.length) return undefined;
  return entries.map(([platform, url]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    url,
  }));
}

export function getBranding(): Promise<BrandingContent> {
  return getSettingValue<BrandingContent>(BRANDING_KEY, DEFAULT_BRANDING);
}
