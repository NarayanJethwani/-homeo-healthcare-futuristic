"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Stethoscope, 
  Activity, 
  FlaskConical, 
  Pill, 
  ArrowRight, 
  Eye 
} from "lucide-react";
import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity } from "../types";
import { KNOWLEDGE_RELATIONSHIPS } from "../graph/entityRelationships";

interface InteractiveSidebarProps {
  currentId: string;
  entityType: string;
}

interface GroupedRelated {
  disease: KnowledgeEntity[];
  symptom: KnowledgeEntity[];
  "lab-test": KnowledgeEntity[];
  remedy: KnowledgeEntity[];
}

export default function InteractiveSidebar({ currentId, entityType }: InteractiveSidebarProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<KnowledgeEntity[]>([]);
  const [groupedRelated, setGroupedRelated] = useState<GroupedRelated>({
    disease: [],
    symptom: [],
    "lab-test": [],
    remedy: []
  });

  useEffect(() => {
    const all = getAllKnowledgeEntities();

    // 1. Process Recently Viewed list in client-side localStorage
    try {
      const stored = localStorage.getItem("recent_knowledge_views");
      let ids: string[] = stored ? JSON.parse(stored) : [];
      
      // Update history: push current ID to front, limit to 4
      ids = [currentId, ...ids.filter(id => id !== currentId)].slice(0, 5);
      localStorage.setItem("recent_knowledge_views", JSON.stringify(ids));

      // Fetch full entity details for history items
      const recentEntities = ids
        .filter(id => id !== currentId) // exclude current page
        .map(id => all.find(e => e.id === id))
        .filter((e): e is KnowledgeEntity => !!e);
      setRecentlyViewed(recentEntities);
    } catch (err) {
      console.error("Failed to parse recently viewed history", err);
    }

    // 2. Generate categorized recommendations using the Knowledge Graph
    const neighborIds = new Set(
      KNOWLEDGE_RELATIONSHIPS.filter(rel => rel.source === currentId || rel.target === currentId)
        .map(rel => rel.source === currentId ? rel.target : rel.source)
    );

    // Fetch related published entities
    const relatedEntities = all.filter(
      e => neighborIds.has(e.id) && e.editorialStatus === "published"
    );

    // Group by entity type (limit to 3 per category to prevent sidebar bloat)
    const grouped: GroupedRelated = {
      disease: relatedEntities.filter(e => e.entityType === "disease").slice(0, 3),
      symptom: relatedEntities.filter(e => e.entityType === "symptom").slice(0, 3),
      "lab-test": relatedEntities.filter(e => e.entityType === "lab-test").slice(0, 3),
      remedy: relatedEntities.filter(e => e.entityType === "remedy").slice(0, 3)
    };

    setGroupedRelated(grouped);

  }, [currentId, entityType]);

  const getSectionPath = (type: string) => {
    const pathMap: Record<string, string> = {
      remedy: "remedies",
      disease: "diseases",
      symptom: "symptoms",
      "lab-test": "lab-tests"
    };
    return pathMap[type] || "remedies";
  };

  const hasRelated = 
    groupedRelated.disease.length > 0 || 
    groupedRelated.symptom.length > 0 || 
    groupedRelated["lab-test"].length > 0 || 
    groupedRelated.remedy.length > 0;

  return (
    <div className="space-y-5 print-hide">
      
      {/* Dynamic Graph-Driven Categorized Recommendations */}
      {hasRelated && (
        <div className="space-y-4">
          
          {/* Related Diseases */}
          {groupedRelated.disease.length > 0 && (
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-2.5 shadow-sm">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5" /> Related Diseases
              </span>
              <div className="space-y-1.5">
                {groupedRelated.disease.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/diseases/${e.slug}`}
                    className="block px-2.5 py-1.5 rounded-xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                  >
                    <h5 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-500 transition-colors truncate">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Symptoms */}
          {groupedRelated.symptom.length > 0 && (
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-2.5 shadow-sm">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Related Symptoms
              </span>
              <div className="space-y-1.5">
                {groupedRelated.symptom.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/symptoms/${e.slug}`}
                    className="block px-2.5 py-1.5 rounded-xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                  >
                    <h5 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-500 transition-colors truncate">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Tests */}
          {groupedRelated["lab-test"].length > 0 && (
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-2.5 shadow-sm">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <FlaskConical className="h-3.5 w-3.5" /> Related Tests
              </span>
              <div className="space-y-1.5">
                {groupedRelated["lab-test"].map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/lab-tests/${e.slug}`}
                    className="block px-2.5 py-1.5 rounded-xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                  >
                    <h5 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-500 transition-colors truncate">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Remedies */}
          {groupedRelated.remedy.length > 0 && (
            <div className="p-3.5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-2.5 shadow-sm">
              <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-extrabold tracking-wider flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5" /> Related Remedies
              </span>
              <div className="space-y-1.5">
                {groupedRelated.remedy.map(e => (
                  <Link
                    key={e.id}
                    href={`/knowledge/remedies/${e.slug}`}
                    className="block px-2.5 py-1.5 rounded-xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                  >
                    <h5 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-500 transition-colors truncate">
                      {typeof e.title === "string" ? e.title : e.title.en}
                    </h5>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Recently Viewed History */}
      {recentlyViewed.length > 0 && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-3 shadow-sm">
          <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> Recently Viewed
          </span>
          <div className="space-y-2">
            {recentlyViewed.map(e => {
              const title = typeof e.title === "string" ? e.title : e.title.en;
              return (
                <Link
                  key={e.id}
                  href={`/knowledge/${getSectionPath(e.entityType)}/${e.slug}`}
                  className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 dark:text-neutral-350 hover:text-teal-500 dark:hover:text-teal-400 p-1.5 rounded-lg hover:bg-neutral-100/20 dark:hover:bg-neutral-900/30 transition-all"
                >
                  <span className="truncate max-w-[150px]">{title}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 opacity-55" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Hub Directory Quick links */}
      <div className="p-4 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-3 shadow-sm text-center">
        <span className="text-[9.5px] uppercase font-bold tracking-widest text-neutral-400 block">
          Knowledge Directory
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-bold">
          <Link href="/knowledge/diseases" className="p-2 border border-neutral-200 dark:border-neutral-850 hover:border-teal-500/25 rounded-lg bg-neutral-950/20 text-neutral-700 dark:text-neutral-300">
            Diseases
          </Link>
          <Link href="/knowledge/symptoms" className="p-2 border border-neutral-200 dark:border-neutral-850 hover:border-teal-500/25 rounded-lg bg-neutral-950/20 text-neutral-700 dark:text-neutral-300">
            Symptoms
          </Link>
          <Link href="/knowledge/remedies" className="p-2 border border-neutral-200 dark:border-neutral-850 hover:border-teal-500/25 rounded-lg bg-neutral-950/20 text-neutral-700 dark:text-neutral-300">
            Remedies
          </Link>
          <Link href="/knowledge/lab-tests" className="p-2 border border-neutral-200 dark:border-neutral-850 hover:border-teal-500/25 rounded-lg bg-neutral-950/20 text-neutral-700 dark:text-neutral-300">
            Lab Tests
          </Link>
        </div>
      </div>

    </div>
  );
}
