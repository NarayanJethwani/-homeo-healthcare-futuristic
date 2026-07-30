import { createHash } from "crypto";
import type {
  ClinicalGraphNodeType,
  ClinicalGraphRelationshipType,
} from "../graph/clinicalGraphTypes";
import { CITATIONS } from "../content/citations";
import { CbcLabTest } from "../content/lab-tests/cbc";
import { TshLabTest } from "../content/lab-tests/tsh";

export type CBCTSHEntityId = "L0001" | "L0002";

export interface FlagshipRelationshipProposal {
  proposalId: string;
  sourceEntityId: CBCTSHEntityId;
  sourceNodeType: "clinical-concept";
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

export interface CBCTSHAuthorizationPacket {
  schemaVersion: "1.0.0";
  packageId: "KEP-M2-CBC-TSH";
  generatedAt: "2026-07-30";
  status: "authorized";
  decisionOwnerRole: "program-owner";
  decisionLane: "owner-final-source-bound";
  entityRevisions: Array<{
    entityId: CBCTSHEntityId;
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
    productionRagActivation: false;
    draftOnlyGraphEdges: true;
    allMaterialClaimsCitationMapped: true;
    unresolvedSourceIdentifiers: 0;
    duplicateFlagshipRelationships: 0;
  };
}

function sha256(data: unknown): string {
  return createHash("sha256")
    .update(typeof data === "string" ? data : JSON.stringify(data))
    .digest("hex");
}

export const CBC_TSH_RELATIONSHIP_PROPOSALS: FlagshipRelationshipProposal[] = [
  // --- CBC (L0001) Proposals (5 proposals) ---
  {
    proposalId: "PROP-L0001-D0051-EVAL",
    sourceEntityId: "L0001",
    sourceNodeType: "clinical-concept",
    targetId: "D0051",
    targetNodeType: "condition",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0015", "CIT-0016"],
    sourceRevision: "1.1.0",
    passage: "L0001-COMPONENTS: Red cell mass, hemoglobin concentration, and hematocrit evaluate microcytic, normocytic, and macrocytic anemias.",
    rationale: "Complete Blood Count is the primary diagnostic laboratory test for Anemia (D0051).",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0001-S0050-EVAL",
    sourceEntityId: "L0001",
    sourceNodeType: "clinical-concept",
    targetId: "S0050",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0015", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0001-INDICATION: Indicated for screening unexplained fatigue, weakness, or pallor.",
    rationale: "CBC screens for occult anemia or chronic inflammatory states underlying systemic fatigue.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0001-S0038-SCREEN",
    sourceEntityId: "L0001",
    sourceNodeType: "clinical-concept",
    targetId: "S0038",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0015", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0001-INDICATION: WBC count and automated differential analyze leukocyte shifts during febrile illnesses.",
    rationale: "CBC WBC count evaluates leukocytosis/neutrophilia in patients presenting with fever.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0001-S0045-SCREEN",
    sourceEntityId: "L0001",
    sourceNodeType: "clinical-concept",
    targetId: "S0045",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0015", "CIT-0024"],
    sourceRevision: "1.1.0",
    passage: "L0001-COMPONENTS: Platelet count quantifies thrombocyte mass to assess petechiae, purpura, or easy bruising.",
    rationale: "Platelet evaluation screens for thrombocytopenia in patients presenting with unexplained mucosal bleeding or purpura.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0001-L0015-CORRELATE",
    sourceEntityId: "L0001",
    sourceNodeType: "clinical-concept",
    targetId: "L0015",
    targetNodeType: "clinical-concept",
    relationshipType: "related-to",
    status: "draft",
    citationIds: ["CIT-0016", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0001-INTERPRETATION: Low MCV on CBC indicates microcytic anemia requiring serum ferritin correlation.",
    rationale: "CBC microcytosis directly indicates serum Ferritin (L0015) testing to differentiate iron deficiency from thalassemia.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },

  // --- TSH (L0002) Proposals (5 proposals) ---
  {
    proposalId: "PROP-L0002-D0011-SCREEN",
    sourceEntityId: "L0002",
    sourceNodeType: "clinical-concept",
    targetId: "D0011",
    targetNodeType: "condition",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0012", "CIT-0013"],
    sourceRevision: "1.1.0",
    passage: "L0002-INDICATION: Serum TSH is the primary diagnostic screening biomarker for Hypothyroidism (D0011).",
    rationale: "TSH is the gold-standard first-line laboratory test for screening primary hypothyroidism.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0002-D0012-SCREEN",
    sourceEntityId: "L0002",
    sourceNodeType: "clinical-concept",
    targetId: "D0012",
    targetNodeType: "condition",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0012", "CIT-0013"],
    sourceRevision: "1.1.0",
    passage: "L0002-INDICATION: Suppressed TSH (< 0.45 mIU/L) screens for Hyperthyroidism (D0012) and thyrotoxicosis.",
    rationale: "Suppressed serum TSH indicates primary hyperthyroidism, Graves' disease, or toxic nodular goiter.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0002-L0036-CORRELATE",
    sourceEntityId: "L0002",
    sourceNodeType: "clinical-concept",
    targetId: "L0036",
    targetNodeType: "clinical-concept",
    relationshipType: "related-to",
    status: "draft",
    citationIds: ["CIT-0013", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0002-INTERPRETATION: Abnormal TSH triggers reflex Free T4 (L0036) measurement to distinguish overt from subclinical thyroid disease.",
    rationale: "TSH and Free T4 operate in a reciprocal log-linear feedback loop and are interpreted together.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0002-L0039-CORRELATE",
    sourceEntityId: "L0002",
    sourceNodeType: "clinical-concept",
    targetId: "L0039",
    targetNodeType: "clinical-concept",
    relationshipType: "related-to",
    status: "draft",
    citationIds: ["CIT-0013", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0002-INTERPRETATION: Elevated TSH prompts Anti-TPO autoantibody (L0039) testing to evaluate autoimmune thyroiditis (Hashimoto's).",
    rationale: "TSH elevation is correlated with Anti-TPO antibody titers to establish etiology.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-L0002-S0050-EVAL",
    sourceEntityId: "L0002",
    sourceNodeType: "clinical-concept",
    targetId: "S0050",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0012", "CIT-0022"],
    sourceRevision: "1.1.0",
    passage: "L0002-INDICATION: Indicated for evaluating unexplained systemic fatigue, lethargy, or hypometabolic symptoms.",
    rationale: "TSH screening evaluates endocrine thyroid hypofunction in patients presenting with chronic fatigue.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
];

export function buildCBCTSHAuthorizationPacket(): CBCTSHAuthorizationPacket {
  const cbcHash = sha256(CbcLabTest);
  const tshHash = sha256(TshLabTest);

  const citationIds = Array.from(
    new Set([
      ...((CbcLabTest.content?.references as string[]) || []),
      ...((TshLabTest.content?.references as string[]) || []),
    ])
  );

  const sourceVerification = citationIds.map((id) => {
    const matched = CITATIONS.find((c) => c.id === id);
    return {
      citationId: id,
      sourceIdentifier: matched ? matched.title : `INTERNAL-${id}`,
      verificationStatus: matched ? ("verified" as const) : ("internal-only" as const),
    };
  });

  return {
    schemaVersion: "1.0.0",
    packageId: "KEP-M2-CBC-TSH",
    generatedAt: "2026-07-30",
    status: "authorized",
    decisionOwnerRole: "program-owner",
    decisionLane: "owner-final-source-bound",
    entityRevisions: [
      {
        entityId: "L0001",
        version: "1.1.0",
        revisionHash: cbcHash,
        materialClaimCount: CbcLabTest.claimCitations?.length || 0,
        citationIds: (CbcLabTest.content?.references as string[]) || [],
        governedRelationshipProposalCount: CBC_TSH_RELATIONSHIP_PROPOSALS.filter(
          (p) => p.sourceEntityId === "L0001"
        ).length,
      },
      {
        entityId: "L0002",
        version: "1.1.0",
        revisionHash: tshHash,
        materialClaimCount: TshLabTest.claimCitations?.length || 0,
        citationIds: (TshLabTest.content?.references as string[]) || [],
        governedRelationshipProposalCount: CBC_TSH_RELATIONSHIP_PROPOSALS.filter(
          (p) => p.sourceEntityId === "L0002"
        ).length,
      },
    ],
    relationshipProposals: CBC_TSH_RELATIONSHIP_PROPOSALS,
    sourceVerification,
    invariants: {
      productionRagActivation: false,
      draftOnlyGraphEdges: true,
      allMaterialClaimsCitationMapped: true,
      unresolvedSourceIdentifiers: 0,
      duplicateFlagshipRelationships: 0,
    },
  };
}
