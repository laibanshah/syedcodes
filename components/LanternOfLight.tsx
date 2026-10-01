"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "@/lib/motion";

interface LanternContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface LanternOfLightProps {
  content?: LanternContent;
}

export default function LanternOfLight({ content }: LanternOfLightProps = {}) {
  const data = content || {
    title: "Lantern of Light",
    subtitle: "Spiritual & Islamic Community",
    description:
      "A spiritual and Islamic community presentation focused on guiding hearts, sharing wisdom, and fostering a supportive environment built on faith and unity.",
    image: "/assets/lol.png",
  };

  return (
    <section className="section-padding relative border-t border-white/[0.06] overflow-hidden">
      <div className="container-premium">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="flex justify-center md:justify-start"
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 border border-white/[0.08] bg-card p-8">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-contain p-6"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.15}
            className="text-center md:text-left"
          >
            <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground mb-5">
              {data.subtitle}
            </p>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground mb-6 leading-tight">
              {data.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-10 leading-relaxed max-w-lg">
              {data.description}
            </p>
            <a
              href="https://whatsapp.com/channel/0029VaeYmbP5PO0zmfC6Yl2J"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline rounded-none inline-flex"
            >
              Join WhatsApp community
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
