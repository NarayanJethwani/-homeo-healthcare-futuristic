"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Gavel,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

const FIELD =
  "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600";
const GO_PHRASE =
  "I AUTHORIZE KEP-1 GO WITHOUT PUBLICATION OR RAG AUTHORITY";
const NO_GO_PHRASE = "I RECORD KEP-1 NO-GO";

const CHECKS = [
  ["acceptanceGatesReviewed", "All KEP-1 acceptance gates reviewed"],
  [
    "clinicalAndEvidenceReviewsConfirmed",
    "Current clinical and evidence approvals confirmed",
  ],
  ["offlineEvaluationReviewed", "Exact offline evaluation reviewed"],
  ["withdrawnExclusionsConfirmed", "Withdrawn exclusions confirmed"],
  ["zeroProductionRagConfirmed", "Production RAG remains empty"],
  ["residualRisksReviewed", "Residual risks reviewed"],
  ["containmentAndRollbackReviewed", "Containment and rollback reviewed"],
  ["authorityBoundaryAccepted", "Limited authority boundary accepted"],
] as const;

interface Workspace {
  prerequisites: {
    ready: boolean;
    blockerCode: string | null;
    currentEvaluation: null | {
      evaluationId: string;
      corpusManifestSha256: string;
      querySetSha256: string;
      querySetVersion: string;
      retrievalSystemName: string;
      retrievalSystemVersion: string;
      metrics: {
        caseCount: number;
        recallAt5: number;
        meanReciprocalRank: number;
        citationPrecision: number;
        failedCaseCount: number;
      };
      executedAt: string;
    };
    eligibleOwners: Array<{
      recordId: string;
      version: number;
      updatedAt: string;
    }>;
  };
  decisions: Array<{
    decisionId: string;
    decision: "go" | "no-go";
    evaluationId: string;
    programOwnerRecordId: string;
    blockerCount: number;
    residualRiskCount: number;
    decidedAt: string;
    current: boolean;
  }>;
  readiness: "kep1-go" | "kep1-no-go" | "decision-pending";
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function DecisionWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [decision, setDecision] = useState<"go" | "no-go">("no-go");
  const [ownerId, setOwnerId] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [blockers, setBlockers] = useState("");
  const [risks, setRisks] = useState("");
  const [rationale, setRationale] = useState("");
  const [decisionEvidenceRef, setDecisionEvidenceRef] = useState("");
  const [meetingMinutesRef, setMeetingMinutesRef] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/decision", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body?.error?.code || "GO_NO_GO_WORKSPACE_READ_FAILED");
      }
      setWorkspace(body.workspace);
      if (body.workspace.prerequisites.eligibleOwners.length === 1) {
        setOwnerId(
          (current) =>
            current ||
            body.workspace.prerequisites.eligibleOwners[0].recordId
        );
      }
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

  const currentDecision = useMemo(
    () => workspace?.decisions.find((item) => item.current) || null,
    [workspace]
  );
  const requiredPhrase = decision === "go" ? GO_PHRASE : NO_GO_PHRASE;

  async function submit() {
    const evaluation = workspace?.prerequisites.currentEvaluation;
    if (!evaluation || !ownerId) {
      setError("Action blocked: GO_NO_GO_PREREQUISITES_REQUIRED");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/knowledge/decision", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "record-go-no-go",
          decision,
          evaluationId: evaluation.evaluationId,
          expectedCorpusManifestSha256:
            evaluation.corpusManifestSha256,
          expectedQuerySetSha256: evaluation.querySetSha256,
          programOwnerRecordId: ownerId,
          checklist: Object.fromEntries(
            CHECKS.map(([key]) => [key, Boolean(checks[key])])
          ),
          blockers: lines(blockers),
          residualRisks: lines(risks),
          rationale,
          decisionEvidenceRef,
          meetingMinutesRef,
          confirmationPhrase,
        }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body?.error?.code || "GO_NO_GO_SUBMISSION_FAILED");
      }
      setMessage(
        `Immutable KEP-1 ${body.result.decision} decision recorded. Publication and production RAG remain disabled.`
      );
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
        <Loader2 className="h-7 w-7 animate-spin text-violet-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge-evaluation")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Offline evaluation
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              KEP-1 step 10
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Human go/no-go decision
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Record the accountable program-owner decision against the exact
              current passing evaluation. No decision here can publish or
              activate production retrieval.
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
            <section className="grid gap-3 sm:grid-cols-3">
              {[
                [
                  "Decision prerequisites",
                  workspace.prerequisites.ready ? "Ready" : "Blocked",
                ],
                ["Eligible program owners", workspace.prerequisites.eligibleOwners.length],
                ["Current KEP-1 status", workspace.readiness],
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

            {workspace.prerequisites.blockerCode && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
                Decision recording is blocked:{" "}
                <span className="font-mono">
                  {workspace.prerequisites.blockerCode}
                </span>
              </div>
            )}

            <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-violet-300" />
                  <h2 className="font-bold">Record immutable decision</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    className={FIELD}
                    value={decision}
                    onChange={(event) => {
                      setDecision(event.target.value as "go" | "no-go");
                      setConfirmationPhrase("");
                    }}
                  >
                    <option value="no-go">No-go</option>
                    <option value="go">Go</option>
                  </select>
                  <select
                    className={FIELD}
                    value={ownerId}
                    onChange={(event) => setOwnerId(event.target.value)}
                  >
                    <option value="">Select verified program owner</option>
                    {workspace.prerequisites.eligibleOwners.map((owner) => (
                      <option key={owner.recordId} value={owner.recordId}>
                        {owner.recordId} — V{owner.version}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {CHECKS.map(([key, label]) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checks[key])}
                        onChange={(event) =>
                          setChecks((current) => ({
                            ...current,
                            [key]: event.target.checked,
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <textarea
                  className={FIELD}
                  value={blockers}
                  onChange={(event) => setBlockers(event.target.value)}
                  rows={3}
                  placeholder="Unresolved blockers, one per line. Go requires none; no-go requires at least one."
                />
                <textarea
                  className={FIELD}
                  value={risks}
                  onChange={(event) => setRisks(event.target.value)}
                  rows={3}
                  placeholder="Residual risks, one per line"
                />
                <textarea
                  className={FIELD}
                  value={rationale}
                  onChange={(event) => setRationale(event.target.value)}
                  rows={5}
                  placeholder="Accountable decision rationale"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={FIELD}
                    value={decisionEvidenceRef}
                    onChange={(event) =>
                      setDecisionEvidenceRef(event.target.value)
                    }
                    placeholder="Private decision evidence reference"
                  />
                  <input
                    className={FIELD}
                    value={meetingMinutesRef}
                    onChange={(event) =>
                      setMeetingMinutesRef(event.target.value)
                    }
                    placeholder="Private meeting minutes reference"
                  />
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-xs text-violet-100">
                  Type exactly:{" "}
                  <span className="font-mono font-bold">{requiredPhrase}</span>
                </div>
                <input
                  className={FIELD}
                  value={confirmationPhrase}
                  onChange={(event) =>
                    setConfirmationPhrase(event.target.value)
                  }
                  placeholder="Type the exact confirmation phrase"
                />
                <button
                  disabled={
                    busy ||
                    !workspace.prerequisites.ready ||
                    !ownerId ||
                    Boolean(currentDecision)
                  }
                  onClick={() => void submit()}
                  className="flex items-center gap-2 rounded-xl bg-violet-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gavel className="h-4 w-4" />
                  )}
                  Record human decision
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="font-bold">Current evaluation</h2>
                  {workspace.prerequisites.currentEvaluation ? (
                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                      <p>
                        {
                          workspace.prerequisites.currentEvaluation
                            .retrievalSystemName
                        }{" "}
                        {
                          workspace.prerequisites.currentEvaluation
                            .retrievalSystemVersion
                        }
                      </p>
                      <p>
                        {
                          workspace.prerequisites.currentEvaluation.metrics
                            .caseCount
                        }{" "}
                        cases · recall@5{" "}
                        {(
                          workspace.prerequisites.currentEvaluation.metrics
                            .recallAt5 * 100
                        ).toFixed(1)}
                        % · citation precision{" "}
                        {(
                          workspace.prerequisites.currentEvaluation.metrics
                            .citationPrecision * 100
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="break-all font-mono text-[11px] text-slate-500">
                        {
                          workspace.prerequisites.currentEvaluation
                            .evaluationId
                        }
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      No current passing evaluation.
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <div className="flex gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                    <p className="text-sm text-red-100">
                      A go decision closes the KEP-1 pilot and permits controlled
                      expansion planning only. Publication, indexing, embedding,
                      production migration, and RAG activation remain separate
                      prohibited actions.
                    </p>
                  </div>
                </div>
                {currentDecision && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      <p className="font-bold">
                        Current decision: {currentDecision.decision}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-emerald-100/70">
                      {currentDecision.decisionId}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
