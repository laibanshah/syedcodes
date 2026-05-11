import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import LanternOfLight from "@/components/LanternOfLight";
import WorkPolicy from "@/components/WorkPolicy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Hero />
        <About />
        <Services />
        <Projects />
        <LanternOfLight />
        <WorkPolicy />
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
