"use client";

import React, { useState, useEffect } from "react";
import { Info, FileSpreadsheet } from "lucide-react";
import { ReviewedLabResult } from "./types";
import { fetchLabSummary } from "./labClient";

interface TreatmentPlannerLabReferenceProps {
  patientId: string;
}

export default function TreatmentPlannerLabReference({ patientId }: TreatmentPlannerLabReferenceProps) {
  const [summary, setSummary] = useState<ReviewedLabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setSummary([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    fetchLabSummary(patientId)
      .then((data) => {
        if (active) {
          setSummary(data.summary || []);
        }
      })
      .catch((err) => {
        console.error("Failed to load lab summary in treatment planner reference:", err.message);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [patientId]);

  if (!patientId) {
    return null;
  }

  if (loading) {
    return (
      <div className="text-[10px] text-slate-400 dark:text-slate-500 italic py-2 pl-1 flex items-center gap-1.5">
        <div className="w-3 h-3 border border-slate-300 dark:border-slate-700 border-t-emerald-500 animate-spin rounded-full" />
        <span>Loading reference lab metrics...</span>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-slate-100 dark:border-slate-805 pt-4 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <FileSpreadsheet className="w-4 h-4 text-purple-650" />
        <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-450">Reviewed Lab Reference</h4>
      </div>

      {summary.length === 0 ? (
        <div className="text-[10px] text-slate-400 dark:text-slate-500 italic pl-1.5 py-1">
          No clinician-reviewed labs available for this patient.
        </div>
      ) : (
        <div className="space-y-2">
          {/* Reference Warning Notice */}
          <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 flex items-start gap-1.5 text-[9.5px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
            <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
            <span>Reviewed lab data is shown for clinician reference only. It does not alter repertory scoring or care package pricing calculations.</span>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 gap-2">
            {summary.map((lab) => {
              const isAbnormal = lab.flag === "low" || lab.flag === "high" || lab.flag === "critical";
              return (
                <div 
                  key={lab.id} 
                  className={`p-2.5 border rounded-xl flex flex-col justify-between text-xs ${
                    isAbnormal 
                      ? "bg-rose-500/5 border-rose-200 dark:border-rose-900/30" 
                      : "bg-slate-50/50 dark:bg-slate-955/30 border-slate-100 dark:border-slate-850"
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] gap-1">
                    <span className="font-bold text-slate-800 dark:text-slate-350 truncate">{lab.testName}</span>
                    {isAbnormal && (
                      <span className="text-[7.5px] uppercase font-black text-rose-600 bg-rose-500/10 px-1 rounded flex-shrink-0">
                        {lab.flag}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-0.5">
                    <span className="font-mono font-black text-slate-900 dark:text-white">{lab.value}</span>
                    {lab.unit && <span className="text-[8.5px] text-slate-450 font-bold">{lab.unit}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
