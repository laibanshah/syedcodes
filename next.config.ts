import type { NextConfig } from "next";

// Allow next/image to optimise files stored in *your* Supabase project
// (derived from the env var, with the original project as a fallback).
function supabaseHostname(): string {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;
    }
  } catch {
    /* ignore malformed URL */
  }
  return "enmlevvmvygmmhkppmrg.supabase.co";
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname(),
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Uploaded images never change (unique file names), so cache optimised copies for a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Belt and braces with the <meta name="robots"> tag in app/admin/layout.tsx.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
