import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase, SUPABASE_URL } from "@/lib/supabase";
import { getBranding } from "@/lib/data";

// Served statically and refreshed in the background (and instantly when the admin saves).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resources | SyedCodes.UI",
  description: "Free links and downloads shared by SyedCodes.UI.",
};

interface Resource {
  id: string;
  title: string;
  description: string | null;
  resource_type: "link" | "file";
  url: string | null;
  file_path: string | null;
}

export default async function ResourcesPage() {
  const [{ data, error }, branding] = await Promise.all([
    supabase.from("resources").select("*").order("created_at", { ascending: false }),
    getBranding(),
  ]);
  const resources = (data ?? []) as Resource[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar logoUrl={branding.logo_url} />
      <main className="flex-1 pt-28 md:pt-32 pb-20">
        <div className="container-premium">
          <Link
            href="/#home"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <p className="label-studio mb-6">Free stuff</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-foreground leading-tight">
            <span className="text-brand">Resources</span>
          </h1>

          {error && (
            <div className="mt-12 text-center py-10 premium-card text-muted-foreground">
              Failed to load resources. Please try again later.
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => (
              <div key={resource.id} className="premium-card p-6 md:p-8 flex flex-col">
                <h2 className="text-xl font-heading font-semibold mb-2 tracking-tight break-words">
                  {resource.title}
                </h2>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">{resource.description}</p>

                <div className="flex justify-end mt-auto">
                  {resource.resource_type === "link" && resource.url ? (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline rounded-full px-5 py-2.5"
                    >
                      Visit link <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : resource.resource_type === "file" && resource.file_path ? (
                    <a
                      href={`${SUPABASE_URL}/storage/v1/object/public/resources/${resource.file_path}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary rounded-full px-5 py-2.5"
                    >
                      Download <Download className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}

            {resources.length === 0 && !error && (
              <div className="col-span-full text-center py-20 text-muted-foreground">
                No resources available yet. Check back later!
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer logoUrl={branding.logo_url} />
    </div>
  );
}
