import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  FastTrackDecisionAuditEvent,
  FastTrackDecisionHead,
  FastTrackDecisionRecord,
  FastTrackDecisionRepository,
} from "./fastTrackDecisionTypes";

export const FAST_TRACK_DECISION_COLLECTIONS = {
  DECISIONS: "knowledgeGovernanceFastTrackDecisions",
  AUDIT_EVENTS: "knowledgeGovernanceFastTrackDecisionAuditEvents",
  HEADS: "knowledgeGovernanceFastTrackDecisionHeads",
} as const;

export class FirestoreFastTrackDecisionRepository
  implements FastTrackDecisionRepository
{
  private db() {
    return getAdminDb();
  }

  async getDecision(decisionId: string) {
    const snapshot = await this.db()
      .collection(FAST_TRACK_DECISION_COLLECTIONS.DECISIONS)
      .doc(decisionId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as FastTrackDecisionRecord)
      : null;
  }

  async getHead(entityId: string) {
    const snapshot = await this.db()
      .collection(FAST_TRACK_DECISION_COLLECTIONS.HEADS)
      .doc(entityId)
      .get();
    return snapshot.exists ? (snapshot.data() as FastTrackDecisionHead) : null;
  }

  async listDecisions() {
    const snapshot = await this.db()
      .collection(FAST_TRACK_DECISION_COLLECTIONS.DECISIONS)
      .orderBy("recordedAt", "desc")
      .limit(1_000)
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as FastTrackDecisionRecord
    );
  }

  async createDecision(
    decision: FastTrackDecisionRecord,
    auditEvent: FastTrackDecisionAuditEvent,
    expectedPreviousDecisionId: string | null
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const decisionRef = this.db()
        .collection(FAST_TRACK_DECISION_COLLECTIONS.DECISIONS)
        .doc(decision.decisionId);
      const auditRef = this.db()
        .collection(FAST_TRACK_DECISION_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const headRef = this.db()
        .collection(FAST_TRACK_DECISION_COLLECTIONS.HEADS)
        .doc(decision.entityId);
      const [decisionSnapshot, auditSnapshot, headSnapshot] =
        await Promise.all([
          transaction.get(decisionRef),
          transaction.get(auditRef),
          transaction.get(headRef),
        ]);

      if (decisionSnapshot.exists || auditSnapshot.exists) {
        throw new Error("FAST_TRACK_DECISION_IMMUTABLE_CONFLICT");
      }
      const currentHead = headSnapshot.exists
        ? (headSnapshot.data() as FastTrackDecisionHead)
        : null;
      if (
        (currentHead?.decisionId || null) !== expectedPreviousDecisionId
      ) {
        throw new Error("FAST_TRACK_DECISION_HEAD_CONFLICT");
      }

      transaction.create(decisionRef, decision);
      transaction.create(auditRef, auditEvent);
      transaction.set(headRef, {
        entityId: decision.entityId,
        decisionId: decision.decisionId,
        entityRevisionSha256: decision.entityRevisionSha256,
        recordedAt: decision.recordedAt,
      } satisfies FastTrackDecisionHead);
    });
  }
}
