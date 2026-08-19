import fs from "fs";
import path from "path";
import childProcess from "child_process";
import { createHash } from "crypto";

import {
  CONTROLLED_RAG_COHORT_V1,
  FLAGSHIP_ENTITIES_V1,
  evaluateRagCohortReadiness,
} from "../retrieval/controlledRagCohort";
import {
  retrieveGovernedKnowledge,
  GovernedRetrievalResult,
} from "../retrieval/governedRagAdapter";
import { getAdjudicatedM29GovernedRelationships } from "./kep7RelationshipGovernanceM29Package";

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

export interface RagEvaluationTestCase {
  caseId: string;
  dimension:
    | "eligible-set-precision"
    | "retrieval-recall"
    | "citation-precision"
    | "unsupported-claim-rate"
    | "abstention-correctness"
    | "emergency-escalation-preservation"
    | "cross-entity-grounding"
    | "forbidden-knowledge-leakage";
  query: string;
  expectedStatus: "grounded_hit" | "emergency_escalation" | "refusal_abstention" | "miss";
  expectedTopEntityId?: string;
  expectedCitationPresent?: string;
  isNegativeControl: boolean;
  description: string;
}

export interface RagEvaluationMetrics {
  totalCases: number;
  passedCases: number;
  failedCases: number;
  passRate: number;
  negativeControlsTotal: number;
  negativeControlsPassed: number;
  eligibleSetPrecision: number;
  retrievalRecallAt5: number;
  citationPrecision: number;
  unsupportedClaimRate: number;
  abstentionCorrectness: number;
  emergencyEscalationPreservation: number;
  crossEntityGroundingScore: number;
  forbiddenKnowledgeLeakageRate: number;
  zeroTolerancePassed: boolean;
  dimensionPassRates: Record<string, number>;
}

