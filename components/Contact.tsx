"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import {
  FaWhatsapp,
  FaYoutube,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { ContactLink } from "@/lib/types";
import { getContactLinks } from "@/lib/db";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { MessageSquare } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FaLinkedin: <FaLinkedin className="w-5 h-5" />,
  FaGithub: <FaGithub className="w-5 h-5" />,
  FaInstagram: <FaInstagram className="w-5 h-5" />,
  FaYoutube: <FaYoutube className="w-5 h-5" />,
  FaWhatsapp: <FaWhatsapp className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" strokeWidth={1.5} />,
  Twitter: <FaTwitter className="w-5 h-5" />,
  FaFacebook: <FaFacebook className="w-5 h-5" />,
};

export default function Contact() {
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", issue: "" });

  useEffect(() => {
    loadContactLinks();
  }, []);

  const loadContactLinks = async () => {
    try {
      const data = await getContactLinks();
      setContactLinks(data);
    } catch (error) {
      console.error("Failed to load contact links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Name: ${formData.name}\n\nIssue: ${formData.issue}`;
    const whatsappNumber = "919927533150";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return null;
  }

  return (
    <section id="contact" className="section-padding relative border-t border-black/[0.06]">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            label="Contact"
            title="Let's build something extraordinary"
            description="Whether you need a dynamic web app, a refined portfolio, or a high-end corporate presence — I'm ready to bring your vision to life."
            align="center"
            className="font-heading"
          />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="premium-card p-10 md:p-14 max-w-2xl mx-auto mt-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium text-foreground tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-4 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="issue" className="text-sm font-medium text-foreground tracking-wide">
                  Your Issue / Message
                </label>
                <textarea
                  id="issue"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-5 py-4 bg-background border border-white/10 rounded-xl focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                  placeholder="Describe your issue or message"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary rounded-none py-4 flex items-center justify-center gap-3 font-medium tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <MessageSquare className="w-5 h-5" />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>

          {contactLinks.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 mt-12"
            >
              {contactLinks.map((link) => (
                <motion.a
                  key={link.id}
                  variants={staggerItem}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 border border-black/10 hover:border-brand/40 transition-colors group"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {iconMap[link.icon_name] || <Mail className="w-5 h-5" />}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
