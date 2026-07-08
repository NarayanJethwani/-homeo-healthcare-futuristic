"use client";

import React from "react";
import { Activity, ShieldAlert, Cpu } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface VisualBodySystemCardProps {
  entity: KnowledgeEntity;
}

export default function VisualBodySystemCard({ entity }: VisualBodySystemCardProps) {
  const vbs = entity.visualBodySystem;

  // Fallback calculations for non-priority pages
  const system = vbs?.system || entity.aiReadiness?.bodySystem || "Clinical System";
  const organs = vbs?.organs || [];
  const hormones = vbs?.hormones || [];
  const remedies = vbs?.remedies || [];
  const parameters = vbs?.parameters || [];

  const hasData = vbs || organs.length > 0 || hormones.length > 0 || remedies.length > 0 || parameters.length > 0;

  if (!hasData) {
    return null; // Gracefully hide if no data exists
  }

  return (
    <div className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-850 bg-gradient-to-br from-neutral-50/50 to-neutral-100/50 dark:from-neutral-900/30 dark:to-neutral-950/30 backdrop-blur-md space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-neutral-500/10 pb-3">
        <Cpu className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        <h4 className="text-sm font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          Visual Body System Card
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* System Affinity */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
            Affected System
          </span>
          <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 uppercase tracking-wide">
            {system}
          </span>
        </div>

        {/* Organs Involved */}
        {organs.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Organs Involved
            </span>
            <div className="flex flex-wrap gap-1 pt-1">
              {organs.map((organ) => (
                <span key={organ} className="px-2 py-0.5 rounded-md bg-neutral-200/50 dark:bg-neutral-850 text-xs font-medium text-neutral-750 dark:text-neutral-350 border border-neutral-200/20">
                  {organ}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Associated Parameters / Remedies / Hormones */}
        {(hormones.length > 0 || remedies.length > 0 || parameters.length > 0) && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              {entity.entityType === "remedy" ? "Target Affinities" : hormones.length > 0 ? "Hormones Involved" : "Parameters & Remedies"}
            </span>
            <div className="flex flex-wrap gap-1 pt-1">
              {[...hormones, ...remedies, ...parameters].map((item) => (
                <span key={item} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
