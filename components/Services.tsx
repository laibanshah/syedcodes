"use client";

import { motion } from "framer-motion";
import { Monitor, Globe, Server, Lock, PenTool, Briefcase, Code, Database, Smartphone, Layout } from "lucide-react";
import { Service } from "@/lib/supabase";
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
    <section id="services" className="py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">Expertise & Services</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Delivering high-end digital solutions tailored to elevate your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card border border-border p-8 rounded-3xl hover:border-primary/30 transition-all duration-300 group shadow-lg"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {iconMap[service.icon_name] || <Globe className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="text-xl font-heading text-foreground mb-4">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
