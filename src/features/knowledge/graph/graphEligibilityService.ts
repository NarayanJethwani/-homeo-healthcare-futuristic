import { ClinicalGraphNode, ClinicalGraphEdge } from "./clinicalGraphTypes";
import { evaluateEvidenceRetrievalPolicy, calculateEvidenceReviewState, EVIDENCE_REVIEW_POLICY_V1 } from "../retrieval/evidenceScoringService";

/**
 * Centrally determines if a graph node is eligible for retrieval.
 */
export function isGraphNodeEligibleForRetrieval(node: ClinicalGraphNode): boolean {
  if (!node) return false;

  // 1. Must carry active "published" status
  if (node.editorialStatus !== "published") {
    return false;
  }

  // 2. Legacy verification checks
  if (node.legacyVerificationStatus) {
    if (
      node.legacyVerificationStatus === "legacy-published-unverified" || 
      node.legacyVerificationStatus === "review-required" ||
      node.legacyVerificationStatus === "excluded" ||
      node.legacyVerificationStatus === "archived"
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Centrally determines if a graph edge is eligible for query traversal.
 */
export function isGraphEdgeEligibleForTraversal(
  edge: ClinicalGraphEdge,
  sourceNode: ClinicalGraphNode,
  targetNode: ClinicalGraphNode,
  context: string = "public-search"
): boolean {
  if (!edge || !sourceNode || !targetNode) return false;

  // 1. Edge lifecycle status must be published or disputed (disputed is allowed for non-AI contexts)
  if (edge.status !== "published" && edge.status !== "disputed") {
    return false;
  }

  // 2. Both nodes must be eligible
  if (!isGraphNodeEligibleForRetrieval(sourceNode) || !isGraphNodeEligibleForRetrieval(targetNode)) {
    return false;
  }

  // 3. AI clinical context has strict rules for disputed edges
  if (context === "ai-clinical-context" && edge.status === "disputed") {
    return false;
  }

  // 4. Temporal Validity checks
  const nowStr = new Date().toISOString();
  if (edge.validFrom && edge.validFrom > nowStr) {
    return false;
  }
  if (edge.validUntil && edge.validUntil < nowStr) {
    return false;
  }

  // 5. Exclude superseded edges
  if (edge.supersededByEdge) {
    return false;
  }

  // 6. Evidence Expiry Policies integration
  const profile = edge.aiMetadata?.evidenceStrength ? {
    evidenceStrength: edge.aiMetadata.evidenceStrength,
    sourceQuality: edge.sourceQuality,
    reviewExpiryPolicy: edge.validFrom ? "ranking-penalty" as any : "flag-only" as any
  } : null;

  if (profile && edge.validUntil) {
    const reviewState = calculateEvidenceReviewState({
      nextReviewDueAt: edge.validUntil,
      referenceDate: nowStr,
      dueSoonWindowDays: EVIDENCE_REVIEW_POLICY_V1.dueSoonWindowDays,
      gracePeriodDays: EVIDENCE_REVIEW_POLICY_V1.defaultGracePeriodDays
    });

    const evaluation = evaluateEvidenceRetrievalPolicy({
      policy: profile.reviewExpiryPolicy || "ranking-penalty",
      reviewState,
      context: context as any,
      exclusionThreshold: "expired"
    });

    if (!evaluation.eligible) {
      return false;
    }
  }

  return true;
}
