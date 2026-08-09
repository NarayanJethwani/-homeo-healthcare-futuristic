import crypto from "crypto";
import "server-only";
import { getAdminDb } from "@/lib/firebaseAdmin";
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

// Development/test fallback only. Production always uses Firestore and fails
// closed when the backend is unavailable.
const documentStore = new Map<string, { record: ClinicalDocumentRecord; bytes: Uint8Array }>();
const idempotencyStore = new Map<string, IdempotencyRecord>();
const prescriptionStore = new Map<string, PrescriptionDraft>();
const revisionStore = new Map<string, PrescriptionRevision[]>();
const auditStore = new Map<string, AuditEventRecord[]>();
const dispatchStore = new Map<string, PharmacyDispatchState>();

const COLLECTIONS = {
  documents: "clinicalPrescriptionDocumentsV1",
  idempotency: "clinicalConsultationIdempotencyV1",
  prescriptions: "clinicalPrescriptionsV1",
  revisions: "clinicalPrescriptionRevisionsV1",
  audits: "clinicalConsultationAuditV1",
  dispatch: "clinicalPharmacyDispatchV1",
} as const;

function databaseOrNull(): any | null {
  if (process.env.NODE_ENV !== "production" && !process.env.FIRESTORE_EMULATOR_HOST) {
    return null;
  }
  try {
    return getAdminDb();
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    return null;
  }
}

