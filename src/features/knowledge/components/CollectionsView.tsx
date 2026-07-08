"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CURATED_COLLECTIONS, getEntitiesForCollection } from "../collections/collectionsRegistry";
import { Flame, Sparkles, Baby, Wind, Smile, ShieldAlert, Brain, Accessibility, Activity, ArrowRight, BookOpen } from "lucide-react";

// Icon lookup dictionary mapping string names to component imports
const IconLookup: Record<string, any> = {
  Flame,
  Sparkles,
  Baby,
  Wind,
  Smile,
  ShieldAlert,
  Brain,
  Accessibility,
  Activity
};

export default function CollectionsView() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20">
          Curated Portals
        </span>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
          Clinical Specialty Hubs
        </h2>
        <p className="text-sm text-neutral-550 dark:text-neutral-400">
          Explore specialized guides combining symptoms, remedies, diseases, and diagnostics into unified health collections.
        </p>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CURATED_COLLECTIONS.map(col => {
          const IconComponent = IconLookup[col.iconName] || BookOpen;
          const isSelected = selectedCollection === col.id;
          const members = getEntitiesForCollection(col.id);

          return (
            <div
              key={col.id}
              onClick={() => setSelectedCollection(isSelected ? null : col.id)}
              className={`p-6 border rounded-3xl cursor-pointer select-none transition-all duration-300 backdrop-blur-md ${
                isSelected
                  ? "bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/30 shadow-[0_4px_24px_rgba(20,184,166,0.15)] scale-[1.01]"
                  : "bg-white/5 dark:bg-white/2 border-neutral-200 dark:border-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-750 shadow-md hover:shadow-xl hover:translate-y-[-2px]"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-2xl ${
                  isSelected ? "bg-teal-500/20 text-teal-500" : "bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400"
                } transition-colors`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 font-mono px-2 py-0.5 bg-neutral-100 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-850">
                  {members.length} items
                </span>
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1 leading-snug">
                {col.name}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                {col.description}
              </p>

              {/* Show items if selected */}
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 animate-fadeIn">
                  <span className="text-[9px] uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-1">
                    Related Knowledge Nodes:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {members.map(ent => {
                      const title = typeof ent.title === "string" ? ent.title : ent.title.en;
                      const pathMap: Record<string, string> = {
                        remedy: "remedies",
                        disease: "diseases",
                        symptom: "symptoms",
                        "lab-test": "lab-tests"
                      };
                      const section = pathMap[ent.entityType] || "remedies";
                      return (
                        <Link
                          key={ent.id}
                          href={`/knowledge/${section}/${ent.slug}`}
                          className="flex items-center gap-1 text-neutral-750 dark:text-neutral-300 hover:text-teal-500 dark:hover:text-teal-400 font-medium truncate"
                        >
                          <ArrowRight className="h-3 w-3 shrink-0 text-teal-500/60" />
                          <span className="truncate">{title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-2">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline uppercase flex items-center gap-1">
                  {isSelected ? "Collapse Details" : "View Collection"} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
