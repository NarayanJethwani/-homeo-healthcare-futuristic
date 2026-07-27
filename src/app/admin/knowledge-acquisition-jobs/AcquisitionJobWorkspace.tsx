"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  Loader2,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

type MediaType = "text/plain" | "application/pdf" | "application/zip";
const FIELD_CLASS =
  "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600";

interface Source {
  sourceId: string;
  title: string;
  sourceVersion: string;
  usePolicy: "citation-only" | "governed-extraction";
  rightsDecision:
    | "pending"
    | "citation-only-confirmed"
    | "controlled-extraction-approved"
    | "blocked";
  rightsDecisionVersion: number;
  jobEligible: boolean;
}

interface Job {
  jobId: string;
  sourceId: string;
  sourceTitle: string;
  sourceVersion: string;
  rightsDecisionVersion: number;
  acquisitionMethod:
    | "manual-controlled-import"
    | "object-storage-transfer";
  expectedMediaType: MediaType;
  status:
    | "proposed"
    | "approved"
    | "rejected"
    | "artifact-recorded"
    | "verified";
  artifactId: string | null;
  verificationId: string | null;
  version: number;
  artifact: {
    sha256: string;
    byteLength: number;
    mediaType: MediaType;
  } | null;
}

interface ProgramOwner {
  recordId: string;
  status: "verification-pending" | "eligible" | "suspended";
}

interface Workspace {
  sources: Source[];
  programOwners: ProgramOwner[];
  jobs: Job[];
  summary: {
    eligibleSourceCount: number;
    proposedJobCount: number;
    approvedJobCount: number;
    artifactCount: number;
    verifiedArtifactCount: number;
  };
  authority: {
    acquisitionExecutionAutomaticallyGranted: false;
    extractionAuthorityGranted: false;
    draftingAuthorityGranted: false;
    publicationAuthorityGranted: false;
    publicIndexAuthorityGranted: false;
    productionRagAuthorityGranted: false;
  };
}

