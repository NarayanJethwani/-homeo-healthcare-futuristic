import { ContributorId } from "../types/governanceTypes";

export type ReviewScope =
  | "general-clinical"
  | "disease-content"
  | "symptom-content"
  | "laboratory-interpretation"
  | "medication-safety"
  | "homeopathic-materia-medica"
  | "evidence-methodology"
  | "translation";

export interface ReviewerQualificationDecision {
  id: string;
  contributorId: ContributorId;
  reviewScopes: ReviewScope[];
  status: "pending" | "verified" | "rejected" | "suspended" | "expired";
  verifiedBy: ContributorId;
  verifiedAt?: string;
  expiresAt?: string;
  verificationNotes?: string;
}

/**
 * Persistent Reviewer Qualification Decisions Store
 */
const QUALIFICATION_DECISIONS_DB: Map<string, ReviewerQualificationDecision> = new Map();

export function recordQualificationDecision(
  decision: ReviewerQualificationDecision
): ReviewerQualificationDecision {
  QUALIFICATION_DECISIONS_DB.set(decision.id, decision);
  return decision;
}

export function getQualificationDecisionsForContributor(
  contributorId: ContributorId
): ReviewerQualificationDecision[] {
  return Array.from(QUALIFICATION_DECISIONS_DB.values()).filter(
    (d) => d.contributorId === contributorId
  );
}

/**
 * Verifies if a reviewer has a valid, verified, and unexpired qualification decision
 * covering the required review scope. Free-text credential strings alone CANNOT confer eligibility.
 */
export function verifyReviewerQualificationScope(
  contributorId: ContributorId,
  requiredScope: ReviewScope
): { isQualified: boolean; reason?: string } {
  const decisions = getQualificationDecisionsForContributor(contributorId);

  if (decisions.length === 0) {
    return { isQualified: false, reason: "no-verified-qualification-decision-record" };
  }

  const validDecision = decisions.find((d) => {
    if (d.status !== "verified") return false;
    if (!d.reviewScopes.includes(requiredScope) && !d.reviewScopes.includes("general-clinical")) return false;
    if (d.expiresAt && new Date(d.expiresAt) <= new Date()) return false;
    return true;
  });

  if (!validDecision) {
    return { isQualified: false, reason: `unverified-or-expired-scope:${requiredScope}` };
  }

  return { isQualified: true };
}
