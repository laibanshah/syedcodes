import type { Metadata } from "next";

// The admin panel must never show up in search results.
export const metadata: Metadata = {
  title: "Admin | SyedCodes.UI",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
