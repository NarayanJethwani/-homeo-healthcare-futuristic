import { randomUUID } from "crypto";
import { isPaymentGatewayEnabled } from "./featureFlags";
import { getInvoicePaymentStatus, type ManualPaymentStatus } from "./manualPaymentWorkflow";

export interface CareActivationParams {
  agreementAccepted: boolean;
  billingDocumentExists: boolean;
  paymentStatus: ManualPaymentStatus | "unpaid" | "webhook_confirmed";
  actorRole: string;
}

export interface CareActivationResult {
  canActivate: boolean;
  reason?: string;
}

export interface CareActivationRecord {
  careOrderId: string;
  patientId: string;
  invoiceId: string;
  activatedBy: string;
  actorRole: string;
  activatedAt: string;
  auditEventId: string;
  status: "activated";
}

const careActivationsStore: CareActivationRecord[] = [];

/**
 * Resets care activations store for testing.
 */
export function resetCareActivationStore(): void {
  careActivationsStore.length = 0;
}

/**
 * Validates whether care may be activated under governed rules.
 */
export function evaluateCareActivationReadiness(params: CareActivationParams): CareActivationResult {
  // 1. Agreement check
  if (!params.agreementAccepted) {
    return { canActivate: false, reason: "Care activation blocked: Clinical Care Agreement must be accepted by the patient." };
  }

  // 2. Billing document check
  if (!params.billingDocumentExists) {
    return { canActivate: false, reason: "Care activation blocked: An approved billing document/invoice must exist." };
  }

  // 3. Payment status check
  const allowedStatuses: Array<ManualPaymentStatus | "webhook_confirmed"> = [
    "received",
    "waived",
    "approved_credit",
    "care_support_approved",
  ];

  // If payment gateway is enabled, webhook_confirmed is also allowed
  if (isPaymentGatewayEnabled()) {
    allowedStatuses.push("webhook_confirmed");
  }

  if (!allowedStatuses.includes(params.paymentStatus as any)) {
    return {
      canActivate: false,
      reason: `Care activation blocked: Payment status '${params.paymentStatus}' is not authorized. Must be one of: ${allowedStatuses.join(", ")}.`,
    };
  }

  // 4. Role authorization check
  const authorizedRoles = ["physician", "admin", "finance", "care_coordinator"];
  if (!authorizedRoles.includes(params.actorRole)) {
    return { canActivate: false, reason: `Care activation blocked: Role '${params.actorRole}' is not authorized to activate care.` };
  }

  return { canActivate: true };
}

/**
 * Executes care activation and logs an immutable audit event.
 */
export function activateCareOrder(params: {
  careOrderId: string;
  patientId: string;
  invoiceId: string;
  agreementAccepted: boolean;
  billingDocumentExists: boolean;
  actorId: string;
  actorRole: string;
}): { success: boolean; record?: CareActivationRecord; error?: string } {
  const currentPaymentStatus = getInvoicePaymentStatus(params.invoiceId);
  const readiness = evaluateCareActivationReadiness({
    agreementAccepted: params.agreementAccepted,
    billingDocumentExists: params.billingDocumentExists,
    paymentStatus: currentPaymentStatus,
    actorRole: params.actorRole,
  });

  if (!readiness.canActivate) {
    return { success: false, error: readiness.reason };
  }

  const timestamp = new Date().toISOString();
  const auditEventId = `aud-${randomUUID()}`;

  const record: CareActivationRecord = {
    careOrderId: params.careOrderId,
    patientId: params.patientId,
    invoiceId: params.invoiceId,
    activatedBy: params.actorId,
    actorRole: params.actorRole,
    activatedAt: timestamp,
    auditEventId,
    status: "activated",
  };

  careActivationsStore.push(record);
  return { success: true, record };
}

/**
 * Gets active care order for an invoice/patient.
 */
export function getCareActivationRecord(invoiceId: string): CareActivationRecord | undefined {
  return careActivationsStore.find((r) => r.invoiceId === invoiceId);
}
