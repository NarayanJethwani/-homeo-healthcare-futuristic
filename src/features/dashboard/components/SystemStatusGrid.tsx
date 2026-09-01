"use client";

import React, { useMemo } from "react";
import { Server, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from "lucide-react";

interface SystemStatusGridProps {
  telemetryLogs?: any[];
  failedLogsCount?: number;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

interface ServiceStatus {
  name: string;
  status: "online" | "warning" | "offline";
  latency: string;
}

export default function SystemStatusGrid({
  telemetryLogs = [],
  failedLogsCount = 0,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: SystemStatusGridProps) {
  const services: ServiceStatus[] = useMemo(() => {
    // Determine dynamic states based on telemetry logs
    const totalLogs = telemetryLogs.length;
    const isAiRouterOverloaded = failedLogsCount > 2 || (totalLogs > 0 && (failedLogsCount / totalLogs) > 0.05);

    return [{ name: "AI Router service", status: isAiRouterOverloaded ? "warning" : "online", latency: totalLogs > 0 ? "Telemetry connected" : "No telemetry yet" }];
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
        return "text-rose-605 dark:text-rose-400";
      default:
        return "text-emerald-600 dark:text-emerald-400";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl animate-pulse space-y-2">
              <div className="h-3.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-2.5 w-20 bg-slate-150 dark:bg-slate-800 rounded" />
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
            Error loading engine metrics: {error}
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-500" />
          <span>Clinical OS Engine Status</span>
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
          Live Services
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 select-text">
        {services.map((srv, idx) => (
          <div
            key={idx}
            className={`p-3 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 hover:shadow-xs transition-shadow duration-150 ${
              reduceMotion ? "" : "hover:shadow-sm"
            }`}
          >
            {getStatusIcon(srv.status)}
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-slate-850 dark:text-slate-100 truncate leading-tight">
                {srv.name}
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-1.5 flex justify-between gap-2">
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
