import assert from "assert";
import {
  applyPhysicianPathwayOverride,
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
  assert.strictEqual(acute.weeklyFee, 2_000);
  assert.strictEqual(acute.suggestedDurationWeeks, 1);
  assert.deepStrictEqual(acute.allowedDurationsWeeks, [1, 2, 4, 8, 12]);

  const constitutional = recommendClinicalCare(standardChronic);
  assert.strictEqual(constitutional.pathway, "moderate");
  assert.strictEqual(constitutional.weeklyFee, 3_000);
  assert.deepStrictEqual(constitutional.allowedDurationsWeeks, [1, 2, 4, 8, 12]);

  const organCountAlone = recommendClinicalCare({ ...standardChronic, breadth: "six-plus" });
  assert.notStrictEqual(organCountAlone.pathway, "comprehensive");
  assert.match(organCountAlone.cautions.join(" "), /never changes the fee automatically/i);

  const advanced = recommendClinicalCare({
    ...standardChronic,
    breadth: "four-five",
    pathologyDepth: "structural",
    chronicity: "one-five-years",
  });
  assert.strictEqual(advanced.pathway, "focused");
  assert.strictEqual(advanced.weeklyFee, 5_000);
  assert.strictEqual(advanced.suggestedDurationWeeks, 8);

  const manualComplete = applyPhysicianPathwayOverride(advanced, "comprehensive");
  assert.strictEqual(manualComplete.pathway, "comprehensive");
  assert.strictEqual(manualComplete.weeklyFee, 10_000);
  assert.match(manualComplete.reasons[0], /physician manually selected/i);

  const complete = recommendClinicalCare({
    ...standardChronic,
    breadth: "six-plus",
    pathologyDepth: "advanced",
    intensity: "frequent",
    coordination: "extensive",
  });
  assert.strictEqual(complete.pathway, "comprehensive");
  assert.strictEqual(complete.weeklyFee, 10_000);

  const redFlag = recommendClinicalCare({ ...standardChronic, stability: "red-flag" });
  assert.strictEqual(redFlag.blockedBySafetyGate, true);
  assert.throws(() => buildClinicalCareQuote({ recommendation: redFlag, durationWeeks: 4 }), /safety gate/i);

  const senior = recommendClinicalCare({ ...standardChronic, accessConsideration: "senior" });
  assert.strictEqual(senior.weeklyFee, constitutional.weeklyFee, "Senior status must never alter the base fee automatically");

  const quote = buildClinicalCareQuote({
    recommendation: advanced,
    durationWeeks: 4,
    caseSpecificSupportAmount: 3_000,
    pharmacyItems: [{ id: "cream", type: "Cream", details: "30 g", quantity: 2, unitPrice: 500, amount: 1_000 }],
    concessionAmount: 2_000,
  });
  assert.deepStrictEqual(quote, {
    weeklyCareFee: 5_000,
    durationWeeks: 4,
    baseCareTotal: 20_000,
    caseSpecificSupportTotal: 3_000,
    pharmacyTotal: 1_000,
    subtotal: 24_000,
    concessionTotal: 2_000,
    finalTotal: 22_000,
  });

  console.log("✅ Clinical care simulator tests passed");
}

runClinicalCareSimulatorTests();
