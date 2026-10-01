"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLink {
  name: string;
  href: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { name: "Work", href: "/#projects" },
  { name: "Pricing", href: "/pricing", external: true },
  { name: "Resources", href: "/resources", external: true },
  { name: "Contact", href: "/#contact" },
  { name: "All Projects", href: "/projects", external: true },
];

interface SocialLink {
  platform: string;
  url: string;
}

interface NavbarProps {
  socialLinks?: SocialLink[];
}

export default function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    external?: boolean
  ) => {
    if (external) {
      setIsMobileMenuOpen(false);
      return;
    }
    
    // Extract the hash from the href (handles both #section and /#section)
    const hash = href.includes("#") ? href.substring(href.indexOf("#")) : href;
    
    // If not on homepage, let the link navigate to homepage with hash
    if (pathname !== "/") {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      window.location.href = href;
      return;
    }
    
    // On homepage, prevent default and smooth scroll
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-3" : "py-5 md:py-6"
      )}
    >
      <div className="container-premium">
        <div
          className={clsx(
            "flex items-center justify-between transition-all duration-500",
            isScrolled &&
              "py-3 px-5 md:px-6 border border-black/[0.08] bg-background/85 backdrop-blur-md"
          )}
        >
          <Link
            href="/#home"
            onClick={(e) => scrollToSection(e, "#home")}
            className="text-sm md:text-base font-heading font-semibold tracking-tight text-foreground group md:flex-1"
          >
            Syed<span className="text-brand">Codes</span>
            <span className="text-muted-foreground">.UI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href, link.external)}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 border border-black/10 rounded-full text-foreground hover:border-brand/40"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-black/[0.06] bg-background mt-2"
          >
            <div className="container-premium py-6 flex flex-col gap-1">
              <a
                href="/#home"
                onClick={(e) => scrollToSection(e, "#home")}
                className="py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-brand"
              >
                Home
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href, link.external)}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="py-3 text-sm uppercase tracking-widest text-muted-foreground hover:text-brand border-t border-black/[0.06]"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
