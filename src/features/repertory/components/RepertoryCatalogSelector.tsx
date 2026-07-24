"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Database,
  Info,
  Search,
  Star,
  X,
} from "lucide-react";

export type ClassicalRepertoryId =
  | "kent"
  | "boericke"
  | "clarke"
  | "boger"
  | "knerr"
  | "boenninghausen"
  | "combined";

export type RepertoryCatalogEntry = {
  id: ClassicalRepertoryId;
  label: string;
  shortLabel: string;
  author: string;
  year: string;
  group: "Foundational repertories" | "Clinical repertories" | "Synthesized repertories" | "Search scope";
  description: string;
  scoringLabel: string;
  scoringDetail: string;
  count: number;
  accent: "sky" | "emerald" | "amber" | "violet" | "rose" | "cyan" | "slate";
};

const preferenceStorageKey = "homeo.classical-repertory-catalog.v1";
const maximumRecentRepertories = 5;

export const repertoryCatalogBase: Array<Omit<RepertoryCatalogEntry, "count">> = [
  {
    id: "kent",
    label: "Kent’s Repertory",
    shortLabel: "Kent",
    author: "James Tyler Kent",
    year: "1897",
    group: "Foundational repertories",
    description: "General repertory arranged in the Kentian hierarchy.",
    scoringLabel: "Graded scoring",
    scoringDetail: "Source grades contribute directly to the remedy comparison matrix.",
    accent: "sky",
  },
  {
    id: "boericke",
    label: "Boericke Repertory",
    shortLabel: "Boericke",
    author: "William Boericke",
    year: "1927",
    group: "Foundational repertories",
    description: "Clinical repertory accompanying Boericke’s Pocket Manual.",
    scoringLabel: "Graded scoring",
    scoringDetail: "Source grades contribute directly to the remedy comparison matrix.",
    accent: "emerald",
  },
  {
    id: "boenninghausen",
    label: "Bönninghausen’s Therapeutic Pocket Book",
    shortLabel: "Bönninghausen TPB",
    author: "C. M. F. von Bönninghausen",
    year: "1846",
    group: "Foundational repertories",
    description: "The original Therapeutic Pocket Book, using its five printed remedy classes.",
    scoringLabel: "Five-grade scoring",
    scoringDetail: "CAPITAL 5, small capitals 4, italic 3, roman 2, parenthesized roman 1.",
    accent: "cyan",
  },
  {
    id: "knerr",
    label: "Knerr’s Repertory of Hering’s Guiding Symptoms",
    shortLabel: "Knerr–Hering",
    author: "Calvin B. Knerr",
    year: "1896",
    group: "Foundational repertories",
    description: "Hering’s Guiding Symptoms indexed across its original sections.",
    scoringLabel: "Five-grade scoring",
    scoringDetail: "Printed distinctions are preserved from unmarked occurrence 1 through double heavy 5.",
    accent: "rose",
  },
  {
    id: "clarke",
    label: "Clarke Clinical Repertory",
    shortLabel: "Clarke Clinical",
    author: "John Henry Clarke",
    year: "1904",
    group: "Clinical repertories",
    description: "Clinical rubrics with source-verified remedy occurrences.",
    scoringLabel: "Occurrence scoring",
    scoringDetail: "Each listed remedy receives one point; unreliable grades are not invented.",
    accent: "amber",
  },
  {
    id: "boger",
    label: "Boger–Bönninghausen Repertory",
    shortLabel: "Boger–Bönninghausen",
    author: "Cyrus Maxwell Boger",
    year: "1905",
    group: "Synthesized repertories",
    description: "Boger’s synthesis of Bönninghausen’s characteristics and repertory.",
    scoringLabel: "Five-grade scoring",
    scoringDetail: "Printed remedy distinctions are preserved from parenthesized roman 1 through CAPITAL 5.",
    accent: "violet",
  },
  {
    id: "combined",
    label: "All Governed Sources",
    shortLabel: "All sources",
    author: "Governed repertory catalogue",
    year: "Live",
    group: "Search scope",
    description: "Search every activated repertory while preserving source-specific grades and citations.",
    scoringLabel: "Grouped multi-source search",
    scoringDetail: "Equivalent wording is grouped visually; remedies and grades remain separate by source.",
    accent: "slate",
  },
];

