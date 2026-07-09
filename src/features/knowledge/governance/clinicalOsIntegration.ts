import { getAllKnowledgeEntities, getEntityUrl } from "../index";
import { KnowledgeEntity } from "../types";

// Knowledge Platform integration is read-only and must not alter clinical decision logic.

/**
 * Clinical OS Integration linking layer.
 * Prepares lightweight mapping links for the Clinical OS (practitioner workspace)
 * to reference the authoritative Knowledge Platform pages as dynamic tools.
 */

export interface ClinicalOsLink {
  url: string;
  title: string;
  found: boolean;
}

export interface KnowledgeContextBundle {
  id: string;
  slug: string;
  title: string;
  entityType: string;
  url: string;
  found: boolean;
  editorialStatus: string;
  citationHealth: string;
  isCornerstone: boolean;
  icdCode?: string;
  snomedCode?: string;
  clinicalSummary?: string;
  patientSummary?: string;
  studentSummary?: string;
  tags: string[];
  disclaimer: string;
}

const CLINICAL_DISCLAIMER = "Clinical Education Reference: This content is compiled for educational purposes and practitioner reference. It represents verified Materia Medica and homeopathic literature, but clinical decisions must be customized to the individual patient presentation.";

/**
 * Helper to look up an entity and resolve its URL path.
 * NOTE: The Knowledge Platform remains the single source of truth for all clinical and therapeutic metadata.
 */
function resolveLink(id: string, expectedType: string): ClinicalOsLink {
  if (!id) {
    return {
      url: "",
      title: "Knowledge article pending",
      found: false
    };
  }
  
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.id === id || e.slug === id || e.slug.toLowerCase() === id.toLowerCase());

  if (!entity || entity.entityType !== expectedType) {
    return {
      url: "",
      title: "Knowledge article pending",
      found: false
    };
  }

  // Resolve matching category URLs
  let categoryPath = "hubs";
  if (entity.entityType === "disease") categoryPath = "diseases";
  else if (entity.entityType === "symptom") categoryPath = "symptoms";
  else if (entity.entityType === "remedy") categoryPath = "remedies";
  else if (entity.entityType === "lab-test") categoryPath = "lab-tests";

  const titleStr = entity.title ? (typeof entity.title === "string" ? entity.title : (entity.title.en || "Homeopathic Knowledge Base")) : "Homeopathic Knowledge Base";

  return {
    url: `/knowledge/${categoryPath}/${entity.slug || ""}`,
    title: titleStr,
    found: true
  };
}

/**
 * Disease page link for patient timelines and clinical history charts.
 */
export function getKnowledgeLinkForDisease(diseaseId: string): ClinicalOsLink {
  return resolveLink(diseaseId, "disease");
}

/**
 * Remedy overview link for treatment planners, repertory charts, and prescriptions.
 */
export function getKnowledgeLinkForRemedy(remedyId: string): ClinicalOsLink {
  return resolveLink(remedyId, "remedy");
}

/**
 * Lab interpretation link for diagnostic investigations panels.
 */
export function getKnowledgeLinkForLabTest(labTestId: string): ClinicalOsLink {
  return resolveLink(labTestId, "lab-test");
}

/**
 * Symptom overview link for high-density symptom matrix panels and case audits.
 */
export function getKnowledgeLinkForSymptom(symptomId: string): ClinicalOsLink {
  return resolveLink(symptomId, "symptom");
}

/**
 * Comparison link for differential analysis and remedy selection grids.
 */
export function getKnowledgeLinkForComparison(comparisonId: string): ClinicalOsLink {
  if (!comparisonId) {
    return {
      url: "",
      title: "Knowledge article pending",
      found: false
    };
  }
  // Comparisons do not have standalone IDs in the base KnowledgeEntity, but are referenced by slug
  const entities = getAllKnowledgeEntities();
  const comparison = entities.find(e => e.entityType === "case-study" && (e.id === comparisonId || e.slug === comparisonId || e.slug.toLowerCase() === comparisonId.toLowerCase()));

  if (!comparison) {
    return {
      url: "",
      title: "Knowledge article pending",
      found: false
    };
  }

  const titleStr = comparison.title ? (typeof comparison.title === "string" ? comparison.title : (comparison.title.en || `Comparison: ${comparisonId}`)) : `Comparison: ${comparisonId}`;

  return {
    url: `/knowledge/case-studies/${comparison.slug || ""}`,
    title: titleStr,
    found: true
  };
}

/**
 * Helper to build a safe fallback/not-found context bundle.
 */
