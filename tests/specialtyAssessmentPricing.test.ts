import assert from "assert";
import fs from "fs";
import path from "path";
import {
  SPECIALTY_CLINICAL_AREAS,
  SPECIALTY_ORGAN_SYSTEMS,
  SPECIALTY_SUPPORT_TIERS,
  EXPERT_REVIEW_OPTIONS,
  getClinicalAreaLeadership,
  calculateSpecialtyTierTotal,
  createSpecialtyAssessmentRequest,
  formatSpecialtyTierTotal,
} from "../src/lib/specialtyPrograms";

function runSpecialtyAssessmentPricingTests() {
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.constitutional.weeklyPrice, 6_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.advanced.weeklyPrice, 9_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.complete.weeklyPrice, 12_000);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.constitutional.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.advanced.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.complete.durations, [1, 2, 4, 8, 12]);

  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 2), 11_400);
  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 12), 57_600);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 4), 32_400);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 12), 86_400);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 2), 22_800);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 4), 43_200);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 12), 115_200);
  assert.strictEqual(formatSpecialtyTierTotal("complete", 12), "₹1,15,200");
  assert.strictEqual(formatSpecialtyTierTotal("complete", 1), "₹12,000");
  assert.strictEqual(formatSpecialtyTierTotal("complete", 2), "₹22,800");

  const expectedOrganSystems = [
    "Cardiology",
    "Neurology",
    "Psychiatry",
    "Pulmonology",
    "Gastroenterology",
    "Hepatology",
    "Nephrology",
    "Urology",
    "Endocrinology",
    "Dermatology",
    "Gynecology",
    "Rheumatology",
    "Ophthalmology",
    "ENT",
    "Immunology",
    "Oncology",
    "Infectious Diseases",
    "Orthopedics",
    "Pediatrics",
    "Geriatrics",
  ];
  assert.deepStrictEqual([...SPECIALTY_ORGAN_SYSTEMS].sort(), expectedOrganSystems.sort());
  assert.strictEqual(SPECIALTY_CLINICAL_AREAS.length, 17);

  const areaIds = SPECIALTY_CLINICAL_AREAS.map((area) => area.id);
  assert.strictEqual(new Set(areaIds).size, areaIds.length, "Clinical area IDs must be unique");
  for (const area of SPECIALTY_CLINICAL_AREAS) {
    assert.ok(area.conditions.length >= 5, `${area.title} must provide searchable condition examples`);
    assert.ok(area.supportBoundary.length > 30, `${area.title} must explain its support boundary`);
    assert.ok(area.urgentBoundary && area.urgentBoundary.length > 30, `${area.title} must include an urgent-care boundary`);
    assert.ok(area.allowedTierKeys.length > 0, `${area.title} must expose physician-assignable care levels`);
  }

  const request = createSpecialtyAssessmentRequest({
    areaId: "heart-circulation",
    condition: "Hypertension",
    organSystemBreadth: "4-5",
    requestedExpertReview: "independent-specialist-opinion",
  });
  assert.strictEqual(request.kind, "clinical-assessment");
  assert.strictEqual(request.paymentAllowed, false);
  assert.strictEqual(request.condition, "Hypertension");
  assert.strictEqual(request.organSystemBreadth, "4-5");
  assert.strictEqual(request.requestedExpertReview, "independent-specialist-opinion");
  assert.strictEqual("finalPrice" in request, false, "A specialty assessment must not contain a payable total");
  assert.throws(
    () => createSpecialtyAssessmentRequest({ areaId: "unknown", condition: "Concern", organSystemBreadth: "1", requestedExpertReview: "none" }),
    /Unknown specialty clinical area/,
  );
  assert.throws(
    () => createSpecialtyAssessmentRequest({ areaId: "heart-circulation", condition: " ", organSystemBreadth: "1", requestedExpertReview: "none" }),
    /condition or concern is required/i,
  );

  const cancer = SPECIALTY_CLINICAL_AREAS.find((area) => area.id === "cancer-wellbeing");
  assert.ok(cancer);
  assert.deepStrictEqual(cancer.allowedTierKeys, ["advanced", "complete"]);
  assert.match(cancer.description, /never a replacement/i);
  assert.match(cancer.supportBoundary, /Oncology treatment/i);
  assert.ok(EXPERT_REVIEW_OPTIONS.some((option) => option.key === "independent-specialist-opinion"));
  assert.ok(EXPERT_REVIEW_OPTIONS.some((option) => option.key === "multidisciplinary-case-conference"));
  assert.match(getClinicalAreaLeadership(cancer).careLead, /treating specialist leads/i);

  const storeSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/store/page.tsx"), "utf8");
  const directorySource = fs.readFileSync(path.resolve(process.cwd(), "src/components/SpecialtySupportDirectory.tsx"), "utf8");
  const plannerSource = fs.readFileSync(path.resolve(process.cwd(), "src/components/PatientPricingPlanner.tsx"), "utf8");
  assert.ok(storeSource.length > 0);
  assert.ok(directorySource.length > 0);
  assert.ok(plannerSource.length > 0);

  console.log("✅ Specialty assessment pricing tests passed");
}

runSpecialtyAssessmentPricingTests();
