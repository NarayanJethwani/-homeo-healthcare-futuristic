import type {
  ControlledReleaseExecutionAuditEvent,
  ControlledReleaseExecutionHead,
  ControlledReleaseExecutionRecord,
  ControlledReleaseExecutionRepository,
} from "./controlledReleaseExecutionTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class MemoryControlledReleaseExecutionRepository
  implements ControlledReleaseExecutionRepository
{
  private executions = new Map<
    string,
    ControlledReleaseExecutionRecord
  >();
  private auditEvents = new Map<
    string,
    ControlledReleaseExecutionAuditEvent
  >();
  private heads = new Map<string, ControlledReleaseExecutionHead>();

  async getExecution(executionId: string) {
    const execution = this.executions.get(executionId);
    return execution ? clone(execution) : null;
  }

  async getHead(entityId: string) {
    const head = this.heads.get(entityId);
    return head ? clone(head) : null;
  }

  async listExecutions() {
    return [...this.executions.values()]
      .map(clone)
      .sort((left, right) =>
        right.executedAt.localeCompare(left.executedAt)
      );
  }

  async createExecution(
    execution: ControlledReleaseExecutionRecord,
    auditEvent: ControlledReleaseExecutionAuditEvent,
    expectedPreviousExecutionId: string | null
  ) {
    if (
      this.executions.has(execution.executionId) ||
      this.auditEvents.has(auditEvent.eventId)
    ) {
      throw new Error("CONTROLLED_EXECUTION_IMMUTABLE_CONFLICT");
    }
    const head = this.heads.get(execution.entityId);
    if (
      (head?.executionId || null) !== expectedPreviousExecutionId
    ) {
      throw new Error("CONTROLLED_EXECUTION_HEAD_CONFLICT");
    }
    this.executions.set(execution.executionId, clone(execution));
    this.auditEvents.set(auditEvent.eventId, clone(auditEvent));
    this.heads.set(execution.entityId, {
      entityId: execution.entityId,
      executionId: execution.executionId,
      releaseId: execution.releaseId,
      entityRevisionSha256: execution.entityRevisionSha256,
      outcome: execution.outcome,
      executedAt: execution.executedAt,
    });
  }

  async listAuditEventsForTests() {
    return [...this.auditEvents.values()].map(clone);
  }
}
