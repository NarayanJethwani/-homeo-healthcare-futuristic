import assert from "assert";
import {
  calculateCareEstimate,
  computeSuggestedLevel,
  CARE_FEE_CARD_LEVELS,
  MAINTENANCE_CARE_FEE_WEEKLY_INR,
  type ClinicalConcernInput,
} from "../src/lib/pricingConfig";

function runCareFeeCalculatorTests() {
  console.log("Running Care Fee Card & Calculator Unit Tests...");

  // Test 0: Maintenance fee placeholder verification
  assert.strictEqual(
    MAINTENANCE_CARE_FEE_WEEKLY_INR,
    null,
    "Maintenance fee must be undecided placeholder null"
  );

  // Test 0b: Rates verification
  assert.strictEqual(CARE_FEE_CARD_LEVELS.mild.weeklyFeeINR, 1_000);
  assert.strictEqual(CARE_FEE_CARD_LEVELS.moderate.weeklyFeeINR, 2_000);
  assert.strictEqual(CARE_FEE_CARD_LEVELS.complex.weeklyFeeINR, 3_000);

  // 1. Acidity only (Digestive, Mild): ₹1,000/wk; ₹2,000 for 2 wks.
  const test1Concerns: ClinicalConcernInput[] = [
    { name: "Acidity", organSystemId: "digestive", organSystemName: "Digestive", level: "mild" },
  ];
  const test1Result1Wk = calculateCareEstimate(test1Concerns, 1);
  assert.strictEqual(test1Result1Wk.weeklyFeeINR, 1_000, "Acidity weekly fee must be ₹1,000");
  assert.strictEqual(test1Result1Wk.effectiveDurationWeeks, 1, "Mild allows 1 week");
  assert.strictEqual(test1Result1Wk.totalEstimateINR, 1_000, "Acidity 1 week must be ₹1,000");

  const test1Result2Wks = calculateCareEstimate(test1Concerns, 2);
  assert.strictEqual(test1Result2Wks.weeklyFeeINR, 1_000);
  assert.strictEqual(test1Result2Wks.effectiveDurationWeeks, 2);
  assert.strictEqual(test1Result2Wks.totalEstimateINR, 2_000, "Acidity 2 weeks must be ₹2,000");

  // 2. Recurrent sinusitis (Respiratory & ENT, Moderate): ₹2,000/wk; ₹4,000 for 2 wks.
  const test2Concerns: ClinicalConcernInput[] = [
    {
      name: "Recurrent Sinusitis",
      organSystemId: "respiratory_ent",
      organSystemName: "Respiratory & ENT",
      level: "moderate",
    },
  ];
  const test2Result = calculateCareEstimate(test2Concerns, 2);
  assert.strictEqual(test2Result.weeklyFeeINR, 2_000, "Recurrent sinusitis weekly fee must be ₹2,000");
  assert.strictEqual(test2Result.effectiveDurationWeeks, 2);
  assert.strictEqual(test2Result.totalEstimateINR, 4_000, "Recurrent sinusitis 2 weeks must be ₹4,000");

  // 3. Sinusitis + acidity (two systems): ₹3,000/wk; ₹6,000 for 2 wks.
  const test3Concerns: ClinicalConcernInput[] = [
    {
      name: "Recurrent Sinusitis",
      organSystemId: "respiratory_ent",
      organSystemName: "Respiratory & ENT",
      level: "moderate",
    },
    { name: "Acidity", organSystemId: "digestive", organSystemName: "Digestive", level: "mild" },
  ];
  const test3Result = calculateCareEstimate(test3Concerns, 2);
  assert.strictEqual(test3Result.weeklyFeeINR, 3_000, "Sinusitis + Acidity weekly fee must be ₹3,000");
  assert.strictEqual(test3Result.totalEstimateINR, 6_000, "Sinusitis + Acidity 2 weeks must be ₹6,000");
  assert.strictEqual(test3Result.systemGroups.length, 2, "Must identify two distinct organ systems");

  // 4. Complex + moderate + mild (three systems): ₹6,000/wk; ₹12,000 for 2 wks.
  const test4Concerns: ClinicalConcernInput[] = [
    {
      name: "Chronic Asthma",
      organSystemId: "respiratory_ent",
      organSystemName: "Respiratory & ENT",
      level: "complex",
    },
    {
      name: "IBS",
      organSystemId: "digestive",
      organSystemName: "Digestive",
      level: "moderate",
    },
    {
      name: "Neck ache",
      organSystemId: "bones_joints",
      organSystemName: "Bones & Joints",
      level: "mild",
    },
  ];
  const test4Result = calculateCareEstimate(test4Concerns, 2);
  assert.strictEqual(test4Result.weeklyFeeINR, 6_000, "Complex + moderate + mild weekly fee must be ₹6,000");
  assert.strictEqual(test4Result.totalEstimateINR, 12_000, "Complex + moderate + mild 2 weeks must be ₹12,000");
  assert.strictEqual(test4Result.systemGroups.length, 3, "Must have 3 unique organ systems");

  // 5. Acidity (Mild) + IBS (Moderate), both Digestive: grouped, ₹2,000/wk, not ₹3,000.
  const test5Concerns: ClinicalConcernInput[] = [
    { name: "Acidity", organSystemId: "digestive", organSystemName: "Digestive", level: "mild" },
    { name: "IBS", organSystemId: "digestive", organSystemName: "Digestive", level: "moderate" },
  ];
  const test5Result = calculateCareEstimate(test5Concerns, 2);
  assert.strictEqual(
    test5Result.weeklyFeeINR,
    2_000,
    "Acidity + IBS in same digestive system must be billed at Moderate (₹2,000), NOT ₹3,000"
  );
  assert.strictEqual(test5Result.totalEstimateINR, 4_000);
  assert.strictEqual(test5Result.systemGroups.length, 1, "Must collapse into 1 group");
  assert.match(
    test5Result.systemGroups[0].groupingNote,
    /grouped under Digestive/i,
    "Must explain the organ system grouping in the note"
  );

  // 6. Moderate or complex with 1 week selected: auto-raised to 2 weeks.
  const test6Concerns: ClinicalConcernInput[] = [
    {
      name: "Chronic Asthma",
      organSystemId: "respiratory_ent",
      organSystemName: "Respiratory & ENT",
      level: "complex",
    },
  ];
  const test6Result = calculateCareEstimate(test6Concerns, 1);
  assert.strictEqual(test6Result.selectedDurationWeeks, 1);
  assert.strictEqual(test6Result.effectiveDurationWeeks, 2, "1 week must be auto-raised to 2 weeks minimum");
  assert.strictEqual(test6Result.durationAutoRaised, true);
  assert.strictEqual(test6Result.totalEstimateINR, 6_000, "Total must reflect 2 weeks minimum (₹3,000 * 2 = ₹6,000)");

  // 7. Empty concern list: fee 0, no estimate shown.
  const test7Result = calculateCareEstimate([], 2);
  assert.strictEqual(test7Result.hasConcerns, false);
  assert.strictEqual(test7Result.weeklyFeeINR, 0);
  assert.strictEqual(test7Result.totalEstimateINR, 0);
  assert.strictEqual(test7Result.systemGroups.length, 0);

  // Level Adjuster Rule Check
  const suggestedModerate = computeSuggestedLevel("mild", {
    chronicity: "3_months_plus",
    impactOnDailyLife: false,
    hasMedicalReports: false,
  });
  assert.strictEqual(suggestedModerate, "moderate", "3+ months must elevate mild to moderate");

  const cannotLowerBelowSuggested = computeSuggestedLevel("complex", {
    chronicity: "under_3_months",
    impactOnDailyLife: false,
    hasMedicalReports: false,
  });
  assert.strictEqual(cannotLowerBelowSuggested, "complex", "Default complex cannot be lowered below complex");

  console.log("All 7 Care Fee Calculator unit tests passed successfully!");
}

runCareFeeCalculatorTests();
