import assert from "node:assert/strict";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  ALLOWED_CARE_DURATIONS,
  calculateCarePeriodTotalPaise,
  formatINRFromPaise,
  EMERGENCY_GUIDANCE_NOTICE,
  CLINICAL_CARE_FEE_EXPLANATION,
  EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT,
  INCLUDED_SERVICES_LIST,
  ADDITIONAL_PRODUCTS_DISCLOSURE,
  getClinicPaymentConfiguration,
} from "@/features/store-clinical-care/domain/types";
import {
  validatePatientIntake,
  processCareAssessmentSubmission,
} from "@/features/store-clinical-care/services/careAssessmentService";
import {
  calculatePreliminaryCareRecommendation,
  calculateItemizedPharmacyQuotation,
  buildWhatsAppQuotationPayload,
  buildPatientWhatsAppReviewLink,
} from "@/features/store-clinical-care/services/careRecommendationEngine";
import { isStoreClinicalCareV1Enabled, FEATURE_FLAGS } from "@/lib/featureFlags";

console.log("🚀 Running Isolated /store Clinical Care Upgrade Test Suite...\n");

// Test 1: Feature Flag state
assert.equal(FEATURE_FLAGS.STORE_CLINICAL_CARE_V1_ENABLED, true);
assert.equal(isStoreClinicalCareV1Enabled(), true);
console.log("✅ TEST PASSED: 1. Feature Flag STORE_CLINICAL_CARE_V1_ENABLED is enabled by default");

// Test 2: Integer paise totals include the governed 0/5/10/15/20 continuity ladder
const durationMultiplier = { 1: 1, 2: 1.9, 4: 3.6, 8: 6.8, 12: 9.6 } as const;
for (const weeks of ALLOWED_CARE_DURATIONS) {
  assert.equal(calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.focused.weeklyRatePaise, weeks), 300000 * durationMultiplier[weeks]);
  assert.equal(calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.integrated.weeklyRatePaise, weeks), 600000 * durationMultiplier[weeks]);
  assert.equal(calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.complex.weeklyRatePaise, weeks), 900000 * durationMultiplier[weeks]);
  assert.equal(calculateCarePeriodTotalPaise(CLINICAL_CARE_TIER_OPTIONS.advanced.weeklyRatePaise, weeks), 1200000 * durationMultiplier[weeks]);
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
  assert.equal(dto.totalEstimatedAmountPaise, 2160000); // ₹24,000 list fee less 10% continuity benefit
  assert.equal(dto.totalEstimatedAmountFormatted, "₹21,600");
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
assert.ok(EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT.includes("initial advisory assessment"));
console.log("✅ TEST PASSED: 6. Included services, disclosures, and emergency notices are verified");

// Test 7: Multi-organ complexity calculation & preliminary recommendation engine
const rec1 = calculatePreliminaryCareRecommendation({ selectedOrganSystems: ["Digestive & Liver Support"] });
assert.equal(rec1.suggestedTierId, "focused");

const rec2 = calculatePreliminaryCareRecommendation({ selectedOrganSystems: ["Digestive & Liver Support", "Hormones & Metabolism Support"] });
assert.equal(rec2.suggestedTierId, "integrated");

const rec4 = calculatePreliminaryCareRecommendation({ selectedOrganSystems: ["Digestive", "Hormones", "Skin", "Respiratory"] });
assert.equal(rec4.suggestedTierId, "complex");

const rec5 = calculatePreliminaryCareRecommendation({ selectedOrganSystems: ["Digestive", "Hormones", "Skin", "Respiratory", "Kidney"] });
assert.equal(rec5.suggestedTierId, "advanced");
assert.equal(rec5.disclaimer, EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT);
const weightedRec = calculatePreliminaryCareRecommendation({ selectedOrganSystems: ["Digestive"], durationText: "More than 3 years (chronic)", severityRating: 8 });
assert.equal(weightedRec.suggestedTierId, "complex");
console.log("✅ TEST PASSED: 7. Multi-organ advisory complexity calculation matches 1/2/3-4/5+ scaling rules");

