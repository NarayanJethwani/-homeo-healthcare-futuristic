"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type {
  KnowledgeSourceIntegrityReport,
  SourceIntegrityIssue,
  SourceIntegritySeverity,
} from "@/features/knowledge/expansion/sourceIntegrity";

type Filter = "all" | SourceIntegritySeverity;

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All exceptions" },
  { id: "blocker", label: "Must fix" },
  { id: "review", label: "Metadata review" },
];

function issueTitle(issue: SourceIntegrityIssue): string {
  const titles: Record<string, string> = {
    "guideline-canonical-url-required": "Add the official guideline URL",
    "guideline-source-identifier-required": "Add the guideline identifier",
    "citation-canonical-url-invalid": "Correct the source URL",
    "nice-identifier-url-mismatch": "Identifier and NICE URL do not match",
    "authoritative-source-not-verified": "Verify the authoritative source",
    "internal-source-context-only": "Keep this internal source context-only",
    "legacy-citation-metadata-incomplete": "Complete legacy source metadata",
    "duplicate-citation-canonical-url": "Resolve the duplicate citation",
  };
  return titles[issue.code] || "Review source integrity exception";
}

export default function SourceIntegrityPanel() {
  const [report, setReport] =
    useState<KnowledgeSourceIntegrityReport | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    setLoading(true);
    setError("");
    try {
      const result = await fetch("/api/admin/knowledge/source-integrity", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = await result.json();
      if (!result.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "SOURCE_INTEGRITY_READ_FAILED");
      }
      setReport(payload.report);
    } catch {
      setError(
        "The source-integrity report could not be loaded. Refresh your administrator session and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReport();
  }, []);

  const visibleIssues = useMemo(() => {
    if (!report) return [];
    return report.issues.filter(
      (issue) => filter === "all" || issue.severity === filter
    );
  }, [filter, report]);

  return (
    <section
      aria-labelledby="source-integrity-title"
      className="rounded-3xl border border-cyan-500/25 bg-cyan-500/5 p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            <Database className="h-4 w-4" />
            Expansion source integrity
          </p>
          <h2
            id="source-integrity-title"
            className="mt-2 text-2xl font-black text-white"
          >
            Expand from verified sources, quarantine everything else
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            This queue checks source identity, official URLs, rights boundaries,
            duplicates, and evidence authority before new claims enter drafting.
            It cannot publish content or activate clinical retrieval.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadReport()}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-black text-cyan-200 disabled:opacity-40"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Checking sources…" : "Refresh audit"}
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200"
        >
          {error}
        </div>
      )}

      {report && (
        <>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-400/10 p-3 text-xs text-violet-200">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Staging only · publication unchanged · RAG inactive · automatic
            clinical approval forbidden
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Citations audited", report.summary.citationsAudited, "text-cyan-300"],
              ["Sources eligible", report.summary.eligibleRegisteredSources, "text-emerald-300"],
              ["Claim-ready citations", report.summary.eligibleCitationRecords, "text-emerald-300"],
              ["Must fix", report.summary.blockerCount, "text-rose-300"],
              ["Metadata review", report.summary.reviewCount, "text-amber-300"],
            ].map(([label, value, colour]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {label}
                </p>
                <p className={`mt-2 text-2xl font-black ${colour}`}>{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-white">
                    Remediation queue
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Fix blockers first; legacy records remain available but
                    cannot support newly staged claims.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFilter(item.id)}
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        filter === item.id
                          ? "bg-cyan-400 text-slate-950"
                          : "border border-white/10 bg-black/20 text-neutral-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <ul className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-2">
                {visibleIssues.map((issue, index) => (
                  <li
                    key={`${issue.recordType}-${issue.recordId}-${issue.code}-${index}`}
                    className={`rounded-xl border p-4 ${
                      issue.severity === "blocker"
                        ? "border-rose-500/25 bg-rose-500/5"
                        : "border-amber-500/20 bg-amber-500/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {issue.severity === "blocker" ? (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                      ) : (
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-neutral-300">
                            {issue.recordId}
                          </span>
                          <span className="rounded bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                            {issue.recordType}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-bold text-neutral-100">
                          {issueTitle(issue)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          {issue.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="space-y-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <h3 className="text-sm font-black">Eligible source registry</h3>
                </div>
                <p className="mt-2 text-3xl font-black text-white">
                  {report.eligibleSourceIds.length}
                </p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">
                  Rights and identifier checks passed. Extraction remains
                  limited by each source&apos;s use policy.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-sm font-black text-white">Next workflow</h3>
                <ol className="mt-3 space-y-2 text-xs leading-5 text-neutral-400">
                  <li>1. Resolve canonical-source blockers.</li>
                  <li>2. Map each new claim to eligible evidence.</li>
                  <li>3. Draft in the governed acquisition workspace.</li>
                  <li>4. Send only exceptions for human review.</li>
                </ol>
                <Link
                  href="/admin/knowledge-acquisition"
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2.5 text-xs font-black text-cyan-200"
                >
                  Open acquisition workspace
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}
