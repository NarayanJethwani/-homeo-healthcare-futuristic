"use client";

import { useState } from "react";
import type {
  ControlledReleaseExecutionCandidate,
  ControlledReleaseExecutionWorkspace,
} from "@/features/knowledge/governance/controlledReleaseExecutionTypes";

type Mode = "execute" | "rollback";

interface FormState {
  mode: Mode;
  candidate: ControlledReleaseExecutionCandidate;
  rationale: string;
  confirmed: boolean;
}

const ERRORS: Record<string, string> = {
  CONTROLLED_EXECUTION_CANARY_POLICY_FAILED:
    "This authorization is not eligible for the publication-only FAQ canary.",
  CONTROLLED_EXECUTION_REVISION_HASH_MISMATCH:
    "The article changed after authorization. Review the new revision first.",
  CONTROLLED_EXECUTION_RELEASE_HEAD_CONFLICT:
    "A newer release decision exists. Refresh before continuing.",
  CONTROLLED_EXECUTION_HEAD_CONFLICT:
    "Another execution action was recorded first. Refresh before continuing.",
  CONTROLLED_EXECUTION_ALREADY_ACTIVE:
    "This publication canary is already active.",
  CONTROLLED_EXECUTION_ACTIVE_CANARY_REQUIRED:
    "There is no active publication canary to roll back.",
  UNAUTHORIZED: "Your administrator session expired. Sign in again.",
  FORBIDDEN: "Your account does not have release execution authority.",
};

