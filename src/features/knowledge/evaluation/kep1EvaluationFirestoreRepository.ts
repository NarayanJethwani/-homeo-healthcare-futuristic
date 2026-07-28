import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1EvaluationAuditEvent,
  KEP1EvaluationRepository,
  KEP1OfflineEvaluationRecord,
} from "./kep1EvaluationTypes";

export const KEP1_EVALUATION_COLLECTIONS = {
  EVALUATIONS: "knowledgeGovernanceKep1OfflineEvaluations",
  AUDIT_EVENTS: "knowledgeGovernanceKep1EvaluationAuditEvents",
} as const;

export class FirestoreKEP1EvaluationRepository
  implements KEP1EvaluationRepository
{
  private db() {
    return getAdminDb();
  }

  async getEvaluation(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_EVALUATION_COLLECTIONS.EVALUATIONS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1OfflineEvaluationRecord)
      : null;
  }

  async listEvaluations() {
    const snapshot = await this.db()
      .collection(KEP1_EVALUATION_COLLECTIONS.EVALUATIONS)
      .orderBy("executedAt", "desc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1OfflineEvaluationRecord
    );
  }

  async createEvaluation(
    evaluation: KEP1OfflineEvaluationRecord,
    event: KEP1EvaluationAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const evaluationRef = this.db()
        .collection(KEP1_EVALUATION_COLLECTIONS.EVALUATIONS)
        .doc(evaluation.evaluationId);
      const auditRef = this.db()
        .collection(KEP1_EVALUATION_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [evaluationSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(evaluationRef),
        transaction.get(auditRef),
      ]);
      if (evaluationSnapshot.exists) {
        throw new Error("EVALUATION_IMMUTABLE_CONFLICT");
      }
      if (auditSnapshot.exists) {
        throw new Error("EVALUATION_AUDIT_IMMUTABLE_CONFLICT");
      }
      transaction.create(evaluationRef, evaluation);
      transaction.create(auditRef, event);
    });
  }
}
