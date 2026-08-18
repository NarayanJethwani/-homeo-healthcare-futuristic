import assert from "assert";
import {
  applyPhysicianPathwayOverride,
  applyPhysicianPlanOverride,
  buildClinicalCareQuote,
  recommendClinicalCare,
  type ClinicalCareAssessment,
} from "../src/lib/clinicalCareSimulator";

const standardChronic: ClinicalCareAssessment = {
  breadth: "two-three",
  pathologyDepth: "established",
  chronicity: "months",
  intensity: "standard",
  coordination: "minimal",
  stability: "stable",
  accessConsideration: "none",
};

function runClinicalCareSimulatorTests() {
  const acute = recommendClinicalCare({
    ...standardChronic,
    breadth: "one",
    pathologyDepth: "functional",
    chronicity: "recent",
  });
  assert.strictEqual(acute.pathway, "mild");
  assert.strictEqual(acute.planId, "acute_mild_3d");
  assert.strictEqual(acute.weeklyFee, 1_000);
  assert.strictEqual(acute.durationValue, 3);
  assert.strictEqual(acute.durationUnit, "day");
  assert.strictEqual(acute.suggestedDurationWeeks, 1);
  assert.deepStrictEqual(acute.allowedDurationsWeeks, [1]);
  const acuteQuote = buildClinicalCareQuote({ recommendation: acute, durationWeeks: 1 });
  assert.strictEqual(acuteQuote.baseCareTotal, 1_000);
  assert.strictEqual(acuteQuote.durationValue, 3);
  assert.strictEqual(acuteQuote.durationUnit, "day");
  assert.strictEqual(acuteQuote.continuityDiscountPercent, 0);
  const acuteWellness = applyPhysicianPlanOverride(acute, "acute_wellness_7d");
  assert.strictEqual(acuteWellness.carePeriodFee, 2_000);
  assert.strictEqual(acuteWellness.durationValue, 7);

  const basePathway = recommendClinicalCare(standardChronic);
  assert.strictEqual(basePathway.pathway, "chronic_focused");
  assert.strictEqual(basePathway.planId, "chronic_focused_1w");
  assert.strictEqual(basePathway.weeklyFee, 3_000);
  assert.deepStrictEqual(basePathway.allowedDurationsWeeks, [1, 2, 4, 8, 12]);

  const organCountAlone = recommendClinicalCare({ ...standardChronic, breadth: "six-plus" });
  assert.strictEqual(organCountAlone.pathway, basePathway.pathway);
  assert.strictEqual(organCountAlone.weeklyFee, basePathway.weeklyFee);
  assert.match(organCountAlone.cautions.join(" "), /never change the fee automatically/i);

  const advanced = recommendClinicalCare({
    ...standardChronic,
    breadth: "four-five",
    pathologyDepth: "structural",
    chronicity: "one-five-years",
    intensity: "frequent",
  });
  assert.strictEqual(advanced.pathway, "focused");
  assert.strictEqual(advanced.weeklyFee, 9_000);
  assert.strictEqual(advanced.suggestedDurationWeeks, 4);

  const manualComplete = applyPhysicianPathwayOverride(advanced, "comprehensive");
  assert.strictEqual(manualComplete.pathway, "comprehensive");
  assert.strictEqual(manualComplete.weeklyFee, 12_000);
  assert.match(manualComplete.reasons[0], /physician manually selected/i);

  const complete = recommendClinicalCare({
    ...standardChronic,
    breadth: "six-plus",
    pathologyDepth: "advanced",
    intensity: "direct",
    coordination: "extensive",
  });
  assert.strictEqual(complete.pathway, "comprehensive");
  assert.strictEqual(complete.weeklyFee, 12_000);

  const redFlag = recommendClinicalCare({ ...standardChronic, stability: "red-flag" });
  assert.strictEqual(redFlag.blockedBySafetyGate, true);
  assert.throws(() => buildClinicalCareQuote({ recommendation: redFlag, durationWeeks: 4 }), /safety gate/i);

  const rapidChange = recommendClinicalCare({ ...standardChronic, stability: "rapid-change" });
  assert.strictEqual(rapidChange.blockedBySafetyGate, true);

  const senior = recommendClinicalCare({ ...standardChronic, accessConsideration: "senior" });
  assert.strictEqual(senior.weeklyFee, basePathway.weeklyFee, "Senior status must never alter the base fee automatically");

  const quote = buildClinicalCareQuote({
    recommendation: advanced,
    durationWeeks: 4,
    caseSpecificSupportAmount: 3_000,
    pharmacyItems: [{ id: "cream", type: "Cream", details: "30 g", quantity: 2, unitPrice: 500, amount: 1_000 }],
    concessionAmount: 2_000,
  });
  assert.deepStrictEqual(quote, {
    planId: "chronic_complex_1w",
    planFamily: "chronic",
    durationValue: 4,
    durationUnit: "week",
    weeklyCareFee: 9_000,
    durationWeeks: 4,
    listCareTotal: 36_000,
    continuityDiscountPercent: 10,
    continuityDiscountTotal: 3_600,
    baseCareTotal: 32_400,
    caseSpecificSupportTotal: 3_000,
    pharmacyTotal: 1_000,
    subtotal: 36_400,
    concessionTotal: 2_000,
    finalTotal: 34_400,
  });

  console.log("✅ Clinical care simulator tests passed");
}

runClinicalCareSimulatorTests();
