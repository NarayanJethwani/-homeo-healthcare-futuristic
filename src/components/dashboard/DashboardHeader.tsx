"use client";

import React, { useState } from "react";
import {
  Search, Plus, Bell, MessageSquare, User, LogOut, Settings, HelpCircle,
  Activity, Sparkles, FileText, IndianRupee, Send
} from "lucide-react";

interface DashboardHeaderProps {
  session: any;
  handleLogout: () => void;
  onTriggerQuickAction: (actionKey: string) => void;
  onOpenSearch: () => void;
  onOpenDisplayDrawer: () => void;
}

export default function DashboardHeader({
  session,
  handleLogout,
  onTriggerQuickAction,
  onOpenSearch,
  onOpenDisplayDrawer,
}: DashboardHeaderProps) {
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Mock message & notifications count
  const unreadMessages = 3;
  const alertCount = 2;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-3.5 flex items-center justify-between shadow-xs select-none">
      
      {/* Search Input Trigger (Linear style ⌘K) */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div
          onClick={onOpenSearch}
          className="flex items-center justify-between w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-750/80 rounded-xl text-slate-450 dark:text-slate-500 cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="text-xs font-sans">Search patient, remedy...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-[9px] font-mono text-slate-450 shadow-xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Actions & Profile (Right side) */}
      <div className="flex items-center gap-4">
        {/* Quick Actions Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            onBlur={() => setTimeout(() => setIsQuickActionsOpen(false), 200)}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-xs shadow-emerald-100 dark:shadow-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Action</span>
          </button>

          {isQuickActionsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 animate-in slide-in-from-top-1 duration-150 flex flex-col gap-1">
              {[
                { key: "new-patient", label: "New Patient", icon: User },
                { key: "ai-intake", label: "AI Intake", icon: Sparkles },
                { key: "upload-report", label: "Upload Report", icon: FileText },
                { key: "create-prescription", label: "Create Prescription", icon: Sparkles },
                { key: "schedule-appointment", label: "Schedule Appointment", icon: Send },
                { key: "generate-invoice", label: "Generate Invoice", icon: IndianRupee },
                { key: "emergency-case", label: "Emergency Case", icon: Bell },
              ].map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.key}
                    onClick={() => {
                      onTriggerQuickAction(act.key);
                      setIsQuickActionsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer border-none bg-transparent flex items-center gap-2.5"
                  >
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{act.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Separator line */}
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Message Notifications */}
        <button
          onClick={() => onTriggerQuickAction("message-center")}
          className="p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent relative"
          title="Unread messages"
        >
          <MessageSquare className="w-4.5 h-4.5" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900" />
          )}
        </button>

        {/* Clinical alerts notification bell */}
        <button
          onClick={() => onTriggerQuickAction("alerts-center")}
          className="p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent relative"
          title="Clinical Alerts"
        >
          <Bell className="w-4.5 h-4.5" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 shrink-0 breathe-slow" />
          )}
        </button>

        {/* Accessibility controls drawer trigger */}
        <button
          onClick={onOpenDisplayDrawer}
          className="p-2 rounded-xl text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border-none bg-transparent"
          title="Display Accessibility Settings"
        >
          <Settings className="w-4.5 h-4.5 animate-hover-spin" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-855 border-none bg-transparent cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-350 flex items-center justify-center text-xs font-bold font-serif shadow-xs">
              {session?.name ? session.name.substring(0, 2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 animate-in slide-in-from-top-1 duration-150 flex flex-col gap-1 text-slate-800 dark:text-slate-200">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-850">
                <div className="text-xs font-bold truncate">{session?.name || "Clinician"}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-550 truncate mt-0.5">{session?.email || "doctor@clinic.com"}</div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:text-slate-350 dark:hover:text-rose-400 transition-all cursor-pointer border-none bg-transparent flex items-center gap-2.5"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
