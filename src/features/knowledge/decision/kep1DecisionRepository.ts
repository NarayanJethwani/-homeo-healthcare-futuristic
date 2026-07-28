import type {
  KEP1DecisionAuditEvent,
  KEP1DecisionRepository,
  KEP1GoNoGoDecisionRecord,
} from "./kep1DecisionTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1DecisionRepository implements KEP1DecisionRepository {
  private decisions = new Map<string, KEP1GoNoGoDecisionRecord>();
  private events = new Map<string, KEP1DecisionAuditEvent>();

  async getDecision(id: string) {
    const value = this.decisions.get(id);
    return value ? clone(value) : null;
  }

  async listDecisions() {
    return [...this.decisions.values()]
      .sort((a, b) => a.decisionId.localeCompare(b.decisionId))
      .map(clone);
  }

  async createDecision(
    decision: KEP1GoNoGoDecisionRecord,
    event: KEP1DecisionAuditEvent
  ) {
    if (this.decisions.has(decision.decisionId)) {
      throw new Error("GO_NO_GO_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("GO_NO_GO_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.decisions.set(decision.decisionId, clone(decision));
    this.events.set(event.eventId, clone(event));
  }
}
