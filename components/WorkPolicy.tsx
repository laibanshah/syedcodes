"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Code,
  Server,
  ShieldCheck,
  Headphones,
  Plus,
  LucideIcon,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { staggerContainer, staggerItem } from "@/lib/motion";

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

export default function WorkPolicy({ content }: WorkPolicyProps = {}) {
  const data = content || {
    title: "Work & Privacy Policy",
    subtitle:
      "Transparent and professional guidelines ensuring a smooth, secure, and successful collaboration.",
    policies: [],
  };

  return (
    <section id="process" className="section-padding relative border-t border-white/[0.06]">
      <div className="container-premium">
        <SectionHeader
          label="Process"
          title={data.title}
          description={data.subtitle}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {data.policies.map((policy, index) => {
            const IconComponent = iconMap[policy.icon] || Plus;
            return (
              <motion.div
                key={policy.title}
                variants={staggerItem}
                className="premium-card p-8 md:p-10 group"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-3 border border-white/10 rounded-lg shrink-0 group-hover:border-brand/40 transition-colors">
                    <IconComponent className="w-5 h-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <span className="text-sm font-heading font-semibold text-brand tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                    <span className="text-muted-foreground/50 font-normal">
                      /{String(data.policies.length).padStart(2, "0")}
                    </span>
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-3">
                  {policy.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {policy.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
