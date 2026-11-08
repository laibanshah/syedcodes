"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PolicySection } from "@/lib/types";
import { DEFAULT_POLICY_SECTIONS } from "@/lib/content-defaults";
import { refreshPublicPages } from "@/lib/admin-client";
import ListEditor from "./ListEditor";
import { useConfirm, useConfirmDiscard, useUnsavedGuard, isDirty } from "./guard";
import {
  Field, TabHeader, PrimaryButton, SecondaryButton, LoadingBlock, ErrorBlock,
  RowActions, inputClass, cleanList, errMsg,
} from "./ui";

interface PolicyForm {
  title: string;
  items: string[];
  sub_title: string;
  sub_items: string[];
}

const emptyForm: PolicyForm = { title: "", items: [], sub_title: "", sub_items: [] };

export default function PolicyTab() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PolicySection | null>(null);
  const [form, setForm] = useState<PolicyForm>(emptyForm);
  const [baseline, setBaseline] = useState<PolicyForm>(emptyForm);
  const [formKey, setFormKey] = useState(0); // resets the list editors when a different section is opened
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  const confirmDiscard = useConfirmDiscard();

  useUnsavedGuard(showForm && isDirty(form, baseline));

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("policy_sections")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) setLoadError(error.message);
    else {
      setLoadError(null);
      setSections((data ?? []) as PolicySection[]);
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

  const openForm = async (section: PolicySection | null) => {
    if (showForm && !(await confirmDiscard())) return;
    const next: PolicyForm = section
      ? {
          title: section.title,
          items: section.items,
          sub_title: section.sub_title ?? "",
          sub_items: section.sub_items,
        }
      : emptyForm;
    setEditing(section);
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
        title: form.title.trim(),
        items: cleanList(form.items),
        sub_title: form.sub_title.trim() || null,
        sub_items: cleanList(form.sub_items),
      };
      if (editing) {
        const { error } = await supabase
          .from("policy_sections")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editing.id);
        if (error) throw error;
        toast.success("Policy section updated");
      } else {
        const next = sections.length ? Math.max(...sections.map((s) => s.order_index)) + 1 : 0;
        const { error } = await supabase.from("policy_sections").insert({ ...payload, order_index: next });
        if (error) throw error;
        toast.success("Policy section created");
      }
      resetForm();
      await load();
      await refreshPublicPages(["/pricing"]);
    } catch (err) {
      toast.error(`Failed to save: ${errMsg(err)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: PolicySection) => {
    const ok = await confirm({
      title: `Delete the "${s.title}" section?`,
      message: "It will disappear from the pricing page. This can't be undone.",
      confirmLabel: "Delete section",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("policy_sections").delete().eq("id", s.id);
    if (error) return toast.error(`Failed to delete: ${errMsg(error)}`);
    toast.success("Policy section deleted");
    await load();
    await refreshPublicPages(["/pricing"]);
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = sections[index];
    const b = sections[index + dir];
    if (!a || !b) return;
    const reordered = [...sections];
    reordered[index] = b;
    reordered[index + dir] = a;
    const results = await Promise.all(
      reordered.map((s, i) => supabase.from("policy_sections").update({ order_index: i }).eq("id", s.id))
    );
    const failed = results.find((r) => r.error);
    if (failed?.error) toast.error(`Failed to reorder: ${errMsg(failed.error)}`);
    await load();
    await refreshPublicPages(["/pricing"]);
  };

  const importDefaults = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("policy_sections").insert(DEFAULT_POLICY_SECTIONS);
      if (error) throw error;
      toast.success("Imported the policy currently shown on your site");
      await load();
      await refreshPublicPages(["/pricing"]);
    } catch (err) {
      toast.error(`Import failed: ${errMsg(err)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingBlock label="Loading policy..." />;
  if (loadError) return <ErrorBlock message={loadError} />;

  return (
    <div className="space-y-6">
      <TabHeader
        title="Work & Privacy Policy"
        description="The policy cards shown under the plans on the /pricing page"
        action={
          <PrimaryButton onClick={() => openForm(null)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5" /> Add Section
          </PrimaryButton>
        }
      />

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">{editing ? "Edit Section" : "New Section"}</h3>
            <button type="button" onClick={closeForm} className="p-2.5 hover:bg-secondary rounded-lg" aria-label="Close form">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Section title" hint='e.g. "Payment"'>
              <input className={inputClass} value={form.title} required
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <div>
              <span className="block text-sm font-medium text-foreground mb-2">Points</span>
              <ListEditor
                key={`items-${formKey}`}
                value={form.items}
                onChange={(items) => setForm((f) => ({ ...f, items }))}
                placeholder="Type a point…"
                addLabel="Add point"
              />
              <span className="block text-xs text-muted-foreground mt-1.5">Each point becomes a bullet. Drag the handle to reorder.</span>
            </div>
            <div className="rounded-xl border border-dashed border-border p-4 space-y-5">
              <p className="text-xs text-muted-foreground">
                Optional second block shown under a divider inside the same card.
              </p>
              <Field label="Sub-heading">
                <input className={inputClass} value={form.sub_title}
                  onChange={(e) => setForm({ ...form, sub_title: e.target.value })} />
              </Field>
              <div>
                <span className="block text-sm font-medium text-foreground mb-2">Sub-points</span>
                <ListEditor
                  key={`sub-${formKey}`}
                  value={form.sub_items}
                  onChange={(sub_items) => setForm((f) => ({ ...f, sub_items }))}
                  placeholder="Type a sub-point…"
                  addLabel="Add sub-point"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <SecondaryButton type="button" onClick={closeForm}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" loading={saving} className="flex-1">
                {editing ? "Update Section" : "Create Section"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {sections.length === 0 ? (
          <div className="text-center py-12 px-4 bg-card border border-border rounded-2xl space-y-4">
            <p className="text-muted-foreground">No policy sections yet.</p>
            <SecondaryButton onClick={importDefaults} disabled={saving} className="mx-auto">
              <Download className="w-4 h-4" /> Import current site content
            </SecondaryButton>
          </div>
        ) : (
          sections.map((s, i) => (
            <div key={s.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground break-words">{s.title}</h3>
                  <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-muted-foreground">
                    {s.items.map((it, k) => <li key={k} className="break-words">{it}</li>)}
                  </ul>
                  {s.sub_title && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-sm font-semibold text-foreground">{s.sub_title}</p>
                      <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-muted-foreground">
                        {s.sub_items.map((it, k) => <li key={k} className="break-words">{it}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <RowActions
                  onEdit={() => openForm(s)}
                  onDelete={() => handleDelete(s)}
                  onUp={() => move(i, -1)}
                  onDown={() => move(i, 1)}
                  disableUp={i === 0}
                  disableDown={i === sections.length - 1}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
