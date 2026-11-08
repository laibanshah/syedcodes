"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, Link as LinkIcon, FileText, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { uploadFile, refreshPublicPages, formatBytes, type UploadProgress } from "@/lib/admin-client";
import { useConfirm, useConfirmDiscard, useUnsavedGuard } from "./guard";
import {
  Field, TabHeader, PrimaryButton, SecondaryButton, LoadingBlock, ErrorBlock, UploadBar, inputClass, errMsg,
} from "./ui";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  resource_type: "link" | "file";
  url: string | null;
  file_path: string | null;
  created_at: string;
};

interface ResourceForm {
  title: string;
  description: string;
  resourceType: "link" | "file";
  url: string;
}

const emptyForm: ResourceForm = { title: "", description: "", resourceType: "link", url: "" };

export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [form, setForm] = useState<ResourceForm>(emptyForm);
  const [baseline, setBaseline] = useState<ResourceForm>(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const confirm = useConfirm();
  const confirmDiscard = useConfirmDiscard();

  const dirty = JSON.stringify(form) !== JSON.stringify(baseline) || file !== null;
  useUnsavedGuard(dirty);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (error) setLoadError(error.message);
    else {
      setLoadError(null);
      setResources((data ?? []) as Resource[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setBaseline(emptyForm);
    setFile(null);
    setProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      let filePath: string | null = null;
      if (form.resourceType === "file" && file) {
        const uploaded = await uploadFile("resources", file, "resource", {
          onProgress: setProgress,
          signal: controller.signal,
        });
        filePath = uploaded.path;
      }

      const existing = resources.find((r) => r.id === editingId);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        resource_type: form.resourceType,
        url: form.resourceType === "link" ? form.url.trim() : null,
        file_path: form.resourceType === "file" ? filePath ?? existing?.file_path ?? null : null,
      };
      if (form.resourceType === "file" && !payload.file_path) throw new Error("Please choose a file to upload.");

      if (editingId) {
        const { error } = await supabase.from("resources").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", editingId);
        if (error) throw error;
        // The old file is no longer referenced when it was replaced or the resource became a link.
        if (existing?.file_path && existing.file_path !== payload.file_path) {
          await supabase.storage.from("resources").remove([existing.file_path]);
        }
        toast.success("Resource updated");
      } else {
        const { error } = await supabase.from("resources").insert(payload);
        if (error) throw error;
        toast.success("Resource added");
      }

      resetForm();
      await load();
      await refreshPublicPages(["/resources"]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") toast.message("Upload cancelled");
      else toast.error(errMsg(err));
    } finally {
      setSaving(false);
      setProgress(null);
      abortRef.current = null;
    }
  };

  const handleEdit = async (r: Resource) => {
    if (dirty && !(await confirmDiscard())) return;
    const next: ResourceForm = {
      title: r.title,
      description: r.description ?? "",
      resourceType: r.resource_type,
      url: r.url ?? "",
    };
    setEditingId(r.id);
    setForm(next);
    setBaseline(next);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = async () => {
    if (!(await confirmDiscard())) return;
    resetForm();
  };

  const handleDelete = async (r: Resource) => {
    const ok = await confirm({
      title: `Delete "${r.title}"?`,
      message: r.file_path
        ? "The resource and its uploaded file will be removed for good."
        : "The resource will be removed for good.",
      confirmLabel: "Delete resource",
      destructive: true,
    });
    if (!ok) return;
    try {
      if (r.file_path) await supabase.storage.from("resources").remove([r.file_path]);
      const { error } = await supabase.from("resources").delete().eq("id", r.id);
      if (error) throw error;
      toast.success("Resource deleted");
      if (editingId === r.id) resetForm();
      await load();
      await refreshPublicPages(["/resources"]);
    } catch (err) {
      toast.error(`Failed to delete: ${errMsg(err)}`);
    }
  };

  if (loading) return <LoadingBlock label="Loading resources..." />;
  if (loadError) return <ErrorBlock message={loadError} />;

  const typeBtn = (type: "link" | "file") =>
    `flex-1 flex items-center justify-center gap-2 min-h-12 rounded-xl border transition-all ${
      form.resourceType === type ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-secondary"
    }`;

  return (
    <div className="space-y-6">
      <TabHeader
        title="Resources"
        description="Links and downloads listed on the /resources page"
        action={
          editingId ? (
            <SecondaryButton type="button" onClick={handleCancel} className="w-full sm:w-auto">
              <X className="w-4 h-4" /> Cancel edit
            </SecondaryButton>
          ) : undefined
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg font-semibold">{editingId ? "Edit resource" : "Add resource"}</h3>
        <Field label="Title">
          <input className={inputClass} required value={form.title} placeholder="E.g., Complete UI Kit 2026"
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={`${inputClass} resize-y`} rows={3} value={form.description}
            placeholder="A brief description of what this resource contains..."
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>

        <div>
          <span className="block text-sm font-medium text-foreground mb-2">Type</span>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" className={typeBtn("link")} onClick={() => setForm({ ...form, resourceType: "link" })}>
              <LinkIcon className="w-5 h-5" /> External link
            </button>
            <button type="button" className={typeBtn("file")} onClick={() => setForm({ ...form, resourceType: "file" })}>
              <FileText className="w-5 h-5" /> Downloadable file
            </button>
          </div>
        </div>

        {form.resourceType === "link" ? (
          <Field label="URL">
            <input className={inputClass} type="url" required value={form.url} placeholder="https://..."
              onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </Field>
        ) : (
          <div className="space-y-3">
            <Field
              label={`File${editingId ? " (leave empty to keep the current one)" : ""}`}
              hint="Files over 6 MB upload in resumable chunks, so a dropped connection won't lose your progress."
            >
              <input
                ref={fileInputRef}
                type="file"
                required={!editingId || !resources.find((r) => r.id === editingId)?.file_path}
                disabled={saving}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm"
              />
            </Field>
            {file && !saving && (
              <p className="text-xs text-muted-foreground">{file.name} · {formatBytes(file.size)}</p>
            )}
          </div>
        )}

        {progress && <UploadBar percent={progress.percent} retrying={progress.retrying} label="Uploading file" />}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          {saving && progress ? (
            <SecondaryButton type="button" onClick={() => abortRef.current?.abort()}>
              Cancel upload
            </SecondaryButton>
          ) : null}
          <PrimaryButton type="submit" loading={saving} className="flex-1">
            <Upload className="w-5 h-5" />
            {saving ? (progress ? "Uploading…" : "Saving…") : editingId ? "Update resource" : "Add resource"}
          </PrimaryButton>
        </div>
      </form>

      <div>
        <h3 className="text-lg font-semibold mb-4">Existing resources</h3>
        {resources.length === 0 ? (
          <p className="text-muted-foreground text-center p-8 bg-card rounded-2xl border border-border">No resources yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-card p-5 rounded-2xl border border-border flex flex-col gap-3 hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-primary">
                    {r.resource_type === "link" ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span className="text-xs font-semibold uppercase tracking-wider">{r.resource_type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => handleEdit(r)} aria-label="Edit"
                      className="p-2.5 min-w-10 min-h-10 inline-flex items-center justify-center hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(r)} aria-label="Delete"
                      className="p-2.5 min-w-10 min-h-10 inline-flex items-center justify-center hover:bg-destructive/10 rounded-lg text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-lg break-words">{r.title}</h4>
                {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
