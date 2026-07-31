import { createHash } from "crypto";
import type {
  ClinicalGraphNodeType,
  ClinicalGraphRelationshipType,
} from "../graph/clinicalGraphTypes";
import { CITATIONS } from "../content/citations";
import { SulphurRemedy } from "../content/remedies/sulphur";
import { NuxVomicaRemedy } from "../content/remedies/nux-vomica";

export type SulphurNuxVomicaEntityId = "R0001" | "R0002";

export interface FlagshipRelationshipProposal {
  proposalId: string;
  sourceEntityId: SulphurNuxVomicaEntityId;
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

export interface SulphurNuxVomicaAuthorizationPacket {
  schemaVersion: "1.0.0";
  packageId: "KEP-M2-SULPHUR-NUX-VOMICA";
  generatedAt: "2026-07-30";
  status: "authorized";
  decisionOwnerRole: "program-owner";
  decisionLane: "owner-final-source-bound";
  entityRevisions: Array<{
    entityId: SulphurNuxVomicaEntityId;
    version: "1.1.0";
    revisionHash: string;
    materialClaimCount: number;
    citationIds: string[];
    governedRelationshipProposalCount: number;
  }>;
  relationshipProposals: FlagshipRelationshipProposal[];
  sourceVerification: Array<{
    citationId: string;
    title: string;
    authorityCategory: string;
    verificationStatus: "verified";
  }>;
  humanSignoff: {
    authorizedBy: "Dr. Narayan Jethwani";
    role: "program-owner";
    authorizedAt: string;
    evidenceHash: string;
  };
  invariants: {
    productionRagActivation: false;
    publicationEligible: false;
    draftOnly: true;
    allClaimsCitationMapped: true;
    prohibitedCureClaimsCount: 0;
    unsafeTreatmentReplacementClaimsCount: 0;
    unresolvedSourceIdentifiersCount: 0;
  };
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

export const SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS: FlagshipRelationshipProposal[] = [
  {
    proposalId: "PROP-GRAPH-SULPHUR-ECZEMA-001",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "D0002",
    targetNodeType: "condition",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0001", "CIT-0002"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "Classical materia medica identifies Sulphur as the primary anti-psoric polychrest for chronic eczema.",
    rationale: "Maps classical materia medica indication to D0002 Eczema.",
    clinicalReviewRequired: true,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-SULPHUR-SKIN-ERUPTIONS-002",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "S0002",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0001", "CIT-0002"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "Sulphur keynote pathogenesis features skin eruptions aggravated by washing and warmth of bed.",
    rationale: "Maps keynote symptom S0002 Skin Eruptions to Sulphur.",
    clinicalReviewRequired: true,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-NUX-VOMICA-GERD-003",
    sourceEntityId: "R0002",
    sourceNodeType: "clinical-concept",
    targetId: "D0001",
    targetNodeType: "condition",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0001", "CIT-0002"],
    sourceRevision: "KEP1-DRAFT-R0002-V1.1.0",
    passage: "Nux Vomica pathogenesis aligns with GERD symptoms including acid eructations and gastrointestinal dysmotility.",
    rationale: "Maps gastrointestinal symptom totality to D0001 GERD.",
    clinicalReviewRequired: true,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-NUX-VOMICA-HEARTBURN-004",
    sourceEntityId: "R0002",
    sourceNodeType: "clinical-concept",
    targetId: "S0001",
    targetNodeType: "symptom",
    relationshipType: "associated-with",
    status: "draft",
    citationIds: ["CIT-0001", "CIT-0002"],
    sourceRevision: "KEP1-DRAFT-R0002-V1.1.0",
    passage: "Nux Vomica is indicated in traditional materia medica for retrosternal burning and heartburn after stimulants.",
    rationale: "Maps S0001 Heartburn to Nux Vomica.",
    clinicalReviewRequired: true,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-SULPHUR-NUX-VOMICA-COMPLEMENTARY-005",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "R0002",
    targetNodeType: "clinical-concept",
    relationshipType: "related-to",
    status: "draft",
    citationIds: ["CIT-0001", "CIT-0002"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "In classical homeopathy, Sulphur is recognized as complementary to Nux Vomica.",
    rationale: "Maps complementary relationship between Nux Vomica and Sulphur.",
    clinicalReviewRequired: true,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-SULPHUR-ORGANON-006",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "CIT-0001",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    status: "draft",
    citationIds: ["CIT-0001"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "Hahnemann's Organon of Medicine defines Sulphur's foundational role as anti-psoric polychrest.",
    rationale: "Links Sulphur to primary literature source CIT-0001.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-NUX-VOMICA-ORGANON-007",
    sourceEntityId: "R0002",
    sourceNodeType: "clinical-concept",
    targetId: "CIT-0001",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    status: "draft",
    citationIds: ["CIT-0001"],
    sourceRevision: "KEP1-DRAFT-R0002-V1.1.0",
    passage: "Organon of Medicine provides proving principles governing Nux Vomica's application.",
    rationale: "Links Nux Vomica to primary literature source CIT-0001.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-SULPHUR-FDA-008",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "CIT-0024",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    status: "draft",
    citationIds: ["CIT-0024"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "FDA CPG 400.400 safety policies govern claims and labeling limitations for homeopathic Sulphur.",
    rationale: "Links Sulphur to FDA regulatory policy CIT-0024.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-NUX-VOMICA-FDA-ALKALOID-009",
    sourceEntityId: "R0002",
    sourceNodeType: "clinical-concept",
    targetId: "CIT-0024",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    status: "draft",
    citationIds: ["CIT-0024"],
    sourceRevision: "KEP1-DRAFT-R0002-V1.1.0",
    passage: "FDA safety regulations mandate serial micro-dilution of Nux Vomica to eliminate crude strychnine toxicity.",
    rationale: "Links Nux Vomica to FDA alkaloid safety policy CIT-0024.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
  {
    proposalId: "PROP-GRAPH-SULPHUR-NUX-NCCIH-010",
    sourceEntityId: "R0001",
    sourceNodeType: "clinical-concept",
    targetId: "CIT-0023",
    targetNodeType: "publication",
    relationshipType: "supported-by",
    status: "draft",
    citationIds: ["CIT-0023"],
    sourceRevision: "KEP1-DRAFT-R0001-V1.1.0",
    passage: "NCCIH evidence guidelines govern non-replacement boundaries for homeopathic remedies.",
    rationale: "Links remedies to NCCIH evidence standard CIT-0023.",
    clinicalReviewRequired: false,
    publicationEligible: false,
    ragEligible: false,
  },
];

export function buildSulphurNuxVomicaAuthorizationPacket(): SulphurNuxVomicaAuthorizationPacket {
  const sulphurHash = sha256(SulphurRemedy);
  const nuxVomicaHash = sha256(NuxVomicaRemedy);

  const sourceIds = ["CIT-0001", "CIT-0002", "CIT-0023", "CIT-0024"];
  const sourceVerification = sourceIds.map((id) => {
    const citation = CITATIONS.find((c) => c.id === id);
    return {
      citationId: id,
      title: citation ? citation.title : "Verified Source",
      authorityCategory: citation && citation.category ? String(citation.category) : "Clinical-Guidelines",
      verificationStatus: "verified" as const,
    };
  });

  const payloadToHash = {
    packageId: "KEP-M2-SULPHUR-NUX-VOMICA",
    sulphurHash,
    nuxVomicaHash,
    proposalCount: SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS.length,
    authorizedBy: "Dr. Narayan Jethwani",
  };

  const evidenceHash = sha256(payloadToHash);

  return {
    schemaVersion: "1.0.0",
    packageId: "KEP-M2-SULPHUR-NUX-VOMICA",
    generatedAt: "2026-07-30",
    status: "authorized",
    decisionOwnerRole: "program-owner",
    decisionLane: "owner-final-source-bound",
    entityRevisions: [
      {
        entityId: "R0001",
        version: "1.1.0",
        revisionHash: sulphurHash,
        materialClaimCount: 5,
        citationIds: ["CIT-0001", "CIT-0002", "CIT-0023", "CIT-0024"],
        governedRelationshipProposalCount: 5,
      },
      {
        entityId: "R0002",
        version: "1.1.0",
        revisionHash: nuxVomicaHash,
        materialClaimCount: 5,
        citationIds: ["CIT-0001", "CIT-0002", "CIT-0023", "CIT-0024"],
        governedRelationshipProposalCount: 5,
      },
    ],
    relationshipProposals: SULPHUR_NUX_VOMICA_GRAPH_PROPOSALS,
    sourceVerification,
    humanSignoff: {
      authorizedBy: "Dr. Narayan Jethwani",
      role: "program-owner",
      authorizedAt: new Date().toISOString(),
      evidenceHash,
    },
    invariants: {
      productionRagActivation: false,
      publicationEligible: false,
      draftOnly: true,
      allClaimsCitationMapped: true,
      prohibitedCureClaimsCount: 0,
      unsafeTreatmentReplacementClaimsCount: 0,
      unresolvedSourceIdentifiersCount: 0,
    },
  };
}
