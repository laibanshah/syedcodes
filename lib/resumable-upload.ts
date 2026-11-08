import { supabase, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./supabase";

/**
 * Resumable uploads to Supabase Storage using the TUS protocol (no extra npm package).
 *
 *  - The file is sent in 6 MB chunks (the size Supabase requires).
 *  - If the connection drops (typical on slow mobile data) the upload waits for the
 *    network to come back, asks the server how much it already has, and continues from there.
 *  - The upload URL is remembered in localStorage, so even closing the tab and picking the
 *    same file again resumes instead of starting over.
 *  - Progress is reported while bytes are being sent.
 *
 * Docs: https://supabase.com/docs/guides/storage/uploads/resumable-uploads
 */

export const CHUNK_SIZE = 6 * 1024 * 1024; // Supabase requires exactly 6 MB chunks (except the last)
/** Files up to this size use a single normal request; bigger ones are resumable. */
export const RESUMABLE_THRESHOLD = CHUNK_SIZE;

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number; // 0-100
  /** True while waiting to retry after a dropped connection. */
  retrying: boolean;
}

export interface UploadOptions {
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
}

class HttpError extends Error {
  status: number;
  constructor(status: number, body = "") {
    super(`Upload failed (HTTP ${status})${body ? `: ${body.slice(0, 200)}` : ""}`);
    this.status = status;
  }
}

const RETRY_DELAYS = [0, 1000, 3000, 5000, 8000, 12000, 20000, 30000];

const abortError = () => new DOMException("Upload cancelled", "AbortError");
const isAbort = (e: unknown) => e instanceof DOMException && e.name === "AbortError";

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(abortError());
      },
      { once: true }
    );
  });
}

/** Resolves as soon as the browser reports it is online again (or after 60 s, then we just try). */
function waitForOnline(signal?: AbortSignal): Promise<void> {
  if (typeof navigator === "undefined" || navigator.onLine !== false) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());
    const done = () => {
      cleanup();
      resolve();
    };
    const onAbort = () => {
      cleanup();
      reject(abortError());
    };
    const t = setTimeout(done, 60000);
    function cleanup() {
      clearTimeout(t);
      window.removeEventListener("online", done);
      signal?.removeEventListener("abort", onAbort);
    }
    window.addEventListener("online", done, { once: true });
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function toBase64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function authHeaders(): Promise<Record<string, string>> {
  // getSession() refreshes an expired token, so long uploads survive token expiry.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("You are signed out. Please sign in again and retry.");
  return { Authorization: `Bearer ${token}`, apikey: SUPABASE_PUBLISHABLE_KEY };
}

const ENDPOINT = `${SUPABASE_URL}/storage/v1/upload/resumable`;

async function createUpload(
  file: File,
  bucket: string,
  objectName: string,
  signal?: AbortSignal
): Promise<string> {
  const metadata = [
    `bucketName ${toBase64(bucket)}`,
    `objectName ${toBase64(objectName)}`,
    `contentType ${toBase64(file.type || "application/octet-stream")}`,
    `cacheControl ${toBase64("31536000")}`,
  ].join(",");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    signal,
    headers: {
      ...(await authHeaders()),
      "Tus-Resumable": "1.0.0",
      "Upload-Length": String(file.size),
      "Upload-Metadata": metadata,
      "x-upsert": "false",
    },
  });
  if (res.status !== 201) throw new HttpError(res.status, await res.text().catch(() => ""));

  const location = res.headers.get("Location");
  if (!location) throw new Error("The storage server did not return an upload address.");
  const url = new URL(location, ENDPOINT);
  if (url.protocol === "http:" && ENDPOINT.startsWith("https:")) url.protocol = "https:";
  return url.toString();
}

/** Asks the server how many bytes it already has. null = this upload no longer exists. */
async function getOffset(url: string, signal?: AbortSignal): Promise<number | null> {
  const res = await fetch(url, {
    method: "HEAD",
    signal,
    headers: { ...(await authHeaders()), "Tus-Resumable": "1.0.0" },
  });
  if (res.status === 404 || res.status === 410 || res.status === 403) return null;
  if (!res.ok) throw new HttpError(res.status);
  const header = res.headers.get("Upload-Offset");
  const offset = header == null ? 0 : parseInt(header, 10);
  return Number.isFinite(offset) ? offset : 0;
}

