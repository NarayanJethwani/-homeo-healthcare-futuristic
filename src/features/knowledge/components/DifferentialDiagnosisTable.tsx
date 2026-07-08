"use client";

import React from "react";
import { GitCompare, Stethoscope } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface DifferentialDiagnosisTableProps {
  entity: KnowledgeEntity;
}

export default function DifferentialDiagnosisTable({ entity }: DifferentialDiagnosisTableProps) {
  const diffs = entity.structuredDifferentials || [];
  const textDiff = entity.content?.differentialDiagnosis;

  if (diffs.length === 0 && !textDiff) {
    return null; // Gracefully hide if no data exists
  }

  return (
    <div id="differential-diagnosis-table" className="space-y-4 scroll-mt-24">
      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-105 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
        <GitCompare className="h-5 w-5 text-rose-500" /> Differential Diagnosis Matrix
      </h3>

      {diffs.length > 0 ? (
        <div className="border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-sm bg-white/10 dark:bg-neutral-950/10 backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-850 text-neutral-500 dark:text-neutral-450 uppercase tracking-wider font-extrabold">
                  <th className="p-3 w-1/4">Differential Condition</th>
                  <th className="p-3 w-1/3">Clinical Overlap (Why it looks similar)</th>
                  <th className="p-3 w-1/4">Key Differentiator</th>
                  <th className="p-3">Primary Investigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850 text-neutral-700 dark:text-neutral-300">
                {diffs.map((d, idx) => (
                  <tr key={idx} className="hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 transition-colors">
                    <td className="p-3 font-bold text-neutral-900 dark:text-neutral-100">{d.condition}</td>
                    <td className="p-3">{d.similarity}</td>
                    <td className="p-3 font-semibold text-rose-600 dark:text-rose-400">{d.differentiator}</td>
                    <td className="p-3 font-mono text-[11px]">{d.investigation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Fallback for non-cornerstone pages
        <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-450 font-bold uppercase tracking-wider">
            <Stethoscope className="h-4 w-4" /> Differential Diagnosis Overview
          </div>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {textDiff}
          </p>
        </div>
      )}
    </div>
  );
}
