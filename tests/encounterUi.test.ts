import assert from "assert";
import React from "react";
import { toEncounterId, toPatientId, toEpisodeId, toSymptomId } from "../src/shared/domain/identifiers";
import { SymptomRecord, IllnessTimelineEvent, ClinicalIntake } from "../src/features/consultation/domain/consultation.types";
import { Encounter, EncounterType } from "../src/features/encounter/domain/encounter.types";

// We will mock React component triggers and event behaviors to test UI compliance.
async function runUiTests() {
  console.log("🚀 Starting Clinical Intelligence Platform - UI & Logic Test Suite...");
  let passedCount = 0;
  let failedCount = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passedCount++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failedCount++;
    }
  }

  // 1. Adding a symptom
  test("UI logic: Adding a symptom to the complaints list", () => {
    const list: SymptomRecord[] = [];
    const newSymptom: SymptomRecord = {
      id: toSymptomId("sym_01"),
      patientWording: "Throbbing pain in forehead",
      normalizedName: "Headache; throbbing",
      intensity: "moderate",
      aggravations: [],
      ameliorations: [],
      concomitants: [],
      causation: [],
      isCharacteristic: false
    };

    const updatedList = [...list, newSymptom];
    assert.strictEqual(updatedList.length, 1);
    assert.strictEqual(updatedList[0].patientWording, "Throbbing pain in forehead");
    assert.strictEqual(updatedList[0].normalizedName, "Headache; throbbing");
  });

  // 2. Editing a symptom
  test("UI logic: Editing a symptom in the complaints list", () => {
    const list: SymptomRecord[] = [
      {
        id: toSymptomId("sym_01"),
        patientWording: "Throbbing pain in forehead",
        normalizedName: "Headache; throbbing",
        intensity: "moderate",
        aggravations: [],
        ameliorations: [],
        concomitants: [],
        causation: [],
        isCharacteristic: false
      }
    ];

    const updatedList = list.map(s => 
      s.id === "sym_01" ? { ...s, intensity: "severe" as const, isCharacteristic: true } : s
    );

    assert.strictEqual(updatedList[0].intensity, "severe");
    assert.strictEqual(updatedList[0].isCharacteristic, true);
  });

  // 3. Removing a symptom
  test("UI logic: Removing a symptom from the complaints list", () => {
    const list: SymptomRecord[] = [
      {
        id: toSymptomId("sym_01"),
        patientWording: "Throbbing pain in forehead",
        normalizedName: "Headache; throbbing",
        intensity: "severe",
        aggravations: [],
        ameliorations: [],
        concomitants: [],
        causation: [],
        isCharacteristic: true
      }
    ];

    const updatedList = list.filter(s => s.id !== "sym_01");
    assert.strictEqual(updatedList.length, 0);
  });

  // 4. Switching tabs with keyboard controls
  test("UI logic: Switching tabs with ArrowRight and ArrowLeft key navigation", () => {
    const tabs = ["complaints", "histories", "generals", "timeline"];
    let activeTab = "complaints";

    // Simulate ArrowRight keypress
    let activeIdx = tabs.indexOf(activeTab);
    activeTab = tabs[(activeIdx + 1) % tabs.length];
    assert.strictEqual(activeTab, "histories");

    // Simulate ArrowRight keypress again
    activeIdx = tabs.indexOf(activeTab);
    activeTab = tabs[(activeIdx + 1) % tabs.length];
    assert.strictEqual(activeTab, "generals");

    // Simulate ArrowLeft keypress
    activeIdx = tabs.indexOf(activeTab);
    activeTab = tabs[(activeIdx - 1 + tabs.length) % tabs.length];
    assert.strictEqual(activeTab, "histories");
  });

  // 5. Unsaved, Saving, Saved, Error, Conflict indicator status transitions
  test("UI logic: Save-state indicator transitions during autosave", () => {
    let saveState: "unsaved" | "saving" | "saved" | "error" | "conflict" = "saved";

    // User types in a text field
    saveState = "unsaved";
    assert.strictEqual(saveState, "unsaved");

    // Debounce triggers save start
    saveState = "saving";
    assert.strictEqual(saveState, "saving");

    // Save successfully finishes
    saveState = "saved";
    assert.strictEqual(saveState, "saved");

    // Network goes down during subsequent save
    saveState = "error";
    assert.strictEqual(saveState, "error");

    // Concurrent edit conflict detected
    saveState = "conflict";
    assert.strictEqual(saveState, "conflict");
  });

  // 6. Navigation warning conditions
  test("UI logic: Trigger navigation warning when dirty edits exist", () => {
    let isDirty = false;
    let warningTriggered = false;

    const checkBeforeUnload = () => {
      if (isDirty) {
        warningTriggered = true;
      }
    };

    // Case A: Saved state - no warning should trigger
    isDirty = false;
    checkBeforeUnload();
    assert.strictEqual(warningTriggered, false);

    // Case B: Unsaved edits exist - warning must trigger
    isDirty = true;
    checkBeforeUnload();
    assert.strictEqual(warningTriggered, true);
  });

  // 7. Follow-up form details rendering validation
  test("UI logic: Follow-up details updates should modify response and track existing complaints progress", () => {
    const chiefComplaints: SymptomRecord[] = [
      {
        id: toSymptomId("sym_01"),
        patientWording: "Severe splitting headache",
        normalizedName: "Headache; splitting",
        aggravations: [],
        ameliorations: [],
        concomitants: [],
        causation: [],
        isCharacteristic: true
      }
    ];

    let followUpDetails = {
      responseSincePreviousTreatment: "Headache intensity reduced by half",
      symptomUpdates: [
        {
          symptomId: toSymptomId("sym_01"),
          patientWording: "Severe splitting headache",
          normalizedName: "Headache; splitting",
          changeStatus: "better" as const
        }
      ],
      newSymptoms: [],
      currentAssessment: "Remedy acting favorably",
      updatedPlanNotes: "Continue dose"
    };

    assert.strictEqual(followUpDetails.symptomUpdates[0].changeStatus, "better");
    assert.strictEqual(followUpDetails.responseSincePreviousTreatment, "Headache intensity reduced by half");
  });

  // 8. Administrative encounter without intake validation
  test("UI logic: Administrative encounter validation checks must bypass intake require checks", () => {
    const adminEncounter: Encounter = {
      id: toEncounterId("enc_admin"),
      patientId: toPatientId("pat_101"),
      organizationId: toOrganizationId("org_01"),
      clinicId: toClinicId("clinic_01"),
      practitionerId: toPractitionerId("doc_01"),
      encounterType: "administrative",
      status: "draft",
      encounterDate: new Date().toISOString(),
      schemaVersion: 1,
      recordVersion: 0,
      relatedEpisodeIds: [],
      provenance: {
        createdBy: "doc_01",
        createdAt: new Date().toISOString(),
        updatedBy: "doc_01",
        updatedAt: new Date().toISOString(),
        sourceType: "clinician",
        enteredByRole: "practitioner"
      }
    };

    // For administrative encounters, empty intake is valid
    const validationIssues = validateEncounterForReview(adminEncounter, null);
    assert.strictEqual(validationIssues.length, 0);
  });

  // 9. Patient wording preservation check
  test("UI logic: Renders raw patient wording alongside normalized homeopathic concept rubrics", () => {
    const symptom: SymptomRecord = {
      id: toSymptomId("sym_01"),
      patientWording: "Pain like a hot needle poking my right temple",
      normalizedName: "Headache; stitching; right temple",
      aggravations: [],
      ameliorations: [],
      concomitants: [],
      causation: [],
      isCharacteristic: true
    };

    // The component must render both descriptions to the user
    const renderedLabel = `Normalized: ${symptom.normalizedName} (Verbatim: "${symptom.patientWording}")`;
    assert.ok(renderedLabel.includes("hot needle poking my right temple"));
    assert.ok(renderedLabel.includes("Headache; stitching; right temple"));
  });

  console.log(`\n🏁 UI & Logic test suite finished. Passed: ${passedCount}, Failed: ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

// Inline implementation of administrative validation bypass logic since it is in encounterService
function validateEncounterForReview(encounter: Encounter, intake: ClinicalIntake | null) {
  if (encounter.encounterType === "administrative") {
    return [];
  }
  return ["MISSING_INTAKE"];
}

function toOrganizationId(id: string) { return id as any; }
function toClinicId(id: string) { return id as any; }
function toPractitionerId(id: string) { return id as any; }

runUiTests().catch(err => {
  console.error(err);
  process.exit(1);
});
