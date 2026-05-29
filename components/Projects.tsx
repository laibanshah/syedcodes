"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";

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
  if (!projects.length) return null;

  return (
    <section id="projects" className="section-padding relative border-t border-white/[0.06]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(100%,800px)] h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent pointer-events-none" />

      <div className="container-premium">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-20 md:mb-28">
          <SectionHeader
            label="Selected work"
            title="Featured projects"
            description="Digital products built with studio-level craft — performance, clarity, and conversion in every pixel."
            className="mb-0"
          />
          <Link
            href="/projects"
            className="btn-outline rounded-full shrink-0 self-start lg:self-auto border-brand/20 hover:bg-brand/5"
          >
            All projects
          </Link>
        </div>

        <div className="flex flex-col gap-20 md:gap-28 lg:gap-32">
          {projects.map((project, index) => (
            <FeaturedProjectCard
              key={project.id}
              project={project}
              index={index}
              reversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
