import { KnowledgeEntity } from "../types";
import { CITATIONS } from "../content/citations";
import type { ControlledPublicationOverride } from "./controlledReleaseExecutionTypes";

export type PublicationStatus = "published" | "review-required" | "withdrawn" | "draft" | "archived";
export type ClinicalReviewStatus = "approved" | "pending" | "under-review" | "unverified";

export interface PublicationEligibilityResult {
  eligibleForPublicDisplay: boolean;
  eligibleForIndexing: boolean;
  eligibleForSitemap: boolean;
  eligibleForAiIngestion: boolean;
  eligibleByClinicalGovernance: boolean;
  eligibleByTemporaryPublicIndexException: boolean;
  publicationStatus: PublicationStatus;
  clinicalReviewStatus: ClinicalReviewStatus;
  reviewLabel: string;
  reasons: string[];
}

/**
 * Temporary control flag for transitional publication freeze.
 * While true, only governance-passing entities that are explicitly allowlisted
 * can be indexed, included in sitemaps, or ingested into RAG.
 */
export const TRANSITIONAL_PUBLICATION_FREEZE = true;

/**
 * Small explicit allowlist of flagship verified entities during transitional freeze.
 */
/**
 * Allowlist for transitional public search indexing.
 * Restricted to flagship editorially audited entries.
 */
export const PUBLIC_INDEX_ALLOWLIST: ReadonlySet<string> = new Set([
  "D0001", // GERD
  "D0002", // Eczema
  "S0001", // Heartburn
  "S0002", // Skin Eruptions
  "R0001", // Sulphur
  "R0002", // Nux Vomica
  "L0001", // CBC
  "L0002", // TSH
]);

/**
 * Allowlist for AI RAG retrieval ingestion.
 * MUST remain empty (new Set()) until an entity has proven independent clinical review
 * (immutable reviewer ID !== author ID) and complete RAG governance approval.
 */
export const RAG_INGESTION_ALLOWLIST: ReadonlySet<string> = new Set([]);

/**
 * Backward compatibility alias for PUBLIC_INDEX_ALLOWLIST.
 */
export const FLAGSHIP_ALLOWLIST = PUBLIC_INDEX_ALLOWLIST;

/**
 * Explicitly withdrawn entity IDs due to clinical safety / contamination / self-review issues.
 */
export const WITHDRAWN_SAFETY_ENTITIES: ReadonlySet<string> = new Set([
  "D0007",      // Asthma (contaminated with rhinitis/sinusitis content)
  "R0006",      // Arsenicum Album (misclassified as Plant, placeholder keynotes)
  "FAQ-safety", // Safety FAQ (self-reviewed safety claims)
]);

/**
 * Centrally evaluates publication and governance eligibility for any Knowledge entity.
 */
