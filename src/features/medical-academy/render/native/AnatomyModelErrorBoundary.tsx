"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AnatomyModelErrorBoundaryProps {
  systemName: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export const AnatomyModelErrorBoundary: React.FC<AnatomyModelErrorBoundaryProps> = ({
  systemName,
  errorMessage = "Authentic anatomical 3D reference model is currently in preparation.",
  onRetry,
}) => {
  return (
    <div className="flex h-full w-full min-h-[480px] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-950 p-6 text-center text-white">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-lg mb-4">
        <AlertTriangle className="h-7 w-7" />
      </div>

      <h3 className="text-base font-bold text-slate-100 sm:text-lg">
        Anatomical Model In Preparation
      </h3>

      <p className="mt-2 max-w-md text-xs text-slate-400 leading-relaxed">
        The authentic 3D anatomical dataset for <span className="font-semibold text-slate-200">{systemName}</span> is being processed in compliance with the OSTM™ verified licensing and provenance pipeline.
      </p>

      {errorMessage && (
        <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 font-mono text-[11px] text-slate-400">
          {errorMessage}
        </div>
      )}

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/80 px-4 py-2 text-xs font-semibold text-teal-300 shadow-md transition hover:bg-teal-900"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading 3D Model</span>
        </button>
      )}
    </div>
  );
};
