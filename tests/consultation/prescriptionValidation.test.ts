import assert from "assert";
import {
  validatePrescriptionDraft,
  evaluateGuardedCompletionReadiness,
} from "../../src/features/consultation/utils/prescription-validation";
import { PrescriptionDraft } from "../../src/features/consultation/types/prescription.types";
import { DEFAULT_CLINICAL_NOTES } from "../../src/features/consultation/types/clinical-notes.types";

async function runPrescriptionValidationTests() {
  // Test 1: Non-prescription outcome requires NO prescription validation
  const nonRxResult = validatePrescriptionDraft({}, "no_prescription");
  assert.strictEqual(nonRxResult.valid, true);

  // Test 2: Incomplete prescription draft for prescription_issued fails validation
  const incompleteDraft: Partial<PrescriptionDraft> = {
    consultationId: "c1",
    patientId: "p1",
    revision: 1,
  };
  const invalidRxResult = validatePrescriptionDraft(incompleteDraft, "prescription_issued");
  assert.strictEqual(invalidRxResult.valid, false);
  assert.ok(invalidRxResult.errors.length >= 3);

  // Test 3: Complete valid prescription draft passes validation
  const validDraft: Partial<PrescriptionDraft> = {
    consultationId: "c1",
    patientId: "p1",
    selectedRemedyName: "Arsenicum Album",
    potency: { scale: "centesimal", value: "200C", displayLabel: "200C (CENTESIMAL)" },
    dose: "4 pills",
    repetition: "Twice daily",
    instructions: "Take after meals",
    revision: 1,
  };
  const validRxResult = validatePrescriptionDraft(validDraft, "prescription_issued");
  assert.strictEqual(validRxResult.valid, true);
  assert.strictEqual(validRxResult.errors.length, 0);

  // Test 4: evaluateGuardedCompletionReadiness blocks when notes incomplete
  const readiness = evaluateGuardedCompletionReadiness({
    notes: DEFAULT_CLINICAL_NOTES,
    outcome: "prescription_issued",
    prescriptionDraft: validDraft,
  });
  assert.strictEqual(readiness.ready, false);
  assert.ok(readiness.clinicalValidationErrors.length >= 1);

  // Test 5: evaluateGuardedCompletionReadiness passes when notes & prescription valid
  const populatedNotes = {
    ...DEFAULT_CLINICAL_NOTES,
    chiefComplaints: [
      { id: "cc1", complaint: "Gastritis with acidity", severity: "moderate" as const },
    ],
    historyOfPresentIllness: "Patient reports burning gastric pain for 3 weeks.",
  };
  const validReadiness = evaluateGuardedCompletionReadiness({
    notes: populatedNotes,
    outcome: "prescription_issued",
    prescriptionDraft: validDraft,
  });
  assert.strictEqual(validReadiness.ready, true);

  console.log("✅ Digital Prescription Pure Validation unit tests passed.");
}

runPrescriptionValidationTests();
