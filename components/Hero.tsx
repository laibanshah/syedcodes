"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Code2 } from "lucide-react";
import Image from "next/image";

interface HeroProps {
  title?: string;
  subtitle?: string;
  video?: string;
}

export default function Hero({ title, subtitle, video }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-r from-purple-500/10 to-primary/10 rounded-full blur-[180px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-full blur-[200px]" />
          </>
        )}
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-[2px] bg-gradient-to-r from-primary to-purple-600" />
            <h2 className="text-primary text-sm tracking-widest uppercase font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Premium Web Development
            </h2>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 tracking-tight"
          >
            {title || (
              <>
                Welcome to <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  SyedCodes.UI
                </span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          >
            {subtitle || "Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-foreground border border-border bg-white/50 dark:bg-card/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-card/80 transition-all"
            >
              Contact Me
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="flex gap-8 mt-12"
          >
            <div>
              <p className="text-3xl font-bold text-foreground">50+</p>
              <p className="text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="w-px bg-border/50" />
            <div>
              <p className="text-3xl font-bold text-foreground">5+</p>
              <p className="text-sm text-muted-foreground">Years Exp</p>
            </div>
            <div className="w-px bg-border/50" />
            <div>
              <p className="text-3xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:ml-auto flex justify-center"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full p-1 bg-gradient-to-br from-primary/30 via-purple-500/30 to-primary/30 backdrop-blur-sm shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background relative bg-white/50 dark:bg-card/50 backdrop-blur-xl">
              <Image
                src="/assets/myimage.jpg"
                alt="SyedCodes.UI Profile"
                fill
                className="object-cover object-center transition-all duration-700"
                priority
              />
            </div>
            
            {/* Decorative orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-dotted border-purple-500/30 animate-[spin_25s_linear_infinite_reverse]" />
            
            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-white/90 dark:bg-card/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-2xl shadow-xl border border-border/30"
            >
              <p className="text-xs md:text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Available for Work</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 bg-white/90 dark:bg-card/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-border/30"
            >
              <Code2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
