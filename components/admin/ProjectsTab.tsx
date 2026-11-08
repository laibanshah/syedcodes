"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ExternalLink, Upload, X } from "lucide-react";
import { Project } from "@/lib/types";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/admin-data";
import { uploadPublicFile, removePublicFile, formatBytes, type UploadProgress } from "@/lib/admin-client";
import { toast } from "sonner";
import { useConfirm, useConfirmDiscard, useUnsavedGuard, isDirty } from "./guard";
import { UploadBar } from "./ui";

const emptyForm = { title: "", description: "", link: "", tech_stack: "", featured: false };

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [formData, setFormData] = useState(emptyForm);
  const [baseline, setBaseline] = useState(emptyForm);
  const [baselineImage, setBaselineImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const confirm = useConfirm();
  const confirmDiscard = useConfirmDiscard();

  useUnsavedGuard(showForm && (isDirty(formData, baseline) || imagePreview !== baselineImage));

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to load projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // The preview is cleared when the admin removes the image.
      let imageUrl = imagePreview ? editingProject?.image_url || null : null;
      const oldUrl = editingProject?.image_url || null;

      if (imageFile) {
        // Straight from the browser to Supabase Storage; big files are resumable.
        imageUrl = await uploadPublicFile("project-images", imageFile, editingProject?.id || "project", {
          onProgress: setProgress,
          signal: controller.signal,
        });
      }

      const techStackArray = formData.tech_stack.split(",").map(t => t.trim()).filter(t => t);

      if (editingProject) {
        await updateProject(editingProject.id, {
          title: formData.title,
          description: formData.description,
          link: formData.link,
          image_url: imageUrl,
          tech_stack: techStackArray,
          featured: formData.featured,
        });
        toast.success("Project updated successfully");
      } else {
        await createProject({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          image_url: imageUrl,
          tech_stack: techStackArray,
          featured: formData.featured,
        });
        toast.success("Project created successfully");
      }

      // Remove the previous image only after the project row points at the new state.
      if (oldUrl && oldUrl !== imageUrl) await removePublicFile("project-images", oldUrl);

      resetForm();
      loadProjects();
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") toast.message("Upload cancelled");
      else toast.error(`Failed to save project${error instanceof Error ? `: ${error.message}` : ""}`);
      console.error(error);
    } finally {
      setSaving(false);
      setProgress(null);
      abortRef.current = null;
    }
  };

  const openForm = async (project: Project | null) => {
    if (showForm && !(await confirmDiscard())) return;
    const next = project
      ? {
          title: project.title,
          description: project.description,
          link: project.link,
          tech_stack: (project.tech_stack ?? []).join(", "),
          featured: project.featured || false,
        }
      : emptyForm;
    setEditingProject(project);
    setFormData(next);
    setBaseline(next);
    setImageFile(null);
    setImagePreview(project?.image_url || "");
    setBaselineImage(project?.image_url || "");
    setShowForm(true);
  };

  const closeForm = async () => {
    if (!(await confirmDiscard())) return;
    resetForm();
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const ok = await confirm({
      title: "Delete this project?",
      message: "The project and its image will be removed from the website. This can't be undone.",
      confirmLabel: "Delete project",
      destructive: true,
    });
    if (!ok) return;

    try {
      if (imageUrl) {
        await removePublicFile("project-images", imageUrl);
      }
      await deleteProject(id);
      toast.success("Project deleted successfully");
      loadProjects();
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setBaseline(emptyForm);
    setBaselineImage("");
    setEditingProject(null);
    setImageFile(null);
    setImagePreview("");
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => openForm(null)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
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
              {editingProject ? "Edit Project" : "New Project"}
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
                Project Title
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
                Project Link
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="React, Next.js, TypeScript"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <label htmlFor="featured" className="text-sm font-medium text-foreground">
                Featured Project (will appear in homepage carousel)
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Image
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-4 sm:p-8 text-center hover:border-primary/50 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    {imageFile && (
                      <p className="text-xs text-muted-foreground mb-2">{imageFile.name} · {formatBytes(imageFile.size)}</p>
                    )}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("");
                      }}
                      className="absolute top-2 right-2 p-2 bg-background rounded-full shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop an image, or click to select
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                      Choose File
                    </label>
                    <p className="text-xs text-muted-foreground mt-3">No app-side size limit — large photos are fine.</p>
                  </div>
                )}
              </div>
            </div>

            {progress && <UploadBar percent={progress.percent} retrying={progress.retrying} label="Uploading image" />}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 disabled:opacity-50 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                {saving ? (progress ? "Uploading…" : "Saving…") : editingProject ? "Update Project" : "Create Project"}
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
        {projects.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">No projects yet. Add your first project!</p>
          </div>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {project.image_url && (
                  <div className="w-full sm:w-48 h-44 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-secondary">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                    {project.featured && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-secondary rounded-full text-xs text-primary font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </a>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => openForm(project)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id, project.image_url)}
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
