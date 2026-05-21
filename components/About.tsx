"use client";

import { motion } from "framer-motion";
import { Code2, Layout, Database, Smartphone } from "lucide-react";

const skills = [
  { name: "React", level: 95 },
  { name: "Next.js", level: 90 },
  { name: "JavaScript", level: 92 },
  { name: "Python", level: 85 },
  { name: "HTML/CSS", level: 98 },
  { name: "Tailwind CSS", level: 95 },
];

interface AboutProps {
  title?: string;
  content?: string;
}

export default function About({ title, content }: AboutProps) {
  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 md:mb-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Me</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {content || "I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites. My client-focused approach ensures every pixel is perfect and every interaction feels professional."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 p-8 md:p-10 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">My Approach</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-base md:text-lg">
                Development isn't just about writing code; it's about crafting an experience. I build web applications with a focus on aesthetics, performance, and scalability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm md:text-base text-foreground font-medium p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl">
                  <div className="p-2 bg-white/80 dark:bg-card/80 rounded-lg text-primary"><Layout size={18} /></div>
                  UI/UX Focused
                </div>
                <div className="flex items-center gap-3 text-sm md:text-base text-foreground font-medium p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl">
                  <div className="p-2 bg-white/80 dark:bg-card/80 rounded-lg text-primary"><Code2 size={18} /></div>
                  Clean Code
                </div>
                <div className="flex items-center gap-3 text-sm md:text-base text-foreground font-medium p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl">
                  <div className="p-2 bg-white/80 dark:bg-card/80 rounded-lg text-primary"><Database size={18} /></div>
                  Data-Driven
                </div>
                <div className="flex items-center gap-3 text-sm md:text-base text-foreground font-medium p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl">
                  <div className="p-2 bg-white/80 dark:bg-card/80 rounded-lg text-primary"><Smartphone size={18} /></div>
                  Responsive
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 p-8 md:p-10 rounded-3xl shadow-xl"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Technical Arsenal</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm md:text-base mb-2">
                      <span className="text-foreground font-semibold">{skill.name}</span>
                      <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-3 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/30">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
