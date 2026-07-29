"use client";

import { useState } from "react";
import type {
  ControlledReleaseCandidate,
  ControlledReleaseWorkspace,
} from "@/features/knowledge/governance/controlledReleaseTypes";

type ActionMode = "authorize" | "observation" | "rollback";

interface ReleaseForm {
  mode: ActionMode;
  candidate: ControlledReleaseCandidate;
  publication: boolean;
  rag: boolean;
  rationale: string;
  revisionRechecked: boolean;
  citationsRechecked: boolean;
  safetyBoundariesRechecked: boolean;
  rollbackReady: boolean;
}

const ERRORS: Record<string, string> = {
  CONTROLLED_RELEASE_PREFLIGHT_FAILED:
    "The current revision did not pass the controlled-release preflight.",
  CONTROLLED_RELEASE_CANARY_POLICY_FAILED:
    "The canary must be the recommended FAQ and publication-only.",
  CONTROLLED_RELEASE_CANARY_OBSERVATION_REQUIRED:
    "Complete the 24-hour canary observation before broader release.",
  CONTROLLED_RELEASE_OBSERVATION_WINDOW_INCOMPLETE:
    "The canary has not completed the required 24-hour observation window.",
  CONTROLLED_RELEASE_CANARY_EXECUTION_REQUIRED:
    "Execute the publication canary before recording its 24-hour observation.",
  CONTROLLED_RELEASE_REVISION_HASH_MISMATCH:
    "The article changed. Refresh and review its new revision.",
  CONTROLLED_RELEASE_SAFETY_DECISION_STALE:
    "The safety decision changed. Refresh before continuing.",
  CONTROLLED_RELEASE_CHANNEL_FORBIDDEN:
    "Your account cannot authorize one of the selected channels.",
  CONTROLLED_RELEASE_HEAD_CONFLICT:
    "Another release action was recorded first. Refresh before continuing.",
  UNAUTHORIZED: "Your administrator session expired. Sign in again.",
  FORBIDDEN: "Your account does not have controlled-release authority.",
};

function initialForm(
  candidate: ControlledReleaseCandidate,
  mode: ActionMode
): ReleaseForm {
  return {
    mode,
    candidate,
    publication: mode === "authorize",
    rag: false,
    rationale: "",
    revisionRechecked: false,
    citationsRechecked: false,
    safetyBoundariesRechecked: false,
    rollbackReady: false,
  };
}

