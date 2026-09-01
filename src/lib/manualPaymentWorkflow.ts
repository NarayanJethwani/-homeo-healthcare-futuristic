import { randomUUID } from "crypto";

export type PaymentMethod = "upi" | "bank_transfer" | "cash" | "card_terminal" | "other";

export type ManualPaymentStatus = "received" | "waived" | "approved_credit" | "care_support_approved" | "reversed";

export type ManualPaymentQueueState =
  | "accepted_coordination_pending"
  | "instructions_shared"
  | "evidence_received"
  | "confirmed"
  | "activation_pending"
  | "activated";

export interface ActorContext {
  actorId: string;
  role: "admin" | "finance" | "physician" | "care_coordinator" | "patient" | "system" | "doctor" | "super_admin";
}

export interface ManualPaymentRecord {
  paymentId: string;
  invoiceId: string;
  patientId: string;
  amountPaise: number; // Integer paise only
  paymentMethod: PaymentMethod;
  referenceNumber: string; // Guaranteed non-empty reference number (generated for cash if omitted)
  receivedAt: string; // ISO string
  recordedBy: string; // Actor ID
  evidenceReference?: string;
  notes?: string;
  auditEventId: string;
  status: ManualPaymentStatus;
  reversalReason?: string;
  reversedBy?: string;
  reversedAt?: string;
}

export interface ManualPaymentAuditEvent {
  eventId: string;
  eventType: "PAYMENT_RECORDED" | "PAYMENT_REVERSED" | "QUEUE_STATUS_UPDATED" | "RECEIPT_ISSUED" | "CARE_ACTIVATED";
  invoiceId: string;
  patientId: string;
  actorId: string;
  actorRole: string;
  timestamp: string;
  details: Record<string, unknown>;
}

export interface RecordPaymentInput {
  invoiceId: string;
  patientId: string;
  amountPaise: number;
  expectedInvoiceTotalPaise?: number; // Optional check for partial/overpayment prevention
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  receivedAt?: string;
  evidenceReference?: string;
  notes?: string;
  status?: ManualPaymentStatus;
}

// In-memory persistent server store for manual payments, queue states, and audit logs
const paymentRecordsStore: ManualPaymentRecord[] = [];
const auditEventsStore: ManualPaymentAuditEvent[] = [];
const queueStateStore = new Map<string, ManualPaymentQueueState>();

/**
 * Resets in-memory stores for unit testing environment.
 */
export function resetManualPaymentStores(): void {
  paymentRecordsStore.length = 0;
  auditEventsStore.length = 0;
  queueStateStore.clear();
}

/**
 * Normalizes staff roles for security evaluation.
 */
export function isAuthorizedStaffRole(role: string): boolean {
  const normalized = role.toLowerCase();
  return ["admin", "finance", "care_coordinator", "super_admin", "doctor", "physician"].includes(normalized);
}

/**
 * Securely records a manual payment on the server.
 */
