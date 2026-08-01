import assert from "assert";
import fs from "fs";
import path from "path";
import {
  SPECIALTY_PROGRAMS,
  createSpecialtyAssessmentRequest,
  formatSpecialtyPriceRange,
  type SpecialtyProgram,
} from "../src/lib/specialtyPrograms";

function runSpecialtyAssessmentPricingTests() {
  const heartProgram = SPECIALTY_PROGRAMS.find((program) => program.id === "heart-care");
  assert.ok(heartProgram);
  assert.deepStrictEqual(heartProgram.priceRange, { minimum: 6_000, maximum: 10_000 });
  assert.strictEqual(formatSpecialtyPriceRange(heartProgram.priceRange), "₹6,000–₹10,000");

  const assessment = createSpecialtyAssessmentRequest(heartProgram);
  assert.strictEqual(assessment.kind, "clinical-assessment");
  assert.strictEqual(assessment.paymentAllowed, false);
  assert.strictEqual(assessment.durationText, "Physician-recommended after assessment");
  assert.strictEqual("finalPrice" in assessment, false, "A ranged specialty assessment must not contain a payable total");

  const invalidProgram: SpecialtyProgram = {
    ...heartProgram,
    id: "invalid-range",
    priceRange: { minimum: 20_000, maximum: 6_000 },
  };
  assert.throws(() => createSpecialtyAssessmentRequest(invalidProgram), /Invalid specialty price range/);

  for (const program of SPECIALTY_PROGRAMS) {
    const request = createSpecialtyAssessmentRequest(program);
    assert.strictEqual(request.paymentAllowed, false, `${program.title} must remain assessment-only`);
    assert.ok(program.priceRange.maximum >= program.priceRange.minimum);
  }

  const storeSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/store/page.tsx"), "utf8");
  assert.match(storeSource, /Continue to Clinical Assessment/);
  assert.match(storeSource, /No payment at this step/);
  assert.doesNotMatch(storeSource, /Proceed to Payment|Submit Order|checkoutStep.*payment/i);
  assert.doesNotMatch(storeSource, /parseInt\([^\n]*replace/, "Display ranges must never be converted into a payable amount");

  console.log("✅ Specialty assessment pricing tests passed");
}

runSpecialtyAssessmentPricingTests();
