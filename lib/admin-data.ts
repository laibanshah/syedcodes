import { supabase } from "./supabase";
import { refreshPublicPages } from "./admin-client";
import type { Project, Service, AboutSection, ContactLink } from "./types";

/**
 * Admin-side data access. Runs in the browser with the signed-in admin's session,
 * so Row Level Security (not a secret key) decides what may be written.
 * Reads here THROW on error, so the admin never edits made-up fallback rows.
 */

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const now = () => new Date().toISOString();

// ---- Projects ----
type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;

export async function getProjects(): Promise<Project[]> {
  return check(await supabase.from("projects").select("*").order("created_at", { ascending: false })) ?? [];
}
export async function createProject(p: ProjectInput): Promise<void> {
  check(await supabase.from("projects").insert(p).select().single());
  await refreshPublicPages(["/", "/projects"]);
}
export async function updateProject(id: string, p: Partial<ProjectInput>): Promise<void> {
  check(await supabase.from("projects").update({ ...p, updated_at: now() }).eq("id", id).select().single());
  await refreshPublicPages(["/", "/projects"]);
}
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await refreshPublicPages(["/", "/projects"]);
}

// ---- Services ----
type ServiceInput = Omit<Service, "id" | "created_at" | "updated_at">;

export async function getServices(): Promise<Service[]> {
  return check(await supabase.from("services").select("*").order("order_index", { ascending: true })) ?? [];
}
export async function createService(s: ServiceInput): Promise<void> {
  check(await supabase.from("services").insert(s).select().single());
  await refreshPublicPages(["/"]);
}
export async function updateService(id: string, s: Partial<ServiceInput>): Promise<void> {
  check(await supabase.from("services").update({ ...s, updated_at: now() }).eq("id", id).select().single());
  await refreshPublicPages(["/"]);
}
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await refreshPublicPages(["/"]);
}

// ---- Contact links ----
type ContactInput = Omit<ContactLink, "id" | "created_at" | "updated_at">;

export async function getContactLinks(): Promise<ContactLink[]> {
  return check(await supabase.from("contact_links").select("*").order("order_index", { ascending: true })) ?? [];
}
export async function createContactLink(l: ContactInput): Promise<void> {
  check(await supabase.from("contact_links").insert(l).select().single());
  await refreshPublicPages(["/"]);
}
export async function updateContactLink(id: string, l: Partial<ContactInput>): Promise<void> {
  check(await supabase.from("contact_links").update({ ...l, updated_at: now() }).eq("id", id).select().single());
  await refreshPublicPages(["/"]);
}
export async function deleteContactLink(id: string): Promise<void> {
  const { error } = await supabase.from("contact_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await refreshPublicPages(["/"]);
}

// ---- About section (single row) ----
export async function getAboutSection(): Promise<AboutSection | null> {
  const { data, error } = await supabase.from("about_section").select("*").limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AboutSection | null) ?? null;
}
export async function updateAboutSection(about: { title: string | null; content: string | null }): Promise<void> {
  const existing = await getAboutSection();
  if (existing) {
    check(await supabase.from("about_section").update({ ...about, updated_at: now() }).eq("id", existing.id).select().single());
  } else {
    check(await supabase.from("about_section").insert(about).select().single());
  }
  await refreshPublicPages(["/"]);
}

// ---- Settings (key -> JSON value) ----
export async function getSetting<T extends object>(key: string): Promise<T | null> {
  const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.value as T | undefined) ?? null;
}
export async function updateSetting(key: string, value: object, paths: string[] = ["/"]): Promise<void> {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: now() }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  await refreshPublicPages(paths);
}
