"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Stethoscope, Activity, Heart, Beaker, HelpCircle, FileText } from "lucide-react";
import { searchKnowledgeBase } from "../search/knowledgeIndex";
import { EntityType } from "../types";
import EntityCard from "./EntityCard";

interface KnowledgeSearchProps {
  initialQuery?: string;
  initialType?: EntityType | "all";
}

export default function KnowledgeSearch({
  initialQuery = "",
  initialType = "all",
}: KnowledgeSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<EntityType | "all">(initialType);
  const [results, setResults] = useState<any[]>([]);

  // Search execution
  useEffect(() => {
    const filterType = activeType === "all" ? undefined : activeType;
    const matched = searchKnowledgeBase(query, filterType);
    setResults(matched);
  }, [query, activeType]);

  const filterTabs: { type: EntityType | "all"; label: string; icon: any }[] = [
    { type: "all", label: "All Topics", icon: <FileText className="h-3.5 w-3.5" /> },
    { type: "disease", label: "Diseases", icon: <Stethoscope className="h-3.5 w-3.5" /> },
    { type: "symptom", label: "Symptoms", icon: <Activity className="h-3.5 w-3.5" /> },
    { type: "remedy", label: "Remedies", icon: <Heart className="h-3.5 w-3.5" /> },
    { type: "lab-test", label: "Lab Tests", icon: <Beaker className="h-3.5 w-3.5" /> },
    { type: "faq", label: "FAQs", icon: <HelpCircle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search symptoms, remedies, diseases, or lab tests..."
          className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-neutral-500/10 focus:border-teal-500/30 rounded-2xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none backdrop-blur-md shadow-lg transition-all duration-300"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-neutral-400 font-semibold uppercase mr-2 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Filters:
        </span>
        {filterTabs.map(tab => (
          <button
            key={tab.type}
            onClick={() => setActiveType(tab.type)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
              activeType === tab.type
                ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white/5 border-neutral-500/10 text-neutral-600 dark:text-neutral-400 hover:bg-white/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="text-xs text-neutral-400 text-center font-medium">
        Found {results.length} clinical platform {results.length === 1 ? "entity" : "entities"}
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(res => (
            <EntityCard key={res.entity.id} entity={res.entity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-neutral-500/10 bg-white/5">
          <p className="text-neutral-500 max-w-sm mx-auto text-sm">
            No matching clinical entities found. Try searching for symptoms (e.g., "heartburn", "headache") or remedies (e.g., "sulphur").
          </p>
        </div>
      )}
    </div>
  );
}
