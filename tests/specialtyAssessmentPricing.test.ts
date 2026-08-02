import assert from "assert";
import fs from "fs";
import path from "path";
import {
  SPECIALTY_CLINICAL_AREAS,
  SPECIALTY_ORGAN_SYSTEMS,
  SPECIALTY_SUPPORT_TIERS,
  calculateSpecialtyTierTotal,
  createSpecialtyAssessmentRequest,
  formatSpecialtyTierTotal,
} from "../src/lib/specialtyPrograms";

function runSpecialtyAssessmentPricingTests() {
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.constitutional.weeklyPrice, 3_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.advanced.weeklyPrice, 5_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.complete.weeklyPrice, 10_000);

  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 2), 6_000);
  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 12), 36_000);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 4), 20_000);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 12), 60_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 2), 20_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 4), 40_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 12), 120_000);
  assert.strictEqual(formatSpecialtyTierTotal("complete", 12), "₹1,20,000");
  assert.strictEqual(formatSpecialtyTierTotal("complete", 2), "₹20,000");

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
  });
  assert.strictEqual(request.kind, "clinical-assessment");
  assert.strictEqual(request.paymentAllowed, false);
  assert.strictEqual(request.condition, "Hypertension");
  assert.strictEqual(request.organSystemBreadth, "4-5");
  assert.strictEqual("finalPrice" in request, false, "A specialty assessment must not contain a payable total");
  assert.throws(
    () => createSpecialtyAssessmentRequest({ areaId: "unknown", condition: "Concern", organSystemBreadth: "1" }),
    /Unknown specialty clinical area/,
  );
  assert.throws(
    () => createSpecialtyAssessmentRequest({ areaId: "heart-circulation", condition: " ", organSystemBreadth: "1" }),
    /condition or concern is required/i,
  );

  const cancer = SPECIALTY_CLINICAL_AREAS.find((area) => area.id === "cancer-wellbeing");
  assert.ok(cancer);
  assert.deepStrictEqual(cancer.allowedTierKeys, ["advanced", "complete"]);
  assert.match(cancer.description, /never a replacement/i);

  const storeSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/store/page.tsx"), "utf8");
  const directorySource = fs.readFileSync(path.resolve(process.cwd(), "src/components/SpecialtySupportDirectory.tsx"), "utf8");
  assert.match(storeSource, /No payment at this step/);
  assert.match(storeSource, /not an emergency service/);
  assert.match(directorySource, /Continue to Clinical Assessment/);
  assert.match(directorySource, /never creates an automatic surcharge/);
  assert.doesNotMatch(`${storeSource}\n${directorySource}`, /Proceed to Payment|Submit Order|checkoutStep.*payment/i);
  assert.doesNotMatch(`${storeSource}\n${directorySource}`, /parseInt\([^\n]*replace/, "Display prices must never be parsed into payable values");

  console.log("✅ Specialty directory, pricing, coverage, and assessment-safety tests passed");
}

runSpecialtyAssessmentPricingTests();
