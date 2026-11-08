/** Public base URL of the site (no trailing slash). Used by sitemap, robots and metadata. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    // Netlify sets URL (primary site URL) automatically during builds and at runtime.
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    "http://localhost:3000";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

/** Pages that should appear in the sitemap. /admin is deliberately not listed. */
export const PUBLIC_PATHS = ["/", "/projects", "/pricing", "/resources"] as const;
