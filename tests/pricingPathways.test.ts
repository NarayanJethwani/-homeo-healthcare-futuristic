import assert from "assert";
import {
  CARE_LEVELS_DETAILS,
  COMPLETE_HEALTH_TRANSFORMATION_DURATIONS,
  PUBLIC_CARE_LEVEL_KEYS,
  calculateCarePrice,
  calculateCompleteHealthTransformationPrice,
  toPublicCarePathway,
} from "../src/lib/pricingConfig";

function runPricingPathwayTests() {
  assert.deepStrictEqual(PUBLIC_CARE_LEVEL_KEYS, ["mild", "moderate", "focused"]);
  assert.strictEqual(CARE_LEVELS_DETAILS.mild.weeklyPrice, 2_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.moderate.weeklyPrice, 3_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.focused.weeklyPrice, 5_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.organ.weeklyPrice, 0);
  assert.strictEqual(CARE_LEVELS_DETAILS.organ.title, "Case-Specific Clinical Support");
  assert.match(CARE_LEVELS_DETAILS.organ.scopeMessage, /nothing is added automatically/i);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.weeklyPrice, 10_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.title, "Complete Health Transformation Program");
  assert.match(CARE_LEVELS_DETAILS.focused.scopeMessage, /no automatic symptom or organ-system charge/i);
  assert.match(CARE_LEVELS_DETAILS.comprehensive.scopeMessage, /duration is assigned only after physician assessment/i);
  assert.deepStrictEqual(COMPLETE_HEALTH_TRANSFORMATION_DURATIONS, [1, 2, 4, 8, 12]);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.defaultDurationWeeks, 2);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(1).total, 10_000);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(2).total, 20_000);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(4).total, 40_000);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(8).total, 80_000);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(12).total, 120_000);
  assert.throws(() => calculateCompleteHealthTransformationPrice(3), /Unsupported duration/);

  assert.deepStrictEqual(CARE_LEVELS_DETAILS.mild.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(CARE_LEVELS_DETAILS.moderate.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(CARE_LEVELS_DETAILS.focused.durations, [1, 2, 4, 8, 12]);
  assert.strictEqual(CARE_LEVELS_DETAILS.moderate.defaultDurationWeeks, 4);
  assert.strictEqual(CARE_LEVELS_DETAILS.focused.defaultDurationWeeks, 4);
  assert.strictEqual(calculateCarePrice({ pathway: "moderate", durationWeeks: 2 }).total, 6_000);
  assert.strictEqual(calculateCarePrice({ pathway: "focused", durationWeeks: 2 }).total, 10_000);

  assert.deepStrictEqual(
    calculateCarePrice({ pathway: "moderate", durationWeeks: 8 }),
    {
      baseCareTotal: 24_000,
      additionalAcuteEpisodeTotal: 0,
      priorityAcuteSupportTotal: 0,
      total: 24_000,
    },
  );

  assert.strictEqual(
    calculateCarePrice({
      pathway: "mild",
      durationWeeks: 2,
      additionalAcuteEpisode: true,
      priorityAcuteSupport: true,
    }).total,
    9_000,
  );

  assert.strictEqual(
    calculateCarePrice({ pathway: "focused", durationWeeks: 4, additionalAcuteEpisode: true }).total,
    20_000,
    "Acute episode pricing must never leak into constitutional pathways",
  );

  assert.strictEqual(
    calculateCarePrice({ pathway: "moderate", durationWeeks: 1 }).total,
    3_000,
  );

  assert.strictEqual(toPublicCarePathway("Core Chronic Care"), "moderate");
  assert.strictEqual(toPublicCarePathway("Deep Constitutional Care"), "focused");
  assert.strictEqual(toPublicCarePathway("Multisystem Integrative Care"), "focused");

  console.log("✅ Pricing pathway tests passed");
}

runPricingPathwayTests();
