// Clinical Knowledge Platform central entry point
// Exporting types, governance files, content libraries, and quality gates

export * from "./types";
export * from "./governance/editorialPolicy";
export * from "./governance/reviewWorkflow";
export * from "./governance/citationPolicy";
export * from "./governance/medicalWritingGuidelines";
export * from "./governance/contentLifecycle";
export * from "./governance/prohibitedClaims";
export * from "./governance/qualityGates";
export * from "./versioning/contentVersion";
export * from "./versioning/migration";

import { DISEASES } from "./content/diseases";
import { SYMPTOMS } from "./content/symptoms";
import { REMEDIES } from "./content/remedies";
import { LAB_TESTS } from "./content/lab-tests";
import { FAQS } from "./content/faqs";
import { RESEARCH } from "./content/research";
import { CASE_STUDIES } from "./content/case-studies";
import { KnowledgeEntity } from "./types";

export { DISEASES, SYMPTOMS, REMEDIES, LAB_TESTS, FAQS, RESEARCH, CASE_STUDIES };

/**
 * Aggregates all public knowledge entities in the platform.
 */
export function getAllKnowledgeEntities(): KnowledgeEntity[] {
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

/**
 * Registry of all entity IDs currently indexed.
 */
export function getAllEntityIds(): string[] {
  return getAllKnowledgeEntities().map(entity => entity.id);
}
