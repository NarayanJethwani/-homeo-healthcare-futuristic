"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, User, Flame, ArrowRight, Eye } from "lucide-react";
import { getAllKnowledgeEntities } from "../index";
import { KnowledgeEntity } from "../types";

interface InteractiveSidebarProps {
  currentId: string;
  entityType: string;
}

export default function InteractiveSidebar({ currentId, entityType }: InteractiveSidebarProps) {
  const [recentlyViewed, setRecentlyViewed] = useState<KnowledgeEntity[]>([]);
  const [recommendations, setRecommendations] = useState<KnowledgeEntity[]>([]);

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

    // 2. Generate dynamic "People Also Read" recommendations based on matching entity types/tags
    const currentEntity = all.find(e => e.id === currentId);
    const related = all
      .filter(e => e.id !== currentId && e.editorialStatus === "published")
      .filter(e => {
        // Match either same entity type or share at least one tag
        const matchType = e.entityType === entityType;
        const matchTags = e.tags.some(t => currentEntity?.tags.includes(t));
        return matchType || matchTags;
      })
      .slice(0, 4);
    setRecommendations(related);

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

  return (
    <div className="space-y-6 print-hide">
      
      {/* 1. People Also Read Widget */}
      {recommendations.length > 0 && (
        <div className="p-4 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-3 shadow-sm">
          <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold tracking-wider flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-teal-500 animate-pulse" /> People Also Read
          </span>
          <div className="space-y-2">
            {recommendations.map(e => {
              const title = typeof e.title === "string" ? e.title : e.title.en;
              const summary = typeof e.summary === "string" ? e.summary : e.summary.en;
              return (
                <Link
                  key={e.id}
                  href={`/knowledge/${getSectionPath(e.entityType)}/${e.slug}`}
                  className="block p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-950/40 hover:bg-teal-500/5 hover:border-teal-500/20 border border-transparent transition-all group"
                >
                  <h5 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-teal-500 transition-colors truncate">
                    {title}
                  </h5>
                  <p className="text-[9.5px] text-neutral-500 truncate leading-relaxed">
                    {summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Recently Viewed History */}
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

      {/* 3. Category Hub Directory Quick links */}
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