export function evaluatePublicationEligibility(
  entity: KnowledgeEntity | any,
  controlledOverride: ControlledPublicationOverride | null = null
): PublicationEligibilityResult {
  if (!entity) {
    return {
      eligibleForPublicDisplay: false,
      eligibleForIndexing: false,
      eligibleForSitemap: false,
      eligibleForAiIngestion: false,
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: false,
      publicationStatus: "draft",
      clinicalReviewStatus: "unverified",
      reviewLabel: "Draft",
      reasons: ["entity-null-or-undefined"],
    };
  }

  const reasons: string[] = [];
  const entityId = entity.id;
  const controlledPublicationActive =
    controlledOverride !== null &&
    controlledOverride.entityId === entityId &&
    controlledOverride.publicationApplied === true &&
    controlledOverride.ragApplied === false;

  // 1. Check for immediate safety withdrawals
  if (WITHDRAWN_SAFETY_ENTITIES.has(entityId) || entity.publicationStatus === "withdrawn" || entity.editorialStatus === "withdrawn") {
    if (controlledPublicationActive) {
      return {
        eligibleForPublicDisplay: true,
        eligibleForIndexing: true,
        eligibleForSitemap: true,
        eligibleForAiIngestion: false,
        eligibleByClinicalGovernance: true,
        eligibleByTemporaryPublicIndexException: false,
        publicationStatus: "published",
        clinicalReviewStatus: "approved",
        reviewLabel: "Controlled publication canary",
        reasons: [
          "controlled-publication-canary-active",
          "rag-ingestion-unauthorized",
        ],
      };
    }
    reasons.push("safety-withdrawal-active");
    return {
      eligibleForPublicDisplay: true, // Remains accessible at route to show neutral notice
      eligibleForIndexing: false,
      eligibleForSitemap: false,
      eligibleForAiIngestion: false,
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: false,
      publicationStatus: "withdrawn",
      clinicalReviewStatus: "under-review",
      reviewLabel: "Under Clinical Review",
      reasons,
    };
  }

  // 2. Perform governance validation checks
  const content = entity.content || {};
  const overviewText = content.overview || content.description || content.definition || "";
  const refs = content.references || [];
  const citationDbIds = new Set(CITATIONS.map((c) => c.id));
  const hasValidCitations = refs.length > 0 && refs.every((r: string) => citationDbIds.has(r));

  if (!overviewText) {
    reasons.push("missing-overview-content");
  }
  if (!hasValidCitations) {
    reasons.push("citation-requirements-unmet");
  }

  // Check contributor model for independent review (schema gap: string names without immutable IDs)
  const isSelfReviewed = (entity.author?.name && entity.reviewer?.name && entity.author.name === entity.reviewer.name) || !entity.reviewer?.id;
  if (isSelfReviewed) {
    reasons.push("independent-review-unverified");
  }

  // Check RAG ingestion allowlist
  const isRagAllowlisted = RAG_INGESTION_ALLOWLIST.has(entityId);
  if (!isRagAllowlisted) {
    reasons.push("rag-ingestion-unauthorized");
  }

  // Evaluate public index allowlist
  const isPublicIndexAllowlisted = PUBLIC_INDEX_ALLOWLIST.has(entityId);
  if (TRANSITIONAL_PUBLICATION_FREEZE && !isPublicIndexAllowlisted) {
    reasons.push("transitional-publication-freeze");
  }

  const hasCriticalContentFailures = reasons.some((r) => r === "missing-overview-content" || r === "citation-requirements-unmet" || r === "safety-withdrawal-active");

  // RAG Ingestion Eligibility: Requires RAG allowlist membership + no critical failures + proven independent review
  const eligibleForAiIngestion = isRagAllowlisted && !hasCriticalContentFailures && !isSelfReviewed;

  // Transitional Public Indexing Eligibility for flagship entities
  const eligibleForIndexing = isPublicIndexAllowlisted && !hasCriticalContentFailures && TRANSITIONAL_PUBLICATION_FREEZE;

  // Independent clinical review status: Approved only if independent review is proven
  const clinicalReviewStatus: ClinicalReviewStatus = !isSelfReviewed && !hasCriticalContentFailures ? "approved" : "pending";

  const reviewLabel = isSelfReviewed
    ? "Editorial review complete — independent clinical validation pending"
    : clinicalReviewStatus === "approved"
    ? "Reviewed"
    : "Clinical Review Pending";

  if (isPublicIndexAllowlisted && eligibleForIndexing) {
    reasons.push("temporary-editorial-index-exception");
  }

  const eligibleByClinicalGovernance = !isSelfReviewed && !hasCriticalContentFailures;
  const eligibleByTemporaryPublicIndexException = isPublicIndexAllowlisted;

  if (eligibleForIndexing) {
    return {
      eligibleForPublicDisplay: true,
      eligibleForIndexing: true,
      eligibleForSitemap: true,
      eligibleForAiIngestion,
      eligibleByClinicalGovernance,
      eligibleByTemporaryPublicIndexException,
      publicationStatus: "published",
      clinicalReviewStatus,
      reviewLabel,
      reasons,
    };
  }

  // Generic/unreviewed entity under freeze or governance gap
  return {
    eligibleForPublicDisplay: true,
    eligibleForIndexing: false,
    eligibleForSitemap: false,
    eligibleForAiIngestion: false,
    eligibleByClinicalGovernance,
    eligibleByTemporaryPublicIndexException: false,
    publicationStatus: "review-required",
    clinicalReviewStatus: "pending",
    reviewLabel: "Clinical Review Pending",
    reasons,
  };
}

export function isEntityIndexable(entity: KnowledgeEntity | any): boolean {
  return evaluatePublicationEligibility(entity).eligibleForIndexing;
}

export function isEntityEligibleForSitemap(entity: KnowledgeEntity | any): boolean {
  return evaluatePublicationEligibility(entity).eligibleForSitemap;
}

export function isEntityEligibleForRag(entity: KnowledgeEntity | any): boolean {
  return evaluatePublicationEligibility(entity).eligibleForAiIngestion;
}

export function getPublicReviewLabel(entity: KnowledgeEntity | any): string {
  return evaluatePublicationEligibility(entity).reviewLabel;
}

import {
  ExtendedPublicationEvaluation,
  AuthorshipRecord,
  ClinicalReviewRecord,
  ContentRevision,
  EvidenceProfile,
  ClinicalClaim,
  EditorialWorkflowState,
  AiIngestionApproval,
} from "./types/governanceTypes";
import { evaluateIndependentReview } from "./services/contributorRegistry";
import { computeContentHash } from "./services/contentRevisionService";
import { validateEvidenceProfile } from "./services/evidenceProfileService";
import { evaluateClaimsGovernance } from "./services/clinicalClaimService";
import { validateAiIngestionApproval } from "./services/aiIngestionGovernance";

import { EntityGovernanceState } from "./repositories/GovernanceRepository";

export type { ExtendedPublicationEvaluation };

/**
 * Phase 2 — Comprehensive Clinical Governance Evaluation Function
 * Evaluates revision hash, independent review, evidence profile, claim citations, workflow state, and AI approval.
 */
