import type {
  KEP1CoverageDomain,
  KEP1EditorialAssignment,
  KEP1FlagshipSourceDossier,
  KEP1SourceDossierManifest,
  KEP1SourceRecord,
} from "./types";

const AS_OF_DATE = "2026-07-26";

const UNASSIGNED_EDITORIAL_TEAM: KEP1EditorialAssignment[] = [
  { role: "clinical-author", contributorId: null, status: "unassigned" },
  {
    role: "independent-clinical-reviewer",
    contributorId: null,
    status: "unassigned",
  },
  { role: "evidence-reviewer", contributorId: null, status: "unassigned" },
  { role: "rights-reviewer", contributorId: null, status: "unassigned" },
];

export const KEP1_SOURCES: KEP1SourceRecord[] = [
  {
    id: "SRC-KEP1-NICE-CG184",
    title:
      "Gastro-oesophageal reflux disease and dyspepsia in adults: investigation and management",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "National Institute for Health and Care Excellence",
    canonicalUrl: "https://www.nice.org.uk/guidance/cg184",
    editionOrVersion: "CG184; updated 2019; minor safety update 2024",
    accessedAt: AS_OF_DATE,
    sourceVersion: "CG184-2024",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "symptoms-and-differential",
      "red-flags-and-escalation",
      "diagnostic-interpretation",
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-NIDDK-GERD",
    title: "Acid Reflux (GER and GERD) in Adults",
    sourceType: "reference-standard",
    publisherOrCustodian:
      "National Institute of Diabetes and Digestive and Kidney Diseases",
    canonicalUrl:
      "https://www.niddk.nih.gov/health-information/digestive-diseases/acid-reflux-ger-gerd-adults",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "symptoms-and-differential",
      "red-flags-and-escalation",
      "diagnostic-interpretation",
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-NICE-CG57",
    title: "Atopic eczema in under 12s: diagnosis and management",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "National Institute for Health and Care Excellence",
    canonicalUrl: "https://www.nice.org.uk/guidance/cg57",
    editionOrVersion: "CG57; updated 2025",
    accessedAt: AS_OF_DATE,
    sourceVersion: "CG57-2025",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "symptoms-and-differential",
      "red-flags-and-escalation",
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-MEDLINE-RASH",
    title: "Rash Evaluation",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl: "https://medlineplus.gov/lab-tests/rash-evaluation/",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "symptoms-and-differential",
      "red-flags-and-escalation",
      "diagnostic-interpretation",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-MEDLINE-CBC",
    title: "Complete Blood Count (CBC)",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl:
      "https://medlineplus.gov/lab-tests/complete-blood-count-cbc/",
    editionOrVersion: "updated 2024-10-15",
    accessedAt: AS_OF_DATE,
    sourceVersion: "2024-10-15",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "diagnostic-interpretation",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-MEDLINE-TSH",
    title: "TSH (Thyroid-stimulating hormone) Test",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl:
      "https://medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "definition-and-scope",
      "diagnostic-interpretation",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-NICE-NG145",
    title: "Thyroid disease: assessment and management",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "National Institute for Health and Care Excellence",
    canonicalUrl: "https://www.nice.org.uk/guidance/ng145",
    editionOrVersion: "NG145; updated 2023; reviewed 2025",
    accessedAt: AS_OF_DATE,
    sourceVersion: "NG145-2025-review",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "diagnostic-interpretation",
      "red-flags-and-escalation",
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-NCCIH-HOMEOPATHY",
    title: "Homeopathy: What You Need To Know",
    sourceType: "reference-standard",
    publisherOrCustodian:
      "National Center for Complementary and Integrative Health",
    canonicalUrl: "https://www.nccih.nih.gov/health/homeopathy",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "regulatory-and-product-safety",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-FDA-HOMEOPATHY",
    title: "Homeopathic Products",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. Food and Drug Administration",
    canonicalUrl:
      "https://www.fda.gov/drugs/information-drug-class/homeopathic-products",
    editionOrVersion: "includes 2022 final enforcement guidance",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: [
      "regulatory-and-product-safety",
      "red-flags-and-escalation",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP1-KENT-1905",
    title: "Lectures on Homoeopathic Materia Medica",
    sourceType: "classical-homeopathic-literature",
    publisherOrCustodian: "Internet Archive",
    canonicalUrl: "https://archive.org/details/lecturesonhomoeo00kent",
    editionOrVersion: "1905 edition",
    accessedAt: AS_OF_DATE,
    sourceVersion: "james-tyler-kent-v1",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "public-domain",
      evidenceLocation: "src/features/materia-medica/data/registry.ts",
      permitsExtraction: true,
      permitsDerivedData: true,
      permitsPublicDisplay: true,
    },
    ingestionStatus: "licence-verified",
    usePolicy: "governed-extraction",
    coverageDomains: ["traditional-source-description"],
  },
  {
    id: "SRC-KEP1-BOERICKE-1901",
    title: "Pocket Manual of Homoeopathic Materia Medica with Repertory",
    sourceType: "classical-homeopathic-literature",
    publisherOrCustodian: "Internet Archive",
    canonicalUrl: "https://archive.org/details/pocketmanualofho00boer",
    editionOrVersion: "1901 edition",
    accessedAt: AS_OF_DATE,
    sourceVersion: "william-boericke-v1",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "public-domain",
      evidenceLocation: "src/features/materia-medica/data/registry.ts",
      permitsExtraction: true,
      permitsDerivedData: true,
      permitsPublicDisplay: true,
    },
    ingestionStatus: "licence-verified",
    usePolicy: "governed-extraction",
    coverageDomains: ["traditional-source-description"],
  },
];

