"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { fadeUp } from "@/lib/motion";
import HeroAccentWord from "@/components/HeroAccentWord";
import BeamButton from "@/components/BeamButton";

interface HeroProps {
  title?: string;
  subtitle?: string;
  video?: string;
}

function DefaultHeroHeadline() {
  return (
    <h1 className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5rem] font-heading font-semibold text-foreground leading-[1.02] tracking-[-0.02em]">
      <span className="block">We build</span>
      <span className="block mt-1 md:mt-2">
        <HeroAccentWord variant="default">digital</HeroAccentWord>{" "}
        <HeroAccentWord variant="long">experiences</HeroAccentWord>
      </span>
      <span className="block mt-1 md:mt-2">
        for <HeroAccentWord variant="wave">ambitious</HeroAccentWord> brands.
      </span>
    </h1>
  );
}

export default function Hero({ title, subtitle, video }: HeroProps) {
  const displaySubtitle = subtitle || title;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-end md:items-center pt-28 pb-20 md:pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.07]"
          />
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[55%] h-[70%] glow-brand opacity-50" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,204,122,0.05),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
              }}
            />
          </>
        )}
        <div className="absolute inset-0 grain-overlay" />
      </div>

      <div className="container-premium relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-end lg:items-center">
          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <DefaultHeroHeadline />
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
              className="mt-8 md:mt-10 text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed"
            >
              {displaySubtitle ||
                "Websites, branding, software and mobile apps — digital products for brands with ambition."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end perspective-1000"
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <motion.div
                className="absolute -inset-6 glow-brand rounded-full blur-2xl opacity-70"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="relative w-full h-full overflow-hidden border border-black/[0.12] bg-card shadow-2xl"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{
                  boxShadow: "0 25px 50px -12px rgba(0, 204, 122, 0.25)",
                }}
              >
                <Image
                  src="/assets/owner.jpg"
                  alt="SyedCodes.UI"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
