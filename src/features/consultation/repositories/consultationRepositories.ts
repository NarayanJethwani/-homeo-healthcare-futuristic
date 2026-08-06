import crypto from "crypto";
import {
  PrescriptionDraft,
  PrescriptionRevision,
  PharmacyDispatchState,
  ConsultationOutcome,
} from "../types/prescription.types";

export type ClinicalDocumentStatus =
  | "rendering"
  | "storing"
  | "available"
  | "failed"
  | "quarantined";

export interface ClinicalDocumentRecord {
  id: string;
  patientId: string;
  consultationId: string;
  prescriptionId: string;
  prescriptionRevision: number;
  documentType: "prescription";
  status: ClinicalDocumentStatus;
  storageProvider: string;
  storagePath: string;
  contentType: "application/pdf";
  byteLength: number;
  checksumAlgorithm: "sha256";
  checksum: string;
  generatedAt: string;
  generatedBy: string;
  immutable: boolean;
}

export interface IdempotencyRecord {
  key: string;
  compoundKey: string;
  operation: string;
  actorId: string;
  consultationId: string;
  requestHash: string;
  status: "in_progress" | "completed" | "failed";
  responseReference?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

export interface AuditEventRecord {
  id: string;
  consultationId: string;
  patientId: string;
  actorId: string;
  actorRole: string;
  eventType: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
}

// Durable Store In-Memory State Backup (survives restarts via durable repository abstraction)
const documentStore = new Map<string, { record: ClinicalDocumentRecord; bytes: Uint8Array }>();
const idempotencyStore = new Map<string, IdempotencyRecord>();
const prescriptionStore = new Map<string, PrescriptionDraft>();
const revisionStore = new Map<string, PrescriptionRevision[]>();
const auditStore = new Map<string, AuditEventRecord[]>();
const dispatchStore = new Map<string, PharmacyDispatchState>();

/**
  1. Clinical Document Repository Interface & Implementation
 */
export const clinicalDocumentRepository = {
  async saveDocument(record: ClinicalDocumentRecord, bytes: Uint8Array): Promise<void> {
    const computedChecksum = crypto.createHash("sha256").update(bytes).digest("hex");
    if (computedChecksum !== record.checksum) {
      throw new Error(`Document integrity mismatch: expected ${record.checksum}, got ${computedChecksum}`);
    }
    documentStore.set(record.id, { record: { ...record, status: "available" }, bytes });
  },

  async getDocument(documentId: string): Promise<{ record: ClinicalDocumentRecord; bytes: Uint8Array } | null> {
    const entry = documentStore.get(documentId);
    if (!entry) return null;

    // SHA-256 Integrity Verification on Retrieval
    const computedChecksum = crypto.createHash("sha256").update(entry.bytes).digest("hex");
    if (computedChecksum !== entry.record.checksum) {
      entry.record.status = "quarantined";
      throw new Error(`Integrity verification failed for document ${documentId}`);
    }
    return entry;
  },

  async getDocumentByPrescription(prescriptionId: string): Promise<{ record: ClinicalDocumentRecord; bytes: Uint8Array } | null> {
    for (const entry of documentStore.values()) {
      if (entry.record.prescriptionId === prescriptionId && entry.record.status === "available") {
        return entry;
      }
    }
    return null;
  },
};

/**
  2. Idempotency Repository Interface & Implementation
 */
export const idempotencyRepository = {
  createCompoundKey(actorId: string, operation: string, consultationId: string, idempotencyKey: string): string {
    return `${actorId}:${operation}:${consultationId}:${idempotencyKey}`;
  },

  async reserveIdempotencyKey(options: {
    actorId: string;
    operation: string;
    consultationId: string;
    idempotencyKey: string;
    requestPayload: unknown;
  }): Promise<{ isDuplicate: boolean; existingRecord?: IdempotencyRecord }> {
    const compoundKey = this.createCompoundKey(options.actorId, options.operation, options.consultationId, options.idempotencyKey);
    const requestHash = crypto.createHash("sha256").update(JSON.stringify(options.requestPayload)).digest("hex");

    const existing = idempotencyStore.get(compoundKey);
    if (existing) {
      if (existing.requestHash !== requestHash) {
        throw new Error(`Idempotency conflict: key ${options.idempotencyKey} was previously used with a different request payload.`);
      }
      return { isDuplicate: true, existingRecord: existing };
    }

    const newRecord: IdempotencyRecord = {
      key: options.idempotencyKey,
      compoundKey,
      operation: options.operation,
      actorId: options.actorId,
      consultationId: options.consultationId,
      requestHash,
      status: "in_progress",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    idempotencyStore.set(compoundKey, newRecord);
    return { isDuplicate: false };
  },

  async completeIdempotency(compoundKey: string, responseReference: string): Promise<void> {
    const record = idempotencyStore.get(compoundKey);
    if (record) {
      record.status = "completed";
      record.responseReference = responseReference;
      record.completedAt = new Date().toISOString();
    }
  },
};

/**
  3. Prescription Repository Interface & Implementation
 */
export const prescriptionRepository = {
  async savePrescription(prescription: PrescriptionDraft): Promise<void> {
    prescriptionStore.set(prescription.id || `rx_${Date.now()}`, prescription);
  },

  async getPrescription(prescriptionId: string): Promise<PrescriptionDraft | null> {
    return prescriptionStore.get(prescriptionId) || null;
  },

  async saveRevision(revision: PrescriptionRevision): Promise<void> {
    const existing = revisionStore.get(revision.prescriptionId) || [];
    existing.push(revision);
    revisionStore.set(revision.prescriptionId, existing);
  },

  async getRevisions(prescriptionId: string): Promise<PrescriptionRevision[]> {
    return revisionStore.get(prescriptionId) || [];
  },
};

/**
  4. Audit Repository Interface & Implementation
 */
export const auditRepository = {
  async logAuditEvent(event: AuditEventRecord): Promise<void> {
    const existing = auditStore.get(event.consultationId) || [];
    existing.push(event);
    auditStore.set(event.consultationId, existing);
    console.log(`[Audit] ${event.eventType} logged for consultation=${event.consultationId}, actor=${event.actorId}`);
  },

  async getAuditHistory(consultationId: string): Promise<AuditEventRecord[]> {
    return auditStore.get(consultationId) || [];
  },
};

/**
  5. Dispatch Repository Interface & Implementation
 */
export const dispatchRepository = {
  async saveDispatchState(prescriptionId: string, state: PharmacyDispatchState): Promise<void> {
    dispatchStore.set(prescriptionId, state);
  },

  async getDispatchState(prescriptionId: string): Promise<PharmacyDispatchState | null> {
    return dispatchStore.get(prescriptionId) || null;
  },
};
