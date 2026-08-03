import assert from "node:assert/strict";
import test from "node:test";
import { buildClinicalQuotationPdf } from "../src/lib/clinicalQuotationPdf";

test("creates a branded physician-reviewed quotation PDF", () => {
  const pdf = buildClinicalQuotationPdf({
    quotationId: "QTN-20260803-1234", patientName: "Sample Patient",
    issuedAt: "2026-08-03T08:00:00.000Z", validUntil: "2026-08-10T08:00:00.000Z",
    approvalStatus: "pending-patient-approval", recommendedPathway: "Constitutional Care",
    selectedPathway: "Advanced Constitutional Care", selectionMode: "physician-override",
    manualSelectionReason: "Closer monitoring and substantial records review", carePeriodWeeks: 2,
    weeklyFee: 5000, rationale: ["Long-standing presentation", "Multi-system coordination"],
    items: [{ label: "Two-week care period", amount: 10000 }], concessionAmount: 0,
    finalTotal: 10000, pricingRuleVersion: "clinical-care-simulator-v1",
  });
  const content = Buffer.from(pdf).toString("latin1");
  assert.match(content, /^%PDF-1.4/);
  assert.match(content, /Homeo Healthcare/);
  assert.match(content, /QTN-20260803-1234/);
  assert.ok(pdf.length > 1500);
});
