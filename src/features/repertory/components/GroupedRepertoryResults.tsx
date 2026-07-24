"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronRight, Layers, Plus } from "lucide-react";
import type { Rubric } from "@/lib/repertoryData";
import { isRubricScoringEnabled } from "@/features/repertory/scoring/repertoryScoringPolicy";

export type RepertoryRubricGroup = {
  key: string;
  label: string;
  rubrics: Rubric[];
};

const sourcePresentation: Record<
  NonNullable<Rubric["source"]>,
  { badge: string; label: string; className: string }
> = {
  kent: { badge: "K", label: "Kent", className: "bg-sky-50 text-sky-700 border-sky-100" },
  boericke: { badge: "B", label: "Boericke", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  clarke: { badge: "C", label: "Clarke", className: "bg-amber-50 text-amber-700 border-amber-100" },
  boger: { badge: "BB", label: "Boger–Bönninghausen", className: "bg-violet-50 text-violet-700 border-violet-100" },
  knerr: { badge: "KN", label: "Knerr–Hering", className: "bg-rose-50 text-rose-700 border-rose-100" },
  boenninghausen: { badge: "TPB", label: "Bönninghausen TPB", className: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  gentry: { badge: "G", label: "Gentry Concordance", className: "bg-slate-50 text-slate-700 border-slate-200" },
  synoptic: { badge: "SK", label: "Boger Synoptic Key", className: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" },
  jahr: { badge: "J", label: "Jahr Clinical", className: "bg-orange-50 text-orange-700 border-orange-100" },
};

function normalizeRubricWording(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:see|compare|comp)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function groupRepertoryRubrics(
  rubrics: Rubric[],
  groupAcrossSources: boolean,
): RepertoryRubricGroup[] {
  if (!groupAcrossSources) {
    return rubrics.map((rubric) => ({
      key: rubric.id,
      label: rubric.name,
      rubrics: [rubric],
    }));
  }

  const groups = new Map<string, RepertoryRubricGroup>();
  for (const rubric of rubrics) {
    const wordingKey = normalizeRubricWording(rubric.name) || rubric.id;
    const existing = groups.get(wordingKey);
    if (existing) {
      existing.rubrics.push(rubric);
    } else {
      groups.set(wordingKey, {
        key: `wording:${wordingKey}`,
        label: rubric.name,
        rubrics: [rubric],
      });
    }
  }
  return Array.from(groups.values());
}

function SourceBadge({ source }: { source: Rubric["source"] }) {
  const presentation = source ? sourcePresentation[source] : sourcePresentation.boericke;
  return (
    <span
      title={presentation.label}
      className={`flex-none rounded border px-1.5 py-0.5 font-mono text-[8px] font-black tracking-wider ${presentation.className}`}
    >
      {presentation.badge}
    </span>
  );
}

type GroupedRepertoryResultsProps = {
  rubrics: Rubric[];
  groupAcrossSources: boolean;
  expandedGroupKey: string | null;
  onToggleGroup: (key: string) => void;
  onAddRubric: (rubric: Rubric) => void;
  query: string;
  showChapter: boolean;
  renderHighlighted: (text: string, query: string) => ReactNode;
};

export function GroupedRepertoryResults({
  rubrics,
  groupAcrossSources,
  expandedGroupKey,
  onToggleGroup,
  onAddRubric,
  query,
  showChapter,
  renderHighlighted,
}: GroupedRepertoryResultsProps) {
  const groups = groupRepertoryRubrics(rubrics, groupAcrossSources);

  const renderRubric = (rubric: Rubric, nested = false) => {
    const isClarke = rubric.source === "clarke";
    const canScore = isRubricScoringEnabled(rubric);
    return (
      <button
        key={rubric.id}
        type="button"
        onClick={() => onAddRubric(rubric)}
        title={rubric.citation || "Add source-specific rubric to the case"}
        className={`group flex w-full items-center justify-between rounded-xl border bg-white/70 px-3 py-2 text-left text-xs font-semibold transition ${
          nested
            ? "border-slate-100 hover:border-teal-200 hover:bg-teal-50/50"
            : isClarke
              ? "border-transparent border-l-4 border-l-amber-300 hover:border-amber-200 hover:bg-amber-50"
              : "border-transparent border-l-4 hover:border-teal-200 hover:border-l-teal-400 hover:bg-teal-50/50"
        }`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
          <SourceBadge source={rubric.source} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-slate-700 group-hover:text-slate-900">
              {renderHighlighted(rubric.name, query)}
            </span>
            {(showChapter || nested) && (
              <span className="truncate font-mono text-[8px] font-semibold text-slate-400">
                {rubric.chapter}
                {nested && rubric.citation ? ` · ${rubric.citation}` : ""}
              </span>
            )}
          </span>
        </span>
        {isClarke ? (
          <span className="flex flex-none items-center gap-1 text-[8px] font-black uppercase tracking-wide text-amber-700">
            <Plus className="h-3 w-3" />
            {canScore ? "Add" : "Reference"}
          </span>
        ) : (
          <Plus className="h-3.5 w-3.5 flex-none text-teal-500 opacity-0 transition group-hover:opacity-100" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-1.5">
      {groups.map((group) => {
        if (group.rubrics.length === 1) return renderRubric(group.rubrics[0]);
        const isExpanded = expandedGroupKey === group.key;
        const sources = group.rubrics
          .map((rubric) => rubric.source)
          .filter((source, index, allSources) => source && allSources.indexOf(source) === index);
        return (
          <div key={group.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white/70">
            <button
              type="button"
              onClick={() => onToggleGroup(group.key)}
              aria-expanded={isExpanded}
              className="group flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-slate-50"
            >
              {isExpanded
                ? <ChevronDown className="h-3.5 w-3.5 flex-none text-slate-400" />
                : <ChevronRight className="h-3.5 w-3.5 flex-none text-slate-400" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-slate-800">
                  {renderHighlighted(group.label, query)}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[8px] font-semibold text-slate-400">
                  <Layers className="h-3 w-3" />
                  {group.rubrics.length} source-specific rubrics · grades kept separate
                </span>
              </span>
              <span className="flex flex-none -space-x-0.5">
                {sources.slice(0, 4).map((source) => <SourceBadge key={source} source={source} />)}
                {sources.length > 4 && (
                  <span className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[8px] font-black text-slate-500">
                    +{sources.length - 4}
                  </span>
                )}
              </span>
            </button>
            {isExpanded && (
              <div className="space-y-1 border-t border-slate-100 bg-slate-50/60 p-2">
                <p className="px-1 pb-1 text-[8px] font-semibold leading-relaxed text-slate-500">
                  Choose the exact source entry. Its original remedies, grading, and citation will travel with the case.
                </p>
                {group.rubrics.map((rubric) => renderRubric(rubric, true))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
