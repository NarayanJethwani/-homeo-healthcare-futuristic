import type { KmsKnowledgeEntity } from "@/features/knowledge-admin/types";
import { CITATIONS } from "../content/citations";
import { checkProhibitedClaims } from "./prohibitedClaims";
import { WITHDRAWN_SAFETY_ENTITIES } from "./publicationGuard";

export type FastTrackLane =
  | "background-monitoring"
  | "human-review"
  | "blocked";

export type GovernanceFlagSeverity = "critical" | "high" | "medium";

export interface GovernanceFlag {
  code: string;
  severity: GovernanceFlagSeverity;
  message: string;
}

export interface FastTrackAssessment {
  entityId: string;
  title: string;
  entityType: string;
  lane: FastTrackLane;
  isNewOrUnverified: boolean;
  citationCount: number;
  citationComplete: boolean;
  flags: GovernanceFlag[];
  recommendation: string;
}

export interface FastTrackSummary {
  total: number;
  backgroundMonitoring: number;
  humanReview: number;
  blocked: number;
  criticalFlags: number;
  assessments: FastTrackAssessment[];
}

const citationIds = new Set(CITATIONS.map((citation) => citation.id));

function entityTitle(entity: KmsKnowledgeEntity): string {
  return entity.title?.en?.trim() || entity.id;
}

