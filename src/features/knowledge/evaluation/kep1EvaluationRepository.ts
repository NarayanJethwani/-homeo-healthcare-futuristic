import type {
  KEP1EvaluationAuditEvent,
  KEP1EvaluationRepository,
  KEP1OfflineEvaluationRecord,
} from "./kep1EvaluationTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1EvaluationRepository
  implements KEP1EvaluationRepository
{
  private evaluations = new Map<string, KEP1OfflineEvaluationRecord>();
  private events = new Map<string, KEP1EvaluationAuditEvent>();

  async getEvaluation(id: string) {
    const value = this.evaluations.get(id);
    return value ? clone(value) : null;
  }

  async listEvaluations() {
    return [...this.evaluations.values()]
      .sort((a, b) => a.evaluationId.localeCompare(b.evaluationId))
      .map(clone);
  }

  async createEvaluation(
    evaluation: KEP1OfflineEvaluationRecord,
    event: KEP1EvaluationAuditEvent
  ) {
    if (this.evaluations.has(evaluation.evaluationId)) {
      throw new Error("EVALUATION_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("EVALUATION_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.evaluations.set(evaluation.evaluationId, clone(evaluation));
    this.events.set(event.eventId, clone(event));
  }
}
