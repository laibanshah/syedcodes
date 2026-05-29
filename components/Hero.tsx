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
            <div className="absolute top-0 right-0 w-[55%] h-[70%] glow-brand opacity-70" />
            <div className="absolute bottom-0 left-0 w-[40%] h-[50%] bg-[radial-gradient(ellipse_at_bottom_left,rgba(212,255,74,0.07),transparent_60%)]" />
            <div
              className="absolute inset-0 opacity-[0.22]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
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
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="font-mono text-[11px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8 md:mb-10"
            >
              <span className="text-brand">[01]</span>{" "}
              <span className="text-muted-foreground/80">Digital Design Studio</span>
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.1}
            >
              <DefaultHeroHeadline />
            </motion.div>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.2}
              className="mt-8 md:mt-10 text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed"
            >
              {displaySubtitle ||
                "Websites, branding, software and mobile apps — digital products for brands with ambition."}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.3}
              className="flex flex-wrap items-center gap-4 mt-10 md:mt-12"
            >
              <BeamButton href="#contact" variant="primary">
                Start a project
              </BeamButton>
              <BeamButton
                href="#projects"
                variant="secondary"
                icon={
                  <span className="w-2.5 h-2.5 bg-brand shadow-[0_0_12px_var(--brand-glow)]" />
                }
              >
                Selected work
              </BeamButton>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0.4}
              className="hidden md:flex gap-12 lg:gap-16 mt-16 lg:mt-20 pt-10 border-t border-white/[0.08]"
            >
              {[
                { value: "50+", label: "Projects" },
                { value: "5+", label: "Years" },
                { value: "100%", label: "Commitment" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl lg:text-3xl font-heading font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 md:w-80 md:h-[28rem] lg:w-[22rem] lg:h-[30rem]">
              <div className="absolute -inset-6 glow-brand rounded-full blur-2xl opacity-90" />
              <div className="absolute inset-0 border border-brand/25 rounded-2xl translate-x-3 translate-y-3" />
              <div className="relative w-full h-full overflow-hidden rounded-2xl border border-white/[0.12] bg-card ring-1 ring-brand/10">
                <Image
                  src="/assets/myimage.jpg"
                  alt="SyedCodes.UI"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 premium-card px-5 py-3 border-brand/20">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand font-semibold">
                  Status
                </p>
                <p className="text-sm font-medium text-foreground mt-0.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  Available for work
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
