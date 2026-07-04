import assert from "assert";
import { createClinicalRepertoryService } from "../clinicalWorkspace/clinicalRepertoryService";
import { CLINICAL_WORKSPACE_SAFETY_NOTICE } from "../clinicalWorkspace/types";
import { CLINICAL_REPERTORY_WORKSPACE_SECTIONS } from "../clinicalWorkspace/workspaceModel";

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
