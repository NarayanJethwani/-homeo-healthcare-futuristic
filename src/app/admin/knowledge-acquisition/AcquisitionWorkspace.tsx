"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

type Role =
  | "clinical-author"
  | "independent-clinical-reviewer"
  | "evidence-reviewer"
  | "rights-reviewer";

interface OnboardingRecord {
  recordId: string;
  kind: "contributor" | "program-owner";
  status: "verification-pending" | "eligible" | "suspended";
  eligibleRoles: Role[];
  expertiseDomains: string[];
}

interface Assignment {
  assignmentId: string;
  entityId: string;
  entityTitle: string;
  role: Role;
  contributorId: string | null;
  status: "unassigned" | "proposed" | "approved" | "rejected";
  version: number;
}

interface Source {
  sourceId: string;
  title: string;
  usePolicy: "citation-only" | "governed-extraction";
  licenceStatus: string;
  linkedEntityIds: string[];
  decision:
    | "pending"
    | "citation-only-confirmed"
    | "controlled-extraction-approved"
    | "blocked";
  rightsReviewerContributorId: string | null;
  version: number;
}

interface Workspace {
  onboardingRecords: OnboardingRecord[];
  assignments: Assignment[];
  sources: Source[];
  summary: {
    eligibleContributors: number;
    activeProgramOwners: number;
    approvedAssignmentCount: number;
    assignmentCount: 32;
    sourceDecisionCount: number;
    sourceCount: number;
    controlledExtractionSources: number;
  };
  authority: {
    acquisitionDecisionGateOpen: boolean;
    controlledExtractionQueueGranted: boolean;
    draftingAuthorityGranted: false;
    publicationAuthorityGranted: false;
    productionRagAuthorityGranted: false;
  };
}

const roleLabel: Record<Role, string> = {
  "clinical-author": "Clinical author",
  "independent-clinical-reviewer": "Independent reviewer",
  "evidence-reviewer": "Evidence reviewer",
  "rights-reviewer": "Rights reviewer",
};