export default function AcquisitionJobWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sourceId, setSourceId] = useState("");
  const [method, setMethod] = useState<
    "manual-controlled-import" | "object-storage-transfer"
  >("manual-controlled-import");
  const [mediaType, setMediaType] = useState<MediaType>("text/plain");
  const [proposalEvidence, setProposalEvidence] = useState("");
  const [jobId, setJobId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject">("approve");
  const [decisionEvidence, setDecisionEvidence] = useState("");
  const [sha256, setSha256] = useState("");
  const [byteLength, setByteLength] = useState("");
  const [privateObjectRef, setPrivateObjectRef] = useState("");
  const [custodyEvidence, setCustodyEvidence] = useState("");
  const [verificationSha, setVerificationSha] = useState("");
  const [verificationBytes, setVerificationBytes] = useState("");
  const [verificationEvidence, setVerificationEvidence] = useState("");

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/acquisition-jobs", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "ACQUISITION_JOB_READ_FAILED");
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

  const selectedJob = useMemo(
    () => workspace?.jobs.find((job) => job.jobId === jobId) || null,
    [jobId, workspace]
  );
  const owners =
    workspace?.programOwners.filter((owner) => owner.status === "eligible") ||
    [];

  async function mutate(body: unknown, success: string) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/knowledge/acquisition-jobs", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "ACQUISITION_JOB_REQUEST_FAILED");
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

  function proposeJob() {
    void mutate(
      {
        action: "propose-job",
        sourceId,
        expectedVersion: null,
        acquisitionMethod: method,
        expectedMediaType: mediaType,
        proposalEvidenceRef: proposalEvidence,
      },
      "Job proposed. A different administrator must record program-owner approval."
    );
  }

  function decideJob() {
    if (!selectedJob) return;
    void mutate(
      {
        action: "decide-job",
        jobId: selectedJob.jobId,
        expectedVersion: selectedJob.version,
        decision,
        programOwnerRecordId: ownerId,
        decisionEvidenceRef: decisionEvidence,
      },
      decision === "approve"
        ? "Execution envelope approved. No source was downloaded."
        : "Job rejected. A revised proposal may be submitted."
    );
  }

  function recordArtifact() {
    if (!selectedJob) return;
    void mutate(
      {
        action: "record-artifact",
        jobId: selectedJob.jobId,
        expectedVersion: selectedJob.version,
        sha256,
        byteLength: Number(byteLength),
        mediaType: selectedJob.expectedMediaType,
        privateObjectRef,
        custodyEvidenceRef: custodyEvidence,
      },
      "Immutable artifact metadata recorded. Independent checksum verification remains required."
    );
  }

  function verifyArtifact() {
    if (!selectedJob?.artifactId) return;
    void mutate(
      {
        action: "verify-artifact",
        jobId: selectedJob.jobId,
        expectedVersion: selectedJob.version,
        artifactId: selectedJob.artifactId,
        observedSha256: verificationSha,
        observedByteLength: Number(verificationBytes),
        verificationEvidenceRef: verificationEvidence,
      },
      "Independent checksum verification recorded. Publication and RAG remain disabled."
    );
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
              onClick={() => router.push("/admin/knowledge-acquisition")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Assignment & rights control
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              KEP-1 step 6
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Acquisition jobs & immutable artifacts
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              This records human authorization and source custody. It never
              downloads, extracts, drafts, publishes, indexes, or embeds content.
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
                ["Eligible sources", workspace.summary.eligibleSourceCount],
                ["Proposed jobs", workspace.summary.proposedJobCount],
                ["Approved jobs", workspace.summary.approvedJobCount],
                ["Artifacts", workspace.summary.artifactCount],
                ["Verified artifacts", workspace.summary.verifiedArtifactCount],
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

            <section className="grid gap-6 lg:grid-cols-3">
              <Panel icon={PackageCheck} title="1. Propose job">
                <select
                  value={sourceId}
                  onChange={(event) => setSourceId(event.target.value)}
                  className={FIELD_CLASS}
                >
                  <option value="">Select rights-approved source</option>
                  {workspace.sources
                    .filter((source) => source.jobEligible)
                    .map((source) => (
                      <option key={source.sourceId} value={source.sourceId}>
                        {source.title} · rights v{source.rightsDecisionVersion}
                      </option>
                    ))}
                </select>
                <select
                  value={method}
                  onChange={(event) =>
                    setMethod(event.target.value as typeof method)
                  }
                  className={FIELD_CLASS}
                >
                  <option value="manual-controlled-import">
                    Manual controlled import
                  </option>
                  <option value="object-storage-transfer">
                    Object-storage transfer
                  </option>
                </select>
                <select
                  value={mediaType}
                  onChange={(event) =>
                    setMediaType(event.target.value as MediaType)
                  }
                  className={FIELD_CLASS}
                >
                  <option value="text/plain">Plain text</option>
                  <option value="application/pdf">PDF</option>
                  <option value="application/zip">ZIP archive</option>
                </select>
                <input
                  value={proposalEvidence}
                  onChange={(event) => setProposalEvidence(event.target.value)}
                  placeholder="Private proposal evidence reference"
                  className={FIELD_CLASS}
                />
                <ActionButton
                  disabled={busy || !sourceId || proposalEvidence.length < 8}
                  onClick={proposeJob}
                >
                  Propose acquisition job
                </ActionButton>
              </Panel>

              <Panel icon={ShieldCheck} title="2. Approve envelope">
                <JobSelect
                  jobs={workspace.jobs.filter(
                    (job) => job.status === "proposed"
                  )}
                  value={jobId}
                  onChange={setJobId}
                />
                <select
                  value={ownerId}
                  onChange={(event) => setOwnerId(event.target.value)}
                  className={FIELD_CLASS}
                >
                  <option value="">Select verified program owner</option>
                  {owners.map((owner) => (
                    <option key={owner.recordId} value={owner.recordId}>
                      {owner.recordId}
                    </option>
                  ))}
                </select>
                <select
                  value={decision}
                  onChange={(event) =>
                    setDecision(event.target.value as typeof decision)
                  }
                  className={FIELD_CLASS}
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                </select>
                <input
                  value={decisionEvidence}
                  onChange={(event) => setDecisionEvidence(event.target.value)}
                  placeholder="Private decision evidence reference"
                  className={FIELD_CLASS}
                />
                <ActionButton
                  disabled={
                    busy ||
                    selectedJob?.status !== "proposed" ||
                    !ownerId ||
                    decisionEvidence.length < 8
                  }
                  onClick={decideJob}
                >
                  Record owner decision
                </ActionButton>
              </Panel>

              <Panel icon={Fingerprint} title="3. Record & verify">
                <JobSelect
                  jobs={workspace.jobs.filter((job) =>
                    ["approved", "artifact-recorded"].includes(job.status)
                  )}
                  value={jobId}
                  onChange={(value) => {
                    setJobId(value);
                    const job = workspace.jobs.find(
                      (candidate) => candidate.jobId === value
                    );
                    setVerificationSha(job?.artifact?.sha256 || "");
                    setVerificationBytes(
                      job?.artifact?.byteLength?.toString() || ""
                    );
                  }}
                />
                {selectedJob?.status === "approved" ? (
                  <>
                    <input
                      value={sha256}
                      onChange={(event) => setSha256(event.target.value)}
                      placeholder="SHA-256 (64 lowercase hex)"
                      className={FIELD_CLASS}
                    />
                    <input
                      value={byteLength}
                      onChange={(event) => setByteLength(event.target.value)}
                      placeholder="Exact byte length"
                      inputMode="numeric"
                      className={FIELD_CLASS}
                    />
                    <input
                      value={privateObjectRef}
                      onChange={(event) =>
                        setPrivateObjectRef(event.target.value)
                      }
                      placeholder="private:// object reference"
                      className={FIELD_CLASS}
                    />
                    <input
                      value={custodyEvidence}
                      onChange={(event) =>
                        setCustodyEvidence(event.target.value)
                      }
                      placeholder="Private custody evidence reference"
                      className={FIELD_CLASS}
                    />
                    <ActionButton
                      disabled={
                        busy ||
                        !/^[a-f0-9]{64}$/.test(sha256) ||
                        Number(byteLength) <= 0 ||
                        !privateObjectRef.startsWith("private://") ||
                        custodyEvidence.length < 8
                      }
                      onClick={recordArtifact}
                    >
                      Record immutable artifact
                    </ActionButton>
                  </>
                ) : selectedJob?.status === "artifact-recorded" ? (
                  <>
                    <input
                      value={verificationSha}
                      onChange={(event) =>
                        setVerificationSha(event.target.value)
                      }
                      placeholder="Independently observed SHA-256"
                      className={FIELD_CLASS}
                    />
                    <input
                      value={verificationBytes}
                      onChange={(event) =>
                        setVerificationBytes(event.target.value)
                      }
                      placeholder="Independently observed byte length"
                      inputMode="numeric"
                      className={FIELD_CLASS}
                    />
                    <input
                      value={verificationEvidence}
                      onChange={(event) =>
                        setVerificationEvidence(event.target.value)
                      }
                      placeholder="Private verification evidence reference"
                      className={FIELD_CLASS}
                    />
                    <ActionButton
                      disabled={
                        busy ||
                        !/^[a-f0-9]{64}$/.test(verificationSha) ||
                        Number(verificationBytes) <= 0 ||
                        verificationEvidence.length < 8
                      }
                      onClick={verifyArtifact}
                    >
                      Record independent verification
                    </ActionButton>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    Select an approved job or recorded artifact.
                  </p>
                )}
              </Panel>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <h2 className="font-bold">Authority remains closed</h2>
              </div>
              <div className="grid gap-2 text-sm text-slate-400 sm:grid-cols-3">
                <p>Extraction execution: external and separately controlled</p>
                <p>Drafting and publication: disabled</p>
                <p>Public indexing and production RAG: inactive</p>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof ShieldCheck;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-4 flex items-center gap-3">
        <Icon className="h-5 w-5 text-violet-300" />
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function JobSelect({
  jobs,
  value,
  onChange,
}: {
  jobs: Job[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={FIELD_CLASS}
    >
      <option value="">Select job</option>
      {jobs.map((job) => (
        <option key={job.jobId} value={job.jobId}>
          {job.sourceTitle} · {job.status} · v{job.version}
        </option>
      ))}
    </select>
  );
}

function ActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-xl bg-violet-400 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
