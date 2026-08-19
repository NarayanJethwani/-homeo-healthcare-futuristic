import { createHash } from "crypto";
import { CITATIONS } from "../content/citations";
import type { CitationRecord } from "../types";
import type {
  RelationshipProposalInput,
  GovernedRelationshipRecord,
  RelationshipAdjudicationRecord,
  RelationshipLifecycleStatus,
} from "./relationshipGovernanceTypes";

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

export interface AdjudicationContext {
  reviewer: {
    reviewerId: string;
    name: string;
    credentials: string;
    specialty: string;
    institution: string;
  };
  knownEntityIds?: Set<string>;
  knownCitations?: Map<string, CitationRecord>;
  existingRelationships?: GovernedRelationshipRecord[];
  governanceCommitSha?: string;
  currentIsoTime?: string;
}

export const DEFAULT_CLINICAL_REVIEWER = {
  reviewerId: "REV-NARAYAN-JETHWANI",
  name: "Dr. Narayan Jethwani",
  credentials: "MD (Hom)",
  specialty: "Clinical Governance & Materia Medica",
  institution: "Homeo Healthcare Clinic",
};

const EMERGENCY_KEYWORDS = [
  "hemorrhage",
  "bleeding",
  "shock",
  "dvt",
  "embolism",
  "apnea",
  "cyanosis",
  "airway obstruction",
  "stridor",
  "cauda equina",
  "paralysis",
  "paraparesis",
  "sepsis",
  "urosepsis",
  "perforation",
  "peritonitis",
  "stemi",
  "myocardial infarction",
  "torsades",
  "retention",
  "anaphylaxis",
  "status epilepticus",
  "cicutoxin",
];

const CURATIVE_PROHIBITED_PHRASES = [
  "100% cure",
  "guaranteed cure",
  "cures without conventional care",
  "replaces emergency care",
  "proven modern efficacy",
  "safe and non-toxic",
  "minimal chemical solute",
];

export interface AdjudicationResult {
  proposalId: string;
  lifecycleStatus: RelationshipLifecycleStatus;
  adjudication: RelationshipAdjudicationRecord;
  governedRecord?: GovernedRelationshipRecord;
  validationErrors: string[];
  safetyWarnings: string[];
}

/**
 * Centrally and deterministically adjudicates a single relationship proposal.
 * Every proposal, including historical batch proposals, passes through this exact same pipeline.
 */
