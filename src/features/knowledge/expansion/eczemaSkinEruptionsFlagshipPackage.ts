import { createHash } from "crypto";
import type {
  ClinicalGraphNodeType,
  ClinicalGraphRelationshipType,
} from "../graph/clinicalGraphTypes";
import { CITATIONS } from "../content/citations";
import { EczemaDisease } from "../content/diseases/eczema";
import { SkinEruptionsSymptom } from "../content/symptoms/skin-eruptions";

export type EczemaSkinEruptionsEntityId = "D0002" | "S0002";

export interface FlagshipRelationshipProposal {
  proposalId: string;
  sourceEntityId: EczemaSkinEruptionsEntityId;
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

export interface EczemaSkinEruptionsAuthorizationPacket {
  schemaVersion: "1.0.0";
  packageId: "KEP-M2-ECZEMA-SKIN-ERUPTIONS";
  generatedAt: "2026-07-30";
  status: "authorized";
  decisionOwnerRole: "program-owner";
  decisionLane: "owner-final-source-bound";
  entityRevisions: Array<{
    entityId: EczemaSkinEruptionsEntityId;
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
    verificationStatus: "verified" | "internal-only";
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
    approved: true;
    approvedBy: "Dr. Narayan Jethwani";
    approvedAt: "2026-07-30";
    decisionReference: "PR-m2-eczema-skin-eruptions-authorization";
  };
  packageHash: string;
}

const SOURCE_IDS = ["CIT-0019", "CIT-0022", "CIT-0023", "CIT-0024"];

const REVISION_BY_ENTITY: Record<EczemaSkinEruptionsEntityId, string> = {
  D0002: EczemaDisease.versionInfo.version,
  S0002: SkinEruptionsSymptom.versionInfo.version,
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

export const ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS: FlagshipRelationshipProposal[] = [
  proposal({
    proposalId: "M2-ESE-EDGE-001",
    sourceEntityId: "D0002",
    sourceNodeType: "condition",
    targetId: "S0002",
    targetNodeType: "symptom",
    relationshipType: "condition-associated-with-symptom",
    citationIds: ["CIT-0019"],
    passage: "D0002.content.symptoms",
    rationale:
      "Clinical guideline consensus identifies skin eruptions and pruritus as core clinical manifestations of eczema.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-002",
    sourceEntityId: "D0002",
    sourceNodeType: "condition",
    targetId: "CIT-0019",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    citationIds: ["CIT-0019"],
    passage: "D0002.content.definition; D0002.content.conventionalManagement",
    rationale:
      "NICE CG57 supports the childhood and adult atopic eczema diagnostic and management framework.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-003",
    sourceEntityId: "D0002",
    sourceNodeType: "condition",
    targetId: "CIT-0023",
    targetNodeType: "publication",
    relationshipType: "references",
    citationIds: ["CIT-0023"],
    passage: "D0002.content.homeopathicApproach",
    rationale:
      "NCCIH is referenced only for evidence limitations, product safety, and conventional-care boundaries.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-004",
    sourceEntityId: "D0002",
    sourceNodeType: "condition",
    targetId: "R0001", // Sulphur
    targetNodeType: "remedy",
    relationshipType: "associated-with",
    citationIds: ["CIT-0023"],
    passage: "D0002.content.homeopathicApproach",
    rationale:
      "Traditional homeopathic association requiring evidence-limitation and non-replacement disclosures.",
    clinicalReviewRequired: true,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-005",
    sourceEntityId: "D0002",
    sourceNodeType: "condition",
    targetId: "D0005", // Allergic Rhinitis
    targetNodeType: "condition",
    relationshipType: "associated-with",
    citationIds: ["CIT-0019"],
    passage: "D0002.content.riskFactors",
    rationale:
      "Atopic march connects eczema with allergic rhinitis and asthma.",
    clinicalReviewRequired: true,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-006",
    sourceEntityId: "S0002",
    sourceNodeType: "symptom",
    targetId: "D0002",
    targetNodeType: "condition",
    relationshipType: "related-to",
    citationIds: ["CIT-0019"],
    passage: "S0002.content.commonCauses",
    rationale:
      "Pruritic skin eruptions are commonly associated with atopic dermatitis.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-007",
    sourceEntityId: "S0002",
    sourceNodeType: "symptom",
    targetId: "CIT-0019",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    citationIds: ["CIT-0019"],
    passage: "S0002.content.definition; S0002.content.redFlags",
    rationale:
      "NICE CG57 supports the dermatosis triage and red flag emergency boundaries.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-008",
    sourceEntityId: "S0002",
    sourceNodeType: "symptom",
    targetId: "CIT-0023",
    targetNodeType: "publication",
    relationshipType: "references",
    citationIds: ["CIT-0023"],
    passage: "S0002.content.faqs",
    rationale:
      "NCCIH is referenced for safety and conventional care boundaries regarding skin eruptions.",
    clinicalReviewRequired: false,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-009",
    sourceEntityId: "S0002",
    sourceNodeType: "symptom",
    targetId: "R0001", // Sulphur
    targetNodeType: "remedy",
    relationshipType: "associated-with",
    citationIds: ["CIT-0023"],
    passage: "S0002.content.faqs",
    rationale:
      "Traditional symptom-remedy mapping with mandatory NCCIH evidence disclosures.",
    clinicalReviewRequired: true,
  }),
  proposal({
    proposalId: "M2-ESE-EDGE-010",
    sourceEntityId: "S0002",
    sourceNodeType: "symptom",
    targetId: "CIT-0024",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    citationIds: ["CIT-0024"],
    passage: "S0002.content.lifestyleAdvice",
    rationale:
      "FDA guidance supports product safety and self-care boundaries for skin applications.",
    clinicalReviewRequired: false,
  }),
];

export function buildEczemaSkinEruptionsAuthorizationPacket(): EczemaSkinEruptionsAuthorizationPacket {
  const entities: Array<{
    entityId: EczemaSkinEruptionsEntityId;
    version: "1.1.0";
    revisionHash: string;
    materialClaimCount: number;
    citationIds: string[];
    governedRelationshipProposalCount: number;
  }> = [
    {
      entityId: "D0002",
      version: "1.1.0",
      revisionHash: createHash("sha256")
        .update(JSON.stringify(EczemaDisease))
        .digest("hex"),
      materialClaimCount: EczemaDisease.content.claimCitations?.length || 0,
      citationIds: EczemaDisease.content.references as string[],
      governedRelationshipProposalCount: ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS.filter(
        (p) => p.sourceEntityId === "D0002"
      ).length,
    },
    {
      entityId: "S0002",
      version: "1.1.0",
      revisionHash: createHash("sha256")
        .update(JSON.stringify(SkinEruptionsSymptom))
        .digest("hex"),
      materialClaimCount: SkinEruptionsSymptom.content.claimCitations?.length || 0,
      citationIds: SkinEruptionsSymptom.content.references as string[],
      governedRelationshipProposalCount: ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS.filter(
        (p) => p.sourceEntityId === "S0002"
      ).length,
    },
  ];

  const citationById = new Map(CITATIONS.map((c) => [c.id, c]));
  const sourceVerification = SOURCE_IDS.map((citationId) => {
    const citation = citationById.get(citationId);
    if (!citation) {
      throw new Error(`MISSING_AUTHORIZATION_CITATION_${citationId}`);
    }
    return {
      citationId,
      sourceIdentifier: citation.sourceIdentifier || citation.id,
      verificationStatus: (citation.verificationStatus === "verified"
        ? "verified"
        : "internal-only") as "verified" | "internal-only",
    };
  });

  const payload = {
    schemaVersion: "1.0.0" as const,
    packageId: "KEP-M2-ECZEMA-SKIN-ERUPTIONS" as const,
    generatedAt: "2026-07-30" as const,
    status: "authorized" as const,
    decisionOwnerRole: "program-owner" as const,
    decisionLane: "owner-final-source-bound" as const,
    entityRevisions: entities,
    relationshipProposals: ECZEMA_SKIN_ERUPTIONS_RELATIONSHIP_PROPOSALS,
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
      approved: true as const,
      approvedBy: "Dr. Narayan Jethwani" as const,
      approvedAt: "2026-07-30" as const,
      decisionReference: "PR-m2-eczema-skin-eruptions-authorization" as const,
    },
  };

  const packageHash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  return {
    ...payload,
    packageHash,
  };
}