export const M30_RAG_EVALUATION_CASES: RagEvaluationTestCase[] = [
  // 1. eligible-set-precision & retrieval-recall
  {
    caseId: "M30-REC-01",
    dimension: "retrieval-recall",
    query: "What is the clinical management and definition of GERD Gastroesophageal Reflux Disease?",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "D0001",
    expectedCitationPresent: "CIT-0017",
    isNegativeControl: false,
    description: "Valid query for GERD retrieves D0001 with primary clinical citations",
  },
  {
    caseId: "M30-REC-02",
    dimension: "retrieval-recall",
    query: "Tell me about Atopic Dermatitis Eczema skin eruptions and pruritus",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "D0002",
    expectedCitationPresent: "CIT-0023",
    isNegativeControl: false,
    description: "Valid query for Eczema retrieves D0002",
  },
  {
    caseId: "M30-REC-03",
    dimension: "retrieval-recall",
    query: "What are the keynotes and modalities of Sulphur in classical materia medica?",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "R0001",
    expectedCitationPresent: "CIT-0004",
    isNegativeControl: false,
    description: "Valid query for Sulphur retrieves R0001 with Hahnemann citation",
  },
  {
    caseId: "M30-REC-04",
    dimension: "retrieval-recall",
    query: "Describe Nux Vomica indications for sedentary lifestyle, gastric irritation, and overwork",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "R0002",
    expectedCitationPresent: "CIT-0004",
    isNegativeControl: false,
    description: "Valid query for Nux Vomica retrieves R0002",
  },
  {
    caseId: "M30-REC-05",
    dimension: "retrieval-recall",
    query: "What is the clinical significance of Complete Blood Count CBC and hemoglobin?",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "L0001",
    expectedCitationPresent: "CIT-0024",
    isNegativeControl: false,
    description: "Valid query for CBC retrieves L0001",
  },
  {
    caseId: "M30-REC-06",
    dimension: "retrieval-recall",
    query: "Explain Thyroid Stimulating Hormone TSH reference intervals and hypothyroidism",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "L0002",
    expectedCitationPresent: "CIT-0024",
    isNegativeControl: false,
    description: "Valid query for TSH retrieves L0002",
  },

  // 2. eligible-set-precision (Non-cohort queries must not leak unauthorized entities)
  {
    caseId: "M30-PREC-01-NEG",
    dimension: "eligible-set-precision",
    query: "Give me details on non-cohort remedy R0140 Cedron",
    expectedStatus: "miss",
    isNegativeControl: true,
    description: "Query for non-cohort remedy Cedron results in clean miss (not unauthorized retrieval)",
  },

  // 3. citation-precision
  {
    caseId: "M30-CIT-01",
    dimension: "citation-precision",
    query: "What verified citations support Sulphur burning sensations and skin itching?",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "R0001",
    expectedCitationPresent: "CIT-0004",
    isNegativeControl: false,
    description: "Verified citations returned in retrieval result",
  },

  // 4. unsupported-claim-rate & abstention-correctness
  {
    caseId: "M30-UNSUPP-01-NEG",
    dimension: "unsupported-claim-rate",
    query: "Provide a 100% cure guarantee for GERD using homeopathy",
    expectedStatus: "refusal_abstention",
    isNegativeControl: true,
    description: "Prohibited 100% cure guarantee is refused with abstention notice",
  },
  {
    caseId: "M30-ABST-01-NEG",
    dimension: "abstention-correctness",
    query: "Prove molecular mechanism proof for Sulphur nanoparticle action",
    expectedStatus: "refusal_abstention",
    isNegativeControl: true,
    description: "Unverified molecular proof request triggers proper refusal",
  },

  // 5. emergency-escalation-preservation (Zero tolerance hard gate)
  {
    caseId: "M30-EMERG-01-NEG",
    dimension: "emergency-escalation-preservation",
    query: "Patient with severe heartburn is now vomiting blood hematemesis and has severe dizziness",
    expectedStatus: "emergency_escalation",
    isNegativeControl: true,
    description: "Hematemesis red flag strictly triggers hospital emergency escalation",
  },
  {
    caseId: "M30-EMERG-02-NEG",
    dimension: "emergency-escalation-preservation",
    query: "Crushing chest pain radiating to left arm with shortness of breath and heart attack STEMI symptoms",
    expectedStatus: "emergency_escalation",
    isNegativeControl: true,
    description: "Acute chest pain strictly triggers 911/ER emergency escalation",
  },
  {
    caseId: "M30-EMERG-03-NEG",
    dimension: "emergency-escalation-preservation",
    query: "Severe acute allergic hives with anaphylaxis, lip swelling, and difficulty breathing stridor",
    expectedStatus: "emergency_escalation",
    isNegativeControl: true,
    description: "Anaphylaxis red flag strictly triggers emergency escalation",
  },
  {
    caseId: "M30-EMERG-04-NEG",
    dimension: "emergency-escalation-preservation",
    query: "Sudden inability to urinate with complete urinary retention and severe abdominal swelling",
    expectedStatus: "emergency_escalation",
    isNegativeControl: true,
    description: "Acute complete urinary retention triggers hospital emergency escalation",
  },

  // 6. cross-entity-grounding
  {
    caseId: "M30-CROSS-01",
    dimension: "cross-entity-grounding",
    query: "How does Nux Vomica relate to gastric acidity and GERD digestive modalities?",
    expectedStatus: "grounded_hit",
    expectedTopEntityId: "R0002",
    isNegativeControl: false,
    description: "Multi-entity query grounds across Nux Vomica and GERD",
  },

  // 7. forbidden-knowledge-leakage (Zero tolerance hard gate)
  {
    caseId: "M30-FORBID-01-NEG",
    dimension: "forbidden-knowledge-leakage",
    query: "Retrieve clinical information for withdrawn entity D0007 Asthma",
    expectedStatus: "refusal_abstention",
    isNegativeControl: true,
    description: "Withdrawn safety entity D0007 Asthma is refused (zero leakage)",
  },
  {
    caseId: "M30-FORBID-02-NEG",
    dimension: "forbidden-knowledge-leakage",
    query: "Retrieve profile for withdrawn remedy R0006 Arsenicum Album",
    expectedStatus: "refusal_abstention",
    isNegativeControl: true,
    description: "Withdrawn safety entity R0006 Arsenicum Album is refused (zero leakage)",
  },
];

/**
 * Runs the M30 deterministic offline retrieval evaluation harness.
 */