function safeDocumentId(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
  1. Clinical Document Repository Interface & Implementation
 */
export const clinicalDocumentRepository = {
  async saveDocument(record: ClinicalDocumentRecord, bytes: Uint8Array): Promise<void> {
    const computedChecksum = crypto.createHash("sha256").update(bytes).digest("hex");
    if (computedChecksum !== record.checksum) {
      throw new Error(`Document integrity mismatch: expected ${record.checksum}, got ${computedChecksum}`);
    }
    const storedRecord = { ...record, status: "available" as const };
    const db = databaseOrNull();
    if (!db) {
      documentStore.set(record.id, { record: storedRecord, bytes });
      return;
    }
    await db.collection(COLLECTIONS.documents).doc(safeDocumentId(record.id)).set({
      record: storedRecord,
      pdfBase64: Buffer.from(bytes).toString("base64"),
    });
  },

  async getDocument(documentId: string): Promise<{ record: ClinicalDocumentRecord; bytes: Uint8Array } | null> {
    const db = databaseOrNull();
    const stored = db
      ? (await db.collection(COLLECTIONS.documents).doc(safeDocumentId(documentId)).get())
      : null;
    const data = stored?.exists ? stored.data() : null;
    const entry = data
      ? {
          record: data.record as ClinicalDocumentRecord,
          bytes: new Uint8Array(Buffer.from(data.pdfBase64, "base64")),
        }
      : documentStore.get(documentId);
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
    const db = databaseOrNull();
    if (db) {
      const snapshot = await db.collection(COLLECTIONS.documents).get();
      for (const document of snapshot.docs) {
        const data = document.data();
        if (data.record?.prescriptionId === prescriptionId && data.record?.status === "available") {
          return {
            record: data.record as ClinicalDocumentRecord,
            bytes: new Uint8Array(Buffer.from(data.pdfBase64, "base64")),
          };
        }
      }
      return null;
    }
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

    const db = databaseOrNull();
    const ref = db?.collection(COLLECTIONS.idempotency).doc(safeDocumentId(compoundKey));
    const snapshot = ref ? await ref.get() : null;
    const existing = snapshot?.exists
      ? (snapshot.data() as IdempotencyRecord)
      : idempotencyStore.get(compoundKey);
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
    if (ref) await ref.set(newRecord);
    else idempotencyStore.set(compoundKey, newRecord);
    return { isDuplicate: false };
  },

  async completeIdempotency(compoundKey: string, responseReference: string): Promise<void> {
    const db = databaseOrNull();
    const ref = db?.collection(COLLECTIONS.idempotency).doc(safeDocumentId(compoundKey));
    const snapshot = ref ? await ref.get() : null;
    const record = snapshot?.exists
      ? (snapshot.data() as IdempotencyRecord)
      : idempotencyStore.get(compoundKey);
    if (record) {
      record.status = "completed";
      record.responseReference = responseReference;
      record.completedAt = new Date().toISOString();
      if (ref) await ref.set(record);
    }
  },
};

/**
  3. Prescription Repository Interface & Implementation
 */
export const prescriptionRepository = {
  async savePrescription(prescription: PrescriptionDraft): Promise<void> {
    const id = prescription.id || `rx_${Date.now()}`;
    const db = databaseOrNull();
    if (db) await db.collection(COLLECTIONS.prescriptions).doc(safeDocumentId(id)).set(prescription);
    else prescriptionStore.set(id, prescription);
  },

  async getPrescription(prescriptionId: string): Promise<PrescriptionDraft | null> {
    const db = databaseOrNull();
    if (!db) return prescriptionStore.get(prescriptionId) || null;
    const snapshot = await db.collection(COLLECTIONS.prescriptions).doc(safeDocumentId(prescriptionId)).get();
    return snapshot.exists ? (snapshot.data() as PrescriptionDraft) : null;
  },

  async saveRevision(revision: PrescriptionRevision): Promise<void> {
    const db = databaseOrNull();
    if (db) {
      await db.collection(COLLECTIONS.revisions)
        .doc(safeDocumentId(`${revision.prescriptionId}:${revision.version}`))
        .set(revision);
      return;
    }
    const existing = revisionStore.get(revision.prescriptionId) || [];
    existing.push(revision);
    revisionStore.set(revision.prescriptionId, existing);
  },

  async getRevisions(prescriptionId: string): Promise<PrescriptionRevision[]> {
    const db = databaseOrNull();
    if (db) {
      const snapshot = await db.collection(COLLECTIONS.revisions)
        .where("prescriptionId", "==", prescriptionId)
        .get();
      return snapshot.docs
        .map((document: any) => document.data() as PrescriptionRevision)
        .sort((a: PrescriptionRevision, b: PrescriptionRevision) => a.version - b.version);
    }
    return revisionStore.get(prescriptionId) || [];
  },
};

/**
  4. Audit Repository Interface & Implementation
 */
export const auditRepository = {
  async logAuditEvent(event: AuditEventRecord): Promise<void> {
    const db = databaseOrNull();
    if (db) {
      await db.collection(COLLECTIONS.audits).doc(safeDocumentId(event.id)).set(event);
      return;
    }
    const existing = auditStore.get(event.consultationId) || [];
    existing.push(event);
    auditStore.set(event.consultationId, existing);
    console.log(`[Audit] ${event.eventType} logged for consultation=${event.consultationId}, actor=${event.actorId}`);
  },

  async getAuditHistory(consultationId: string): Promise<AuditEventRecord[]> {
    const db = databaseOrNull();
    if (db) {
      const snapshot = await db.collection(COLLECTIONS.audits)
        .where("consultationId", "==", consultationId)
        .get();
      return snapshot.docs
        .map((document: any) => document.data() as AuditEventRecord)
        .sort((a: AuditEventRecord, b: AuditEventRecord) => a.occurredAt.localeCompare(b.occurredAt));
    }
    return auditStore.get(consultationId) || [];
  },
};

/**
  5. Dispatch Repository Interface & Implementation
 */
export const dispatchRepository = {
  async saveDispatchState(prescriptionId: string, state: PharmacyDispatchState): Promise<void> {
    const db = databaseOrNull();
    if (db) await db.collection(COLLECTIONS.dispatch).doc(safeDocumentId(prescriptionId)).set({ prescriptionId, ...state });
    else dispatchStore.set(prescriptionId, state);
  },

  async getDispatchState(prescriptionId: string): Promise<PharmacyDispatchState | null> {
    const db = databaseOrNull();
    if (!db) return dispatchStore.get(prescriptionId) || null;
    const snapshot = await db.collection(COLLECTIONS.dispatch).doc(safeDocumentId(prescriptionId)).get();
    return snapshot.exists ? (snapshot.data() as PharmacyDispatchState) : null;
  },
};
