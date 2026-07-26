import { CITATIONS } from "../content/citations";
import { CASE_STUDIES } from "../content/case-studies";
import { DISEASES } from "../content/diseases";
import { FAQS } from "../content/faqs";
import { LAB_TESTS } from "../content/lab-tests";
import { REMEDIES } from "../content/remedies";
import { RESEARCH } from "../content/research";
import { SYMPTOMS } from "../content/symptoms";
import { KNOWLEDGE_RELATIONSHIPS } from "../graph/entityRelationships";
import {
  PUBLIC_INDEX_ALLOWLIST,
  RAG_INGESTION_ALLOWLIST,
  WITHDRAWN_SAFETY_ENTITIES,
  evaluatePublicationEligibility,
} from "../governance/publicationGuard";
import type { KnowledgeEntity, KnowledgeRelationship } from "../types";
import type {
  ExpansionRecommendation,
  ExpansionRiskTier,
  KnowledgeExpansionInventory,
  KnowledgeExpansionInventoryRecord,
} from "./types";

const GENERIC_TEMPLATE_SIGNALS = [
  "traditionally considered in constitutional clinical practice for profiles displaying",
  "marked physical generalities and thermal characteristics",
  "defined clinically as a pathological or functional alteration",
  "a comprehensive clinical overview of",
  "clinical purpose, normal range, and interpretation of",
  "a blood panel parameter or cell count analysis designed to evaluate",
] as const;

const REQUIRED_CONTENT_SECTIONS: Partial<Record<KnowledgeEntity["entityType"], string[]>> = {
  disease: [
    "overview",
    "definition",
    "causes",
    "riskFactors",
    "symptoms",
    "diagnosis",
    "differentialDiagnosis",
    "redFlags",
    "conventionalManagement",
    "homeopathicApproach",
  ],
  symptom: [
    "definition",
    "clinicalMeaning",
    "commonCauses",
    "differentialDiagnosis",
    "redFlags",
  ],
  remedy: [
    "description",
    "keynotes",
    "mentalSymptoms",
    "physicalSymptoms",
    "modalitiesBetter",
    "modalitiesWorse",
    "safetyNotes",
  ],
  "lab-test": [
    "overview",
    "normalRange",
    "highValues",
    "lowValues",
    "clinicalInterpretation",
  ],
};

export const FLAGSHIP_ENTITY_IDS = [
  "D0001",
  "D0002",
  "S0001",
  "S0002",
  "R0001",
  "R0002",
  "L0001",
  "L0002",
] as const;

function getAllEntities(): KnowledgeEntity[] {
  return [
    ...DISEASES,
    ...SYMPTOMS,
    ...REMEDIES,
    ...LAB_TESTS,
    ...FAQS,
    ...RESEARCH,
    ...CASE_STUDIES,
  ];
}

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
}

function getOverview(entity: KnowledgeEntity): string {
  const content = entity.content || {};
  return content.overview || content.description || content.definition || "";
}

function getTemplateSignals(entity: KnowledgeEntity): string[] {
  const searchable = JSON.stringify({
    summary: entity.summary,
    content: entity.content,
  }).toLowerCase();

  return GENERIC_TEMPLATE_SIGNALS.filter((signal) =>
    searchable.includes(signal)
  );
}

function isLegacyBulkGenerationCohort(entity: KnowledgeEntity): boolean {
  const numericId = Number.parseInt(entity.id.slice(1), 10);
  if (!Number.isFinite(numericId)) return false;

  if (entity.entityType === "disease") return numericId >= 5;
  if (entity.entityType === "remedy") return numericId >= 4;
  if (entity.entityType === "lab-test") return numericId >= 3;
  return false;
}

function getStructuredSectionCompleteness(entity: KnowledgeEntity): number {
  const required = REQUIRED_CONTENT_SECTIONS[entity.entityType] || [
    "overview",
    "description",
    "definition",
  ];
  const content = entity.content || {};
  const populated = required.filter((key) => hasValue(content[key])).length;
  return Math.round((populated / required.length) * 100);
}