export default function AcquisitionWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [assignmentId, setAssignmentId] = useState("");
  const [contributorId, setContributorId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [assignmentEvidence, setAssignmentEvidence] = useState("");
  const [assignmentDecision, setAssignmentDecision] = useState<
    "approve" | "reject"
  >("approve");
  const [sourceId, setSourceId] = useState("");
  const [rightsReviewerId, setRightsReviewerId] = useState("");
  const [sourceEvidence, setSourceEvidence] = useState("");
  const [sourceDecision, setSourceDecision] = useState<
    "citation-only-confirmed" | "controlled-extraction-approved" | "blocked"
  >("citation-only-confirmed");

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/acquisition", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "ACQUISITION_READ_FAILED");
      }
      setWorkspace(payload.workspace);
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
    void loadWorkspace();
  }, [loadWorkspace, router]);

  const selectedAssignment = workspace?.assignments.find(
    (item) => item.assignmentId === assignmentId
  );
  const eligibleContributors = useMemo(
    () =>
      workspace?.onboardingRecords.filter(
        (record) =>
          record.kind === "contributor" &&
          record.status === "eligible" &&
          (!selectedAssignment ||
            record.eligibleRoles.includes(selectedAssignment.role))
      ) ?? [],
    [selectedAssignment, workspace]
  );
  const owners =
    workspace?.onboardingRecords.filter(
      (record) =>
        record.kind === "program-owner" && record.status === "eligible"
    ) ?? [];
  const rightsReviewers =
    workspace?.onboardingRecords.filter(
      (record) =>
        record.kind === "contributor" &&
        record.status === "eligible" &&
        record.eligibleRoles.includes("rights-reviewer")
    ) ?? [];

  async function mutate(body: unknown, success: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/knowledge/acquisition", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "ACQUISITION_REQUEST_FAILED");
      }
      setMessage(success);
      await loadWorkspace();
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

  function submitAssignment() {
    if (!selectedAssignment) return;
    if (
      selectedAssignment.status === "unassigned" ||
      selectedAssignment.status === "rejected"
    ) {
      void mutate(
        {
          action: "propose-assignment",
          entityId: selectedAssignment.entityId,
          role: selectedAssignment.role,
          contributorId,
          expectedVersion: selectedAssignment.version || null,
        },
        "Assignment proposed. A different administrator must record the owner decision."
      );
      return;
    }
    void mutate(
      {
        action: "decide-assignment",
        assignmentId: selectedAssignment.assignmentId,
        expectedVersion: selectedAssignment.version,
        decision: assignmentDecision,
        programOwnerRecordId: ownerId,
        decisionEvidenceRef: assignmentEvidence,
      },
      assignmentDecision === "approve"
        ? "Program-owner approval recorded."
        : "Program-owner rejection recorded. The slot can now be re-proposed."
    );
  }

  const selectedSource = workspace?.sources.find(
    (source) => source.sourceId === sourceId
  );

  function submitSourceDecision() {
    if (!selectedSource) return;
    void mutate(
      {
        action: "decide-source",
        sourceId: selectedSource.sourceId,
        expectedVersion: selectedSource.version || null,
        decision: sourceDecision,
        rightsReviewerContributorId: rightsReviewerId,
        rightsEvidenceRef: sourceEvidence,
      },
      "Rights decision recorded. No source content was downloaded or published."
    );
  }

  if (loading && !workspace) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-200 grid place-items-center">
        <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Knowledge dashboard
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              KEP-1 controlled operations
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Assignments & source acquisition
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Human approvals unlock rights decisions only. Drafting,
              publication, public indexing, and production RAG remain disabled.
            </p>
          </div>
          <button
            onClick={() => void loadWorkspace()}
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
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Eligible contributors", workspace.summary.eligibleContributors],
                ["Program owners", workspace.summary.activeProgramOwners],
                [
                  "Assignments",
                  `${workspace.summary.approvedAssignmentCount}/32`,
                ],
                [
                  "Rights decisions",
                  `${workspace.summary.sourceDecisionCount}/${workspace.summary.sourceCount}`,
                ],
                [
                  "Extraction queue",
                  workspace.summary.controlledExtractionSources,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-black">{value}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-cyan-300" />
                  <h2 className="font-bold">Editorial assignment gate</h2>
                </div>
                <div className="space-y-3">
                  <select
                    value={assignmentId}
                    onChange={(event) => {
                      setAssignmentId(event.target.value);
                      setContributorId("");
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  >
                    <option value="">Select one of 32 assignments</option>
                    {workspace.assignments
                      .filter((item) =>
                        ["unassigned", "proposed", "rejected"].includes(
                          item.status
                        )
                      )
                      .map((item) => (
                        <option key={item.assignmentId} value={item.assignmentId}>
                          {item.entityTitle} · {roleLabel[item.role]} ·{" "}
                          {item.status}
                        </option>
                      ))}
                  </select>
                  {selectedAssignment?.status === "unassigned" ||
                  selectedAssignment?.status === "rejected" ? (
                    <select
                      value={contributorId}
                      onChange={(event) => setContributorId(event.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                    >
                      <option value="">Select verified contributor</option>
                      {eligibleContributors.map((record) => (
                        <option key={record.recordId} value={record.recordId}>
                          {record.recordId}
                        </option>
                      ))}
                    </select>
                  ) : selectedAssignment?.status === "proposed" ? (
                    <>
                      <select
                        value={ownerId}
                        onChange={(event) => setOwnerId(event.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                      >
                        <option value="">Select verified program owner</option>
                        {owners.map((record) => (
                          <option key={record.recordId} value={record.recordId}>
                            {record.recordId}
                          </option>
                        ))}
                      </select>
                      <input
                        value={assignmentEvidence}
                        onChange={(event) =>
                          setAssignmentEvidence(event.target.value)
                        }
                        placeholder="Private owner-decision evidence reference"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                      />
                      <select
                        value={assignmentDecision}
                        onChange={(event) =>
                          setAssignmentDecision(
                            event.target.value as "approve" | "reject"
                          )
                        }
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                      >
                        <option value="approve">Approve assignment</option>
                        <option value="reject">Reject and re-propose</option>
                      </select>
                    </>
                  ) : null}
                  <button
                    disabled={
                      busy ||
                      !selectedAssignment ||
                      (["unassigned", "rejected"].includes(
                        selectedAssignment.status
                      )
                        ? !contributorId
                        : !ownerId || assignmentEvidence.length < 8)
                    }
                    onClick={submitAssignment}
                    className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
                  >
                    {selectedAssignment?.status === "proposed"
                      ? "Record owner decision"
                      : "Propose assignment"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-emerald-300" />
                  <h2 className="font-bold">Source-rights decision gate</h2>
                </div>
                {!workspace.authority.acquisitionDecisionGateOpen && (
                  <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    Locked until all 32 assignments are approved.
                  </p>
                )}
                <div className="space-y-3">
                  <select
                    value={sourceId}
                    onChange={(event) => {
                      setSourceId(event.target.value);
                      const source = workspace.sources.find(
                        (item) => item.sourceId === event.target.value
                      );
                      setSourceDecision(
                        source?.usePolicy === "governed-extraction"
                          ? "controlled-extraction-approved"
                          : "citation-only-confirmed"
                      );
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  >
                    <option value="">Select registered source</option>
                    {workspace.sources.map((source) => (
                      <option key={source.sourceId} value={source.sourceId}>
                        {source.title} · {source.decision}
                      </option>
                    ))}
                  </select>
                  <select
                    value={rightsReviewerId}
                    onChange={(event) => setRightsReviewerId(event.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  >
                    <option value="">Select assigned rights reviewer</option>
                    {rightsReviewers.map((record) => (
                      <option key={record.recordId} value={record.recordId}>
                        {record.recordId}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sourceDecision}
                    onChange={(event) =>
                      setSourceDecision(
                        event.target.value as typeof sourceDecision
                      )
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  >
                    <option value="citation-only-confirmed">
                      Citation only confirmed
                    </option>
                    <option value="controlled-extraction-approved">
                      Controlled extraction approved
                    </option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <input
                    value={sourceEvidence}
                    onChange={(event) => setSourceEvidence(event.target.value)}
                    placeholder="Private rights-evidence reference"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm"
                  />
                  <button
                    disabled={
                      busy ||
                      !workspace.authority.acquisitionDecisionGateOpen ||
                      !selectedSource ||
                      !rightsReviewerId ||
                      sourceEvidence.length < 8
                    }
                    onClick={submitSourceDecision}
                    className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
                  >
                    Record rights decision
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <h2 className="font-bold">Immutable authority boundary</h2>
              </div>
              <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                <p>Drafting authority: disabled</p>
                <p>Publication authority: disabled</p>
                <p>Production RAG: inactive</p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
