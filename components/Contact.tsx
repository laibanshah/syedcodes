"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaYoutube, FaGithub, FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { ContactLink } from "@/lib/types";
import { getContactLinks } from "@/lib/db";
import { useEffect, useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  FaLinkedin: <FaLinkedin className="w-6 h-6" />,
  FaGithub: <FaGithub className="w-6 h-6" />,
  FaInstagram: <FaInstagram className="w-6 h-6" />,
  FaYoutube: <FaYoutube className="w-6 h-6" />,
  FaWhatsapp: <FaWhatsapp className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  Twitter: <FaTwitter className="w-6 h-6" />,
  FaFacebook: <FaFacebook className="w-6 h-6" />,
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
    <section id="contact" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Let's Build Something <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Extraordinary</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-600 mx-auto mb-8 rounded-full" />
            <p className="text-muted-foreground text-lg md:text-xl mb-12 leading-relaxed max-w-3xl mx-auto">
              Whether you need a fully functional dynamic web app, a stunning portfolio, or a high-end corporate presence, I am ready to bring your vision to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 hover:border-primary/50 hover:bg-white/80 dark:hover:bg-card/80 text-foreground transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {iconMap[link.icon_name] || <Mail className="w-6 h-6" />}
                </div>
                <span className="font-semibold">{link.platform}</span>
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 md:mt-20 p-8 md:p-12 rounded-3xl bg-white/60 dark:bg-card/60 backdrop-blur-xl border border-border/30 max-w-3xl mx-auto shadow-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to start?</h3>
            <p className="text-muted-foreground mb-8 text-base md:text-lg">Reach out directly via email or WhatsApp for a consultation.</p>
            <a
              href="mailto:lanternoflight11@gmail.com"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            >
              lanternoflight11@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
