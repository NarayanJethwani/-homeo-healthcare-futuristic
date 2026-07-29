"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileWarning,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { KmsKnowledgeEntity } from "../types";
import {
  buildFastTrackSummary,
  type FastTrackAssessment,
} from "@/features/knowledge/governance/fastTrackPolicy";

interface FastTrackGovernancePanelProps {
  entities: readonly KmsKnowledgeEntity[];
  onReviewEntity: (entity: KmsKnowledgeEntity) => void;
}

const RULES = [
  "Keep existing independently reviewed content available under background monitoring.",
  "Require a registered citation for every new or changed medical article.",
  "Send new, unverified, conflicting, withdrawn, or high-risk claims to human review.",
  "Let AI summarize evidence and draft corrections, but never grant itself clinical approval.",
  "Immediately block unsafe treatment-replacement and prohibited cure claims.",
  "Preserve a human-readable reason and audit trail for every exception.",
];

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "cyan" | "emerald" | "amber" | "rose";
}) {
  const colors = {
    cyan: "border-cyan-500/20 bg-cyan-500/5 text-cyan-300",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-300",
    rose: "border-rose-500/20 bg-rose-500/5 text-rose-300",
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

function ReviewCard({
  assessment,
  onReview,
}: {
  assessment: FastTrackAssessment;
  onReview: () => void;
}) {
  const blocked = assessment.lane === "blocked";
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
            {blocked ? (
              <AlertTriangle className="h-4 w-4 text-rose-300" />
            ) : (
              <FileWarning className="h-4 w-4 text-amber-300" />
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                blocked ? "text-rose-300" : "text-amber-300"
              }`}
            >
              {blocked ? "Blocked" : "Human review"}
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
        <button
          type="button"
          onClick={onReview}
          className="flex items-center gap-1 rounded-xl border border-neutral-700 px-3 py-2 text-xs font-bold text-neutral-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
        >
          Review article <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {assessment.flags.length > 0 ? (
          assessment.flags.map((flag) => (
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
          ))
        ) : (
          <p className="text-xs leading-5 text-neutral-300">
            This is new or not independently verified. AI may prepare the
            evidence brief; human confirmation remains required.
          </p>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        {assessment.recommendation}
      </p>
    </article>
  );
}

export default function FastTrackGovernancePanel({
  entities,
  onReviewEntity,
}: FastTrackGovernancePanelProps) {
  const [rulesApplied, setRulesApplied] = useState(false);
  const summary = useMemo(() => buildFastTrackSummary(entities), [entities]);
  const exceptions = rulesApplied
    ? summary.assessments.filter(
        (assessment) => assessment.lane !== "background-monitoring"
      )
    : [];
  const entityById = useMemo(
    () => new Map(entities.map((entity) => [entity.id, entity])),
    [entities]
  );

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
              Existing reviewed knowledge remains available. AI continuously
              checks citations and medical-safety signals; only new,
              unverified, conflicting, or risky statements come to you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRulesApplied(true)}
            disabled={rulesApplied}
            className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-default disabled:bg-emerald-400"
          >
            {rulesApplied ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Rules applied
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" /> Apply rules in one click
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Knowledge entries" value={summary.total} tone="cyan" />
        <Metric
          label="Background monitoring"
          value={summary.backgroundMonitoring}
          tone="emerald"
        />
        <Metric
          label="Needs your review"
          value={summary.humanReview}
          tone="amber"
        />
        <Metric label="Safety blocked" value={summary.blocked} tone="rose" />
      </div>

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
              <p className="text-xs font-bold">Encyclopedia principle</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-neutral-400">
              Scale comes from citations, version history, transparent
              corrections, and exception review—not from treating AI output as
              self-verifying.
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
                Potential issues are reports for your judgment, not automatic
                declarations that content is incorrect.
              </p>
            </div>
            {rulesApplied && (
              <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-bold text-neutral-300">
                {exceptions.length} exception
                {exceptions.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {!rulesApplied ? (
            <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-dashed border-neutral-800 bg-black/10 p-6 text-center">
              <div>
                <Bot className="mx-auto h-8 w-8 text-neutral-600" />
                <p className="mt-3 text-sm font-bold text-neutral-300">
                  Apply the rules to generate your focused review queue.
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
            <div className="mt-5 max-h-[720px] space-y-3 overflow-y-auto pr-1">
              {exceptions.map((assessment) => {
                const entity = entityById.get(assessment.entityId);
                if (!entity) return null;
                return (
                  <ReviewCard
                    key={assessment.entityId}
                    assessment={assessment}
                    onReview={() => onReviewEntity(entity)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
