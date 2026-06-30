"use client";

import React from "react";

export default function AnalyticsSkeleton() {
  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 space-y-6 animate-pulse">
      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
        <div className="space-y-1.5 w-1/3">
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-2.5 bg-slate-800 rounded w-full" />
        </div>
        <div className="h-7 bg-slate-800 rounded-lg w-20" />
      </div>
      <div className="h-48 bg-slate-900/60 rounded-2xl flex items-end justify-between p-4 gap-2 border border-slate-900/40">
        <div className="bg-slate-850 w-full h-1/3 rounded-t" />
        <div className="bg-slate-850 w-full h-1/2 rounded-t" />
        <div className="bg-slate-850 w-full h-2/3 rounded-t" />
        <div className="bg-slate-850 w-full h-3/4 rounded-t" />
        <div className="bg-slate-850 w-full h-5/6 rounded-t" />
        <div className="bg-slate-850 w-full h-full rounded-t" />
      </div>
    </div>
  );
}