function getRelationshipFacts(
  entityId: string,
  validEntityIds: Set<string>,
  relationships: KnowledgeRelationship[]
): KnowledgeExpansionInventoryRecord["graph"] {
  const matchingRows = relationships.filter(
    (relationship) =>
      relationship.source === entityId || relationship.target === entityId
  );
  const validRows = matchingRows.filter(
    (relationship) =>
      validEntityIds.has(relationship.source) &&
      validEntityIds.has(relationship.target)
  );
  const uniqueKeys = new Set(
    validRows.map(
      (relationship) =>
        `${relationship.source}|${relationship.relation}|${relationship.target}`
    )
  );
  const uniqueNeighbours = new Set(
    validRows.map((relationship) =>
      relationship.source === entityId
        ? relationship.target
        : relationship.source
    )
  );

  return {
    uniqueConnectionCount: uniqueNeighbours.size,
    duplicateRelationshipRows: validRows.length - uniqueKeys.size,
    brokenRelationshipRows: matchingRows.length - validRows.length,
    isolated: uniqueNeighbours.size === 0,
  };
}

function determineRecommendation(input: {
  withdrawn: boolean;
  flagship: boolean;
  genericTemplateDetected: boolean;
}): ExpansionRecommendation {
  if (input.withdrawn) return "withdrawn-safety-remediation";
  if (input.flagship) return "flagship-pilot";
  if (input.genericTemplateDetected) return "topic-specific-rewrite";
  return "independent-review-and-enrichment";
}

function determinePriority(input: {
  withdrawn: boolean;
  flagship: boolean;
  genericTemplateDetected: boolean;
  independentlyReviewed: boolean;
  isolated: boolean;
  entityType: KnowledgeEntity["entityType"];
}): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (input.withdrawn) {
    score += 100;
    reasons.push("active-safety-withdrawal");
  }
  if (input.flagship) {
    score += 70;
    reasons.push("flagship-pilot-cohort");
  }
  if (input.genericTemplateDetected) {
    score += 20;
    reasons.push("generic-template-detected");
  }
  if (!input.independentlyReviewed) {
    score += 10;
    reasons.push("independent-review-unproven");
  }
  if (input.isolated) {
    score += 10;
    reasons.push("graph-isolated");
  }
  if (["disease", "symptom", "lab-test"].includes(input.entityType)) {
    score += 10;
    reasons.push("clinical-interpretation-content");
  }

  return { score, reasons };
}

function determineSafetyRiskTier(
  entity: KnowledgeEntity,
  withdrawn: boolean
): ExpansionRiskTier {
  if (withdrawn) return "critical";
  if (["disease", "symptom", "lab-test"].includes(entity.entityType)) {
    return "high";
  }
  if (entity.entityType === "remedy" || entity.entityType === "faq") {
    return "medium";
  }
  return "low";
}

function countDuplicateRelationshipRows(
  relationships: KnowledgeRelationship[]
): number {
  const keys = relationships.map(
    (relationship) =>
      `${relationship.source}|${relationship.relation}|${relationship.target}`
  );
  return keys.length - new Set(keys).size;
}

