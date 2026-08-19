import { CITATIONS } from "../content/citations";
import { evaluateRelationshipEligibility } from "./relationshipActivationContract";
import type { CitationRecord, KnowledgeEntity, EntityType } from "../types";
import type {
  GovernedRelationshipRecord,
  GraphIntegrityStatistics,
  RelationshipLifecycleStatus,
} from "./relationshipGovernanceTypes";

export interface GraphValidationError {
  relationshipId: string;
  code: string;
  message: string;
  severity: "error" | "warning";
}

export interface GraphIntegrityReport {
  isValid: boolean;
  errors: GraphValidationError[];
  warnings: GraphValidationError[];
  statistics: GraphIntegrityStatistics;
  evaluatedAt: string;
}

export function validateGraphIntegrity(
  relationships: GovernedRelationshipRecord[],
  entities: KnowledgeEntity[] = [],
  citations: CitationRecord[] = CITATIONS
): GraphIntegrityReport {
  const errors: GraphValidationError[] = [];
  const warnings: GraphValidationError[] = [];
  const entitiesMap = new Map(entities.map((e) => [e.id, e]));
  const citationsMap = new Map(citations.map((c) => [c.id, c]));
  const nowStr = new Date().toISOString();

  const edgeFingerprints = new Set<string>();

  for (const rel of relationships) {
    // 1. Structure Check
    if (!rel.relationshipId || !rel.relationshipId.trim()) {
      errors.push({
        relationshipId: "UNKNOWN",
        code: "MISSING_RELATIONSHIP_ID",
        message: "Relationship record is missing relationshipId",
        severity: "error",
      });
      continue;
    }

    // 2. Duplicate Detection
    const fp = `${rel.sourceEntityId}::${rel.relationshipType}::${rel.targetEntityId}`;
    if (edgeFingerprints.has(fp) && !rel.isWithdrawn && !rel.supersededBy) {
      errors.push({
        relationshipId: rel.relationshipId,
        code: "DUPLICATE_EDGE",
        message: `Duplicate active edge detected for (${fp})`,
        severity: "error",
      });
    } else {
      edgeFingerprints.add(fp);
    }

    // 3. Source Node Existence Check
    if (entities.length > 0 && !entitiesMap.has(rel.sourceEntityId)) {
      errors.push({
        relationshipId: rel.relationshipId,
        code: "ORPHAN_SOURCE",
        message: `Source entity '${rel.sourceEntityId}' not found in registered entities`,
        severity: "error",
      });
    }

    // 4. Target Node Existence Check
    if (entities.length > 0) {
      const isConcept = rel.targetEntityId.startsWith("CONCEPT-");
      if (!isConcept && !entitiesMap.has(rel.targetEntityId)) {
        errors.push({
          relationshipId: rel.relationshipId,
          code: "ORPHAN_TARGET",
          message: `Target entity '${rel.targetEntityId}' not found in registered entities`,
          severity: "error",
        });
      }
    }

    // 5. Citation Resolution Check
    if (!rel.evidenceCitationIds || rel.evidenceCitationIds.length === 0) {
      errors.push({
        relationshipId: rel.relationshipId,
        code: "NO_CITATIONS",
        message: `Relationship has no supporting citations`,
        severity: "error",
      });
    } else {
      for (const citId of rel.evidenceCitationIds) {
        const citation = citationsMap.get(citId);
        if (!citation) {
          errors.push({
            relationshipId: rel.relationshipId,
            code: "UNRESOLVED_CITATION",
            message: `Supporting citation '${citId}' cannot be resolved in citation database`,
            severity: "error",
          });
        } else if (citation.verificationStatus === "disputed") {
          errors.push({
            relationshipId: rel.relationshipId,
            code: "DISPUTED_CITATION",
            message: `Supporting citation '${citId}' is marked as 'disputed'`,
            severity: "error",
          });
        }
      }
    }

    // 6. Lifecycle Consistency
    if (rel.status === "governed" && !rel.adjudication) {
      errors.push({
        relationshipId: rel.relationshipId,
        code: "MISSING_ADJUDICATION",
        message: `Relationship is marked as 'governed' but lacks an adjudication record`,
        severity: "error",
      });
    }
  }

  const statistics = computeGraphIntegrityStatistics(relationships, entities, {
    errorsCount: errors.length,
    warningsCount: warnings.length,
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    statistics,
    evaluatedAt: nowStr,
  };
}

export function computeGraphIntegrityStatistics(
  relationships: GovernedRelationshipRecord[],
  entities: KnowledgeEntity[] = [],
  options: { errorsCount?: number; warningsCount?: number } = {}
): GraphIntegrityStatistics {
  const byStatus: Record<RelationshipLifecycleStatus, number> = {
    draft: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    governed: 0,
    withdrawn: 0,
    superseded: 0,
  };
  const byRelationshipType: Record<string, number> = {};
  const bySourceEntityType: Record<string, number> = {};
  const byTargetEntityType: Record<string, number> = {};

  const uniqueSources = new Set<string>();
  const uniqueTargets = new Set<string>();
  const connectedEntityIds = new Set<string>();

  let publicationEligibleCount = 0;
  let ragEligibleCount = 0;

  for (const rel of relationships) {
    byStatus[rel.status] = (byStatus[rel.status] || 0) + 1;
    byRelationshipType[rel.relationshipType] = (byRelationshipType[rel.relationshipType] || 0) + 1;

    uniqueSources.add(rel.sourceEntityId);
    uniqueTargets.add(rel.targetEntityId);

    if (rel.status === "governed" && !rel.isWithdrawn && !rel.supersededBy) {
      connectedEntityIds.add(rel.sourceEntityId);
      if (!rel.targetEntityId.startsWith("CONCEPT-")) {
        connectedEntityIds.add(rel.targetEntityId);
      }
    }

    const sourceEntityType = rel.sourceEntityType || (entities.find((e) => e.id === rel.sourceEntityId)?.entityType || "unknown");
    bySourceEntityType[sourceEntityType] = (bySourceEntityType[sourceEntityType] || 0) + 1;

    const targetEntityType = rel.targetEntityType || (rel.targetEntityId.startsWith("CONCEPT-") ? "concept" : (entities.find((e) => e.id === rel.targetEntityId)?.entityType || "unknown"));
    byTargetEntityType[targetEntityType] = (byTargetEntityType[targetEntityType] || 0) + 1;

    // Derived eligibility
    const eligibility = evaluateRelationshipEligibility(rel);
    if (eligibility.isPublicationEligible) publicationEligibleCount += 1;
    if (eligibility.isRagEligible) ragEligibleCount += 1;
  }

  const totalEntities = entities.length;
  const isolatedEntitiesCount = Math.max(0, totalEntities - connectedEntityIds.size);

  return {
    totalRelationships: relationships.length,
    byStatus,
    byRelationshipType,
    bySourceEntityType,
    byTargetEntityType,
    totalUniqueSourceEntities: uniqueSources.size,
    totalUniqueTargetEntities: uniqueTargets.size,
    connectedEntitiesCount: connectedEntityIds.size,
    isolatedEntitiesCount,
    publicationEligibleCount,
    ragEligibleCount,
    validationErrorsCount: options.errorsCount || 0,
    validationWarningsCount: options.warningsCount || 0,
  };
}