const GENERAL_PROHIBITED_CLAIMS = [
  "guaranteed diagnosis",
  "guaranteed cure",
  "replace urgent or conventional care",
  "patient-specific treatment recommendation",
  "potency or dosing instruction",
];

const CLINICAL_DOMAINS: KEP1CoverageDomain[] = [
  "definition-and-scope",
  "symptoms-and-differential",
  "red-flags-and-escalation",
  "diagnostic-interpretation",
  "conventional-care",
  "evidence-limitations",
];

const LAB_DOMAINS: KEP1CoverageDomain[] = [
  "definition-and-scope",
  "diagnostic-interpretation",
  "evidence-limitations",
];

const REMEDY_DOMAINS: KEP1CoverageDomain[] = [
  "traditional-source-description",
  "regulatory-and-product-safety",
  "evidence-limitations",
  "red-flags-and-escalation",
];

function dossier(input: {
  entityId: string;
  entityType: KEP1FlagshipSourceDossier["entityType"];
  title: string;
  sourceIds: string[];
  domains: KEP1CoverageDomain[];
}): KEP1FlagshipSourceDossier {
  return {
    schemaVersion: "1.0.0",
    dossierId: `KEP1-DOSSIER-${input.entityId}`,
    entityId: input.entityId,
    entityType: input.entityType,
    title: input.title,
    asOfDate: AS_OF_DATE,
    status: "sources-registered-review-blocked",
    sourceIds: input.sourceIds,
    requiredCoverageDomains: input.domains,
    prohibitedClaimPatterns: [...GENERAL_PROHIBITED_CLAIMS],
    assignments: UNASSIGNED_EDITORIAL_TEAM.map((assignment) => ({
      ...assignment,
    })),
    evaluationQuestionTarget: 20,
    governedRelationshipTarget: { minimum: 5, maximum: 10 },
    stateBoundaries: {
      contentState: "planning-only",
      evidenceState: "unapproved",
      clinicalReviewState: "unassigned",
      publicationState: "unchanged",
      ragState: "inactive",
    },
  };
}