export default function ControlledReleasePanel() {
  const [workspace, setWorkspace] =
    useState<ControlledReleaseWorkspace | null>(null);
  const [form, setForm] = useState<ReleaseForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  async function loadWorkspace() {
    setLoading(true);
    setError("");
    try {
      const result = await fetch(
        "/api/admin/knowledge/controlled-release",
        {
          credentials: "same-origin",
          cache: "no-store",
        }
      );
      const payload = await result.json();
      if (!result.ok || !payload.ok) {
        throw new Error(
          payload?.error?.code || "CONTROLLED_RELEASE_WORKSPACE_READ_FAILED"
        );
      }
      setWorkspace(payload.workspace);
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "UNKNOWN";
      setError(
        ERRORS[code] || "The controlled-release workspace could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!form || !workspace) return;
    setSaving(true);
    setError("");
    const current = form.candidate.currentRelease;
    const common = {
      requestId: crypto.randomUUID(),
      entityId: form.candidate.entityId,
      expectedRevisionSha256:
        form.candidate.entityRevisionSha256,
      expectedSafetyDecisionId: form.candidate.safetyDecisionId,
      expectedPreviousReleaseId: current?.releaseId || null,
      rationale: form.rationale,
      attestations: {
        revisionRechecked: form.revisionRechecked,
        citationsRechecked: form.citationsRechecked,
        safetyBoundariesRechecked: form.safetyBoundariesRechecked,
        rollbackReady: form.rollbackReady,
      },
    };
    const body =
      form.mode === "authorize"
        ? {
            action: "authorize-release",
            ...common,
            phase: workspace.canaryPassed ? "general" : "canary",
            channels: {
              publication: form.publication,
              rag: form.rag,
            },
          }
        : form.mode === "observation"
          ? {
              action: "record-canary-observation",
              ...common,
              phase: "canary",
              observation: {
                observationMinutes: 1_440,
                safetyIncidentCount: 0,
                prohibitedClaimDetectionCount: 0,
                retrievalLeakageCount: 0,
              },
            }
          : { action: "rollback-release", ...common };
    try {
      const result = await fetch(
        "/api/admin/knowledge/controlled-release",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const payload = await result.json();
      if (!result.ok || !payload.ok) {
        throw new Error(
          payload?.error?.code || "CONTROLLED_RELEASE_ACTION_FAILED"
        );
      }
      setForm(null);
      setConfirming(false);
      await loadWorkspace();
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "UNKNOWN";
      setError(
        ERRORS[code] ||
          "The release action was not recorded. Review the preflight and try again."
      );
      setConfirming(false);
    } finally {
      setSaving(false);
    }
  }

  const formReady =
    Boolean(form && form.rationale.trim().length >= 30) &&
    Boolean(form?.revisionRechecked) &&
    Boolean(form?.citationsRechecked) &&
    Boolean(form?.safetyBoundariesRechecked) &&
    Boolean(form?.rollbackReady) &&
    (form?.mode !== "authorize" ||
      Boolean(form.publication || form.rag));

  return (
    <section className="rounded-3xl border border-violet-500/25 bg-violet-500/5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-300">
            Controlled release gate
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Canary first, with publication and RAG separated
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Release authorization is revision-bound and immutable. It does not
            execute publication or RAG activation; a separately audited
            deployment must consume the authorization.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void loadWorkspace()}
          className="rounded-xl bg-violet-300 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40"
        >
          {loading ? "Running preflight…" : "Run release preflight"}
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

      {workspace && (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["Canary status", workspace.canaryPassed ? "Passed" : "Required"],
              ["Candidates", workspace.candidates.length],
              ["Authorized", workspace.authorizedCount],
              ["Executed", workspace.executionAppliedCount],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {label}
                </p>
                <p className="mt-2 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {workspace.candidates.map((candidate) => {
              const current = candidate.currentRelease;
              const canAuthorize =
                candidate.preflightPassed &&
                (!current ||
                  current.outcome === "release-rolled-back") &&
                (workspace.canaryPassed || candidate.recommendedCanary);
              const canObserve =
                current?.phase === "canary" &&
                current.outcome === "release-authorized" &&
                candidate.executionApplied &&
                candidate.observationWindowComplete;
              const canRollback = Boolean(
                current?.publicationReleaseAuthorized ||
                  current?.ragReleaseAuthorized
              );
              return (
                <article
                  key={candidate.entityId}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                            candidate.preflightPassed
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {candidate.preflightPassed
                            ? "Preflight passed"
                            : "Preflight blocked"}
                        </span>
                        {candidate.recommendedCanary && (
                          <span className="rounded-full bg-violet-500/15 px-2 py-1 text-[10px] font-bold text-violet-200">
                            Recommended canary
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 font-black text-white">
                        {candidate.title}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {candidate.entityId} · {candidate.entityType} · revision{" "}
                        {candidate.entityRevisionSha256.slice(0, 12)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {canAuthorize && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              initialForm(candidate, "authorize")
                            )
                          }
                          className="rounded-xl bg-violet-300 px-3 py-2 text-xs font-black text-slate-950"
                        >
                          {workspace.canaryPassed
                            ? "Prepare release"
                            : "Authorize publication canary"}
                        </button>
                      )}
                      {canObserve && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              initialForm(candidate, "observation")
                            )
                          }
                          className="rounded-xl border border-emerald-500/40 px-3 py-2 text-xs font-bold text-emerald-200"
                        >
                          Record 24-hour observation
                        </button>
                      )}
                      {canRollback && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              initialForm(candidate, "rollback")
                            )
                          }
                          className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-200"
                        >
                          Record rollback
                        </button>
                      )}
                    </div>
                  </div>
                  {!candidate.preflightPassed && (
                    <p className="mt-3 text-xs text-rose-300">
                      {candidate.blockingReasons.join(" · ")}
                    </p>
                  )}
                  {current && (
                    <p className="mt-3 text-xs text-neutral-400">
                      Latest: {current.outcome} · publication{" "}
                      {current.publicationReleaseAuthorized
                        ? "authorized"
                        : "blocked"}{" "}
                      · RAG{" "}
                      {current.ragReleaseAuthorized
                        ? "authorized"
                        : "blocked"}{" "}
                      · execution{" "}
                      {candidate.executionApplied
                        ? "applied"
                        : "not applied"}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}

      {form && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="controlled-release-form-title"
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="my-6 w-full max-w-2xl rounded-3xl border border-violet-500/30 bg-[#0d1422] p-6">
            <h2
              id="controlled-release-form-title"
              className="text-xl font-black text-white"
            >
              {form.mode === "authorize"
                ? "Prepare controlled-release authorization"
                : form.mode === "observation"
                  ? "Record 24-hour canary observation"
                  : "Record immediate rollback"}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              {form.candidate.title} · revision{" "}
              {form.candidate.entityRevisionSha256.slice(0, 16)}
            </p>

            {form.mode === "authorize" && (
              <fieldset className="mt-5 rounded-2xl border border-neutral-800 p-4">
                <legend className="px-2 text-xs font-bold text-neutral-300">
                  Independently authorized channels
                </legend>
                <label className="flex gap-3 text-sm text-neutral-200">
                  <input
                    type="checkbox"
                    checked={form.publication}
                    disabled={!workspace?.canaryPassed}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        publication: event.target.checked,
                      })
                    }
                  />
                  Public publication authorization
                </label>
                <label className="mt-3 flex gap-3 text-sm text-neutral-200">
                  <input
                    type="checkbox"
                    checked={form.rag}
                    disabled={!workspace?.canaryPassed}
                    onChange={(event) =>
                      setForm({ ...form, rag: event.target.checked })
                    }
                  />
                  RAG eligibility authorization
                </label>
                {!workspace?.canaryPassed && (
                  <p className="mt-3 text-xs text-violet-200">
                    Initial canary is publication-only. RAG remains blocked.
                  </p>
                )}
              </fieldset>
            )}

            <label className="mt-5 block text-xs font-bold text-neutral-300">
              Accountable rationale
              <textarea
                rows={4}
                value={form.rationale}
                onChange={(event) =>
                  setForm({ ...form, rationale: event.target.value })
                }
                placeholder="Explain the evidence, monitoring result, or rollback reason."
                className="mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-950 p-3 text-sm text-white"
              />
              <span className="mt-1 block text-[10px] text-neutral-500">
                Minimum 30 characters; stored in the immutable audit record.
              </span>
            </label>

            <fieldset className="mt-5 space-y-3 rounded-2xl border border-neutral-800 p-4">
              <legend className="px-2 text-xs font-bold text-neutral-300">
                Required release attestations
              </legend>
              {[
                ["revisionRechecked", "I rechecked the exact current revision."],
                ["citationsRechecked", "I rechecked every linked citation."],
                [
                  "safetyBoundariesRechecked",
                  "I confirmed conventional-care and emergency boundaries.",
                ],
                ["rollbackReady", "I confirmed the rollback path is ready."],
              ].map(([field, label]) => (
                <label
                  key={field}
                  className="flex gap-3 text-xs leading-5 text-neutral-300"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(form[field as keyof ReleaseForm])}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        [field]: event.target.checked,
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            {form.mode === "observation" && (
              <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-5 text-emerald-100">
                This records 24 hours with zero safety incidents, zero
                prohibited-claim detections, and zero retrieval leakage.
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm(null);
                  setConfirming(false);
                }}
                className="rounded-xl border border-neutral-700 px-4 py-3 text-sm font-bold text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formReady || saving}
                onClick={() => setConfirming(true)}
                className="rounded-xl bg-violet-300 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40"
              >
                Review final confirmation
              </button>
            </div>

            {confirming && (
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                <p className="text-sm font-black text-rose-100">
                  Final controlled-release confirmation
                </p>
                <p className="mt-2 text-xs leading-5 text-neutral-300">
                  This records an immutable authorization or rollback. It does
                  not execute deployment, publication, or RAG activation.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    className="rounded-lg px-3 py-2 text-xs font-bold text-neutral-300"
                  >
                    Go back
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submit()}
                    className="rounded-lg bg-rose-300 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-40"
                  >
                    {saving ? "Recording…" : "Confirm and record"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
