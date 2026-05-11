"use client";

import { motion } from "framer-motion";
import { CreditCard, Code, Server, ShieldCheck, Headphones, Plus } from "lucide-react";

const policies = [
  {
    title: "50% Advance",
    description: "A 50% upfront payment is required to commence work and secure your project slot.",
    icon: <CreditCard className="w-6 h-6 text-primary" />,
  },
  {
    title: "50% On Completion",
    description: "The remaining 50% balance is due upon project completion, prior to final deployment.",
    icon: <Code className="w-6 h-6 text-primary" />,
  },
  {
    title: "Full Deployment Handover",
    description: "Complete deployment assistance. All credentials and source code are handed over to the client.",
    icon: <Server className="w-6 h-6 text-primary" />,
  },
  {
    title: "24-Hour Refund Policy",
    description: "Full refund guaranteed within 24 hours of the initial project agreement if you change your mind.",
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
  },
  {
    title: "1 Month Free Support",
    description: "Enjoy one month of complimentary technical support and bug fixes after the launch.",
    icon: <Headphones className="w-6 h-6 text-primary" />,
  },
  {
    title: "New Features & Add-ons",
    description: "Any new features requested after delivery will be billed as separate, additional charges.",
    icon: <Plus className="w-6 h-6 text-primary" />,
  },
];

export default function WorkPolicy() {
  return (
    <section id="policy" className="py-32 bg-secondary/20 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">Work & Privacy Policy</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent and professional guidelines ensuring a smooth, secure, and successful collaboration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {policies.map((policy, index) => (
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
                  {policy.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{policy.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{policy.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
