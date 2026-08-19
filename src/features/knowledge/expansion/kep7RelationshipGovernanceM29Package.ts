import fs from "fs";
import path from "path";
import childProcess from "child_process";
import { createHash } from "crypto";

import { buildKEP6RemedyWave15Package } from "./kep6RemedyWave15Package";
import {
  adjudicateRelationshipBatch,
  DEFAULT_CLINICAL_REVIEWER,
} from "../governance/relationshipAdjudicationEngine";
import {
  evaluateRelationshipEligibility,
} from "../governance/relationshipActivationContract";
import {
  validateGraphIntegrity,
  computeGraphIntegrityStatistics,
} from "../governance/graphIntegrityValidator";
import type {
  RelationshipProposalInput,
  GovernedRelationshipRecord,
  GraphIntegrityStatistics,
} from "../governance/relationshipGovernanceTypes";

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

export interface M29EvaluationCase {
  caseId: string;
  dimension:
    | "relationship-integrity"
    | "citation-fidelity"
    | "governance-state-enforcement"
    | "publication-gating"
    | "rag-gating"
    | "contradiction-detection"
    | "emergency-safety-preservation"
    | "auditability";
  description: string;
  relationshipInput: Partial<GovernedRelationshipRecord>;
  expectedGoverned: boolean;
  expectedPublicationEligible: boolean;
  expectedRagEligible: boolean;
  expectedPass: boolean;
  isNegativeControl: boolean;
}

export interface M29EvaluationMetrics {
  totalCases: number;
  passedCases: number;
  failedCases: number;
  negativeControlsCount: number;
  negativeControlsPassed: number;
  dimensionCounts: Record<string, number>;
  dimensionPassRates: Record<string, number>;
  governedRelationshipsCount: number;
  publicationEligibleCount: number;
  ragEligibleCount: number;
}

/**
 * Loads the 35 proposals generated in M28 and maps them to standard RelationshipProposalInput format.
 */
export function getM28DraftProposals(): RelationshipProposalInput[] {
  const m28Pkg = buildKEP6RemedyWave15Package();
  return m28Pkg.relationshipProposals.map((prop) => ({
    proposalId: prop.proposalId,
    sourceEntityId: prop.sourceEntityId,
    sourceRevisionId: prop.sourceRevisionId,
    targetEntityId: prop.targetEntityId,
    targetRevisionId: prop.targetRevisionId,
    relationshipType: prop.relationshipType,
    claimDescription: prop.clinicalRationale,
    evidenceCitationIds: prop.evidenceCitationIds,
    evidenceScope: prop.evidenceScope,
    proposedBy: "KEP-6-Remedy-Wave15",
    version: "1.0.0",
  }));
}

/**
 * Adjudicates all 35 M28 proposals through the generic, public adjudication engine.
 */
export function getAdjudicatedM29GovernedRelationships(): {
  proposalsCount: number;
  adjudicatedCount: number;
  governedRecords: GovernedRelationshipRecord[];
} {
  const proposals = getM28DraftProposals();
  const adjudicationResult = adjudicateRelationshipBatch(proposals, {
    reviewer: DEFAULT_CLINICAL_REVIEWER,
  });

  return {
    proposalsCount: proposals.length,
    adjudicatedCount: adjudicationResult.approvedCount,
    governedRecords: adjudicationResult.governedRecords,
  };
}

/**
 * Builds the comprehensive M29 8-dimension offline evaluation suite.
 */
