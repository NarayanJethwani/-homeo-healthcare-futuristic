import type {
  FastTrackDecisionAuditEvent,
  FastTrackDecisionHead,
  FastTrackDecisionRecord,
  FastTrackDecisionRepository,
} from "./fastTrackDecisionTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class MemoryFastTrackDecisionRepository
  implements FastTrackDecisionRepository
{
  private decisions = new Map<string, FastTrackDecisionRecord>();
  private auditEvents = new Map<string, FastTrackDecisionAuditEvent>();
  private heads = new Map<string, FastTrackDecisionHead>();

  async getDecision(decisionId: string) {
    const decision = this.decisions.get(decisionId);
    return decision ? clone(decision) : null;
  }

  async getHead(entityId: string) {
    const head = this.heads.get(entityId);
    return head ? clone(head) : null;
  }

  async listDecisions() {
    return [...this.decisions.values()]
      .map(clone)
      .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt));
  }

  async createDecision(
    decision: FastTrackDecisionRecord,
    auditEvent: FastTrackDecisionAuditEvent,
    expectedPreviousDecisionId: string | null
  ) {
    if (
      this.decisions.has(decision.decisionId) ||
      this.auditEvents.has(auditEvent.eventId)
    ) {
      throw new Error("FAST_TRACK_DECISION_IMMUTABLE_CONFLICT");
    }
    const head = this.heads.get(decision.entityId);
    if ((head?.decisionId || null) !== expectedPreviousDecisionId) {
      throw new Error("FAST_TRACK_DECISION_HEAD_CONFLICT");
    }
    this.decisions.set(decision.decisionId, clone(decision));
    this.auditEvents.set(auditEvent.eventId, clone(auditEvent));
    this.heads.set(decision.entityId, {
      entityId: decision.entityId,
      decisionId: decision.decisionId,
      entityRevisionSha256: decision.entityRevisionSha256,
      recordedAt: decision.recordedAt,
    });
  }

  async listAuditEventsForTests() {
    return [...this.auditEvents.values()].map(clone);
  }
}