export function buildKnowledgeExpansionInventory(input: {
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
  citationIds: ReadonlySet<string>;
  asOfDate: string;
}): KnowledgeExpansionInventory {
  const validEntityIds = new Set(input.entities.map((entity) => entity.id));

  const records = input.entities
    .map((entity): KnowledgeExpansionInventoryRecord => {
      const content = entity.content || {};
      const references: string[] = Array.isArray(content.references)
        ? content.references
        : [];
      const templateSignals = getTemplateSignals(entity);
      const legacyBulkGenerationCohort =
        isLegacyBulkGenerationCohort(entity);
      const reviewerRecorded = Boolean(entity.reviewer?.name);
      const immutableReviewerIdPresent = Boolean(entity.reviewer?.id);
      const authorReviewerNameConflict = Boolean(
        entity.author?.name &&
          entity.reviewer?.name &&
          entity.author.name === entity.reviewer.name
      );
      const independentReviewProven =
        reviewerRecorded &&
        immutableReviewerIdPresent &&
        !authorReviewerNameConflict;
      const withdrawn = WITHDRAWN_SAFETY_ENTITIES.has(entity.id);
      const flagship = FLAGSHIP_ENTITY_IDS.includes(
        entity.id as (typeof FLAGSHIP_ENTITY_IDS)[number]
      );
      const graph = getRelationshipFacts(
        entity.id,
        validEntityIds,
        input.relationships
      );
      const priority = determinePriority({
        withdrawn,
        flagship,
        genericTemplateDetected: templateSignals.length > 0,
        independentlyReviewed: independentReviewProven,
        isolated: graph.isolated,
        entityType: entity.entityType,
      });
      const eligibility = evaluatePublicationEligibility(entity);

      return {
        entityId: entity.id,
        slug: entity.slug,
        entityType: entity.entityType,
        title:
          typeof entity.title === "string" ? entity.title : entity.title.en,
        audience: entity.audience,
        editorialStatus: entity.editorialStatus,
        evidenceLevel: entity.evidenceLevel,
        safety: {
          withdrawn,
          riskTier: determineSafetyRiskTier(entity, withdrawn),
        },
        content: {
          overviewPresent: getOverview(entity).trim().length > 0,
          structuredSectionCompleteness:
            getStructuredSectionCompleteness(entity),
          legacyBulkGenerationCohort,
          genericTemplateDetected: templateSignals.length > 0,
          genericTemplateSignals: templateSignals,
        },
        evidence: {
          referenceCount: references.length,
          allReferencesResolvable:
            references.length > 0 &&
            references.every((referenceId) =>
              input.citationIds.has(referenceId)
            ),
          governedEvidenceProfilePresent: false,
          claimLevelCitationAssessment: "not-modeled",
        },
        review: {
          reviewerRecorded,
          immutableReviewerIdPresent,
          authorReviewerNameConflict,
          independentReviewProven,
        },
        graph,
        eligibility: {
          publicIndexAllowlisted: PUBLIC_INDEX_ALLOWLIST.has(entity.id),
          eligibleForIndexing: eligibility.eligibleForIndexing,
          ragAllowlisted: RAG_INGESTION_ALLOWLIST.has(entity.id),
          eligibleForRag: eligibility.eligibleForAiIngestion,
        },
        prioritisation: {
          priorityScore: priority.score,
          recommendation: determineRecommendation({
            withdrawn,
            flagship,
            genericTemplateDetected: templateSignals.length > 0,
          }),
          reasons: priority.reasons,
        },
      };
    })
    .sort(
      (left, right) =>
        right.prioritisation.priorityScore -
          left.prioritisation.priorityScore ||
        left.entityId.localeCompare(right.entityId)
    );

  const byEntityType = records.reduce<Record<string, number>>(
    (counts, record) => {
      counts[record.entityType] = (counts[record.entityType] || 0) + 1;
      return counts;
    },
    {}
  );

  return {
    schemaVersion: "1.0.0",
    asOfDate: input.asOfDate,
    policy: {
      publicationFreezeRequired: true,
      automaticApprovalPermitted: false,
      productionRagActivationPermitted: false,
    },
    summary: {
      totalEntities: records.length,
      byEntityType,
      withdrawnEntities: records.filter((record) => record.safety.withdrawn)
        .length,
      flagshipEntities: records.filter(
        (record) => record.prioritisation.recommendation === "flagship-pilot"
      ).length,
      legacyBulkGeneratedEntities: records.filter(
        (record) => record.content.legacyBulkGenerationCohort
      ).length,
      genericSignalEntities: records.filter(
        (record) => record.content.genericTemplateDetected
      ).length,
      independentlyReviewedEntities: records.filter(
        (record) => record.review.independentReviewProven
      ).length,
      governedEvidenceProfiles: records.filter(
        (record) => record.evidence.governedEvidenceProfilePresent
      ).length,
      claimCitationCompleteEntities: records.filter(
        (record) =>
          record.evidence.claimLevelCitationAssessment === "complete"
      ).length,
      isolatedEntities: records.filter((record) => record.graph.isolated)
        .length,
      duplicateRelationshipRows: countDuplicateRelationshipRows(
        input.relationships
      ),
      activeRagEntities: records.filter(
        (record) => record.eligibility.eligibleForRag
      ).length,
    },
    records,
  };
}

export function generateKnowledgeExpansionInventory(
  asOfDate: string
): KnowledgeExpansionInventory {
  return buildKnowledgeExpansionInventory({
    entities: getAllEntities(),
    relationships: KNOWLEDGE_RELATIONSHIPS,
    citationIds: new Set(CITATIONS.map((citation) => citation.id)),
    asOfDate,
  });
}
