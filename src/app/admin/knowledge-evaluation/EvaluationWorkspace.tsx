"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FlaskConical,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

interface Metrics {
  caseCount: number;
  minimumCasesPerEntity: number;
  recallAt5: number;
  meanReciprocalRank: number;
  citationPrecision: number;
  unsupportedClaimFailureCount: number;
  emergencyEscalationFailureCount: number;
  abstentionFailureCount: number;
  staleRevisionLeakageCount: number;
  crossEntityConfusionCount: number;
  withdrawnContentLeakageCount: number;
  failedCaseCount: number;
}

interface Workspace {
  prerequisites: {
    ready: boolean;
    blockerCode: string | null;
    currentCorpus: Array<{
      entityId: string;
      revisionId: string;
      contentSha256: string;
    }>;
    currentManifestSha256: string | null;
  };
  evaluations: Array<{
    evaluationId: string;
    status: "passed" | "failed";
    corpusManifestSha256: string;
    querySetVersion: string;
    retrievalSystemName: string;
    retrievalSystemVersion: string;
    metrics: Metrics;
    executedAt: string;
    current: boolean;
  }>;
  readiness: "offline-evaluation-passed" | "offline-evaluation-pending";
}

export default function EvaluationWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/evaluation", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body?.error?.code || "EVALUATION_WORKSPACE_READ_FAILED"
        );
      }
      setWorkspace(body.workspace);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? `Workspace unavailable: ${reason.message}`
          : "Workspace unavailable."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    const developmentBypass =
      process.env.NEXT_PUBLIC_ALLOW_DEV_ADMIN_BYPASS === "true";
    if (!session && !developmentBypass) {
      router.replace("/admin/login");
      return;
    }
    void load();
  }, [load, router]);

  async function submit() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const parsed = JSON.parse(payload);
      const response = await fetch("/api/admin/knowledge/evaluation", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body?.error?.code || "EVALUATION_SUBMISSION_FAILED");
      }
      setMessage(
        `Immutable evaluation recorded as ${body.result.status}. Production RAG remains disabled.`
      );
      setPayload("");
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? `Action blocked: ${reason.message}`
          : "Action blocked."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading && !workspace) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">
        <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
      </main>
    );
  }

  const currentEvaluation = workspace?.evaluations.find(
    (evaluation) => evaluation.current && evaluation.status === "passed"
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge-review")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Independent review
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              KEP-1 step 9
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Offline retrieval evaluation
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Validate the exact reviewed pilot corpus against relevance,
              citation, safety, abstention, freshness, confusion, and withdrawn
              content controls. This is an offline gate only.
            </p>
          </div>
          <button
            onClick={() => void load()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </header>

        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {message}
          </div>
        )}

        {workspace && (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Prerequisites",
                  workspace.prerequisites.ready ? "Ready" : "Blocked",
                ],
                ["Reviewed corpus", workspace.prerequisites.currentCorpus.length],
                ["Recorded runs", workspace.evaluations.length],
                [
                  "Current readiness",
                  currentEvaluation ? "Passed" : "Pending",
                ],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-black">{value}</p>
                </div>
              ))}
            </section>

            {!workspace.prerequisites.ready && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
                Evaluation is blocked until all eight current drafts have two
                distinct approved reviews.{" "}
                <span className="font-mono">
                  {workspace.prerequisites.blockerCode}
                </span>
              </div>
            )}

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-cyan-300" />
                  <h2 className="font-bold">Record signed evaluation output</h2>
                </div>
                <p className="text-sm text-slate-400">
                  Paste the offline harness JSON. The server independently
                  validates its corpus and query-set hashes, recomputes every
                  metric, and stores the result immutably.
                </p>
                <textarea
                  value={payload}
                  onChange={(event) => setPayload(event.target.value)}
                  rows={18}
                  spellCheck={false}
                  placeholder='{"action":"record-offline-evaluation", ...}'
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-100 placeholder:text-slate-600"
                />
                <button
                  onClick={() => void submit()}
                  disabled={
                    busy ||
                    !payload.trim() ||
                    !workspace.prerequisites.ready
                  }
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Validate and record
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="font-bold">Exact corpus manifest</h2>
                  <p className="mt-2 break-all font-mono text-[11px] text-slate-500">
                    {workspace.prerequisites.currentManifestSha256 ||
                      "Unavailable until prerequisites pass"}
                  </p>
                  <div className="mt-4 space-y-2">
                    {workspace.prerequisites.currentCorpus.map((entry) => (
                      <div
                        key={entry.entityId}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs"
                      >
                        <p className="font-bold text-slate-200">
                          {entry.entityId}
                        </p>
                        <p className="mt-1 truncate font-mono text-slate-500">
                          {entry.revisionId}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-sm text-cyan-100">
                  Passing this gate only makes step 10—the human go/no-go
                  decision—available. It cannot publish, index, embed, or
                  activate production retrieval.
                </div>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <h2 className="font-bold">Immutable evaluation history</h2>
              {workspace.evaluations.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No evaluation has been recorded.
                </p>
              ) : (
                workspace.evaluations.map((evaluation) => (
                  <div
                    key={evaluation.evaluationId}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">
                        {evaluation.retrievalSystemName}{" "}
                        {evaluation.retrievalSystemVersion}
                      </p>
                      <span
                        className={
                          evaluation.status === "passed"
                            ? "text-emerald-300"
                            : "text-red-300"
                        }
                      >
                        {evaluation.status}
                        {evaluation.current ? " · current" : " · superseded"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {evaluation.querySetVersion} ·{" "}
                      {evaluation.metrics.caseCount} cases · recall@5{" "}
                      {(evaluation.metrics.recallAt5 * 100).toFixed(1)}% · MRR{" "}
                      {evaluation.metrics.meanReciprocalRank.toFixed(3)} ·
                      citation precision{" "}
                      {(evaluation.metrics.citationPrecision * 100).toFixed(1)}%
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Safety failures:{" "}
                      {evaluation.metrics.unsupportedClaimFailureCount +
                        evaluation.metrics.emergencyEscalationFailureCount +
                        evaluation.metrics.abstentionFailureCount +
                        evaluation.metrics.staleRevisionLeakageCount +
                        evaluation.metrics.crossEntityConfusionCount +
                        evaluation.metrics.withdrawnContentLeakageCount}
                    </p>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
