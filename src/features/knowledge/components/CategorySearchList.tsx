"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { KnowledgeEntity } from "../types";
import EntityCard from "./EntityCard";

interface CategorySearchListProps {
  entities: KnowledgeEntity[];
  placeholder?: string;
  emptyMessage?: string;
}

export default function CategorySearchList({
  entities,
  placeholder = "Search...",
  emptyMessage = "No matching clinical profiles found."
}: CategorySearchListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entities;

    const term = searchQuery.toLowerCase().trim();
    return entities.filter(entity => {
      const title = typeof entity.title === "string" 
        ? entity.title 
        : (entity.title?.en || "");
      const summary = typeof entity.summary === "string" 
        ? entity.summary 
        : (entity.summary?.en || "");
      
      const titleMatch = title.toLowerCase().includes(term);
      const summaryMatch = summary.toLowerCase().includes(term);
      const tagMatch = entity.tags.some(tag => tag.toLowerCase().includes(term));

      return titleMatch || summaryMatch || tagMatch;
    });
  }, [entities, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative max-w-xl mx-auto z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 focus:border-teal-500/30 rounded-xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none backdrop-blur-md transition-all duration-300 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results Count Feedback */}
      <div className="text-[11px] text-neutral-400 font-medium text-center">
        Showing {filteredEntities.length} of {entities.length} clinical profiles
      </div>

      {/* Results Grid */}
      {filteredEntities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {filteredEntities.map(entity => (
            <EntityCard key={entity.id} entity={entity} highlightQuery={searchQuery} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-neutral-500/10 bg-white/5">
          <p className="text-neutral-500 max-w-sm mx-auto text-sm">
            {emptyMessage}
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 px-3 py-1.5 text-xs rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 border border-teal-500/20 font-bold transition-all cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
}
