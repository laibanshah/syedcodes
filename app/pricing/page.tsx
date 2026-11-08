import type { Metadata } from "next";
import PricingView from "@/components/PricingView";
import { getPricingTiers, getPolicySections, getPricingPageContent } from "@/lib/content";
import { getBranding } from "@/lib/data";

// Served statically and refreshed in the background at most once a minute
// (and instantly when the admin saves changes).
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pricing | SyedCodes.UI",
  description: "Transparent pricing for portfolios, blogging platforms and e-commerce websites.",
};

export default async function PricingPage() {
  const [tiers, policies, page, branding] = await Promise.all([
    getPricingTiers(),
    getPolicySections(),
    getPricingPageContent(),
    getBranding(),
  ]);

  return <PricingView tiers={tiers} policies={policies} page={page} logoUrl={branding.logo_url} />;
}
