import type { MetadataRoute } from "next";
import { getSiteUrl, PUBLIC_PATHS } from "@/lib/site";

const PRIORITY: Record<string, number> = { "/": 1, "/projects": 0.8, "/pricing": 0.8, "/resources": 0.6 };

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();
  return PUBLIC_PATHS.map((path) => ({
    url: path === "/" ? base : `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: PRIORITY[path] ?? 0.5,
  }));
}
