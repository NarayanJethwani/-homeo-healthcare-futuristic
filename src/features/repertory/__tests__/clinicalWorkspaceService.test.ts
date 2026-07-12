import assert from "assert";
import { createClinicalRepertoryService } from "../clinicalWorkspace/clinicalRepertoryService";
import { CLINICAL_WORKSPACE_SAFETY_NOTICE } from "../clinicalWorkspace/types";
import { CLINICAL_REPERTORY_WORKSPACE_SECTIONS } from "../clinicalWorkspace/workspaceModel";

if (typeof global.fetch === "undefined" || !(global as any).fetch.isMock) {
  (global as any).fetch = async (url: string) => {
    if (url.includes("/api/repertory/search")) {
      return {
        json: async () => ({
          success: true,
          rubrics: [
            { rubricId: 'jeth_rb_eczema_itching_scratching', title: 'Skin; eczema; itching' },
            { rubricId: 'jeth_rb_pain_burning_arsenicum', title: 'Generalities; pain; burning' },
            { rubricId: 'jeth_rb_asthma_night_midnight', title: 'Chest; asthma; night; midnight' }
          ]
        })
      };
    }
    return {
      json: async () => ({ success: false })
    };
  };
  (global as any).fetch.isMock = true;
}

assert.strictEqual(CLINICAL_REPERTORY_WORKSPACE_SECTIONS[0].id, "intake");
assert.strictEqual(CLINICAL_REPERTORY_WORKSPACE_SECTIONS.at(-1)?.id, "final_review");
assert.ok(CLINICAL_REPERTORY_WORKSPACE_SECTIONS.every((section) => section.capabilityIds.length > 0));

const service = createClinicalRepertoryService({
  searchProviders: [
    {
      id: "stable-search",
      capabilityIds: ["rubric_search"],
      search: () => [
        {
          id: "abdomen-flatulence",
          title: "Abdomen; flatulence",
          sourceBadge: "Clinical",
          score: 12,
        },
      ],
    },
    {
      id: "failing-search",
      capabilityIds: ["semantic_search"],
      search: () => {
        throw new Error("simulated provider failure");
      },
    },
  ],
  repertorizationProviders: [
    {
      id: "clinical-ranking",
      capabilityIds: ["repertorization"],
      repertorize: ({ rubricCandidates }) => [
        {
          remedyId: "Lyc",
          remedyName: "Lycopodium",
          rank: 1,
          score: 10,
          confidence: 0.75,
          contributingRubricIds: rubricCandidates.map((rubric) => rubric.id),
          missingRubricIds: [],
          explanation: ["Ranked from selected rubric coverage."],
        },
      ],
    },
  ],
  reasoningProviders: [
    {
      id: "clinical-safety",
      capabilityIds: ["case_validation"],
      reason: () => ({
        clinicalWarnings: ["Clinician verification required."],
        missingInformation: ["Confirm modalities."],
        sourceAttribution: ["Dr. Jethwani clinical repertory"],
      }),
    },
  ],
});

service.analyzeCase({ query: "gas", selectedRubrics: [{ rubricId: "abdomen-flatulence" }] }).then((result) => {
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.safetyNotice, CLINICAL_WORKSPACE_SAFETY_NOTICE);
  assert.strictEqual(result.rubricCandidates.length, 1);
  assert.strictEqual(result.remedyRankings[0].remedyId, "Lyc");
  assert.ok(result.clinicalWarnings.some((warning) => warning.includes("failing-search")));
  assert.ok(result.clinicalWarnings.includes("Clinician verification required."));
  assert.deepStrictEqual(result.missingInformation, ["Confirm modalities."]);
  assert.ok(result.engineTrace.internalProviders.includes("stable-search"));
  assert.ok(result.engineTrace.internalProviders.includes("clinical-ranking"));
  assert.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v1")));
  assert.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v2")));
  console.log("clinicalWorkspaceService.test.ts passed");
});

