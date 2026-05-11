"use client";

import { useState } from "react";
import { Lock, Plus, Edit, Trash, LogOut } from "lucide-react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") { // Simple placeholder auth
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-3xl border border-border shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-heading text-foreground text-center mb-6 font-bold">Admin Authorization</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-brand-blue-dark transition-colors shadow-lg shadow-primary/20"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Navbar */}
      <nav className="bg-card border-b border-border py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">SyedCodes.UI Dashboard</div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-heading font-bold">Manage Projects</h2>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-brand-blue-dark transition-colors shadow-lg shadow-primary/20">
            <Plus size={18} /> Add New Project
          </button>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center hover:bg-secondary/50 transition-colors">
            <div>
              <h3 className="text-xl font-bold">The RAW SOCIETY</h3>
              <p className="text-muted-foreground text-sm mt-1">https://rawsociety.netlify.app/</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-secondary text-muted-foreground hover:text-primary rounded-lg transition-colors">
                <Edit size={18} />
              </button>
              <button className="p-2 bg-secondary text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                <Trash size={18} />
              </button>
            </div>
          </div>
          <div className="p-6 border-b border-border flex justify-between items-center hover:bg-secondary/50 transition-colors">
            <div>
              <h3 className="text-xl font-bold">SOUL METAPOETRY</h3>
              <p className="text-muted-foreground text-sm mt-1">https://soulmp.netlify.app/about</p>
            </div>
            <div className="flex gap-3">
              <button className="p-2 bg-secondary text-muted-foreground hover:text-primary rounded-lg transition-colors">
                <Edit size={18} />
              </button>
              <button className="p-2 bg-secondary text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                <Trash size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
