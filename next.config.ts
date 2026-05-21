import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enmlevvmvygmmhkppmrg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Suppress script tag warning for Netlify Identity widget
  reactStrictMode: true,
};

export default nextConfig;
