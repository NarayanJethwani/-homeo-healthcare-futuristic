"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Brain, ExternalLink } from "lucide-react";
import { ClinicalSafetyBadge } from "./ClinicalSafetyBadge";
import { V2ClinicalFeedbackPanel } from "./V2ClinicalFeedbackPanel";
import { getKnowledgeLinkForRemedy } from "@/features/knowledge/governance/clinicalOsIntegration";

interface V2LivePanelProps {
  query: string;
  filters: Record<string, string>;
  selectedRubricIds: string[];
}

export function V2LivePanel({ query, filters, selectedRubricIds }: V2LivePanelProps) {
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
        const response = await fetch("/api/repertory/v2-live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          filters: JSON.parse(filtersKey),
          selectedRubricIds: selectedRubricIdsKey ? selectedRubricIdsKey.split("|") : [],
        }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "V2 Clinical mode failed.");
        setData(result);
      } catch (err: any) {
        setError(err?.message || "V2 Clinical mode failed.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [query, filtersKey, selectedRubricIdsKey]);

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500">Loading V2 Clinical mode...</div>;
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

  const topRanking = data.repertorization.rankings?.[0];

  return (
    <div className="space-y-4 rounded-3xl border border-emerald-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
            <Activity className="h-4 w-4" />
            V2 Clinical Mode
          </div>
          <p className="mt-1 text-[10px] font-semibold text-slate-500">Query: {data.query || "all active rubrics"}</p>
        </div>
        <ClinicalSafetyBadge />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-slate-700">V2 Rubric Results</h4>
          <div className="space-y-2">
            {data.search.topRubrics.map((rubric: any, index: number) => (
              <div key={rubric.id} className="rounded-xl border border-slate-100 bg-white p-2">
                <div className="text-[9px] font-black text-slate-400">#{index + 1} Score {rubric.score ?? 0}</div>
                <div className="text-[11px] font-black text-slate-800">{rubric.title}</div>
                <div className="mt-1 flex flex-wrap gap-1 text-[8px] font-bold uppercase text-slate-400">
                  {rubric.breadcrumb && <span>{rubric.breadcrumb}</span>}
                  {(rubric.synonymMatchCount || 0) > 0 && <span>Synonym matches {rubric.synonymMatchCount}</span>}
                  {rubric.organSystem && <span>{rubric.organSystem}</span>}
                </div>
              </div>
            ))}
          </div>
          {/* Knowledge Platform integration is read-only and must not alter clinical decision logic. */}
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3">
          <h4 className="mb-2 text-[11px] font-black uppercase tracking-wider text-emerald-800">V2 Remedy Ranking</h4>
          <div className="space-y-2">
            {data.repertorization.rankings.map((ranking: any, index: number) => {
              const link = getKnowledgeLinkForRemedy(ranking.remedyId);
              const name = ranking.remedyName || ranking.remedyId;

              return (
                <details key={ranking.remedyId} className="rounded-xl border border-emerald-100 bg-white p-2">
                  <summary className="cursor-pointer list-none">
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
                  <div className="mt-1 text-[9px] font-bold text-slate-500">
                    Confidence {ranking.confidenceScore}% • Matched {ranking.matchedRubricCount}
                  </div>
                </summary>
                <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
                  <ul className="list-disc space-y-1 pl-4 text-[9px] font-semibold text-slate-600">
                    {ranking.whyRanked.map((reason: string, reasonIndex: number) => <li key={reasonIndex}>{reason}</li>)}
                  </ul>
                  <div className="space-y-1">
                    {ranking.contributions.slice(0, 5).map((contribution: any) => (
                      <div key={`${ranking.remedyId}-${contribution.rubricId}`} className="rounded-lg bg-slate-50 p-2 text-[9px] font-semibold text-slate-600">
                        {contribution.rubricTitle}: grade {contribution.grade}, contribution {contribution.strategyContribution}
                      </div>
                    ))}
                  </div>
                </div>
                </details>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-blue-800">
          <Brain className="h-3.5 w-3.5" />
          Clinical Explanation
        </div>
        <ul className="list-disc space-y-1 pl-4 text-[10px] font-semibold text-blue-900">
          {data.clinicalExplanation.map((item: string, index: number) => <li key={index}>{item}</li>)}
          {topRanking?.missingRubricIds?.length > 0 && <li>Missing rubric warnings: {topRanking.missingRubricIds.length} selected rubrics missing from the top remedy.</li>}
        </ul>
      </div>
      <V2ClinicalFeedbackPanel
        payloadBase={{
          mode: "v2-live",
          query: data.query,
          filters: data.filters,
          v2TopRubricIds: data.search.topRubrics.map((rubric: any) => rubric.id),
          v2TopRemedyIds: data.repertorization.rankings.map((ranking: any) => ranking.remedyId),
        }}
      />
    </div>
  );
}
