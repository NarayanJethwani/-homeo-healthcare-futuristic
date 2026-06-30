"use client";

import React, { useMemo } from "react";
import { History, FileText, FileSpreadsheet, User, UserCheck, ShieldCheck, CreditCard, Sparkles } from "lucide-react";

interface TimelineItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  title: string;
  time: string;
  patientName: string;
  patientId: string;
  actionLabel?: string;
  actionTab?: string;
}

interface ActivityTimelineProps {
  patients: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
}

export default function ActivityTimeline({
  patients,
  onSelectPatient,
  setActiveTab,
}: ActivityTimelineProps) {
  const timelineData: TimelineItem[] = useMemo(() => {
    const list: TimelineItem[] = [];

    // Map live activities based on patients
    patients.forEach((pat, idx) => {
      const pId = pat.id;
      const name = pat.name;

      if (idx === 0) {
        list.push({
          id: `timeline-checkin-${pId}`,
          icon: UserCheck,
          iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
          title: "Patient checked in for appointment",
          time: "2 hours ago",
          patientName: name,
          patientId: pId,
          actionLabel: "Open Case",
          actionTab: "patients",
        });
      } else if (idx === 1) {
        list.push({
          id: `timeline-report-${pId}`,
          icon: FileText,
          iconColor: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
          title: "Diagnostic blood report uploaded",
          time: "4 hours ago",
          patientName: name,
          patientId: pId,
          actionLabel: "Open Report Analyzer",
          actionTab: "analyzer",
        });
      } else if (idx === 2) {
        list.push({
          id: `timeline-presc-${pId}`,
          icon: ShieldCheck,
          iconColor: "text-teal-500 bg-teal-50 dark:bg-teal-950/20",
          title: "Prescription compound generated",
          time: "1 day ago",
          patientName: name,
          patientId: pId,
          actionLabel: "Open Treatment Plan",
          actionTab: "treatment-planner",
        });
      }
    });

    // Fallbacks if data is small
    if (list.length < 3) {
      list.push({
        id: "timeline-fallback-1",
        icon: CreditCard,
        iconColor: "text-sky-500 bg-sky-50 dark:bg-sky-950/20",
        title: "Invoice #INV-2026-004 paid successfully",
        time: "1 day ago",
        patientName: "Baby Kabir",
        patientId: "mock-kabir",
        actionLabel: "View Billing",
        actionTab: "treatment-planner",
      });
      list.push({
        id: "timeline-fallback-2",
        icon: Sparkles,
        iconColor: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
        title: "AI clinical recommendation generated",
        time: "2 days ago",
        patientName: "Meera Jethwani",
        patientId: "mock-meera",
        actionLabel: "Review Recommendations",
        actionTab: "dashboard",
      });
      list.push({
        id: "timeline-fallback-3",
        icon: FileSpreadsheet,
        iconColor: "text-rose-500 bg-rose-50 dark:bg-rose-950/20",
        title: "Case record details synchronized to Firestore",
        time: "3 days ago",
        patientName: "Rahul Sharma",
        patientId: "mock-rahul",
        actionLabel: "Open Patients",
        actionTab: "patients",
      });
    }

    return list;
  }, [patients]);

  const handleAction = (item: TimelineItem) => {
    if (item.actionTab) {
      onSelectPatient(item.patientId);
      setActiveTab(item.actionTab);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 select-text">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-500" />
          <span>Recent Clinical Timeline</span>
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold">
          Chronological Audit Feed
        </span>
      </div>

      {/* Timeline Node Tree */}
      <div className="relative pl-6 space-y-5">
        {/* Central connecting line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

        {timelineData.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative flex flex-col gap-1.5 animate-in fade-in duration-200">
              {/* Timeline Icon Node */}
              <div className={`absolute -left-6 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 ${item.iconColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Text content */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pl-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-slate-850 dark:text-slate-100 leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal">
                    Patient: <span className="font-bold text-slate-700 dark:text-slate-350">{item.patientName}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-[9.5px] text-slate-400 dark:text-slate-550 font-mono font-medium block">
                    {item.time}
                  </span>
                  {item.actionLabel && (
                    <button
                      onClick={() => handleAction(item)}
                      className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-550 dark:text-slate-400 hover:text-slate-700 rounded-lg text-[9px] font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {item.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
