"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial grid and name (lasts 2 seconds)
    const t1 = setTimeout(() => setStage(1), 2000);
    // Stage 1: Cinematic closing (lasts 1 second)
    const t2 = setTimeout(() => setStage(2), 3000);
    // Stage 2: Roll back to reveal (lasts 1 second)
    const t3 = setTimeout(() => {
      setStage(3);
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === 3) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black text-white"
      initial={{ opacity: 1 }}
      animate={
        stage === 2
          ? { y: "-100%", opacity: 0 } // Roll back / lift up reveal
          : { opacity: 1 }
      }
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Cinematic Bars closing */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-black z-10"
        initial={{ height: 0 }}
        animate={stage >= 1 ? { height: "50vh" } : { height: 0 }}
        transition={{ duration: 0.8, ease: "circIn" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black z-10"
        initial={{ height: 0 }}
        animate={stage >= 1 ? { height: "50vh" } : { height: 0 }}
        transition={{ duration: 0.8, ease: "circIn" }}
      />

      {/* Main Text */}
      <motion.h1
        className="relative z-20 text-6xl md:text-8xl font-bold tracking-tighter uppercase"
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={
          stage === 0
            ? { scale: 1, opacity: 1, filter: "blur(0px)" }
            : { scale: 1.1, opacity: 0, filter: "blur(10px)" }
        }
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        Syed Laiban
      </motion.h1>
    </motion.div>
  );
}
