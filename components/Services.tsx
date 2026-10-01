"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import {
  Monitor,
  Globe,
  Server,
  Lock,
  PenTool,
  Briefcase,
  Code,
  Database,
  Smartphone,
  Layout,
} from "lucide-react";
import { Service } from "@/lib/types";
import { getServices } from "@/lib/db";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-5 h-5" strokeWidth={1.5} />,
  Monitor: <Monitor className="w-5 h-5" strokeWidth={1.5} />,
  Server: <Server className="w-5 h-5" strokeWidth={1.5} />,
  Lock: <Lock className="w-5 h-5" strokeWidth={1.5} />,
  PenTool: <PenTool className="w-5 h-5" strokeWidth={1.5} />,
  Briefcase: <Briefcase className="w-5 h-5" strokeWidth={1.5} />,
  Code: <Code className="w-5 h-5" strokeWidth={1.5} />,
  Database: <Database className="w-5 h-5" strokeWidth={1.5} />,
  Smartphone: <Smartphone className="w-5 h-5" strokeWidth={1.5} />,
  Layout: <Layout className="w-5 h-5" strokeWidth={1.5} />,
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [services.length]);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !services.length) {
    return null;
  }

  return (
    <section id="services" className="section-padding relative border-t border-white/[0.06]">
      <div className="container-premium">
        <SectionHeader
          label="Services"
          title="Expertise tailored to elevate your brand"
          description="High-end digital solutions — from concept to production — delivered with clarity and craft."
          align="center"
        />

        <div className="relative overflow-hidden py-12">
          <motion.div
            className="flex justify-center"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: `${services.length * 100}%` }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="flex-shrink-0 px-4"
                style={{ width: `${100 / services.length}%` }}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="p-8 md:p-10 group h-full flex flex-col items-center text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="w-16 h-16 flex items-center justify-center rounded-full mb-8 text-brand"
                  >
                    {iconMap[service.icon_name] || (
                      <Globe className="w-8 h-8" strokeWidth={1.5} />
                    )}
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                    {service.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Carousel indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {services.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-brand w-6" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
