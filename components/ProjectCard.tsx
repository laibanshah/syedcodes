"use client";

import { motion } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Project } from "@/lib/supabase";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-secondary">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl font-bold text-primary/30">{project.title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-secondary border border-border rounded-full text-xs text-primary font-medium"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="px-3 py-1 bg-secondary border border-border rounded-full text-xs text-muted-foreground">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action Button */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          Visit Site
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Hover Overlay Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-primary/5 pointer-events-none"
      />
    </motion.div>
  );
}
