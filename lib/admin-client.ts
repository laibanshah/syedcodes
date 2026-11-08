import { supabase, SUPABASE_URL } from "./supabase";
import { revalidateSite } from "./revalidate";
import {
  resumableUpload,
  RESUMABLE_THRESHOLD,
  HttpError,
  type UploadOptions,
} from "./resumable-upload";

export type { UploadProgress, UploadOptions } from "./resumable-upload";

/** Refresh cached public pages after an admin edit. Never throws. Use "layout" for site-wide changes. */
export async function refreshPublicPages(paths: string[]): Promise<void> {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return;
    await revalidateSite(token, paths);
  } catch (e) {
    console.warn("Could not refresh public pages (they will update shortly anyway):", e);
  }
}

function uniqueName(file: File, prefix: string): string {
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, "") || "file";
  return `${safePrefix}-${id}.${ext || "bin"}`;
}

/**
 * Upload straight from the browser to Supabase Storage using the admin's session.
 * Small files: one request. Files over 6 MB: resumable chunked upload that survives
 * dropped mobile connections, with progress reporting.
 * Returns the public URL.
 */
export async function uploadFile(
  bucket: string,
  file: File,
  prefix = "file",
  options: UploadOptions = {}
): Promise<{ path: string; url: string }> {
  const path = uniqueName(file, prefix);
  const { onProgress } = options;
  const publicUrl = (name: string) => supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;

  if (file.size > RESUMABLE_THRESHOLD) {
    try {
      const finalName = await resumableUpload(bucket, file, path, options);
      return { path: finalName, url: publicUrl(finalName) };
    } catch (e) {
      // Only if the resumable endpoint doesn't exist do we fall back to a plain upload below.
      const unsupported = e instanceof HttpError && (e.status === 404 || e.status === 405 || e.status === 501);
      if (!unsupported) throw explain(e);
    }
  }

  onProgress?.({ loaded: 0, total: file.size, percent: 0, retrying: false });
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  onProgress?.({ loaded: file.size, total: file.size, percent: 100, retrying: false });
  return { path, url: publicUrl(path) };
}

/** Same as uploadFile, returning just the public URL. */
export async function uploadPublicFile(
  bucket: string,
  file: File,
  prefix = "file",
  options: UploadOptions = {}
): Promise<string> {
  return (await uploadFile(bucket, file, prefix, options)).url;
}

function explain(e: unknown): Error {
  if (e instanceof HttpError) {
    if (e.status === 413) {
      return new Error(
        "This file is larger than your Supabase upload limit. Raise it in Storage > Settings > Upload file size limit."
      );
    }
    if (e.status === 401 || e.status === 403) {
      return new Error("Not allowed to upload. Sign in again, and make sure the storage policies from supabase/migrations were run.");
    }
  }
  return e instanceof Error ? e : new Error("Upload failed");
}

/** Best-effort delete of a file previously stored in `bucket` (given its public URL). */
export async function removePublicFile(bucket: string, publicUrl: string | null | undefined): Promise<void> {
  if (!publicUrl || !publicUrl.startsWith(SUPABASE_URL)) return;
  try {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return;
    const path = decodeURIComponent(publicUrl.slice(idx + marker.length).split("?")[0]);
    await supabase.storage.from(bucket).remove([path]);
  } catch (e) {
    console.warn("Could not remove old file:", e);
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
