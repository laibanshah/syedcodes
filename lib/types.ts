export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image_url: string | null;
  tech_stack: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  title: string | null;
  content: string | null;
  updated_at: string;
}

export interface ContactLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  featured: boolean;
  cta_label: string;
  cta_link: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PolicySection {
  id: string;
  title: string;
  items: string[];
  sub_title: string | null;
  sub_items: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface PricingPageContent {
  label: string;
  title: string;
  description: string;
  policy_label: string;
  policy_title: string;
  policy_description: string;
}

export interface LanternContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  button_label: string;
  button_url: string;
}

/** Site-wide images managed from Admin > Branding. Empty string = use the built-in default. */
export interface BrandingContent {
  logo_url: string;
  favicon_url: string;
  owner_image_url: string;
}
