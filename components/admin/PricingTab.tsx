"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, Star, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PricingTier } from "@/lib/types";
import { DEFAULT_PRICING_TIERS } from "@/lib/content-defaults";
import { refreshPublicPages } from "@/lib/admin-client";
import PricingCard from "@/components/PricingCard";
import ListEditor from "./ListEditor";
import { useConfirm, useConfirmDiscard, useUnsavedGuard, isDirty } from "./guard";
import {
  Field, TabHeader, PrimaryButton, SecondaryButton, LoadingBlock, ErrorBlock,
  RowActions, inputClass, cleanList, errMsg,
} from "./ui";

interface TierForm {
  name: string;
  price: string;
  currency: string;
  description: string;
  features: string[];
  featured: boolean;
  cta_label: string;
  cta_link: string;
}

const emptyForm: TierForm = {
  name: "",
  price: "",
  currency: "IST",
  description: "",
  features: [],
  featured: false,
  cta_label: "Get Started",
  cta_link: "/#contact",
};

export default function PricingTab() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PricingTier | null>(null);
  const [form, setForm] = useState<TierForm>(emptyForm);
  const [baseline, setBaseline] = useState<TierForm>(emptyForm);
  const [formKey, setFormKey] = useState(0); // resets the feature list editor when a different plan is opened
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  const confirmDiscard = useConfirmDiscard();

  useUnsavedGuard(showForm && isDirty(form, baseline));

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("pricing_tiers")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) setLoadError(error.message);
    else {
      setLoadError(null);
      setTiers((data ?? []) as PricingTier[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm);
    setBaseline(emptyForm);
    setEditing(null);
    setShowForm(false);
  };

  const closeForm = async () => {
    if (!(await confirmDiscard())) return;
    resetForm();
  };

  const openForm = async (tier: PricingTier | null) => {
    if (showForm && !(await confirmDiscard())) return;
    const next: TierForm = tier
      ? {
          name: tier.name,
          price: tier.price,
          currency: tier.currency,
          description: tier.description,
          features: tier.features,
          featured: tier.featured,
          cta_label: tier.cta_label,
          cta_link: tier.cta_link,
        }
      : emptyForm;
    setEditing(tier);
    setForm(next);
    setBaseline(next);
    setFormKey((k) => k + 1);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        price: form.price.trim(),
        currency: form.currency.trim(),
        description: form.description.trim(),
        features: cleanList(form.features),
        featured: form.featured,
        cta_label: form.cta_label.trim() || "Get Started",
        cta_link: form.cta_link.trim() || "/#contact",
      };
      if (editing) {
        const { error } = await supabase
          .from("pricing_tiers")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Plan updated");
      } else {
        const next = tiers.length ? Math.max(...tiers.map((t) => t.order_index)) + 1 : 0;
        const { error } = await supabase.from("pricing_tiers").insert({ ...payload, order_index: next });
        if (error) throw error;
        toast.success("Plan created");
      }
      resetForm();
      await load();
      await refreshPublicPages(["/pricing"]);
    } catch (err) {
      toast.error(`Failed to save plan: ${errMsg(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t: PricingTier) => {
    const ok = await confirm({
      title: `Delete the "${t.name}" plan?`,
      message: "It will disappear from the pricing page. This can't be undone.",
      confirmLabel: "Delete plan",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("pricing_tiers").delete().eq("id", t.id);
    if (error) return toast.error(`Failed to delete: ${errMsg(error)}`);
    toast.success("Plan deleted");
    await load();
    await refreshPublicPages(["/pricing"]);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = tiers[index];
    const b = tiers[index + dir];
    if (!a || !b) return;
    // Renumber so order stays valid even if two rows share an order_index.
    const reordered = [...tiers];
    reordered[index] = b;
    reordered[index + dir] = a;
    const results = await Promise.all(
      reordered.map((t, i) => supabase.from("pricing_tiers").update({ order_index: i }).eq("id", t.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(`Failed to reorder: ${errMsg(failed.error)}`);
    await load();
    await refreshPublicPages(["/pricing"]);
  };

  const importDefaults = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("pricing_tiers").insert(DEFAULT_PRICING_TIERS);
      if (error) throw error;
      toast.success("Imported the plans currently shown on your site");
      await load();
      await refreshPublicPages(["/pricing"]);
    } catch (err) {
      toast.error(`Import failed: ${errMsg(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading pricing..." />;
  if (loadError) return <ErrorBlock message={loadError} />;

  return (
    <div className="space-y-6">
      <TabHeader
        title="Pricing Plans"
        description="The plans shown on the /pricing page"
        action={
          <PrimaryButton onClick={() => openForm(null)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5" /> Add Plan
          </PrimaryButton>
        }
      />

      {showForm && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">{editing ? "Edit Plan" : "New Plan"}</h3>
              <button type="button" onClick={closeForm} className="p-2.5 hover:bg-secondary rounded-lg" aria-label="Close form">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Plan name">
                <input className={inputClass} value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Price" hint='Shown exactly as typed, e.g. "Rs 5,999"'>
                  <input className={inputClass} value={form.price} required
                    onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </Field>
                <Field label="Currency label" hint="Shown in brackets after the price">
                  <input className={inputClass} value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })} />
                </Field>
              </div>
              <Field label="Short description">
                <input className={inputClass} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Field>
              <div>
                <span className="block text-sm font-medium text-foreground mb-2">Features</span>
                <ListEditor
                  key={formKey}
                  value={form.features}
                  onChange={(features) => setForm((f) => ({ ...f, features }))}
                  placeholder="Type a feature…"
                  addLabel="Add feature"
                />
                <span className="block text-xs text-muted-foreground mt-1.5">
                  Drag the handle to reorder. Press Enter for a new row. Pasting several lines splits them into rows.
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Button text">
                  <input className={inputClass} value={form.cta_label}
                    onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
                </Field>
                <Field label="Button link" hint='e.g. "/#contact" or a full URL'>
                  <input className={inputClass} value={form.cta_link}
                    onChange={(e) => setForm({ ...form, cta_link: e.target.value })} />
                </Field>
              </div>
              <label className="flex items-center gap-3 min-h-11 cursor-pointer">
                <input type="checkbox" checked={form.featured} className="w-5 h-5"
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                <span className="text-sm font-medium">Highlight as &quot;Most Popular&quot;</span>
              </label>
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <SecondaryButton type="button" onClick={closeForm}>Cancel</SecondaryButton>
                <PrimaryButton type="submit" loading={saving} className="flex-1">
                  {editing ? "Update Plan" : "Create Plan"}
                </PrimaryButton>
              </div>
            </form>
          </div>

          <div className="xl:sticky xl:top-28">
            <p className="text-sm font-medium text-muted-foreground mb-3">Live preview — exactly how it looks on /pricing</p>
            <div className="rounded-2xl border border-border bg-background p-4 sm:p-6 pt-8">
              <PricingCard tier={{ ...form, features: cleanList(form.features) }} preview />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {tiers.length === 0 ? (
          <div className="text-center py-12 px-4 bg-card border border-border rounded-2xl space-y-4">
            <p className="text-muted-foreground">No plans yet.</p>
            <SecondaryButton onClick={importDefaults} disabled={saving} className="mx-auto">
              <Download className="w-4 h-4" /> Import current site content
            </SecondaryButton>
          </div>
        ) : (
          tiers.map((t, i) => (
            <div key={t.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground break-words">{t.name}</h3>
                    {t.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        <Star className="w-3 h-3" /> Most Popular
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-semibold">
                    {t.price} <span className="text-muted-foreground font-normal text-sm">({t.currency})</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t.features.length} features</p>
                </div>
                <RowActions
                  onEdit={() => openForm(t)}
                  onDelete={() => handleDelete(t)}
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                  disableUp={i === 0}
                  disableDown={i === tiers.length - 1}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
