import { createHash } from "crypto";
import type {
  ClinicalGraphNodeType,
  ClinicalGraphRelationshipType,
} from "../graph/clinicalGraphTypes";
import { CITATIONS } from "../content/citations";
import { GerdDisease } from "../content/diseases/gerd";
import { HeartburnSymptom } from "../content/symptoms/heartburn";

export type GERDHeartburnEntityId = "D0001" | "S0001";

export interface FlagshipRelationshipProposal {
  proposalId: string;
  sourceEntityId: GERDHeartburnEntityId;
  sourceNodeType: "condition" | "symptom";
  targetId: string;
  targetNodeType: ClinicalGraphNodeType;
  relationshipType: ClinicalGraphRelationshipType;
  status: "draft";
  citationIds: string[];
  sourceRevision: string;
  passage: string;
  rationale: string;
  clinicalReviewRequired: boolean;
  publicationEligible: false;
  ragEligible: false;
}

export interface GERDHeartburnAuthorizationPacket {
  schemaVersion: "1.0.0";
  packageId: "KEP-M2-GERD-HEARTBURN";
  generatedAt: "2026-07-30";
  status: "final-authorization-pending";
  decisionOwnerRole: "program-owner";
  decisionLane: "owner-final-source-bound";
  entityRevisions: Array<{
    entityId: GERDHeartburnEntityId;
    version: "1.1.0";
    revisionHash: string;
    materialClaimCount: number;
    citationIds: string[];
    governedRelationshipProposalCount: number;
  }>;
  relationshipProposals: FlagshipRelationshipProposal[];
  sourceVerification: Array<{
    citationId: string;
    sourceIdentifier: string;
    verificationStatus: "verified";
  }>;
  invariants: {
    automaticApprovalForbidden: true;
    finalDecisionMustBeHuman: true;
    relationshipAcceptanceAutomatic: false;
    productionPublicationOnPackageBuild: false;
    productionRagActivation: false;
    frozenDomainMutationCount: 0;
  };
  releaseDecision: {
    requestedDecision: "authorize-pr";
    approved: false;
    approvedBy: null;
    approvedAt: null;
  };
  packageHash: string;
}

const SOURCE_IDS = ["CIT-0017", "CIT-0023", "CIT-0025", "CIT-0036"];

const REVISION_BY_ENTITY: Record<GERDHeartburnEntityId, string> = {
  D0001: GerdDisease.versionInfo.version,
  S0001: HeartburnSymptom.versionInfo.version,
};

function proposal(
  input: Omit<
    FlagshipRelationshipProposal,
    | "status"
    | "sourceRevision"
    | "publicationEligible"
    | "ragEligible"
  >
): FlagshipRelationshipProposal {
  return {
    ...input,
    status: "draft",
    sourceRevision: REVISION_BY_ENTITY[input.sourceEntityId],
    publicationEligible: false,
    ragEligible: false,
  };
}

