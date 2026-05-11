interface SocialLink {
  platform: string;
  url: string;
}

interface FooterProps {
  socialLinks?: SocialLink[];
}

export default function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-primary">S</span>yedCodes.UI
          </div>
          
          <div className="text-muted-foreground text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} SyedCodes.UI. All rights reserved.
          </div>

          <div className="flex gap-6">
            {socialLinks?.map((link) => (
              <a 
                key={link.platform} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.platform}
              </a>
            ))}
            {!socialLinks && (
              <>
                <a href="#home" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</a>
                <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</a>
                <a href="#policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Policy</a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
