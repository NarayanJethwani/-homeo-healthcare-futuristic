"use client";

import React from "react";
import { UserPlus, Sparkles, UploadCloud, FileText, Calendar, Receipt, ShieldAlert } from "lucide-react";

interface QuickActionsGridProps {
  onTriggerQuickAction: (actionKey: string) => void;
}

export default function QuickActionsGrid({ onTriggerQuickAction }: QuickActionsGridProps) {
  const actions = [
    {
      key: "new-patient",
      label: "New Patient Case",
      description: "Register patient case",
      icon: UserPlus,
      color: "from-blue-500 to-indigo-650",
      shadow: "shadow-blue-100 dark:shadow-none",
    },
    {
      key: "ai-intake",
      label: "Start AI Intake",
      description: "Trigger guided intake",
      icon: Sparkles,
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-100 dark:shadow-none",
    },
    {
      key: "upload-report",
      label: "Upload Report",
      description: "Ingest lab diagnostic PDF",
      icon: UploadCloud,
      color: "from-indigo-500 to-violet-500",
      shadow: "shadow-indigo-100 dark:shadow-none",
    },
    {
      key: "create-prescription",
      label: "Create Prescription",
      description: "Compound remedies planner",
      icon: FileText,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-100 dark:shadow-none",
    },
    {
      key: "schedule-appointment",
      label: "Schedule Visit",
      description: "Open appointment outreach",
      icon: Calendar,
      color: "from-sky-500 to-blue-500",
      shadow: "shadow-sky-100 dark:shadow-none",
    },
    {
      key: "generate-invoice",
      label: "Generate Invoice",
      description: "Compile billing breakdown",
      icon: Receipt,
      color: "from-teal-500 to-emerald-600",
      shadow: "shadow-teal-100 dark:shadow-none",
    },
    {
      key: "emergency-case",
      label: "Emergency Case",
      description: "Urgent case registration",
      icon: ShieldAlert,
      color: "from-rose-500 to-red-600",
      shadow: "shadow-rose-100 dark:shadow-none",
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">
        Clinical Shortcuts & Quick Actions
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.key}
              onClick={() => onTriggerQuickAction(act.key)}
              className="group p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl text-left hover:border-slate-300 dark:hover:border-slate-700 active:scale-98 transition-all flex flex-col justify-between gap-4 cursor-pointer"
            >
              {/* Icon Container with Gradient */}
              <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${act.color} text-white flex items-center justify-center shadow-md ${act.shadow} group-hover:scale-105 transition-transform duration-200`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-850 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {act.label}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                  {act.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
