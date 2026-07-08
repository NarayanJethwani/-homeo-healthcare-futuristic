"use client";

import React from "react";
import { Check, ClipboardList } from "lucide-react";
import { KnowledgeEntity } from "../types";
import { getClinicalCategory, CATEGORY_COLORS } from "../graph/learningPathService";

interface EvidenceSummaryPanelProps {
  entity: KnowledgeEntity;
}

export default function EvidenceSummaryPanel({ entity }: EvidenceSummaryPanelProps) {
  const category = getClinicalCategory(entity);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

  // Attempt to resolve structured evidence, with fallback to quickFacts & aiReadiness
  const se = entity.structuredEvidence;

  const system = se?.system || entity.aiReadiness?.bodySystem || entity.quickFacts?.["Primary System"] || entity.quickFacts?.["System Affinity"] || "Clinical Medicine";
  const prevalence = se?.prevalence || entity.quickFacts?.["Prevalence"] || "Clinical review pending";
  const typicalAge = se?.typicalAge || "Clinical review pending";
  
  // Resolve causes (from causes content list, or fallbacks)
  const causes = se?.causes && se.causes.length > 0 
    ? se.causes 
    : (entity.content?.causes || entity.content?.commonCauses || []);
    
  // Resolve investigations
  const investigations = se?.investigations && se.investigations.length > 0
    ? se.investigations
    : (entity.content?.labTests || (entity.content?.diagnosis ? [entity.content.diagnosis] : []));

  const urgency = se?.urgency || entity.aiReadiness?.urgency || entity.quickFacts?.["Urgency Level"] || "routine";

  // Render nothing if no useful clinical data can be presented (per constraint 10)
  if (!se && causes.length === 0 && investigations.length === 0) {
    return null;
  }

  return (
    <div className={`p-6 rounded-3xl border border-neutral-200 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md space-y-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 border-b border-neutral-500/10 pb-3">
        <ClipboardList className={`h-5 w-5 text-teal-600 dark:text-teal-400`} />
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          Evidence Summary
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        {/* Left Side: Standard Metrics */}
        <div className="space-y-3">
          <div className="flex justify-between border-b border-neutral-500/5 pb-2">
            <span className="font-semibold text-neutral-500 dark:text-neutral-450 text-xs">Body System</span>
            <span className="font-bold text-neutral-800 dark:text-neutral-200 text-xs uppercase tracking-wide">{system}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-500/5 pb-2">
            <span className="font-semibold text-neutral-500 dark:text-neutral-450 text-xs">Typical Prevalence</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">{prevalence}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-500/5 pb-2">
            <span className="font-semibold text-neutral-500 dark:text-neutral-450 text-xs">Typical Age Range</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200 text-xs">{typicalAge}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="font-semibold text-neutral-500 dark:text-neutral-450 text-xs">Clinical Urgency</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              urgency === "emergency" || urgency === "urgent"
                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                : urgency === "monitor"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                : "bg-teal-500/15 text-teal-600 dark:text-teal-400"
            }`}>
              {urgency}
            </span>
          </div>
        </div>

        {/* Right Side: Causes & Investigations */}
        <div className="space-y-4">
          {causes.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block mb-1.5 tracking-wider">
                Primary Etiological Factors
              </span>
              <ul className="space-y-1 text-xs text-neutral-700 dark:text-neutral-300">
                {causes.slice(0, 3).map((cause: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5 text-xs font-bold">•</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {investigations.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block mb-1.5 tracking-wider">
                Recommended Screenings
              </span>
              <div className="flex flex-wrap gap-1.5">
                {investigations.slice(0, 4).map((inv: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-250 dark:border-neutral-750 text-[10px] font-semibold text-neutral-700 dark:text-neutral-355">
                    <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                    {inv.replace(/Diagnosed by measuring |Evaluated through /, "").split(",")[0].trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
