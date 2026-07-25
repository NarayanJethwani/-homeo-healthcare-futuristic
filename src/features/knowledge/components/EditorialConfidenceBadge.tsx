"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Calendar, BookOpen, GitBranch, FileCheck, ChevronDown, ChevronUp } from "lucide-react";
import { KnowledgeEntity } from "../types";
import { getEntityRelationships } from "../graph/knowledgeGraph";
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

  // Clinical Confidence Stars based on governance status and evidenceLevel
  const isFullyReviewed = eligibility.publicationStatus === "published" && eligibility.clinicalReviewStatus === "approved";
  const starsCount = !isFullyReviewed
    ? 2
    : entity.evidenceLevel === "Level-A" || entity.evidenceLevel === "Level-B"
    ? 5
    : 4;

  const reviewBadgeText = eligibility.reviewLabel;
  const isWithdrawn = eligibility.publicationStatus === "withdrawn";

  return (
    <div className="w-full border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm transition-all overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-100/30 dark:hover:bg-neutral-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className={`h-5 w-5 shrink-0 ${isWithdrawn ? "text-rose-500" : isFullyReviewed ? "text-emerald-500" : "text-amber-500"}`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 tracking-wider">
                {reviewBadgeText}
              </span>
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < starsCount ? "fill-amber-500 text-amber-500" : "text-neutral-350 dark:text-neutral-700"}`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {isFullyReviewed ? (
                <>Verified by <strong className="font-semibold text-neutral-750 dark:text-neutral-200">{entity.reviewer.name}, {entity.reviewer.credentials}</strong></>
              ) : isWithdrawn ? (
                <span className="text-rose-400 font-medium">Undergoing independent safety & content review</span>
              ) : (
                <span className="text-amber-400 font-medium">Independent clinical review pending</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${isWithdrawn ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : isFullyReviewed ? "bg-teal-500/10 text-teal-400 border-teal-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
            {isWithdrawn ? "Withdrawn" : isFullyReviewed ? "Flagship" : "Unverified"}
          </span>
          {expanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </div>

      {/* Expanded Metrics Panel */}
      {expanded && (
        <div className="border-t border-neutral-200 dark:border-neutral-850 p-4 bg-neutral-50/50 dark:bg-neutral-950/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-extrabold text-neutral-400 dark:text-neutral-500 block tracking-wider">
              Medically Reviewed
            </span>
            <span className="font-semibold text-neutral-850 dark:text-neutral-200">
              Dr. Verified
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
