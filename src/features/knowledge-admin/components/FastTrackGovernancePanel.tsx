"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileWarning,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import type { KmsKnowledgeEntity } from "../types";
import { buildFastTrackSummary } from "@/features/knowledge/governance/fastTrackPolicy";
import type {
  FastTrackDecisionAssessment,
  FastTrackDecisionOutcome,
  FastTrackDecisionWorkspace,
} from "@/features/knowledge/governance/fastTrackDecisionTypes";

interface FastTrackGovernancePanelProps {
  entities: readonly KmsKnowledgeEntity[];
  canResolveSafetyWithdrawal: boolean;
  onReviewEntity: (entity: KmsKnowledgeEntity) => void;
}

interface DecisionFormState {
  outcome: FastTrackDecisionOutcome;
  rationale: string;
  citationIds: string[];
  citationsChecked: boolean;
  clinicalAccuracyChecked: boolean;
  conventionalCareBoundaryChecked: boolean;
  conflictOfInterestDeclared: boolean;
  safetyCauseResolved: boolean;
  safetyConfirmation: string;
}

const RULES = [
  "Keep existing independently reviewed content available under background monitoring.",
  "Require a registered citation for every new or changed medical article.",
  "Send new, unverified, conflicting, withdrawn, or high-risk claims to human review.",
  "Let AI summarize evidence and draft corrections, but never grant itself clinical approval.",
  "Immediately block unsafe treatment-replacement and prohibited cure claims.",
  "Preserve a human-readable reason and audit trail for every exception.",
];

const SAFETY_CONFIRMATION =
  "I ACCEPT ACCOUNTABILITY FOR THIS SAFETY RESOLUTION";

const OUTCOME_LABELS: Record<FastTrackDecisionOutcome, string> = {
  "approved-reviewed": "Approve reviewed revision",
  "correction-requested": "Request correction",
  "safety-block-maintained": "Keep safety block",
  "safety-resolution-recorded": "Record safety resolution",
};

