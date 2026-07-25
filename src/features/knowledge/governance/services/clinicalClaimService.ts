import { ClinicalClaim, ClaimType, EvidenceStatus } from "../types/governanceTypes";

export interface ClaimsGovernanceEvaluation {
  isClaimsValid: boolean;
  unresolvedMaterialClaims: ClinicalClaim[];
  traditionalClaims: ClinicalClaim[];
  reasons: string[];
}

/**
 * Validates claim-level citation mapping and evidence status across all claims for an entity.
 */
export function evaluateClaimsGovernance(
  claims: ClinicalClaim[],
  validCitationDbIds: Set<string>
): ClaimsGovernanceEvaluation {
  const reasons: string[] = [];
  const unresolvedMaterialClaims: ClinicalClaim[] = [];
  const traditionalClaims: ClinicalClaim[] = [];

  for (const claim of claims) {
    if (claim.claimType === "traditional-use") {
      traditionalClaims.push(claim);
      // Ensure traditional descriptions are explicitly marked with traditional-description evidence status
      if (claim.evidenceStatus === "supported") {
        reasons.push(`traditional-claim-misrepresented-as-supported:${claim.id}`);
      }
      continue;
    }

    // Material clinical claims (treatment, safety, emergency, diagnosis, risk, lab)
    const isMaterialClaim = [
      "treatment",
      "safety",
      "emergency",
      "diagnosis",
      "risk",
      "laboratory-interpretation",
    ].includes(claim.claimType);

    if (isMaterialClaim) {
      const hasCitations = claim.citationIds && claim.citationIds.length > 0;
      const allCitationsResolve = hasCitations && claim.citationIds.every((id) => validCitationDbIds.has(id));
      const hasSupportedStatus = claim.evidenceStatus === "supported" || claim.evidenceStatus === "partially-supported";

      if (!hasCitations || !allCitationsResolve || !hasSupportedStatus) {
        unresolvedMaterialClaims.push(claim);
        reasons.push(`material-claim-unresolved:${claim.id}:${claim.claimType}`);
      }
    }
  }

  const isClaimsValid = unresolvedMaterialClaims.length === 0 && !reasons.some((r) => r.startsWith("traditional-claim"));

  return {
    isClaimsValid,
    unresolvedMaterialClaims,
    traditionalClaims,
    reasons,
  };
}
