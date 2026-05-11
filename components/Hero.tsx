"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-brand-blue-light/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-primary text-sm tracking-widest uppercase mb-4 font-bold flex items-center gap-2">
              <span className="w-10 h-[2px] bg-primary block"></span>
              Premium Web Development
            </h2>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 tracking-tight"
          >
            Welcome to <br />
            <span className="text-primary">
              SyedCodes.UI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          >
            Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold transition-all hover:bg-brand-blue-dark hover:scale-105 shadow-lg shadow-primary/20"
            >
              View My Work
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-foreground border border-border hover:bg-secondary transition-all"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:ml-auto"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full p-2 border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-background relative">
              <Image
                src="/assets/myimage.jpg"
                alt="SyedCodes.UI Profile"
                fill
                className="object-cover object-center transition-all duration-700"
                priority
              />
            </div>
            {/* Decorative orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute -top-4 -right-4 bg-card border border-border px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
              <p className="text-sm text-primary font-bold">Available for Work</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