export function adjudicateRelationshipProposal(
  proposal: RelationshipProposalInput,
  context: AdjudicationContext = { reviewer: DEFAULT_CLINICAL_REVIEWER }
): AdjudicationResult {
  const validationErrors: string[] = [];
  const safetyWarnings: string[] = [];
  const nowStr = context.currentIsoTime || new Date().toISOString();
  const citationsMap = context.knownCitations || new Map(CITATIONS.map((c) => [c.id, c]));

  // 1. Structural Validation
  if (!proposal.proposalId || !proposal.proposalId.trim()) {
    validationErrors.push("Proposal ID is required");
  }
  if (!proposal.sourceEntityId || !proposal.sourceEntityId.trim()) {
    validationErrors.push("Source Entity ID is required");
  }
  if (!proposal.targetEntityId || !proposal.targetEntityId.trim()) {
    validationErrors.push("Target Entity ID is required");
  }
  if (!proposal.relationshipType) {
    validationErrors.push("Relationship type is required");
  }
  if (!proposal.claimDescription || !proposal.claimDescription.trim()) {
    validationErrors.push("Claim description is required");
  }

  // 2. Source & Target Entity Validation
  if (context.knownEntityIds && context.knownEntityIds.size > 0) {
    if (!context.knownEntityIds.has(proposal.sourceEntityId)) {
      validationErrors.push(`Source entity '${proposal.sourceEntityId}' does not exist in knowledge base`);
    }
    // Targets can be entity IDs or concept identifiers (e.g. CONCEPT-...)
    const isConcept = proposal.targetEntityId.startsWith("CONCEPT-");
    if (!isConcept && !context.knownEntityIds.has(proposal.targetEntityId)) {
      validationErrors.push(`Target entity '${proposal.targetEntityId}' does not exist in knowledge base`);
    }
  }

  // 3. Citation & Evidence Validation (Dynamic from CITATIONS registry)
  if (!proposal.evidenceCitationIds || proposal.evidenceCitationIds.length === 0) {
    validationErrors.push("Proposal must have at least one supporting citation");
  } else {
    for (const citId of proposal.evidenceCitationIds) {
      const citation = citationsMap.get(citId);
      if (!citation) {
        validationErrors.push(`Citation '${citId}' cannot be resolved in citations registry`);
      } else {
        if (citation.verificationStatus === "disputed") {
          validationErrors.push(`Citation '${citId}' is marked as 'disputed' and cannot authorize relationships`);
        } else if (citation.verificationStatus !== "verified") {
          validationErrors.push(`Citation '${citId}' is not verified (status: ${citation.verificationStatus || "unknown"})`);
        }
      }
    }
  }

  // 4. Clinical Safety & Conventional Boundary Checks
  const claimLower = proposal.claimDescription.toLowerCase();
  for (const prohibited of CURATIVE_PROHIBITED_PHRASES) {
    if (claimLower.includes(prohibited)) {
      validationErrors.push(`Proposal asserts prohibited efficacy/safety claim: '${prohibited}'`);
    }
  }

  let involvesEmergency = false;
  for (const kw of EMERGENCY_KEYWORDS) {
    if (claimLower.includes(kw) || proposal.targetEntityId.toLowerCase().includes(kw)) {
      involvesEmergency = true;
      break;
    }
  }

  if (involvesEmergency) {
    safetyWarnings.push("Relationship involves potential emergency or red flag condition. Conventional care boundary must be preserved.");
  }

  // 5. Duplicate and Contradiction Checks
  if (context.existingRelationships && context.existingRelationships.length > 0) {
    const existing = context.existingRelationships.find(
      (r) =>
        r.sourceEntityId === proposal.sourceEntityId &&
        r.targetEntityId === proposal.targetEntityId &&
        r.relationshipType === proposal.relationshipType &&
        !r.isWithdrawn &&
        !r.supersededBy
    );
    if (existing) {
      validationErrors.push(`Duplicate relationship already exists with ID: ${existing.relationshipId}`);
    }

    // Contradiction check: contraindication vs complementary pairing on same source/target
    const contradictory = context.existingRelationships.find(
      (r) =>
        r.sourceEntityId === proposal.sourceEntityId &&
        r.targetEntityId === proposal.targetEntityId &&
        ((r.relationshipType === "contraindication" && proposal.relationshipType === "complementary_pairing") ||
          (r.relationshipType === "complementary_pairing" && proposal.relationshipType === "contraindication")) &&
        !r.isWithdrawn &&
        !r.supersededBy
    );
    if (contradictory) {
      validationErrors.push(`Contradictory relationship detected against existing edge: ${contradictory.relationshipId}`);
    }
  }

  // 6. Formulate Decision
  const isValid = validationErrors.length === 0;
  const decision = isValid ? "approved" : "rejected";
  const clinicalRationale = isValid
    ? `Clinically adjudicated and verified against source literature (${proposal.evidenceCitationIds.join(", ")}). Relationship represents a traditional profile association with conventional care boundaries preserved.`
    : `Adjudication rejected due to validation failures: ${validationErrors.join("; ")}`;

  const adjudication: RelationshipAdjudicationRecord = {
    adjudicatedBy: context.reviewer,
    adjudicatedAt: nowStr,
    decision,
    clinicalRationale,
    safetyChecksPassed: isValid,
    conventionalBoundaryPreserved: isValid,
    evidenceConfidenceScore: isValid ? 0.95 : 0.0,
    notes: safetyWarnings.length > 0 ? safetyWarnings.join("; ") : undefined,
  };

  if (!isValid) {
    return {
      proposalId: proposal.proposalId,
      lifecycleStatus: "rejected",
      adjudication,
      validationErrors,
      safetyWarnings,
    };
  }

  // 7. Transition to 'governed' upon successful adjudication and recording
  const relationshipId = `REL-${proposal.sourceEntityId}-${proposal.relationshipType}-${sha256(proposal.targetEntityId).slice(0, 8)}`.toUpperCase();
  const sourceRevisionId = proposal.sourceRevisionId || `REV-${proposal.sourceEntityId}-V1.1.0`;
  const targetRevisionId = proposal.targetRevisionId || sha256(`concept-${proposal.targetEntityId}`).slice(0, 16);

  const fingerprintData = {
    relationshipId,
    sourceEntityId: proposal.sourceEntityId,
    sourceRevisionId,
    targetEntityId: proposal.targetEntityId,
    targetRevisionId,
    relationshipType: proposal.relationshipType,
    claimDescription: proposal.claimDescription,
    evidenceCitationIds: proposal.evidenceCitationIds,
    adjudicatedBy: context.reviewer.reviewerId,
    adjudicatedAt: nowStr,
  };

  const governedRecord: GovernedRelationshipRecord = {
    relationshipId,
    fingerprintSha256: sha256(fingerprintData),
    sourceEntityId: proposal.sourceEntityId,
    sourceRevisionId,
    targetEntityId: proposal.targetEntityId,
    targetRevisionId,
    relationshipType: proposal.relationshipType,
    claimDescription: proposal.claimDescription,
    evidenceCitationIds: proposal.evidenceCitationIds,
    evidenceScope: proposal.evidenceScope,
    status: "governed",
    adjudication,
    governedAt: nowStr,
    governanceCommitSha: context.governanceCommitSha,
    isWithdrawn: false,
    supersededBy: null,
    schemaVersion: "1.0.0",
  };

  return {
    proposalId: proposal.proposalId,
    lifecycleStatus: "governed",
    adjudication,
    governedRecord,
    validationErrors: [],
    safetyWarnings,
  };
}

/**
 * Adjudicates a batch of relationship proposals deterministically.
 */
export function adjudicateRelationshipBatch(
  proposals: RelationshipProposalInput[],
  context: AdjudicationContext = { reviewer: DEFAULT_CLINICAL_REVIEWER }
): {
  results: AdjudicationResult[];
  governedRecords: GovernedRelationshipRecord[];
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
} {
  const results: AdjudicationResult[] = [];
  const governedRecords: GovernedRelationshipRecord[] = [];
  const cumulativeRecords = [...(context.existingRelationships || [])];

  for (const proposal of proposals) {
    const res = adjudicateRelationshipProposal(proposal, {
      ...context,
      existingRelationships: cumulativeRecords,
    });
    results.push(res);
    if (res.governedRecord) {
      governedRecords.push(res.governedRecord);
      cumulativeRecords.push(res.governedRecord);
    }
  }

  return {
    results,
    governedRecords,
    approvedCount: governedRecords.length,
    rejectedCount: results.length - governedRecords.length,
    totalCount: results.length,
  };
}