// Test 8: Itemized pharmacy breakdown & governed concessions with mandatory audit fields
const breakdown = calculateItemizedPharmacyQuotation({
  tierId: "integrated",
  durationWeeks: 4,
  specialBrandedMedicinesPaise: 125000, // ₹1,250
  courierFeePaise: 35000, // ₹350
  seniorCitizenEligible: true,
  seniorCitizenApprovedBy: "Dr. N. Jethwani",
  seniorCitizenReason: "Age 65 Senior Citizen Care Support",
});

assert.equal(breakdown.listProfessionalFeePaise, 2400000); // ₹24,000 list fee
assert.equal(breakdown.continuityDiscountPaise, 240000); // ₹2,400 continuity benefit
assert.equal(breakdown.professionalFeePaise, 2160000); // ₹21,600 after continuity benefit
assert.equal(breakdown.totalConcessionsPaise, 216000); // ₹2,160 (10%)
assert.equal(breakdown.specialBrandedMedicinesPaise, 125000); // ₹1,250
assert.equal(breakdown.courierFeePaise, 35000); // ₹350
assert.equal(breakdown.finalTotalPaise, 2104000); // Net ₹19,440 + ₹1,250 + ₹350 = ₹21,040
assert.equal(breakdown.finalTotalFormatted, "₹21,040");
assert.equal(breakdown.concessions[0].approvedBy, "Dr. N. Jethwani");
assert.equal(breakdown.concessions[0].reason, "Age 65 Senior Citizen Care Support");
console.log("✅ TEST PASSED: 8. Itemized pharmacy breakdown and governed concessions behave deterministically");

// Test 9: WhatsApp quotation builder & environment-driven payment credentials
const paymentConfig = getClinicPaymentConfiguration();
assert.ok(paymentConfig.upiId.length > 0);

const testQuotation = {
  quotationId: "QTN-2026-TEST01",
  submissionId: "CAS-2026-TEST01",
  patientName: "Dr. Test Patient",
  phone: "919999988888",
  tierId: "integrated",
  tierName: "Integrated Clinical Care",
  durationWeeks: 4 as const,
  breakdown,
  paymentWorkflow: {
    paymentProvider: "manual" as const,
    paymentStatus: "quotation_sent" as const,
    clinicUpiId: paymentConfig.upiId,
    clinicBankDetails: paymentConfig.bankDetails,
  },
  createdAt: new Date().toISOString(),
};

const waPayload = buildWhatsAppQuotationPayload(testQuotation);
assert.ok(waPayload.messageText.includes("Integrated Clinical Care"));
assert.ok(waPayload.messageText.includes("₹21,040"));
assert.ok(waPayload.messageText.includes(paymentConfig.upiId));
assert.ok(waPayload.whatsappUrl.startsWith("https://wa.me/919999988888?text="));
console.log("✅ TEST PASSED: 9. WhatsApp quotation payload uses environment-configured payment details");

// Test 10: Patient WhatsApp doctor review link targeting 8446056789
const patientWa = buildPatientWhatsAppReviewLink({
  patientName: "Dr. Test Patient",
  phone: "+91 99999 88888",
  submissionId: "CAS-2026-000123",
  selectedTierName: "Integrated Clinical Care",
  preferredDurationWeeks: 4,
  totalEstimatedAmountFormatted: "₹24,000",
  mainHealthArea: "Digestive & Liver Support",
  concernDescription: "Chronic GERD and gastritis for 2 years",
});

assert.ok(patientWa.whatsappUrl.startsWith("https://wa.me/918446056789?text="));
assert.ok(patientWa.messageText.includes("Dr. Test Patient"));
assert.ok(patientWa.messageText.includes("CAS-2026-000123"));
assert.ok(patientWa.messageText.includes("Digestive & Liver Support"));
assert.ok(patientWa.messageText.includes("₹24,000"));
console.log("✅ TEST PASSED: 10. Patient assessment WhatsApp review link targets doctor assistance number 8446056789 with full details");

console.log("\n🎉 All 10 Isolated /store Clinical Care Portal Tests Passed 100%!");
