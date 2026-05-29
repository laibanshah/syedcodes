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

  if (loading) {
    return null;
  }

  return (
    <section id="contact" className="section-padding relative border-t border-white/[0.06]">
      <div className="container-premium">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            label="Contact"
            title="Let's build something extraordinary"
            description="Whether you need a dynamic web app, a refined portfolio, or a high-end corporate presence — I'm ready to bring your vision to life."
            align="center"
          />

          {contactLinks.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 md:mb-20"
            >
              {contactLinks.map((link) => (
                <motion.a
                  key={link.id}
                  variants={staggerItem}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-card inline-flex items-center gap-3 px-6 py-4 hover:border-white/20 transition-colors group"
                >
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {iconMap[link.icon_name] || <Mail className="w-5 h-5" />}
                  </span>
                  <span className="text-sm font-medium tracking-wide">{link.platform}</span>
                </motion.a>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="premium-card p-10 md:p-14 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
              Ready to start?
            </h3>
            <p className="text-muted-foreground mb-8 text-base md:text-lg leading-relaxed">
              Reach out directly via email or WhatsApp for a consultation.
            </p>
            <a
              href="mailto:lanternoflight11@gmail.com"
              className="btn-primary rounded-full"
            >
              lanternoflight11@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
