"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Server, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Database, 
  Cpu, 
  BookOpen, 
  ShieldAlert, 
  HardDrive, 
  Bell, 
  ExternalLink,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemStatusStripProps {
  telemetryLogs?: any[];
  failedLogsCount?: number;
  setActiveTab: (tabId: any) => void;
  reduceMotion?: boolean;
}

type HealthLevel = "healthy" | "degraded" | "offline" | "disabled";

interface SimplifiedService {
  key: string;
  name: string;
  icon: any;
  status: HealthLevel;
  latencyText: string;
  desc: string;
  region?: string;
  details?: Record<string, any>;
}

export default function SystemStatusStrip({
  telemetryLogs = [],
  failedLogsCount = 0,
  setActiveTab,
  reduceMotion = false,
}: SystemStatusStripProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if the AI Router is experiencing warning or fallback conditions
  const isAiRouterDegraded = telemetryLogs.some(
    (log) => log.status === "failed" || (log.failoverTrace && log.failoverTrace.length > 1)
  );

  const services: SimplifiedService[] = React.useMemo(() => {
    return [
      {
        key: "firebase",
        name: "Firebase Database",
        icon: Database,
        status: "healthy",
        latencyText: "32 ms",
        desc: "Patient registries, profiles, and case histories live database.",
        region: "us-central1 (Primary)",
        details: { Latency: "32 ms", Connection: "Active Pool", Storage: "Nominal" }
      },
      {
        key: "ai-router",
        name: "AI Router",
        icon: Cpu,
        status: isAiRouterDegraded ? "degraded" : "healthy",
        latencyText: isAiRouterDegraded ? "Fallback Active" : "185 ms",
        desc: "Unified clinical LLM router, safety filter, and failover controller.",
        region: "Global CDN (Edge)",
        details: { 
          Primary: "Gemini 1.5 Flash", 
          Fallback: "DeepSeek-V3 (Auto-Failover)", 
          "Safety Filter": "Nominal",
          Status: isAiRouterDegraded ? "Degraded (Running on Fallback)" : "Nominal"
        }
      },
      {
        key: "kms",
        name: "Knowledge Graph",
        icon: BookOpen,
        status: "healthy",
        latencyText: "Synced",
        desc: "Materia Medica semantic nodes and case repertory search mappings.",
        region: "us-east4",
        details: { Sync: "Nominal", Elements: "1,500 Profiles", "Cache Hit Rate": "98.4%" }
      },
      {
        key: "cdss",
        name: "CDSS Engine",
        icon: ShieldAlert,
        status: "healthy",
        latencyText: "Ready",
        desc: "Decision Support System matching safety checks and warning advisories.",
        region: "Local Worker",
        details: { Ruleset: "v2.4.1", "Avg Processing": "24 ms", Status: "Nominal" }
      },
      {
        key: "storage",
        name: "Cloud Storage",
        icon: HardDrive,
        status: "healthy",
        latencyText: "Healthy",
        desc: "Patient records, clinical charts, PDF templates, and audio logs bucket.",
        region: "us-central1 (Multi-regional)",
        details: { Capacity: "4.8% (4.8 GB / 100 GB)", Latency: "38 ms", SSL: "Active" }
      },
      {
        key: "notifications",
        name: "Notifications",
        icon: Bell,
        status: "healthy",
        latencyText: "Healthy",
        desc: "SMTP outreach engine and WhatsApp notification dispatch queue.",
        region: "API Gateway",
        details: { Queue: "0 Pending", "Delivery Rate": "99.98%", Latency: "95 ms" }
      }
    ];
  }, [isAiRouterDegraded]);

  // Derived overall status
  const degradedCount = services.filter(s => s.status === "degraded").length;
  const offlineCount = services.filter(s => s.status === "offline").length;
  
  let overallStatus: HealthLevel = "healthy";
  let overallText = "Clinical OS Healthy";
  let overallColor = "bg-emerald-500 text-emerald-500";
  let summaryText = `${services.length}/${services.length} Services Operational`;

  if (offlineCount > 0) {
    overallStatus = "offline";
    overallText = "Clinical OS Offline";
    overallColor = "bg-rose-500 text-rose-500";
    summaryText = `${offlineCount} Offline, ${services.length - offlineCount} Online`;
  } else if (degradedCount > 0) {
    overallStatus = "degraded";
    overallText = "Clinical OS Degraded";
    overallColor = "bg-amber-500 text-amber-500";
    summaryText = `${degradedCount} Degraded, ${services.length - degradedCount} Healthy`;
  }

  const getStatusIconClass = (status: HealthLevel) => {
    switch (status) {
      case "degraded":
        return "bg-amber-500";
      case "offline":
        return "bg-rose-500";
      case "disabled":
        return "bg-slate-300";
      default:
        return "bg-emerald-500";
    }
  };

  const getStatusTextLabel = (status: HealthLevel) => {
    switch (status) {
      case "degraded":
        return "Degraded";
      case "offline":
        return "Offline";
      case "disabled":
        return "Disabled";
      default:
        return "Healthy";
    }
  };

  const handleSimulateFailover = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationLogs([]);
    
    const logs = [
      "[INFO] Triggering Manual Failover Simulation...",
      "[WARN] Simulating Gemini Quota Exhaustion (429 Too Many Requests)...",
      "[INFO] AI Router Service intercepted warning state.",
      "[INFO] Initiating primary model fallback sequence...",
      "[SUCCESS] Switched Active LLM Broker to Claude 3.5 Sonnet backup node.",
      "[INFO] Telemetry metrics nominal. Failover loop completed."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setSimulationLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsSimulating(false);
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <div 
      ref={containerRef}
      className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 px-6 py-2 select-none shrink-0 transition-all duration-200 flex flex-col w-full"
    >
      {/* ── Default (Collapsed View) ── */}
      <div className="flex items-center justify-between text-[10px] w-full min-h-[18px]">
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 cursor-pointer hover:opacity-85"
        >
          <span className={`w-2 h-2 rounded-full ${overallColor} shrink-0 animate-pulse`} />
          <span className="font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-250 font-sans">
            {overallText}
          </span>
        </div>

        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden sm:flex items-center gap-2 cursor-pointer text-slate-450 dark:text-slate-450 font-sans font-medium text-[9.5px]"
        >
          <span>{summaryText}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 dark:text-slate-550 font-mono text-[9px]">
            Last Sync: 3 sec ago
          </span>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-0.5 hover:bg-slate-200/60 dark:hover:bg-slate-850 rounded text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors border-none bg-transparent cursor-pointer outline-none"
            aria-label={isCollapsed ? "Expand status strip" : "Collapse status strip"}
          >
            {isCollapsed ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Expanded Services Panel ── */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 pb-1 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans">
                  Clinical OS Health Status Overview
                </span>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-[9px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-350 bg-transparent border-none cursor-pointer flex items-center gap-1 outline-none transition-colors"
                >
                  <span>Detailed Diagnostics</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Grid of simplified services */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {services.map((srv) => {
                  const SrvIcon = srv.icon;
                  return (
                    <div 
                      key={srv.key}
                      onClick={() => {
                        setIsDrawerOpen(true);
                      }}
                      className="bg-white/50 dark:bg-slate-900/30 p-2.5 rounded-xl border border-slate-150/40 dark:border-slate-800/40 flex items-center justify-between gap-1.5 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusIconClass(srv.status)}`} />
                        <span className="font-bold text-slate-655 dark:text-slate-405 truncate text-[9.5px]">
                          {srv.name}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-450 dark:text-slate-550 shrink-0 font-medium">
                        {srv.latencyText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Slide-Over Diagnostics Drawer ── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop wrapper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 cursor-pointer backdrop-blur-xs"
            />

            {/* Slide-over panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-80 sm:w-[420px] bg-white dark:bg-slate-955 border-l border-slate-202 dark:border-slate-850 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-slate-850 dark:text-slate-100 font-sans tracking-wide">
                      System Diagnostics
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${overallColor}`} />
                      <span className="text-[9.5px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500">
                        {overallText}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors border-none bg-transparent cursor-pointer outline-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Services detailed specs */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Operational Matrix
                  </h4>

                  <div className="space-y-3">
                    {services.map((srv) => {
                      const SrvIcon = srv.icon;
                      return (
                        <div 
                          key={srv.key}
                          className="bg-slate-55 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-202/60 dark:border-slate-850/60 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                                <SrvIcon className="w-3.5 h-3.5" />
                              </div>
                              <span className="font-extrabold text-xs text-slate-855 dark:text-slate-200">
                                {srv.name}
                              </span>
                            </div>
                            <span className={`text-[8px] uppercase font-extrabold px-1.5 py-0.2 rounded-full border ${
                              srv.status === "healthy" 
                                ? "bg-emerald-50 text-emerald-650 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30"
                                : srv.status === "degraded"
                                ? "bg-amber-50 text-amber-655 border-amber-100 dark:bg-amber-955/20 dark:border-amber-900/30"
                                : "bg-rose-50 text-rose-650 border-rose-100 dark:bg-rose-955/20 dark:border-rose-900/30"
                            }`}>
                              {getStatusTextLabel(srv.status)}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                            {srv.desc}
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[9px] pt-2 border-t border-slate-100 dark:border-slate-850 font-mono text-slate-450 dark:text-slate-500">
                            {Object.entries(srv.details || {}).map(([dk, dv]) => (
                              <div key={dk}>
                                <span>{dk}:</span>
                                <div className="font-bold text-slate-700 dark:text-slate-350 mt-0.5">{dv}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Failover Action */}
                <div className="bg-slate-55 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-202/60 dark:border-slate-850/60 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider font-sans">
                      Failover Action Controls
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
                      Channel: Gemini-Quota-Sim
                    </span>
                  </div>

                  <button
                    onClick={handleSimulateFailover}
                    disabled={isSimulating}
                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[10px] font-bold border-none transition-all flex items-center justify-center gap-1.5 cursor-pointer outline-none"
                  >
                    <Activity className={`w-3.5 h-3.5 ${isSimulating ? "animate-pulse" : ""}`} />
                    <span>{isSimulating ? "Simulating..." : "Trigger Failover Simulation"}</span>
                  </button>

                  {simulationLogs.length > 0 && (
                    <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl text-[8.5px] font-mono text-slate-350 space-y-1 max-h-32 overflow-y-auto leading-relaxed">
                      {simulationLogs.map((lg, i) => (
                        <div key={i} className={lg.includes("SUCCESS") ? "text-emerald-400" : lg.includes("WARN") ? "text-amber-400" : "text-slate-350"}>
                          {lg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Console Link */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-850 mt-6 select-none">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setActiveTab("ai-router");
                  }}
                  className="w-full text-center py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-[10px] font-extrabold cursor-pointer border-none transition-all flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                >
                  <span>Open System Telemetry Logs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
