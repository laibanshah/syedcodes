"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const projects = [
  {
    title: "The RAW SOCIETY",
    description: "Raw Society is a global discussion community that brings together people from all walks of life to share their ideas, experiences, and perspectives in a supportive and inclusive environment. Every Sunday, we gather on Google Meet for our weekly sessions where participants get the opportunity to speak for approximately 5 minutes in their preferred language.",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    link: "https://rawsociety.netlify.app/",
    video: "/assets/raw society.mp4"
  },
  {
    title: "SOUL METAPOETRY",
    description: "Soulful Meta Poetry is a warm archive of quiet intensity — a place where tenderness is treated as craft, and where the unsaid is given a refined page to live on.",
    tech: ["React", "GSAP", "Tailwind CSS", "Vite"],
    link: "https://soulmp.netlify.app/about",
    video: "/assets/soulful.mp4"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">Featured Masterpieces</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A curated selection of digital experiences crafted with precision and care.
          </p>
        </div>

        <div className="space-y-32">
          {projects.map((project, index) => (
            <div key={project.title} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Cinematic Laptop Mockup */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-full lg:w-3/5 relative perspective-1000"
              >
                <div className="relative w-full max-w-[800px] mx-auto group">
                  <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full mix-blend-screen transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
                  
                  {/* Laptop Frame */}
                  <div className="relative z-10 drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700">
                    <Image
                      src="/assets/mockup_laptop.png"
                      alt="MacBook Mockup"
                      width={1200}
                      height={800}
                      className="w-full h-auto relative z-20 pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    />
                    
                    {/* Screen Video Container - precise positioning based on standard MacBook mockup */}
                    <div className="absolute top-[8%] left-[12%] right-[12%] bottom-[14%] overflow-hidden bg-black rounded-t-sm z-10"
                         style={{ 
                           clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' 
                         }}>
                      <video
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover object-top transition-opacity duration-500 group-hover:opacity-100 scale-[1.01]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-2/5 flex flex-col justify-center"
              >
                <h3 className="text-3xl md:text-4xl font-heading text-foreground mb-6">{project.title}</h3>
                <div className="bg-card border border-border p-6 rounded-2xl mb-8 shadow-xl">
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-10">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-4 py-2 bg-secondary border border-border rounded-full text-xs text-primary font-bold">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/20"
                  >
                    View Live <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
