"use client";

import React from "react";

export default function PatientCardSkeleton() {
  return (
    <div className="p-4 bg-slate-900/40 border border-slate-900 rounded-2xl animate-pulse space-y-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5 w-1/2">
          <div className="h-3.5 bg-slate-800 rounded w-3/4" />
          <div className="h-2.5 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-4 bg-slate-800 rounded-full w-12" />
      </div>
      <div className="space-y-2 pt-2 border-t border-slate-900/60">
        <div className="h-2 bg-slate-800 rounded w-5/6" />
        <div className="h-2 bg-slate-800 rounded w-4/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-3 bg-slate-800 rounded w-16" />
        <div className="h-3 bg-slate-800 rounded w-12" />
      </div>
    </div>
  );
}
