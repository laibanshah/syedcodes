"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload, Link as LinkIcon, FileText, Loader2, Edit, Trash2, X } from "lucide-react";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Resource = {
  id: string;
  title: string;
  description: string;
  resource_type: "link" | "file";
  url: string | null;
  file_path: string | null;
  created_at: string;
};

export default function ResourcesTab() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceType, setResourceType] = useState<"link" | "file">("link");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setIsLoadingResources(true);
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setIsLoadingResources(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      let filePath = null;

      if (resourceType === "file" && file) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const uploadPath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("resources")
          .upload(uploadPath, file);

        if (uploadError) throw uploadError;
        filePath = uploadPath;
      }

      if (editingId) {
        // Find existing record to preserve file_path if a new file isn't uploaded
        const existingResource = resources.find(r => r.id === editingId);
        const updatedFilePath = filePath || (resourceType === "file" ? existingResource?.file_path : null);

        const { error: updateError } = await supabase
          .from("resources")
          .update({
            title,
            description,
            resource_type: resourceType,
            url: resourceType === "link" ? url : null,
            file_path: updatedFilePath,
          })
          .eq("id", editingId);

        if (updateError) throw updateError;
        setMessage({ type: "success", text: "Resource updated successfully!" });
      } else {
        const { error: dbError } = await supabase.from("resources").insert({
          title,
          description,
          resource_type: resourceType,
          url: resourceType === "link" ? url : null,
          file_path: filePath,
        });

        if (dbError) throw dbError;
        setMessage({ type: "success", text: "Resource added successfully!" });
      }
      
      resetForm();
      fetchResources();
      
    } catch (error: any) {
      console.error(error);
      setMessage({ type: "error", text: error.message || "Failed to save resource." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setTitle(resource.title);
    setDescription(resource.description || "");
    setResourceType(resource.resource_type);
    setUrl(resource.url || "");
    setFile(null); // Clear file selection
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, filePath: string | null) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      if (filePath) {
        await supabase.storage.from("resources").remove([filePath]);
      }
      const { error } = await supabase.from("resources").delete().eq("id", id);
      if (error) throw error;
      
      setResources(resources.filter(r => r.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Failed to delete resource:", error);
      alert("Failed to delete resource.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    setResourceType("link");
    setMessage(null);
  };

  return (
    <div className="min-h-screen p-8 md:p-24 max-w-4xl mx-auto space-y-12">
      <div>
        <div className="flex items-center gap-4 mb-8 justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            {editingId ? "Edit Resource" : "Add Resource"}
          </h1>
          {editingId && (
            <button onClick={resetForm} className="text-sm border border-white/10 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Cancel Edit
            </button>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-8 ${message.type === 'success' ? 'bg-green-950/30 text-green-400 border border-green-500/30' : 'bg-red-950/30 text-red-400 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-2xl border">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="E.g., Complete UI Kit 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="A brief description of what this resource contains..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Resource Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setResourceType("link")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border transition-all ${resourceType === 'link' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-muted'}`}
              >
                <LinkIcon className="w-5 h-5" /> External Link
              </button>
              <button
                type="button"
                onClick={() => setResourceType("file")}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl border transition-all ${resourceType === 'file' ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-muted'}`}
              >
                <FileText className="w-5 h-5" /> Downloadable File
              </button>
            </div>
          </div>

          {resourceType === "link" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <input
                type="url"
                required={resourceType === "link"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="https://..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload File {editingId && "(Leave empty to keep existing)"}</label>
              <input
                type="file"
                required={resourceType === "file" && !editingId}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : editingId ? (
              <Edit className="w-5 h-5 mr-2" />
            ) : (
              <Upload className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? (editingId ? "Updating..." : "Uploading...") : (editingId ? "Update Resource" : "Add Resource")}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6 border-b border-white/10 pb-4">Existing Resources</h2>
        {isLoadingResources ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : resources.length === 0 ? (
          <p className="text-muted-foreground text-center p-8 bg-card rounded-2xl border">No resources found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-card p-5 rounded-2xl border flex flex-col gap-3 group transition-colors hover:border-white/20">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-primary">
                    {resource.resource_type === 'link' ? <LinkIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    <span className="text-xs font-semibold uppercase tracking-wider">{resource.resource_type}</span>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(resource)} className="p-1.5 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(resource.id, resource.file_path)} className="p-1.5 hover:bg-red-500/20 rounded-md text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{resource.title}</h3>
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
