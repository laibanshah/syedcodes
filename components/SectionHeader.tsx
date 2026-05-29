"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-16 md:mb-24 lg:mb-28 ${isCenter ? "text-center mx-auto max-w-3xl" : "max-w-4xl"} ${className}`}
    >
      {label && (
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className={`label-studio mb-5 md:mb-6 ${isCenter ? "justify-center" : ""}`}
        >
          {label}
        </motion.p>
      )}
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        custom={0.1}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold text-foreground leading-[1.05] tracking-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0.2}
          className={`mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-normal ${isCenter ? "mx-auto" : "max-w-2xl"}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
