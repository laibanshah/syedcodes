"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { staggerContainer, staggerItem } from "@/lib/motion";

const pricingTiers = [
  {
    name: "Landing pages/ Portfolio",
    price: "Rs 5,999",
    currency: "IST",
    description: "Perfect for personal portfolios and single-page websites",
    features: [
      "Source code",
      "Free Domain (.netlify.app or .vercel.app)",
      "Free Hosting (on netlify or on vercel)",
      "Mobile Responsive Design",
      "Modern, glassmorphic, apple like, renaissance UI/UX",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Single page website",
      "Hard coded",
      "You can later upgrade hosting, storage, or domain anytime according to your needs. Custom domains from platforms like Namecheap or GoDaddy can also be connected.",
    ],
  },
  {
    name: "Blogging platform/business with backend",
    price: "Rs 11,999",
    currency: "IST",
    description: "Full-featured blogging platform with admin panel",
    features: [
      "Free Domain (.netlify.app or .vercel.app) + custom domain if you like",
      "Free Hosting (on netlify or on vercel)",
      "Free 5GB Cloud Storage (Supabase)",
      "Mobile Responsive Design",
      "Admin panel & Dashboard",
      "Authentication",
      "Basic cyber security",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Source code",
      "Multiple pages",
    ],
    featured: true,
  },
  {
    name: "E-Commerce website with stripe and all",
    price: "Rs 21,999",
    currency: "IST",
    description: "Complete e-commerce solution with payment integration",
    features: [
      "Stripe Connectivity",
      "Wishlist/ Add to cart",
      "User signup feature",
      "Free Domain (.netlify.app or .vercel.app) + custom domain if you like",
      "Free Hosting (on netlify or on vercel)",
      "Free 5GB Cloud Storage (Supabase)",
      "Mobile Responsive Design",
      "Admin panel & Dashboard",
      "Authentication",
      "Basic cyber security",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Source code",
      "Multiple pages",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1">
        <section className="section-padding relative border-t border-white/[0.06]">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 md:mb-24"
            >
              <p className="label-studio mb-4">Pricing</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-foreground mb-6">
                Choose Your Plan
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Transparent pricing for every project size. No hidden fees, no surprises.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  variants={staggerItem}
                  className={`relative ${
                    tier.featured
                      ? "lg:-mt-4 lg:mb-4"
                      : ""
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand text-[#0a0a0a] text-xs font-semibold uppercase tracking-wider rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div
                    className={`premium-card p-8 md:p-10 h-full ${
                      tier.featured
                        ? "border-brand/30 bg-card/50"
                        : ""
                    }`}
                  >
                    <div className="mb-8">
                      <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-3">
                        {tier.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        {tier.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-heading font-semibold text-foreground">
                          {tier.price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          ({tier.currency})
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-1">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={2} />
                          <span className="text-sm text-muted-foreground leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/#contact"
                      className={`inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl ${
                        tier.featured
                          ? "bg-brand text-[#0a0a0a] hover:bg-brand-dim hover:shadow-[0_0_40px_var(--brand-glow)]"
                          : "border border-white/15 text-foreground hover:border-brand/40 hover:text-brand"
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" strokeWidth={2} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding relative border-t border-white/[0.06]">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="label-studio mb-4">Policy</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-foreground mb-6">
                Work Policy
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Clear guidelines to ensure a smooth and successful collaboration
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              <motion.div variants={staggerItem} className="premium-card p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6">
                  Payment
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      50% Advance Before Starting The Project
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Remaining 50% Before Final Deployment
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Refund will be provided if the user cancels the project before pushing the source code but the initial 50% refund will only be provided if the user cancels the project within 12 hours of the payment
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      After full payment, the website will be fully deployed and handed over successfully
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      The client should create a new email address and grant temporary access to me in that email i will host the website and provide source code
                    </span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={staggerItem} className="premium-card p-8 md:p-10">
                <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6">
                  Revisions & Support
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      You will get revisions and iterations during development but for adding additional features you will need to pay extra
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      If any issue or accidental error happens within 1 month, we will provide free support
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      After that we charge 1000 (IST) per month for support, but we will provide you website in such a way that you wont be needing that
                    </span>
                  </li>
                </ul>

                <div className="mt-8 pt-8 border-t border-white/[0.06]">
                  <h4 className="text-lg font-heading font-semibold text-foreground mb-4">
                    To Start The Project, We Only Need
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        50% Advance Payment
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2" />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        An Email ID for project setup and management (For Tier 2 & 3 websites only)
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
