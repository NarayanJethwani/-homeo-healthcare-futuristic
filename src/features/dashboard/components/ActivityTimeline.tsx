"use client";

import React, { useMemo } from "react";
import { History, FileText, FileSpreadsheet, UserCheck, ShieldCheck, CreditCard, Sparkles, AlertTriangle, RefreshCw, ClipboardList } from "lucide-react";

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
  patients?: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

export default function ActivityTimeline({
  patients = [],
  onSelectPatient,
  setActiveTab,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: ActivityTimelineProps) {
  const timelineData: TimelineItem[] = useMemo(() => {
    if (patients.length === 0) return [];

    const list: TimelineItem[] = [];

    // Map live activities based on patients
    patients.forEach((pat, idx) => {
      const pId = pat.id;
      const name = pat.name;

      if (idx === 0) {
        list.push({
          id: `timeline-checkin-${pId}`,
          icon: UserCheck,
          iconColor: "text-teal-650 bg-teal-50 dark:bg-teal-950/20",
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
          iconColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20",
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
          iconColor: "text-teal-605 bg-teal-50 dark:bg-teal-950/20",
          title: "Prescription compound generated",
          time: "1 day ago",
          patientName: name,
          patientId: pId,
          actionLabel: "Open Treatment Plan",
          actionTab: "treatment-planner",
        });
      }
    });

    if (list.length < 3) {
      list.push({
        id: "timeline-fallback-1",
        icon: CreditCard,
        iconColor: "text-sky-600 bg-sky-50 dark:bg-sky-950/20",
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
        iconColor: "text-amber-605 bg-amber-50 dark:bg-amber-955/20",
        title: "AI CDSS advisory recommendation generated",
        time: "2 days ago",
        patientName: "Meera Jethwani",
        patientId: "mock-meera",
        actionLabel: "Review Recommendation",
        actionTab: "dashboard",
      });
      list.push({
        id: "timeline-fallback-3",
        icon: FileSpreadsheet,
        iconColor: "text-rose-650 bg-rose-50 dark:bg-rose-955/20",
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

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="pl-6 space-y-4 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-850" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center justify-between p-3 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-850 rounded" />
                <div className="h-2.5 w-1/2 bg-slate-150 dark:bg-slate-800 rounded" />
              </div>
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-850 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-650" />
          <span className="text-xs font-bold text-rose-850 dark:text-rose-350">
            Error loading timeline: {error}
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 select-text">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <History className="w-4 h-4 text-teal-500" />
          <span>Recent Clinical Timeline</span>
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          Chronological Audit Feed
        </span>
      </div>

      {/* Timeline Node Tree */}
      {timelineData.length > 0 ? (
        <div className="relative pl-6 space-y-5">
          {/* Central connecting line */}
          <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />

          {timelineData.map((item) => {
            const Icon = item.icon;

            return (
              <div 
                key={item.id} 
                className={`relative flex flex-col gap-1.5 ${
                  reduceMotion ? "" : "animate-in fade-in duration-200"
                }`}
              >
                {/* Timeline Icon Node */}
                <div className={`absolute -left-6 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 ${item.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Text content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pl-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-bold text-slate-850 dark:text-slate-100 leading-snug">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-normal">
                      Patient: <span className="font-bold text-slate-700 dark:text-slate-350">{item.patientName}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3 select-none">
                    <span className="text-[9.5px] text-slate-400 dark:text-slate-550 font-mono font-medium block">
                      {item.time}
                    </span>
                    {item.actionLabel && (
                      <button
                        onClick={() => handleAction(item)}
                        className={`px-2 py-0.5 bg-slate-50 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-955/20 text-slate-550 dark:text-slate-400 hover:text-teal-650 dark:hover:text-teal-400 rounded-lg text-[9px] font-bold border border-slate-200 dark:border-slate-750 cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-500 outline-none transition-all ${
                          reduceMotion ? "" : "active:scale-98"
                        }`}
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
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 select-none">
          <ClipboardList className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">No activity registered today</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-xs mx-auto">
            Audit logs and intake events will begin populating here as actions occur.
          </p>
        </div>
      )}
    </div>
  );
}
