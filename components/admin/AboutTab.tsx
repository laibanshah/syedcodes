"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { AboutSection } from "@/lib/supabase";
import { getAboutSection, updateAboutSection } from "@/lib/db";
import { toast } from "sonner";

export default function AboutTab() {
  const [about, setAbout] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await getAboutSection();
      setAbout(data);
      if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load about section");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateAboutSection(formData);
      toast.success("About section updated successfully");
      await loadAbout();
    } catch (error) {
      toast.error("Failed to save about section");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading about section...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">About Section</h2>
        <p className="text-muted-foreground">Edit your about section content</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="The Architect Behind the Code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="I am a passionate web developer specializing in building premium, cinematic, and responsive static and dynamic websites..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Preview */}
      {about && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div className="space-y-4">
            <h4 className="text-2xl font-bold text-foreground">{formData.title || "Untitled"}</h4>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {formData.content || "No content yet..."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