// Longitudinal timeline verification (Step 2 & Step 8)
service.getLongitudinalSummary('patient-123', [
  {
    visitId: 'visit-1',
    date: '2026-05-01T12:00:00.000Z',
    activeSymptoms: [
      { rubricId: 'jeth_rb_eczema_itching_scratching', severity: 8, observedIntensity: 8 },
      { rubricId: 'jeth_rb_pain_burning_arsenicum', severity: 2, observedIntensity: 2 }
    ],
    prescribedRemedyId: 'Ars',
    potency: '30C',
    dosage: '1 dose',
    generalAmeliorationRating: 2,
    notes: 'Severe skin itching'
  },
  {
    visitId: 'visit-2',
    date: '2026-06-01T12:00:00.000Z',
    activeSymptoms: [
      { rubricId: 'jeth_rb_eczema_itching_scratching', severity: 2, observedIntensity: 2 },
      { rubricId: 'jeth_rb_asthma_night_midnight', severity: 9, observedIntensity: 9 }
    ],
    prescribedRemedyId: 'Ars',
    potency: '200C',
    dosage: '1 dose',
    generalAmeliorationRating: -2,
    notes: 'Skin cleared, but severe midnight asthma developed'
  }
]).then((summary) => {
  assert.strictEqual(summary.patientId, 'patient-123');
  assert.strictEqual(summary.responseTrend, 'suppressed');
  assert.ok(summary.suppressionWarnings && summary.suppressionWarnings.length > 0);
  assert.ok(summary.suppressionWarnings[0].includes("Possible suppression detected"));
  assert.ok(summary.remedyOutcomes.some(r => r.remedyId === 'Ars'));
  const arsOut = summary.remedyOutcomes.find(r => r.remedyId === 'Ars');
  assert.ok(arsOut?.expectedTimeline);
  assert.ok(arsOut?.warningSigns && arsOut.warningSigns.length > 0);
  console.log("longitudinal timeline assertions passed successfully");
});

// Knowledge Base Verification (Step 6 & 8)
import { KnowledgeService } from "../knowledge/knowledgeService";

KnowledgeService.getRemedyKnowledge('Ars').then((record) => {
  assert.ok(record);
  assert.strictEqual(record?.remedyId, 'Ars');
  assert.strictEqual(record?.editorialStatus, 'Verified');
  assert.ok(record?.clinicalPearls && record.clinicalPearls.length > 0);
  assert.ok(record?.evidenceItems && record.evidenceItems.length > 0);
  assert.strictEqual(record?.clinicalPearls[0].origin, 'source-backed');
  assert.strictEqual(record?.evidenceItems[0].strength, 'Keynote');
  assert.ok(record?.evidenceItems[0].sourceReferences.includes("Kent's Lectures on Homoeopathic Materia Medica"));
  console.log("knowledge service remedy assertions passed successfully");
});

KnowledgeService.queryEvidenceByConcept('Asthma').then((items) => {
  assert.ok(items.length > 0);
  assert.strictEqual(items[0].title, 'Midnight Asthma Paroxysm');
  console.log("knowledge service search concept assertions passed successfully");
});

// Editorial Registry & Source Verification (Phase 7)
import { EditorialService } from "../editorial/editorialService";
import { EditorialValidator } from "../editorial/editorialValidator";

EditorialService.getEditorialRecords('Ars').then((records) => {
  assert.ok(records.length > 0);
  assert.strictEqual(records[0].remedyId, 'Ars');
  assert.strictEqual(records[0].currentStatus, 'Verified');
  assert.strictEqual(records[0].sourceId, 'jethwani_private');
  
  // Verify revision history matches
  assert.ok(records[0].revisionHistory.length > 0);
  assert.strictEqual(records[0].revisionHistory[0].version, '1.0.0');
  console.log("editorial service record assertions passed successfully");
});

EditorialService.getSourceMetadata('jethwani_private').then((source) => {
  assert.ok(source);
  assert.strictEqual(source?.author, 'Dr. Narayan Jethwani');
  assert.strictEqual(source?.legalStatus, 'Clinic Internal');
  console.log("editorial service source metadata assertions passed successfully");
});

const qaReport = EditorialValidator.validateRegistry();
assert.strictEqual(qaReport.isValid, true);
console.log("editorial registry QA validation check passed successfully");

// Inject mock invalid remedy for QA audit testing (Phase 8)
import { JETHWANI_EVIDENCE_REGISTRY } from "../knowledge/evidenceRegistry";

