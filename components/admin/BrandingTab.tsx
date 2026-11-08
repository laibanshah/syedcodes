"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getSetting, updateSetting } from "@/lib/admin-data";
import { uploadPublicFile, removePublicFile, formatBytes, type UploadProgress } from "@/lib/admin-client";
import { BRANDING_KEY } from "@/lib/data";
import { DEFAULT_BRANDING, DEFAULT_FAVICON, DEFAULT_OWNER_IMAGE } from "@/lib/content-defaults";
import type { BrandingContent } from "@/lib/types";
import { useConfirm, useUnsavedGuard } from "./guard";
import { TabHeader, PrimaryButton, SecondaryButton, LoadingBlock, UploadBar, errMsg } from "./ui";

const BUCKET = "branding";
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/x-icon,image/vnd.microsoft.icon,.ico";
const MAX_MB = 25;

type Slot = keyof BrandingContent;

interface SlotInfo {
  key: Slot;
  title: string;
  help: string;
  fallbackLabel: string;
  fallbackSrc: string | null;
  prefix: string;
  box: string; // preview box size
  fit: "object-contain" | "object-cover";
}

const SLOTS: SlotInfo[] = [
  {
    key: "logo_url",
    title: "Logo",
    help: "Shown top-left in the navbar and in the footer. PNG with a transparent background or SVG works best.",
    fallbackLabel: "Text logo “SyedCodes.UI”",
    fallbackSrc: null,
    prefix: "logo",
    box: "w-full sm:w-56 h-28",
    fit: "object-contain",
  },
  {
    key: "favicon_url",
    title: "Favicon",
    help: "The small icon in the browser tab. A square PNG (at least 48×48, ideally 192×192), SVG or ICO.",
    fallbackLabel: "Default favicon",
    fallbackSrc: DEFAULT_FAVICON,
    prefix: "favicon",
    box: "w-28 h-28",
    fit: "object-contain",
  },
  {
    key: "owner_image_url",
    title: "Owner photo",
    help: "The portrait in the homepage hero. Any size is fine — it is resized automatically for each device.",
    fallbackLabel: "Default photo",
    fallbackSrc: DEFAULT_OWNER_IMAGE,
    prefix: "owner",
    box: "w-44 h-44",
    fit: "object-cover",
  },
];

