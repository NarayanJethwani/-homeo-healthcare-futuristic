import "server-only";

import { randomUUID } from "crypto";
import { getAdminDb } from "@/lib/firebaseAdmin";
import {
  CONSULTATION_WORKSPACE_SCHEMA_VERSION,
  ConsultationWorkspaceDraftInput,
  ConsultationWorkspaceRecord,
} from "./consultationWorkspace.types";
import type { TranscriptionConsent } from "../types/telemedicine.types";

const WORKSPACE_COLLECTION = "clinicalConsultationWorkspaceV1";
const AUDIT_COLLECTION = "clinicalConsultationWorkspaceAuditV1";
const developmentStore = new Map<string, ConsultationWorkspaceRecord>();

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

function latestActive(records: ConsultationWorkspaceRecord[]) {
  return records
    .filter((record) =>
      ["scheduled", "waiting", "active", "paused"].includes(record.lifecycleStatus)
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] || null;
}

export async function findActiveWorkspaceByPatient(
  patientId: string
): Promise<ConsultationWorkspaceRecord | null> {
  const db = databaseOrNull();
  if (!db) {
    return latestActive(
      Array.from(developmentStore.values()).filter((record) => record.patientId === patientId)
    );
  }

  const snapshot = await db
    .collection(WORKSPACE_COLLECTION)
    .where("patientId", "==", patientId)
    .get();
  return latestActive(
    snapshot.docs.map((document: any) => document.data() as ConsultationWorkspaceRecord)
  );
}

export async function getWorkspaceById(
  id: string
): Promise<ConsultationWorkspaceRecord | null> {
  const db = databaseOrNull();
  if (!db) return developmentStore.get(id) || null;
  const snapshot = await db.collection(WORKSPACE_COLLECTION).doc(id).get();
  return snapshot.exists ? (snapshot.data() as ConsultationWorkspaceRecord) : null;
}

export function createUnsavedWorkspace(options: {
  patientId: string;
  actorId: string;
  consent: TranscriptionConsent;
  notes: ConsultationWorkspaceRecord["notes"];
}): ConsultationWorkspaceRecord {
  const now = new Date().toISOString();
  return {
    id: `consultation_${randomUUID()}`,
    schemaVersion: CONSULTATION_WORKSPACE_SCHEMA_VERSION,
    patientId: options.patientId,
    lifecycleStatus: "active",
    outcome: "",
    notes: { ...options.notes, updatedAt: now },
    selectedRubrics: [],
    selectedRemedy: null,
    prescriptionDraft: {},
    consent: options.consent,
    accumulatedActiveSeconds: 0,
    recordVersion: 0,
    createdAt: now,
    createdBy: options.actorId,
    updatedAt: now,
    updatedBy: options.actorId,
  };
}

export async function saveWorkspaceDraft(options: {
  draft: ConsultationWorkspaceDraftInput;
  expectedVersion: number;
  actorId: string;
  consent: TranscriptionConsent;
}): Promise<ConsultationWorkspaceRecord> {
  const now = new Date().toISOString();
  const db = databaseOrNull();

  const applyUpdate = (existing: ConsultationWorkspaceRecord | null) => {
    if (existing && existing.patientId !== options.draft.patientId) {
      throw new Error("CONSULTATION_PATIENT_MISMATCH");
    }
    const currentVersion = existing?.recordVersion || 0;
    if (currentVersion !== options.expectedVersion) {
      throw new Error("CONSULTATION_VERSION_CONFLICT");
    }
    if (existing?.lifecycleStatus === "completed") {
      throw new Error("CONSULTATION_ALREADY_COMPLETED");
    }
    return {
      ...(existing || {
        createdAt: now,
        createdBy: options.actorId,
      }),
      ...options.draft,
      schemaVersion: CONSULTATION_WORKSPACE_SCHEMA_VERSION,
      consent: options.consent,
      recordVersion: currentVersion + 1,
      updatedAt: now,
      updatedBy: options.actorId,
    } satisfies ConsultationWorkspaceRecord;
  };

  if (!db) {
    const updated = applyUpdate(developmentStore.get(options.draft.id) || null);
    developmentStore.set(updated.id, updated);
    return updated;
  }

  const recordRef = db.collection(WORKSPACE_COLLECTION).doc(options.draft.id);
  const auditRef = db.collection(AUDIT_COLLECTION).doc(`audit_${randomUUID()}`);
  return db.runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(recordRef);
    const updated = applyUpdate(
      snapshot.exists ? (snapshot.data() as ConsultationWorkspaceRecord) : null
    );
    transaction.set(recordRef, updated);
    transaction.set(auditRef, {
      eventType: "draft_saved",
      consultationId: updated.id,
      patientId: updated.patientId,
      actorId: options.actorId,
      recordVersion: updated.recordVersion,
      occurredAt: now,
    });
    return updated;
  });
}

export async function completeWorkspace(options: {
  draft: ConsultationWorkspaceDraftInput;
  expectedVersion: number;
  actorId: string;
  consent: TranscriptionConsent;
}): Promise<ConsultationWorkspaceRecord> {
  const now = new Date().toISOString();
  const complete = (existing: ConsultationWorkspaceRecord | null) => {
    if (!existing) throw new Error("CONSULTATION_NOT_FOUND");
    if (existing.patientId !== options.draft.patientId) throw new Error("CONSULTATION_PATIENT_MISMATCH");
    if (existing.recordVersion !== options.expectedVersion) throw new Error("CONSULTATION_VERSION_CONFLICT");
    if (!["active", "paused"].includes(existing.lifecycleStatus)) {
      throw new Error("CONSULTATION_INVALID_LIFECYCLE");
    }
    return {
      ...existing,
      ...options.draft,
      lifecycleStatus: "completed" as const,
      consent: options.consent,
      recordVersion: existing.recordVersion + 1,
      completedAt: now,
      updatedAt: now,
      updatedBy: options.actorId,
    } satisfies ConsultationWorkspaceRecord;
  };
  const db = databaseOrNull();
  if (!db) {
    const completed = complete(developmentStore.get(options.draft.id) || null);
    developmentStore.set(completed.id, completed);
    return completed;
  }
  const recordRef = db.collection(WORKSPACE_COLLECTION).doc(options.draft.id);
  const auditRef = db.collection(AUDIT_COLLECTION).doc(`audit_${randomUUID()}`);
  return db.runTransaction(async (transaction: any) => {
    const snapshot = await transaction.get(recordRef);
    const completed = complete(
      snapshot.exists ? (snapshot.data() as ConsultationWorkspaceRecord) : null
    );
    transaction.set(recordRef, completed);
    transaction.set(auditRef, {
      eventType: "consultation_completed",
      consultationId: completed.id,
      patientId: completed.patientId,
      actorId: options.actorId,
      recordVersion: completed.recordVersion,
      outcome: completed.outcome,
      occurredAt: now,
    });
    return completed;
  });
}