export const GERD_HEARTBURN_RELATIONSHIP_PROPOSALS: FlagshipRelationshipProposal[] =
  [
    proposal({
      proposalId: "M2-GH-EDGE-001",
      sourceEntityId: "D0001",
      sourceNodeType: "condition",
      targetId: "S0001",
      targetNodeType: "symptom",
      relationshipType: "condition-associated-with-symptom",
      citationIds: ["CIT-0025", "CIT-0036"],
      passage: "D0001.content.symptoms",
      rationale:
        "Heartburn is a typical symptom associated with GERD; the edge does not by itself establish a diagnosis.",
      clinicalReviewRequired: true,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-002",
      sourceEntityId: "D0001",
      sourceNodeType: "condition",
      targetId: "CIT-0017",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0017"],
      passage: "D0001.content.diagnosis; D0001.content.conventionalManagement",
      rationale:
        "NICE CG184 supports the adult diagnostic and conventional-management passages.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-003",
      sourceEntityId: "D0001",
      sourceNodeType: "condition",
      targetId: "CIT-0025",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0025"],
      passage: "D0001.content.overview; D0001.content.lifestyleAdvice",
      rationale:
        "Official NIDDK information supports the patient-facing definition, symptoms, diagnosis, and lifestyle passages.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-004",
      sourceEntityId: "D0001",
      sourceNodeType: "condition",
      targetId: "CIT-0036",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0036"],
      passage: "D0001.content",
      rationale:
        "The current ACG guideline supports the adult GERD diagnostic and management framework.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-005",
      sourceEntityId: "D0001",
      sourceNodeType: "condition",
      targetId: "CIT-0023",
      targetNodeType: "publication",
      relationshipType: "references",
      citationIds: ["CIT-0023"],
      passage: "D0001.content.homeopathicApproach",
      rationale:
        "NCCIH is referenced only for evidence limitations, product safety, and the conventional-care boundary.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-007",
      sourceEntityId: "S0001",
      sourceNodeType: "symptom",
      targetId: "D0001",
      targetNodeType: "condition",
      relationshipType: "related-to",
      citationIds: ["CIT-0025", "CIT-0036"],
      passage: "S0001.content.clinicalMeaning",
      rationale:
        "Heartburn is commonly associated with GERD, while the loose relationship avoids asserting that the symptom alone diagnoses the condition.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-008",
      sourceEntityId: "S0001",
      sourceNodeType: "symptom",
      targetId: "CIT-0017",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0017"],
      passage: "S0001.content.differentialDiagnosis; S0001.content.redFlags",
      rationale:
        "NICE CG184 supports the adult reflux assessment and escalation context.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-009",
      sourceEntityId: "S0001",
      sourceNodeType: "symptom",
      targetId: "CIT-0025",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0025"],
      passage: "S0001.content.definition; S0001.content.lifestyleAdvice",
      rationale:
        "Official NIDDK information supports the symptom definition and patient self-care boundary.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-010",
      sourceEntityId: "S0001",
      sourceNodeType: "symptom",
      targetId: "CIT-0036",
      targetNodeType: "publication",
      relationshipType: "supported-by",
      citationIds: ["CIT-0036"],
      passage: "S0001.content",
      rationale:
        "The ACG guideline supports the symptom, differential, diagnostic, and management context.",
      clinicalReviewRequired: false,
    }),
    proposal({
      proposalId: "M2-GH-EDGE-011",
      sourceEntityId: "S0001",
      sourceNodeType: "symptom",
      targetId: "CIT-0023",
      targetNodeType: "publication",
      relationshipType: "references",
      citationIds: ["CIT-0023"],
      passage: "S0001.content.faqs[2]",
      rationale:
        "NCCIH is referenced only for the complementary-care evidence and safety boundary.",
      clinicalReviewRequired: false,
    }),
  ];

function stable(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stable).join(",")}]`;
  }
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => `${JSON.stringify(key)}:${stable(nested)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value: unknown): string {
  return createHash("sha256").update(stable(value)).digest("hex");
}

export function buildGERDHeartburnAuthorizationPacket(): GERDHeartburnAuthorizationPacket {
  const entities = [GerdDisease, HeartburnSymptom] as const;
  const sourceVerification = SOURCE_IDS.map((citationId) => {
    const citation = CITATIONS.find((candidate) => candidate.id === citationId);
    if (
      !citation?.sourceIdentifier ||
      citation.verificationStatus !== "verified"
    ) {
      throw new Error(`Unverified or unresolved source: ${citationId}`);
    }
    return {
      citationId,
      sourceIdentifier: citation.sourceIdentifier,
      verificationStatus: "verified" as const,
    };
  });

  const entityRevisions = entities.map((entity) => {
    const claimCitations = entity.content.claimCitations as Array<{
      citationIds: string[];
    }>;
    const relationshipCount = GERD_HEARTBURN_RELATIONSHIP_PROPOSALS.filter(
      (edge) => edge.sourceEntityId === entity.id
    ).length;

    return {
      entityId: entity.id as GERDHeartburnEntityId,
      version: entity.versionInfo.version as "1.1.0",
      revisionHash: sha256({
        entityId: entity.id,
        version: entity.versionInfo.version,
        summary: entity.summary,
        content: entity.content,
        evidenceProfile: entity.evidenceProfile,
      }),
      materialClaimCount: claimCitations.length,
      citationIds: [...new Set(claimCitations.flatMap((claim) => claim.citationIds))].sort(),
      governedRelationshipProposalCount: relationshipCount,
    };
  });

  const packetWithoutHash = {
    schemaVersion: "1.0.0" as const,
    packageId: "KEP-M2-GERD-HEARTBURN" as const,
    generatedAt: "2026-07-30" as const,
    status: "final-authorization-pending" as const,
    decisionOwnerRole: "program-owner" as const,
    decisionLane: "owner-final-source-bound" as const,
    entityRevisions,
    relationshipProposals: GERD_HEARTBURN_RELATIONSHIP_PROPOSALS,
    sourceVerification,
    invariants: {
      automaticApprovalForbidden: true as const,
      finalDecisionMustBeHuman: true as const,
      relationshipAcceptanceAutomatic: false as const,
      productionPublicationOnPackageBuild: false as const,
      productionRagActivation: false as const,
      frozenDomainMutationCount: 0 as const,
    },
    releaseDecision: {
      requestedDecision: "authorize-pr" as const,
      approved: false as const,
      approvedBy: null,
      approvedAt: null,
    },
  };

  return {
    ...packetWithoutHash,
    packageHash: sha256(packetWithoutHash),
  };
}
