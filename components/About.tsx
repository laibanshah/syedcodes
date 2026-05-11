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

export default function About() {
  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">The Architect Behind the Code</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites. My client-focused approach ensures every pixel is perfect and every interaction feels professional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 mt-20">
            {/* Philosophy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-card border border-border p-8 rounded-3xl"
            >
              <h3 className="text-2xl font-heading text-foreground mb-6">My Approach</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Development isn't just about writing code; it's about crafting an experience. I build web applications with a focus on aesthetics, performance, and scalability.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Layout size={18} /></div>
                  UI/UX Focused
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Code2 size={18} /></div>
                  Clean Code
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Database size={18} /></div>
                  Data-Driven
                </div>
                <div className="flex items-center gap-3 text-sm text-foreground font-medium">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Smartphone size={18} /></div>
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
            >
              <h3 className="text-2xl font-heading text-foreground mb-8">Technical Arsenal</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground font-medium">{skill.name}</span>
                      <span className="text-primary font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border/50">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                        className="h-full bg-primary rounded-full"
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