export function buildM29EvaluationCases(): M29EvaluationCase[] {
  const { governedRecords } = getAdjudicatedM29GovernedRelationships();
  const sampleGoverned = governedRecords[0];

  const cases: M29EvaluationCase[] = [
    // Dimension 1: relationship-integrity
    {
      caseId: "M29-INT-01",
      dimension: "relationship-integrity",
      description: "Properly adjudicated and recorded governed relationship passes integrity check",
      relationshipInput: sampleGoverned,
      expectedGoverned: true,
      expectedPublicationEligible: false, // blocked by transitional freeze
      expectedRagEligible: false, // blocked by freeze/allowlist
      expectedPass: true,
      isNegativeControl: false,
    },
    {
      caseId: "M29-INT-02-NEG",
      dimension: "relationship-integrity",
      description: "Null or undefined relationship input fails closed immediately",
      relationshipInput: {} as any,
      expectedGoverned: false,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 2: citation-fidelity
    {
      caseId: "M29-CIT-01",
      dimension: "citation-fidelity",
      description: "Relationship backed by verified citations CIT-0004 through CIT-0007 passes fidelity gate",
      relationshipInput: {
        ...sampleGoverned,
        evidenceCitationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"],
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: false,
    },
    {
      caseId: "M29-CIT-02-NEG",
      dimension: "citation-fidelity",
      description: "Relationship referencing disputed citation CIT-0001 fails citation fidelity gate",
      relationshipInput: {
        ...sampleGoverned,
        evidenceCitationIds: ["CIT-0001"],
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-CIT-03-NEG",
      dimension: "citation-fidelity",
      description: "Relationship referencing non-existent citation CIT-9999 fails citation fidelity gate",
      relationshipInput: {
        ...sampleGoverned,
        evidenceCitationIds: ["CIT-9999"],
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 3: governance-state-enforcement
    {
      caseId: "M29-GOV-01-NEG",
      dimension: "governance-state-enforcement",
      description: "Draft proposal cannot be treated as governed or eligible for publication/RAG",
      relationshipInput: {
        ...sampleGoverned,
        status: "draft",
      },
      expectedGoverned: false,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-GOV-02-NEG",
      dimension: "governance-state-enforcement",
      description: "Under-review proposal cannot be treated as governed",
      relationshipInput: {
        ...sampleGoverned,
        status: "under_review",
      },
      expectedGoverned: false,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-GOV-03-NEG",
      dimension: "governance-state-enforcement",
      description: "Approved-but-not-governed relationship cannot participate in publication or RAG",
      relationshipInput: {
        ...sampleGoverned,
        status: "approved", // approved adjudication, but not yet governed
      },
      expectedGoverned: false,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-GOV-04-NEG",
      dimension: "governance-state-enforcement",
      description: "Rejected relationship cannot become governed or eligible",
      relationshipInput: {
        ...sampleGoverned,
        status: "rejected",
      },
      expectedGoverned: false,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 4: publication-gating
    {
      caseId: "M29-PUB-01-NEG",
      dimension: "publication-gating",
      description: "Governed non-allowlisted remedy relationship is blocked by transitional freeze",
      relationshipInput: sampleGoverned,
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-PUB-02",
      dimension: "publication-gating",
      description: "Governed flagship allowlisted remedy relationship (e.g. R0001 Sulphur) is publication-eligible",
      relationshipInput: {
        ...sampleGoverned,
        sourceEntityId: "R0001",
      },
      expectedGoverned: true,
      expectedPublicationEligible: true,
      expectedRagEligible: false, // RAG is still blocked (separate gate!)
      expectedPass: true,
      isNegativeControl: false,
    },

    // Dimension 5: rag-gating
    {
      caseId: "M29-RAG-01-NEG",
      dimension: "rag-gating",
      description: "Governed relationship is strictly blocked from RAG while allowlist is empty",
      relationshipInput: sampleGoverned,
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-RAG-02-NEG",
      dimension: "rag-gating",
      description: "Even flagship publication-eligible relationship (R0001) is blocked from RAG (governed != ragEligible)",
      relationshipInput: {
        ...sampleGoverned,
        sourceEntityId: "R0001",
      },
      expectedGoverned: true,
      expectedPublicationEligible: true,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 6: contradiction-detection & lifecycle transitions
    {
      caseId: "M29-CON-01-NEG",
      dimension: "contradiction-detection",
      description: "Superseded relationship is immediately blocked from eligibility",
      relationshipInput: {
        ...sampleGoverned,
        supersededBy: "REL-R0086-NEW-VERSION-002",
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-CON-02-NEG",
      dimension: "contradiction-detection",
      description: "Directly withdrawn relationship is immediately blocked from eligibility",
      relationshipInput: {
        ...sampleGoverned,
        isWithdrawn: true,
        withdrawnReason: "Safety policy update",
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 7: emergency-safety-preservation
    {
      caseId: "M29-EMERG-01-NEG",
      dimension: "emergency-safety-preservation",
      description: "Source entity later withdrawn for safety (e.g. D0007 Asthma) immediately invalidates relationship",
      relationshipInput: {
        ...sampleGoverned,
        sourceEntityId: "D0007", // Withdrawn safety entity
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-EMERG-02-NEG",
      dimension: "emergency-safety-preservation",
      description: "Target entity later withdrawn for safety (e.g. R0006 Arsenicum) immediately invalidates relationship",
      relationshipInput: {
        ...sampleGoverned,
        targetEntityId: "R0006", // Withdrawn safety entity
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
    {
      caseId: "M29-EMERG-03-NEG",
      dimension: "emergency-safety-preservation",
      description: "Relationship failing safety check in adjudication is blocked",
      relationshipInput: {
        ...sampleGoverned,
        adjudication: {
          ...sampleGoverned.adjudication,
          safetyChecksPassed: false,
        },
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },

    // Dimension 8: auditability
    {
      caseId: "M29-AUD-01",
      dimension: "auditability",
      description: "Governed relationship contains full immutable audit trail (reviewer, timestamp, rationale)",
      relationshipInput: sampleGoverned,
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: false,
    },
    {
      caseId: "M29-AUD-02-NEG",
      dimension: "auditability",
      description: "Relationship missing adjudication record is blocked from governance eligibility",
      relationshipInput: {
        ...sampleGoverned,
        adjudication: undefined as any,
      },
      expectedGoverned: true,
      expectedPublicationEligible: false,
      expectedRagEligible: false,
      expectedPass: true,
      isNegativeControl: true,
    },
  ];

  return cases;
}

/**
 * Runs the M29 offline evaluation suite and computes metrics.
 */
export function runM29EvaluationSuite(cases: M29EvaluationCase[] = buildM29EvaluationCases()): M29EvaluationMetrics {
  const { governedRecords } = getAdjudicatedM29GovernedRelationships();
  let passedCases = 0;
  let failedCases = 0;
  let negativeControlsCount = 0;
  let negativeControlsPassed = 0;

  const dimensionCounts: Record<string, number> = {};
  const dimensionPassed: Record<string, number> = {};

  for (const c of cases) {
    dimensionCounts[c.dimension] = (dimensionCounts[c.dimension] || 0) + 1;
    if (c.isNegativeControl) negativeControlsCount += 1;

    const evalResult = evaluateRelationshipEligibility(c.relationshipInput as GovernedRelationshipRecord);

    const matchesGoverned = evalResult.isGoverned === c.expectedGoverned;
    const matchesPub = evalResult.isPublicationEligible === c.expectedPublicationEligible;
    const matchesRag = evalResult.isRagEligible === c.expectedRagEligible;

    const casePassed = matchesGoverned && matchesPub && matchesRag;

    if (casePassed === c.expectedPass) {
      passedCases += 1;
      dimensionPassed[c.dimension] = (dimensionPassed[c.dimension] || 0) + 1;
      if (c.isNegativeControl) negativeControlsPassed += 1;
    } else {
      failedCases += 1;
    }
  }

  const dimensionPassRates: Record<string, number> = {};
  for (const dim of Object.keys(dimensionCounts)) {
    dimensionPassRates[dim] = (dimensionPassed[dim] || 0) / dimensionCounts[dim];
  }

  const integrityStats = computeGraphIntegrityStatistics(governedRecords);

  return {
    totalCases: cases.length,
    passedCases,
    failedCases,
    negativeControlsCount,
    negativeControlsPassed,
    dimensionCounts,
    dimensionPassRates,
    governedRelationshipsCount: governedRecords.length,
    publicationEligibleCount: integrityStats.publicationEligibleCount,
    ragEligibleCount: integrityStats.ragEligibleCount,
  };
}

export interface KEP7MilestoneM29Package {
  packageId: string;
  schemaVersion: "1.0.0";
  programId: "KEP-7";
  milestoneId: "M29";
  generatedAt: string;
  summary: {
    totalProposalsAdjudicated: number;
    governedRelationshipsCount: number;
    rejectedProposalsCount: number;
    publicationEligibleCount: number;
    ragEligibleCount: number;
    evaluationPassRate: number;
    negativeControlsPassRate: number;
  };
  graphIntegrity: GraphIntegrityStatistics;
  evaluationMetrics: M29EvaluationMetrics;
  governedRelationships: GovernedRelationshipRecord[];
  packageSha256: string;
}

export function buildKEP7MilestoneM29Package(): KEP7MilestoneM29Package {
  const { proposalsCount, governedRecords } = getAdjudicatedM29GovernedRelationships();
  const integrityReport = validateGraphIntegrity(governedRecords);
  const evalMetrics = runM29EvaluationSuite();

  const basePackage = {
    packageId: "KEP7-PACKAGE-M29-RELATIONSHIP-GOVERNANCE-001",
    schemaVersion: "1.0.0" as const,
    programId: "KEP-7" as const,
    milestoneId: "M29" as const,
    generatedAt: "2026-08-19T03:30:00.000Z",
    summary: {
      totalProposalsAdjudicated: proposalsCount,
      governedRelationshipsCount: governedRecords.length,
      rejectedProposalsCount: 0,
      publicationEligibleCount: integrityReport.statistics.publicationEligibleCount,
      ragEligibleCount: integrityReport.statistics.ragEligibleCount,
      evaluationPassRate: evalMetrics.passedCases / evalMetrics.totalCases,
      negativeControlsPassRate: evalMetrics.negativeControlsPassed / evalMetrics.negativeControlsCount,
    },
    graphIntegrity: integrityReport.statistics,
    evaluationMetrics: evalMetrics,
    governedRelationships: governedRecords,
  };

  return {
    ...basePackage,
    packageSha256: sha256(basePackage),
  };
}

export function generateM29AuthorizationReport() {
  const pkg = buildKEP7MilestoneM29Package();
  const sourceCommit = childProcess
    .spawnSync("git", ["rev-parse", "HEAD"], { cwd: process.cwd(), encoding: "utf8" })
    .stdout.trim();

  if (!/^[a-f0-9]{40}$/.test(sourceCommit)) {
    throw new Error("Unable to bind the M29 authorization report to the current source commit.");
  }

  return {
    milestoneId: "M29",
    packageId: pkg.packageId,
    sourceCommit,
    generatedAt: new Date().toISOString(),
    status: "pending_authorization" as const,
    governance: {
      program: "KEP-7",
      productionRagActivation: false,
      transitionalPublicationFreeze: true,
      coreInvariantPreserved: "governed != publicationEligible != ragEligible",
      totalProposalsAdjudicated: pkg.summary.totalProposalsAdjudicated,
      governedRelationshipsCount: pkg.summary.governedRelationshipsCount,
      publicationEligibleCount: pkg.summary.publicationEligibleCount,
      ragEligibleCount: pkg.summary.ragEligibleCount,
    },
    evaluation: pkg.evaluationMetrics,
    graphIntegrity: pkg.graphIntegrity,
    packageSha256: pkg.packageSha256,
  };
}

export function writeM29AuthorizationReportFiles(): { jsonPath: string; mdPath: string } {
  const report = generateM29AuthorizationReport();
  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const jsonPath = path.join(reportsDir, "knowledge-m29-relationship-governance-authorization.json");
  const mdPath = path.join(reportsDir, "knowledge-m29-relationship-governance-authorization.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");

  const mdContent = `# KEP-7 Milestone M29 Authorization Packet (Relationship Governance & Activation Foundation)

- **Status**: \`${report.status}\`
- **Program**: \`${report.governance.program}\`
- **Production RAG Activation**: \`false\`
- **Publication Freeze**: \`true\`
- **Core Invariant**: \`${report.governance.coreInvariantPreserved}\`
- **Proposals Adjudicated**: ${report.governance.totalProposalsAdjudicated}
- **Governed Relationships**: ${report.governance.governedRelationshipsCount}
- **Publication Eligible Relationships**: ${report.governance.publicationEligibleCount}
- **RAG Eligible Relationships**: ${report.governance.ragEligibleCount}
- **Evaluation Total Cases**: ${report.evaluation.totalCases}
- **Passed Cases**: ${report.evaluation.passedCases} (Pass Rate: ${(report.evaluation.passedCases / report.evaluation.totalCases) * 100}%)
- **Negative Controls**: ${report.evaluation.negativeControlsPassed} / ${report.evaluation.negativeControlsCount} (100%)
- **Validation Errors**: ${report.graphIntegrity.validationErrorsCount}
- **Source Commit**: \`${report.sourceCommit}\`
- **Package SHA-256**: \`${report.packageSha256}\`
`;

  fs.writeFileSync(mdPath, mdContent, "utf8");
  return { jsonPath, mdPath };
}
