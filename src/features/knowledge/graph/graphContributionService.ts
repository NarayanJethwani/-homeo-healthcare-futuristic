import { ClinicalGraphRelationshipType } from "./clinicalGraphTypes";
import { EvidenceStrength, SourceQuality } from "../types";
import { RELATIONSHIP_REGISTRY } from "./relationshipRegistry";

export interface GraphContributionInput {
  relationshipType: ClinicalGraphRelationshipType;
  pathLength: number;
  edgeConfidence: number; // 0.0 to 1.0
  edgeEvidenceStrength?: EvidenceStrength | "expert-opinion" | "unknown";
  edgeSourceQuality?: SourceQuality;
  provenanceCount: number;
  seedRelevanceScore: number;
}

export interface GraphContributionResult {
  score: number;
  methodologyVersion: string;
  components: {
    relationshipWeight: number;
    pathLengthPenalty: number;
    evidenceAdjustment: number;
    provenanceAdjustment: number;
    rawContribution: number;
  };
  warnings: string[];
}

/**
 * Calculates a pure, deterministic graph retrieval boost contribution.
 */
export function calculateGraphContribution(input: GraphContributionInput): GraphContributionResult {
  const warnings: string[] = [];
  
  // Resolve relationship configuration weight
  const regDef = RELATIONSHIP_REGISTRY[input.relationshipType];
  const relationshipWeight = regDef ? regDef.retrievalWeight : 0.2;

  // Path length penalty: 0.85^(depth - 1)
  // For depth 1: penalty = 1.0
  // For depth 2: penalty = 0.85
  // For depth 3: penalty = 0.7225
  const pathLengthPenalty = Math.pow(0.85, Math.max(0, input.pathLength - 1));

  // Evidence strength boost/penalty modifier
  let evidenceAdjustment = 0.5; // Neutral baseline
  if (input.edgeEvidenceStrength === "very-high" || input.edgeEvidenceStrength === "high") {
    evidenceAdjustment = 1.0;
  } else if (input.edgeEvidenceStrength === "moderate") {
    evidenceAdjustment = 0.8;
  } else if (input.edgeEvidenceStrength === "expert-opinion") {
    evidenceAdjustment = 0.6;
  } else if (input.edgeEvidenceStrength === "low") {
    evidenceAdjustment = 0.4;
  } else if (input.edgeEvidenceStrength === "unknown") {
    evidenceAdjustment = 0.3;
  } else if (input.edgeEvidenceStrength === "very-low") {
    evidenceAdjustment = 0.2;
  }

  // Source quality modifier
  let provenanceAdjustment = 0.5;
  if (input.edgeSourceQuality === "authoritative" || input.edgeSourceQuality === "peer-reviewed") {
    provenanceAdjustment = 1.0;
  } else if (input.edgeSourceQuality === "primary") {
    provenanceAdjustment = 0.85;
  } else if (input.edgeSourceQuality === "secondary") {
    provenanceAdjustment = 0.6;
  } else if (input.edgeSourceQuality === "unverified") {
    provenanceAdjustment = 0.1;
    warnings.push("Relationship is supported only by unverified sources.");
  }

  // Compute raw contribution
  // Formula: seedScore * relationshipWeight * edgeConfidence * pathLengthPenalty * evidenceAdjustment * provenanceAdjustment
  const rawContribution = 
    input.seedRelevanceScore * 
    relationshipWeight * 
    input.edgeConfidence * 
    pathLengthPenalty * 
    evidenceAdjustment * 
    provenanceAdjustment;

  // Bounded cap (strictly limited to 0.05 max per result)
  const boundedScore = Math.max(0, Math.min(0.05, rawContribution));

  return {
    score: boundedScore,
    methodologyVersion: "graph-contribution-v1",
    components: {
      relationshipWeight,
      pathLengthPenalty,
      evidenceAdjustment,
      provenanceAdjustment,
      rawContribution
    },
    warnings
  };
}
