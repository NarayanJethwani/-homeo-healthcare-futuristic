"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

const FIELD =
  "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600";
const CONFIRMATION =
  "I RECORD A KEP-3 PLANNING PROPOSAL WITHOUT PUBLICATION OR RAG AUTHORITY";
const ROLES = [
  "clinical-author",
  "independent-clinical-reviewer",
  "evidence-reviewer",
  "rights-reviewer",
] as const;
const FACTORS = [
  ["clinicalImportance", "Clinical importance"],
  ["safetySensitivity", "Safety sensitivity"],
  ["searchDemand", "Search demand"],
  ["sourceAvailability", "Source availability"],
  ["graphValue", "Graph value"],
] as const;

type FactorKey = (typeof FACTORS)[number][0];

interface Candidate {
  entityId: string;
  entityType: string;
  title: string;
  safetyRiskTier: string;
  inventoryPriorityScore: number;
  recommendation: string;
  reasons: string[];
}

interface Workspace {
  prerequisites: {
    ready: boolean;
    blockerCode: string | null;
    currentKep1Decision: null | {
      decisionId: string;
      evaluationId: string;
      decidedAt: string;
    };
    inventorySha256: string;
    inventoryEntityCount: number;
    eligibleCandidateCount: number;
  };
  candidates: Candidate[];
  proposals: Array<{
    proposalId: string;
    cohortLabel: string;
    selectedEntityCount: number;
    proposedAt: string;
    current: boolean;
  }>;
}

interface SelectionDraft {
  factors: Record<FactorKey, number>;
  rationale: string;
  evidenceRefs: string;
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function emptySelection(): SelectionDraft {
  return {
    factors: {
      clinicalImportance: 0,
      safetySensitivity: 0,
      searchDemand: 0,
      sourceAvailability: 0,
      graphValue: 0,
    },
    rationale: "",
    evidenceRefs: "",
  };
}

export default function CohortPlanningWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<
    Record<string, SelectionDraft>
  >({});
  const [cohortLabel, setCohortLabel] = useState("");
  const [methodology, setMethodology] = useState("");
  const [risks, setRisks] = useState("");
  const [planningEvidenceRef, setPlanningEvidenceRef] = useState("");
  const [riskRegisterRef, setRiskRegisterRef] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [capacity, setCapacity] = useState<
    Record<string, { count: number; evidenceRef: string }>
  >(
    Object.fromEntries(
      ROLES.map((role) => [role, { count: 0, evidenceRef: "" }])
    )
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/admin/knowledge/cohort-planning",
        { cache: "no-store", credentials: "same-origin" }
      );
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body?.error?.code || "KEP3_PLANNING_WORKSPACE_READ_FAILED"
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

