import assert from "node:assert/strict";
import {
  recordManualPayment,
  reverseManualPayment,
  updatePaymentQueueState,
  getPaymentQueueState,
  getInvoicePaymentStatus,
  getManualPaymentAuditEvents,
  resetManualPaymentStores,
  type ActorContext,
  type ManualPaymentAuditEvent,
} from "../src/lib/manualPaymentWorkflow";
import {
  evaluateCareActivationReadiness,
  activateCareOrder,
  resetCareActivationStore,
} from "../src/lib/careActivation";
import { isPaymentGatewayEnabled, FEATURE_FLAGS } from "../src/lib/featureFlags";

console.log("🚀 Running Soft Launch Manual Payment & Governed Care Activation Suite...\n");

resetManualPaymentStores();
resetCareActivationStore();

// Test 1: Feature Flag defaults
assert.equal(FEATURE_FLAGS.PAYMENT_GATEWAY_ENABLED, false);
assert.equal(isPaymentGatewayEnabled(), false);
assert.equal(FEATURE_FLAGS.MANUAL_PAYMENT_WORKFLOW_ENABLED, true);
assert.equal(FEATURE_FLAGS.AUTO_ACTIVATE_AFTER_GATEWAY_PAYMENT, false);
console.log("✅ TEST PASSED: 1. Feature Flag: PAYMENT_GATEWAY_ENABLED defaults to false for v1.0 soft launch");

// Test 2: Patient APIs cannot alter payment status
const patientActor: ActorContext = { actorId: "pat-999", role: "patient" };
const res2 = recordManualPayment(
  {
    invoiceId: "INV-101",
    patientId: "pat-999",
    amountPaise: 450000,
    paymentMethod: "upi",
  },
  patientActor
);
assert.equal(res2.success, false);
assert.ok((res2.error || "").includes("Unauthorized: Patients cannot record or alter payment status directly"));
console.log("✅ TEST PASSED: 2. Patient APIs cannot alter payment status or record payments");

// Test 3: Authorized staff record payment with integer paise & exact total
const financeActor: ActorContext = { actorId: "fin-101", role: "finance" };
const res3 = recordManualPayment(
  {
    invoiceId: "INV-101",
    patientId: "pat-999",
    amountPaise: 450000, // 4,500.00 INR in paise
    expectedInvoiceTotalPaise: 450000,
    paymentMethod: "upi",
    referenceNumber: "UPI-REF-0011",
  },
  financeActor
);
assert.equal(res3.success, true);
assert.equal(res3.record?.amountPaise, 450000);
assert.equal(res3.record?.status, "received");
assert.ok(res3.record?.auditEventId);
assert.equal(getInvoicePaymentStatus("INV-101"), "received");
assert.equal(getPaymentQueueState("INV-101"), "confirmed");
console.log("✅ TEST PASSED: 3. Authorized staff (finance/admin) can record payment with integer paise");

// Test 4: Non-integer paise values & partial payments rejected
const adminActor: ActorContext = { actorId: "adm-101", role: "admin" };
const res4a = recordManualPayment(
  {
    invoiceId: "INV-102",
    patientId: "pat-888",
    amountPaise: 4500.5, // Decimal paise rejected
    paymentMethod: "bank_transfer",
  },
  adminActor
);
assert.equal(res4a.success, false);
assert.ok((res4a.error || "").includes("Validation Error: Payment amount must be a positive integer value in paise"));

const res4b = recordManualPayment(
  {
    invoiceId: "INV-102",
    patientId: "pat-888",
    amountPaise: 200000, // Partial payment rejected when expected is 450000
    expectedInvoiceTotalPaise: 450000,
    paymentMethod: "bank_transfer",
  },
  adminActor
);
assert.equal(res4b.success, false);
assert.ok((res4b.error || "").includes("Policy Violation: Platform v1.0 requires exact full invoice payment"));
console.log("✅ TEST PASSED: 4. Non-integer paise values and partial payments are strictly rejected");

