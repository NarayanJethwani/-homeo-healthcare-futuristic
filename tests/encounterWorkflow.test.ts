import assert from "assert";

// Shared Identifiers and Entities
import { 
  toEncounterId, toPatientId, toConsultationId, toEpisodeId, toSymptomId,
  toOrganizationId, toClinicId, toPractitionerId, 
  EncounterId, PatientId, ConsultationId, EpisodeId, SymptomId 
} from "../src/shared/domain/identifiers";
import { DomainEventDispatcher, DomainEvent } from "../src/shared/events/eventDispatcher";
import { UnauthorizedError } from "../src/shared/errors/domainErrors";

// Encounter Feature
import { 
  Encounter, EncounterType, EncounterStatus, 
  MockEncounterRepository, EncounterService, validateEncounterForReview 
} from "../src/features/encounter";

// Consultation Feature
import { 
  ClinicalIntake, SymptomRecord, IllnessTimelineEvent, 
  MockConsultationRepository, ConsultationService, 
  hasMeaningfulMentalGenerals, hasMeaningfulPhysicalGenerals 
} from "../src/features/consultation";

async function runTests() {
  console.log("🚀 Starting Clinical Intelligence Platform - Encounter & Intake Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // Mocks setup
  const encounterRepo = new MockEncounterRepository();
  const consultationRepo = new MockConsultationRepository();

  const encounterService = new EncounterService(encounterRepo);
  const consultationService = new ConsultationService(consultationRepo);

  // 1. Creating encounters with primary & related episode references
  await test("EncounterService: should create draft encounters with references", async () => {
    const enc = await encounterService.createEncounter({
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      clinicId: toClinicId("clinic_pune"),
      practitionerId: toPractitionerId("doc_jethwani"),
      encounterType: "initial_consultation",
      encounterDate: new Date().toISOString(),
      primaryEpisodeId: toEpisodeId("epi_gerd"),
      relatedEpisodeIds: [toEpisodeId("epi_migraine")],
      createdBy: "doc_jethwani"
    });

    assert.strictEqual(enc.status, "draft");
    assert.strictEqual(enc.encounterType, "initial_consultation");
    assert.strictEqual(enc.primaryEpisodeId, "epi_gerd");
    assert.deepStrictEqual(enc.relatedEpisodeIds, ["epi_migraine"]);
    assert.strictEqual(enc.recordVersion, 0);
  });

  // 2. State-transition and validation per encounter type
  await test("EncounterService: should reject submission review if initial consult intake is empty", async () => {
    const enc = await encounterService.createEncounter({
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      practitionerId: toPractitionerId("doc_jethwani"),
      encounterType: "initial_consultation",
      encounterDate: new Date().toISOString(),
      createdBy: "doc_jethwani"
    });

    // Create empty intake
    const intake = await consultationService.createIntake({
      encounterId: toEncounterId(enc.id),
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      createdBy: "doc_jethwani"
    });

    const res = await encounterService.submitEncounterForReview(
      enc.id,
      { actorId: "doc_jethwani", organizationId: "org_pune" },
      intake
    );

    assert.strictEqual(res.success, false);
    // Should have multiple clinical validation issues for initial consultations
    const issueCodes = res.validationIssues.map(i => i.code);
    assert.ok(issueCodes.includes("MISSING_CHIEF_COMPLAINT"));
    assert.ok(issueCodes.includes("INVALID_HPI"));
    assert.ok(issueCodes.includes("MISSING_MENTAL_GENERALS"));
    assert.ok(issueCodes.includes("MISSING_PHYSICAL_GENERALS"));
    assert.ok(issueCodes.includes("MISSING_TIMELINE"));
  });

  // 3. Typology-specific validation policy check: administrative
  await test("EncounterService: should allow submission review on administrative encounter without intake", async () => {
    const enc = await encounterService.createEncounter({
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      practitionerId: toPractitionerId("doc_jethwani"),
      encounterType: "administrative",
      encounterDate: new Date().toISOString(),
      createdBy: "doc_jethwani"
    });

    const res = await encounterService.submitEncounterForReview(
      enc.id,
      { actorId: "doc_jethwani", organizationId: "org_pune" },
      null
    );

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.encounter!.status, "ready_for_review");
  });

  // 4. Structured symptoms: preserve patient wording & custom list management
  await test("ConsultationService: should record structured symptoms without overwriting patient wording", async () => {
    const intake = await consultationService.createIntake({
      encounterId: toEncounterId("enc_test_symptoms"),
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      createdBy: "doc_jethwani"
    });

    const symptom: SymptomRecord = {
      id: toSymptomId("sym_01"),
      patientWording: "Severe splitting headache after getting wet in rain",
      normalizedName: "Headache; wet, from getting",
      intensity: "severe",
      aggravations: ["rainy weather"],
      ameliorations: ["warm wraps"],
      concomitants: [],
      causation: [],
      isCharacteristic: true
    };

    const draftRes = await consultationService.saveDraft(
      intake.id,
      { chiefComplaints: [symptom] },
      intake.recordVersion,
      "doc_jethwani"
    );

    assert.strictEqual(draftRes.status, "updated");
    if (draftRes.status === "updated") {
      assert.strictEqual(draftRes.entity.chiefComplaints[0].patientWording, "Severe splitting headache after getting wet in rain");
      assert.strictEqual(draftRes.entity.chiefComplaints[0].normalizedName, "Headache; wet, from getting");
      assert.strictEqual(draftRes.entity.chiefComplaints[0].isCharacteristic, true);
    }
  });

  // 5. Meaningful generals checkers
  await test("hasMeaningfulMentalGenerals: should check emotional entries correctly", () => {
    const emptyMental = { fears: [], emotionalCausation: [] };
    assert.strictEqual(hasMeaningfulMentalGenerals(emptyMental), false);

    const filledMental = { fears: ["dogs"], emotionalCausation: [] };
    assert.strictEqual(hasMeaningfulMentalGenerals(filledMental), true);

    const noteMental = { fears: [], emotionalCausation: [], clinicianNotes: "Appears depressed" };
    assert.strictEqual(hasMeaningfulMentalGenerals(noteMental), true);
  });

  await test("hasMeaningfulPhysicalGenerals: should check cravings & thermal properties", () => {
    const emptyPhysical = { cravings: [], aversions: [] };
    assert.strictEqual(hasMeaningfulPhysicalGenerals(emptyPhysical), false);

    const thirstPhysical = { cravings: [], aversions: [], thirst: "Thirstless" };
    assert.strictEqual(hasMeaningfulPhysicalGenerals(thirstPhysical), true);
  });

  // 6. Concurrency record version conflicts checks
  await test("ConsultationService: should block saves when expectedVersion does not match", async () => {
    const intake = await consultationService.createIntake({
      encounterId: toEncounterId("enc_concurrency"),
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      createdBy: "doc_jethwani"
    });

    // Make edit v1
    const resV1 = await consultationService.saveDraft(
      intake.id,
      { historyPresentIllness: "HPI edit 1" },
      intake.recordVersion,
      "doc_jethwani"
    );
    assert.strictEqual(resV1.status, "updated");

    // Attempt second edit using stale v0 version check - must reject
    const resStale = await consultationService.saveDraft(
      intake.id,
      { historyPresentIllness: "Stale edit attempt" },
      intake.recordVersion, // stale expected version 0
      "doc_jethwani"
    );
    assert.strictEqual(resStale.status, "version_conflict");
    if (resStale.status === "version_conflict") {
      assert.strictEqual(resStale.currentEntity.recordVersion, 1);
      assert.strictEqual(resStale.currentEntity.historyPresentIllness, "HPI edit 1");
    }
  });

  // 7. Type-specific Validation Check: Follow up Consultations
  await test("EncounterService: should validate follow-up consultation intake items", async () => {
    const enc = await encounterService.createEncounter({
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      practitionerId: toPractitionerId("doc_jethwani"),
      encounterType: "follow_up",
      encounterDate: new Date().toISOString(),
      createdBy: "doc_jethwani"
    });

    const intake = await consultationService.createIntake({
      encounterId: toEncounterId(enc.id),
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_pune"),
      createdBy: "doc_jethwani"
    });

    // Save empty follow-up details: should fail submission
    const resEmpty = await encounterService.submitEncounterForReview(
      enc.id,
      { actorId: "doc_jethwani", organizationId: "org_pune" },
      intake
    );
    assert.strictEqual(resEmpty.success, false);
    assert.ok(resEmpty.validationIssues.map(i => i.code).includes("MISSING_FOLLOWUP_DETAILS"));

    // Populate follow-up details correctly
    const intakeWithDetails = await consultationService.saveDraft(
      intake.id,
      {
        followUpDetails: {
          responseSincePreviousTreatment: "General energy improved 40%, headache milder",
          symptomUpdates: [
            {
              symptomId: toSymptomId("sym_headache"),
              patientWording: "Splitting head",
              normalizedName: "Headache",
              changeStatus: "better"
            }
          ],
          newSymptoms: [],
          currentAssessment: "Psora active, headache responding to Silicea 200c"
        }
      },
      intake.recordVersion, // expected version 0
      "doc_jethwani"
    );

    assert.strictEqual(intakeWithDetails.status, "updated");

    if (intakeWithDetails.status === "updated") {
      const resValid = await encounterService.submitEncounterForReview(
        enc.id,
        { actorId: "doc_jethwani", organizationId: "org_pune" },
        intakeWithDetails.entity
      );
      assert.strictEqual(resValid.success, true);
      assert.strictEqual(resValid.encounter!.status, "ready_for_review");
    }
  });

  console.log(`\n🏁 Encounter & Intake Test suite finished. Passed: ${passedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
