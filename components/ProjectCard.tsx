"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Tilt
          glareEnable
          glareMaxOpacity={0.12}
          glareColor="#c8ff4a"
          glarePosition="all"
          glareBorderRadius="16px"
          scale={1.02}
          transitionSpeed={400}
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          className="transform-gpu"
        >
          <div className="premium-card overflow-hidden">
            <div className="relative h-56 md:h-64 overflow-hidden bg-muted">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-heading font-semibold text-brand/20">
                    {project.title[0]}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-brand text-[#0a0a0a]">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-3 group-hover:text-brand transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-5 line-clamp-3 leading-relaxed">
                {project.description}
              </p>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground border border-white/10 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="px-3 py-1 text-[10px] uppercase tracking-wider text-brand">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Tilt>
      </a>
    </motion.article>
  );
}