  const selectedCount = Object.keys(selected).length;
  const filteredCandidates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return workspace?.candidates.slice(0, 60) || [];
    return (
      workspace?.candidates
        .filter((candidate) =>
          `${candidate.entityId} ${candidate.title} ${candidate.entityType}`
            .toLowerCase()
            .includes(normalized)
        )
        .slice(0, 60) || []
    );
  }, [query, workspace]);

  function toggle(entityId: string) {
    setSelected((current) => {
      if (current[entityId]) {
        const next = { ...current };
        delete next[entityId];
        return next;
      }
      if (Object.keys(current).length >= 25) return current;
      return { ...current, [entityId]: emptySelection() };
    });
  }

  function updateSelection(
    entityId: string,
    update: (current: SelectionDraft) => SelectionDraft
  ) {
    setSelected((current) => ({
      ...current,
      [entityId]: update(current[entityId] || emptySelection()),
    }));
  }

  async function submit() {
    const prerequisites = workspace?.prerequisites;
    if (!prerequisites?.ready || !prerequisites.currentKep1Decision) {
      setError("Action blocked: KEP3_PLANNING_CURRENT_KEP1_GO_REQUIRED");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        "/api/admin/knowledge/cohort-planning",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "record-cohort-proposal",
            cohortLabel,
            expectedKep1DecisionId:
              prerequisites.currentKep1Decision.decisionId,
            expectedInventorySha256: prerequisites.inventorySha256,
            selections: Object.entries(selected).map(
              ([entityId, selection]) => ({
                entityId,
                factors: selection.factors,
                rationale: selection.rationale,
                evidenceRefs: lines(selection.evidenceRefs),
              })
            ),
            roleCapacity: ROLES.map((role) => ({
              role,
              availableEntityCapacity: capacity[role].count,
              evidenceRef: capacity[role].evidenceRef,
            })),
            selectionMethodology: methodology,
            residualRisks: lines(risks),
            planningEvidenceRef,
            riskRegisterRef,
            confirmationPhrase,
          }),
        }
      );
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body?.error?.code || "KEP3_PLANNING_SUBMISSION_FAILED"
        );
      }
      setMessage(
        `Immutable proposal ${body.result.proposalId} recorded for ${body.result.selectedEntityCount} entities.`
      );
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Proposal failed."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading && !workspace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <Loader2 className="h-7 w-7 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge-decision")}
              className="mb-3 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> KEP-1 decision
            </button>
            <h1 className="flex items-center gap-3 text-3xl font-semibold">
              <ClipboardList className="h-8 w-8 text-cyan-400" />
              KEP-3 controlled cohort planning
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Record an evidence-backed planning proposal for no more than 25
              entities. This workspace cannot assign work, approve content,
              publish, index, embed, migrate, or activate production RAG.
            </p>
          </div>
          <button
            onClick={() => void load()}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </header>

        <section
          className={`rounded-2xl border p-5 ${
            workspace?.prerequisites.ready
              ? "border-emerald-700 bg-emerald-950/30"
              : "border-amber-700 bg-amber-950/30"
          }`}
        >
          <div className="flex items-start gap-3">
            {workspace?.prerequisites.ready ? (
              <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-400" />
            ) : (
              <ShieldAlert className="mt-0.5 h-6 w-6 text-amber-400" />
            )}
            <div>
              <h2 className="font-semibold">
                {workspace?.prerequisites.ready
                  ? "Planning prerequisites satisfied"
                  : "Planning is blocked"}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                {workspace?.prerequisites.blockerCode ||
                  `${workspace?.prerequisites.eligibleCandidateCount} eligible candidates from ${workspace?.prerequisites.inventoryEntityCount} inventory records.`}
              </p>
              <p className="mt-2 break-all font-mono text-xs text-slate-500">
                Inventory SHA-256:{" "}
                {workspace?.prerequisites.inventorySha256}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-200">
            {message}
          </div>
        )}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Candidate inventory</h2>
              <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs text-cyan-300">
                {selectedCount}/25 selected
              </span>
            </div>
            <input
              className={`${FIELD} mt-4`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search entity ID, title, or type"
            />
            <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {filteredCandidates.map((candidate) => {
                const checked = Boolean(selected[candidate.entityId]);
                return (
                  <label
                    key={candidate.entityId}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${
                      checked
                        ? "border-cyan-600 bg-cyan-950/30"
                        : "border-slate-800 bg-slate-950/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(candidate.entityId)}
                      className="mt-1"
                    />
                    <span className="min-w-0">
                      <span className="block font-medium">
                        {candidate.entityId} · {candidate.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {candidate.entityType} · risk{" "}
                        {candidate.safetyRiskTier} · inventory score{" "}
                        {candidate.inventoryPriorityScore}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h2 className="text-lg font-semibold">Selection evidence</h2>
              <div className="mt-4 space-y-4">
                {Object.entries(selected).map(([entityId, draft]) => {
                  const candidate = workspace?.candidates.find(
                    (item) => item.entityId === entityId
                  );
                  return (
                    <div
                      key={entityId}
                      className="rounded-xl border border-slate-700 bg-slate-950/60 p-4"
                    >
                      <div className="font-medium">
                        {entityId} · {candidate?.title}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {FACTORS.map(([key, label]) => (
                          <label key={key} className="text-xs text-slate-400">
                            {label}
                            <input
                              type="number"
                              min={0}
                              max={5}
                              className={`${FIELD} mt-1`}
                              value={draft.factors[key]}
                              onChange={(event) =>
                                updateSelection(entityId, (current) => ({
                                  ...current,
                                  factors: {
                                    ...current.factors,
                                    [key]: Number(event.target.value),
                                  },
                                }))
                              }
                            />
                          </label>
                        ))}
                      </div>
                      <textarea
                        className={`${FIELD} mt-3`}
                        value={draft.rationale}
                        onChange={(event) =>
                          updateSelection(entityId, (current) => ({
                            ...current,
                            rationale: event.target.value,
                          }))
                        }
                        placeholder="Entity-specific selection rationale"
                      />
                      <textarea
                        className={`${FIELD} mt-3`}
                        value={draft.evidenceRefs}
                        onChange={(event) =>
                          updateSelection(entityId, (current) => ({
                            ...current,
                            evidenceRefs: event.target.value,
                          }))
                        }
                        placeholder="Private evidence references, one per line"
                      />
                    </div>
                  );
                })}
                {selectedCount === 0 && (
                  <p className="text-sm text-slate-500">
                    Select at least one eligible inventory entity.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Capacity and accountability</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {ROLES.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-slate-800 p-4"
              >
                <div className="font-medium">{role}</div>
                <div className="mt-3 grid grid-cols-[140px_1fr] gap-3">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    className={FIELD}
                    value={capacity[role].count}
                    onChange={(event) =>
                      setCapacity((current) => ({
                        ...current,
                        [role]: {
                          ...current[role],
                          count: Number(event.target.value),
                        },
                      }))
                    }
                    aria-label={`${role} available entity capacity`}
                  />
                  <input
                    className={FIELD}
                    value={capacity[role].evidenceRef}
                    onChange={(event) =>
                      setCapacity((current) => ({
                        ...current,
                        [role]: {
                          ...current[role],
                          evidenceRef: event.target.value,
                        },
                      }))
                    }
                    placeholder="Private capacity evidence ref"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              className={FIELD}
              value={cohortLabel}
              onChange={(event) => setCohortLabel(event.target.value)}
              placeholder="Cohort label"
            />
            <input
              className={FIELD}
              value={planningEvidenceRef}
              onChange={(event) =>
                setPlanningEvidenceRef(event.target.value)
              }
              placeholder="Planning evidence reference"
            />
            <textarea
              className={FIELD}
              value={methodology}
              onChange={(event) => setMethodology(event.target.value)}
              placeholder="Selection methodology and weighting justification"
            />
            <textarea
              className={FIELD}
              value={risks}
              onChange={(event) => setRisks(event.target.value)}
              placeholder="Residual risks, one per line"
            />
            <input
              className={FIELD}
              value={riskRegisterRef}
              onChange={(event) => setRiskRegisterRef(event.target.value)}
              placeholder="Risk register reference"
            />
            <input
              className={FIELD}
              value={confirmationPhrase}
              onChange={(event) =>
                setConfirmationPhrase(event.target.value)
              }
              placeholder={CONFIRMATION}
            />
          </div>
          <div className="mt-5 rounded-xl border border-amber-800 bg-amber-950/30 p-4 text-sm text-amber-200">
            Exact confirmation required: <strong>{CONFIRMATION}</strong>
          </div>
          <button
            disabled={
              busy ||
              !workspace?.prerequisites.ready ||
              selectedCount < 1 ||
              selectedCount > 25
            }
            onClick={() => void submit()}
            className="mt-5 flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Record immutable planning proposal
          </button>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <h2 className="text-lg font-semibold">Recorded proposals</h2>
          <div className="mt-4 space-y-2">
            {workspace?.proposals.map((proposal) => (
              <div
                key={proposal.proposalId}
                className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-medium">{proposal.cohortLabel}</span>
                  <span className="text-xs text-slate-500">
                    {proposal.current ? "current evidence" : "historical"}
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs text-slate-500">
                  {proposal.proposalId} · {proposal.selectedEntityCount} entities
                </div>
                {proposal.current && (
                  <button
                    onClick={() =>
                      router.push(
                        "/admin/knowledge-cohort-authorization"
                      )
                    }
                    className="mt-3 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
                  >
                    Open independent authorization
                  </button>
                )}
              </div>
            ))}
            {workspace?.proposals.length === 0 && (
              <p className="text-sm text-slate-500">
                No KEP-3 planning proposals recorded.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
