import { CITATIONS } from "../content/citations";
import type { ClaimType } from "../governance/types/governanceTypes";
import { evaluateClaimCitationStaging } from "./sourceIntegrity";
import type {
  KEP1ClaimEvidencePlan,
  KEP1CoverageDomain,
  KEP1EditorialAssignment,
  KEP1FlagshipSourceDossier,
  KEP1SourceRecord,
  KEP2PriorityDiseaseEvidenceManifest,
} from "./types";

const AS_OF_DATE = "2026-07-30";

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

const CLINICAL_DOMAINS: KEP1CoverageDomain[] = [
  "definition-and-scope",
  "symptoms-and-differential",
  "red-flags-and-escalation",
  "diagnostic-interpretation",
  "conventional-care",
  "evidence-limitations",
];

const GENERAL_PROHIBITED_CLAIMS = [
  "guaranteed diagnosis",
  "guaranteed cure",
  "replace urgent or conventional care",
  "patient-specific treatment recommendation",
  "potency or dosing instruction",
];

export const KEP2_PRIORITY_DISEASE_SOURCES: KEP1SourceRecord[] = [
  {
    id: "SRC-KEP2-NICE-NG136",
    citationId: "CIT-0030",
    title: "Hypertension in adults: diagnosis and management",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "National Institute for Health and Care Excellence",
    canonicalUrl: "https://www.nice.org.uk/guidance/ng136",
    editionOrVersion: "NG136; updated 2026-02-26",
    accessedAt: AS_OF_DATE,
    sourceVersion: "NG136-2026-02-26",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: CLINICAL_DOMAINS,
  },
  {
    id: "SRC-KEP2-WHO-HYPERTENSION-2021",
    citationId: "CIT-0031",
    title: "Guideline for the pharmacological treatment of hypertension in adults",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "World Health Organization",
    canonicalUrl: "https://www.who.int/publications/i/item/9789240033986",
    editionOrVersion: "ISBN 978-92-4-003398-6",
    accessedAt: AS_OF_DATE,
    sourceVersion: "WHO-HYPERTENSION-2021",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "verified",
      identifier: "CC BY-NC-SA 3.0 IGO",
      evidenceLocation:
        "https://www.who.int/publications/i/item/9789240033986",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: ["conventional-care", "evidence-limitations"],
  },
  {
    id: "SRC-KEP2-NICE-NG28",
    citationId: "CIT-0032",
    title: "Type 2 diabetes in adults: management",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "National Institute for Health and Care Excellence",
    canonicalUrl: "https://www.nice.org.uk/guidance/ng28",
    editionOrVersion: "NG28; updated 2026-02-18",
    accessedAt: AS_OF_DATE,
    sourceVersion: "NG28-2026-02-18",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: ["conventional-care", "evidence-limitations"],
  },
  {
    id: "SRC-KEP2-NIDDK-DIABETES-OVERVIEW",
    citationId: "CIT-0033",
    title: "Diabetes Overview",
    sourceType: "reference-standard",
    publisherOrCustodian:
      "National Institute of Diabetes and Digestive and Kidney Diseases",
    canonicalUrl:
      "https://www.niddk.nih.gov/health-information/diabetes/overview",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-30",
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
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP2-NIDDK-DIABETES-DIAGNOSIS",
    citationId: "CIT-0034",
    title: "Diabetes Tests & Diagnosis",
    sourceType: "reference-standard",
    publisherOrCustodian:
      "National Institute of Diabetes and Digestive and Kidney Diseases",
    canonicalUrl:
      "https://www.niddk.nih.gov/health-information/diabetes/overview/tests-diagnosis",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-30",
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
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP2-MEDLINE-ALLERGIC-RHINITIS",
    citationId: "CIT-0035",
    title: "Allergic rhinitis",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl: "https://medlineplus.gov/ency/article/000813.htm",
    accessedAt: AS_OF_DATE,
    sourceVersion: "accessed-2026-07-30",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: CLINICAL_DOMAINS,
  },
  {
    id: "SRC-KEP2-ARIA-2016",
    citationId: "CIT-0021",
    title: "Allergic Rhinitis and its Impact on Asthma (ARIA) guidelines—2016 revision",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/28602936/",
    editionOrVersion: "2016 revision; published 2017",
    accessedAt: AS_OF_DATE,
    sourceVersion: "PMID-28602936",
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
      "symptoms-and-differential",
      "diagnostic-interpretation",
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP2-NICE-NG145",
    citationId: "CIT-0029",
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
    coverageDomains: CLINICAL_DOMAINS,
  },
  {
    id: "SRC-KEP2-MEDLINE-TSH",
    citationId: "CIT-0028",
    title: "TSH (Thyroid-stimulating hormone) Test",
    sourceType: "reference-standard",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl:
      "https://medlineplus.gov/lab-tests/tsh-thyroid-stimulating-hormone-test/",
    editionOrVersion: "updated 2024-10-30",
    accessedAt: AS_OF_DATE,
    sourceVersion: "2024-10-30",
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
    id: "SRC-KEP2-ATA-HYPOTHYROIDISM-2014",
    citationId: "CIT-0012",
    title: "Guidelines for the Treatment of Hypothyroidism",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/25266247/",
    editionOrVersion: "2014 ATA Task Force guideline",
    accessedAt: AS_OF_DATE,
    sourceVersion: "PMID-25266247",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: ["conventional-care", "evidence-limitations"],
  },
  {
    id: "SRC-KEP2-AACE-ATA-HYPOTHYROIDISM-2012",
    citationId: "CIT-0013",
    title: "Clinical Practice Guidelines for Hypothyroidism in Adults",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "U.S. National Library of Medicine",
    canonicalUrl: "https://pubmed.ncbi.nlm.nih.gov/23246686/",
    editionOrVersion: "2012 AACE/ATA guideline",
    accessedAt: AS_OF_DATE,
    sourceVersion: "PMID-23246686",
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
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP2-WHO-ANAEMIA-2017",
    citationId: "CIT-0015",
    title: "Nutritional anaemias: tools for effective prevention and control",
    sourceType: "clinical-guideline",
    publisherOrCustodian: "World Health Organization",
    canonicalUrl: "https://www.who.int/publications/i/item/9789241513067",
    editionOrVersion: "ISBN 978-92-4-151306-7",
    accessedAt: AS_OF_DATE,
    sourceVersion: "WHO-ANAEMIA-2017",
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
      "conventional-care",
      "evidence-limitations",
    ],
  },
  {
    id: "SRC-KEP2-MSD-ANEMIA",
    citationId: "CIT-0016",
    title: "Evaluation of Anemia",
    sourceType: "reference-standard",
    publisherOrCustodian: "MSD Manual Professional Edition",
    canonicalUrl:
      "https://www.msdmanuals.com/professional/hematology-and-oncology/approach-to-the-patient-with-anemia/evaluation-of-anemia",
    editionOrVersion: "reviewed/revised 2024",
    accessedAt: AS_OF_DATE,
    sourceVersion: "MSD-MANUAL-v968575",
    verifiedAt: AS_OF_DATE,
    licence: {
      status: "restricted",
      permitsExtraction: false,
      permitsDerivedData: false,
      permitsPublicDisplay: false,
    },
    ingestionStatus: "registered",
    usePolicy: "citation-only",
    coverageDomains: CLINICAL_DOMAINS,
  },
];