function buildFallbackContext(id: string, entityType: string): KnowledgeContextBundle {
  return {
    id,
    slug: id,
    title: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)}: ${id}`,
    entityType,
    url: "",
    found: false,
    editorialStatus: "needs-review",
    citationHealth: "Pending Review",
    isCornerstone: false,
    tags: [],
    disclaimer: CLINICAL_DISCLAIMER
  };
}

/**
 * Helper to transform a KnowledgeEntity into a KnowledgeContextBundle.
 */
function transformToBundle(entity: KnowledgeEntity): KnowledgeContextBundle {
  const titleStr = entity.title ? (typeof entity.title === "string" ? entity.title : (entity.title.en || "Untitled")) : "Untitled";
  return {
    id: entity.id,
    slug: entity.slug,
    title: titleStr,
    entityType: entity.entityType,
    url: getEntityUrl(entity.entityType, entity.slug),
    found: true,
    editorialStatus: entity.editorialStatus,
    citationHealth: entity.citationHealth || "Pending Review",
    isCornerstone: !!entity.isCornerstone,
    icdCode: entity.aiReadiness?.icd,
    snomedCode: entity.aiReadiness?.snomed,
    clinicalSummary: entity.aiReadiness?.clinicalSummary || entity.summary?.en,
    patientSummary: entity.aiReadiness?.patientSummary,
    studentSummary: entity.aiReadiness?.studentSummary,
    tags: entity.tags || [],
    disclaimer: CLINICAL_DISCLAIMER
  };
}

/**
 * Context bundle for active diseases.
 */
export function getKnowledgeContextForDisease(diseaseId: string): KnowledgeContextBundle {
  if (!diseaseId) return buildFallbackContext("unknown", "disease");
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.entityType === "disease" && (e.id === diseaseId || e.slug === diseaseId || e.slug.toLowerCase() === diseaseId.toLowerCase()));
  return entity ? transformToBundle(entity) : buildFallbackContext(diseaseId, "disease");
}

/**
 * Context bundle for active remedies.
 */
export function getKnowledgeContextForRemedy(remedyId: string): KnowledgeContextBundle {
  if (!remedyId) return buildFallbackContext("unknown", "remedy");
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.entityType === "remedy" && (e.id === remedyId || e.slug === remedyId || e.slug.toLowerCase() === remedyId.toLowerCase()));
  return entity ? transformToBundle(entity) : buildFallbackContext(remedyId, "remedy");
}

/**
 * Context bundle for laboratory investigations.
 */
export function getKnowledgeContextForLabTest(labTestId: string): KnowledgeContextBundle {
  if (!labTestId) return buildFallbackContext("unknown", "lab-test");
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.entityType === "lab-test" && (e.id === labTestId || e.slug === labTestId || e.slug.toLowerCase() === labTestId.toLowerCase()));
  return entity ? transformToBundle(entity) : buildFallbackContext(labTestId, "lab-test");
}

/**
 * Context bundle for symptom entities.
 */
export function getKnowledgeContextForSymptom(symptomId: string): KnowledgeContextBundle {
  if (!symptomId) return buildFallbackContext("unknown", "symptom");
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.entityType === "symptom" && (e.id === symptomId || e.slug === symptomId || e.slug.toLowerCase() === symptomId.toLowerCase()));
  return entity ? transformToBundle(entity) : buildFallbackContext(symptomId, "symptom");
}

/**
 * Context bundle for case studies / differential comparisons.
 */
export function getKnowledgeContextForComparison(comparisonId: string): KnowledgeContextBundle {
  if (!comparisonId) return buildFallbackContext("unknown", "case-study");
  const entities = getAllKnowledgeEntities();
  const entity = entities.find(e => e.entityType === "case-study" && (e.id === comparisonId || e.slug === comparisonId || e.slug.toLowerCase() === comparisonId.toLowerCase()));
  return entity ? transformToBundle(entity) : buildFallbackContext(comparisonId, "case-study");
}

/**
 * Consolidates lookups into a unified clinical context bundle package.
 */
export function getClinicalOsKnowledgeBundle(input: {
  diseases?: string[];
  remedies?: string[];
  symptoms?: string[];
  labTests?: string[];
  comparisons?: string[];
}): {
  diseases: Record<string, KnowledgeContextBundle>;
  remedies: Record<string, KnowledgeContextBundle>;
  symptoms: Record<string, KnowledgeContextBundle>;
  labTests: Record<string, KnowledgeContextBundle>;
  comparisons: Record<string, KnowledgeContextBundle>;
} {
  const result = {
    diseases: {} as Record<string, KnowledgeContextBundle>,
    remedies: {} as Record<string, KnowledgeContextBundle>,
    symptoms: {} as Record<string, KnowledgeContextBundle>,
    labTests: {} as Record<string, KnowledgeContextBundle>,
    comparisons: {} as Record<string, KnowledgeContextBundle>
  };

  if (input.diseases) {
    input.diseases.forEach(id => {
      result.diseases[id] = getKnowledgeContextForDisease(id);
    });
  }
  if (input.remedies) {
    input.remedies.forEach(id => {
      result.remedies[id] = getKnowledgeContextForRemedy(id);
    });
  }
  if (input.symptoms) {
    input.symptoms.forEach(id => {
      result.symptoms[id] = getKnowledgeContextForSymptom(id);
    });
  }
  if (input.labTests) {
    input.labTests.forEach(id => {
      result.labTests[id] = getKnowledgeContextForLabTest(id);
    });
  }
  if (input.comparisons) {
    input.comparisons.forEach(id => {
      result.comparisons[id] = getKnowledgeContextForComparison(id);
    });
  }

  return result;
}
