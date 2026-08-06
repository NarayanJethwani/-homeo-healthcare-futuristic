import assert from "node:assert/strict";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  EMERGENCY_GUIDANCE_NOTICE,
  CLINICAL_CARE_FEE_EXPLANATION,
  INCLUDED_SERVICES_LIST,
  ADDITIONAL_PRODUCTS_DISCLOSURE,
} from "@/features/store-clinical-care/domain/types";
import {
  validatePatientIntake,
  processCareAssessmentSubmission,
} from "@/features/store-clinical-care/services/careAssessmentService";
import { isStoreClinicalCareV1Enabled, FEATURE_FLAGS } from "@/lib/featureFlags";

console.log("🚀 Running Isolated /store Clinical Care Upgrade Test Suite...\n");

// Test 1: Feature Flag state
assert.equal(FEATURE_FLAGS.STORE_CLINICAL_CARE_V1_ENABLED, true);
assert.equal(isStoreClinicalCareV1Enabled(), true);
console.log("✅ TEST PASSED: 1. Feature Flag STORE_CLINICAL_CARE_V1_ENABLED is enabled by default");

// Test 2: Integer paise total calculation across all allowed durations
for (const weeks of ALLOWED_CARE_DURATIONS) {
  const focusedTotal = calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.focused.weeklyRatePaise, weeks);
  assert.equal(focusedTotal, 300000 * weeks);

  const integratedTotal = calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.integrated.weeklyRatePaise, weeks);
  assert.equal(integratedTotal, 600000 * weeks);

  const complexTotal = calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.complex.weeklyRatePaise, weeks);
  assert.equal(complexTotal, 900000 * weeks);

  const advancedTotal = calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.advanced.weeklyRatePaise, weeks);
  assert.equal(advancedTotal, 1200000 * weeks);
}

assert.equal(formatINRFromPaise(1200000), "₹12,000");
assert.equal(formatINRFromPaise(2400000), "₹24,000");
console.log("✅ TEST PASSED: 2. Complete care-period amounts calculate correctly in integer paise");

// Test 3: Absence of legacy package names and checkout language
const legacyPackageNames = [
  "Acute & Wellness Care",
  "Standard Chronic Care",
  "Deep Systemic Care",
  "Advanced Pathological Care",
  "Multisystem Integrative Care",
  "Acute Critical Care",
  "Order & Proceed to Payment",
  "Direct UPI Transfer",
];

const patientFacingTierNames = Object.values(CLINICAL_CARE_TIER_OPTIONS).map((t) => t.name);

for (const name of legacyPackageNames) {
  assert.equal(patientFacingTierNames.includes(name), false, `Legacy name '${name}' must not exist in new tier options`);
}
console.log("✅ TEST PASSED: 3. Legacy package names and direct checkout language are absent");

// Test 4: Intake validation
const invalidRes = validatePatientIntake({});
assert.equal(invalidRes.valid, false);
assert.ok(invalidRes.errors.some((e) => e.includes("Patient name")));
assert.ok(invalidRes.errors.some((e) => e.includes("phone number")));
assert.ok(invalidRes.errors.some((e) => e.includes("emergency guidance")));

const validIntake = {
  patientName: "Dr. Test Patient",
  phone: "+91 99999 88888",
  email: "test@homeo.healthcare",
  mainHealthArea: "Respiratory & Allergy",
  concernDescription: "Chronic sinusitis and nasal congestion for over 2 years",
  preferredDurationWeeks: 4 as const,
  selectedTierId: "integrated",
  emergencyAcknowledged: true,
  accuracyConfirmed: true,
};

const validRes = validatePatientIntake(validIntake);
assert.equal(validRes.valid, true);
assert.equal(validRes.errors.length, 0);
console.log("✅ TEST PASSED: 4. Intake form validation rules behave deterministically");

// Test 5: Process assessment submission & verify DTO sanitization
const submissionResult = processCareAssessmentSubmission(validIntake);
assert.equal(submissionResult.success, true);

if (submissionResult.success) {
  const dto = submissionResult.data;
  assert.ok(dto.submissionId.startsWith("CAS-2026-"));
  assert.equal(dto.patientName, "Dr. Test Patient");
  assert.equal(dto.preferredDurationWeeks, 4);
  assert.equal(dto.totalEstimatedAmountPaise, 2400000); // ₹24,000 for 4 weeks @ ₹6,000/week
  assert.equal(dto.totalEstimatedAmountFormatted, "₹24,000");
  assert.equal(dto.status, "submitted_for_physician_review");

  // Verify NO internal clinical scores or Level 1-4 numbers are exposed
  const dtoKeys = Object.keys(dto);
  assert.equal(dtoKeys.includes("levelNumber"), false);
  assert.equal(dtoKeys.includes("internalScore"), false);
  assert.equal(dtoKeys.includes("physicianNotes"), false);
}
console.log("✅ TEST PASSED: 5. Assessment submission returns sanitized DTO without internal scores or payment requests");

// Test 6: Inclusions & Disclosures
assert.ok(INCLUDED_SERVICES_LIST.includes("Physician assessment and treatment planning"));
assert.ok(INCLUDED_SERVICES_LIST.includes("Routine homeopathic medicines prescribed and dispensed by Homeo Healthcare"));
assert.ok(ADDITIONAL_PRODUCTS_DISCLOSURE.includes("charged separately only when clinically required"));
assert.ok(EMERGENCY_GUIDANCE_NOTICE.includes("not intended for medical emergencies"));
assert.ok(CLINICAL_CARE_FEE_EXPLANATION.includes("professional time, treatment planning, clinical supervision"));
console.log("✅ TEST PASSED: 6. Included services, disclosures, and emergency notices are verified");

console.log("\n🎉 All 6 Isolated /store Clinical Care Upgrade Tests Passed 100%!");
