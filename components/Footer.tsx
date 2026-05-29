interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
}

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-white/[0.06] py-12 md:py-16">
      <div className="container-premium">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-sm md:text-base font-heading font-semibold tracking-tight text-foreground">
            Syed<span className="text-brand">Codes</span>
            <span className="text-muted-foreground">.UI</span>
          </div>

          <p className="text-muted-foreground text-xs md:text-sm tracking-wide">
            &copy; {new Date().getFullYear()} SyedCodes.UI. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {socialLinks?.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-colors"
              >
                {link.platform}
              </a>
            ))}
            {!socialLinks && (
              <>
                <a
                  href="#home"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-colors"
                >
                  Home
                </a>
                <a
                  href="#projects"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-colors"
                >
                  Work
                </a>
                <a
                  href="#contact"
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-brand transition-colors"
                >
                  Contact
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
