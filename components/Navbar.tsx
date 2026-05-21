"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, MessageCircle } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Policy", href: "#policy" },
  { name: "Contact", href: "#contact" },
  { name: "WhatsApp", href: "https://chat.whatsapp.com/your-invite-link", external: true },
];

interface SocialLink {
  platform: string;
  url: string;
}

interface NavbarProps {
  socialLinks?: SocialLink[];
}

export default function Navbar({ socialLinks }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external) {
      setIsMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "py-3" : "py-5"
        )}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div
            className={clsx(
              "mx-auto flex items-center justify-between rounded-2xl border border-border/30 px-6 py-4 backdrop-blur-xl transition-all duration-500",
              isScrolled 
                ? "bg-white/70 dark:bg-card/80 shadow-xl shadow-black/5 max-w-5xl" 
                : "bg-white/50 dark:bg-card/50 max-w-6xl"
            )}
          >
            <Link href="#home" onClick={(e) => scrollToSection(e, "#home")} className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">S</span>yedCodes.UI
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href, link.external)}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-300"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-foreground" />
                  ) : (
                    <Moon className="w-5 h-5 text-foreground" />
                  )}
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-4 px-4 md:hidden"
            >
              <div className="rounded-2xl border border-border/30 bg-white/80 dark:bg-card/95 backdrop-blur-xl p-6 shadow-2xl flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href, link.external)}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-lg text-foreground hover:text-primary transition-colors duration-300 py-3 border-b border-border/30 last:border-0"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