export default function BrandingTab() {
  const [saved, setSaved] = useState<BrandingContent>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Partial<Record<Slot, File>>>({});
  const [previews, setPreviews] = useState<Partial<Record<Slot, string>>>({});
  const [removals, setRemovals] = useState<Partial<Record<Slot, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<{ slot: Slot; p: UploadProgress } | null>(null);
  const confirm = useConfirm();

  const dirty = Object.keys(pending).length > 0 || Object.values(removals).some(Boolean);
  useUnsavedGuard(dirty);

  useEffect(() => {
    (async () => {
      try {
        const value = await getSetting<Partial<BrandingContent>>(BRANDING_KEY);
        setSaved({ ...DEFAULT_BRANDING, ...(value ?? {}) });
      } catch (e) {
        toast.error(`Couldn't load branding: ${errMsg(e)}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Free blob: URLs created for previews.
  const previewsRef = useRef(previews);
  previewsRef.current = previews;
  useEffect(() => {
    return () => Object.values(previewsRef.current).forEach((u) => u && URL.revokeObjectURL(u));
  }, []);

  const pick = (slot: Slot, file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.name.toLowerCase().endsWith(".ico")) {
      toast.error("Please choose an image file (PNG, JPG, WebP, SVG, GIF or ICO).");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`That image is ${formatBytes(file.size)}. Please keep it under ${MAX_MB} MB.`);
      return;
    }
    const old = previews[slot];
    if (old) URL.revokeObjectURL(old);
    setPending((p) => ({ ...p, [slot]: file }));
    setPreviews((p) => ({ ...p, [slot]: URL.createObjectURL(file) }));
    setRemovals((r) => ({ ...r, [slot]: false }));
  };

  const discardPending = (slot: Slot) => {
    const old = previews[slot];
    if (old) URL.revokeObjectURL(old);
    setPending((p) => {
      const n = { ...p };
      delete n[slot];
      return n;
    });
    setPreviews((p) => {
      const n = { ...p };
      delete n[slot];
      return n;
    });
  };

  const markRemove = async (slot: SlotInfo) => {
    const ok = await confirm({
      title: `Remove the ${slot.title.toLowerCase()}?`,
      message: `The site goes back to its default (${slot.fallbackLabel.toLowerCase()}) once you press Save. The uploaded file is deleted from storage.`,
      confirmLabel: "Remove",
      destructive: true,
    });
    if (!ok) return;
    discardPending(slot.key);
    setRemovals((r) => ({ ...r, [slot.key]: true }));
  };

  const save = async () => {
    setSaving(true);
    const next: BrandingContent = { ...saved };
    const toDelete: string[] = [];
    try {
      for (const slot of SLOTS) {
        const file = pending[slot.key];
        if (file) {
          const url = await uploadPublicFile(BUCKET, file, slot.prefix, {
            onProgress: (p) => setProgress({ slot: slot.key, p }),
          });
          if (saved[slot.key]) toDelete.push(saved[slot.key]);
          next[slot.key] = url;
        } else if (removals[slot.key] && saved[slot.key]) {
          toDelete.push(saved[slot.key]);
          next[slot.key] = "";
        }
      }
      // Logo / favicon appear on every page, so refresh the whole site.
      await updateSetting(BRANDING_KEY, next, ["layout"]);
      await Promise.all(toDelete.map((u) => removePublicFile(BUCKET, u)));

      Object.values(previews).forEach((u) => u && URL.revokeObjectURL(u));
      setSaved(next);
      setPending({});
      setPreviews({});
      setRemovals({});
      toast.success("Branding saved. The favicon can take a minute (or a hard refresh) to change in the browser tab.");
    } catch (e) {
      toast.error(`Failed to save: ${errMsg(e)}`);
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  const cancelAll = () => {
    Object.values(previews).forEach((u) => u && URL.revokeObjectURL(u));
    setPending({});
    setPreviews({});
    setRemovals({});
  };

  if (loading) return <LoadingBlock label="Loading branding..." />;

  return (
    <div className="space-y-6">
      <TabHeader
        title="Branding"
        description="Logo, favicon and owner photo. Upload, replace or remove — changes go live when you press Save."
      />

      <div className="space-y-4">
        {SLOTS.map((slot) => {
          const removed = removals[slot.key];
          const shown = previews[slot.key] || (removed ? "" : saved[slot.key]) || slot.fallbackSrc || "";
          const usingCustom = Boolean(previews[slot.key] || (!removed && saved[slot.key]));
          const file = pending[slot.key];
          const inputId = `branding-${slot.key}`;
          return (
            <section key={slot.key} className="bg-card border border-border rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div
                  className={`${slot.box} shrink-0 rounded-xl border border-border bg-[repeating-conic-gradient(#f3f4f6_0%_25%,#fff_0%_50%)] [background-size:16px_16px] flex items-center justify-center overflow-hidden`}
                >
                  {shown ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={shown} alt={`${slot.title} preview`} className={`w-full h-full ${slot.fit}`} />
                  ) : (
                    <span className="text-xs text-muted-foreground px-3 text-center">{slot.fallbackLabel}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{slot.title}</h3>
                    <p className="text-sm text-muted-foreground">{slot.help}</p>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {file
                      ? `New: ${file.name} · ${formatBytes(file.size)} — uploads when you save`
                      : removed
                        ? "Will be removed when you save"
                        : usingCustom
                          ? "Custom image in use"
                          : `Using the default (${slot.fallbackLabel.toLowerCase()})`}
                  </p>

                  {progress?.slot === slot.key && (
                    <UploadBar percent={progress.p.percent} retrying={progress.p.retrying} label={`Uploading ${slot.title.toLowerCase()}`} />
                  )}

                  <div className="flex flex-wrap gap-3">
                    <input
                      id={inputId}
                      type="file"
                      accept={ACCEPT}
                      disabled={saving}
                      className="sr-only"
                      onChange={(e) => {
                        pick(slot.key, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                    <label
                      htmlFor={inputId}
                      className={`inline-flex items-center justify-center gap-2 min-h-11 px-5 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium ${saving ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <Upload className="w-4 h-4" />
                      {usingCustom || file ? "Replace" : "Upload"}
                    </label>
                    {file && (
                      <SecondaryButton type="button" className="min-h-11 text-sm" onClick={() => discardPending(slot.key)} disabled={saving}>
                        Undo
                      </SecondaryButton>
                    )}
                    {!file && !removed && saved[slot.key] && (
                      <SecondaryButton
                        type="button"
                        className="min-h-11 text-sm text-destructive hover:bg-destructive/10"
                        onClick={() => markRemove(slot)}
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </SecondaryButton>
                    )}
                    {removed && (
                      <SecondaryButton
                        type="button"
                        className="min-h-11 text-sm"
                        onClick={() => setRemovals((r) => ({ ...r, [slot.key]: false }))}
                        disabled={saving}
                      >
                        Undo remove
                      </SecondaryButton>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3">
        <SecondaryButton type="button" onClick={cancelAll} disabled={!dirty || saving}>
          Discard changes
        </SecondaryButton>
        <PrimaryButton type="button" onClick={save} loading={saving} disabled={!dirty} className="flex-1 sm:flex-none">
          Save branding
        </PrimaryButton>
      </div>
    </div>
  );
}
