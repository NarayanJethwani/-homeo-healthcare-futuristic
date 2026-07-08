"use client";

import React from "react";
import { HelpCircle, Layers, CheckCircle2 } from "lucide-react";
import { KnowledgeEntity } from "../types";
import { getClinicalCategory, CATEGORY_COLORS } from "../graph/learningPathService";

interface QuickFactsCardProps {
  entity: KnowledgeEntity;
}

export default function QuickFactsCard({ entity }: QuickFactsCardProps) {
  const category = getClinicalCategory(entity);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

  // Resolve Quick Facts map
  let facts: Record<string, string> = entity.quickFacts || {};

  // If no facts are provided, resolve smart defaults based on Entity Type to avoid blank cards
  if (Object.keys(facts).length === 0) {
    if (entity.entityType === "lab-test") {
      facts = {
        "Specimen Type": "Venous Blood (Serum)",
        "Preparation": "Fasting optional unless ordered with lipid panel",
        "Turnaround Time": "24–48 Hours",
        "Clinical Category": category.charAt(0).toUpperCase() + category.slice(1)
      };
    } else if (entity.entityType === "disease") {
      facts = {
        "System Affinity": category.charAt(0).toUpperCase() + category.slice(1),
        "Diagnostic Standard": "Clinical evaluation & serum biomarkers",
        "Urgency Level": entity.aiReadiness?.urgency || "routine",
        "Evidence Grade": entity.evidenceLevel
      };
    } else if (entity.entityType === "remedy") {
      const content = entity.content || {};
      facts = {
        "Common Name": content.commonName || "Unknown",
        "Remedy Source": content.source || "Natural source",
        "Kingdom Affinity": content.kingdom || "Vegetable",
        "Miasmatic Affinity": (content.miasmaticAffinity || []).join(", ") || "Psoric"
      };
    } else if (entity.entityType === "symptom") {
      facts = {
        "System Focus": category.charAt(0).toUpperCase() + category.slice(1),
        "Clinical Character": "Subjective patient manifestation",
        "Diagnostic Urgency": "Monitor for red flag progress"
      };
    }
  }

  if (Object.keys(facts).length === 0) {
    return null;
  }

  return (
    <div className={`p-5 rounded-3xl border ${colors.border} ${colors.bg} backdrop-blur-sm space-y-4 shadow-sm transition-all duration-300 hover:shadow-md`}>
      <div className="flex items-center gap-2">
        <Layers className={`h-4.5 w-4.5 ${colors.text}`} />
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
          Quick Reference Facts
        </h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        {Object.entries(facts).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-neutral-400 dark:text-neutral-500 block">
              {key}
            </span>
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 block leading-tight">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
