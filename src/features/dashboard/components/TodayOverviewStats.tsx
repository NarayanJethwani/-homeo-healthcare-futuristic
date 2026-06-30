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
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2 animate-pulse"
          >
            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-4 rounded-2xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-455 shrink-0" />
          <span className="text-xs font-bold text-rose-850 dark:text-rose-300">
            Failed to load clinical overview stats: {error}
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
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
    recoveryIndex: "+0.0%",
  };

  const statItems = [
    {
      label: "Appointments",
      value: `${defaultStats.appointmentsCount} cases`,
      icon: Calendar,
      colorClass: "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40",
    },
    {
      label: "Follow-ups Due",
      value: `${defaultStats.followUpsCount} patients`,
      icon: RefreshCw,
      colorClass: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40",
    },
    {
      label: "Abnormal Reports",
      value: `${defaultStats.abnormalReportsCount} flag`,
      icon: AlertTriangle,
      colorClass: defaultStats.abnormalReportsCount > 0 
        ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 animate-pulse" 
        : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40",
    },
    {
      label: "Emergencies",
      value: `${defaultStats.emergencyCasesCount} active`,
      icon: ShieldAlert,
      colorClass: defaultStats.emergencyCasesCount > 0 
        ? "text-rose-650 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 animate-bounce" 
        : "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40",
    },
    {
      label: "Today's Collection",
      value: `₹${defaultStats.revenueCollected.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "Recovery Index",
      value: defaultStats.recoveryIndex,
      icon: TrendingUp,
      colorClass: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40",
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
            className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3.5 ${
              reduceMotion ? "" : "hover:-translate-y-0.5 duration-300"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.colorClass}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                {item.label}
              </div>
              <div className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-0.5 truncate">
                {item.value}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
