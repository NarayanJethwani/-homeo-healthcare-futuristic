import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
  KEP1PrivateOnboardingRepository,
} from "./privateOnboardingTypes";

export const KEP1_ONBOARDING_COLLECTIONS = {
  RECORDS: "knowledgeGovernanceOnboardingRecords",
  IDENTITY_LOCKS: "knowledgeGovernanceOnboardingIdentityLocks",
  AUDIT_EVENTS: "knowledgeGovernanceOnboardingAuditEvents",
} as const;

export class FirestoreKEP1PrivateOnboardingRepository
  implements KEP1PrivateOnboardingRepository
{
  private db() {
    return getAdminDb();
  }

  async create(
    record: KEP1PrivateOnboardingRecord,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void> {
    await this.db().runTransaction(async (transaction: any) => {
      const recordRef = this.db()
        .collection(KEP1_ONBOARDING_COLLECTIONS.RECORDS)
        .doc(record.recordId);
      const identityLockRef = this.db()
        .collection(KEP1_ONBOARDING_COLLECTIONS.IDENTITY_LOCKS)
        .doc(record.identity.valueHash);
      const auditRef = this.db()
        .collection(KEP1_ONBOARDING_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const [existingRecord, existingIdentity] = await Promise.all([
        transaction.get(recordRef),
        transaction.get(identityLockRef),
      ]);
      if (existingRecord.exists) {
        throw new Error("ONBOARDING_RECORD_ALREADY_EXISTS");
      }
      if (existingIdentity.exists) {
        throw new Error("ONBOARDING_IDENTITY_ALREADY_EXISTS");
      }
      transaction.create(recordRef, record);
      transaction.create(identityLockRef, {
        recordId: record.recordId,
        createdAt: record.createdAt,
      });
      transaction.create(auditRef, auditEvent);
    });
  }

  async verify(
    record: KEP1PrivateOnboardingRecord,
    expectedVersion: number,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void> {
    await this.db().runTransaction(async (transaction: any) => {
      const recordRef = this.db()
        .collection(KEP1_ONBOARDING_COLLECTIONS.RECORDS)
        .doc(record.recordId);
      const auditRef = this.db()
        .collection(KEP1_ONBOARDING_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const snapshot = await transaction.get(recordRef);
      if (!snapshot.exists) {
        throw new Error("ONBOARDING_RECORD_NOT_FOUND");
      }
      const current = snapshot.data() as KEP1PrivateOnboardingRecord;
      if (current.version !== expectedVersion) {
        throw new Error("ONBOARDING_VERSION_CONFLICT");
      }
      if (
        current.kind !== record.kind ||
        current.identity.scheme !== record.identity.scheme ||
        current.identity.valueHash !== record.identity.valueHash
      ) {
        throw new Error("ONBOARDING_IMMUTABLE_IDENTITY_CONFLICT");
      }
      transaction.update(recordRef, record);
      transaction.create(auditRef, auditEvent);
    });
  }

  async get(recordId: string): Promise<KEP1PrivateOnboardingRecord | null> {
    const snapshot = await this.db()
      .collection(KEP1_ONBOARDING_COLLECTIONS.RECORDS)
      .doc(recordId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1PrivateOnboardingRecord)
      : null;
  }

  async findByIdentityHash(
    valueHash: string
  ): Promise<KEP1PrivateOnboardingRecord | null> {
    const lock = await this.db()
      .collection(KEP1_ONBOARDING_COLLECTIONS.IDENTITY_LOCKS)
      .doc(valueHash)
      .get();
    if (!lock.exists) return null;
    return this.get(lock.data()?.recordId as string);
  }

  async list(): Promise<KEP1PrivateOnboardingRecord[]> {
    const snapshot = await this.db()
      .collection(KEP1_ONBOARDING_COLLECTIONS.RECORDS)
      .orderBy("recordId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1PrivateOnboardingRecord
    );
  }

  async listAuditEvents(
    recordId: string
  ): Promise<KEP1PrivateOnboardingAuditEvent[]> {
    const snapshot = await this.db()
      .collection(KEP1_ONBOARDING_COLLECTIONS.AUDIT_EVENTS)
      .where("recordId", "==", recordId)
      .orderBy("occurredAt", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1PrivateOnboardingAuditEvent
    );
  }
}
