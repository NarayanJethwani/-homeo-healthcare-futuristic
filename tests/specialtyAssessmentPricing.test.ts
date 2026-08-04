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
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.constitutional.weeklyPrice, 3_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.advanced.weeklyPrice, 5_000);
  assert.strictEqual(SPECIALTY_SUPPORT_TIERS.complete.weeklyPrice, 10_000);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.constitutional.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.advanced.durations, [1, 2, 4, 8, 12]);
  assert.deepStrictEqual(SPECIALTY_SUPPORT_TIERS.complete.durations, [1, 2, 4, 8, 12]);

  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 2), 6_000);
  assert.strictEqual(calculateSpecialtyTierTotal("constitutional", 12), 36_000);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 4), 20_000);
  assert.strictEqual(calculateSpecialtyTierTotal("advanced", 12), 60_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 2), 20_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 4), 40_000);
  assert.strictEqual(calculateSpecialtyTierTotal("complete", 12), 120_000);
  assert.strictEqual(formatSpecialtyTierTotal("complete", 12), "₹1,20,000");
  assert.strictEqual(formatSpecialtyTierTotal("complete", 1), "₹10,000");
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
  const adminDashboardSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/admin/dashboard/page.tsx"), "utf8");
  const invoicePreviewSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/admin/invoice-preview/page.tsx"), "utf8");
  const invoiceRouteSource = fs.readFileSync(path.resolve(process.cwd(), "src/app/api/invoice/route.ts"), "utf8");
  const googleDriveSource = fs.readFileSync(path.resolve(process.cwd(), "src/lib/googleDrive.ts"), "utf8");
  const clinicBrandingSource = fs.readFileSync(path.resolve(process.cwd(), "src/lib/clinicBranding.ts"), "utf8");
  assert.match(storeSource, /No payment at this step/);
  assert.match(storeSource, /not an emergency service/);
  assert.match(directorySource, /Continue to Clinical Assessment/);
  assert.match(directorySource, /EXPERT_REVIEW_OPTIONS/);
  assert.match(directorySource, /Who leads your care/);
  assert.match(directorySource, /never creates an automatic surcharge/);
  assert.match(plannerSource, /Case-Specific Clinical Support/);
  assert.match(plannerSource, /Nothing is added automatically/);
  assert.match(plannerSource, /Fee confirmed[\s\S]*after assessment/);
  assert.doesNotMatch(plannerSource, /recordsPathologyReview|RECORDS_PATHOLOGY_REVIEW_PRICE|from ₹3,000/);
  assert.match(adminDashboardSource, /id="case-support-amount"/);
  assert.match(adminDashboardSource, /id="case-support-basis"/);
  assert.match(adminDashboardSource, /id="case-support-scope"/);
  assert.match(adminDashboardSource, /Add itemized fee to pending quotation/);
  assert.match(adminDashboardSource, /setInvoiceStatus\("Pending"\)/);
  assert.match(adminDashboardSource, /Acute & Wellness Care · 1 week/);
  assert.match(adminDashboardSource, /Complete Health Transformation · 2 weeks/);
  assert.match(adminDashboardSource, /Choose a confirmed care item/);
  assert.match(adminDashboardSource, /id="invoice-patient-select"/);
  assert.match(adminDashboardSource, /openInvoiceModal\(invoicePatient\)/);
  assert.match(adminDashboardSource, /const effectiveInvoiceNo = invoiceNo\.trim\(\) \|\| generateInvoiceNo\(\)/);
  assert.doesNotMatch(adminDashboardSource, /General Constitutional Consultation & Case-Taking/);
  const invoiceTemplateBlock = adminDashboardSource.match(/const INVOICE_TEMPLATES = \[([\s\S]*?)\n\];/)?.[1] ?? "";
  const invoiceTemplatePrices = [...invoiceTemplateBlock.matchAll(/unitPrice:\s*(\d+)/g)].map((match) => Number(match[1]));
  assert.ok(invoiceTemplatePrices.length >= 23, "Expected every care duration and support template");
  assert.ok(invoiceTemplatePrices.every((price) => price % 1000 === 0), "Every invoice template price must use ₹1,000 increments");
  [
    "Acute & Wellness Care · 1 week",
    "Acute & Wellness Care · 2 weeks",
    "Acute & Wellness Care · 4 weeks",
    "Acute & Wellness Care · 8 weeks",
    "Acute & Wellness Care · 12 weeks",
    "Constitutional Care · 1 week",
    "Constitutional Care · 2 weeks",
    "Constitutional Care · 4 weeks",
    "Constitutional Care · 8 weeks",
    "Constitutional Care · 12 weeks",
    "Advanced Constitutional Care · 1 week",
    "Advanced Constitutional Care · 2 weeks",
    "Advanced Constitutional Care · 4 weeks",
    "Advanced Constitutional Care · 8 weeks",
    "Advanced Constitutional Care · 12 weeks",
    "Complete Health Transformation · 1 week",
    "Complete Health Transformation · 2 weeks",
    "Complete Health Transformation · 4 weeks",
    "Complete Health Transformation · 8 weeks",
    "Complete Health Transformation · 12 weeks",
  ].forEach((label) => assert.ok(invoiceTemplateBlock.includes(label), `Missing invoice template: ${label}`));
  assert.match(invoiceRouteSource, /Enter a valid invoice number/);
  assert.match(invoiceRouteSource, /Select an existing patient before generating the invoice/);
  assert.match(invoiceRouteSource, /const subtotal = items\.reduce/);
  assert.match(invoiceRouteSource, /grandTotal: subtotal - discount/);
  assert.match(clinicBrandingSource, /CLINIC_BRAND_NAME = "Homeo Healthcare"/);
  assert.match(clinicBrandingSource, /CLINIC_LOGO_PATH = "\/images\/logo\.png"/);
  assert.ok(fs.existsSync(path.resolve(process.cwd(), "public/images/logo.png")), "The official clinic logo asset must exist");
  assert.match(invoicePreviewSource, /CLINIC_BRAND_NAME/);
  assert.match(invoicePreviewSource, /CLINIC_LOGO_PATH/);
  assert.match(googleDriveSource, /CLINIC_LOGO_PUBLIC_URL.*,4,60,60/);
  assert.match(googleDriveSource, /\["", CLINIC_BRAND_NAME, "", "", ""\]/);
  assert.match(googleDriveSource, /valueInputOption: "RAW"[\s\S]*valueInputOption: "USER_ENTERED"/);
  assert.doesNotMatch(`${storeSource}\n${directorySource}`, /Proceed to Payment|Submit Order|checkoutStep.*payment/i);
  assert.doesNotMatch(`${storeSource}\n${directorySource}`, /parseInt\([^\n]*replace/, "Display prices must never be parsed into payable values");

  console.log("✅ Specialty directory, pricing, coverage, and assessment-safety tests passed");
}

runSpecialtyAssessmentPricingTests();
