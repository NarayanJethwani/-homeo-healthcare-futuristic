"use client";
import React, { useState, useRef, useEffect } from "react";
import { Server, CheckCircle2, AlertTriangle, XCircle, ExternalLink } from "lucide-react";

interface SystemStatusStripProps {
  telemetryLogs?: any[];
  failedLogsCount?: number;
  setActiveTab: (tabId: any) => void;
  reduceMotion?: boolean;
}

interface ServiceStatus {
  key: string;
  name: string;
  status: "online" | "warning" | "offline";
  latency: string;
  lastSync: string;
  desc: string;
}

export default function SystemStatusStrip({
  telemetryLogs = [],
  failedLogsCount = 0,
  setActiveTab,
  reduceMotion = false,
}: SystemStatusStripProps) {
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const services: ServiceStatus[] = React.useMemo(() => {
    const totalLogs = telemetryLogs.length;
    const isAiRouterOverloaded = failedLogsCount > 2 || (totalLogs > 0 && (failedLogsCount / totalLogs) > 0.05);

    return [
      { key: "firebase", name: "Firebase db", status: "online", latency: "14ms", lastSync: "1 sec ago", desc: "Patient registries & clinical histories database." },
      { key: "ai-router", name: "AI Router", status: isAiRouterOverloaded ? "warning" : "online", latency: "185ms", lastSync: "3 sec ago", desc: "LLM broker, consensus scoring, and token routing engine." },
      { key: "kms", name: "Knowledge Graph", status: "online", latency: "8ms", lastSync: "10 sec ago", desc: "Materia Medica indexing and diagnostic semantic vectors." },
      { key: "cdss", name: "CDSS Suggestions", status: "online", latency: "24ms", lastSync: "Just now", desc: "Clinical Decision Support System engine." },
      { key: "storage", name: "Cloud Storage", status: "online", latency: "38ms", lastSync: "5 min ago", desc: "Prescription PDF templates & intake audio attachments." },
      { key: "comms", name: "SMTP & WA Gateway", status: "online", latency: "95ms", lastSync: "12 sec ago", desc: "Outreach message delivery and notification queue." },
      { key: "billing", name: "Billing & Invoices", status: "online", latency: "12ms", lastSync: "2 min ago", desc: "Billed consultation ledger & invoice generator." },
    ];
  }, [telemetryLogs, failedLogsCount]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "warning":
        return "bg-amber-500 text-amber-500";
      case "offline":
        return "bg-rose-500 text-rose-500";
      default:
        return "bg-emerald-500 text-emerald-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "warning":
        return "Warning";
      case "offline":
        return "Offline";
      default:
        return "Healthy";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] select-none shrink-0"
    >
      <div className="flex items-center gap-2">
        <Server className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <span className="font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-500">Clinical OS Health:</span>
      </div>

      <div className="flex items-center gap-4 md:gap-6 flex-wrap">
        {services.map((srv) => {
          const isOpen = activePopover === srv.key;
          return (
            <div key={srv.key} className="relative">
              <button
                onClick={() => setActivePopover(isOpen ? null : srv.key)}
                className="flex items-center gap-1.5 py-0.5 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer font-sans outline-none focus-visible:ring-1 focus-visible:ring-teal-500"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(srv.status)}`} />
                <span className="font-bold text-slate-655 dark:text-slate-400">{srv.name}</span>
              </button>

              {isOpen && (
                <div 
                  className={`absolute right-0 sm:left-0 mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-3 rounded-2xl shadow-xl z-50 flex flex-col gap-2.5 text-slate-800 dark:text-slate-200 ${
                    reduceMotion ? "" : "animate-in slide-in-from-top-1 duration-100"
                  }`}
                  role="dialog"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-1.5">
                    <span className="font-extrabold text-xs text-slate-855 dark:text-slate-100">{srv.name}</span>
                    <span className={`text-[8.5px] uppercase font-extrabold px-1.5 py-0.2 rounded-full border ${
                      srv.status === "online" 
                        ? "bg-emerald-50 text-emerald-650 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                        : srv.status === "warning"
                        ? "bg-amber-50 text-amber-650 border-amber-100 dark:bg-amber-955/20 dark:border-amber-900/30"
                        : "bg-rose-50 text-rose-650 border-rose-100 dark:bg-rose-955/20 dark:border-rose-900/30"
                    }`}>
                      {getStatusText(srv.status)}
                    </span>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                    {srv.desc}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[9px] pt-1.5 border-t border-slate-100 dark:border-slate-850 font-mono text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="text-slate-450">Latency:</span>
                      <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{srv.latency}</div>
                    </div>
                    <div>
                      <span className="text-slate-450">Last Sync:</span>
                      <div className="font-bold text-slate-700 dark:text-slate-300 mt-0.5">{srv.lastSync}</div>
                    </div>
                  </div>

                  {srv.key === "ai-router" && (
                    <button
                      onClick={() => {
                        setActiveTab("ai-router");
                        setActivePopover(null);
                      }}
                      className="w-full text-center py-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[9px] font-bold border-none transition-all flex items-center justify-center gap-1 cursor-pointer focus-visible:ring-1 focus-visible:ring-teal-500 outline-none"
                    >
                      <span>Open Telemetry Console</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
