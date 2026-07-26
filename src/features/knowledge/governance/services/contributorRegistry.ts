import { Contributor, ContributorId, AuthorshipRecord, ClinicalReviewRecord } from "../types/governanceTypes";

/**
 * Process-local / memory Contributor Identity Registry (Domain Model Foundation)
 */
const CONTRIBUTORS_DB: Map<ContributorId, Contributor> = new Map([
  [
    "CONTRIB-001",
    {
      id: "CONTRIB-001",
      displayName: "Dr. Narayan Jethwani",
      professionalRole: "Senior Clinical Homeopath & Medical Editor",
      qualifications: ["BHMS", "MD (Hom)"],
      organisation: "Homeo Healthcare Platform",
      active: true,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-07-25T00:00:00.000Z",
    },
  ],
]);

export interface PublicContributorDTO {
  id: ContributorId;
  displayName: string;
  professionalRole?: string;
  qualifications?: string[];
  organisation?: string;
  active: boolean;
}

export function serializePublicContributor(contributor: Contributor): PublicContributorDTO {
  return {
    id: contributor.id,
    displayName: contributor.displayName,
    professionalRole: contributor.professionalRole,
    qualifications: contributor.qualifications ? [...contributor.qualifications] : undefined,
    organisation: contributor.organisation,
    active: contributor.active,
  };
}

export function getContributorById(id: ContributorId): Contributor | undefined {
  return CONTRIBUTORS_DB.get(id);
}

export function registerContributor(contributor: Contributor): Contributor {
  CONTRIBUTORS_DB.set(contributor.id, contributor);
  return contributor;
}

export function getAllContributors(): Contributor[] {
  return Array.from(CONTRIBUTORS_DB.values());
}

/**
 * Reviewer Qualification Decision Model
 * Checks if a contributor is active and qualified for a specific review type based on role/qualifications.
 */
export function isReviewerEligible(
  contributor: Contributor | undefined,
  reviewType: "clinical" | "evidence" | "safety"
): boolean {
  if (!contributor || !contributor.active) return false;

  // Basic qualification role check
  if (reviewType === "clinical" || reviewType === "safety") {
    return (
      contributor.qualifications?.some(
        (q) => q.includes("BHMS") || q.includes("MD") || q.includes("MBBS")
      ) ?? false
    );
  }

  if (reviewType === "evidence") {
    return (
      contributor.qualifications?.some(
        (q) => q.includes("BHMS") || q.includes("MD") || q.includes("PhD") || q.includes("MSc")
      ) ?? false
    );
  }

  return false;
}

export interface IndependentReviewEvaluation {
  isIndependentApproved: boolean;
  reasons: string[];
}

/**
 * Validates whether a clinical review meets strict independent clinical review requirements:
 * 1. Immutable reviewer ID present
 * 2. Reviewer ID differs from ALL author/editor IDs
 * 3. Explicit declaration of independence is true
 * 4. Active contributor status in registry
 * 5. Reviewer eligible for the review type
 * 6. Review decision is "approved"
 * 7. Review matches current content revision hash
 * 8. Valid review timestamp present
 */
export function evaluateIndependentReview(
  authors: AuthorshipRecord[],
  review: ClinicalReviewRecord | null | undefined,
  currentRevisionHash: string
): IndependentReviewEvaluation {
  const reasons: string[] = [];

  if (!review) {
    reasons.push("no-clinical-review-record");
    return { isIndependentApproved: false, reasons };
  }

  if (!review.reviewerId) {
    reasons.push("missing-reviewer-id");
  } else {
    const reviewer = getContributorById(review.reviewerId);
    if (!reviewer) {
      reasons.push("reviewer-not-in-registry");
    } else if (!reviewer.active) {
      reasons.push("reviewer-account-inactive");
    } else if (!isReviewerEligible(reviewer, review.reviewType || "clinical")) {
      reasons.push("reviewer-unqualified-for-review-type");
    }
  }

  // Check identity overlap between reviewer and any author
  const authorIds = new Set(authors.map((a) => a.contributorId));
  if (review.reviewerId && authorIds.has(review.reviewerId)) {
    reasons.push("reviewer-is-author-conflict");
  }

  if (!review.declarationOfIndependence) {
    reasons.push("declaration-of-independence-missing");
  }

  if (review.reviewedVersion !== currentRevisionHash) {
    reasons.push("review-version-mismatch");
  }

  if (review.decision !== "approved") {
    reasons.push(`review-decision-not-approved:${review.decision}`);
  }

  if (!review.reviewedAt || isNaN(Date.parse(review.reviewedAt))) {
    reasons.push("invalid-review-timestamp");
  }

  const isIndependentApproved = reasons.length === 0;
  return { isIndependentApproved, reasons };
}
