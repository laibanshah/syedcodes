import Link from "next/link";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0; // Fetch fresh data on each request

export default async function ResourcesPage() {
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 relative overflow-hidden flex flex-col items-center">
      {/* Background styling for glass effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black z-0"></div>
      
      <div className="relative z-10 w-full max-w-5xl">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-4">
          <Link href="/" className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Check main site</span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase text-center">Resources</h1>

          <Link href="/#projects" className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-xl transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <span className="text-sm font-medium tracking-wide">Check my other projects</span>
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-400 text-center py-10 bg-red-950/20 border border-red-500/20 rounded-xl backdrop-blur-md">
            Failed to load resources.
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources?.map((resource) => (
            <div 
              key={resource.id}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-2xl transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.37)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.05)]"
            >
              {/* Sharp glass accent */}
              <div className="absolute inset-0 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <h3 className="text-xl font-bold mb-2 tracking-tight">{resource.title}</h3>
              <p className="text-neutral-400 text-sm mb-6 line-clamp-3">
                {resource.description}
              </p>
              
              <div className="flex justify-end mt-auto">
                {resource.resource_type === 'link' && resource.url ? (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:scale-105 transition-transform"
                  >
                    Visit Link <ExternalLink className="w-4 h-4" />
                  </a>
                ) : resource.resource_type === 'file' && resource.file_path ? (
                  <a 
                    href={`${supabaseUrl}/storage/v1/object/public/resources/${resource.file_path}`} 
                    download
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-medium bg-[#00ff99] text-black px-5 py-2 rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,153,0.3)]"
                  >
                    Download <Download className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
          ))}

          {resources?.length === 0 && !error && (
            <div className="col-span-full text-center py-20 text-neutral-500">
              No resources available yet. Check back later!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
