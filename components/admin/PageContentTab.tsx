"use client";

import { useEffect, useState } from "react";
import { Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { LanternContent, PricingPageContent } from "@/lib/types";
import { DEFAULT_LANTERN, DEFAULT_PRICING_PAGE } from "@/lib/content-defaults";
import { LANTERN_KEY, PRICING_PAGE_KEY } from "@/lib/content";
import { refreshPublicPages, uploadPublicFile, removePublicFile, formatBytes, type UploadProgress } from "@/lib/admin-client";
import { useUnsavedGuard, isDirty } from "./guard";
import { Field, TabHeader, PrimaryButton, LoadingBlock, UploadBar, inputClass, errMsg } from "./ui";

async function loadSetting<T extends object>(key: string, defaults: T): Promise<{ value: T; error?: string }> {
  const { data, error } = await supabase.from("settings").select("value").eq("key", key).maybeSingle();
  if (error) return { value: defaults, error: error.message };
  return { value: { ...defaults, ...((data?.value as Partial<T>) ?? {}) } };
}

async function saveSetting(key: string, value: object) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

export default function PageContentTab() {
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<PricingPageContent>(DEFAULT_PRICING_PAGE);
  const [lantern, setLantern] = useState<LanternContent>(DEFAULT_LANTERN);
  const [savingPricing, setSavingPricing] = useState(false);
  const [savingLantern, setSavingLantern] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pricingBase, setPricingBase] = useState<PricingPageContent>(DEFAULT_PRICING_PAGE);
  const [lanternBase, setLanternBase] = useState<LanternContent>(DEFAULT_LANTERN);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  useUnsavedGuard(isDirty(pricing, pricingBase) || isDirty(lantern, lanternBase) || imageFile !== null);

  useEffect(() => {
    (async () => {
      const [p, l] = await Promise.all([
        loadSetting(PRICING_PAGE_KEY, DEFAULT_PRICING_PAGE),
        loadSetting(LANTERN_KEY, DEFAULT_LANTERN),
      ]);
      if (p.error || l.error) toast.error("Couldn't read saved page content — showing current site defaults.");
      setPricing(p.value);
      setPricingBase(p.value);
      setLantern(l.value);
      setLanternBase(l.value);
      setImagePreview(l.value.image);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // Free the temporary blob URL created for the preview.
    return () => {
      if (imagePreview.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const savePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPricing(true);
    try {
      await saveSetting(PRICING_PAGE_KEY, pricing);
      setPricingBase(pricing);
      toast.success("Pricing page text saved");
      await refreshPublicPages(["/pricing"]);
    } catch (err) {
      toast.error(`Failed to save: ${errMsg(err)}`);
    } finally {
      setSavingPricing(false);
    }
  };

  const saveLantern = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLantern(true);
    try {
      let next = lantern;
      if (imageFile) {
        const url = await uploadPublicFile("project-images", imageFile, "lantern", { onProgress: setProgress });
        await removePublicFile("project-images", lantern.image);
        next = { ...lantern, image: url };
      }
      await saveSetting(LANTERN_KEY, next);
      setLantern(next);
      setLanternBase(next);
      setImageFile(null);
      setImagePreview(next.image);
      toast.success("Lantern of Light saved");
      await refreshPublicPages(["/"]);
    } catch (err) {
      toast.error(`Failed to save: ${errMsg(err)}`);
    } finally {
      setSavingLantern(false);
      setProgress(null);
    }
  };

  if (loading) return <LoadingBlock label="Loading page content..." />;

  const card = "bg-card border border-border rounded-2xl p-4 sm:p-6";

  return (
    <div className="space-y-6">
      <TabHeader title="Page Content" description="Headings and text that were previously fixed in the code" />

      <form onSubmit={savePricing} className={`${card} space-y-5`}>
        <h3 className="text-lg font-semibold">Pricing page text</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Small label (above heading)">
            <input className={inputClass} value={pricing.label}
              onChange={(e) => setPricing({ ...pricing, label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={pricing.title}
              onChange={(e) => setPricing({ ...pricing, title: e.target.value })} />
          </Field>
        </div>
        <Field label="Intro text">
          <textarea className={`${inputClass} resize-y`} rows={2} value={pricing.description}
            onChange={(e) => setPricing({ ...pricing, description: e.target.value })} />
        </Field>
        <div className="border-t border-border pt-5 space-y-5">
          <p className="text-sm font-medium text-muted-foreground">Policy section header</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Small label">
              <input className={inputClass} value={pricing.policy_label}
                onChange={(e) => setPricing({ ...pricing, policy_label: e.target.value })} />
            </Field>
            <Field label="Heading">
              <input className={inputClass} value={pricing.policy_title}
                onChange={(e) => setPricing({ ...pricing, policy_title: e.target.value })} />
            </Field>
          </div>
          <Field label="Intro text">
            <textarea className={`${inputClass} resize-y`} rows={2} value={pricing.policy_description}
              onChange={(e) => setPricing({ ...pricing, policy_description: e.target.value })} />
          </Field>
        </div>
        <PrimaryButton type="submit" loading={savingPricing} className="w-full sm:w-auto">
          <Save className="w-5 h-5" /> Save pricing page text
        </PrimaryButton>
      </form>

      <form onSubmit={saveLantern} className={`${card} space-y-5`}>
        <h3 className="text-lg font-semibold">Lantern of Light (homepage)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Title">
            <input className={inputClass} value={lantern.title}
              onChange={(e) => setLantern({ ...lantern, title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input className={inputClass} value={lantern.subtitle}
              onChange={(e) => setLantern({ ...lantern, subtitle: e.target.value })} />
          </Field>
        </div>
        <Field label="Description">
          <textarea className={`${inputClass} resize-y`} rows={4} value={lantern.description}
            onChange={(e) => setLantern({ ...lantern, description: e.target.value })} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Button text">
            <input className={inputClass} value={lantern.button_label}
              onChange={(e) => setLantern({ ...lantern, button_label: e.target.value })} />
          </Field>
          <Field label="Button link">
            <input className={inputClass} type="url" value={lantern.button_url}
              onChange={(e) => setLantern({ ...lantern, button_url: e.target.value })} />
          </Field>
        </div>
        <div>
          <span className="block text-sm font-medium mb-2">Logo / image</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-28 h-28 shrink-0 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Preview" className="max-w-full max-h-full object-contain" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2 min-w-0">
              <input type="file" accept="image/*" onChange={onPickImage} className="block w-full text-sm" />
              <p className="text-xs text-muted-foreground">
                {imageFile
                  ? `${imageFile.name} · ${formatBytes(imageFile.size)} — uploads when you save`
                  : "Any image size works — it uploads directly to storage."}
              </p>
            </div>
          </div>
        </div>
        {progress && <UploadBar percent={progress.percent} retrying={progress.retrying} label="Uploading image" />}
        <PrimaryButton type="submit" loading={savingLantern} className="w-full sm:w-auto">
          <Save className="w-5 h-5" />
          {savingLantern && imageFile ? "Uploading..." : "Save Lantern of Light"}
        </PrimaryButton>
      </form>
    </div>
  );
}
