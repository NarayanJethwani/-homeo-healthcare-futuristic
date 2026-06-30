"use client";

import React, { useState, useMemo } from "react";
import { Brain, Star, ArrowRight, ShieldAlert, AlertTriangle, RefreshCw, X } from "lucide-react";
import { CdssRecommendation } from "../types";
import { useCdss } from "../hooks/useCdss";

interface AiRecommendationsPanelProps {
  patients?: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

export default function AiRecommendationsPanel({
  patients = [],
  onSelectPatient,
  setActiveTab,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: AiRecommendationsPanelProps) {
  const [localDismissedRecs, setLocalDismissedRecs] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setLocalDismissedRecs((prev) => [...prev, id]);
  };

  const handleOpenPatient = (patientId: string) => {
    onSelectPatient(patientId);
    setActiveTab("patients");
  };

  const { recommendations: rawRecommendations } = useCdss(patients);
  const recommendations = useMemo(() => {
    return rawRecommendations.filter((rec) => !localDismissedRecs.includes(rec.id));
  }, [rawRecommendations, localDismissedRecs]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="space-y-4">
          {[1].map((i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-205 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" />
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
            Error loading CDSS advice: {error}
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4 select-text">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Brain className="w-4.5 h-4.5 text-teal-500" />
          <span>Clinical Decision Support System (CDSS)</span>
        </h3>
        <span className="text-[9px] bg-teal-50 dark:bg-teal-955/35 text-teal-655 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Advisory Only
        </span>
      </div>

      {/* Recommendations Stack */}
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/50 dark:border-slate-800 rounded-3xl space-y-3 relative group"
            >
              {/* Header: Patient Name and Confidence */}
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-teal-500 fill-teal-500 shrink-0" />
                    <span>Patient: {rec.patientName}</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mt-1">
                    UHID: {rec.patientId}
                  </span>
                </div>
                <div className="text-right shrink-0 select-none">
                  <span className="text-[10px] font-mono font-bold text-teal-655 dark:text-teal-400 bg-teal-100/50 dark:bg-teal-955/20 px-2.5 py-0.5 rounded-full">
                    {rec.confidence}% confidence index
                  </span>
                </div>
              </div>

              {/* Recommendation Content */}
              <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="font-extrabold text-slate-450 dark:text-slate-550 block text-[9.5px] uppercase tracking-wider mb-1">
                  Clinical Recommendation (Suggested for clinician review)
                </span>
                {rec.recommendation}
              </div>

              {/* Grid: Evidence and Remedy details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] text-slate-655 dark:text-slate-450 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 leading-relaxed">
                <div>
                  <span className="font-bold text-slate-450 dark:text-slate-550 block mb-0.5">Supporting Evidence:</span>
                  {rec.evidence}
                </div>
                <div>
                  <span className="font-bold text-slate-450 dark:text-slate-550 block mb-0.5">Suggested Remedy Layer:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.remedyLayer}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-450 dark:text-slate-550 block mb-0.5">Suggested Investigation:</span>
                  {rec.nextInvestigation}
                </div>
                <div>
                  <span className="font-bold text-slate-450 dark:text-slate-550 block mb-0.5">Supporting Reports:</span>
                  <div className="flex gap-1.5 flex-wrap mt-0.5">
                    {rec.supportingReports.map((rep, rIdx) => (
                      <span
                        key={rIdx}
                        className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-500"
                      >
                        {rep}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medico-Legal safety warning disclaimer */}
              <div className="p-2.5 bg-rose-50/40 dark:bg-rose-955/5 border border-rose-100/30 dark:border-rose-900/20 rounded-xl text-[9px] text-rose-750 dark:text-rose-400/90 leading-relaxed flex items-start gap-1.5 select-none font-sans">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <span className="font-bold uppercase tracking-wider">Advisory Notice (Not a confirmed diagnosis):</span> {rec.advisoryDisclaimer}
                </p>
              </div>

              {/* Suggested Action Button triggers */}
              <div className="pt-2 flex items-center justify-between gap-3 select-none">
                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl text-[10px] font-bold transition-all cursor-pointer border-none bg-transparent"
                >
                  Dismiss Recommendation
                </button>
                <button
                  onClick={() => handleOpenPatient(rec.patientId)}
                  className={`px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white dark:text-slate-200 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer border-none focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                    reduceMotion ? "" : "active:scale-98"
                  }`}
                  aria-label={`Open case files for patient ${rec.patientName}`}
                >
                  <span>Open Patient Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dismiss X button */}
              <button
                onClick={() => handleDismiss(rec.id)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                title="Dismiss recommendation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 select-none">
            <ShieldAlert className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">No CDSS advice active</div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-xs mx-auto">
              Clinical cases in the queue do not trigger additional advisories at this stage.
            </p>
          </div>
        )}
      </div>

      {/* Audit Safe Clinical Disclaimer */}
      <div className="p-3 bg-amber-50/50 dark:bg-amber-955/10 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl text-[9.5px] text-amber-700 dark:text-amber-400 leading-relaxed flex items-start gap-2 select-none">
        <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <span className="font-bold uppercase tracking-wider">Clinical Disclaimer:</span> CDSS suggestions are automated advisories provided for clinician review only. They do not constitute final medical prescriptions or diagnoses, and always require validation against clinical case-taking.
        </p>
      </div>
    </div>
  );
}
