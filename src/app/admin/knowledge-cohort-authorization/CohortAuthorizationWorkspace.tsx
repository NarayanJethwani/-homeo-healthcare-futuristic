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
const APPROVE_PHRASE =
  "I AUTHORIZE KEP-3 COHORT PREPARATION WITHOUT ASSIGNMENT, PUBLICATION, OR RAG AUTHORITY";
const REJECT_PHRASE = "I REJECT THIS KEP-3 COHORT PROPOSAL";
const CHECKS = [
  ["selectionEvidenceReviewed", "All selection evidence reviewed"],
  ["capacityEvidenceReviewed", "All four capacity proofs reviewed"],
  ["riskRegisterReviewed", "Risk register and residual risks reviewed"],
  [
    "withdrawnAndFlagshipExclusionsConfirmed",
    "Withdrawn and KEP-1 flagship exclusions confirmed",
  ],
  ["zeroProductionRagConfirmed", "Production RAG remains empty"],
  ["noAutomaticAssignmentsConfirmed", "No assignments are created"],
  ["authorityBoundaryAccepted", "Limited authority boundary accepted"],
] as const;

interface Workspace {
  prerequisites: {
    ready: boolean;
    blockerCode: string | null;
    currentProposal: null | {
      proposalId: string;
      proposalSha256: string;
      cohortLabel: string;
      selectedEntityIds: string[];
      kep1DecisionId: string;
      inventorySha256: string;
      proposedByActorId: string;
      proposedAt: string;
      residualRiskCount: number;
    };
    eligibleOwners: Array<{
      recordId: string;
      version: number;
      updatedAt: string;
    }>;
  };
  authorizations: Array<{
    authorizationId: string;
    decision: "approved" | "rejected";
    proposalId: string;
    selectedEntityCount: number;
    programOwnerRecordId: string;
    blockerCount: number;
    residualRiskCount: number;
    authorizedAt: string;
    current: boolean;
  }>;
  readiness:
    | "cohort-preparation-authorized"
    | "cohort-proposal-rejected"
    | "authorization-pending";
}

function lines(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CohortAuthorizationWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected">(
    "rejected"
  );
  const [ownerId, setOwnerId] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [blockers, setBlockers] = useState("");
  const [risks, setRisks] = useState("");
  const [rationale, setRationale] = useState("");
  const [authorizationEvidenceRef, setAuthorizationEvidenceRef] =
    useState("");
  const [meetingMinutesRef, setMeetingMinutesRef] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "/api/admin/knowledge/cohort-authorization",
        { cache: "no-store", credentials: "same-origin" }
      );
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body?.error?.code ||
            "KEP3_AUTHORIZATION_WORKSPACE_READ_FAILED"
        );
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

  const currentAuthorization = useMemo(
    () =>
      workspace?.authorizations.find(
        (authorization) => authorization.current
      ) || null,
    [workspace]
  );
  const requiredPhrase =
    decision === "approved" ? APPROVE_PHRASE : REJECT_PHRASE;

  async function submit() {
    const proposal = workspace?.prerequisites.currentProposal;
    if (!proposal || !ownerId) {
      setError("Action blocked: KEP3_AUTHORIZATION_PREREQUISITES_REQUIRED");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        "/api/admin/knowledge/cohort-authorization",
        {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "record-cohort-authorization",
            decision,
            proposalId: proposal.proposalId,
            expectedProposalSha256: proposal.proposalSha256,
            programOwnerRecordId: ownerId,
            checklist: Object.fromEntries(
              CHECKS.map(([key]) => [key, Boolean(checks[key])])
            ),
            blockers: lines(blockers),
            residualRisks: lines(risks),
            rationale,
            authorizationEvidenceRef,
            meetingMinutesRef,
            confirmationPhrase,
          }),
        }
      );
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(
          body?.error?.code || "KEP3_AUTHORIZATION_SUBMISSION_FAILED"
        );
      }
      setMessage(
        `Immutable ${body.result.decision} authorization ${body.result.authorizationId} recorded.`
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
        <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() =>
                router.push("/admin/knowledge-cohort-planning")
              }
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Cohort planning
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              KEP-3 independent gate
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Cohort authorization
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Independently approve or reject the exact latest cohort proposal.
              Approval permits controlled preparation only and creates no
              assignments or release authority.
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
                  "Authorization prerequisites",
                  workspace.prerequisites.ready ? "Ready" : "Blocked",
                ],
                [
                  "Eligible program owners",
                  workspace.prerequisites.eligibleOwners.length,
                ],
                ["Current state", workspace.readiness],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-4"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-2 text-xl font-black">{value}</p>
                </div>
              ))}
            </section>

            {workspace.prerequisites.blockerCode && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
                Authorization is blocked:{" "}
                <span className="font-mono">
                  {workspace.prerequisites.blockerCode}
                </span>
              </div>
            )}

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-cyan-300" />
                  <h2 className="font-bold">
                    Record immutable authorization
                  </h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    className={FIELD}
                    value={decision}
                    onChange={(event) => {
                      setDecision(
                        event.target.value as "approved" | "rejected"
                      );
                      setConfirmationPhrase("");
                    }}
                  >
                    <option value="rejected">Reject proposal</option>
                    <option value="approved">Approve preparation</option>
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
                  placeholder="Blockers, one per line. Approval requires none; rejection requires at least one."
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
                  placeholder="Accountable authorization rationale"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={FIELD}
                    value={authorizationEvidenceRef}
                    onChange={(event) =>
                      setAuthorizationEvidenceRef(event.target.value)
                    }
                    placeholder="Private authorization evidence reference"
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
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-100">
                  Type exactly:{" "}
                  <span className="font-mono font-bold">
                    {requiredPhrase}
                  </span>
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
                    Boolean(currentAuthorization)
                  }
                  onClick={() => void submit()}
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Gavel className="h-4 w-4" />
                  )}
                  Record authorization
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="font-bold">Exact current proposal</h2>
                  {workspace.prerequisites.currentProposal ? (
                    <div className="mt-4 space-y-3 text-sm text-slate-400">
                      <p className="text-lg font-semibold text-slate-100">
                        {
                          workspace.prerequisites.currentProposal
                            .cohortLabel
                        }
                      </p>
                      <p>
                        {
                          workspace.prerequisites.currentProposal
                            .selectedEntityIds.length
                        }{" "}
                        entities ·{" "}
                        {
                          workspace.prerequisites.currentProposal
                            .residualRiskCount
                        }{" "}
                        residual risks
                      </p>
                      <p className="break-all font-mono text-[11px] text-slate-500">
                        {
                          workspace.prerequisites.currentProposal
                            .proposalId
                        }
                      </p>
                      <p className="break-all font-mono text-[11px] text-slate-500">
                        SHA-256:{" "}
                        {
                          workspace.prerequisites.currentProposal
                            .proposalSha256
                        }
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">
                      No current proposal is eligible for authorization.
                    </p>
                  )}
                </div>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <div className="flex gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
                    <p className="text-sm text-red-100">
                      Approval permits cohort preparation only. It cannot assign
                      contributors, approve content, publish, index, embed,
                      migrate, alter the RAG allowlist, or activate retrieval.
                    </p>
                  </div>
                </div>
                {currentAuthorization && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      <p className="font-bold">
                        Current decision: {currentAuthorization.decision}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-emerald-100/70">
                      {currentAuthorization.authorizationId}
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