export function recordManualPayment(
  input: RecordPaymentInput,
  actor: ActorContext
): { success: boolean; record?: ManualPaymentRecord; error?: string; statusCode?: number } {
  // 1. RBAC & Patient-side Write Prohibition
  if (actor.role === "patient") {
    return {
      success: false,
      error: "Unauthorized: Patients cannot record or alter payment status directly.",
      statusCode: 403,
    };
  }
  if (!isAuthorizedStaffRole(actor.role)) {
    return {
      success: false,
      error: `Unauthorized role: '${actor.role}' cannot record manual payments.`,
      statusCode: 403,
    };
  }

  // 2. Integer Paise Validation
  if (typeof input.amountPaise !== "number" || !Number.isInteger(input.amountPaise) || input.amountPaise <= 0) {
    return {
      success: false,
      error: "Validation Error: Payment amount must be a positive integer value in paise.",
      statusCode: 400,
    };
  }

  // 3. Partial Payment / Overpayment Rule Enforcement for v1.0
  if (input.expectedInvoiceTotalPaise && input.expectedInvoiceTotalPaise > 0) {
    if (input.amountPaise !== input.expectedInvoiceTotalPaise) {
      return {
        success: false,
        error: `Policy Violation: Platform v1.0 requires exact full invoice payment (${input.expectedInvoiceTotalPaise} paise). Partial or overpayments (${input.amountPaise} paise) are not permitted without approved concession.`,
        statusCode: 422,
      };
    }
  }

  // 4. Payment Method Validation
  const allowedMethods: PaymentMethod[] = ["upi", "bank_transfer", "cash", "card_terminal", "other"];
  if (!allowedMethods.includes(input.paymentMethod)) {
    return {
      success: false,
      error: `Invalid payment method: '${input.paymentMethod}'.`,
      statusCode: 400,
    };
  }

  // 5. Cash or No-Reference Receipt Assignment
  let finalReference = (input.referenceNumber || "").trim();
  const timestamp = new Date().toISOString();

  if (!finalReference) {
    const dateStr = timestamp.slice(0, 10).replace(/-/g, "");
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    finalReference = `${input.paymentMethod.toUpperCase()}-REC-${dateStr}-${randomSeq}`;
  }

  // 6. Duplicate Reference Number & Idempotency Check
  const duplicate = paymentRecordsStore.find(
    (r) => r.referenceNumber.toLowerCase() === finalReference.toLowerCase() && r.status !== "reversed"
  );
  if (duplicate) {
    return {
      success: false,
      error: `Duplicate Error: Payment reference number '${finalReference}' has already been recorded for invoice ${duplicate.invoiceId}.`,
      statusCode: 409,
    };
  }

  // 7. Generate Immutable Audit Event & Record
  const auditEventId = `aud-${randomUUID()}`;
  const paymentId = `pay-${randomUUID()}`;
  const paymentStatus: ManualPaymentStatus = input.status || "received";

  const record: ManualPaymentRecord = {
    paymentId,
    invoiceId: input.invoiceId,
    patientId: input.patientId,
    amountPaise: input.amountPaise,
    paymentMethod: input.paymentMethod,
    referenceNumber: finalReference,
    receivedAt: input.receivedAt || timestamp,
    recordedBy: actor.actorId,
    auditEventId,
    status: paymentStatus,
    ...(input.evidenceReference ? { evidenceReference: input.evidenceReference } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
  };

  const auditEvent: ManualPaymentAuditEvent = {
    eventId: auditEventId,
    eventType: "PAYMENT_RECORDED",
    invoiceId: input.invoiceId,
    patientId: input.patientId,
    actorId: actor.actorId,
    actorRole: actor.role,
    timestamp,
    details: {
      amountPaise: input.amountPaise,
      paymentMethod: input.paymentMethod,
      referenceNumber: finalReference,
      ...(input.evidenceReference ? { evidenceReference: input.evidenceReference } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
    },
  };

  paymentRecordsStore.push(record);
  auditEventsStore.push(auditEvent);

  // Update queue state to confirmed
  queueStateStore.set(input.invoiceId, "confirmed");

  return { success: true, record };
}

/**
 * Performs a non-destructive payment correction or reversal on the server.
 */
export function reverseManualPayment(
  paymentId: string,
  reversalReason: string,
  actor: ActorContext
): { success: boolean; record?: ManualPaymentRecord; error?: string; statusCode?: number } {
  if (!isAuthorizedStaffRole(actor.role) || actor.role === "patient") {
    return { success: false, error: "Unauthorized: Only authorized Finance or Admin staff can reverse payments.", statusCode: 403 };
  }

  if (!reversalReason || reversalReason.trim().length < 5) {
    return { success: false, error: "Validation Error: Document a valid administrative reason for payment reversal (minimum 5 characters).", statusCode: 400 };
  }

  const existingRecord = paymentRecordsStore.find((r) => r.paymentId === paymentId);
  if (!existingRecord) {
    return { success: false, error: `Payment record '${paymentId}' not found.`, statusCode: 404 };
  }

  if (existingRecord.status === "reversed") {
    return { success: false, error: `Payment record '${paymentId}' has already been reversed.`, statusCode: 409 };
  }

  const timestamp = new Date().toISOString();
  const auditEventId = `aud-${randomUUID()}`;

  // Non-destructive update: update status and record reversal metadata
  existingRecord.status = "reversed";
  existingRecord.reversalReason = reversalReason.trim();
  existingRecord.reversedBy = actor.actorId;
  existingRecord.reversedAt = timestamp;

  const auditEvent: ManualPaymentAuditEvent = {
    eventId: auditEventId,
    eventType: "PAYMENT_REVERSED",
    invoiceId: existingRecord.invoiceId,
    patientId: existingRecord.patientId,
    actorId: actor.actorId,
    actorRole: actor.role,
    timestamp,
    details: {
      paymentId,
      reversalReason: reversalReason.trim(),
      originalAmountPaise: existingRecord.amountPaise,
    },
  };

  auditEventsStore.push(auditEvent);

  return { success: true, record: existingRecord };
}

/**
 * Gets payment records for an invoice.
 */
export function getInvoicePaymentRecords(invoiceId: string): ManualPaymentRecord[] {
  return paymentRecordsStore.filter((r) => r.invoiceId === invoiceId);
}

/**
 * Gets overall payment status for an invoice.
 */
export function getInvoicePaymentStatus(invoiceId: string): ManualPaymentStatus | "unpaid" {
  const activeRecords = paymentRecordsStore.filter((r) => r.invoiceId === invoiceId && r.status !== "reversed");
  if (activeRecords.length === 0) return "unpaid";
  return activeRecords[0].status;
}

/**
 * Updates queue status for admin/finance portal.
 */
export function updatePaymentQueueState(
  invoiceId: string,
  newState: ManualPaymentQueueState,
  actor: ActorContext
): { success: boolean; state?: ManualPaymentQueueState; error?: string; statusCode?: number } {
  if (actor.role === "patient" || !isAuthorizedStaffRole(actor.role)) {
    return { success: false, error: "Unauthorized: Staff authorization required to update queue status.", statusCode: 403 };
  }
  queueStateStore.set(invoiceId, newState);
  return { success: true, state: newState };
}

/**
 * Gets current queue status for an invoice.
 */
export function getPaymentQueueState(invoiceId: string): ManualPaymentQueueState {
  return queueStateStore.get(invoiceId) || "accepted_coordination_pending";
}

/**
 * Gets audit events for inspection and reporting.
 */
export function getManualPaymentAuditEvents(): ManualPaymentAuditEvent[] {
  return [...auditEventsStore];
}
