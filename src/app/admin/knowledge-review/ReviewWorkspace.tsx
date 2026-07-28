"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  Loader2,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const FIELD =
  "w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder:text-slate-600";

type ReviewKind = "clinical" | "evidence";
type Decision = "approved" | "changes-requested" | "rejected";

interface DraftReviewItem {
  entityId: string;
  entityType: string;
  title: string;
  revisionId: string;
  revisionNumber: number;
  contentSha256: string;
  claimIds: string[];
  graphProposalIds: string[];
  clinicalReviewerContributorId: string | null;
  evidenceReviewerContributorId: string | null;
  clinicalDecision: Decision | null;
  evidenceDecision: Decision | null;
  readiness: "pending" | "changes-requested" | "rejected" | "review-complete";
}

interface Workspace {
  drafts: DraftReviewItem[];
  reviews: Array<{
    reviewId: string;
    reviewKind: ReviewKind;
    entityId: string;
    revisionId: string;
    reviewedContentSha256: string;
    decision: Decision;
    reviewedClaimCount: number;
    reviewedGraphProposalCount: number;
    reviewedAt: string;
  }>;
  summary: {
    currentDraftCount: number;
    clinicalReviewCount: number;
    evidenceReviewCount: number;
    reviewCompleteCount: number;
    changesRequestedCount: number;
  };
}

const CLINICAL_CHECKS = [
  ["claimLanguageChecked", "Claim language and scope"],
  ["traditionalUseBoundaryChecked", "Traditional-use labeling"],
  ["emergencyEscalationChecked", "Emergency escalation language"],
  ["contraindicationChecked", "Safety and contraindications"],
  ["graphSafetyChecked", "Graph relationship safety"],
] as const;

const EVIDENCE_CHECKS = [
  ["citationTraceabilityChecked", "Passage and citation traceability"],
  ["evidenceStatusChecked", "Evidence status classification"],
  ["limitationsChecked", "Limitations are explicit"],
  ["conflictingEvidenceChecked", "Conflicting evidence considered"],
  ["conventionalCareBoundaryChecked", "Conventional-care boundary"],
] as const;

