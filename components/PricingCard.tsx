import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

export interface PricingCardData {
  name: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  featured: boolean;
  cta_label: string;
  cta_link: string;
}

/**
 * One pricing plan. Used by the public /pricing page and by the live preview in
 * Admin > Pricing, so what you see while typing is exactly what visitors get.
 * `preview` swaps the link for an inert button so clicking it in the admin does nothing.
 */
export default function PricingCard({ tier, preview = false }: { tier: PricingCardData; preview?: boolean }) {
  const ctaClass = `inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-sm font-semibold tracking-wide transition-all duration-300 rounded-xl ${
    tier.featured
      ? "bg-brand text-[#0a0a0a] hover:bg-brand-dim hover:shadow-[0_0_40px_var(--brand-glow)]"
      : "border border-black/15 text-foreground hover:border-brand/40 hover:text-brand"
  }`;
  const ctaContent = (
    <>
      {tier.cta_label || "Get Started"}
      <ArrowRight className="w-4 h-4" strokeWidth={2} />
    </>
  );

  return (
    <div className={`relative h-full ${tier.featured ? "lg:-mt-4 lg:mb-4" : ""}`}>
      {tier.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand text-[#0a0a0a] text-xs font-semibold uppercase tracking-wider rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className={`premium-card p-8 md:p-10 h-full flex flex-col ${tier.featured ? "border-brand/30 bg-card/50" : ""}`}>
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-3 break-words">
            {tier.name || "Plan name"}
          </h3>
          <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-4xl md:text-5xl font-heading font-semibold text-foreground">
              {tier.price || "—"}
            </span>
            {tier.currency && <span className="text-muted-foreground text-sm">({tier.currency})</span>}
          </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
          {tier.features.map((feature, i) => (
            <li key={`${i}-${feature}`} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-brand shrink-0 mt-0.5" strokeWidth={2} />
              <span className="text-sm text-muted-foreground leading-relaxed break-words">{feature}</span>
            </li>
          ))}
        </ul>

        {preview ? (
          <button type="button" tabIndex={-1} className={ctaClass}>
            {ctaContent}
          </button>
        ) : (
          <Link href={tier.cta_link || "/#contact"} className={ctaClass}>
            {ctaContent}
          </Link>
        )}
      </div>
    </div>
  );
}
