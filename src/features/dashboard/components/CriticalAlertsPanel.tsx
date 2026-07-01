"use client";

import React, { useState, useMemo } from "react";
import { AlertTriangle, Calendar, Info, X, ArrowRight, ChevronDown, ChevronUp, Pin, VolumeX, CheckCircle, Search, Filter, RefreshCw } from "lucide-react";
import { SmartAlert } from "../types";
import { useClinicalAlerts } from "../hooks/useClinicalAlerts";
import { AlertId } from "../types/branded";

interface CriticalAlertsPanelProps {
  patients?: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  dismissedAlerts?: string[];
  onDismissAlert?: (id: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

export default function CriticalAlertsPanel({
  patients = [],
  onSelectPatient,
  setActiveTab,
  dismissedAlerts = [],
  onDismissAlert,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: CriticalAlertsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "high" | "medium" | "info">("all");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const {
    alerts: baseAlerts,
    activeDismissed,
    togglePin,
    toggleMute,
    acknowledgeAlert,
    dismissAlert,
    acknowledgedAlerts,
  } = useClinicalAlerts(patients, dismissedAlerts);

  const handleDismiss = (id: string) => {
    if (onDismissAlert) {
      onDismissAlert(id);
    } else {
      dismissAlert(id as AlertId);
    }
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(id as AlertId);
  };

  const handleToggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMute(id as AlertId);
  };

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    acknowledgeAlert(id as AlertId);
  };

  const handleOpenPatient = (patientId: string) => {
    onSelectPatient(patientId);
    setActiveTab("patients");
  };

  // Filter alerts by search query, severity, and dismissed status
  const processedAlerts = useMemo(() => {
    return baseAlerts
      .filter((alert) => !activeDismissed.includes(alert.id))
      .filter((alert) => {
        if (severityFilter !== "all" && alert.level !== severityFilter) return false;
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          alert.message.toLowerCase().includes(query) ||
          (alert.patientName && alert.patientName.toLowerCase().includes(query)) ||
          (alert.category && alert.category.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        // Pinned alerts always float to top
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });
  }, [baseAlerts, activeDismissed, severityFilter, searchQuery]);

  const levelCounts = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, info: 0 };
    baseAlerts
      .filter((a) => !activeDismissed.includes(a.id))
      .forEach((a) => {
        if (a.level in counts) counts[a.level as keyof typeof counts]++;
      });
    return counts;
  }, [baseAlerts, activeDismissed]);

  const getAlertStyles = (level: string) => {
    switch (level) {
      case "critical":
        return {
          border: "border-rose-250/60 dark:border-rose-950/20 bg-rose-50/20 dark:bg-rose-955/5",
          text: "text-rose-900 dark:text-rose-400",
          badge: "bg-rose-100 dark:bg-rose-955/30 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30",
          iconColor: "text-rose-600 dark:text-rose-455",
        };
      case "high":
        return {
          border: "border-amber-250/60 dark:border-amber-955/20 bg-amber-50/20 dark:bg-amber-955/5",
          text: "text-amber-900 dark:text-amber-400",
          badge: "bg-amber-100 dark:bg-amber-955/30 text-amber-700 dark:text-amber-450 border border-amber-200/50 dark:border-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-455",
        };
      case "medium":
        return {
          border: "border-sky-200/60 dark:border-sky-950/20 bg-sky-50/15 dark:bg-sky-955/5",
          text: "text-sky-900 dark:text-sky-400",
          badge: "bg-sky-100 dark:bg-sky-955/30 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-900/30",
          iconColor: "text-sky-600 dark:text-sky-455",
        };
      default:
        return {
          border: "border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10",
          text: "text-slate-700 dark:text-slate-350",
          badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-750",
          iconColor: "text-slate-500 dark:text-slate-400",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse space-y-2">
              <div className="h-3.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" />
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
            Error loading smart alerts: {error}
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none border-none"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            Retry
          </button>
        )}
      </div>
    );
  }

  const activeAlertsCount = baseAlerts.filter((a) => !activeDismissed.includes(a.id)).length;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Smart Alerts
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {activeAlertsCount > 0 && (
            <span className="text-[9px] bg-rose-50 dark:bg-rose-955/35 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20 px-2 py-0.5 rounded-full font-bold">
              {activeAlertsCount} Active
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 cursor-pointer border-none bg-transparent focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            aria-label={isCollapsed ? "Expand alerts panel" : "Collapse alerts panel"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Search and Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-2 select-none border-b border-slate-50 dark:border-slate-850 pb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search alerts by patient name, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-555"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(["all", "critical", "high", "medium", "info"] as const).map((level) => {
                const count = level === "all" ? activeAlertsCount : levelCounts[level];
                const isSelected = severityFilter === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSeverityFilter(level)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-extrabold uppercase border cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-555 outline-none transition-all ${
                      isSelected
                        ? "bg-teal-50 dark:bg-teal-950/20 text-teal-655 dark:text-teal-400 border-teal-200 dark:border-teal-900"
                        : "bg-white dark:bg-slate-900 text-slate-450 dark:text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    {level} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alerts List */}
          {processedAlerts.length > 0 ? (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {processedAlerts.map((alert) => {
                const isMuted = alert.isMuted;
                const isPinned = alert.isPinned;
                const styles = getAlertStyles(alert.level);
                const ack = acknowledgedAlerts[alert.id];

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-2xl border flex gap-3 text-xs items-start relative group transition-all ${styles.border} ${
                      isMuted ? "opacity-60" : "opacity-100"
                    }`}
                    role="alert"
                  >
                    {alert.level === "critical" || alert.level === "high" ? (
                      <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${styles.iconColor} ${isMuted ? "" : "animate-pulse"}`} />
                    ) : (
                      <Info className={`w-4 h-4 shrink-0 mt-0.5 ${styles.iconColor}`} />
                    )}

                    <div className="flex-1 min-w-0 pr-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        {alert.category && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
                            {alert.category}
                          </span>
                        )}
                        <span className={`text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded ${styles.badge}`}>
                          {alert.level}
                        </span>
                        {isPinned && (
                          <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 ml-auto font-mono">
                          {alert.timestamp}
                        </span>
                      </div>

                      <div className={`mt-1.5 leading-normal ${styles.text}`}>
                        {alert.patientName && (
                          <span className="font-extrabold text-slate-800 dark:text-slate-100 mr-1.5">
                            {alert.patientName}:
                          </span>
                        )}
                        {alert.message}
                      </div>

                      {/* Acknowledgment details */}
                      {ack && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-teal-650 dark:text-teal-400 font-semibold bg-teal-50/40 dark:bg-teal-950/10 p-1.5 rounded-lg border border-teal-100/50 dark:border-teal-900/20 select-none">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-555 shrink-0" />
                          <span>Acknowledged at {ack.time} by {ack.user}</span>
                        </div>
                      )}

                      <div className="mt-3.5 flex items-center gap-2 flex-wrap select-none">
                        <button
                          onClick={() => handleOpenPatient(alert.id.split("-").pop() || "")}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[10px] font-bold border-none transition-all flex items-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-500 outline-none"
                        >
                          <span>Open Case</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        {!ack && (
                          <button
                            onClick={(e) => handleAcknowledge(alert.id, e)}
                            className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-650 border border-teal-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-550 outline-none"
                          >
                            Acknowledge
                          </button>
                        )}

                        <button
                          onClick={(e) => handleTogglePin(alert.id, e)}
                          className={`p-1 rounded-lg border border-slate-205 dark:border-slate-800 transition-all cursor-pointer bg-transparent focus-visible:ring-1 focus-visible:ring-teal-500 outline-none ${
                            isPinned ? "text-amber-500 bg-amber-50 dark:bg-amber-950/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          }`}
                          title={isPinned ? "Unpin alert" : "Pin alert"}
                        >
                          <Pin className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => handleToggleMute(alert.id, e)}
                          className={`p-1 rounded-lg border border-slate-205 dark:border-slate-800 transition-all cursor-pointer bg-transparent focus-visible:ring-1 focus-visible:ring-teal-555 outline-none ${
                            isMuted ? "text-slate-600 bg-slate-100 dark:bg-slate-800" : "text-slate-400 hover:text-slate-655"
                          }`}
                          title={isMuted ? "Unmute alert" : "Mute alert"}
                        >
                          <VolumeX className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="absolute top-3.5 right-3.5 p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                      title="Dismiss alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] space-y-4 select-none">
              <div className="flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <CheckCircle className="w-5 h-5 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  All Systems Operational
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                  No active critical alerts. AI router, KMS, and CDSS clinical rules are synchronized.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-left">
                <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500">
                    System Uptime
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    99.98% (Stable)
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500">
                    AI Router Status
                  </div>
                  <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500">
                    CDSS Knowledge KMS
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    Synchronized (2.4k rules)
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-100/60 dark:border-slate-800/40">
                  <div className="text-[9px] uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500">
                    Active Telemetry
                  </div>
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    0 errors / min
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {isCollapsed && activeAlertsCount > 0 && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full text-center py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-[10.5px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer border-none transition-colors select-none"
        >
          Show {activeAlertsCount} collapsed smart alerts...
        </button>
      )}
    </div>
  );
}
