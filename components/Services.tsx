"use client";

import { motion } from "framer-motion";
import { Monitor, Globe, Server, Lock, PenTool, Briefcase, Code, Database, Smartphone, Layout } from "lucide-react";
import { Service } from "@/lib/types";
import { getServices } from "@/lib/db";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  Globe: <Globe className="w-8 h-8 text-primary" />,
  Monitor: <Monitor className="w-8 h-8 text-primary" />,
  Server: <Server className="w-8 h-8 text-primary" />,
  Lock: <Lock className="w-8 h-8 text-primary" />,
  PenTool: <PenTool className="w-8 h-8 text-primary" />,
  Briefcase: <Briefcase className="w-8 h-8 text-primary" />,
  Code: <Code className="w-8 h-8 text-primary" />,
  Database: <Database className="w-8 h-8 text-primary" />,
  Smartphone: <Smartphone className="w-8 h-8 text-primary" />,
  Layout: <Layout className="w-8 h-8 text-primary" />,
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

  if (loading) {
    return null;
  }

  return (
    <section id="services" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            Expertise & <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Services</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "80px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-8 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg"
          >
            Delivering high-end digital solutions tailored to elevate your brand.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 p-8 rounded-3xl hover:border-primary/50 transition-all duration-300 group shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-all duration-300">
                {iconMap[service.icon_name] || <Globe className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
