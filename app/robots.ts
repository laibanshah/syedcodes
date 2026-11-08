import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// /admin is kept out of search with noindex (meta tag + X-Robots-Tag header) rather than a
// Disallow rule: crawlers must be able to fetch the page to see the noindex instruction.
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
