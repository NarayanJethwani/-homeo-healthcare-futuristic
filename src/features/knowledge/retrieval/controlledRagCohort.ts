import { GerdDisease } from "../content/diseases/gerd";
import { EczemaDisease } from "../content/diseases/eczema";
import { SulphurRemedy } from "../content/remedies/sulphur";
import { NuxVomicaRemedy } from "../content/remedies/nux-vomica";
import { CbcLabTest } from "../content/lab-tests/cbc";
import { TshLabTest } from "../content/lab-tests/tsh";
import { WITHDRAWN_SAFETY_ENTITIES } from "../governance/publicationGuard";
import { CITATIONS } from "../content/citations";
import type { KnowledgeEntity, CitationRecord } from "../types";

export const CONTROLLED_RAG_COHORT_V1: ReadonlyArray<string> = [
  "D0001", // GERD
  "D0002", // Eczema
  "R0001", // Sulphur
  "R0002", // Nux Vomica
  "L0001", // CBC
  "L0002", // TSH
];

export const FLAGSHIP_ENTITIES_V1: KnowledgeEntity[] = [
  GerdDisease,
  EczemaDisease,
  SulphurRemedy,
  NuxVomicaRemedy,
  CbcLabTest,
  TshLabTest,
];

export interface EntityRagPreflightResult {
  entityId: string;
  slug: string;
  isEligible: boolean;
  governanceVersion: string;
  editorialStatus: string;
  citationIntegrityPassed: boolean;
  safetyChecksPassed: boolean;
  withdrawnCheckPassed: boolean;
  independentReviewPassed: boolean;
  allowlistPassed: boolean;
  reasons: string[];
  evaluatedAt: string;
}

export interface RagCohortReadinessReport {
  cohortId: string;
  schemaVersion: "1.0.0";
  isCohortReady: boolean;
  totalCohortEntities: number;
  eligibleEntitiesCount: number;
  ineligibleEntitiesCount: number;
  entityPreflightResults: EntityRagPreflightResult[];
  evaluatedAt: string;
}

/**
 * Evaluates an individual candidate entity against the strict RAG Preflight Gate.
 * An entity must pass all preflight checks to enter the eligible RAG retrieval set.
 */
