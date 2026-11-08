"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Service } from "@/lib/types";
import { getServices, createService, updateService, deleteService } from "@/lib/admin-data";
import { toast } from "sonner";
import { useConfirm, useConfirmDiscard, useUnsavedGuard, isDirty } from "./guard";

const iconOptions = [
  { name: "Globe", label: "Globe" },
  { name: "Monitor", label: "Monitor" },
  { name: "Server", label: "Server" },
  { name: "Lock", label: "Lock" },
  { name: "PenTool", label: "Pen Tool" },
  { name: "Briefcase", label: "Briefcase" },
  { name: "Code", label: "Code" },
  { name: "Database", label: "Database" },
  { name: "Smartphone", label: "Smartphone" },
  { name: "Layout", label: "Layout" },
];

const emptyForm = { title: "", description: "", icon_name: "Globe", order_index: 0 };

export default function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState(emptyForm);
  const [baseline, setBaseline] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const confirm = useConfirm();
  const confirmDiscard = useConfirmDiscard();

  useUnsavedGuard(showForm && isDirty(formData, baseline));

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingService) {
        await updateService(editingService.id, formData);
        toast.success("Service updated successfully");
      } else {
        await createService({
          ...formData,
          order_index: services.length,
        });
        toast.success("Service created successfully");
      }

      resetForm();
      loadServices();
    } catch (error) {
      toast.error(`Failed to save service${error instanceof Error ? `: ${error.message}` : ""}`);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const openForm = async (service: Service | null) => {
    if (showForm && !(await confirmDiscard())) return;
    const next = service
      ? {
          title: service.title,
          description: service.description,
          icon_name: service.icon_name,
          order_index: service.order_index,
        }
      : emptyForm;
    setEditingService(service);
    setFormData(next);
    setBaseline(next);
    setShowForm(true);
  };

  const closeForm = async () => {
    if (!(await confirmDiscard())) return;
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete this service?",
      message: "It will be removed from the website. This can't be undone.",
      confirmLabel: "Delete service",
      destructive: true,
    });
    if (!ok) return;

    try {
      await deleteService(id);
      toast.success("Service deleted successfully");
      loadServices();
    } catch (error) {
      toast.error("Failed to delete service");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setBaseline(emptyForm);
    setEditingService(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Services</h2>
          <p className="text-muted-foreground">Manage your services offerings</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-4 sm:p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {editingService ? "Edit Service" : "New Service"}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close form"
              className="p-2.5 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Service Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
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

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 disabled:opacity-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                {editingService ? "Update Service" : "Create Service"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="px-6 py-3 rounded-xl border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">No services yet. Add your first service!</p>
          </div>
        ) : (
          services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0 break-words">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="mt-2 text-sm text-primary font-medium">
                    Icon: {service.icon_name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openForm(service)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
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
