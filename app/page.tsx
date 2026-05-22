import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import LanternOfLight from "@/components/LanternOfLight";
import WorkPolicy from "@/components/WorkPolicy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getFeaturedProjects, getAboutSection, getSetting } from "@/lib/db";

export default async function Home() {
  const projects = await getFeaturedProjects();
  const about = await getAboutSection();
  const heroSettings = await getSetting("hero");
  const socialSettings = await getSetting("social_links");

  // Transform social settings to the format expected by components
  const socialLinks = socialSettings?.value 
    ? Object.entries(socialSettings.value).map(([platform, url]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        url: url as string,
      }))
    : undefined;

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar socialLinks={socialLinks} />
      <div className="flex-1">
        <Hero 
          title={heroSettings?.value?.title} 
          subtitle={heroSettings?.value?.subtitle} 
        />
        <About 
          title={about?.title || undefined} 
          content={about?.content || undefined} 
        />
        <Services />
        <Projects projects={projects} />
        <LanternOfLight />
        <WorkPolicy />
        <Contact />
      </div>
      <Footer socialLinks={socialLinks} />
    </main>
  );
}