export function evaluateEntityRagPreflight(
  entity: KnowledgeEntity | null | undefined,
  citationsMap: Map<string, CitationRecord> = new Map(CITATIONS.map((c) => [c.id, c]))
): EntityRagPreflightResult {
  const nowStr = new Date().toISOString();

  if (!entity) {
    return {
      entityId: "UNKNOWN",
      slug: "unknown",
      isEligible: false,
      governanceVersion: "unknown",
      editorialStatus: "unknown",
      citationIntegrityPassed: false,
      safetyChecksPassed: false,
      withdrawnCheckPassed: false,
      independentReviewPassed: false,
      allowlistPassed: false,
      reasons: ["entity-null-or-undefined"],
      evaluatedAt: nowStr,
    };
  }

  const reasons: string[] = [];
  const entityId = entity.id;

  // 1. Withdrawal Check (Dynamic cascade protection)
  const isWithdrawn =
    WITHDRAWN_SAFETY_ENTITIES.has(entityId) ||
    entity.editorialStatus === "archived" ||
    entity.editorialStatus === ("withdrawn" as any) ||
    entity.legacyVerificationStatus === "excluded" ||
    entity.legacyVerificationStatus === "archived";

  const withdrawnCheckPassed = !isWithdrawn;
  if (!withdrawnCheckPassed) {
    reasons.push(`withdrawn-safety-entity: entity '${entityId}' is withdrawn or excluded`);
  }

  // 2. Cohort Allowlist Gate
  const allowlistPassed = CONTROLLED_RAG_COHORT_V1.includes(entityId);
  if (!allowlistPassed) {
    reasons.push(`not-in-controlled-rag-cohort: entity '${entityId}' is not in V1 controlled cohort`);
  }

  // 3. Editorial & Governance Version Status
  const isGovernedVersion = entity.versionInfo?.version === "1.1.0" || entity.versionInfo?.version === "1.0.0";
  const isPublished = entity.editorialStatus === "published";
  if (!isGovernedVersion || !isPublished) {
    reasons.push(`governance-status-invalid: version=${entity.versionInfo?.version}, status=${entity.editorialStatus}`);
  }

  // 4. Citation Integrity
  const references: string[] =
    entity.content?.references ||
    (entity.claimCitations ? entity.claimCitations.flatMap((c) => c.citationIds || []) : []);

  let citationIntegrityPassed = true;
  if (references.length === 0) {
    citationIntegrityPassed = false;
    reasons.push("no-references-defined");
  } else {
    for (const refId of references) {
      const citation = citationsMap.get(refId);
      if (!citation) {
        citationIntegrityPassed = false;
        reasons.push(`citation-unresolved: '${refId}'`);
      } else if (citation.verificationStatus === "disputed") {
        citationIntegrityPassed = false;
        reasons.push(`citation-disputed: '${refId}'`);
      }
    }
  }

  // 5. Safety Checks & Emergency Conventional Boundaries
  const hasRedFlags =
    (Array.isArray(entity.redFlags) && entity.redFlags.length > 0) ||
    (Array.isArray(entity.content?.redFlags) && entity.content.redFlags.length > 0);

  const overviewText = `${entity.content?.overview || entity.content?.description || ""} ${entity.aiReadiness?.clinicalSummary || ""}`.toLowerCase();
  const hasUnsafeClaims =
    overviewText.includes("safe and non-toxic") ||
    overviewText.includes("minimal chemical solute") ||
    overviewText.includes("100% cure");

  const safetyChecksPassed = hasRedFlags && !hasUnsafeClaims;
  if (!hasRedFlags) {
    reasons.push("red-flags-or-emergency-boundaries-missing");
  }
  if (hasUnsafeClaims) {
    reasons.push("unsafe-or-prohibited-claims-detected");
  }

  // 6. Independent Review Gate
  const hasReviewer = Boolean(entity.reviewer);
  const independentReviewPassed = hasReviewer;
  if (!independentReviewPassed) {
    reasons.push("independent-clinical-review-unrecorded");
  }

  const isEligible =
    withdrawnCheckPassed &&
    allowlistPassed &&
    isPublished &&
    citationIntegrityPassed &&
    safetyChecksPassed &&
    independentReviewPassed;

  return {
    entityId,
    slug: entity.slug,
    isEligible,
    governanceVersion: entity.versionInfo?.version || "1.0.0",
    editorialStatus: entity.editorialStatus,
    citationIntegrityPassed,
    safetyChecksPassed,
    withdrawnCheckPassed,
    independentReviewPassed,
    allowlistPassed,
    reasons,
    evaluatedAt: nowStr,
  };
}

/**
 * Evaluates the full controlled RAG cohort readiness across all 6 flagship entities.
 */
export function evaluateRagCohortReadiness(
  entities: KnowledgeEntity[] = FLAGSHIP_ENTITIES_V1
): RagCohortReadinessReport {
  const citationsMap = new Map(CITATIONS.map((c) => [c.id, c]));
  const results = entities.map((e) => evaluateEntityRagPreflight(e, citationsMap));
  const eligibleCount = results.filter((r) => r.isEligible).length;

  return {
    cohortId: "CONTROLLED-RAG-COHORT-V1",
    schemaVersion: "1.0.0",
    isCohortReady: eligibleCount === CONTROLLED_RAG_COHORT_V1.length,
    totalCohortEntities: CONTROLLED_RAG_COHORT_V1.length,
    eligibleEntitiesCount: eligibleCount,
    ineligibleEntitiesCount: results.length - eligibleCount,
    entityPreflightResults: results,
    evaluatedAt: new Date().toISOString(),
  };
}
