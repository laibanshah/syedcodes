"use client";

import { cn } from "@/lib/utils";

interface HeroAccentWordProps {
  children: React.ReactNode;
  variant?: "default" | "long" | "wave";
  className?: string;
}

export default function HeroAccentWord({
  children,
  variant = "default",
  className,
}: HeroAccentWordProps) {
  const paths = {
    default: "M1 5.5 C18 2, 35 8, 52 4.5 S 85 3, 99 5.5",
    long: "M0 6 Q 22 1.5, 45 5.5 T 90 4 Q 95 3.5, 100 5",
    wave: "M1 4.5 C20 7, 40 2, 60 5.5 S 80 6, 99 4",
  };

  return (
    <span
      className={cn(
        "relative inline-block text-brand font-accent italic",
        "tracking-normal px-0.5",
        className
      )}
    >
      {children}
      <svg
        className={cn(
          "absolute left-0 w-[108%] -ml-[4%] pointer-events-none text-brand",
          variant === "long" ? "-bottom-2 md:-bottom-3 h-3 md:h-4" : "-bottom-1 md:-bottom-1.5 h-2.5 md:h-3"
        )}
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={paths[variant]}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}
