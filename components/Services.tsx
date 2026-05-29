"use client";

import { motion } from "framer-motion";
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
import { staggerContainer, staggerItem } from "@/lib/motion";

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

  useEffect(() => {
    loadServices();
  }, []);

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

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="premium-card p-8 md:p-10 group"
            >
              <div className="w-12 h-12 flex items-center justify-center border border-white/10 rounded-lg mb-8 text-brand group-hover:border-brand/40 transition-colors">
                {iconMap[service.icon_name] || (
                  <Globe className="w-5 h-5" strokeWidth={1.5} />
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
