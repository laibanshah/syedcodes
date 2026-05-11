"use client";

import { motion } from "framer-motion";
import { CreditCard, Code, Server, ShieldCheck, Headphones, Plus, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Code,
  Server,
  ShieldCheck,
  Headphones,
  Plus,
};

interface PolicyItem {
  title: string;
  description: string;
  icon: string;
}

interface PolicyContent {
  title: string;
  subtitle: string;
  policies: PolicyItem[];
}

interface WorkPolicyProps {
  content?: PolicyContent;
}

export default function WorkPolicy({ content }: WorkPolicyProps) {
  const data = content || {
    title: "Work & Privacy Policy",
    subtitle: "Transparent and professional guidelines ensuring a smooth, secure, and successful collaboration.",
    policies: []
  };

  return (
    <section id="policy" className="py-32 bg-secondary/20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">{data.title}</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {data.policies.map((policy, index) => {
            const IconComponent = iconMap[policy.icon] || Plus;
            return (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border p-8 rounded-3xl hover:border-primary/20 transition-colors group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{policy.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{policy.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
