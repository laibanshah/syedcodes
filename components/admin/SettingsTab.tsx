"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { Setting } from "@/lib/types";
import { getSetting, updateSetting } from "@/lib/db";
import { toast } from "sonner";

export default function SettingsTab() {
  const [heroSettings, setHeroSettings] = useState<any>(null);
  const [socialSettings, setSocialSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [heroForm, setHeroForm] = useState({
    title: "",
    subtitle: "",
  });

  const [socialForm, setSocialForm] = useState({
    linkedin: "",
    github: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const heroData = await getSetting("hero");
      const socialData = await getSetting("social_links");
      
      setHeroSettings(heroData);
      setSocialSettings(socialData);

      if (heroData?.value) {
        setHeroForm({
          title: heroData.value.title || "",
          subtitle: heroData.value.subtitle || "",
        });
      }

      if (socialData?.value) {
        setSocialForm({
          linkedin: socialData.value.linkedin || "",
          github: socialData.value.github || "",
          instagram: socialData.value.instagram || "",
          youtube: socialData.value.youtube || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateSetting("hero", heroForm);
      toast.success("Hero settings updated successfully");
      await loadSettings();
    } catch (error) {
      toast.error("Failed to save hero settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateSetting("social_links", socialForm);
      toast.success("Social links updated successfully");
      await loadSettings();
    } catch (error) {
      toast.error("Failed to save social links");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your site-wide settings</p>
      </div>

      {/* Hero Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Hero Section</h3>
        <form onSubmit={handleHeroSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Hero Title
            </label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Welcome to SyedCodes.UI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Hero Subtitle
            </label>
            <textarea
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Crafting luxury modern layouts, responsive web applications, and digital experiences that leave a lasting impression."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Hero Settings"}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Social Links Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold mb-6">Social Links</h3>
        <form onSubmit={handleSocialSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={socialForm.linkedin}
              onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={socialForm.github}
              onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://github.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Instagram URL
            </label>
            <input
              type="url"
              value={socialForm.instagram}
              onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://instagram.com/yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              YouTube URL
            </label>
            <input
              type="url"
              value={socialForm.youtube}
              onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Social Links"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
