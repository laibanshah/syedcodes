"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { ContactLink } from "@/lib/supabase";
import { getContactLinks, createContactLink, updateContactLink, deleteContactLink } from "@/lib/db";
import { toast } from "sonner";

const iconOptions = [
  { name: "FaLinkedin", label: "LinkedIn" },
  { name: "FaGithub", label: "GitHub" },
  { name: "FaInstagram", label: "Instagram" },
  { name: "FaYoutube", label: "YouTube" },
  { name: "FaWhatsapp", label: "WhatsApp" },
  { name: "Mail", label: "Email" },
  { name: "Twitter", label: "Twitter" },
  { name: "FaFacebook", label: "Facebook" },
];

export default function ContactTab() {
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<ContactLink | null>(null);

  const [formData, setFormData] = useState({
    platform: "",
    url: "",
    icon_name: "FaLinkedin",
    order_index: 0,
  });

  useEffect(() => {
    loadContactLinks();
  }, []);

  const loadContactLinks = async () => {
    try {
      const data = await getContactLinks();
      setContactLinks(data);
    } catch (error) {
      toast.error("Failed to load contact links");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLink) {
        await updateContactLink(editingLink.id, formData);
        toast.success("Contact link updated successfully");
      } else {
        await createContactLink({
          ...formData,
          order_index: contactLinks.length,
        });
        toast.success("Contact link created successfully");
      }

      resetForm();
      loadContactLinks();
    } catch (error) {
      toast.error("Failed to save contact link");
      console.error(error);
    }
  };

  const handleEdit = (link: ContactLink) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon_name: link.icon_name,
      order_index: link.order_index,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact link?")) return;

    try {
      await deleteContactLink(id);
      toast.success("Contact link deleted successfully");
      loadContactLinks();
    } catch (error) {
      toast.error("Failed to delete contact link");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({ platform: "", url: "", icon_name: "FaLinkedin", order_index: 0 });
    setEditingLink(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading contact links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Links</h2>
          <p className="text-muted-foreground">Manage your social media and contact links</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Link
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {editingLink ? "Edit Contact Link" : "New Contact Link"}
            </h3>
            <button
              onClick={resetForm}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Platform Name
              </label>
              <input
                type="text"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="LinkedIn"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Icon
              </label>
              <select
                value={formData.icon_name}
                onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {iconOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                {editingLink ? "Update Link" : "Create Link"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {contactLinks.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">No contact links yet. Add your first link!</p>
          </div>
        ) : (
          contactLinks.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-xl">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{link.platform}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {link.url}
                  </a>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Icon: {link.icon_name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