export function updateRecentRepertories(
  current: ClassicalRepertoryId[],
  selected: ClassicalRepertoryId,
): ClassicalRepertoryId[] {
  return [selected, ...current.filter((id) => id !== selected)].slice(0, maximumRecentRepertories);
}

export function toggleFavouriteRepertory(
  current: ClassicalRepertoryId[],
  selected: ClassicalRepertoryId,
): ClassicalRepertoryId[] {
  return current.includes(selected)
    ? current.filter((id) => id !== selected)
    : [...current, selected];
}

function accentClasses(accent: RepertoryCatalogEntry["accent"]): string {
  const classes: Record<RepertoryCatalogEntry["accent"], string> = {
    sky: "bg-sky-50 text-sky-700 border-sky-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    violet: "bg-violet-50 text-violet-700 border-violet-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return classes[accent];
}

function loadPreferences(validIds: Set<ClassicalRepertoryId>): {
  favourites: ClassicalRepertoryId[];
  recents: ClassicalRepertoryId[];
} {
  if (typeof window === "undefined") return { favourites: [], recents: [] };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(preferenceStorageKey) || "{}") as {
      favourites?: string[];
      recents?: string[];
    };
    return {
      favourites: (parsed.favourites || []).filter((id): id is ClassicalRepertoryId =>
        validIds.has(id as ClassicalRepertoryId)
      ),
      recents: (parsed.recents || []).filter((id): id is ClassicalRepertoryId =>
        validIds.has(id as ClassicalRepertoryId)
      ).slice(0, maximumRecentRepertories),
    };
  } catch {
    return { favourites: [], recents: [] };
  }
}

type RepertoryCatalogSelectorProps = {
  items: RepertoryCatalogEntry[];
  value: ClassicalRepertoryId;
  onChange: (value: ClassicalRepertoryId) => void;
};

