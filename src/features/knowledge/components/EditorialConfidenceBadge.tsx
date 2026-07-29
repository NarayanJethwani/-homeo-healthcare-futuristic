"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  BookOpen,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { KnowledgeEntity } from "../types";
import { formatMedicalDateLong } from "../utils/dateFormatter";

interface EditorialConfidenceBadgeProps {
  entity: KnowledgeEntity;
  reviewedDate: string;
}

import { evaluatePublicationEligibility } from "../governance/publicationGuard";

export default function EditorialConfidenceBadge({ entity, reviewedDate }: EditorialConfidenceBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const eligibility = evaluatePublicationEligibility(entity);
  
  // Format Date
  const formattedDate = formatMedicalDateLong(reviewedDate);

  const isFullyReviewed = eligibility.publicationStatus === "published" && eligibility.clinicalReviewStatus === "approved";
  const isWithdrawn = eligibility.publicationStatus === "withdrawn";
  const refsCount = Array.isArray(entity.content?.references)
    ? entity.content.references.length
    : 0;
  const statusHeading = isWithdrawn
    ? "Clinical safety review in progress"
    : isFullyReviewed
      ? "Independent clinical review complete"
      : "Editorial review complete";
  const statusDetail = isWithdrawn
    ? "This entry is being reassessed for clinical safety and accuracy."
    : isFullyReviewed
      ? `Clinically reviewed by ${entity.reviewer.name}, ${entity.reviewer.credentials}`
      : "Independent clinical validation is pending.";
  const statusPill = isWithdrawn
    ? "Under review"
    : isFullyReviewed
      ? "Clinically reviewed"
      : "Validation pending";
  const statusTone = isWithdrawn
    ? "border-rose-500/20 bg-rose-500/10 text-rose-500"
    : isFullyReviewed
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  const iconTone = isWithdrawn
    ? "text-rose-500"
    : isFullyReviewed
      ? "text-emerald-500"
      : "text-sky-600 dark:text-sky-400";
  const clinicalReviewDetail = isWithdrawn
    ? "Safety reassessment underway"
    : isFullyReviewed
      ? "Independent review complete"
      : "Independent validation pending";

  return (
    <div className="w-full border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm transition-all overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className={`h-5 w-5 shrink-0 ${iconTone}`} />
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
              {statusHeading}
            </p>
            <p className="mt-0.5 text-xs text-neutral-600 dark:text-neutral-400">
              {statusDetail}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusTone}`}>
            {statusPill}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </div>

      {/* Expanded Metrics Panel */}
      {expanded && (
        <div className="border-t border-neutral-200 dark:border-neutral-850 p-4 bg-neutral-50/50 dark:bg-neutral-950/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Clinical Validation
            </span>
            <span className="font-semibold text-neutral-850 dark:text-neutral-200">
              {clinicalReviewDetail}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Last Updated
            </span>
            <div className="flex items-center gap-1 text-neutral-850 dark:text-neutral-200 font-semibold font-mono">
              <Calendar className="h-3.5 w-3.5 text-neutral-450 shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Evidence Sources
            </span>
            <div className="flex items-center gap-1 text-neutral-850 dark:text-neutral-200 font-semibold">
              <BookOpen className="h-3.5 w-3.5 text-neutral-450 shrink-0" />
              <span>{refsCount} Ref. ({entity.evidenceLevel.replace(/-/g, " ")})</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Editorial Status
            </span>
            <div className="flex items-center gap-1 text-neutral-850 dark:text-neutral-200 font-semibold">
              <FileCheck className="h-3.5 w-3.5 text-neutral-450 shrink-0" />
              <span>{entity.editorialStatus === "published" && entity.versionInfo.updated !== entity.versionInfo.created ? "Updated" : "Published"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
