"use client";

import React, { useState } from "react";
import {
  Gauge, Sparkles, Users, Compass, IndianRupee, Layers, FileText,
  Activity, Cpu, Network, Award, Send, UserPlus, Menu, ChevronLeft, ChevronRight, Star, Settings
} from "lucide-react";

import { normalizeRole } from "@/lib/security/rbac";

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tabId: any) => void;
  session: any;
  favorites: string[];
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  handleSubTabClick: (tabId: any, subId: string) => void;
}

// Icon mappings based on active tab IDs
const TABS_METADATA: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; gradient: string; shadow: string; adminOnly?: boolean }> = {
  dashboard: { label: "Dashboard", icon: Gauge, gradient: "from-teal-500 to-emerald-500", shadow: "shadow-[0_4px_12px_rgba(20,184,166,0.3)]" },
  intake: { label: "AI Intake", icon: Sparkles, gradient: "from-amber-500 to-orange-500", shadow: "shadow-[0_4px_12px_rgba(245,158,11,0.3)]" },
  patients: { label: "Patients", icon: Users, gradient: "from-sky-500 to-blue-500", shadow: "shadow-[0_4px_12px_rgba(14,165,233,0.3)]" },
  diagnostics: { label: "Diagnostics", icon: Compass, gradient: "from-emerald-600 to-green-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
  "treatment-planner": { label: "Treatment Planner", icon: IndianRupee, gradient: "from-emerald-600 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
  "diet-lifestyle": { label: "Diet & Lifestyle", icon: Layers, gradient: "from-rose-500 to-pink-500", shadow: "shadow-[0_4px_12px_rgba(244,63,94,0.3)]" },
  analyzer: { label: "Report Analyzer", icon: FileText, gradient: "from-indigo-500 to-violet-500", shadow: "shadow-[0_4px_12px_rgba(99,102,241,0.3)]" },
  cie: { label: "Clinical OS", icon: Activity, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(16,185,129,0.3)]" },
  "ai-router": { label: "AI Router Settings", icon: Cpu, gradient: "from-slate-700 to-slate-800", shadow: "shadow-[0_4px_12px_rgba(71,85,105,0.3)]" },
  "nexus-atlas": { label: "Nexus Atlas", icon: Network, gradient: "from-violet-600 to-fuchsia-600", shadow: "shadow-[0_4px_12px_rgba(139,92,246,0.3)]" },
  "medical-academy": { label: "Medical Academy", icon: Award, gradient: "from-blue-600 to-indigo-600", shadow: "shadow-[0_4px_12px_rgba(37,99,235,0.3)]" },
  "learning-hub": { label: "Learning Hub", icon: Award, gradient: "from-fuchsia-500 to-purple-600", shadow: "shadow-[0_4px_12px_rgba(217,70,239,0.3)]" },
  communication: { label: "Communications", icon: Send, gradient: "from-cyan-500 to-teal-500", shadow: "shadow-[0_4px_12px_rgba(6,182,212,0.3)]" },
  team: { label: "Manage Doctors", icon: UserPlus, gradient: "from-violet-600 to-purple-600", shadow: "shadow-[0_4px_12px_rgba(124,58,237,0.3)]", adminOnly: true },
  users: { label: "Practitioners", icon: UserPlus, gradient: "from-blue-600 to-indigo-600", shadow: "shadow-[0_4px_12px_rgba(37,99,235,0.3)]", adminOnly: true },
  account: { label: "Account Settings", icon: Settings, gradient: "from-slate-600 to-slate-700", shadow: "shadow-[0_4px_12px_rgba(100,116,139,0.3)]" },
  "health-intelligence": { label: "Public Intake", icon: Activity, gradient: "from-teal-600 to-cyan-600", shadow: "shadow-[0_4px_12px_rgba(13,148,136,0.3)]" },
};

const SIDEBAR_GROUPS = [
  {
    name: "Clinical",
    items: ["dashboard", "intake", "patients", "diagnostics", "treatment-planner", "diet-lifestyle"],
  },
  {
    name: "AI",
    items: ["analyzer", "cie", "ai-router"],
  },
  {
    name: "Knowledge",
    items: ["nexus-atlas", "medical-academy", "learning-hub"],
  },
  {
    name: "Administration",
    items: ["communication", "team", "users", "account"],
  },
  {
    name: "Public",
    items: ["health-intelligence"],
  },
];

const SUBTABS_CONFIG: Record<string, Array<{ id: string; label: string }>> = {
  dashboard: [
    { id: "dashboard-metrics", label: "Metrics & Status" },
    { id: "dashboard-queue", label: "Patient Queue" },
    { id: "dashboard-alerts", label: "Clinical Alerts" },
  ],
  intake: [
    { id: "intake-builder", label: "Guided Interview" },
    { id: "live-synthesis", label: "Constitutional Synthesis" },
  ],
  patients: [
    { id: "patients-directory", label: "Search & Registry" },
    { id: "patients-list", label: "Clinical Database" },
  ],
  cie: [
    { id: "cie-cockpit", label: "Cockpit" },
    { id: "cie-intake", label: "Intake Notes" },
    { id: "cie-miasms", label: "Miasms Radar" },
    { id: "cie-reports", label: "Clinical Reports" },
  ],
  "nexus-atlas": [
    { id: "repertory", label: "Repertory" },
    { id: "mind-map", label: "Mind Map" },
    { id: "materia-medica", label: "Materia Medica" },
  ],
};

export default function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  session,
  favorites,
  setFavorites,
  handleSubTabClick,
}: AdminSidebarProps) {
  const [openSubmenuTab, setOpenSubmenuTab] = useState<string | null>(null);
  const isAdmin = session?.role === "admin" || (session?.role && normalizeRole(session.role) === "super-admin");

  const toggleFavorite = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(tabId) ? prev.filter((id) => id !== tabId) : [...prev, tabId]
    );
  };

  const toggleSubmenu = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubmenuTab(openSubmenuTab === tabId ? null : tabId);
  };

  const renderTabItem = (tabId: string) => {
    const meta = TABS_METADATA[tabId];
    if (!meta) return null;
    if (meta.adminOnly && !isAdmin) return null;

    const Icon = meta.icon;
    const isActive = activeTab === tabId;
    const isFavorited = favorites.includes(tabId);
    const subtabs = SUBTABS_CONFIG[tabId] || [];
    const isSubmenuOpen = openSubmenuTab === tabId;

    return (
      <div key={tabId} className="w-full space-y-1">
        <div
          onClick={() => {
            setActiveTab(tabId);
            if (subtabs.length > 0) {
              setOpenSubmenuTab(isSubmenuOpen ? null : tabId);
            }
          }}
          className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
            isActive
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 font-bold border border-emerald-100/50 dark:border-emerald-900/30"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
          }`}
          title={isCollapsed ? meta.label : undefined}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className={`shrink-0 ${isActive ? "text-emerald-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-350"}`}>
              <Icon className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <span className="text-xs tracking-wide truncate">{meta.label}</span>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => toggleFavorite(tabId, e)}
                className={`p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer border-none bg-transparent ${
                  isFavorited ? "text-amber-500 opacity-100" : "text-slate-300 dark:text-slate-650"
                }`}
                title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              >
                <Star className={`w-3.5 h-3.5 ${isFavorited ? "fill-amber-500" : ""}`} />
              </button>
            </div>
          )}
        </div>

        {/* Collapsed floating subtabs tooltip popover or expanded nested list */}
        {!isCollapsed && subtabs.length > 0 && isSubmenuOpen && (
          <div className="pl-8 pr-2 py-1 flex flex-col gap-1 border-l border-slate-100 dark:border-slate-800 ml-5 animate-in slide-in-from-top-1 duration-150">
            {subtabs.map((sub) => (
              <button
                key={sub.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubTabClick(tabId as any, sub.id);
                }}
                className="w-full text-left py-1 px-2 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent border-none cursor-pointer flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Sidebar main body */}
      <aside
        className={`bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none ${
          isCollapsed ? "w-20" : "w-64"
        } hidden md:flex`}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200 dark:shadow-none">
              <Activity className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-serif text-[11px] font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none mb-0.5">
                  Dr. Jethwani's
                </div>
                <div className="font-sans text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold leading-none">
                  Clinical OS™
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer text-slate-400"
              title="Collapse sidebar (Ctrl+[)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable navigation area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Favorites (if any exist and not collapsed) */}
          {!isCollapsed && favorites.length > 0 && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                <span>Favorites</span>
              </div>
              <div className="space-y-1">
                {favorites.map((favId) => renderTabItem(favId))}
              </div>
            </div>
          )}

          {/* Sidebar groups */}
          {SIDEBAR_GROUPS.map((group) => {
            // Check if any item in the group is visible (authorized)
            const visibleItems = group.items.filter((item) => {
              const tabMeta = TABS_METADATA[item];
              if (!tabMeta) return false;
              if (tabMeta.adminOnly && !isAdmin) return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.name} className="space-y-1.5">
                {!isCollapsed && (
                  <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3">
                    {group.name}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => renderTabItem(item))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Toggle (Collapsed mode chevron) */}
        {isCollapsed && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center shrink-0">
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 flex items-center justify-center border-none cursor-pointer text-slate-500"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Mobile navigation sliding drawer or bottom menu fallback */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around py-2 px-4 shadow-[0_-8px_32px_rgba(0,0,0,0.06)]">
        {/* Render 5 core tabs on mobile */}
        {[
          { id: "dashboard", label: "Home", icon: Gauge },
          { id: "intake", label: "Intake", icon: Sparkles },
          { id: "patients", label: "Patients", icon: Users },
          { id: "nexus-atlas", label: "Nexus", icon: Network },
          { id: "cie", label: "ClinicalOS", icon: Activity },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-emerald-500 dark:text-emerald-400 font-bold"
                  : "text-slate-400 hover:text-slate-655"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="text-[9px] font-sans font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
