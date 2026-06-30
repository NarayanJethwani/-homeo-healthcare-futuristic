"use client";

import React from "react";
import AlertsSkeleton from "./AlertsSkeleton";
import QueueSkeleton from "./QueueSkeleton";
import AnalyticsSkeleton from "./AnalyticsSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 bg-slate-950 border border-slate-900 rounded-3xl h-24 flex items-center justify-between">
            <div className="space-y-2 w-2/3">
              <div className="h-2.5 bg-slate-800 rounded w-1/2" />
              <div className="h-5 bg-slate-800 rounded w-3/4" />
            </div>
            <div className="w-10 h-10 bg-slate-900 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Main Widgets layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <QueueSkeleton />
          <AnalyticsSkeleton />
        </div>
        <div className="lg:col-span-4">
          <AlertsSkeleton />
        </div>
      </div>
    </div>
  );
}
