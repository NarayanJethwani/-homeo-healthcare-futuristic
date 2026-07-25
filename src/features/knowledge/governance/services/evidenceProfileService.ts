import { EvidenceProfile, EvidenceLevel } from "../types/governanceTypes";

/**
 * Creates a draft EvidenceProfile shell for migration / unreviewed entities.
 * Clearly marks fields as draft / review-required.
 */
export function createDraftEvidenceProfileShell(
  entityId: string,
  revisionId: string,
  evidenceLevel: EvidenceLevel = "Level-C"
): EvidenceProfile {
  return {
    id: `EVP-${entityId}`,
    entityId,
    revisionId,
    evidenceLevel,
    sourceIds: [],
    evidenceSummary: "Draft evidence summary — independent evidence profile review pending",
    limitations: ["Evidence profile not yet independently reviewed"],
    reviewedBy: [],
    status: "draft",
  };
}

export interface EvidenceProfileEvaluation {
  isApproved: boolean;
  reasons: string[];
}

/**
 * Validates whether a structured EvidenceProfile satisfies clinical publication governance.
 */
export function validateEvidenceProfile(
  profile: EvidenceProfile | null | undefined,
  currentRevisionId: string
): EvidenceProfileEvaluation {
  const reasons: string[] = [];

  if (!profile) {
    reasons.push("no-evidence-profile-record");
    return { isApproved: false, reasons };
  }

  if (profile.status !== "approved") {
    reasons.push(`evidence-profile-status-not-approved:${profile.status}`);
  }

  if (!profile.evidenceSummary || profile.evidenceSummary.startsWith("Draft")) {
    reasons.push("evidence-summary-incomplete");
  }

  if (!profile.reviewedBy || profile.reviewedBy.length === 0) {
    reasons.push("evidence-profile-unreviewed");
  }

  if (profile.revisionId !== currentRevisionId) {
    reasons.push("evidence-profile-revision-mismatch");
  }

  const isApproved = reasons.length === 0;
  return { isApproved, reasons };
}