export default function ReviewWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [revisionId, setRevisionId] = useState("");
  const [reviewKind, setReviewKind] = useState<ReviewKind>("clinical");
  const [decision, setDecision] = useState<Decision>("approved");
  const [notes, setNotes] = useState("");
  const [conflicts, setConflicts] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/knowledge/review", {
        cache: "no-store",
        credentials: "same-origin",
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "REVIEW_WORKSPACE_READ_FAILED");
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

  const draft = useMemo(
    () =>
      workspace?.drafts.find((item) => item.revisionId === revisionId) || null,
    [revisionId, workspace]
  );
  const reviewerId =
    reviewKind === "clinical"
      ? draft?.clinicalReviewerContributorId
      : draft?.evidenceReviewerContributorId;
  const existingDecision =
    reviewKind === "clinical"
      ? draft?.clinicalDecision
      : draft?.evidenceDecision;
  const checklist =
    reviewKind === "clinical" ? CLINICAL_CHECKS : EVIDENCE_CHECKS;

  function changeKind(kind: ReviewKind) {
    setReviewKind(kind);
    setChecks({});
  }

  async function submit() {
    if (!draft || !reviewerId) {
      setError("Action blocked: REVIEW_APPROVED_ASSIGNMENT_REQUIRED");
      return;
    }
    setBusy(true);
    setError(null);
    setMessage(null);
    const clinicalChecklist =
      reviewKind === "clinical"
        ? Object.fromEntries(
            CLINICAL_CHECKS.map(([key]) => [key, Boolean(checks[key])])
          )
        : null;
    const evidenceChecklist =
      reviewKind === "evidence"
        ? Object.fromEntries(
            EVIDENCE_CHECKS.map(([key]) => [key, Boolean(checks[key])])
          )
        : null;
    try {
      const response = await fetch("/api/admin/knowledge/review", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit-review",
          reviewKind,
          entityId: draft.entityId,
          revisionId: draft.revisionId,
          expectedContentSha256: draft.contentSha256,
          reviewerContributorId: reviewerId,
          decision,
          declarationOfIndependence: true,
          conflictsDeclared: conflicts
            .split("\n")
            .map((value) => value.trim())
            .filter(Boolean),
          reviewedClaimIds: draft.claimIds,
          reviewedGraphProposalIds:
            reviewKind === "clinical" ? draft.graphProposalIds : [],
          clinicalChecklist,
          evidenceChecklist,
          notes,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.code || "REVIEW_SUBMISSION_FAILED");
      }
      setMessage(
        `${reviewKind} decision recorded as ${decision}. Publication and RAG remain disabled.`
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
        <Loader2 className="h-7 w-7 animate-spin text-emerald-300" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/knowledge-drafting")}
              className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Private drafting
            </button>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
              KEP-1 step 8
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Independent review gate
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Record clinical and evidence decisions against the exact current
              draft hash. Review completion never publishes or activates RAG.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => router.push("/admin/knowledge-evaluation")}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 px-4 py-2 text-sm text-emerald-200"
            >
              <FlaskConical className="h-4 w-4" /> Offline evaluation
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
                ["Current drafts", workspace.summary.currentDraftCount],
                ["Clinical decisions", workspace.summary.clinicalReviewCount],
                ["Evidence decisions", workspace.summary.evidenceReviewCount],
                ["Review complete", workspace.summary.reviewCompleteCount],
                ["Changes requested", workspace.summary.changesRequestedCount],
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

            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-emerald-300" />
                  <h2 className="font-bold">Record immutable decision</h2>
                </div>
                <select
                  className={FIELD}
                  value={revisionId}
                  onChange={(event) => setRevisionId(event.target.value)}
                >
                  <option value="">Select current draft revision</option>
                  {workspace.drafts.map((item) => (
                    <option key={item.revisionId} value={item.revisionId}>
                      {item.entityId} — {item.title} — V{item.revisionNumber}
                    </option>
                  ))}
                </select>
                <div className="grid gap-3 md:grid-cols-2">
                  <select
                    className={FIELD}
                    value={reviewKind}
                    onChange={(event) =>
                      changeKind(event.target.value as ReviewKind)
                    }
                  >
                    <option value="clinical">Independent clinical review</option>
                    <option value="evidence">Evidence review</option>
                  </select>
                  <select
                    className={FIELD}
                    value={decision}
                    onChange={(event) =>
                      setDecision(event.target.value as Decision)
                    }
                  >
                    <option value="approved">Approve exact revision</option>
                    <option value="changes-requested">Request changes</option>
                    <option value="rejected">Reject revision</option>
                  </select>
                </div>
                {draft && (
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-400">
                    <p>
                      Reviewer assignment:{" "}
                      <span className="text-slate-200">
                        {reviewerId || "not approved"}
                      </span>
                    </p>
                    <p className="mt-2 break-all font-mono">
                      SHA-256: {draft.contentSha256}
                    </p>
                    <p className="mt-2">
                      Coverage: {draft.claimIds.length} claims ·{" "}
                      {draft.graphProposalIds.length} graph proposals
                    </p>
                  </div>
                )}
                {existingDecision && (
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                    This review type already has an immutable {existingDecision}{" "}
                    decision for the selected revision.
                  </p>
                )}
                <div className="space-y-2">
                  {checklist.map(([key, label]) => (
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
                  value={conflicts}
                  onChange={(event) => setConflicts(event.target.value)}
                  placeholder="Declared conflicts, one per line. Approval requires none."
                  rows={2}
                />
                <textarea
                  className={FIELD}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Review rationale and findings"
                  rows={4}
                />
                <button
                  disabled={busy || !draft || !reviewerId || Boolean(existingDecision)}
                  onClick={() => void submit()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Record exact-hash decision
                </button>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <h2 className="font-bold">Current revision readiness</h2>
                {workspace.drafts.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No current draft revisions are available.
                  </p>
                ) : (
                  workspace.drafts.map((item) => (
                    <article
                      key={item.revisionId}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-xs text-slate-500">
                            {item.revisionId}
                          </p>
                        </div>
                        {item.readiness === "review-complete" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <span className="h-fit rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
                            {item.readiness}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <p>Clinical: {item.clinicalDecision || "pending"}</p>
                        <p>Evidence: {item.evidenceDecision || "pending"}</p>
                      </div>
                    </article>
                  ))
                )}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100/80">
                  Review complete is an internal readiness signal only. It grants
                  no editorial workflow approval, publication, indexing, or RAG
                  authority.
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
