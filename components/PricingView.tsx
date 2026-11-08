"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { PricingTier, PolicySection, PricingPageContent } from "@/lib/types";

interface PricingViewProps {
  tiers: PricingTier[];
  policies: PolicySection[];
  page: PricingPageContent;
  logoUrl?: string;
}

export default function PricingView({ tiers, policies, page, logoUrl }: PricingViewProps) {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar logoUrl={logoUrl} />
      <div className="flex-1">
        <section className="section-padding relative border-t border-black/[0.06]">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 md:mb-24"
            >
              <p className="label-studio mb-4">{page.label}</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground mb-6">
                {page.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {page.description}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {tiers.map((tier) => (
                <motion.div key={tier.id} variants={staggerItem}>
                  <PricingCard tier={tier} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding relative border-t border-black/[0.06]">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="label-studio mb-4">{page.policy_label}</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
                {page.policy_title}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {page.policy_description}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {policies.map((section) => (
                <motion.div key={section.id} variants={staggerItem} className="premium-card p-8 md:p-10">
                  <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-4">
                    {section.items.map((item, k) => (
                      <li key={`${k}-${item}`} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {section.sub_title && (
                    <div className="mt-8 pt-8 border-t border-black/[0.06]">
                      <h4 className="text-lg font-heading font-semibold text-foreground mb-4">
                        {section.sub_title}
                      </h4>
                      <ul className="space-y-3">
                        {section.sub_items.map((item, k) => (
                          <li key={`${k}-${item}`} className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                            <span className="text-sm text-muted-foreground leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
      <Footer logoUrl={logoUrl} />
    </main>
  );
}
