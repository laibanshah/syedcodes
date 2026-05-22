"use client";

import { motion } from "framer-motion";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image_url: string | null;
  tech_stack: string[];
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const currentProject = projects[currentIndex];

  return (
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/30 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            Featured <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Projects</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-6 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
          >
            A curated selection of digital experiences crafted with precision and care.
          </motion.p>
        </div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12 md:mb-16"
        >
          <Link
            href="/projects"
            className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary"
          >
            All Projects
          </Link>
          {["Web", "Mobile", "Design"].map((filter) => (
            <button
              key={filter}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-border/50 bg-white/50 dark:bg-card/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* 3D Flashcard Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {currentProject && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              {/* 3D Flashcard Image */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <Tilt
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  glareColor="#ffffff"
                  glarePosition="all"
                  glareBorderRadius="24px"
                  scale={1.02}
                  transitionSpeed={500}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  className="relative"
                >
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-border/30">
                    {/* Layered depth effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
                    
                    {currentProject.image_url ? (
                      <Image
                        src={currentProject.image_url}
                        alt={currentProject.title}
                        width={800}
                        height={600}
                        className="w-full h-auto object-cover rounded-3xl"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-primary/30">{currentProject.title[0]}</span>
                      </div>
                    )}
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-card/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-primary">Featured</span>
                    </div>
                  </div>
                </Tilt>

                {/* Navigation arrows */}
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevProject}
                    className="p-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
                    aria-label="Previous project"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextProject}
                    className="p-3 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm border border-border/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg"
                    aria-label="Next project"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Project Details */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col justify-center"
              >
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  {currentProject.title}
                </h3>
                
                <div className="bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 p-6 md:p-8 rounded-3xl mb-8 shadow-xl">
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {currentProject.description}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {currentProject.tech_stack.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-border/50 rounded-full text-xs md:text-sm font-semibold text-foreground hover:border-primary/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={currentProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 w-full md:w-auto"
                >
                  View Live Project <ExternalLink size={18} />
                </a>
              </motion.div>
            </motion.div>
          )}

          {/* Project indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "bg-border/50 hover:bg-border"
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
