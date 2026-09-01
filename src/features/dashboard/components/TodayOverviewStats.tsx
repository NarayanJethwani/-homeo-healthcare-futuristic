"use client";

import React from "react";
import { Calendar, RefreshCw, AlertTriangle, ShieldAlert, IndianRupee, TrendingUp, AlertCircle } from "lucide-react";
import { DashboardOverviewStats } from "../types";

interface TodayOverviewStatsProps {
  stats?: DashboardOverviewStats;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

export default function TodayOverviewStats({
  stats,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: TodayOverviewStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-[20px] shadow-xs space-y-2.5 animate-pulse"
          >
            <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-20 bg-slate-305 dark:bg-slate-700 rounded" />
            <div className="h-2 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-955/25 border border-rose-200 dark:border-rose-900/60 p-4 rounded-[20px] mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-455 shrink-0" />
          <span className="text-xs font-bold text-rose-850 dark:text-rose-300">
            Failed to load clinical overview stats: {error}
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  const defaultStats: DashboardOverviewStats = stats || {
    appointmentsCount: 0,
    followUpsCount: 0,
    abnormalReportsCount: 0,
    emergencyCasesCount: 0,
    revenueCollected: 0,
    recoveryIndex: "—",
  };

  const statItems = [
    {
      label: "Appointments",
      value: defaultStats.appointmentsCount,
      source: "Live appointment register",
      icon: Calendar,
      colorClass: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Follow-ups Due",
      value: defaultStats.followUpsCount,
      source: "Open follow-up bookings",
      icon: RefreshCw,
      colorClass: "text-sky-500 bg-sky-50 dark:bg-sky-950/20",
    },
    {
      label: "Abnormal Reports",
      value: defaultStats.abnormalReportsCount,
      source: "Report sign-off feed pending",
      icon: AlertTriangle,
      colorClass: defaultStats.abnormalReportsCount > 0 
        ? "text-amber-500 bg-amber-50 dark:bg-amber-955/20" 
        : "text-slate-400 bg-slate-50 dark:bg-slate-800/40",
    },
    {
      label: "Emergencies",
      value: defaultStats.emergencyCasesCount,
      source: "Open emergency bookings",
      icon: ShieldAlert,
      colorClass: defaultStats.emergencyCasesCount > 0 
        ? "text-rose-500 bg-rose-50 dark:bg-rose-955/20 animate-pulse" 
        : "text-slate-400 bg-slate-50 dark:bg-slate-800/40",
    },
    {
      label: "Confirmed Collection",
      value: `₹${defaultStats.revenueCollected.toLocaleString("en-IN")}`,
      source: "Confirmed payment receipts today",
      icon: IndianRupee,
      colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Recovery Index",
      value: defaultStats.recoveryIndex,
      source: "Outcome measure not yet configured",
      icon: TrendingUp,
      colorClass: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20",
    },
  ];

  return (
    <section 
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
      aria-label="Clinical metrics overview stats"
    >
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className={`bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 h-[155px] rounded-[22px] shadow-xs flex flex-col justify-between select-text transition-all ${
              reduceMotion ? "" : "hover:-translate-y-0.5 hover:shadow-sm duration-300"
            }`}
          >
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 tracking-wide truncate">
                    {item.label}
                  </span>
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 ${item.colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <h3 className="text-xl font-extrabold text-slate-850 dark:text-slate-100 mt-1.5 truncate tracking-tight">
                  {item.value}
                </h3>
                <p className="mt-1 text-[8px] font-medium text-slate-400 dark:text-slate-500">{item.source}</p>
              </div>

              <div className="mt-2 border-t border-slate-100/30 pt-2 text-[8px] font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-850/40 dark:text-slate-550">Current operational total</div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