/** Sends one chunk. XHR (not fetch) because only XHR reports upload progress. */
async function patchChunk(
  url: string,
  chunk: Blob,
  offset: number,
  onBytes: (sentInChunk: number) => void,
  signal?: AbortSignal
): Promise<number> {
  const headers = await authHeaders();
  return new Promise<number>((resolve, reject) => {
    if (signal?.aborted) return reject(abortError());
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, true);
    Object.entries({
      ...headers,
      "Tus-Resumable": "1.0.0",
      "Upload-Offset": String(offset),
      "Content-Type": "application/offset+octet-stream",
    }).forEach(([k, v]) => xhr.setRequestHeader(k, v));

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onBytes(e.loaded);
    };
    xhr.onload = () => {
      if (xhr.status === 204 || xhr.status === 200) {
        const header = xhr.getResponseHeader("Upload-Offset");
        const next = header ? parseInt(header, 10) : offset + chunk.size;
        resolve(Number.isFinite(next) ? next : offset + chunk.size);
      } else {
        reject(new HttpError(xhr.status, xhr.responseText));
      }
    };
    xhr.onerror = () => reject(new TypeError("Network error"));
    xhr.ontimeout = () => reject(new TypeError("Network timeout"));
    xhr.onabort = () => reject(abortError());
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(chunk);
  });
}

// ---- remembered uploads (resume after closing the tab) ----
const fingerprint = (bucket: string, f: File) => `sb-tus:${bucket}:${f.name}:${f.size}:${f.lastModified}`;
interface Saved {
  url: string;
  objectName: string;
}
function loadSaved(key: string): Saved | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function saveSaved(key: string, value: Saved) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) - resume within this page still works */
  }
}
function clearSaved(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * Uploads `file` to `bucket` as `objectName` using TUS.
 * Throws HttpError-like Errors; the caller decides whether to fall back to a plain upload.
 */
export async function resumableUpload(
  bucket: string,
  file: File,
  objectName: string,
  { onProgress, signal }: UploadOptions = {}
): Promise<string> {
  const key = fingerprint(bucket, file);
  const report = (loaded: number, retrying = false) =>
    onProgress?.({
      loaded,
      total: file.size,
      percent: Math.min(100, Math.floor((loaded / file.size) * 100)),
      retrying,
    });

  let url: string | null = null;
  let offset = 0;
  let name = objectName;

  const saved = loadSaved(key);
  if (saved) {
    try {
      const existing = await getOffset(saved.url, signal);
      if (existing !== null && existing <= file.size) {
        url = saved.url;
        name = saved.objectName;
        offset = existing;
      } else {
        clearSaved(key);
      }
    } catch (e) {
      if (isAbort(e)) throw e;
      clearSaved(key);
    }
  }

  if (!url) {
    url = await createUpload(file, bucket, name, signal);
    saveSaved(key, { url, objectName: name });
  }

  report(offset);

  let attempt = 0;
  while (offset < file.size) {
    try {
      const end = Math.min(offset + CHUNK_SIZE, file.size);
      const base = offset;
      offset = await patchChunk(url, file.slice(base, end), base, (sent) => report(base + sent), signal);
      attempt = 0;
      report(offset);
    } catch (e) {
      if (isAbort(e)) throw e;
      // Permanent problems: stop and tell the user (413 too big, 401/403 not allowed...).
      if (e instanceof HttpError && e.status !== 409 && e.status !== 423 && e.status !== 429 && e.status < 500) {
        if (e.status === 404 || e.status === 410) clearSaved(key);
        throw e;
      }
      attempt += 1;
      if (attempt > RETRY_DELAYS.length) throw e;
      report(offset, true);
      await waitForOnline(signal);
      await sleep(RETRY_DELAYS[attempt - 1], signal);
      // Ask the server where we really are; it may have received part of the failed chunk.
      try {
        const actual = await getOffset(url, signal);
        if (actual === null) {
          clearSaved(key);
          throw new Error("The upload expired on the server. Please try again.");
        }
        offset = actual;
      } catch (inner) {
        if (isAbort(inner)) throw inner;
        if (inner instanceof Error && inner.message.startsWith("The upload expired")) throw inner;
        // Still offline / server hiccup: the next loop iteration will retry the chunk.
      }
    }
  }

  clearSaved(key);
  report(file.size);
  return name;
}

export { HttpError };
