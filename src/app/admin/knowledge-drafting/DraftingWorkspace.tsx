"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardCheck,
  FilePenLine,
  Fingerprint,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const FIELD =
  "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600";

interface Dossier {
  entityId: string;
  entityType:
    | "disease"
    | "symptom"
    | "remedy"
    | "lab-test"
    | "faq"
    | "research"
    | "case-study";
  title: string;
  sourceIds: string[];
  approvedAuthorContributorId: string | null;
  currentRevisionNumber: number | null;
}

interface Artifact {
  artifactId: string;
  sourceId: string;
  sourceVersion: string;
  sha256: string;
  byteLength: number;
  mediaType: string;
}

interface DraftSummary {
  revisionId: string;
  revisionNumber: number;
  entityId: string;
  entityType: string;
  title: string;
  summary: string;
  status: "draft";
  artifactId: string;
  sourceId: string;
  contentSha256: string;
  passageCount: number;
  claimCount: number;
  graphProposalCount: number;
  evidenceStatus: "draft";
  createdAt: string;
}

interface Workspace {
  dossiers: Dossier[];
  verifiedArtifacts: Artifact[];
  drafts: DraftSummary[];
  summary: {
    verifiedArtifactCount: number;
    draftEntityCount: number;
    revisionCount: number;
    draftClaimCount: number;
    proposedGraphRelationshipCount: number;
  };
}

