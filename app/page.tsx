import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import LanternOfLight from "@/components/LanternOfLight";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedProjects, getSetting } from "@/lib/db";
import CinematicIntroClientWrapper from "@/components/CinematicIntroClientWrapper";

export default async function Home() {
  const projects = await getFeaturedProjects();
  const heroSettings = await getSetting("hero");
  const socialSettings = await getSetting("social_links");

  const socialLinks = socialSettings?.value
    ? Object.entries(socialSettings.value).map(([platform, url]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        url: url as string,
      }))
    : undefined;

  return (
    <main className="flex flex-col min-h-screen bg-transparent relative">
      <CinematicIntroClientWrapper />
      <Navbar socialLinks={socialLinks} />
      <div className="flex-1 relative z-10">
        <Hero
          title={heroSettings?.value?.title}
          subtitle={heroSettings?.value?.subtitle}
        />
        <Projects projects={projects} />
        <LanternOfLight />
        <Contact />
      </div>
      <Footer socialLinks={socialLinks} />
    </main>
  );
}
