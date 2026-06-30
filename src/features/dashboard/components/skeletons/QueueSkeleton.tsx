"use client";

import React from "react";
import PatientCardSkeleton from "./PatientCardSkeleton";

export default function QueueSkeleton() {
  return (
    <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
        <div className="space-y-1.5 w-1/3">
          <div className="h-4 bg-slate-800 rounded w-2/3" />
          <div className="h-2.5 bg-slate-800 rounded w-full" />
        </div>
        <div className="h-7 bg-slate-800 rounded-lg w-16" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PatientCardSkeleton />
        <PatientCardSkeleton />
        <PatientCardSkeleton />
        <PatientCardSkeleton />
      </div>
    </div>
  );
}