export default function ControlledReleaseExecutionPanel() {
  const [workspace, setWorkspace] =
    useState<ControlledReleaseExecutionWorkspace | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadWorkspace() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "/api/admin/knowledge/controlled-release-execution",
        { credentials: "same-origin", cache: "no-store" }
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(
          payload?.error?.code ||
            "CONTROLLED_EXECUTION_WORKSPACE_READ_FAILED"
        );
      }
      setWorkspace(payload.workspace);
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "UNKNOWN";
      setError(
        ERRORS[code] ||
          "The controlled deployment workspace could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!form) return;
    setSaving(true);
    setError("");
    const current = form.candidate.currentExecution;
    const common = {
      requestId: crypto.randomUUID(),
      entityId: form.candidate.entityId,
      expectedRevisionSha256:
        form.candidate.entityRevisionSha256,
      expectedReleaseId: form.candidate.releaseId,
      expectedPreviousExecutionId:
        current?.executionId || null,
      rationale: form.rationale,
    };
    const body =
      form.mode === "execute"
        ? {
            action: "execute-publication-canary",
            ...common,
            channels: { publication: true, rag: false },
          }
        : {
            action: "rollback-publication-canary",
            ...common,
          };
    try {
      const response = await fetch(
        "/api/admin/knowledge/controlled-release-execution",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(
          payload?.error?.code ||
            "CONTROLLED_EXECUTION_ACTION_FAILED"
        );
      }
      setForm(null);
      await loadWorkspace();
    } catch (caught) {
      const code =
        caught instanceof Error ? caught.message : "UNKNOWN";
      setError(
        ERRORS[code] ||
          "The deployment action was not recorded. Refresh and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  const formReady =
    Boolean(form?.confirmed) &&
    Boolean(form && form.rationale.trim().length >= 30);

  return (
    <section className="rounded-3xl border border-cyan-500/25 bg-cyan-500/5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            Audited deployment actuator
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Execute the authorized publication canary
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Execution consumes the exact release authorization, starts the
            24-hour observation clock, and keeps RAG blocked. Rollback takes
            effect immediately.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void loadWorkspace()}
          className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 disabled:opacity-40"
        >
          {loading ? "Checking…" : "Check executable releases"}
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
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Active canaries", workspace.activeCanaryCount],
              ["Executions recorded", workspace.executedCount],
              ["Rollbacks recorded", workspace.rolledBackCount],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  {label}
                </p>
                <p className="mt-2 text-xl font-black text-white">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            {workspace.candidates.map((candidate) => {
              const active =
                candidate.currentExecution?.outcome ===
                  "publication-canary-executed" &&
                candidate.currentExecution.releaseId ===
                  candidate.releaseId;
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
                            active
                              ? "bg-emerald-500/10 text-emerald-300"
                              : candidate.canExecute
                                ? "bg-cyan-500/10 text-cyan-200"
                                : "bg-neutral-800 text-neutral-400"
                          }`}
                        >
                          {active
                            ? "Canary live"
                            : candidate.canExecute
                              ? "Ready to execute"
                              : "Not executable"}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                          Publication
                        </span>
                        <span className="rounded-full bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-300">
                          RAG blocked
                        </span>
                      </div>
                      <h3 className="mt-2 font-black text-white">
                        {candidate.title}
                      </h3>
                      <p className="mt-1 text-xs text-neutral-500">
                        {candidate.entityId} · release{" "}
                        {candidate.releaseId} · revision{" "}
                        {candidate.entityRevisionSha256.slice(0, 12)}
                      </p>
                      {active && candidate.currentExecution && (
                        <p className="mt-2 text-xs text-emerald-200">
                          Observation eligible{" "}
                          {candidate.currentExecution.observationEligibleAt
                            ? new Date(
                                candidate.currentExecution.observationEligibleAt
                              ).toLocaleString()
                            : "after 24 hours"}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {candidate.canExecute && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              mode: "execute",
                              candidate,
                              rationale: "",
                              confirmed: false,
                            })
                          }
                          className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-black text-slate-950"
                        >
                          Execute publication canary
                        </button>
                      )}
                      {active && (
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              mode: "rollback",
                              candidate,
                              rationale: "",
                              confirmed: false,
                            })
                          }
                          className="rounded-xl border border-rose-500/40 px-3 py-2 text-xs font-bold text-rose-200"
                        >
                          Roll back now
                        </button>
                      )}
                    </div>
                  </div>
                  {!candidate.canExecute &&
                    !active &&
                    candidate.blockingReasons.length > 0 && (
                      <p className="mt-3 text-xs text-neutral-500">
                        {candidate.blockingReasons.join(" · ")}
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
          aria-labelledby="execution-form-title"
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-xl rounded-3xl border border-cyan-500/30 bg-[#0d1422] p-6">
            <h2
              id="execution-form-title"
              className="text-xl font-black text-white"
            >
              {form.mode === "execute"
                ? "Execute publication-only canary"
                : "Roll back publication canary"}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              {form.candidate.title} · RAG remains blocked
            </p>
            <label className="mt-5 block text-xs font-bold text-neutral-300">
              Accountable rationale
              <textarea
                value={form.rationale}
                onChange={(event) =>
                  setForm({
                    ...form,
                    rationale: event.target.value,
                  })
                }
                className="mt-2 min-h-28 w-full rounded-xl border border-neutral-700 bg-black/40 p-3 text-sm text-white"
                placeholder={
                  form.mode === "execute"
                    ? "Confirm why this exact revision is ready for the monitored publication canary."
                    : "Describe why the canary is being removed from public publication."
                }
              />
            </label>
            <label className="mt-4 flex gap-3 rounded-xl border border-neutral-800 p-3 text-sm text-neutral-200">
              <input
                type="checkbox"
                checked={form.confirmed}
                onChange={(event) =>
                  setForm({
                    ...form,
                    confirmed: event.target.checked,
                  })
                }
              />
              {form.mode === "execute"
                ? "I confirm publication-only execution for this exact revision; RAG stays blocked."
                : "I confirm immediate fail-closed rollback for this exact execution."}
            </label>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setForm(null)}
                className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-bold text-neutral-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!formReady || saving}
                onClick={() => void submit()}
                className={`rounded-xl px-4 py-2 text-sm font-black text-slate-950 disabled:opacity-40 ${
                  form.mode === "execute"
                    ? "bg-cyan-300"
                    : "bg-rose-300"
                }`}
              >
                {saving
                  ? "Recording…"
                  : form.mode === "execute"
                    ? "Execute and start monitoring"
                    : "Confirm immediate rollback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
