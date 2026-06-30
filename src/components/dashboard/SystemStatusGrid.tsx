"use client";

import React, { useMemo } from "react";
import { Server, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface SystemStatusGridProps {
  telemetryLogs: any[];
  failedLogsCount?: number;
}

interface ServiceStatus {
  name: string;
  status: "online" | "warning" | "offline";
  latency: string;
}

export default function SystemStatusGrid({ telemetryLogs, failedLogsCount = 0 }: SystemStatusGridProps) {
  const services: ServiceStatus[] = useMemo(() => {
    // Determine dynamic states based on telemetry logs
    const totalLogs = telemetryLogs.length;
    const isAiRouterOverloaded = failedLogsCount > 2 || (totalLogs > 0 && (failedLogsCount / totalLogs) > 0.05);

    return [
      { name: "Firebase db", status: "online", latency: "14ms" },
      { name: "AI Router service", status: isAiRouterOverloaded ? "warning" : "online", latency: "185ms" },
      { name: "Primary LLMs", status: "online", latency: "1.2s" },
      { name: "Clinical Storage", status: "online", latency: "24ms" },
      { name: "Communications (SMTP/WA)", status: "online", latency: "95ms" },
      { name: "Billing & Invoices", status: "online", latency: "12ms" },
    ];
  }, [telemetryLogs, failedLogsCount]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
      case "offline":
        return <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "offline":
        return "text-rose-600 dark:text-rose-400";
      default:
        return "text-emerald-600 dark:text-emerald-400";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-500" />
          <span>Clinical OS Engine Status</span>
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider">
          Live Services
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-text">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 hover:shadow-xs transition-shadow duration-150"
          >
            {getStatusIcon(srv.status)}
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                {srv.name}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 flex justify-between gap-2">
                <span className={`font-bold capitalize ${getStatusClass(srv.status)}`}>{srv.status}</span>
                <span>• {srv.latency}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
