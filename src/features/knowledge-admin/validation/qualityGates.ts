import { KmsKnowledgeEntity, QualityGateResult, QualityCheckIssue } from "../types";
import { PROHIBITED_CLAIMS_PHRASES } from "../constants";

/**
 * Validates an entity against strict clinical quality gates.
 * Returns checklist status, score, and any blocking errors/warnings.
 */
export function runQualityGateChecks(
  entity: KmsKnowledgeEntity,
  allEntities: KmsKnowledgeEntity[]
): QualityGateResult {
  const issues: QualityCheckIssue[] = [];
  const prohibitedClaimsFound: string[] = [];

  // Helper to audit text blocks
  const scanTextForClaims = (text: string, path: string) => {
    if (!text) return;
    const lower = text.toLowerCase();
    PROHIBITED_CLAIMS_PHRASES.forEach(phrase => {
      if (lower.includes(phrase)) {
        prohibitedClaimsFound.push(phrase);
        issues.push({
          rule: "PROHIBITED_CLAIMS",
          severity: "error",
          message: `Prohibited medical claim phrase found: "${phrase}" in field '${path}'`
        });
      }
    });
  };

  // 1. Basic Fields checks
  if (!entity.id || !entity.id.trim()) {
    issues.push({ rule: "ENTITY_ID", severity: "error", message: "Entity ID is missing." });
  }
  if (!entity.title?.en || !entity.title.en.trim()) {
    issues.push({ rule: "TITLE_EN", severity: "error", message: "English title is required." });
  } else {
    scanTextForClaims(entity.title.en, "title.en");
  }

  if (!entity.summary?.en || !entity.summary.en.trim()) {
    issues.push({ rule: "SUMMARY_EN", severity: "error", message: "English summary is required." });
  } else {
    scanTextForClaims(entity.summary.en, "summary.en");
  }

  // 2. Reviewer metadata
  if (!entity.reviewer?.name || !entity.reviewer.name.trim()) {
    issues.push({ rule: "REVIEWER", severity: "error", message: "A designated medical reviewer is required." });
  }
  if (!entity.lastReviewed) {
    issues.push({ rule: "REVIEW_DATE", severity: "error", message: "Medical review date is required." });
  }
  if (!entity.nextReviewDate) {
    issues.push({ rule: "NEXT_REVIEW", severity: "warning", message: "Scheduled next review date is recommended." });
  } else {
    const expired = new Date(entity.nextReviewDate) < new Date();
    if (expired) {
      issues.push({ rule: "NEXT_REVIEW_EXPIRED", severity: "warning", message: "Scheduled review date has expired." });
    }
  }

  // 3. Canonical URL
  const pluralType = entity.entityType === "research" 
    ? "research" 
    : entity.entityType === "case-study" 
      ? "case-studies" 
      : entity.entityType === "remedy" 
        ? "remedies" 
        : entity.entityType + "s";
  const expectedUrl = `https://homeo.healthcare/knowledge/${pluralType}/${entity.slug}`;
  if (!entity.canonicalUrl || entity.canonicalUrl !== expectedUrl) {
    issues.push({
      rule: "CANONICAL_URL",
      severity: "error",
      message: `Canonical URL '${entity.canonicalUrl}' does not match expected format '${expectedUrl}'`
    });
  }

  // 4. Citation and References
  if (!entity.content?.references || entity.content.references.length === 0) {
    issues.push({
      rule: "REFERENCES",
      severity: "warning",
      message: "At least one scientific peer-reviewed citation reference is recommended."
    });
  }

  // 5. Deep scan content subfields
  if (entity.content) {
    if (entity.content.overview?.en) {
      scanTextForClaims(entity.content.overview.en, "content.overview.en");
    }
    if (entity.content.treatmentPhilosophy?.en) {
      scanTextForClaims(entity.content.treatmentPhilosophy.en, "content.treatmentPhilosophy.en");
    }
    if (entity.content.safetyWarnings?.en) {
      scanTextForClaims(entity.content.safetyWarnings.en, "content.safetyWarnings.en");
    } else {
      issues.push({
        rule: "DISCLAIMER_WARNING",
        severity: "warning",
        message: "No specific clinical safety warning or disclaimer has been configured for this entity."
      });
    }
  }

  // 6. Check for broken relations
  entity.relatedEntities.forEach(targetId => {
    const targetExists = allEntities.some(e => e.id === targetId);
    if (!targetExists) {
      issues.push({
        rule: "BROKEN_RELATION",
        severity: "error",
        message: `Broken internal connection: target entity '${targetId}' was not found in active repository registry.`
      });
    }
  });

  // Calculate score based on errors (each error: -25, each warning: -10)
  const errorsCount = issues.filter(i => i.severity === "error").length;
  const warningsCount = issues.filter(i => i.severity === "warning").length;
  const score = Math.max(0, 100 - (errorsCount * 25) - (warningsCount * 10));
  const passed = errorsCount === 0;

  return {
    passed,
    score,
    issues,
    prohibitedClaimsFound
  };
}
