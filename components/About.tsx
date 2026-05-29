"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Database, Smartphone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { staggerContainer, staggerItem } from "@/lib/motion";

const skills = [
  { name: "React", level: 95 },
  { name: "Next.js", level: 90 },
  { name: "JavaScript", level: 92 },
  { name: "Python", level: 85 },
  { name: "HTML/CSS", level: 98 },
  { name: "Tailwind CSS", level: 95 },
];

const pillars = [
  { icon: Layout, label: "UI/UX Focused" },
  { icon: Code2, label: "Clean Code" },
  { icon: Database, label: "Data-Driven" },
  { icon: Smartphone, label: "Responsive" },
];

interface AboutProps {
  title?: string;
  content?: string;
}

export default function About({ title, content }: AboutProps) {
  return (
    <section id="about" className="section-padding relative border-t border-white/[0.06]">
      <div className="container-premium">
        <SectionHeader
          label="About"
          title={title || "Building with purpose and precision"}
          description={
            content ||
            "I craft premium, cinematic, and responsive experiences where every detail serves the story — performance, accessibility, and design discipline included."
          }
        />

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-5 flex flex-col gap-4"
          >
            {pillars.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="premium-card flex items-center gap-4 p-5 md:p-6 group"
              >
                <div className="flex items-center justify-center w-11 h-11 border border-white/10 rounded-lg shrink-0 group-hover:border-brand/40 transition-colors">
                  <Icon className="w-5 h-5 text-brand" strokeWidth={1.5} />
                </div>
                <span className="text-sm md:text-base font-medium text-foreground tracking-wide">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 premium-card p-8 md:p-10 lg:p-12"
          >
            <h3 className="text-xl md:text-2xl font-heading font-semibold mb-8">
              Technical focus
            </h3>
            <div className="space-y-7">
              {skills.map((skill, index) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-foreground font-medium">{skill.name}</span>
                    <span className="text-muted-foreground tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="h-px w-full bg-white/[0.08] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full bg-brand"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
