import { AiIngestionApproval } from "../types/governanceTypes";

export interface AiIngestionValidationResult {
  isEligible: boolean;
  reasons: string[];
}

/**
 * Validates whether an entity has explicit, valid AI-ingestion approval for the current content revision hash.
 */
export function validateAiIngestionApproval(
  approval: AiIngestionApproval | null | undefined,
  currentRevisionHash: string
): AiIngestionValidationResult {
  const reasons: string[] = [];

  if (!approval) {
    reasons.push("no-ai-ingestion-approval-record");
    return { isEligible: false, reasons };
  }

  if (!approval.approvedBy) {
    reasons.push("missing-ai-approval-actor");
  }

  if (approval.revisionId !== currentRevisionHash) {
    reasons.push("ai-approval-revision-mismatch");
  }

  if (!approval.citationCheckPassed) {
    reasons.push("ai-approval-citation-check-failed");
  }

  if (!approval.prohibitedClaimCheckPassed) {
    reasons.push("ai-approval-prohibited-claim-check-failed");
  }

  if (approval.expiresAt) {
    const isExpired = new Date(approval.expiresAt) <= new Date();
    if (isExpired) {
      reasons.push("ai-approval-expired");
    }
  }

  const isEligible = reasons.length === 0;
  return { isEligible, reasons };
}
