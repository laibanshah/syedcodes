interface SiteLogoProps {
  /** Logo uploaded in Admin > Branding. Empty = the text logo. */
  logoUrl?: string;
}

/** The site's logo: the uploaded image if there is one, otherwise the "SyedCodes.UI" wordmark. */
export default function SiteLogo({ logoUrl }: SiteLogoProps) {
  if (logoUrl) {
    return (
      // Plain <img>: the logo can be any PNG/SVG/WebP of any size, so its dimensions aren't known up front.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt="SyedCodes.UI" className="h-8 md:h-9 w-auto max-w-[200px] object-contain" />
    );
  }
  return (
    <>
      Syed<span className="text-brand">Codes</span>
      <span className="text-muted-foreground">.UI</span>
    </>
  );
}
