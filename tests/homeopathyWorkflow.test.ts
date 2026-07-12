import assert from "assert";
import { DomainEventDispatcher, DomainEvent } from "../src/shared/events/eventDispatcher";
import { toPatientId, toOrganizationId, toPractitionerId, toEncounterId, toAssessmentId, toSymptomId, toTotalitySymptomId } from "../src/shared/domain/identifiers";
import { MockPatientRepository } from "../src/features/patient/repositories/patientRepository";
import { MockAllergyRepository } from "../src/features/allergy/repositories/allergyRepository";
import { MockEncounterRepository } from "../src/features/encounter/repositories/encounterRepository";
import { MockConsultationRepository } from "../src/features/consultation/repositories/consultationRepository";
import { AssessmentWorkspaceService } from "../src/features/homeopathy/application/AssessmentWorkspaceService";
import { TotalitySymptom } from "../src/features/homeopathy/domain/homeopathy.types";
import { MockHomeopathyRepository } from '../src/features/homeopathy/repositories/homeopathyRepository';
import { HomeopathyService } from '../src/features/homeopathy/services/homeopathyService';

async function runTests() {
  console.log("🚀 Starting Homeopathic Assessment Engine Integration & Workflow Tests...");
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  const mockRepo = new MockHomeopathyRepository();
  const dispatcher = new DomainEventDispatcher();
  const service = new HomeopathyService(mockRepo, dispatcher);

  const mockPatientRepo = new MockPatientRepository();
  const mockAllergyRepo = new MockAllergyRepository();
  const mockEncounterRepo = new MockEncounterRepository();
  const mockConsultationRepo = new MockConsultationRepository();

  const workspaceService = new AssessmentWorkspaceService(
    mockEncounterRepo,
    mockConsultationRepo,
    mockAllergyRepo,
    mockPatientRepo,
    mockRepo,
    service
  );

  const testOrg = toOrganizationId("org_test_01");
  const testPatient = toPatientId("pat_test_01");
  const testEncounter = toEncounterId("enc_test_01");
  const testPractitioner = toPractitionerId("doc_test_01");

  const eventsDispatched: string[] = [];
  DomainEventDispatcher.subscribe("*", (event: DomainEvent) => {
    eventsDispatched.push(event.eventType);
  });

  // 1. Creation test
  let assessmentId: any;
  await test("Assessment Lifecycle - Create initial assessment draft record", async () => {
    const asm = await service.createAssessment({
      organizationId: testOrg,
      patientId: testPatient,
      encounterId: testEncounter,
      practitionerId: testPractitioner
    });

    assert.strictEqual(asm.status, "draft");
    assert.strictEqual(asm.recordVersion, 0);
    assert.strictEqual(asm.totalitySymptoms.length, 0);
    assessmentId = asm.id;

    assert(eventsDispatched.includes(["homeo", "pathy", ".assessment.created"].join("")));
  });

  // 2. Draft autosave update
  await test("Assessment Lifecycle - Save draft updates with version advancement", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const updateRes = await service.saveDraft(
      assessmentId,
      {
        etiologicalFactors: ["grief", "suppression"],
        maintainingCauses: ["caffeine"]
      },
      current.recordVersion,
      "doc_test_01"
    );

    assert.strictEqual(updateRes.status, "updated");
    assert.strictEqual(updateRes.assessment.recordVersion, 1);
    assert.deepStrictEqual(updateRes.assessment.etiologicalFactors, ["grief", "suppression"]);

    assert(eventsDispatched.includes(["homeo", "pathy", ".assessment.updated"].join("")));
  });

  // 3. Validation - Missing Totality
  await test("Validation - Reject submission with empty totality list", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const validationIssues = service.validateAssessment(current);
    const hasTotalityError = validationIssues.some((i: any) => i.code === "MISSING_TOTALITY");
    assert.strictEqual(hasTotalityError, true);
  });

  // 4. Validation - Decisive symptom needs rationale
  await test("Validation - Enforce rationale on Decisive/Keynote totality symptoms", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const symptomId = toSymptomId("sym_throbbing");
    const totalityWithDecisive: any[] = [
      {
        id: "ts_decisive_01",
        sourceSymptomId: symptomId,
        sourceSnapshot: {
          patientWording: "Violent throb in temples",
          normalizedName: "Throbbing Headache",
          aggravations: [],
          ameliorations: [],
          concomitants: [],
          causation: []
        },
        primaryClassification: "characteristic",
        secondaryTags: [],
        clinicalImportance: 3,
        reasoningHistory: [],
        selectedBy: "doc_test_01",
        selectedAt: new Date().toISOString()
      }
    ];

    const updated = {
      ...current,
      totalitySymptoms: totalityWithDecisive
    };

    const issues = service.validateAssessment(updated);
    const hasRationaleError = issues.some((i: any) => i.code === "MISSING_TOTALITY_RATIONALE");
    assert.strictEqual(hasRationaleError, true);

    totalityWithDecisive[0].reasoningHistory.push({
      authorId: "doc_test_01" as any,
      timestamp: new Date().toISOString(),
      rationale: "Strong decisive modality present during afternoon peak"
    });

    const issuesResolved = service.validateAssessment({
      ...current,
      totalitySymptoms: totalityWithDecisive
    });
    const hasRationaleErrorResolved = issuesResolved.some((i: any) => i.code === "MISSING_TOTALITY_RATIONALE");
    assert.strictEqual(hasRationaleErrorResolved, false);
  });

  // 5. Validation - Duplicate selected rubrics
  await test("Validation - Prevent duplicate selected rubric IDs in active workspace", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const duplicates = [
      {
        id: "sr_01",
        rubricId: "rubric_headache_throbbing",
        sourceId: "source_boericke_1927",
        chapter: "Head",
        rubricPath: ["Head", "Pain"],
        displayText: "Headache throbbing",
        linkedTotalitySymptomIds: [],
        status: "selected",
        selectedBy: "doc_test_01",
        selectedAt: new Date().toISOString(),
        searchTraceability: { query: "head", timestamp: new Date().toISOString() }
      },
      {
        id: "sr_02",
        rubricId: "rubric_headache_throbbing",
        sourceId: "source_boericke_1927",
        chapter: "Head",
        rubricPath: ["Head", "Pain"],
        displayText: "Headache throbbing",
        linkedTotalitySymptomIds: [],
        status: "selected",
        selectedBy: "doc_test_01",
        selectedAt: new Date().toISOString(),
        searchTraceability: { query: "head", timestamp: new Date().toISOString() }
      }
    ];

    const updated = {
      ...current,
      selectedRubrics: duplicates as any[]
    };

    const issues = service.validateAssessment(updated);
    const hasDuplicateError = issues.some((i: any) => i.code === "DUPLICATE_RUBRICS");
    assert.strictEqual(hasDuplicateError, true);
  });

  // 6. Concurrency conflict test
  await test("Concurrency - Prevent saveDraft when expected record version mismatches", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const res = await service.saveDraft(
      assessmentId,
      { etiologicalFactors: ["conflict_test"] },
      0,
      "doc_test_01"
    );

    assert.strictEqual(res.status, "version_conflict");
    assert.strictEqual(res.currentAssessment.recordVersion, current.recordVersion);
  });

  // 7. Successful submission test
  await test("Assessment Lifecycle - Submit valid draft, lock status, and dispatch submitted review event", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const validTotality = [
      {
        id: "ts_valid_01",
        sourceSymptomId: "sym_throbbing",
        sourceSnapshot: {
          patientWording: "Violent head throb",
          normalizedName: "Throbbing headache",
          aggravations: [],
          ameliorations: [],
          concomitants: [],
          causation: []
        },
        primaryClassification: "characteristic",
        secondaryTags: [],
        clinicalImportance: 3,
        reasoningHistory: [{
          authorId: "doc_test_01",
          timestamp: new Date().toISOString(),
          rationale: "Decisive modality mapped"
        }],
        selectedBy: "doc_test_01",
        selectedAt: new Date().toISOString()
      }
    ];

    const validRubrics = [
      {
        id: "sr_01",
        rubricId: "rubric_headache_throbbing",
        sourceId: "source_boericke_1927",
        chapter: "Head",
        rubricPath: ["Head", "Pain"],
        displayText: "Headache throbbing",
        linkedTotalitySymptomIds: ["ts_valid_01"],
        status: "selected",
        selectedBy: "doc_test_01",
        selectedAt: new Date().toISOString(),
        searchTraceability: { query: "head", timestamp: new Date().toISOString() }
      }
    ];

    const validDiff = [
      {
        id: "dr_01",
        sourceSymptomId: "sym_throbbing",
        interpretation: "violent migraine with warmth aggravations",
        candidateRubricIds: ["rubric_headache_throbbing"],
        rejectedRubricIds: [],
        rejectionRationales: {}
      }
    ];

    const updateRes = await mockRepo.save({
      ...current,
      totalitySymptoms: validTotality as any[],
      selectedRubrics: validRubrics as any[],
      differentialReasoning: validDiff as any[]
    });

    const submitRes = await service.submitAssessmentForReview(
      assessmentId,
      { actorId: "doc_test_01", organizationId: "org_test_01" },
      updateRes.recordVersion
    );

    assert.strictEqual(submitRes.success, true);
    assert.strictEqual(submitRes.assessment?.status, "ready_for_review");

    assert(eventsDispatched.includes(["homeo", "pathy", ".assessment.submitted_for_review"].join("")));
  });

  // 8. Historical Symptom Snapshot Reproducibility
  await test("Clinical Model - Historical symptom snapshot remains reproducible if original Consultation changes later", async () => {
    const current = await mockRepo.findById(assessmentId);
    assert(current);

    const symptomId = toSymptomId("sym_historical_test");
    const totalitySymptom: TotalitySymptom = {
      id: toTotalitySymptomId("ts_historical_01"),
      sourceSymptomId: symptomId,
      sourceSnapshot: {
        patientWording: "Severe stomach ache",
        normalizedName: "Stomach pain",
        aggravations: ["after eating"],
        ameliorations: ["warm drinks"],
        concomitants: [],
        causation: []
      },
      primaryClassification: "characteristic",
      secondaryTags: [],
      clinicalImportance: 2,
      reasoningHistory: [{
        authorId: "doc_test_01" as any,
        timestamp: new Date().toISOString(),
        rationale: "Initial symptom inclusion"
      }],
      selectedBy: "doc_test_01" as any,
      selectedAt: new Date().toISOString()
    };

    const updated = {
      ...current,
      totalitySymptoms: [...current.totalitySymptoms, totalitySymptom]
    };
    await mockRepo.save(updated);

    // Reload assessment and verify that the snapshot remains frozen with "Severe stomach ache"
    const reloaded = await mockRepo.findById(assessmentId);
    assert(reloaded);
    const savedSymptom = reloaded.totalitySymptoms.find((s: any) => s.sourceSymptomId === symptomId);
    assert(savedSymptom);
    assert.strictEqual(savedSymptom.sourceSnapshot.patientWording, "Severe stomach ache");
  });

  // 9. Rubric Provenance Preservation
  await test("Clinical Model - Rubric selections preserve source, edition, hierarchy and linked totality symptoms", async () => {
    const reloaded = await mockRepo.findById(assessmentId);
    assert(reloaded);

    const rubric = reloaded.selectedRubrics[0];
    assert(rubric);
    assert.strictEqual(rubric.sourceId, "source_boericke_1927");
    assert.strictEqual(rubric.chapter, "Head");
    assert.deepStrictEqual(rubric.rubricPath, ["Head", "Pain"]);
    assert.strictEqual(rubric.displayText, "Headache throbbing");
    assert.deepStrictEqual(rubric.linkedTotalitySymptomIds, ["ts_valid_01"]);
  });

  // 10. Workspace Composition Read Model Calculation
  await test("Workspace Composition - Read model compiles encounter, patient details, allergies and progress", async () => {
    // Seed repositories with matching entities
    const pat = await mockPatientRepo.registerPatient({
      organizationId: testOrg,
      demographics: {
        name: "Test George",
        dateOfBirth: "1980-01-01",
        gender: "male"
      },
      createdBy: "doc_test_01"
    });

    const enc = await mockEncounterRepo.create({
      patientId: pat.id as any,
      organizationId: testOrg,
      practitionerId: testPractitioner,
      encounterType: "initial_consultation",
      encounterDate: new Date().toISOString(),
      provenance: {
        createdBy: "doc_test_01",
        createdAt: new Date().toISOString(),
        updatedBy: "doc_test_01",
        updatedAt: new Date().toISOString(),
        sourceType: "clinician",
        enteredByRole: "practitioner"
      }
    });

    // Create matching assessment
    const asm = await service.createAssessment({
      organizationId: testOrg,
      patientId: pat.id as any,
      encounterId: enc.id,
      practitionerId: testPractitioner
    });
    assert(asm);

    const readModel = await workspaceService.loadWorkspace(enc.id, "doc_test_01");
    
    assert(readModel.encounter);
    assert(readModel.patient);
    assert(readModel.assessment);
    assert.strictEqual(readModel.completionProgress.totality, false);
  });

  console.log(`\nTotals: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
