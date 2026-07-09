"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalRepertoryService_1 = require("../clinicalWorkspace/clinicalRepertoryService");
const types_1 = require("../clinicalWorkspace/types");
const workspaceModel_1 = require("../clinicalWorkspace/workspaceModel");
assert_1.default.strictEqual(workspaceModel_1.CLINICAL_REPERTORY_WORKSPACE_SECTIONS[0].id, "intake");
assert_1.default.strictEqual(workspaceModel_1.CLINICAL_REPERTORY_WORKSPACE_SECTIONS.at(-1)?.id, "final_review");
assert_1.default.ok(workspaceModel_1.CLINICAL_REPERTORY_WORKSPACE_SECTIONS.every((section) => section.capabilityIds.length > 0));
const service = (0, clinicalRepertoryService_1.createClinicalRepertoryService)({
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
    assert_1.default.strictEqual(result.success, true);
    assert_1.default.strictEqual(result.safetyNotice, types_1.CLINICAL_WORKSPACE_SAFETY_NOTICE);
    assert_1.default.strictEqual(result.rubricCandidates.length, 1);
    assert_1.default.strictEqual(result.remedyRankings[0].remedyId, "Lyc");
    assert_1.default.ok(result.clinicalWarnings.some((warning) => warning.includes("failing-search")));
    assert_1.default.ok(result.clinicalWarnings.includes("Clinician verification required."));
    assert_1.default.deepStrictEqual(result.missingInformation, ["Confirm modalities."]);
    assert_1.default.ok(result.engineTrace.internalProviders.includes("stable-search"));
    assert_1.default.ok(result.engineTrace.internalProviders.includes("clinical-ranking"));
    assert_1.default.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v1")));
    assert_1.default.ok(!result.engineTrace.internalProviders.some((provider) => provider.toLowerCase().includes("v2")));
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
    assert_1.default.strictEqual(summary.patientId, 'patient-123');
    assert_1.default.strictEqual(summary.responseTrend, 'suppressed');
    assert_1.default.ok(summary.suppressionWarnings && summary.suppressionWarnings.length > 0);
    assert_1.default.ok(summary.suppressionWarnings[0].includes("Possible suppression detected"));
    assert_1.default.ok(summary.remedyOutcomes.some(r => r.remedyId === 'Ars'));
    const arsOut = summary.remedyOutcomes.find(r => r.remedyId === 'Ars');
    assert_1.default.ok(arsOut?.expectedTimeline);
    assert_1.default.ok(arsOut?.warningSigns && arsOut.warningSigns.length > 0);
    console.log("longitudinal timeline assertions passed successfully");
});
// Knowledge Base Verification (Step 6 & 8)
const knowledgeService_1 = require("../knowledge/knowledgeService");
knowledgeService_1.KnowledgeService.getRemedyKnowledge('Ars').then((record) => {
    assert_1.default.ok(record);
    assert_1.default.strictEqual(record?.remedyId, 'Ars');
    assert_1.default.strictEqual(record?.editorialStatus, 'Verified');
    assert_1.default.ok(record?.clinicalPearls && record.clinicalPearls.length > 0);
    assert_1.default.ok(record?.evidenceItems && record.evidenceItems.length > 0);
    assert_1.default.strictEqual(record?.clinicalPearls[0].origin, 'source-backed');
    assert_1.default.strictEqual(record?.evidenceItems[0].strength, 'Keynote');
    assert_1.default.ok(record?.evidenceItems[0].sourceReferences.includes("Kent's Lectures on Homoeopathic Materia Medica"));
    console.log("knowledge service remedy assertions passed successfully");
});
knowledgeService_1.KnowledgeService.queryEvidenceByConcept('Asthma').then((items) => {
    assert_1.default.ok(items.length > 0);
    assert_1.default.strictEqual(items[0].title, 'Midnight Asthma Paroxysm');
    console.log("knowledge service search concept assertions passed successfully");
});
// Editorial Registry & Source Verification (Phase 7)
const editorialService_1 = require("../editorial/editorialService");
const editorialValidator_1 = require("../editorial/editorialValidator");
editorialService_1.EditorialService.getEditorialRecords('Ars').then((records) => {
    assert_1.default.ok(records.length > 0);
    assert_1.default.strictEqual(records[0].remedyId, 'Ars');
    assert_1.default.strictEqual(records[0].currentStatus, 'Verified');
    assert_1.default.strictEqual(records[0].sourceId, 'jethwani_private');
    // Verify revision history matches
    assert_1.default.ok(records[0].revisionHistory.length > 0);
    assert_1.default.strictEqual(records[0].revisionHistory[0].version, '1.0.0');
    console.log("editorial service record assertions passed successfully");
});
editorialService_1.EditorialService.getSourceMetadata('jethwani_private').then((source) => {
    assert_1.default.ok(source);
    assert_1.default.strictEqual(source?.author, 'Dr. Narayan Jethwani');
    assert_1.default.strictEqual(source?.legalStatus, 'Clinic Internal');
    console.log("editorial service source metadata assertions passed successfully");
});
const qaReport = editorialValidator_1.EditorialValidator.validateRegistry();
assert_1.default.strictEqual(qaReport.isValid, true);
console.log("editorial registry QA validation check passed successfully");
// Inject mock invalid remedy for QA audit testing (Phase 8)
const evidenceRegistry_1 = require("../knowledge/evidenceRegistry");
evidenceRegistry_1.JETHWANI_EVIDENCE_REGISTRY['MockInvalid'] = {
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
const badReport = editorialValidator_1.EditorialValidator.validateRegistry();
assert_1.default.strictEqual(badReport.isValid, false);
assert_1.default.ok(badReport.issues.some(i => i.includes("has confidence 50%")));
assert_1.default.ok(badReport.issues.some(i => i.includes("cannot be both complementary and antagonistic")));
assert_1.default.ok(badReport.issues.some(i => i.includes("cannot have relationship with itself")));
// Cleanup mock invalid entry
delete evidenceRegistry_1.JETHWANI_EVIDENCE_REGISTRY['MockInvalid'];
console.log("editorial registry validator QA alerts verified successfully");
// Advanced Repertorization Engines Verification (Phase 9)
const constitutionalEngine_1 = require("../scoring/constitutionalEngine");
const miasmaticEngine_1 = require("../scoring/miasmaticEngine");
const mockRubrics = [
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
];
const mockSymptoms = [
    { rubricId: 'rubric-1', severity: 8 },
    { rubricId: 'rubric-2', severity: 9 }
];
const constProfileResult = constitutionalEngine_1.ConstitutionalEngine.analyzeConstitution(mockRubrics, mockSymptoms);
assert_1.default.ok(constProfileResult);
assert_1.default.ok(constProfileResult.dominantType === 'Ars' || constProfileResult.dominantType === 'Sulph');
assert_1.default.ok(constProfileResult.confidence >= 50);
const miasmProfileResult = miasmaticEngine_1.MiasmaticEngine.analyzeMiasms(mockRubrics, mockSymptoms);
assert_1.default.ok(miasmProfileResult);
assert_1.default.strictEqual(miasmProfileResult.primaryMiasm, 'Psora'); // Psora accumulates highest weight
console.log("constitutional and miasmatic analysis engines verified successfully");
// Clinical Validation Suite Verification (Phase 10)
const clinicalValidationFramework_1 = require("../validation/clinicalValidationFramework");
clinicalValidationFramework_1.ClinicalValidationFramework.runValidationSuite().then((report) => {
    assert_1.default.ok(report);
    assert_1.default.strictEqual(report.casesEvaluated, 3);
    assert_1.default.ok(report.passedCases >= 2); // expects high validation matching
    console.log("clinical validation suite run completed successfully");
});
// Dr. Jethwani Clinical Knowledge System Verification (Phase 11)
const clinicalExperienceIndex_1 = require("../clinicalExperience/clinicalExperienceIndex");
const obsResults = clinicalExperienceIndex_1.ClinicalExperienceIndex.searchObservations("Anxiety");
assert_1.default.ok(obsResults.length > 0);
assert_1.default.ok(obsResults[0].title.toLowerCase().includes("anxiety"));
assert_1.default.strictEqual(obsResults[0].author, "Dr. Narayan Jethwani");
assert_1.default.strictEqual(obsResults[0].editorialStatus, "Verified");
const remedyObs = clinicalExperienceIndex_1.ClinicalExperienceIndex.getObservationsForRemedy("Ars");
assert_1.default.ok(remedyObs.length > 0);
assert_1.default.ok(remedyObs.some(o => o.remedies?.includes("Ars")));
console.log("Dr. Jethwani clinical observations and patterns verified successfully");
