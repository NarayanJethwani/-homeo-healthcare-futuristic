import assert from "assert";
import {
  CARE_LEVELS_DETAILS,
  CARE_PLAN_CATALOG,
  CARE_PLAN_CATALOG_VERSION,
  COMPLETE_HEALTH_TRANSFORMATION_DURATIONS,
  PUBLIC_CARE_LEVEL_KEYS,
  calculateCarePrice,
  calculateCarePlanTotal,
  calculateCompleteHealthTransformationPrice,
  calculateContinuityCareTotal,
  buildGoogleSheetsCarePeriodWeeksFormula,
  buildGoogleSheetsCareRateFormula,
  buildGoogleSheetsContinuityBenefitFormula,
  toPublicCarePathway,
} from "../src/lib/pricingConfig";

function runPricingPathwayTests() {
  assert.deepStrictEqual(PUBLIC_CARE_LEVEL_KEYS, ["mild", "chronic_focused", "moderate", "focused"]);
  assert.strictEqual(CARE_PLAN_CATALOG_VERSION, "care-plan-catalog-v3");
  assert.strictEqual(CARE_PLAN_CATALOG.acute_mild_3d.price, 1_000);
  assert.strictEqual(CARE_PLAN_CATALOG.acute_mild_3d.durationValue, 3);
  assert.strictEqual(CARE_PLAN_CATALOG.acute_mild_3d.durationUnit, "day");
  assert.strictEqual(CARE_PLAN_CATALOG.acute_wellness_7d.price, 2_000);
  assert.strictEqual(CARE_PLAN_CATALOG.acute_wellness_7d.durationValue, 7);
  assert.strictEqual(CARE_PLAN_CATALOG.chronic_focused_1w.price, 3_000);
  assert.strictEqual(CARE_PLAN_CATALOG.chronic_integrated_1w.price, 6_000);
  assert.strictEqual(CARE_PLAN_CATALOG.chronic_complex_1w.price, 9_000);
  assert.strictEqual(CARE_PLAN_CATALOG.chronic_advanced_1w.price, 12_000);
  assert.deepStrictEqual(calculateCarePlanTotal("acute_mild_3d"), { listTotal: 1_000, discountPercent: 0, discountAmount: 0, total: 1_000 });
  assert.throws(() => calculateCarePlanTotal("acute_mild_3d", 2), /fixed 3 days/i);
  assert.strictEqual(calculateCarePlanTotal("chronic_focused_1w", 4).total, 10_800);
  assert.strictEqual(CARE_LEVELS_DETAILS.mild.weeklyPrice, 2_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.mild.title, "Acute Wellness Care");
  assert.strictEqual(CARE_LEVELS_DETAILS.chronic_focused.weeklyPrice, 3_000);
  assert.match(CARE_LEVELS_DETAILS.mild.scopeMessage, /not emergency|red flags/i);
  assert.strictEqual(CARE_LEVELS_DETAILS.moderate.weeklyPrice, 6_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.focused.weeklyPrice, 9_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.organ.weeklyPrice, 0);
  assert.strictEqual(CARE_LEVELS_DETAILS.organ.title, "Case-Specific Clinical Support");
  assert.match(CARE_LEVELS_DETAILS.organ.scopeMessage, /nothing is added automatically/i);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.weeklyPrice, 12_000);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.title, "Advanced Physician Care");
  assert.match(CARE_LEVELS_DETAILS.focused.scopeMessage, /₹9,000\/week care fee/i);
  assert.match(CARE_LEVELS_DETAILS.comprehensive.scopeMessage, /agreed individual scope are included/i);
  assert.deepStrictEqual(COMPLETE_HEALTH_TRANSFORMATION_DURATIONS, [1, 2, 4, 8, 12]);
  assert.strictEqual(CARE_LEVELS_DETAILS.comprehensive.defaultDurationWeeks, 4);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(1).total, 12_000);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(2).total, 22_800);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(4).total, 43_200);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(8).total, 81_600);
  assert.strictEqual(calculateCompleteHealthTransformationPrice(12).total, 115_200);
  assert.throws(() => calculateCompleteHealthTransformationPrice(3), /Unsupported duration/);

  assert.deepStrictEqual(CARE_LEVELS_DETAILS.mild.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(CARE_LEVELS_DETAILS.moderate.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(CARE_LEVELS_DETAILS.focused.durations, [1, 2, 4, 8, 12]);
  assert.strictEqual(CARE_LEVELS_DETAILS.moderate.defaultDurationWeeks, 4);
  assert.strictEqual(CARE_LEVELS_DETAILS.focused.defaultDurationWeeks, 4);
  assert.strictEqual(calculateCarePrice({ pathway: "moderate", durationWeeks: 2 }).total, 11_400);
  assert.strictEqual(calculateCarePrice({ pathway: "focused", durationWeeks: 2 }).total, 17_100);

  assert.deepStrictEqual(
    calculateCarePrice({ pathway: "moderate", durationWeeks: 8 }),
    {
      listCareTotal: 48_000,
      continuityDiscountPercent: 15,
      continuityDiscountTotal: 7_200,
      baseCareTotal: 40_800,
      additionalAcuteEpisodeTotal: 0,
      priorityAcuteSupportTotal: 0,
      total: 40_800,
    },
  );

  assert.strictEqual(
    calculateCarePrice({
      pathway: "mild",
      durationWeeks: 2,
      additionalAcuteEpisode: true,
      priorityAcuteSupport: true,
    }).total,
    8_800,
  );

  assert.strictEqual(
    calculateCarePrice({ pathway: "focused", durationWeeks: 4, additionalAcuteEpisode: true }).total,
    32_400,
    "Acute episode pricing must never leak into constitutional pathways",
  );

  assert.strictEqual(
    calculateCarePrice({ pathway: "moderate", durationWeeks: 1 }).total,
    6_000,
  );

  assert.deepStrictEqual(calculateContinuityCareTotal(6_000, 12), {
    listTotal: 72_000,
    discountPercent: 20,
    discountAmount: 14_400,
    total: 57_600,
  });

  assert.strictEqual(toPublicCarePathway("Core Chronic Care"), "moderate");
  assert.strictEqual(toPublicCarePathway("Focused Chronic Care"), "chronic_focused");
  assert.strictEqual(toPublicCarePathway("Focused Clinical Care"), "chronic_focused");
  assert.strictEqual(toPublicCarePathway("Deep Constitutional Care"), "focused");
  assert.strictEqual(toPublicCarePathway("Multisystem Integrative Care"), "focused");

  const sheetsFormula = buildGoogleSheetsCareRateFormula();
  assert.match(sheetsFormula, /Acute Wellness/);
  assert.match(sheetsFormula, /Integrated Clinical/);
  assert.match(sheetsFormula, /Focused Chronic/);
  assert.match(sheetsFormula, /Complex Clinical/);
  assert.match(sheetsFormula, /Advanced Physician/);
  assert.match(sheetsFormula, /2000/);
  assert.match(sheetsFormula, /3000/);
  assert.match(sheetsFormula, /6000/);
  assert.match(sheetsFormula, /9000/);
  assert.match(sheetsFormula, /12000/);
  assert.doesNotMatch(sheetsFormula, /IF\(B4="Weekly", 5000, 20000\)/);
  assert.strictEqual(buildGoogleSheetsCarePeriodWeeksFormula(), 'IF(B4="Monthly", C4*4, C4)');
  const sheetsBenefitFormula = buildGoogleSheetsContinuityBenefitFormula();
  assert.match(sheetsBenefitFormula, /=2, 5%/);
  assert.match(sheetsBenefitFormula, /=4, 10%/);
  assert.match(sheetsBenefitFormula, /=8, 15%/);
  assert.match(sheetsBenefitFormula, /=12, 20%/);

  console.log("✅ Pricing pathway tests passed");
}

runPricingPathwayTests();
