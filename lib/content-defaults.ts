import type {
  PricingTier,
  PolicySection,
  PricingPageContent,
  LanternContent,
  BrandingContent,
} from "./types";

/**
 * The content that used to be hard-coded in the front-end.
 * Used as (a) the fallback when the database is unreachable/not set up yet and
 * (b) the source for the admin panel's "Import current site content" button.
 */

type NewTier = Omit<PricingTier, "id" | "created_at" | "updated_at">;
type NewPolicy = Omit<PolicySection, "id" | "created_at" | "updated_at">;

export const DEFAULT_PRICING_TIERS: NewTier[] = [
  {
    name: "Landing pages/ Portfolio",
    price: "Rs 5,999",
    currency: "IST",
    description: "Perfect for personal portfolios and single-page websites",
    features: [
      "Source code",
      "Free Domain (.netlify.app or .vercel.app)",
      "Free Hosting (on netlify or on vercel)",
      "Mobile Responsive Design",
      "Modern, glassmorphic, apple like, renaissance UI/UX",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Single page website",
      "Hard coded",
      "You can later upgrade hosting, storage, or domain anytime according to your needs. Custom domains from platforms like Namecheap or GoDaddy can also be connected.",
    ],
    featured: false,
    cta_label: "Get Started",
    cta_link: "/#contact",
    order_index: 0,
  },
  {
    name: "Blogging platform/business with backend",
    price: "Rs 11,999",
    currency: "IST",
    description: "Full-featured blogging platform with admin panel",
    features: [
      "Free Domain (.netlify.app or .vercel.app) + custom domain if you like",
      "Free Hosting (on netlify or on vercel)",
      "Free 5GB Cloud Storage (Supabase)",
      "Mobile Responsive Design",
      "Admin panel & Dashboard",
      "Authentication",
      "Basic cyber security",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Source code",
      "Multiple pages",
    ],
    featured: true,
    cta_label: "Get Started",
    cta_link: "/#contact",
    order_index: 1,
  },
  {
    name: "E-Commerce website with stripe and all",
    price: "Rs 21,999",
    currency: "IST",
    description: "Complete e-commerce solution with payment integration",
    features: [
      "Stripe Connectivity",
      "Wishlist/ Add to cart",
      "User signup feature",
      "Free Domain (.netlify.app or .vercel.app) + custom domain if you like",
      "Free Hosting (on netlify or on vercel)",
      "Free 5GB Cloud Storage (Supabase)",
      "Mobile Responsive Design",
      "Admin panel & Dashboard",
      "Authentication",
      "Basic cyber security",
      "Fast Loading Speed",
      "Basic SEO Setup",
      "Secure Deployment",
      "One Month Free Support",
      "Source code",
      "Multiple pages",
    ],
    featured: false,
    cta_label: "Get Started",
    cta_link: "/#contact",
    order_index: 2,
  },
];

export const DEFAULT_POLICY_SECTIONS: NewPolicy[] = [
  {
    title: "Payment",
    items: [
      "50% Advance Before Starting The Project",
      "Remaining 50% Before Final Deployment",
      "Refund will be provided if the user cancels the project before pushing the source code but the initial 50% refund will only be provided if the user cancels the project within 12 hours of the payment",
      "After full payment, the website will be fully deployed and handed over successfully",
      "The client should create a new email address and grant temporary access to me in that email i will host the website and provide source code",
    ],
    sub_title: null,
    sub_items: [],
    order_index: 0,
  },
  {
    title: "Revisions & Support",
    items: [
      "You will get revisions and iterations during development but for adding additional features you will need to pay extra",
      "If any issue or accidental error happens within 1 month, we will provide free support",
      "After that we charge 1000 (IST) per month for support, but we will provide you website in such a way that you wont be needing that",
    ],
    sub_title: "To Start The Project, We Only Need",
    sub_items: [
      "50% Advance Payment",
      "An Email ID for project setup and management (For Tier 2 & 3 websites only)",
    ],
    order_index: 1,
  },
];

export const DEFAULT_PRICING_PAGE: PricingPageContent = {
  label: "Pricing",
  title: "Choose Your Plan",
  description: "Transparent pricing for every project size. No hidden fees, no surprises.",
  policy_label: "Policy",
  policy_title: "Work Policy",
  policy_description: "Clear guidelines to ensure a smooth and successful collaboration",
};

export const DEFAULT_LANTERN: LanternContent = {
  title: "Lantern of Light",
  subtitle: "Spiritual & Islamic Community",
  description:
    "A spiritual and Islamic community presentation focused on guiding hearts, sharing wisdom, and fostering a supportive environment built on faith and unity.",
  image: "/assets/lol.png",
  button_label: "Join WhatsApp community",
  button_url: "https://whatsapp.com/channel/0029VaeYmbP5PO0zmfC6Yl2J",
};

export const DEFAULT_BRANDING: BrandingContent = {
  logo_url: "",
  favicon_url: "",
  owner_image_url: "",
};

/** Built-in images used when nothing has been uploaded in Admin > Branding. */
export const DEFAULT_OWNER_IMAGE = "/assets/owner.jpg";
export const DEFAULT_FAVICON = "/favicon.ico";

const now = () => new Date().toISOString();

export function withMeta<T extends object>(rows: T[], prefix: string): (T & { id: string; created_at: string; updated_at: string })[] {
  return rows.map((r, i) => ({ ...r, id: `${prefix}-${i}`, created_at: now(), updated_at: now() }));
}
