import { writeFileSync } from "node:fs";
import { buildClinicalQuotationPdf } from "../src/lib/clinicalQuotationPdf";

const output = process.argv[2] || "tmp/pdfs/clinical-quotation-sample.pdf";
writeFileSync(output, buildClinicalQuotationPdf({
  quotationId: "QTN-20260803-1234",
  patientName: "Sample Patient",
  issuedAt: "2026-08-03T08:00:00.000Z",
  validUntil: "2026-08-10T08:00:00.000Z",
  approvalStatus: "pending-patient-approval",
  recommendedPathway: "Constitutional Care",
  selectedPathway: "Advanced Constitutional Care",
  selectionMode: "physician-override",
  manualSelectionReason: "Closer monitoring and substantial records review",
  carePeriodWeeks: 2,
  weeklyFee: 5000,
  rationale: [
    "Long-standing presentation supports a structured care period",
    "Multi-system coordination requires closer physician review",
  ],
  items: [
    { label: "Two-week care period", amount: 10000 },
    { label: "Mother Tincture: As clinically prescribed", amount: 1000 },
  ],
  concessionAmount: 0,
  finalTotal: 11000,
  pricingRuleVersion: "clinical-care-simulator-v1",
}));