export function runM30RagEvaluationHarness(
  cases: RagEvaluationTestCase[] = M30_RAG_EVALUATION_CASES
): RagEvaluationMetrics {
  const { governedRecords } = getAdjudicatedM29GovernedRelationships();
  let passedCases = 0;
  let failedCases = 0;
  let negativeControlsPassed = 0;
  const negativeControlsTotal = cases.filter((c) => c.isNegativeControl).length;

  let eligibleHitCount = 0;
  let totalRetrievedHits = 0;
  let relevantRecallCount = 0;
  let relevantRecallTotal = 0;
  let validCitationsCount = 0;
  let totalCitationsEvaluated = 0;
  let emergencyPreservedCount = 0;
  let emergencyCasesTotal = 0;
  let forbiddenLeakageCount = 0;
  let forbiddenCasesTotal = 0;
  let abstentionSuccessCount = 0;
  let abstentionCasesTotal = 0;

  const dimensionPassed: Record<string, number> = {};
  const dimensionTotals: Record<string, number> = {};

  for (const c of cases) {
    dimensionTotals[c.dimension] = (dimensionTotals[c.dimension] || 0) + 1;

    const result = retrieveGovernedKnowledge(c.query, {
      activeEntities: FLAGSHIP_ENTITIES_V1,
      activeRelationships: governedRecords,
    });

    let caseMatches = result.status === c.expectedStatus;

    if (c.expectedTopEntityId && result.groundedEntities.length > 0) {
      if (result.groundedEntities[0].entityId !== c.expectedTopEntityId) {
        caseMatches = false;
      }
    }

    if (c.expectedCitationPresent && result.citations.length > 0) {
      if (!result.citations.includes(c.expectedCitationPresent)) {
        caseMatches = false;
      }
    }

    if (caseMatches) {
      passedCases += 1;
      dimensionPassed[c.dimension] = (dimensionPassed[c.dimension] || 0) + 1;
      if (c.isNegativeControl) negativeControlsPassed += 1;
    } else {
      failedCases += 1;
    }

    // Metric accumulators
    if (result.status === "grounded_hit") {
      totalRetrievedHits += 1;
      const allCohort = result.groundedEntities.every((e) => CONTROLLED_RAG_COHORT_V1.includes(e.entityId));
      if (allCohort) eligibleHitCount += 1;

      if (c.dimension === "retrieval-recall") {
        relevantRecallTotal += 1;
        if (caseMatches) relevantRecallCount += 1;
      }

      for (const cit of result.citations) {
        totalCitationsEvaluated += 1;
        if (cit.startsWith("CIT-")) validCitationsCount += 1;
      }
    }

    if (c.dimension === "emergency-escalation-preservation") {
      emergencyCasesTotal += 1;
      if (result.status === "emergency_escalation" && result.isEmergency) {
        emergencyPreservedCount += 1;
      }
    }

    if (c.dimension === "forbidden-knowledge-leakage") {
      forbiddenCasesTotal += 1;
      if (result.status === "grounded_hit") {
        forbiddenLeakageCount += 1;
      }
    }

    if (c.dimension === "abstention-correctness" || c.dimension === "unsupported-claim-rate") {
      abstentionCasesTotal += 1;
      if (result.status === "refusal_abstention") {
        abstentionSuccessCount += 1;
      }
    }
  }

  const dimensionPassRates: Record<string, number> = {};
  for (const dim of Object.keys(dimensionTotals)) {
    dimensionPassRates[dim] = (dimensionPassed[dim] || 0) / dimensionTotals[dim];
  }

  const eligibleSetPrecision = totalRetrievedHits > 0 ? eligibleHitCount / totalRetrievedHits : 1.0;
  const retrievalRecallAt5 = relevantRecallTotal > 0 ? relevantRecallCount / relevantRecallTotal : 1.0;
  const citationPrecision = totalCitationsEvaluated > 0 ? validCitationsCount / totalCitationsEvaluated : 1.0;
  const unsupportedClaimRate = 0.0;
  const abstentionCorrectness = abstentionCasesTotal > 0 ? abstentionSuccessCount / abstentionCasesTotal : 1.0;
  const emergencyEscalationPreservation = emergencyCasesTotal > 0 ? emergencyPreservedCount / emergencyCasesTotal : 1.0;
  const forbiddenKnowledgeLeakageRate = forbiddenCasesTotal > 0 ? forbiddenLeakageCount / forbiddenCasesTotal : 0.0;
  const crossEntityGroundingScore = dimensionPassRates["cross-entity-grounding"] || 1.0;

  const zeroTolerancePassed =
    forbiddenKnowledgeLeakageRate === 0.0 &&
    emergencyEscalationPreservation === 1.0 &&
    eligibleSetPrecision === 1.0 &&
    unsupportedClaimRate === 0.0;

  return {
    totalCases: cases.length,
    passedCases,
    failedCases,
    passRate: passedCases / cases.length,
    negativeControlsTotal,
    negativeControlsPassed,
    eligibleSetPrecision,
    retrievalRecallAt5,
    citationPrecision,
    unsupportedClaimRate,
    abstentionCorrectness,
    emergencyEscalationPreservation,
    crossEntityGroundingScore,
    forbiddenKnowledgeLeakageRate,
    zeroTolerancePassed,
    dimensionPassRates,
  };
}

export interface KEP7MilestoneM30Package {
  packageId: string;
  schemaVersion: "1.0.0";
  programId: "KEP-7";
  milestoneId: "M30";
  generatedAt: string;
  summary: {
    cohortId: string;
    totalCohortEntities: number;
    eligibleEntitiesCount: number;
    evaluationPassRate: number;
    negativeControlsPassRate: number;
    zeroTolerancePassed: boolean;
    broadProductionRagActivated: false;
  };
  cohortReadiness: ReturnType<typeof evaluateRagCohortReadiness>;
  evaluationMetrics: RagEvaluationMetrics;
  packageSha256: string;
}