function serializedClinicalText(entity: KmsKnowledgeEntity): string {
  return [
    entity.title?.en,
    entity.summary?.en,
    JSON.stringify(entity.content || {}),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasIndependentReviewer(entity: KmsKnowledgeEntity): boolean {
  const reviewerName =
    typeof entity.reviewer === "string"
      ? entity.reviewer
      : entity.reviewer?.name;
  const authorName = entity.author?.name;
  return Boolean(
    reviewerName &&
      authorName &&
      reviewerName.trim().toLowerCase() !== authorName.trim().toLowerCase()
  );
}

function isExistingReviewedContent(entity: KmsKnowledgeEntity): boolean {
  const reviewedAt = Date.parse(
    entity.lastClinicalReview || entity.lastReviewed || ""
  );
  const updatedAt = Date.parse(entity.lastUpdated || "");
  const unchangedSinceReview =
    Number.isFinite(reviewedAt) &&
    Number.isFinite(updatedAt) &&
    updatedAt <= reviewedAt;

  const verifiedBaseline =
    entity.legacyVerificationStatus === "verified-published" ||
    (entity.reviewStatus === "clinically-reviewed" &&
      Boolean(entity.lastClinicalReview || entity.lastReviewed) &&
      (hasIndependentReviewer(entity) ||
        entity.editorialStatus === "published"));

  return verifiedBaseline && unchangedSinceReview;
}

function citationMismatchFlags(
  entity: KmsKnowledgeEntity,
  references: string[]
): GovernanceFlag[] {
  const title = entityTitle(entity).toLowerCase();
  const thyroid =
    title.includes("thyroid") ||
    title.includes("tsh") ||
    title.includes("anti-tpo");
  const gastrointestinal =
    title.includes("gerd") ||
    title.includes("reflux") ||
    title.includes("gastr");

  const flags: GovernanceFlag[] = [];
  if (thyroid && references.includes("CIT-0002")) {
    flags.push({
      code: "CITATION_TOPIC_MISMATCH",
      severity: "high",
      message:
        "A thyroid-related article cites the atopic-dermatitis study CIT-0002.",
    });
  }
  if (gastrointestinal && references.includes("CIT-0002")) {
    flags.push({
      code: "CITATION_TOPIC_MISMATCH",
      severity: "high",
      message:
        "A gastrointestinal article cites the atopic-dermatitis study CIT-0002.",
    });
  }
  return flags;
}

function medicalSafetyFlags(entity: KmsKnowledgeEntity): GovernanceFlag[] {
  const text = serializedClinicalText(entity);
  const flags: GovernanceFlag[] = [];
  const prohibited = checkProhibitedClaims(text);

  if (prohibited.length > 0) {
    flags.push({
      code: "PROHIBITED_MEDICAL_CLAIM",
      severity: "critical",
      message: `Potentially unsafe claim language detected: ${prohibited.join(", ")}.`,
    });
  }

  if (
    /\b(stop|discontinue|replace|avoid)\b.{0,60}\b(insulin|antibiotic|emergency|prescribed medication|thyroid hormone)\b/i.test(
      text
    )
  ) {
    flags.push({
      code: "TREATMENT_REPLACEMENT_RISK",
      severity: "critical",
      message:
        "Possible instruction to stop, avoid, or replace essential conventional care.",
    });
  }

  if (
    /\b(confirms?|diagnoses?|rules out)\b.{0,80}\b(disease|disorder|condition|cancer|infection)\b/i.test(
      text
    ) &&
    entity.entityType !== "research"
  ) {
    flags.push({
      code: "DIAGNOSTIC_CERTAINTY_REVIEW",
      severity: "high",
      message:
        "Diagnostic-certainty wording should be checked against the cited guideline.",
    });
  }

  return flags;
}

export function assessKnowledgeEntityForFastTrack(
  entity: KmsKnowledgeEntity
): FastTrackAssessment {
  const references = Array.isArray(entity.content?.references)
    ? entity.content.references.filter(
        (reference: unknown): reference is string =>
          typeof reference === "string"
      )
    : [];
  const missingCitationIds = references.filter(
    (reference: string) => !citationIds.has(reference)
  );
  const flags: GovernanceFlag[] = [];

  if (WITHDRAWN_SAFETY_ENTITIES.has(entity.id)) {
    flags.push({
      code: "SAFETY_WITHDRAWAL_ACTIVE",
      severity: "critical",
      message: "This entity is on the active clinical-safety withdrawal list.",
    });
  }

  if (references.length === 0 && entity.entityType !== "faq") {
    flags.push({
      code: "CITATION_REQUIRED",
      severity: "high",
      message: "No source citation is linked to this medical article.",
    });
  }

  if (missingCitationIds.length > 0) {
    flags.push({
      code: "CITATION_NOT_REGISTERED",
      severity: "high",
      message: `Unknown citation IDs: ${missingCitationIds.join(", ")}.`,
    });
  }

  flags.push(...citationMismatchFlags(entity, references));
  flags.push(...medicalSafetyFlags(entity));

  const citationComplete =
    entity.entityType === "faq" ||
    (references.length > 0 && missingCitationIds.length === 0);
  const isNewOrUnverified = !isExistingReviewedContent(entity);
  const hasCritical = flags.some((flag) => flag.severity === "critical");
  const hasHigh = flags.some((flag) => flag.severity === "high");

  let lane: FastTrackLane = "background-monitoring";
  let recommendation =
    "Keep available and monitor citations, source withdrawals, and medical-safety signals.";

  if (hasCritical) {
    lane = "blocked";
    recommendation =
      "Keep out of AI retrieval and publication updates until the accountable clinician resolves the critical flag.";
  } else if (isNewOrUnverified || hasHigh || !citationComplete) {
    lane = "human-review";
    recommendation =
      "AI may prepare a cited correction, but a human medical decision is required before this revision is trusted.";
  }

  return {
    entityId: entity.id,
    title: entityTitle(entity),
    entityType: entity.entityType,
    lane,
    isNewOrUnverified,
    citationCount: references.length,
    citationComplete,
    flags,
    recommendation,
  };
}

export function buildFastTrackSummary(
  entities: readonly KmsKnowledgeEntity[]
): FastTrackSummary {
  const assessments = entities
    .map(assessKnowledgeEntityForFastTrack)
    .sort((left, right) => {
      const laneRank: Record<FastTrackLane, number> = {
        blocked: 0,
        "human-review": 1,
        "background-monitoring": 2,
      };
      return (
        laneRank[left.lane] - laneRank[right.lane] ||
        left.title.localeCompare(right.title)
      );
    });

  return {
    total: assessments.length,
    backgroundMonitoring: assessments.filter(
      (item) => item.lane === "background-monitoring"
    ).length,
    humanReview: assessments.filter((item) => item.lane === "human-review")
      .length,
    blocked: assessments.filter((item) => item.lane === "blocked").length,
    criticalFlags: assessments.reduce(
      (count, item) =>
        count +
        item.flags.filter((flag) => flag.severity === "critical").length,
      0
    ),
    assessments,
  };
}