export const KEP1_DOSSIERS: KEP1FlagshipSourceDossier[] = [
  dossier({
    entityId: "D0001",
    entityType: "disease",
    title: "Gastroesophageal Reflux Disease (GERD)",
    sourceIds: ["SRC-KEP1-NICE-CG184", "SRC-KEP1-NIDDK-GERD"],
    domains: CLINICAL_DOMAINS,
  }),
  dossier({
    entityId: "D0002",
    entityType: "disease",
    title: "Eczema (Atopic Dermatitis)",
    sourceIds: ["SRC-KEP1-NICE-CG57", "SRC-KEP1-MEDLINE-RASH"],
    domains: CLINICAL_DOMAINS,
  }),
  dossier({
    entityId: "S0001",
    entityType: "symptom",
    title: "Heartburn",
    sourceIds: ["SRC-KEP1-NICE-CG184", "SRC-KEP1-NIDDK-GERD"],
    domains: CLINICAL_DOMAINS,
  }),
  dossier({
    entityId: "S0002",
    entityType: "symptom",
    title: "Skin Eruptions",
    sourceIds: ["SRC-KEP1-MEDLINE-RASH", "SRC-KEP1-NICE-CG57"],
    domains: CLINICAL_DOMAINS,
  }),
  dossier({
    entityId: "R0001",
    entityType: "remedy",
    title: "Sulphur",
    sourceIds: [
      "SRC-KEP1-KENT-1905",
      "SRC-KEP1-BOERICKE-1901",
      "SRC-KEP1-NCCIH-HOMEOPATHY",
      "SRC-KEP1-FDA-HOMEOPATHY",
    ],
    domains: REMEDY_DOMAINS,
  }),
  dossier({
    entityId: "R0002",
    entityType: "remedy",
    title: "Nux Vomica",
    sourceIds: [
      "SRC-KEP1-KENT-1905",
      "SRC-KEP1-BOERICKE-1901",
      "SRC-KEP1-NCCIH-HOMEOPATHY",
      "SRC-KEP1-FDA-HOMEOPATHY",
    ],
    domains: REMEDY_DOMAINS,
  }),
  dossier({
    entityId: "L0001",
    entityType: "lab-test",
    title: "Complete Blood Count (CBC)",
    sourceIds: ["SRC-KEP1-MEDLINE-CBC"],
    domains: LAB_DOMAINS,
  }),
  dossier({
    entityId: "L0002",
    entityType: "lab-test",
    title: "Thyroid Stimulating Hormone (TSH)",
    sourceIds: ["SRC-KEP1-MEDLINE-TSH", "SRC-KEP1-NICE-NG145"],
    domains: LAB_DOMAINS,
  }),
];

export function buildKEP1SourceDossierManifest(): KEP1SourceDossierManifest {
  const assignedRoles = KEP1_DOSSIERS.flatMap(
    (item) => item.assignments
  ).filter((assignment) => assignment.status === "assigned").length;
  const totalRoles = KEP1_DOSSIERS.reduce(
    (count, item) => count + item.assignments.length,
    0
  );

  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    asOfDate: AS_OF_DATE,
    status: "planning-review-required",
    sources: KEP1_SOURCES.map((source) => ({
      ...source,
      licence: { ...source.licence },
      coverageDomains: [...source.coverageDomains],
    })),
    dossiers: KEP1_DOSSIERS.map((item) => ({
      ...item,
      sourceIds: [...item.sourceIds],
      requiredCoverageDomains: [...item.requiredCoverageDomains],
      prohibitedClaimPatterns: [...item.prohibitedClaimPatterns],
      assignments: item.assignments.map((assignment) => ({ ...assignment })),
      governedRelationshipTarget: { ...item.governedRelationshipTarget },
      stateBoundaries: { ...item.stateBoundaries },
    })),
    summary: {
      sourceCount: KEP1_SOURCES.length,
      dossierCount: 8,
      assignedRoles,
      unassignedRoles: totalRoles - assignedRoles,
      productionRagEntities: 0,
      approvedEvidenceProfiles: 0,
      approvedClinicalReviews: 0,
    },
    invariants: {
      automaticAssignmentForbidden: true,
      automaticApprovalForbidden: true,
      citationOnlySourcesCannotBeExtracted: true,
      authorReviewerIdentitySeparationRequired: true,
      publicationFreezeRemainsActive: true,
    },
  };
}
