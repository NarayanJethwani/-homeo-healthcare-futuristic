import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  ControlledReleaseExecutionAuditEvent,
  ControlledReleaseExecutionHead,
  ControlledReleaseExecutionRecord,
  ControlledReleaseExecutionRepository,
} from "./controlledReleaseExecutionTypes";

export const CONTROLLED_EXECUTION_COLLECTIONS = {
  EXECUTIONS: "knowledgeGovernanceControlledReleaseExecutions",
  AUDIT_EVENTS:
    "knowledgeGovernanceControlledReleaseExecutionAuditEvents",
  HEADS: "knowledgeGovernanceControlledReleaseExecutionHeads",
} as const;

export class FirestoreControlledReleaseExecutionRepository
  implements ControlledReleaseExecutionRepository
{
  private db() {
    return getAdminDb();
  }

  async getExecution(executionId: string) {
    const snapshot = await this.db()
      .collection(CONTROLLED_EXECUTION_COLLECTIONS.EXECUTIONS)
      .doc(executionId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as ControlledReleaseExecutionRecord)
      : null;
  }

  async getHead(entityId: string) {
    const snapshot = await this.db()
      .collection(CONTROLLED_EXECUTION_COLLECTIONS.HEADS)
      .doc(entityId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as ControlledReleaseExecutionHead)
      : null;
  }

  async listExecutions() {
    const snapshot = await this.db()
      .collection(CONTROLLED_EXECUTION_COLLECTIONS.EXECUTIONS)
      .orderBy("executedAt", "desc")
      .limit(1_000)
      .get();
    return snapshot.docs.map(
      (document: any) =>
        document.data() as ControlledReleaseExecutionRecord
    );
  }

  async createExecution(
    execution: ControlledReleaseExecutionRecord,
    auditEvent: ControlledReleaseExecutionAuditEvent,
    expectedPreviousExecutionId: string | null
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const executionRef = this.db()
        .collection(CONTROLLED_EXECUTION_COLLECTIONS.EXECUTIONS)
        .doc(execution.executionId);
      const auditRef = this.db()
        .collection(CONTROLLED_EXECUTION_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const headRef = this.db()
        .collection(CONTROLLED_EXECUTION_COLLECTIONS.HEADS)
        .doc(execution.entityId);
      const [executionSnapshot, auditSnapshot, headSnapshot] =
        await Promise.all([
          transaction.get(executionRef),
          transaction.get(auditRef),
          transaction.get(headRef),
        ]);

      if (executionSnapshot.exists || auditSnapshot.exists) {
        throw new Error("CONTROLLED_EXECUTION_IMMUTABLE_CONFLICT");
      }
      const currentHead = headSnapshot.exists
        ? (headSnapshot.data() as ControlledReleaseExecutionHead)
        : null;
      if (
        (currentHead?.executionId || null) !==
        expectedPreviousExecutionId
      ) {
        throw new Error("CONTROLLED_EXECUTION_HEAD_CONFLICT");
      }

      transaction.create(executionRef, execution);
      transaction.create(auditRef, auditEvent);
      transaction.set(headRef, {
        entityId: execution.entityId,
        executionId: execution.executionId,
        releaseId: execution.releaseId,
        entityRevisionSha256: execution.entityRevisionSha256,
        outcome: execution.outcome,
        executedAt: execution.executedAt,
      } satisfies ControlledReleaseExecutionHead);
    });
  }
}
