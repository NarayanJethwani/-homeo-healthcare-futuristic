import {
  TRANSITIONAL_PUBLICATION_FREEZE,
  PUBLIC_INDEX_ALLOWLIST,
  RAG_INGESTION_ALLOWLIST,
  WITHDRAWN_SAFETY_ENTITIES,
} from "./publicationGuard";
import { CITATIONS } from "../content/citations";
import type { CitationRecord, KnowledgeEntity } from "../types";
import type {
  GovernedRelationshipRecord,
  RelationshipEligibilityEvaluation,
} from "./relationshipGovernanceTypes";

export interface RelationshipEvaluationContext {
  citationsMap?: Map<string, CitationRecord>;
  entitiesMap?: Map<string, KnowledgeEntity>;
  currentIsoTime?: string;
  enforceFreeze?: boolean;
}

/**
 * Authoritative fail-closed evaluation function defining the Knowledge Activation Contract.
 * Ensures that a relationship can never participate in publication or RAG retrieval
 * merely because it exists or because its endpoints exist.
 *
 * Core invariant: governed != publicationEligible != ragEligible
 */
export function evaluateRelationshipEligibility(
  relationship: GovernedRelationshipRecord | null | undefined,
  context: RelationshipEvaluationContext = {}
): RelationshipEligibilityEvaluation {
  const nowStr = context.currentIsoTime || new Date().toISOString();
  const citationsMap = context.citationsMap || new Map(CITATIONS.map((c) => [c.id, c]));
  const freezeActive = context.enforceFreeze !== undefined ? context.enforceFreeze : TRANSITIONAL_PUBLICATION_FREEZE;

  if (!relationship) {
    return {
      relationshipId: "UNKNOWN",
      isGoverned: false,
      isPublicationEligible: false,
      isRagEligible: false,
      isBlockedByFreeze: true,
      isBlockedByWithdrawal: false,
      isBlockedBySupersession: false,
      isBlockedBySafetyGate: true,
      isBlockedByUnverifiedCitation: true,
      reasons: ["relationship-null-or-undefined"],
      evaluatedAt: nowStr,
    };
  }

  const reasons: string[] = [];
  let isBlockedByWithdrawal = false;
  let isBlockedBySupersession = false;
  let isBlockedBySafetyGate = false;
  let isBlockedByUnverifiedCitation = false;
  let isBlockedByFreeze = false;

  // 1. Lifecycle Governance Status Gate
  const isGoverned = relationship.status === "governed";
  if (!isGoverned) {
    reasons.push(`relationship-not-governed: status is '${relationship.status}' (must be 'governed')`);
  }

  // 2. Direct Withdrawal Check
  if (relationship.isWithdrawn) {
    isBlockedByWithdrawal = true;
    reasons.push(`relationship-withdrawn: ${relationship.withdrawnReason || "no reason specified"}`);
  }

  // 3. Supersession Check
  if (relationship.supersededBy) {
    isBlockedBySupersession = true;
    reasons.push(`relationship-superseded: superseded by '${relationship.supersededBy}'`);
  }

  // 4. Source & Target Entity Withdrawal Checks (Dynamic fail-closed protection)
  const sourceId = relationship.sourceEntityId;
  const targetId = relationship.targetEntityId;

  if (WITHDRAWN_SAFETY_ENTITIES.has(sourceId)) {
    isBlockedByWithdrawal = true;
    reasons.push(`source-entity-withdrawn: source entity '${sourceId}' is in safety withdrawal list`);
  }
  if (WITHDRAWN_SAFETY_ENTITIES.has(targetId)) {
    isBlockedByWithdrawal = true;
    reasons.push(`target-entity-withdrawn: target entity '${targetId}' is in safety withdrawal list`);
  }

  if (context.entitiesMap) {
    const sourceEntity = context.entitiesMap.get(sourceId);
    if (sourceEntity && (sourceEntity.editorialStatus === "archived" || sourceEntity.editorialStatus === ("withdrawn" as any))) {
      isBlockedByWithdrawal = true;
      reasons.push(`source-entity-status-inactive: source entity '${sourceId}' has status '${sourceEntity.editorialStatus}'`);
    }
    const targetEntity = context.entitiesMap.get(targetId);
    if (targetEntity && (targetEntity.editorialStatus === "archived" || targetEntity.editorialStatus === ("withdrawn" as any))) {
      isBlockedByWithdrawal = true;
      reasons.push(`target-entity-status-inactive: target entity '${targetId}' has status '${targetEntity.editorialStatus}'`);
    }
  }

  // 5. Adjudication & Safety Gates
  if (!relationship.adjudication || !relationship.adjudication.safetyChecksPassed) {
    isBlockedBySafetyGate = true;
    reasons.push("adjudication-safety-check-unpassed");
  }
  if (!relationship.adjudication || !relationship.adjudication.conventionalBoundaryPreserved) {
    isBlockedBySafetyGate = true;
    reasons.push("adjudication-conventional-boundary-unpreserved");
  }
  if (!relationship.adjudication || relationship.adjudication.decision !== "approved") {
    isBlockedBySafetyGate = true;
    reasons.push(`adjudication-decision-not-approved: decision is '${relationship.adjudication?.decision}'`);
  }

  // 6. Citation Fidelity Gates
  if (!relationship.evidenceCitationIds || relationship.evidenceCitationIds.length === 0) {
    isBlockedByUnverifiedCitation = true;
    reasons.push("citation-missing");
  } else {
    for (const citId of relationship.evidenceCitationIds) {
      const citation = citationsMap.get(citId);
      if (!citation) {
        isBlockedByUnverifiedCitation = true;
        reasons.push(`citation-unresolved: '${citId}'`);
      } else if (citation.verificationStatus === "disputed") {
        isBlockedByUnverifiedCitation = true;
        reasons.push(`citation-disputed: '${citId}'`);
      } else if (citation.verificationStatus !== "verified") {
        isBlockedByUnverifiedCitation = true;
        reasons.push(`citation-unverified: '${citId}' (status: ${citation.verificationStatus || "unknown"})`);
      }
    }
  }

  // Baseline clinical eligibility for the edge
  const clinicallyEligible =
    isGoverned &&
    !isBlockedByWithdrawal &&
    !isBlockedBySupersession &&
    !isBlockedBySafetyGate &&
    !isBlockedByUnverifiedCitation;

  // 7. Publication Eligibility Evaluation
  let isPublicationEligible = false;
  if (clinicallyEligible) {
    if (freezeActive) {
      // During transitional freeze, only allowlisted entities may publish edges
      if (PUBLIC_INDEX_ALLOWLIST.has(sourceId)) {
        isPublicationEligible = true;
      } else {
        isBlockedByFreeze = true;
        reasons.push(`publication-blocked-by-transitional-freeze: source entity '${sourceId}' is not on public index allowlist`);
      }
    } else {
      isPublicationEligible = true;
    }
  }

  // 8. RAG Ingestion / Retrieval Eligibility Evaluation (Strictly decoupled from publication!)
  let isRagEligible = false;
  if (clinicallyEligible) {
    if (freezeActive) {
      // RAG_INGESTION_ALLOWLIST is empty during M29; requires independent review and M30 activation gates
      if (RAG_INGESTION_ALLOWLIST.has(sourceId)) {
        isRagEligible = true;
      } else {
        isBlockedByFreeze = true;
        reasons.push(`rag-blocked-by-transitional-freeze: source entity '${sourceId}' is not on RAG allowlist`);
      }
    } else {
      // Even without freeze, RAG requires explicit allowlisting
      if (RAG_INGESTION_ALLOWLIST.has(sourceId)) {
        isRagEligible = true;
      } else {
        reasons.push(`rag-requires-explicit-allowlist: source entity '${sourceId}' not allowlisted`);
      }
    }
  }

  return {
    relationshipId: relationship.relationshipId,
    isGoverned,
    isPublicationEligible,
    isRagEligible,
    isBlockedByFreeze,
    isBlockedByWithdrawal,
    isBlockedBySupersession,
    isBlockedBySafetyGate,
    isBlockedByUnverifiedCitation,
    reasons,
    evaluatedAt: nowStr,
  };
}