export function RepertoryCatalogSelector({
  items,
  value,
  onChange,
}: RepertoryCatalogSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favourites, setFavourites] = useState<ClassicalRepertoryId[]>([]);
  const [recents, setRecents] = useState<ClassicalRepertoryId[]>([]);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const active = items.find((item) => item.id === value) || items[0];
  const validIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  useEffect(() => {
    const saved = loadPreferences(validIds);
    setFavourites(saved.favourites);
    setRecents(saved.recents);
    setPreferencesLoaded(true);
  }, [validIds]);

  useEffect(() => {
    if (!preferencesLoaded || typeof window === "undefined") return;
    window.localStorage.setItem(
      preferenceStorageKey,
      JSON.stringify({ favourites, recents }),
    );
  }, [favourites, recents, preferencesLoaded]);

  useEffect(() => {
    if (!preferencesLoaded) return;
    setRecents((current) => updateRecentRepertories(current, value));
  }, [preferencesLoaded, value]);

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const normalizedQuery = query.trim().toLowerCase();
  const matchingItems = items.filter((item) => {
    if (!normalizedQuery) return true;
    return [
      item.label,
      item.shortLabel,
      item.author,
      item.year,
      item.group,
      item.description,
      item.scoringLabel,
    ].some((valueToSearch) => valueToSearch.toLowerCase().includes(normalizedQuery));
  });

  const selectItem = (id: ClassicalRepertoryId) => {
    setRecents((current) => updateRecentRepertories(current, id));
    onChange(id);
    setIsOpen(false);
    setQuery("");
  };

  const renderItem = (item: RepertoryCatalogEntry, context: string) => {
    const isActive = item.id === value;
    const isFavourite = favourites.includes(item.id);
    return (
      <div
        key={`${context}-${item.id}`}
        className={`group flex items-stretch rounded-xl border transition-colors ${
          isActive
            ? "border-teal-300 bg-teal-50/70"
            : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
        }`}
      >
        <button
          type="button"
          onClick={() => selectItem(item.id)}
          className="min-w-0 flex-1 px-3 py-2.5 text-left"
        >
          <span className="flex items-center gap-2">
            <span className={`rounded-md border px-1.5 py-0.5 text-[8px] font-black uppercase ${accentClasses(item.accent)}`}>
              {item.year}
            </span>
            <span className="truncate text-[11px] font-extrabold text-slate-800">{item.label}</span>
            {isActive && <Check className="ml-auto h-3.5 w-3.5 flex-none text-teal-600" />}
          </span>
          <span className="mt-1 block truncate text-[9px] font-semibold text-slate-500">
            {item.author} · {item.count.toLocaleString()} rubrics · {item.scoringLabel}
          </span>
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setFavourites((current) => toggleFavouriteRepertory(current, item.id));
          }}
          aria-label={isFavourite ? `Remove ${item.label} from favourites` : `Add ${item.label} to favourites`}
          title={isFavourite ? "Remove from favourites" : "Add to favourites"}
          className="flex w-10 flex-none items-center justify-center rounded-r-xl text-slate-300 hover:bg-white hover:text-amber-500"
        >
          <Star className={`h-3.5 w-3.5 ${isFavourite ? "fill-amber-400 text-amber-500" : ""}`} />
        </button>
      </div>
    );
  };

  const favouriteItems = matchingItems.filter((item) => favourites.includes(item.id));
  const recentItems = recents
    .map((id) => matchingItems.find((item) => item.id === id))
    .filter((item): item is RepertoryCatalogEntry => Boolean(item));
  const groupedItems = repertoryCatalogBase
    .map((base) => base.group)
    .filter((group, index, groups) => groups.indexOf(group) === index)
    .map((group) => ({
      group,
      items: matchingItems.filter((item) => item.group === group),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <div ref={containerRef} className={`relative min-w-0 ${isOpen ? "z-[120]" : ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md"
      >
        <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl border ${accentClasses(active.accent)}`}>
          {active.id === "combined" ? <Database className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-black text-slate-900">{active.label}</span>
          <span className="mt-0.5 block truncate text-[9px] font-semibold text-slate-500">
            {active.year} · {active.count.toLocaleString()} rubrics · {active.scoringLabel}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 flex-none text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Choose a repertory"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-[120] flex max-h-[min(680px,75vh)] w-[min(620px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/5 backdrop-blur-xl"
        >
          <div className="border-b border-slate-100 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-800">Repertory catalogue</p>
                <p className="text-[9px] font-semibold text-slate-500">Choose one source or search all governed sources.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close repertory catalogue"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="relative mt-3 block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search title, author, year, or scoring method…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-[11px] font-semibold outline-none transition focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </label>
          </div>

          <div data-lenis-prevent className="space-y-4 overflow-y-auto p-3">
            {favouriteItems.length > 0 && (
              <section>
                <h4 className="mb-1.5 flex items-center gap-1.5 px-1 text-[8px] font-black uppercase tracking-[0.16em] text-amber-600">
                  <Star className="h-3 w-3 fill-amber-400" /> Favourites
                </h4>
                <div className="space-y-1">{favouriteItems.map((item) => renderItem(item, "favourite"))}</div>
              </section>
            )}

            {recentItems.length > 0 && !normalizedQuery && (
              <section>
                <h4 className="mb-1.5 flex items-center gap-1.5 px-1 text-[8px] font-black uppercase tracking-[0.16em] text-slate-500">
                  <Clock3 className="h-3 w-3" /> Recently used
                </h4>
                <div className="space-y-1">{recentItems.map((item) => renderItem(item, "recent"))}</div>
              </section>
            )}

            {groupedItems.map((section) => (
              <section key={section.group}>
                <h4 className="mb-1.5 px-1 text-[8px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {section.group}
                </h4>
                <div className="space-y-1">{section.items.map((item) => renderItem(item, section.group))}</div>
              </section>
            ))}

            {matchingItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                <Search className="mx-auto h-5 w-5 text-slate-300" />
                <p className="mt-2 text-[10px] font-bold text-slate-500">No repertories match “{query}”.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function RepertorySourceSummary({ item }: { item: RepertoryCatalogEntry }) {
  return (
    <div className="flex min-h-[62px] min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl border ${accentClasses(item.accent)}`}>
        <Info className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="truncate text-[10px] font-black text-slate-800">{item.shortLabel}</span>
          <span className={`rounded-md border px-1.5 py-0.5 text-[7px] font-black uppercase ${accentClasses(item.accent)}`}>
            {item.scoringLabel}
          </span>
        </span>
        <span className="mt-1 block text-[8px] font-semibold leading-relaxed text-slate-500">
          {item.scoringDetail}
        </span>
      </span>
    </div>
  );
}
