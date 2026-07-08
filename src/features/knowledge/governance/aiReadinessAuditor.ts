import { getAllKnowledgeEntities } from "../index";
import { KNOWLEDGE_RELATIONSHIPS } from "../graph/entityRelationships";

export interface ReadinessIssue {
  severity: "critical" | "warning";
  category: "id_format" | "broken_relationship" | "duplicate_id" | "missing_citation" | "empty_metadata";
  description: string;
  entityId?: string;
}

export interface ReadinessAuditReport {
  timestamp: string;
  passed: boolean;
  score: number;
  totalEntitiesCount: number;
  totalRelationshipsCount: number;
  issues: ReadinessIssue[];
}

export function runAIReadinessAudit(): ReadinessAuditReport {
  const entities = getAllKnowledgeEntities();
  const issues: ReadinessIssue[] = [];

  const entityIds = new Set<string>();
  const entitySlugs = new Set<string>();

  // 1. Audit entities format, duplicates, metadata completeness
  entities.forEach(e => {
    // Check ID duplicates
    if (entityIds.has(e.id)) {
      issues.push({
        severity: "critical",
        category: "duplicate_id",
        description: `Duplicate entity ID detected: ${e.id}`,
        entityId: e.id
      });
    }
    entityIds.add(e.id);

    // Check slug duplicates (qualified by entity type)
    const qualifiedSlug = `${e.entityType}/${e.slug}`;
    if (entitySlugs.has(qualifiedSlug)) {
      issues.push({
        severity: "critical",
        category: "duplicate_id",
        description: `Duplicate slug path detected: /knowledge/${e.entityType}/${e.slug}`,
        entityId: e.id
      });
    }
    entitySlugs.add(qualifiedSlug);

    // Check ID Format compliance
    const idRegex = /^[RDSL]\d{4}$/;
    if (["disease", "remedy", "symptom", "lab-test"].includes(e.entityType) && !idRegex.test(e.id)) {
      issues.push({
        severity: "warning",
        category: "id_format",
        description: `Non-standard Entity ID format: '${e.id}' (Expected format: e.g. R0001, D0001, S0001, L0001)`,
        entityId: e.id
      });
    }

    // Check metadata fields
    if (!e.title.en) {
      issues.push({
        severity: "critical",
        category: "empty_metadata",
        description: "Missing English title definition.",
        entityId: e.id
      });
    }
    if (!e.summary.en) {
      issues.push({
        severity: "warning",
        category: "empty_metadata",
        description: "Missing summary description.",
        entityId: e.id
      });
    }
  });

  // 2. Audit Relationships graph integrity
  KNOWLEDGE_RELATIONSHIPS.forEach(rel => {
    // Check source exists
    if (!entityIds.has(rel.source)) {
      issues.push({
        severity: "critical",
        category: "broken_relationship",
        description: `Broken link: source entity ID '${rel.source}' does not exist in registry database.`,
        entityId: rel.source
      });
    }
    // Check target exists
    if (!entityIds.has(rel.target)) {
      issues.push({
        severity: "critical",
        category: "broken_relationship",
        description: `Broken link: target entity ID '${rel.target}' does not exist in registry database.`,
        entityId: rel.target
      });
    }
  });

  // 3. Compute readiness index
  const criticalCount = issues.filter(i => i.severity === "critical").length;
  const warningCount = issues.filter(i => i.severity === "warning").length;
  
  const score = Math.max(0, 100 - (criticalCount * 15) - (warningCount * 3));
  const passed = criticalCount === 0;

  return {
    timestamp: new Date().toISOString(),
    passed,
    score,
    totalEntitiesCount: entities.length,
    totalRelationshipsCount: KNOWLEDGE_RELATIONSHIPS.length,
    issues
  };
}