JETHWANI_EVIDENCE_REGISTRY['MockInvalid'] = {
  remedyId: 'MockInvalid',
  editorialStatus: 'Draft',
  clinicalPearls: [],
  evidenceItems: [
    {
      id: 'mock_low_conf',
      title: 'Low Conf Trial',
      summary: 'Incomplete study',
      strength: 'Hypothetical',
      confidence: 50, // Low confidence alert!
      editorialStatus: 'Draft',
      reviewer: 'Editor',
      lastReviewed: '2026-07-04',
      origin: 'AI-assisted',
      sourceReferences: []
    }
  ],
  pathologyRelations: [],
  remedyRelations: [
    'Ars (complementary)',
    'Ars (antidote)', // Relationship conflict!
    'MockInvalid (complementary)' // Self relationship conflict!
  ]
};

const badReport = EditorialValidator.validateRegistry();
assert.strictEqual(badReport.isValid, false);
assert.ok(badReport.issues.some(i => i.includes("has confidence 50%")));
assert.ok(badReport.issues.some(i => i.includes("cannot be both complementary and antagonistic")));
assert.ok(badReport.issues.some(i => i.includes("cannot have relationship with itself")));

// Cleanup mock invalid entry
delete JETHWANI_EVIDENCE_REGISTRY['MockInvalid'];
console.log("editorial registry validator QA alerts verified successfully");

// Advanced Repertorization Engines Verification (Phase 9)
import { ConstitutionalEngine } from "../scoring/constitutionalEngine";
import { MiasmaticEngine } from "../scoring/miasmaticEngine";
import { RepertoryRubric } from "../types";

const mockRubrics: RepertoryRubric[] = [
  {
    rubricId: 'rubric-1',
    title: 'Anxiety with restless desire to change positions',
    category: 'Mental & Emotional',
    subCategory: 'Anxiety',
    confidence: 1.0,
    miasmaticWeight: { Psora: 1.0, Syphilis: 1.0, Sycosis: 0, Tubercular: 0, Cancerinic: 0 },
    relatedRemedies: [],
    relatedDiseases: [],
    classicalWording: 'Restless anxiety'
  },
  {
    rubricId: 'rubric-2',
    title: 'Warm-blooded, burning feet at night',
    category: 'Thermal State',
    subCategory: 'Warm',
    confidence: 1.0,
    miasmaticWeight: { Psora: 2.0, Syphilis: 0, Sycosis: 0, Tubercular: 0, Cancerinic: 0 },
    relatedRemedies: [],
    relatedDiseases: [],
    classicalWording: 'Hot soles'
  }
] as unknown as RepertoryRubric[];

const mockSymptoms = [
  { rubricId: 'rubric-1', severity: 8 },
  { rubricId: 'rubric-2', severity: 9 }
];

const constProfileResult = ConstitutionalEngine.analyzeConstitution(mockRubrics, mockSymptoms);
assert.ok(constProfileResult);
assert.ok(constProfileResult.dominantType === 'Ars' || constProfileResult.dominantType === 'Sulph');
assert.ok(constProfileResult.confidence >= 50);

const miasmProfileResult = MiasmaticEngine.analyzeMiasms(mockRubrics, mockSymptoms);
assert.ok(miasmProfileResult);
assert.strictEqual(miasmProfileResult.primaryMiasm, 'Psora'); // Psora accumulates highest weight
console.log("constitutional and miasmatic analysis engines verified successfully");

// Clinical Validation Suite Verification (Phase 10)
import { ClinicalValidationFramework } from "../validation/clinicalValidationFramework";

ClinicalValidationFramework.runValidationSuite().then((report) => {
  assert.ok(report);
  assert.strictEqual(report.casesEvaluated, 3);
  assert.ok(report.passedCases >= 2); // expects high validation matching
  console.log("clinical validation suite run completed successfully");
});

// Dr. Jethwani Clinical Knowledge System Verification (Phase 11)
import { ClinicalExperienceIndex } from "../clinicalExperience/clinicalExperienceIndex";

const obsResults = ClinicalExperienceIndex.searchObservations("Anxiety");
assert.ok(obsResults.length > 0);
assert.ok(obsResults[0].title.toLowerCase().includes("anxiety"));
assert.strictEqual(obsResults[0].author, "Dr. Narayan Jethwani");
assert.strictEqual(obsResults[0].editorialStatus, "Verified");

const remedyObs = ClinicalExperienceIndex.getObservationsForRemedy("Ars");
assert.ok(remedyObs.length > 0);
assert.ok(remedyObs.some(o => o.remedies?.includes("Ars")));
console.log("Dr. Jethwani clinical observations and patterns verified successfully");