export function evaluatePublicationGovernance(params: {
  entity: KnowledgeEntity | any;
  revision?: ContentRevision;
  authors?: AuthorshipRecord[];
  review?: ClinicalReviewRecord | null;
  evidenceProfile?: EvidenceProfile | null;
  claims?: ClinicalClaim[];
  workflowState?: EditorialWorkflowState;
  aiApproval?: AiIngestionApproval | null;
  governanceState?: EntityGovernanceState | null;
}): ExtendedPublicationEvaluation {
  const {
    entity,
    revision,
    authors = [],
    review = null,
    evidenceProfile = null,
    claims = [],
    aiApproval = null,
    governanceState = null,
  } = params;

  const workflowState = params.workflowState || governanceState?.workflowState || "draft";

  const failures: string[] = [];
  const warnings: string[] = [];

  if (!entity) {
    failures.push("entity-null-or-undefined");
    return {
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: false,
      eligibleForPublicDisplay: false,
      eligibleForIndexing: false,
      eligibleForSitemap: false,
      eligibleForAiIngestion: false,
      workflowState: "draft",
      reviewLabel: "Draft",
      failures,
      warnings,
    };
  }

  const entityId = entity.id;

  // 1. Withdrawal check
  if (WITHDRAWN_SAFETY_ENTITIES.has(entityId) || entity.publicationStatus === "withdrawn" || workflowState === "withdrawn") {
    failures.push("safety-withdrawal-active");
    return {
      eligibleByClinicalGovernance: false,
      eligibleByTemporaryPublicIndexException: false,
      eligibleForPublicDisplay: true,
      eligibleForIndexing: false,
      eligibleForSitemap: false,
      eligibleForAiIngestion: false,
      workflowState: "withdrawn",
      reviewLabel: "Under Clinical Review",
      failures,
      warnings,
    };
  }

  // 2. Revision & Content Hash Validation
  const currentContentHash = computeContentHash(entity.content);
  if (revision && revision.contentHash !== currentContentHash) {
    failures.push("content-revision-hash-mismatch");
  }

  // 3. Independent Clinical Review Validation
  const reviewEval = evaluateIndependentReview(authors, review, currentContentHash);
  if (!reviewEval.isIndependentApproved) {
    failures.push(...reviewEval.reasons);
  }

  // 4. Evidence Profile Validation
  const evidenceEval = validateEvidenceProfile(evidenceProfile, revision?.revisionId || "");
  if (!evidenceEval.isApproved) {
    failures.push(...evidenceEval.reasons);
  }

  // 5. Claim-Level Citation Validation
  const citationDbIds = new Set(CITATIONS.map((c) => c.id));
  const claimsEval = evaluateClaimsGovernance(claims, citationDbIds);
  if (!claimsEval.isClaimsValid) {
    failures.push(...claimsEval.reasons);
  }

  // 6. Prohibited claim check
  const textContent = JSON.stringify(entity.content || {}).toLowerCase();
  if (textContent.includes("100% cure") || textContent.includes("guaranteed cure")) {
    failures.push("prohibited-claim-detected");
  }

  // 7. Full Clinical Governance Eligibility: Requires 0 failures + workflowState === 'published' or 'approved'
  const eligibleByClinicalGovernance = failures.length === 0 && (workflowState === "approved" || workflowState === "published");

  // 8. Temporary Phase 1 Exception
  const isPublicIndexAllowlisted = PUBLIC_INDEX_ALLOWLIST.has(entityId);
  const eligibleByTemporaryPublicIndexException = isPublicIndexAllowlisted && TRANSITIONAL_PUBLICATION_FREEZE;

  if (eligibleByTemporaryPublicIndexException) {
    warnings.push("temporary-editorial-index-exception");
  }

  // 9. AI Ingestion Governance
  const aiEval = validateAiIngestionApproval(aiApproval, currentContentHash);
  const eligibleForAiIngestion = eligibleByClinicalGovernance && RAG_INGESTION_ALLOWLIST.has(entityId) && aiEval.isEligible;

  if (!aiEval.isEligible) {
    warnings.push(...aiEval.reasons);
  }

  // Index & Sitemap eligibility
  const eligibleForIndexing = eligibleByClinicalGovernance || eligibleByTemporaryPublicIndexException;
  const eligibleForSitemap = eligibleForIndexing;

  const reviewLabel = reviewEval.isIndependentApproved
    ? "Reviewed"
    : isPublicIndexAllowlisted
    ? "Editorial review complete — independent clinical validation pending"
    : "Clinical Review Pending";

  return {
    eligibleByClinicalGovernance,
    eligibleByTemporaryPublicIndexException,
    eligibleForPublicDisplay: true,
    eligibleForIndexing,
    eligibleForSitemap,
    eligibleForAiIngestion,
    workflowState,
    reviewLabel,
    failures,
    warnings,
  };
}
