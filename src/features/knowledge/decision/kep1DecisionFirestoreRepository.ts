import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1DecisionAuditEvent,
  KEP1DecisionRepository,
  KEP1GoNoGoDecisionRecord,
} from "./kep1DecisionTypes";

export const KEP1_DECISION_COLLECTIONS = {
  DECISIONS: "knowledgeGovernanceKep1GoNoGoDecisions",
  AUDIT_EVENTS: "knowledgeGovernanceKep1DecisionAuditEvents",
} as const;

export class FirestoreKEP1DecisionRepository
  implements KEP1DecisionRepository
{
  private db() {
    return getAdminDb();
  }

  async getDecision(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_DECISION_COLLECTIONS.DECISIONS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1GoNoGoDecisionRecord)
      : null;
  }

  async listDecisions() {
    const snapshot = await this.db()
      .collection(KEP1_DECISION_COLLECTIONS.DECISIONS)
      .orderBy("decidedAt", "desc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1GoNoGoDecisionRecord
    );
  }

  async createDecision(
    decision: KEP1GoNoGoDecisionRecord,
    event: KEP1DecisionAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const decisionRef = this.db()
        .collection(KEP1_DECISION_COLLECTIONS.DECISIONS)
        .doc(decision.decisionId);
      const auditRef = this.db()
        .collection(KEP1_DECISION_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [decisionSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(decisionRef),
        transaction.get(auditRef),
      ]);
      if (decisionSnapshot.exists) {
        throw new Error("GO_NO_GO_IMMUTABLE_CONFLICT");
      }
      if (auditSnapshot.exists) {
        throw new Error("GO_NO_GO_AUDIT_IMMUTABLE_CONFLICT");
      }
      transaction.create(decisionRef, decision);
      transaction.create(auditRef, event);
    });
  }
}
