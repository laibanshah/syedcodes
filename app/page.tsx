import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import LanternOfLight from "@/components/LanternOfLight";
import WorkPolicy from "@/components/WorkPolicy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getCollectionItems, getFileContent } from "@/lib/cms";

export default function Home() {
  const projects = getCollectionItems("projects");
  const generalSettings = getFileContent("settings/general.json");
  const policyContent = getFileContent("pages/policy.json");
  const lanternContent = getFileContent("pages/lantern.json");

  return (
    <main className="flex flex-col min-h-screen">
      <Navbar socialLinks={generalSettings?.social_links} />
      <div className="flex-1">
        <Hero 
          title={generalSettings?.hero_title} 
          subtitle={generalSettings?.hero_subtitle} 
          video={generalSettings?.hero_video} 
        />
        <About 
          title={generalSettings?.about_title} 
          content={generalSettings?.about_content} 
        />
        <Services />
        <Projects projects={projects} />
        <LanternOfLight content={lanternContent} />
        <WorkPolicy content={policyContent} />
        <Contact />
      </div>
      <Footer socialLinks={generalSettings?.social_links} />
    </main>
  );
}
