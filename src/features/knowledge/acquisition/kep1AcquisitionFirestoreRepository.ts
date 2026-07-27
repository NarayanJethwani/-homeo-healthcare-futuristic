import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1AcquisitionAuditEvent,
  KEP1AcquisitionRepository,
  KEP1AssignmentDecisionRecord,
  KEP1SourceAcquisitionRecord,
} from "./kep1AcquisitionTypes";

export const KEP1_ACQUISITION_COLLECTIONS = {
  ASSIGNMENTS: "knowledgeGovernanceKep1Assignments",
  SOURCES: "knowledgeGovernanceKep1SourceAcquisition",
  AUDIT_EVENTS: "knowledgeGovernanceKep1AcquisitionAuditEvents",
} as const;

export class FirestoreKEP1AcquisitionRepository
  implements KEP1AcquisitionRepository
{
  private db() {
    return getAdminDb();
  }

  async getAssignment(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_COLLECTIONS.ASSIGNMENTS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1AssignmentDecisionRecord)
      : null;
  }

  async listAssignments() {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_COLLECTIONS.ASSIGNMENTS)
      .orderBy("assignmentId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1AssignmentDecisionRecord
    );
  }

  async saveAssignment(
    record: KEP1AssignmentDecisionRecord,
    expectedVersion: number | null,
    auditEvent: KEP1AcquisitionAuditEvent
  ) {
    await this.saveTransactional(
      KEP1_ACQUISITION_COLLECTIONS.ASSIGNMENTS,
      record.assignmentId,
      record,
      expectedVersion,
      auditEvent
    );
  }

  async getSource(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_COLLECTIONS.SOURCES)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1SourceAcquisitionRecord)
      : null;
  }

  async listSources() {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_COLLECTIONS.SOURCES)
      .orderBy("sourceId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1SourceAcquisitionRecord
    );
  }

  async saveSource(
    record: KEP1SourceAcquisitionRecord,
    expectedVersion: number | null,
    auditEvent: KEP1AcquisitionAuditEvent
  ) {
    await this.saveTransactional(
      KEP1_ACQUISITION_COLLECTIONS.SOURCES,
      record.sourceId,
      record,
      expectedVersion,
      auditEvent
    );
  }

  private async saveTransactional(
    collection: string,
    id: string,
    record: KEP1AssignmentDecisionRecord | KEP1SourceAcquisitionRecord,
    expectedVersion: number | null,
    auditEvent: KEP1AcquisitionAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const recordRef = this.db().collection(collection).doc(id);
      const auditRef = this.db()
        .collection(KEP1_ACQUISITION_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const snapshot = await transaction.get(recordRef);
      if (expectedVersion === null) {
        if (snapshot.exists) {
          throw new Error(
            collection === KEP1_ACQUISITION_COLLECTIONS.ASSIGNMENTS
              ? "ACQUISITION_ASSIGNMENT_ALREADY_EXISTS"
              : "ACQUISITION_SOURCE_ALREADY_EXISTS"
          );
        }
        transaction.create(recordRef, record);
      } else {
        if (
          !snapshot.exists ||
          (snapshot.data() as { version?: number }).version !== expectedVersion
        ) {
          throw new Error("ACQUISITION_VERSION_CONFLICT");
        }
        const current = snapshot.data() as Record<string, unknown>;
        if (
          ("assignmentId" in record &&
            (current.assignmentId !== record.assignmentId ||
              current.entityId !== record.entityId ||
              current.role !== record.role)) ||
          ("sourceId" in record && current.sourceId !== record.sourceId)
        ) {
          throw new Error("ACQUISITION_IMMUTABLE_IDENTITY_CONFLICT");
        }
        transaction.update(recordRef, record);
      }
      transaction.create(auditRef, auditEvent);
    });
  }
}