const ERROR_MESSAGES: Record<string, string> = {
  FAST_TRACK_REVISION_HASH_MISMATCH:
    "The article changed after you opened it. Refresh and review the new revision.",
  FAST_TRACK_DECISION_HEAD_CONFLICT:
    "Another decision was recorded first. Refresh before deciding again.",
  FAST_TRACK_CITATION_REQUIRED:
    "Select at least one linked citation for an approval or safety resolution.",
  FAST_TRACK_CITATION_NOT_LINKED:
    "A selected citation is no longer linked to this article.",
  FAST_TRACK_FLAG_COVERAGE_INCOMPLETE:
    "The detected flags changed. Refresh and review the current findings.",
  FAST_TRACK_SAFETY_RESOLUTION_FORBIDDEN:
    "Only a super administrator can record a safety-withdrawal resolution.",
  FAST_TRACK_SAFETY_CONFIRMATION_REQUIRED:
    "Complete the safety attestation and enter the exact accountability phrase.",
  UNAUTHORIZED: "Your administrator session has expired. Sign in again.",
  FORBIDDEN: "Your account does not have clinical decision authority.",
};

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "amber" | "rose" | "violet";
}) {
  const colors = {
    cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-300",
    violet: "border-violet-500/20 bg-violet-500/5 text-violet-300",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colors[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-70">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function initialForm(
  assessment: FastTrackDecisionAssessment,
  outcome?: FastTrackDecisionOutcome
): DecisionFormState {
  return {
    outcome:
      outcome ||
      (assessment.lane === "blocked"
        ? "safety-block-maintained"
        : "approved-reviewed"),
    rationale: "",
    citationIds: [...assessment.availableCitationIds],
    citationsChecked: false,
    clinicalAccuracyChecked: false,
    conventionalCareBoundaryChecked: false,
    conflictOfInterestDeclared: false,
    safetyCauseResolved: false,
    safetyConfirmation: "",
  };
}

function DecisionCard({
  assessment,
  entity,
  canResolveSafetyWithdrawal,
  onReview,
  onDecide,
}: {
  assessment: FastTrackDecisionAssessment;
  entity: KmsKnowledgeEntity;
  canResolveSafetyWithdrawal: boolean;
  onReview: () => void;
  onDecide: (outcome: FastTrackDecisionOutcome) => void;
}) {
  const blocked = assessment.lane === "blocked";
  const decision = assessment.currentDecision;
  return (
    <article
      className={`rounded-2xl border p-4 ${
        blocked
          ? "border-rose-500/30 bg-rose-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            {decision ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            ) : blocked ? (
              <AlertTriangle className="h-4 w-4 text-rose-300" />
            ) : (
              <FileWarning className="h-4 w-4 text-amber-300" />
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                decision
                  ? "text-emerald-300"
                  : blocked
                    ? "text-rose-300"
                    : "text-amber-300"
              }`}
            >
              {decision
                ? "Decision recorded"
                : blocked
                  ? "Blocked"
                  : "Human review"}
            </span>
          </div>
          <h3 className="mt-2 font-bold text-neutral-100">
            {assessment.title}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            {assessment.entityId} · {assessment.entityType} ·{" "}
            {assessment.citationCount} citation
            {assessment.citationCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onReview}
            className="flex items-center gap-1 rounded-xl border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
          >
            Review article <ChevronRight className="h-3.5 w-3.5" />
          </button>
          {blocked ? (
            <>
              <button
                type="button"
                onClick={() => onDecide("safety-block-maintained")}
                className="rounded-xl bg-rose-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-rose-300"
              >
                Keep blocked
              </button>
              {canResolveSafetyWithdrawal && (
                <button
                  type="button"
                  onClick={() => onDecide("safety-resolution-recorded")}
                  className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-500/10"
                >
                  Record safety resolution
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onDecide("approved-reviewed")}
                className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-emerald-300"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onDecide("correction-requested")}
                className="rounded-xl border border-amber-500/40 px-3 py-2 text-xs font-bold text-amber-200 transition hover:bg-amber-500/10"
              >
                Request correction
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {assessment.flags.map((flag) => (
          <div
            key={`${assessment.entityId}-${flag.code}`}
            className="rounded-xl border border-white/5 bg-black/20 px-3 py-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {flag.code}
            </p>
            <p className="mt-1 text-xs leading-5 text-neutral-300">
              {flag.message}
            </p>
          </div>
        ))}
      </div>

      {decision ? (
        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <p className="text-xs font-bold text-emerald-200">
            {OUTCOME_LABELS[decision.outcome]}
          </p>
          <p className="mt-1 text-xs leading-5 text-neutral-400">
            {decision.rationale}
          </p>
          <p className="mt-2 text-[10px] text-neutral-500">
            {decision.actorName} ·{" "}
            {new Date(decision.recordedAt).toLocaleString()} · revision{" "}
            {decision.entityRevisionSha256.slice(0, 12)}
          </p>
          {blocked && (
            <p className="mt-2 text-[10px] font-bold text-rose-300">
              The production publication and RAG safety controls remain active.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-3 text-xs leading-5 text-neutral-500">
          {assessment.recommendation}
        </p>
      )}
      <span className="sr-only">{entity.id}</span>
    </article>
  );
}

export default function FastTrackGovernancePanel({
  entities,
  canResolveSafetyWithdrawal,
  onReviewEntity,
}: FastTrackGovernancePanelProps) {
  const localSummary = useMemo(
    () => buildFastTrackSummary(entities),
    [entities]
  );
  const [rulesApplied, setRulesApplied] = useState(false);
  const [workspace, setWorkspace] =
    useState<FastTrackDecisionWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] =
    useState<FastTrackDecisionAssessment | null>(null);
  const [form, setForm] = useState<DecisionFormState | null>(null);

  const entityById = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities]
  );
  const summary = workspace?.summary || localSummary;
  const exceptions =
    workspace?.assessments.filter(
      (assessment) => assessment.lane !== "background-monitoring"
    ) || [];

  async function loadWorkspace() {
    setLoading(true);
    setError("");
    try {
      const result = await fetch(
        "/api/admin/knowledge/fast-track-decisions",
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        }
      );
      const payload = await result.json();
      if (!result.ok || !payload.ok) {
        const code = payload?.error?.code || "FAST_TRACK_WORKSPACE_READ_FAILED";
        throw new Error(code);
      }
      setWorkspace(payload.workspace);
      setRulesApplied(true);
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "FAST_TRACK_UNKNOWN_ERROR";
      setError(
        ERROR_MESSAGES[code] ||
          "The governed decision workspace could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  function beginDecision(
    assessment: FastTrackDecisionAssessment,
    outcome: FastTrackDecisionOutcome
  ) {
    setSelected(assessment);
    setForm(initialForm(assessment, outcome));
    setError("");
  }

  async function submitDecision() {
    if (!selected || !form) return;
    setSaving(true);
    setError("");
    try {
      const result = await fetch(
        "/api/admin/knowledge/fast-track-decisions",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "record-decision",
            requestId: crypto.randomUUID(),
            entityId: selected.entityId,
            expectedRevisionSha256: selected.entityRevisionSha256,
            expectedPreviousDecisionId: selected.latestDecisionId,
            outcome: form.outcome,
            reviewedFlagCodes: selected.flags.map((flag) => flag.code),
            citationIds: form.citationIds,
            rationale: form.rationale,
            attestations: {
              citationsChecked: form.citationsChecked,
              clinicalAccuracyChecked: form.clinicalAccuracyChecked,
              conventionalCareBoundaryChecked:
                form.conventionalCareBoundaryChecked,
              conflictOfInterestDeclared:
                form.conflictOfInterestDeclared,
              safetyCauseResolved: form.safetyCauseResolved,
            },
            safetyConfirmation: form.safetyConfirmation || undefined,
          }),
        }
      );
      const payload = await result.json();
      if (!result.ok || !payload.ok) {
        const code = payload?.error?.code || "FAST_TRACK_DECISION_FAILED";
        throw new Error(code);
      }
      setSelected(null);
      setForm(null);
      await loadWorkspace();
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "FAST_TRACK_UNKNOWN_ERROR";
      setError(
        ERROR_MESSAGES[code] ||
          "The decision was not recorded. Review the required fields and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const allAttestationsChecked =
    form?.citationsChecked &&
    form.clinicalAccuracyChecked &&
    form.conventionalCareBoundaryChecked &&
    form.conflictOfInterestDeclared;
  const safetyResolution =
    form?.outcome === "safety-resolution-recorded";
  const citationRequired =
    form?.outcome === "approved-reviewed" || safetyResolution;
  const formReady =
    Boolean(form && form.rationale.trim().length >= 20) &&
    Boolean(allAttestationsChecked) &&
    (!citationRequired || Boolean(form?.citationIds.length)) &&
    (!safetyResolution ||
      (form?.safetyCauseResolved &&
        form.safetyConfirmation === SAFETY_CONFIRMATION));

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-neutral-950/70 to-indigo-500/10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-cyan-300">
              <Sparkles className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.2em]">
                Citation-first AI fast track
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-black text-white">
              Review exceptions, not the entire encyclopedia
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Decisions are bound to the exact article revision and preserved
              in an immutable audit trail. No decision here publishes content
              or grants RAG authority.
            </p>
          </div>
          <button
            type="button"
            onClick={loadWorkspace}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Applying rules
              </>
            ) : rulesApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Refresh decisions
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" /> Apply rules in one click
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Knowledge entries" value={summary.total} tone="cyan" />
        <Metric
          label="Background monitoring"
          value={summary.backgroundMonitoring}
          tone="emerald"
        />
        <Metric
          label="Review signals"
          value={summary.humanReview}
          tone="amber"
        />
        <Metric
          label="Safety controls active"
          value={summary.blocked}
          tone="rose"
        />
        <Metric
          label="Open decisions"
          value={
            workspace
              ? workspace.openDecisionCount
              : summary.humanReview + summary.blocked
          }
          tone="violet"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h2 className="font-black text-neutral-100">Human-made rules</h2>
          </div>
          <div className="mt-4 space-y-3">
            {RULES.map((rule, index) => (
              <div key={rule} className="flex gap-3 text-sm text-neutral-400">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neutral-800 text-[10px] font-bold text-cyan-300">
                  {index + 1}
                </span>
                <p className="leading-6">{rule}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-emerald-300">
              <BookOpenCheck className="h-4 w-4" />
              <p className="text-xs font-bold">Accountability principle</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-neutral-400">
              Approval records clinical judgment for one immutable revision.
              Any later content change automatically makes that decision stale.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-neutral-100">
                Medical exception queue
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Review findings and record the accountable human decision.
              </p>
            </div>
            {workspace && (
              <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-bold text-neutral-300">
                {workspace.openDecisionCount} open · {workspace.decidedCount}{" "}
                decided
              </span>
            )}
          </div>

          {!rulesApplied ? (
            <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-dashed border-neutral-800 bg-black/10 p-6 text-center">
              <div>
                <Bot className="mx-auto h-8 w-8 text-neutral-600" />
                <p className="mt-3 text-sm font-bold text-neutral-300">
                  Apply the rules to load the governed decision queue.
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  No publication or RAG permissions are changed.
                </p>
              </div>
            </div>
          ) : exceptions.length === 0 ? (
            <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
              <div>
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-300" />
                <p className="mt-3 text-sm font-bold text-emerald-200">
                  No exceptions need human review.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 max-h-[760px] space-y-3 overflow-y-auto pr-1">
              {exceptions.map((assessment) => {
                const entity = entityById.get(assessment.entityId);
                if (!entity) return null;
                return (
                  <DecisionCard
                    key={assessment.entityId}
                    assessment={assessment}
                    entity={entity}
                    canResolveSafetyWithdrawal={
                      canResolveSafetyWithdrawal
                    }
                    onReview={() => onReviewEntity(entity)}
                    onDecide={(outcome) =>
                      beginDecision(assessment, outcome)
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selected && form && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="fast-track-decision-title"
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="my-6 w-full max-w-2xl rounded-3xl border border-neutral-700 bg-[#0d1422] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Revision-bound human decision
                </p>
                <h2
                  id="fast-track-decision-title"
                  className="mt-2 text-xl font-black text-white"
                >
                  {selected.title}
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  Revision {selected.entityRevisionSha256.slice(0, 16)}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close decision form"
                onClick={() => {
                  setSelected(null);
                  setForm(null);
                  setError("");
                }}
                className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
              >
                {error}
              </div>
            )}

            <label className="mt-5 block text-xs font-bold text-neutral-300">
              Decision
              <select
                value={form.outcome}
                onChange={(event) => {
                  const outcome = event.target.value as FastTrackDecisionOutcome;
                  setForm({
                    ...form,
                    outcome,
                    safetyCauseResolved:
                      outcome === "safety-resolution-recorded"
                        ? form.safetyCauseResolved
                        : false,
                    safetyConfirmation:
                      outcome === "safety-resolution-recorded"
                        ? form.safetyConfirmation
                        : "",
                  });
                }}
                className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm text-white"
              >
                {selected.lane === "blocked" ? (
                  <>
                    <option value="safety-block-maintained">
                      Keep safety block
                    </option>
                    <option
                      value="safety-resolution-recorded"
                      disabled={!canResolveSafetyWithdrawal}
                    >
                      Record safety resolution
                    </option>
                  </>
                ) : (
                  <>
                    <option value="approved-reviewed">
                      Approve reviewed revision
                    </option>
                    <option value="correction-requested">
                      Request correction
                    </option>
                  </>
                )}
              </select>
            </label>

            <fieldset className="mt-5">
              <legend className="text-xs font-bold text-neutral-300">
                Citations reviewed
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.availableCitationIds.map((citationId) => (
                  <label
                    key={citationId}
                    className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-300"
                  >
                    <input
                      type="checkbox"
                      checked={form.citationIds.includes(citationId)}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          citationIds: event.target.checked
                            ? [...form.citationIds, citationId]
                            : form.citationIds.filter(
                                (value) => value !== citationId
                              ),
                        })
                      }
                    />
                    {citationId}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="mt-5 block text-xs font-bold text-neutral-300">
              Clinical rationale
              <textarea
                value={form.rationale}
                onChange={(event) =>
                  setForm({ ...form, rationale: event.target.value })
                }
                rows={4}
                placeholder="Explain why this exact revision is approved, needs correction, or must remain blocked."
                className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm leading-6 text-white"
              />
              <span className="mt-1 block text-[10px] text-neutral-600">
                Minimum 20 characters. This becomes part of the immutable audit
                record.
              </span>
            </label>

            <fieldset className="mt-5 space-y-3 rounded-2xl border border-neutral-800 bg-black/20 p-4">
              <legend className="px-2 text-xs font-bold text-neutral-300">
                Required attestations
              </legend>
              {[
                [
                  "citationsChecked",
                  "I checked the linked citations against the medical statements.",
                ],
                [
                  "clinicalAccuracyChecked",
                  "I reviewed the clinical accuracy of the flagged wording.",
                ],
                [
                  "conventionalCareBoundaryChecked",
                  "I confirmed that conventional-care and emergency boundaries are preserved.",
                ],
                [
                  "conflictOfInterestDeclared",
                  "I declare no undisclosed conflict of interest for this decision.",
                ],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="flex items-start gap-3 text-xs leading-5 text-neutral-300"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(
                      form[field as keyof DecisionFormState]
                    )}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field]: event.target.checked,
                      })
                    }
                    className="mt-1"
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {safetyResolution && (
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-xs font-bold text-rose-200">
                  High-friction safety resolution
                </p>
                <p className="mt-2 text-xs leading-5 text-neutral-300">
                  This records your resolution judgment. Production publication
                  and RAG controls remain blocked and require a separate
                  controlled release.
                </p>
                <label className="mt-3 flex items-start gap-3 text-xs text-neutral-200">
                  <input
                    type="checkbox"
                    checked={form.safetyCauseResolved}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        safetyCauseResolved: event.target.checked,
                      })
                    }
                    className="mt-0.5"
                  />
                  I verified that the underlying safety cause has been corrected
                  or is no longer applicable.
                </label>
                <label className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Type the accountability phrase
                  <input
                    value={form.safetyConfirmation}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        safetyConfirmation: event.target.value,
                      })
                    }
                    placeholder={SAFETY_CONFIRMATION}
                    className="mt-2 w-full rounded-xl border border-rose-500/30 bg-neutral-950 px-3 py-3 text-xs normal-case tracking-normal text-white"
                  />
                </label>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-sm text-[10px] leading-4 text-neutral-500">
                This decision grants neither publication authority nor RAG
                authority. Any material article edit invalidates it.
              </p>
              <button
                type="button"
                disabled={!formReady || saving}
                onClick={submitDecision}
                className="flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Record accountable decision
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
