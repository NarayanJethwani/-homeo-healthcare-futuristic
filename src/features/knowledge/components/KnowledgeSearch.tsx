"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, Stethoscope, Activity, Heart, Beaker, HelpCircle, FileText, Clock, X, Sparkles, TrendingUp } from "lucide-react";
import { searchKnowledgeBase } from "../search/knowledgeIndex";
import { EntityType } from "../types";
import EntityCard from "./EntityCard";
import { trackSearch } from "../analytics/knowledgeAnalytics";

interface KnowledgeSearchProps {
  initialQuery?: string;
  initialType?: EntityType | "all";
}

const POPULAR_SEARCHES = ["GERD", "Sulphur", "IBS", "Arnica", "Eczema", "Headache", "CBC", "TSH"];

const EMPTY_SUGGESTIONS = [
  { term: "Acid Reflux", type: "symptom" },
  { term: "Atopic Dermatitis", type: "disease" },
  { term: "Arsenicum Album", type: "remedy" },
  { term: "Thyroid Profile", type: "lab-test" },
];

export default function KnowledgeSearch({
  initialQuery = "",
  initialType = "all",
}: KnowledgeSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<EntityType | "all">(initialType);
  const [results, setResults] = useState<any[]>(() => 
    searchKnowledgeBase(initialQuery, initialType === "all" ? undefined : initialType)
  );
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("homeo_recent_searches");
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse recent searches", e);
        }
      }
    }
  }, []);

  // Save query to recent searches
  const saveSearchQuery = (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) return;
    const cleanQuery = searchQuery.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== cleanQuery.toLowerCase());
      const updated = [cleanQuery, ...filtered].slice(0, 5); // limit to 5
      if (typeof window !== "undefined") {
        localStorage.setItem("homeo_recent_searches", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Search execution
  useEffect(() => {
    const filterType = activeType === "all" ? undefined : activeType;
    const matched = searchKnowledgeBase(query, filterType);
    setResults(matched);

    // Compute autocomplete instant suggestions
    if (query.trim().length > 1) {
      const filteredSuggestions = matched
        .slice(0, 5)
        .map(res => ({
          id: res.entity.id,
          title: typeof res.entity.title === "string" ? res.entity.title : (res.entity.title?.en || ""),
          slug: res.entity.slug,
          type: res.entity.entityType
        }));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, activeType]);

  // Debounced search query analytics logging & history saving
  useEffect(() => {
    if (!query || query.trim().length === 0) return;
    const timer = setTimeout(() => {
      const filterType = activeType === "all" ? undefined : activeType;
      const matched = searchKnowledgeBase(query, filterType);
      trackSearch(query, matched.length, activeType);
      saveSearchQuery(query);
    }, 1200);
    return () => clearTimeout(timer);
  }, [query, activeType]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("homeo_recent_searches");
    }
  };

  const selectSuggestion = (term: string) => {
    setQuery(term);
    setIsFocused(false);
  };

  const filterTabs: { type: EntityType | "all"; label: string; icon: any }[] = [
    { type: "all", label: "All Topics", icon: <FileText className="h-3.5 w-3.5" /> },
    { type: "disease", label: "Diseases", icon: <Stethoscope className="h-3.5 w-3.5" /> },
    { type: "symptom", label: "Symptoms", icon: <Activity className="h-3.5 w-3.5" /> },
    { type: "remedy", label: "Remedies", icon: <Heart className="h-3.5 w-3.5" /> },
    { type: "lab-test", label: "Lab Tests", icon: <Beaker className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-8" ref={searchContainerRef}>
      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto z-30">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search symptoms, remedies, diseases, or lab tests..."
          className="w-full pl-11 pr-10 py-3.5 bg-white/5 border border-neutral-500/10 focus:border-teal-500/30 rounded-2xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 outline-none backdrop-blur-md shadow-lg transition-all duration-300"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Suggestions & Recent Searches Dropdown Panel */}
        {isFocused && (query.trim().length > 1 || recentSearches.length > 0) && (
          <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl shadow-2xl backdrop-blur-xl z-50">
            {/* Auto-suggestions */}
            {query.trim().length > 1 && suggestions.length > 0 && (
              <div className="mb-3 space-y-1">
                <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold tracking-wider px-2 block mb-1">
                  Instant Suggestions
                </span>
                {suggestions.map(sug => {
                  let badgeStyle = "bg-neutral-100 dark:bg-neutral-900 text-neutral-500 border-neutral-200 dark:border-neutral-800";
                  if (sug.type === "disease") badgeStyle = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
                  else if (sug.type === "symptom") badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
                  else if (sug.type === "remedy") badgeStyle = "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
                  else if (sug.type === "lab-test") badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

                  return (
                    <button
                      key={sug.id}
                      onClick={() => selectSuggestion(sug.title)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl flex items-center justify-between text-neutral-700 dark:text-neutral-300 transition-colors"
                    >
                      <span className="font-semibold">{sug.title}</span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 border rounded font-bold tracking-wide ${badgeStyle}`}>
                        {sug.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[9px] text-rose-500 hover:underline font-semibold"
                  >
                    Clear History
                  </button>
                </div>
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectSuggestion(term)}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl text-neutral-600 dark:text-neutral-400 flex items-center gap-2 transition-colors"
                  >
                    <Clock className="h-3 w-3 opacity-60" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Searches Pills */}
      <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
        <span className="flex items-center gap-1 font-bold text-[10px] uppercase text-neutral-400">
          <TrendingUp className="h-3.5 w-3.5 text-teal-500" /> Popular:
        </span>
        {POPULAR_SEARCHES.map(term => (
          <button
            key={term}
            onClick={() => setQuery(term)}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-neutral-850 hover:bg-teal-500/10 hover:border-teal-500/35 transition-all text-neutral-700 dark:text-neutral-350 cursor-pointer font-medium"
          >
            {term}
          </button>
        ))}
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
                ? "bg-teal-650 border-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white/5 border-neutral-500/10 text-neutral-600 dark:text-neutral-400 hover:bg-white/10"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Results Count & Visual feedback */}
      <div className="text-xs text-neutral-400 text-center font-medium">
        Found {results.length} clinical platform {results.length === 1 ? "entity" : "entities"}
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(res => (
            <EntityCard key={res.entity.id} entity={res.entity} highlightQuery={query} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 rounded-3xl border border-dashed border-neutral-500/10 bg-white/5">
          <p className="text-neutral-500 max-w-sm mx-auto text-sm">
            No matching clinical entities found. Try searching for symptoms (e.g., "Heartburn", "Fatigue") or remedies (e.g., "Sulphur", "Arnica").
          </p>

          {/* Empty state suggestions */}
          <div className="mt-6 max-w-md mx-auto">
            <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold tracking-wider block mb-3 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" /> Suggested Search Terms
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {EMPTY_SUGGESTIONS.map(sug => (
                <button
                  key={sug.term}
                  onClick={() => setQuery(sug.term)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-neutral-200 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-350 hover:bg-teal-500/15 transition-colors border border-neutral-300 dark:border-neutral-800"
                >
                  {sug.term} ({sug.type})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
