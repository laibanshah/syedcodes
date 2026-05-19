"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, FolderOpen, Briefcase, User, Link, Settings as SettingsIcon, LogOut } from "lucide-react";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ServicesTab from "@/components/admin/ServicesTab";
import AboutTab from "@/components/admin/AboutTab";
import ContactTab from "@/components/admin/ContactTab";
import SettingsTab from "@/components/admin/SettingsTab";

type TabType = "projects" | "services" | "about" | "contact" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("projects");

  const tabs = [
    { id: "projects" as TabType, label: "Projects", icon: <FolderOpen className="w-5 h-5" /> },
    { id: "services" as TabType, label: "Services", icon: <Briefcase className="w-5 h-5" /> },
    { id: "about" as TabType, label: "About", icon: <User className="w-5 h-5" /> },
    { id: "contact" as TabType, label: "Contact", icon: <Link className="w-5 h-5" /> },
    { id: "settings" as TabType, label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
              </div>
            </div>
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Exit Admin
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "projects" && <ProjectsTab />}
              {activeTab === "services" && <ServicesTab />}
              {activeTab === "about" && <AboutTab />}
              {activeTab === "contact" && <ContactTab />}
              {activeTab === "settings" && <SettingsTab />}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
