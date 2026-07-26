import type {
  FlagshipPilotManifest,
  KnowledgeExpansionInventory,
} from "./types";
import { FLAGSHIP_ENTITY_IDS } from "./inventoryService";

export function buildFlagshipPilotManifest(
  inventory: KnowledgeExpansionInventory
): FlagshipPilotManifest {
  const recordsById = new Map(
    inventory.records.map((record) => [record.entityId, record])
  );

  const entities = FLAGSHIP_ENTITY_IDS.map((entityId) => {
    const record = recordsById.get(entityId);
    if (!record) {
      throw new Error(`Missing flagship entity in inventory: ${entityId}`);
    }
    if (record.safety.withdrawn) {
      throw new Error(
        `Withdrawn entity cannot enter flagship pilot: ${entityId}`
      );
    }
    if (record.eligibility.eligibleForRag) {
      throw new Error(
        `Flagship pilot must not contain active RAG entity: ${entityId}`
      );
    }

    return {
      entityId: record.entityId,
      title: record.title,
      entityType: record.entityType,
      workPackage: {
        topicSpecificRewrite: true,
        redFlagsOrSafetyBoundary: true,
        conventionalCareContext: true,
        draftEvidenceProfile: true,
        claimLevelCitations: true,
        independentReview: true,
        governedGraphRelationshipsTarget: 5,
        offlineEvaluationQuestionsTarget: 20,
      },
      stateBoundaries: {
        publicIndexState: "preserve-existing-exception" as const,
        evidenceApprovalState: "draft-only" as const,
        clinicalApprovalState: "unchanged" as const,
        ragState: "inactive" as const,
      },
    };
  });

  return {
    schemaVersion: "1.0.0",
    pilotId: "KEP-1",
    asOfDate: inventory.asOfDate,
    status: "planned",
    entities,
    targets: {
      entityCount: 8,
      minimumGovernedRelationships: 40,
      maximumGovernedRelationships: 80,
      minimumOfflineEvaluationQuestions: 160,
    },
    invariants: {
      publicationFreezeRemainsActive: true,
      automaticPublicationForbidden: true,
      automaticClinicalApprovalForbidden: true,
      automaticEvidenceApprovalForbidden: true,
      automaticGraphAcceptanceForbidden: true,
      productionRagEntities: 0,
      withdrawnEntitiesRemainExcluded: true,
    },
  };
}
