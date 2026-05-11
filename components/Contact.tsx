"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { FaWhatsapp, FaYoutube, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/laiban-shah-394483408",
    icon: <FaLinkedin className="w-6 h-6" />,
  },
  {
    name: "GitHub",
    href: "https://github.com/laibanshah",
    icon: <FaGithub className="w-6 h-6" />,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/syedcodes.ui/",
    icon: <FaInstagram className="w-6 h-6" />,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@lantern_oflight",
    icon: <FaYoutube className="w-6 h-6" />,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/message/YOUR_WHATSAPP_LINK", // Replace if specific link provided
    icon: <FaWhatsapp className="w-6 h-6" />,
  },
  {
    name: "Email",
    href: "mailto:lanternoflight11@gmail.com",
    icon: <Mail className="w-6 h-6" />,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading text-foreground mb-6">Let's Build Something Extraordinary</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              Whether you need a fully functional dynamic web app, a stunning portfolio, or a high-end corporate presence, I am ready to bring your vision to life.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-primary/5 text-foreground transition-all duration-300 group shadow-sm"
              >
                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                  {link.icon}
                </div>
                <span className="font-bold">{link.name}</span>
              </a>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 p-8 rounded-3xl bg-secondary/50 border border-border max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-heading text-foreground mb-4">Ready to start?</h3>
            <p className="text-muted-foreground mb-8">Reach out directly via email or WhatsApp for a consultation.</p>
            <a
              href="mailto:lanternoflight11@gmail.com"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/20"
            >
              lanternoflight11@gmail.com
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
