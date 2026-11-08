import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";
import ShootingStars from "@/components/ShootingStars";
import { getBranding } from "@/lib/data";
import { DEFAULT_FAVICON } from "@/lib/content-defaults";
import { getSiteUrl } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

const ICON_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

function iconType(url: string): string | undefined {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return ICON_TYPES[ext];
}

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getBranding();
  const favicon = branding.favicon_url || DEFAULT_FAVICON;
  const title = "SyedCodes.UI | Premium Web Development Portfolio";
  const description =
    "Personal portfolio for SyedCodes.UI showcasing luxury web development, React, Next.js, and client-focused solutions.";

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    icons: {
      icon: [{ url: favicon, type: iconType(favicon) }],
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "SyedCodes.UI",
    },
    // Tells browsers (incl. Chrome's auto dark mode) that this site is light-only.
    other: { "color-scheme": "only light" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable}`}
      style={{ colorScheme: "light" }}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <div aria-hidden="true" className="site-grid pointer-events-none fixed inset-0 -z-10" />
        <ShootingStars />
        <SmoothScroll>
          <CustomCursor />
          {children}
          <Toaster position="bottom-right" theme="light" />
        </SmoothScroll>
      </body>
    </html>
  );
}