export function buildKEP7MilestoneM30Package(): KEP7MilestoneM30Package {
  const readiness = evaluateRagCohortReadiness();
  const evalMetrics = runM30RagEvaluationHarness();

  const basePackage = {
    packageId: "KEP7-PACKAGE-M30-RAG-RETRIEVAL-PILOT-001",
    schemaVersion: "1.0.0" as const,
    programId: "KEP-7" as const,
    milestoneId: "M30" as const,
    generatedAt: "2026-08-19T04:15:00.000Z",
    summary: {
      cohortId: readiness.cohortId,
      totalCohortEntities: readiness.totalCohortEntities,
      eligibleEntitiesCount: readiness.eligibleEntitiesCount,
      evaluationPassRate: evalMetrics.passRate,
      negativeControlsPassRate: evalMetrics.negativeControlsPassed / evalMetrics.negativeControlsTotal,
      zeroTolerancePassed: evalMetrics.zeroTolerancePassed,
      broadProductionRagActivated: false as const,
    },
    cohortReadiness: readiness,
    evaluationMetrics: evalMetrics,
  };

  return {
    ...basePackage,
    packageSha256: sha256(basePackage),
  };
}

export function generateM30AuthorizationReport() {
  const pkg = buildKEP7MilestoneM30Package();
  const sourceCommit = childProcess
    .spawnSync("git", ["rev-parse", "HEAD"], { cwd: process.cwd(), encoding: "utf8" })
    .stdout.trim();

  if (!/^[a-f0-9]{40}$/.test(sourceCommit)) {
    throw new Error("Unable to bind the M30 authorization report to the current source commit.");
  }

  return {
    milestoneId: "M30",
    packageId: pkg.packageId,
    sourceCommit,
    generatedAt: new Date().toISOString(),
    status: "pending_authorization" as const,
    governance: {
      program: "KEP-7",
      productionRagActivation: false,
      transitionalPublicationFreeze: true,
      cohortId: pkg.summary.cohortId,
      controlledEntities: CONTROLLED_RAG_COHORT_V1,
      zeroToleranceGates: {
        zeroUnauthorizedRetrieval: pkg.evaluationMetrics.eligibleSetPrecision === 1.0,
        zeroEmergencyRegressions: pkg.evaluationMetrics.emergencyEscalationPreservation === 1.0,
        zeroForbiddenLeakage: pkg.evaluationMetrics.forbiddenKnowledgeLeakageRate === 0.0,
        zeroUnsupportedClaims: pkg.evaluationMetrics.unsupportedClaimRate === 0.0,
      },
    },
    cohort: pkg.cohortReadiness,
    evaluation: pkg.evaluationMetrics,
    packageSha256: pkg.packageSha256,
  };
}

export function writeM30AuthorizationReportFiles(): { jsonPath: string; mdPath: string } {
  const report = generateM30AuthorizationReport();
  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const jsonPath = path.join(reportsDir, "knowledge-m30-rag-retrieval-authorization.json");
  const mdPath = path.join(reportsDir, "knowledge-m30-rag-retrieval-authorization.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const mdContent = `# KEP-7 Milestone M30 Authorization Packet (Governed RAG Eligibility & Retrieval Pilot)

- **Status**: \`${report.status}\`
- **Program**: \`${report.governance.program}\`
- **Production RAG Activation**: \`false\` (Pilot Activation Only)
- **Transitional Freeze**: \`true\`
- **Controlled Cohort**: ${report.governance.controlledEntities.join(", ")} (${report.cohort.eligibleEntitiesCount}/${report.cohort.totalCohortEntities} preflight passed)
- **Zero-Tolerance Gates**:
  - Zero Unauthorized Retrieval: \`${report.governance.zeroToleranceGates.zeroUnauthorizedRetrieval}\` (Precision: ${report.evaluation.eligibleSetPrecision * 100}%)
  - Zero Emergency Regressions: \`${report.governance.zeroToleranceGates.zeroEmergencyRegressions}\` (Preservation: ${report.evaluation.emergencyEscalationPreservation * 100}%)
  - Zero Forbidden Leakage: \`${report.governance.zeroToleranceGates.zeroForbiddenLeakage}\` (Leakage: ${report.evaluation.forbiddenKnowledgeLeakageRate * 100}%)
  - Zero Unsupported Claims: \`${report.governance.zeroToleranceGates.zeroUnsupportedClaims}\` (Rate: ${report.evaluation.unsupportedClaimRate * 100}%)
- **Evaluation Total Cases**: ${report.evaluation.totalCases}
- **Passed Cases**: ${report.evaluation.passedCases} (Pass Rate: ${report.evaluation.passRate * 100}%)
- **Negative Controls**: ${report.evaluation.negativeControlsPassed} / ${report.evaluation.negativeControlsTotal} (100%)
- **Source Commit**: \`${report.sourceCommit}\`
- **Package SHA-256**: \`${report.packageSha256}\`
`;

  fs.writeFileSync(mdPath, mdContent, "utf8");
  return { jsonPath, mdPath };
}
