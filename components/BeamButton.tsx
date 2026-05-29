"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BeamButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function BeamButton({
  href,
  children,
  variant = "primary",
  icon,
  className,
  onClick,
}: BeamButtonProps) {
  const isPrimary = variant === "primary";

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    onClick?.(e);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn("beam-button group", className)}
    >
      <span className="beam-button__track" aria-hidden />
      <span className="beam-button__glow" aria-hidden />
      <span
        className={cn(
          "beam-button__inner",
          isPrimary ? "beam-button__inner--primary" : "beam-button__inner--secondary"
        )}
      >
        {icon && (
          <span className="shrink-0 flex items-center justify-center">{icon}</span>
        )}
        <span>{children}</span>
        {isPrimary && (
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        )}
      </span>
    </Link>
  );
}
