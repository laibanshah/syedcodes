import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import LanternOfLight from "@/components/LanternOfLight";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CinematicIntroClientWrapper from "@/components/CinematicIntroClientWrapper";
import { getFeaturedProjects, getHeroSettings, getSocialLinks, getBranding } from "@/lib/data";
import { getLanternContent } from "@/lib/content";

// Served as a static page and refreshed in the background (and instantly when the admin saves).
export const revalidate = 300;

export default async function Home() {
  // All reads run in parallel instead of one after another.
  const [projects, hero, socialLinks, lantern, branding] = await Promise.all([
    getFeaturedProjects(),
    getHeroSettings(),
    getSocialLinks(),
    getLanternContent(),
    getBranding(),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-transparent relative">
      <CinematicIntroClientWrapper />
      <Navbar logoUrl={branding.logo_url} />
      <div className="flex-1 relative z-10">
        <Hero title={hero.title} subtitle={hero.subtitle} ownerImage={branding.owner_image_url} />
        <Projects projects={projects} />
        <Services />
        <LanternOfLight content={lantern} />
        <Contact />
      </div>
      <Footer socialLinks={socialLinks} logoUrl={branding.logo_url} />
    </main>
  );
}
