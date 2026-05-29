"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

interface FeaturedProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    link: string;
    image_url: string | null;
    tech_stack: string[];
  };
  index: number;
  reversed?: boolean;
}

export default function FeaturedProjectCard({
  project,
  index,
  reversed = false,
}: FeaturedProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
        reversed ? "lg:[direction:rtl]" : ""
      }`}
    >
      <div
        className={`lg:col-span-7 ${reversed ? "lg:[direction:ltr]" : ""}`}
      >
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Tilt
            glareEnable
            glareMaxOpacity={0.14}
            glareColor="#c8ff4a"
            glarePosition="all"
            glareBorderRadius="20px"
            scale={1.03}
            transitionSpeed={450}
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            perspective={1200}
            className="transform-gpu"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card aspect-[16/10] lg:aspect-[16/11] group-hover:border-brand/30 transition-colors duration-500 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]">
              {project.image_url ? (
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted min-h-[280px]">
                  <span className="text-6xl font-heading font-semibold text-brand/20">
                    {project.title[0]}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand font-semibold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="w-8 h-px bg-brand/50" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/60">
                  Featured
                </span>
              </div>
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand text-[#0a0a0a] shadow-[0_0_30px_var(--brand-glow)]">
                  <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
                </span>
              </div>
            </div>
          </Tilt>
        </a>
      </div>

      <div
        className={`lg:col-span-5 flex flex-col justify-center ${
          reversed ? "lg:[direction:ltr]" : ""
        }`}
      >
        <p className="label-studio mb-6">Case study</p>
        <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-semibold text-foreground leading-[1.08] mb-5 group-hover:text-brand transition-colors duration-300">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.title}
          </a>
        </h3>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-lg">
          {project.description}
        </p>
        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground border border-white/10 rounded-full hover:border-brand/40 hover:text-brand transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand w-fit group/link"
        >
          View live project
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
    </motion.article>
  );
}
