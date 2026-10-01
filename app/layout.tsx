import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll";
import Script from "next/script";
import CustomCursor from "@/components/ui/CustomCursor";

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

export const metadata: Metadata = {
  title: "SyedCodes.UI | Premium Web Development Portfolio",
  description:
    "Personal portfolio for SyedCodes.UI showcasing luxury web development, React, Next.js, and client-focused solutions.",
};

import ShootingStars from "@/components/ShootingStars";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${instrumentSerif.variable} light`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <Script
          src="/netlify-identity-init.js"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.043) 1px, rgba(0,0,0,0) 1px), linear-gradient(rgba(255,255,255,0.043) 1px, rgba(0,0,0,0) 1px)`,
              backgroundSize: "56px 56px",
            }}
          />
          <ShootingStars />
          <SmoothScroll>
            <CustomCursor />
            {children}
            <Toaster position="bottom-right" theme="light" />
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
