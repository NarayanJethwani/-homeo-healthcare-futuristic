"use client";

import React from "react";

export default function AlertsSkeleton() {
  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 space-y-4 animate-pulse">
      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-7 bg-slate-800 rounded-lg w-16" />
      </div>
      <div className="space-y-3">
        <div className="h-14 bg-slate-900/60 rounded-2xl border border-slate-900" />
        <div className="h-14 bg-slate-900/60 rounded-2xl border border-slate-900" />
        <div className="h-14 bg-slate-900/60 rounded-2xl border border-slate-900" />
      </div>
    </div>
  );
}