function dossier(input: {
  entityId: string;
  title: string;
  sourceIds: string[];
  claimPlans: Array<{
    suffix: string;
    claimType: ClaimType;
    citationIds: string[];
    requiredScopeTags: string[];
  }>;
}): KEP1FlagshipSourceDossier {
  const registeredCitationIds = new Set(
    KEP2_PRIORITY_DISEASE_SOURCES.filter((source) =>
      input.sourceIds.includes(source.id)
    ).map((source) => source.citationId)
  );
  const claimEvidencePlans: KEP1ClaimEvidencePlan[] = input.claimPlans.map(
    (plan) => {
      const claimId = `KEP2-${input.entityId}-${plan.suffix}`;
      const evaluation = evaluateClaimCitationStaging({
        claimId,
        claimType: plan.claimType,
        citationIds: plan.citationIds,
        citations: CITATIONS,
        requiredScopeTags: plan.requiredScopeTags,
      });
      const registrationErrors = plan.citationIds
        .filter((citationId) => !registeredCitationIds.has(citationId))
        .map(
          (citationId) =>
            `${claimId}:citation-not-registered-for-dossier:${citationId}`
        );
      return {
        claimId,
        claimType: plan.claimType,
        citationIds: [...plan.citationIds],
        requiredScopeTags: [...plan.requiredScopeTags],
        stagingEvaluation: {
          eligibleForStaging:
            evaluation.eligibleForStaging && registrationErrors.length === 0,
          errors: [...evaluation.errors, ...registrationErrors],
        },
        stateBoundaries: { ...evaluation.boundaries },
      };
    }
  );

  return {
    schemaVersion: "1.0.0",
    dossierId: `KEP2-DOSSIER-${input.entityId}`,
    entityId: input.entityId,
    entityType: "disease",
    title: input.title,
    asOfDate: AS_OF_DATE,
    status: "sources-registered-review-blocked",
    sourceIds: [...input.sourceIds],
    claimEvidencePlans,
    requiredCoverageDomains: [...CLINICAL_DOMAINS],
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

export const KEP2_PRIORITY_DISEASE_DOSSIERS: KEP1FlagshipSourceDossier[] = [
  dossier({
    entityId: "D0005",
    title: "Allergic Rhinitis",
    sourceIds: [
      "SRC-KEP2-MEDLINE-ALLERGIC-RHINITIS",
      "SRC-KEP2-ARIA-2016",
    ],
    claimPlans: [
      {
        suffix: "DEFINITION",
        claimType: "definition",
        citationIds: ["CIT-0035"],
        requiredScopeTags: ["allergic-rhinitis"],
      },
      {
        suffix: "DIAGNOSIS",
        claimType: "diagnosis",
        citationIds: ["CIT-0035", "CIT-0021"],
        requiredScopeTags: ["allergic-rhinitis"],
      },
      {
        suffix: "TREATMENT",
        claimType: "treatment",
        citationIds: ["CIT-0021", "CIT-0035"],
        requiredScopeTags: ["allergic-rhinitis"],
      },
    ],
  }),
  dossier({
    entityId: "D0009",
    title: "Hypertension",
    sourceIds: [
      "SRC-KEP2-NICE-NG136",
      "SRC-KEP2-WHO-HYPERTENSION-2021",
    ],
    claimPlans: [
      {
        suffix: "DIAGNOSIS",
        claimType: "diagnosis",
        citationIds: ["CIT-0030"],
        requiredScopeTags: ["hypertension"],
      },
      {
        suffix: "TREATMENT",
        claimType: "treatment",
        citationIds: ["CIT-0030", "CIT-0031"],
        requiredScopeTags: ["hypertension"],
      },
      {
        suffix: "MONITORING",
        claimType: "safety",
        citationIds: ["CIT-0030"],
        requiredScopeTags: ["monitoring"],
      },
    ],
  }),
  dossier({
    entityId: "D0010",
    title: "Diabetes Mellitus",
    sourceIds: [
      "SRC-KEP2-NICE-NG28",
      "SRC-KEP2-NIDDK-DIABETES-OVERVIEW",
      "SRC-KEP2-NIDDK-DIABETES-DIAGNOSIS",
    ],
    claimPlans: [
      {
        suffix: "DEFINITION",
        claimType: "definition",
        citationIds: ["CIT-0033"],
        requiredScopeTags: ["diabetes"],
      },
      {
        suffix: "DIAGNOSIS",
        claimType: "diagnosis",
        citationIds: ["CIT-0034"],
        requiredScopeTags: ["diabetes"],
      },
      {
        suffix: "TREATMENT",
        claimType: "treatment",
        citationIds: ["CIT-0032", "CIT-0033"],
        requiredScopeTags: ["diabetes"],
      },
    ],
  }),
  dossier({
    entityId: "D0011",
    title: "Hypothyroidism",
    sourceIds: [
      "SRC-KEP2-NICE-NG145",
      "SRC-KEP2-MEDLINE-TSH",
      "SRC-KEP2-ATA-HYPOTHYROIDISM-2014",
      "SRC-KEP2-AACE-ATA-HYPOTHYROIDISM-2012",
    ],
    claimPlans: [
      {
        suffix: "DIAGNOSIS",
        claimType: "diagnosis",
        citationIds: ["CIT-0029", "CIT-0013"],
        requiredScopeTags: ["diagnosis"],
      },
      {
        suffix: "TREATMENT",
        claimType: "treatment",
        citationIds: ["CIT-0012", "CIT-0029"],
        requiredScopeTags: ["hypothyroidism"],
      },
      {
        suffix: "MONITORING",
        claimType: "laboratory-interpretation",
        citationIds: ["CIT-0028", "CIT-0029"],
        requiredScopeTags: ["monitoring"],
      },
    ],
  }),
  dossier({
    entityId: "D0051",
    title: "Anemia",
    sourceIds: ["SRC-KEP2-WHO-ANAEMIA-2017", "SRC-KEP2-MSD-ANEMIA"],
    claimPlans: [
      {
        suffix: "DEFINITION",
        claimType: "definition",
        citationIds: ["CIT-0015", "CIT-0016"],
        requiredScopeTags: ["anaemia"],
      },
      {
        suffix: "DIAGNOSIS",
        claimType: "diagnosis",
        citationIds: ["CIT-0016"],
        requiredScopeTags: ["anaemia"],
      },
      {
        suffix: "INTERPRETATION",
        claimType: "laboratory-interpretation",
        citationIds: ["CIT-0016"],
        requiredScopeTags: ["cbc"],
      },
    ],
  }),
];

export function buildKEP2PriorityDiseaseEvidenceManifest(): KEP2PriorityDiseaseEvidenceManifest {
  const claimEvidencePlans = KEP2_PRIORITY_DISEASE_DOSSIERS.flatMap(
    (item) => item.claimEvidencePlans
  );
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-2-PRIORITY-DISEASE-EVIDENCE",
    asOfDate: AS_OF_DATE,
    status: "sources-registered-review-blocked",
    selectionBasis: {
      method: "clinical-risk-and-evidence-gap",
      liveTrafficTelemetryUsed: false,
      mockAnalyticsExcluded: true,
      sourceInventoryAsOfDate: AS_OF_DATE,
    },
    sources: KEP2_PRIORITY_DISEASE_SOURCES.map((source) => ({
      ...source,
      licence: { ...source.licence },
      coverageDomains: [...source.coverageDomains],
    })),
    dossiers: KEP2_PRIORITY_DISEASE_DOSSIERS.map((item) => ({
      ...item,
      sourceIds: [...item.sourceIds],
      claimEvidencePlans: item.claimEvidencePlans.map((plan) => ({
        ...plan,
        citationIds: [...plan.citationIds],
        requiredScopeTags: [...plan.requiredScopeTags],
        stagingEvaluation: {
          ...plan.stagingEvaluation,
          errors: [...plan.stagingEvaluation.errors],
        },
        stateBoundaries: { ...plan.stateBoundaries },
      })),
      requiredCoverageDomains: [...item.requiredCoverageDomains],
      prohibitedClaimPatterns: [...item.prohibitedClaimPatterns],
      assignments: item.assignments.map((assignment) => ({ ...assignment })),
      governedRelationshipTarget: { ...item.governedRelationshipTarget },
      stateBoundaries: { ...item.stateBoundaries },
    })),
    summary: {
      sourceCount: KEP2_PRIORITY_DISEASE_SOURCES.length,
      dossierCount: 5,
      claimEvidencePlanCount: claimEvidencePlans.length,
      stagingEligibleClaimEvidencePlanCount: claimEvidencePlans.filter(
        (plan) => plan.stagingEvaluation.eligibleForStaging
      ).length,
      withdrawnEntitiesExcluded: 1,
      productionRagEntities: 0,
      approvedEvidenceProfiles: 0,
      approvedClinicalReviews: 0,
    },
    exclusions: [
      {
        entityId: "D0007",
        reason: "active-safety-withdrawal",
        requiredPath: "withdrawn-safety-remediation",
      },
    ],
    invariants: {
      automaticApprovalForbidden: true,
      citationOnlySourcesCannotBeExtracted: true,
      mockAnalyticsCannotConferPriorityOrAuthority: true,
      publicationState: "unchanged",
      ragState: "inactive",
      withdrawnEntitiesRemainExcluded: true,
    },
  };
}
