import { supabase } from "./supabase";
import { getSettingValue } from "./data";
import type {
  PricingTier,
  PolicySection,
  PricingPageContent,
  LanternContent,
} from "./types";
import {
  DEFAULT_PRICING_TIERS,
  DEFAULT_POLICY_SECTIONS,
  DEFAULT_PRICING_PAGE,
  DEFAULT_LANTERN,
  withMeta,
} from "./content-defaults";

/**
 * Public read helpers for the admin-managed content.
 * - Query error (e.g. tables not created yet, DB unreachable) -> hard-coded defaults.
 * - Query ok but empty -> empty (the admin removed everything on purpose).
 */

export async function getPricingTiers(): Promise<PricingTier[]> {
  try {
    const { data, error } = await supabase
      .from("pricing_tiers")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) {
      console.error("Error fetching pricing tiers:", error.message);
      return withMeta(DEFAULT_PRICING_TIERS, "default-tier") as PricingTier[];
    }
    return (data ?? []) as PricingTier[];
  } catch (e) {
    console.error("Exception fetching pricing tiers:", e);
    return withMeta(DEFAULT_PRICING_TIERS, "default-tier") as PricingTier[];
  }
}

export async function getPolicySections(): Promise<PolicySection[]> {
  try {
    const { data, error } = await supabase
      .from("policy_sections")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) {
      console.error("Error fetching policy sections:", error.message);
      return withMeta(DEFAULT_POLICY_SECTIONS, "default-policy") as PolicySection[];
    }
    return (data ?? []) as PolicySection[];
  } catch (e) {
    console.error("Exception fetching policy sections:", e);
    return withMeta(DEFAULT_POLICY_SECTIONS, "default-policy") as PolicySection[];
  }
}

export const PRICING_PAGE_KEY = "pricing_page";
export const LANTERN_KEY = "lantern";

export function getPricingPageContent(): Promise<PricingPageContent> {
  return getSettingValue(PRICING_PAGE_KEY, DEFAULT_PRICING_PAGE);
}

export function getLanternContent(): Promise<LanternContent> {
  return getSettingValue(LANTERN_KEY, DEFAULT_LANTERN);
}
