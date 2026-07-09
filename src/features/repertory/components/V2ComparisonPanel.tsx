"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Brain, GitCompareArrows, ExternalLink } from "lucide-react";
import { V2ClinicalFeedbackPanel } from "./V2ClinicalFeedbackPanel";
import { getKnowledgeLinkForRemedy } from "@/features/knowledge/governance/clinicalOsIntegration";

interface V2ComparisonPanelProps {
  query: string;
  filters: Record<string, string>;
  selectedRubricIds: string[];
}

function rubricList(items: any[] = []) {
  if (items.length === 0) return <p className="text-[10px] font-bold text-slate-400">No rubrics.</p>;
  return (
    <ol className="space-y-1.5">
      {items.slice(0, 10).map((rubric, index) => (
        <li key={`${rubric.id}-${index}`} className="rounded-xl border border-slate-100 bg-white p-2 text-left">
          <div className="text-[9px] font-black text-slate-400">#{index + 1}</div>
          <div className="text-[11px] font-black text-slate-800">{rubric.title}</div>
          <div className="mt-1 flex flex-wrap gap-1 text-[8px] font-bold uppercase text-slate-400">
            {rubric.organSystem && <span>{rubric.organSystem}</span>}
            {rubric.score !== undefined && <span>Score {rubric.score}</span>}
            {(rubric.synonymMatchCount || 0) > 0 && <span>Synonyms {rubric.synonymMatchCount}</span>}
            {rubric.breadcrumb && <span>{rubric.breadcrumb}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// Knowledge Platform integration is read-only and must not alter clinical decision logic.

function rankingList(items: any[] = []) {
  if (items.length === 0) return <p className="text-[10px] font-bold text-slate-400">No remedy ranking.</p>;
  return (
    <div className="space-y-1.5">
      {items.slice(0, 5).map((ranking: any, index: number) => {
        const link = getKnowledgeLinkForRemedy(ranking.remedyId);
        const name = ranking.remedyName || ranking.remedyId;
        
        return (
          <div key={`${ranking.remedyId}-${index}`} className="rounded-xl border border-slate-100 bg-white p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-black text-slate-800 flex items-center gap-1">
                #{index + 1}{" "}
                {link.found ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 underline flex items-center gap-0.5"
                    title={`View ${name} on Knowledge Platform`}
                  >
                    {name}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="text-slate-700" title="Knowledge article pending">
                    {name}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-black text-emerald-600">{ranking.totalScore}</span>
            </div>
            {ranking.whyRanked?.[0] && <p className="mt-1 text-[9px] font-semibold text-slate-500">{ranking.whyRanked[0]}</p>}
          </div>
        );
      })}
    </div>
  );
}

export function V2ComparisonPanel({ query, filters, selectedRubricIds }: V2ComparisonPanelProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);
  const selectedRubricIdsKey = useMemo(() => selectedRubricIds.join("|"), [selectedRubricIds]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("/api/repertory/v2-compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: JSON.parse(filtersKey),
          selectedRubricIds: selectedRubricIdsKey ? selectedRubricIdsKey.split("|") : [],
        }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Comparison failed.");
        setData(result);
      } catch (err: any) {
        setError(err?.message || "Comparison failed.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query, filtersKey, selectedRubricIdsKey]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500">Loading V1 vs V2 comparison...</div>;
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">
        <AlertTriangle className="mb-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
            <GitCompareArrows className="h-4 w-4 text-emerald-600" />
            Compare V1 vs V2
          </div>
          <p className="mt-1 text-[10px] font-semibold text-slate-500">Query: {data.query || "all active rubrics"}</p>
        </div>
        <div className="flex gap-2 text-[9px] font-black uppercase text-slate-500">
          <span>V1 {data.v1.count} in {data.v1.latencyMs}ms</span>
          <span>V2 {data.v2.count} in {data.v2.latencyMs}ms</span>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-700">V1 Current Search</h4>
          {rubricList(data.v1.topRubrics)}
          <h5 className="mb-2 mt-3 text-[10px] font-black uppercase tracking-wider text-slate-500">V1 Remedy Ranking</h5>
          {rankingList(data.v1.rankings)}
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-3">
          <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-emerald-800">V2 Clinical Search</h4>
          {rubricList(data.v2.topRubrics)}
          <h5 className="mb-2 mt-3 text-[10px] font-black uppercase tracking-wider text-emerald-700">V2 Remedy Ranking</h5>
          {rankingList(data.v2.repertorization.rankings)}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <h5 className="text-[10px] font-black uppercase text-slate-500">Common Rubrics</h5>
          {rubricList(data.comparison.commonRubrics)}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <h5 className="text-[10px] font-black uppercase text-slate-500">V1-only Rubrics</h5>
          {rubricList(data.comparison.v1OnlyRubrics)}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <h5 className="text-[10px] font-black uppercase text-slate-500">V2-only Rubrics</h5>
          {rubricList(data.comparison.v2OnlyRubrics)}
        </div>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-blue-800">
          <Brain className="h-3.5 w-3.5" />
          Clinical Explanation
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[10px] font-semibold text-blue-900">
          {data.comparison.clinicalExplanation?.map((item: string, index: number) => <li key={index}>{item}</li>)}
        </ul>
      </div>
      <V2ClinicalFeedbackPanel
        payloadBase={{
          mode: "compare",
          query: data.query,
          filters: data.filters,
          v1TopRubricIds: data.v1.topRubrics.map((rubric: any) => rubric.id),
          v2TopRubricIds: data.v2.topRubrics.map((rubric: any) => rubric.id),
          v2TopRemedyIds: data.v2.repertorization.rankings.map((ranking: any) => ranking.remedyId),
          comparisonSummary: {
            commonRubricIds: data.comparison.commonRubrics.map((rubric: any) => rubric.id),
            v1OnlyRubricIds: data.comparison.v1OnlyRubrics.map((rubric: any) => rubric.id),
            v2OnlyRubricIds: data.comparison.v2OnlyRubrics.map((rubric: any) => rubric.id),
          },
        }}
      />
    </div>
  );
}
