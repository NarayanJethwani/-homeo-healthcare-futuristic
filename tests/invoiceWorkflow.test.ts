import assert from "node:assert/strict";
import { validateInvoiceWorkflow } from "../src/lib/invoiceWorkflow";

assert.match(validateInvoiceWorkflow({ invoiceSource: "confirmed-quotation", quotationId: "QTN-1", physicianConfirmed: false, approvalStatus: "approved" }) || "", /physician-confirmed/);
assert.match(validateInvoiceWorkflow({ invoiceSource: "confirmed-quotation", quotationId: "QTN-1", physicianConfirmed: true, confirmedAt: new Date().toISOString(), pricingRuleVersion: "v1", approvalStatus: "pending-patient-approval" }) || "", /approved/);
assert.equal(validateInvoiceWorkflow({ invoiceSource: "confirmed-quotation", quotationId: "QTN-1", physicianConfirmed: true, confirmedAt: new Date().toISOString(), pricingRuleVersion: "v1", approvalStatus: "approved" }), null);
assert.equal(validateInvoiceWorkflow({ invoiceSource: "manual-administrative", manualOverrideReason: "Replacement invoice requested" }), null);
assert.match(validateInvoiceWorkflow({ invoiceSource: "manual-administrative", manualOverrideReason: "short" }) || "", /administrative reason/);
console.log("✅ Invoice workflow safety tests passed");
