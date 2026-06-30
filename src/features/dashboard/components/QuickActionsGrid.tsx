"use client";

import React from "react";
import { UserPlus, Sparkles, UploadCloud, FileText, Calendar, Receipt, ShieldAlert, BookOpen } from "lucide-react";

interface QuickActionsGridProps {
  onTriggerQuickAction: (actionKey: string) => void;
  reduceMotion?: boolean;
}

export default function QuickActionsGrid({
  onTriggerQuickAction,
  reduceMotion = false,
}: QuickActionsGridProps) {
  const actions = [
    {
      key: "new-patient",
      label: "New Patient Case",
      description: "Register patient case",
      icon: UserPlus,
      color: "from-blue-500 to-indigo-605",
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
      color: "from-indigo-505 to-violet-500",
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
      color: "from-rose-500 to-red-650",
      shadow: "shadow-rose-100 dark:shadow-none",
    },
    {
      key: "knowledge-editor",
      label: "Knowledge Editor",
      description: "Materia Medica KMS",
      icon: BookOpen,
      color: "from-violet-500 to-fuchsia-600",
      shadow: "shadow-violet-100 dark:shadow-none",
    },
  ];

  return (
    <div className="space-y-3 select-none">
      <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-500 px-1">
        Clinical Shortcuts & Quick Actions
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.key}
              onClick={() => onTriggerQuickAction(act.key)}
              className={`group p-4 bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-[20px] text-left hover:border-slate-350 dark:hover:border-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none flex flex-col justify-between gap-4 transition-all ${
                reduceMotion ? "" : "active:scale-98"
              }`}
            >
              {/* Icon Container with Gradient */}
              <div 
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${act.color} text-white flex items-center justify-center shadow-md ${act.shadow} ${
                  reduceMotion ? "" : "group-hover:scale-105 duration-200"
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-850 dark:text-slate-100 group-hover:text-teal-650 dark:group-hover:text-teal-400 transition-colors">
                  {act.label}
                </div>
                <div className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug font-medium">
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