// Test 5: Duplicate reference detection & cash receipt auto-generation
const res5a = recordManualPayment(
  {
    invoiceId: "INV-103",
    patientId: "pat-777",
    amountPaise: 250000,
    paymentMethod: "upi",
    referenceNumber: "REF-UNIQUE-99",
  },
  adminActor
);
assert.equal(res5a.success, true);

const res5b = recordManualPayment(
  {
    invoiceId: "INV-104",
    patientId: "pat-666",
    amountPaise: 250000,
    paymentMethod: "upi",
    referenceNumber: "REF-UNIQUE-99",
  },
  adminActor
);
assert.equal(res5b.success, false);
assert.ok((res5b.error || "").includes("Duplicate Error: Payment reference number 'REF-UNIQUE-99' has already been recorded"));

const res5c = recordManualPayment(
  {
    invoiceId: "INV-105",
    patientId: "pat-555",
    amountPaise: 300000,
    paymentMethod: "cash", // Omitted reference number generates system receipt ID
  },
  adminActor
);
assert.equal(res5c.success, true);
assert.ok((res5c.record?.referenceNumber || "").startsWith("CASH-REC-"));
console.log("✅ TEST PASSED: 5. Duplicate references rejected; cash payments without ref receive deterministic receipt IDs");

// Test 6: Non-destructive reversal
const res6 = recordManualPayment(
  {
    invoiceId: "INV-106",
    patientId: "pat-444",
    amountPaise: 100000,
    paymentMethod: "cash",
  },
  adminActor
);

const paymentId = res6.record!.paymentId;
const revResult = reverseManualPayment(paymentId, "Mistaken duplicate entry", adminActor);
assert.equal(revResult.success, true);
assert.equal(revResult.record?.status, "reversed");
assert.equal(revResult.record?.reversalReason, "Mistaken duplicate entry");
assert.equal(getInvoicePaymentStatus("INV-106"), "unpaid");

const auditLogs = getManualPaymentAuditEvents();
assert.ok(auditLogs.some((e: ManualPaymentAuditEvent) => e.eventType === "PAYMENT_RECORDED"));
assert.ok(auditLogs.some((e: ManualPaymentAuditEvent) => e.eventType === "PAYMENT_REVERSED"));
console.log("✅ TEST PASSED: 6. Reversal creates immutable audit event without destroying original record");

// Test 7: Governed care activation
const check1 = evaluateCareActivationReadiness({
  agreementAccepted: true,
  billingDocumentExists: true,
  paymentStatus: "unpaid",
  actorRole: "physician",
});
assert.equal(check1.canActivate, false);

const check2 = evaluateCareActivationReadiness({
  agreementAccepted: false,
  billingDocumentExists: true,
  paymentStatus: "received",
  actorRole: "physician",
});
assert.equal(check2.canActivate, false);

const check3 = evaluateCareActivationReadiness({
  agreementAccepted: true,
  billingDocumentExists: true,
  paymentStatus: "received",
  actorRole: "physician",
});
assert.equal(check3.canActivate, true);

recordManualPayment(
  {
    invoiceId: "INV-200",
    patientId: "pat-111",
    amountPaise: 350000,
    paymentMethod: "card_terminal",
  },
  adminActor
);

const actResult = activateCareOrder({
  careOrderId: "CARE-ORDER-001",
  patientId: "pat-111",
  invoiceId: "INV-200",
  agreementAccepted: true,
  billingDocumentExists: true,
  actorId: "doc-101",
  actorRole: "physician",
});
assert.equal(actResult.success, true);
assert.equal(actResult.record?.status, "activated");
console.log("✅ TEST PASSED: 7. Care activation requires accepted agreement, billing document, and authorized payment state");

// Test 8: Queue state tracking
assert.equal(getPaymentQueueState("INV-300"), "accepted_coordination_pending");
updatePaymentQueueState("INV-300", "instructions_shared", financeActor);
assert.equal(getPaymentQueueState("INV-300"), "instructions_shared");
updatePaymentQueueState("INV-300", "evidence_received", financeActor);
assert.equal(getPaymentQueueState("INV-300"), "evidence_received");
console.log("✅ TEST PASSED: 8. Payment queue state updates correctly across staff actions");

console.log("\n🎉 All 8 Soft Launch Manual Payment Tests Passed 100%!");