export default function DraftingWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [entityId, setEntityId] = useState("");
  const [artifactId, setArtifactId] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [locator, setLocator] = useState("");
  const [passageText, setPassageText] = useState("");
  const [claimText, setClaimText] = useState("");
  const [claimType, setClaimType] = useState<
    "definition" | "traditional-use"
  >("traditional-use");
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [limitations, setLimitations] = useState("");
  const [relationshipType, setRelationshipType] = useState("describes");
  const [targetEntityId, setTargetEntityId] = useState("");
  const [graphRationale, setGraphRationale] = useState("");
  const [changeSummary, setChangeSummary] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/drafting", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "DRAFT_WORKSPACE_READ_FAILED");
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
    void load();
  }, [load, router]);

  const dossier = useMemo(
    () => workspace?.dossiers.find((item) => item.entityId === entityId) || null,
    [entityId, workspace]
  );
  const eligibleArtifacts = useMemo(
    () =>
      workspace?.verifiedArtifacts.filter((artifact) =>
        dossier?.sourceIds.includes(artifact.sourceId)
      ) || [],
    [dossier, workspace]
  );

  function selectEntity(value: string) {
    setEntityId(value);
    const selected = workspace?.dossiers.find((item) => item.entityId === value);
    setTitle(selected?.title || "");
    setArtifactId("");
  }

  async function saveRevision() {
    if (!dossier?.approvedAuthorContributorId) {
      setError("Action blocked: DRAFT_APPROVED_AUTHOR_ASSIGNMENT_REQUIRED");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const passageId = `${entityId}-PASSAGE-1`;
    try {
      const response = await fetch("/api/admin/knowledge/drafting", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create-revision",
          entityId,
          artifactId,
          authorContributorId: dossier.approvedAuthorContributorId,
          expectedRevisionNumber: dossier.currentRevisionNumber,
          entityType: dossier.entityType,
          title,
          summary,
          passages: [{ passageId, locator, text: passageText }],
          claims: [
            {
              claimId: `${entityId}-CLAIM-1`,
              text: claimText,
              claimType,
              evidenceStatus:
                claimType === "traditional-use"
                  ? "traditional-description"
                  : "insufficient-evidence",
              sourcePassageIds: [passageId],
            },
          ],
          evidenceProfile: {
            evidenceLevel: "Traditional-Literature",
            evidenceSummary,
            limitations: [limitations],
            sourcePassageIds: [passageId],
          },
          graphProposals: targetEntityId
            ? [
                {
                  proposalId: `${entityId}-GRAPH-1`,
                  relationshipType,
                  targetEntityId,
                  rationale: graphRationale,
                  sourcePassageIds: [passageId],
                },
              ]
            : [],
          changeSummary,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "DRAFT_REVISION_WRITE_FAILED");
      }
      setMessage(
        `Revision ${payload.result.revisionId} recorded. It remains private and unapproved.`
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
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge-acquisition-jobs")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Acquisition artifacts
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              KEP-1 step 7
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Private provenance drafting
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Create passage-linked draft revisions from verified artifacts.
              Nothing here approves, publishes, indexes, or activates RAG.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/admin/knowledge-review")}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-2 text-sm text-emerald-200"
            >
              <ClipboardCheck className="h-4 w-4" /> Independent review
            </button>
            <button
              onClick={() => void load()}
              className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
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
                ["Verified artifacts", workspace.summary.verifiedArtifactCount],
                ["Draft entities", workspace.summary.draftEntityCount],
                ["Immutable revisions", workspace.summary.revisionCount],
                ["Draft claims", workspace.summary.draftClaimCount],
                [
                  "Graph proposals",
                  workspace.summary.proposedGraphRelationshipCount,
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

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-2">
                  <FilePenLine className="h-5 w-5 text-cyan-300" />
                  <h2 className="font-bold">New immutable draft revision</h2>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    className={FIELD}
                    value={entityId}
                    onChange={(event) => selectEntity(event.target.value)}
                  >
                    <option value="">Select KEP-1 entity</option>
                    {workspace.dossiers.map((item) => (
                      <option key={item.entityId} value={item.entityId}>
                        {item.entityId} — {item.title}
                      </option>
                    ))}
                  </select>
                  <select
                    className={FIELD}
                    value={artifactId}
                    onChange={(event) => setArtifactId(event.target.value)}
                  >
                    <option value="">Select verified artifact</option>
                    {eligibleArtifacts.map((artifact) => (
                      <option key={artifact.artifactId} value={artifact.artifactId}>
                        {artifact.sourceId} — {artifact.sha256.slice(0, 12)}
                      </option>
                    ))}
                  </select>
                </div>
                {dossier && !dossier.approvedAuthorContributorId && (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    This entity has no approved clinical-author assignment.
                    Drafting is blocked.
                  </p>
                )}
                <input
                  className={FIELD}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Draft title"
                />
                <textarea
                  className={FIELD}
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Neutral draft summary"
                  rows={3}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={FIELD}
                    value={locator}
                    onChange={(event) => setLocator(event.target.value)}
                    placeholder="Source locator: page, section, paragraph"
                  />
                  <select
                    className={FIELD}
                    value={claimType}
                    onChange={(event) =>
                      setClaimType(
                        event.target.value as "definition" | "traditional-use"
                      )
                    }
                  >
                    <option value="traditional-use">
                      Traditional-use description
                    </option>
                    <option value="definition">Definition</option>
                  </select>
                </div>
                <textarea
                  className={FIELD}
                  value={passageText}
                  onChange={(event) => setPassageText(event.target.value)}
                  placeholder="Exact extracted passage"
                  rows={5}
                />
                <textarea
                  className={FIELD}
                  value={claimText}
                  onChange={(event) => setClaimText(event.target.value)}
                  placeholder="Claim derived from this passage"
                  rows={3}
                />
                <textarea
                  className={FIELD}
                  value={evidenceSummary}
                  onChange={(event) => setEvidenceSummary(event.target.value)}
                  placeholder="Draft evidence summary"
                  rows={3}
                />
                <input
                  className={FIELD}
                  value={limitations}
                  onChange={(event) => setLimitations(event.target.value)}
                  placeholder="Evidence limitation"
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    className={FIELD}
                    value={relationshipType}
                    onChange={(event) => setRelationshipType(event.target.value)}
                  >
                    <option value="describes">Describes</option>
                    <option value="references">References</option>
                    <option value="related-to">Related to</option>
                    <option value="has-symptom">Has symptom</option>
                    <option value="has-modality">Has modality</option>
                    <option value="supported-by">Supported by</option>
                  </select>
                  <input
                    className={FIELD}
                    value={targetEntityId}
                    onChange={(event) => setTargetEntityId(event.target.value)}
                    placeholder="Optional graph target ID"
                  />
                </div>
                {targetEntityId && (
                  <input
                    className={FIELD}
                    value={graphRationale}
                    onChange={(event) => setGraphRationale(event.target.value)}
                    placeholder="Graph proposal rationale"
                  />
                )}
                <input
                  className={FIELD}
                  value={changeSummary}
                  onChange={(event) => setChangeSummary(event.target.value)}
                  placeholder="Revision change summary"
                />
                <button
                  disabled={
                    busy ||
                    !dossier?.approvedAuthorContributorId ||
                    !artifactId
                  }
                  onClick={() => void saveRevision()}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Record private draft revision
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <Fingerprint className="h-5 w-5" />
                    <h2 className="font-bold">Authority boundary</h2>
                  </div>
                  <p className="mt-3 text-sm text-cyan-100/80">
                    Every passage and revision is SHA-256 bound to a verified
                    source artifact. All claims and graph proposals require
                    independent review. Publication and RAG remain disabled.
                  </p>
                </div>
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                  <h2 className="font-bold">Current private drafts</h2>
                  {workspace.drafts.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No draft revisions have been recorded.
                    </p>
                  ) : (
                    workspace.drafts.map((draft) => (
                      <article
                        key={draft.revisionId}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-semibold">{draft.title}</p>
                            <p className="text-xs text-slate-500">
                              {draft.revisionId}
                            </p>
                          </div>
                          <span className="h-fit rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
                            draft only
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-400">
                          {draft.passageCount} passages · {draft.claimCount} claims
                          · {draft.graphProposalCount} graph proposals
                        </p>
                        <p className="mt-2 font-mono text-[11px] text-slate-600">
                          {draft.contentSha256}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
