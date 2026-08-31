"use client";

import React from "react";
import { BookOpen, FileText, Activity, Compass, ArrowRight, RefreshCw } from "lucide-react";

interface KnowledgeKmsWidgetProps {
  setActiveTab: (tabId: any) => void;
  reduceMotion?: boolean;
}

export default function KnowledgeKmsWidget({
  setActiveTab,
  reduceMotion = false,
}: KnowledgeKmsWidgetProps) {
  const kmsStats = { needsReview: 0, expiredCount: 0, healthScore: "—", aiReadiness: "—", mostViewed: "No live analytics connected", recentlyUpdated: "No live update feed connected" };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-202/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-500" />
          <span>Knowledge &amp; KMS Platform</span>
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider font-sans">
          RAG Metrics
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 select-text">
        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-202/60 dark:border-slate-800 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase leading-none">Needs Review</span>
            {kmsStats.needsReview > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          </div>
          <div className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1 leading-none">
            {kmsStats.needsReview} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">drafts</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-202/60 dark:border-slate-800 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase leading-none">Expired Articles</span>
            {kmsStats.expiredCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
          </div>
          <div className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1 leading-none">
            {kmsStats.expiredCount} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">entries</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-202/60 dark:border-slate-800 rounded-xl">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase leading-none block">KMS Health</span>
          <div className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1.5 leading-none flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            {kmsStats.healthScore}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-202/60 dark:border-slate-800 rounded-xl">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase leading-none block">AI Readiness</span>
          <div className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-1.5 leading-none flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            {kmsStats.aiReadiness}
          </div>
        </div>
      </div>

      {/* Metadata items list */}
      <div className="space-y-2 select-text border-t border-slate-100 dark:border-slate-850 pt-3 text-[10px] text-slate-600 dark:text-slate-450 leading-relaxed font-medium">
        <div className="flex justify-between items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Most Viewed:
          </span>
          <span className="font-bold text-slate-850 dark:text-slate-250 truncate text-right max-w-[160px]" title={kmsStats.mostViewed}>
            {kmsStats.mostViewed}
          </span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 shrink-0">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            Last Update:
          </span>
          <span className="font-bold text-slate-850 dark:text-slate-250 truncate text-right max-w-[160px]" title={kmsStats.recentlyUpdated}>
            {kmsStats.recentlyUpdated}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-1.5 select-none">
        <button
          onClick={() => setActiveTab("nexus-atlas")}
          className={`w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[9.5px] font-extrabold cursor-pointer border-none transition-all flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
            reduceMotion ? "" : "active:scale-98"
          }`}
        >
          <span>Open KMS Platform</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
