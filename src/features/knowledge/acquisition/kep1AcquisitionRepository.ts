import type {
  KEP1AcquisitionAuditEvent,
  KEP1AcquisitionRepository,
  KEP1AssignmentDecisionRecord,
  KEP1SourceAcquisitionRecord,
} from "./kep1AcquisitionTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1AcquisitionRepository
  implements KEP1AcquisitionRepository
{
  private assignments = new Map<string, KEP1AssignmentDecisionRecord>();
  private sources = new Map<string, KEP1SourceAcquisitionRecord>();
  private events = new Map<string, KEP1AcquisitionAuditEvent>();

  async getAssignment(id: string) {
    const value = this.assignments.get(id);
    return value ? clone(value) : null;
  }

  async listAssignments() {
    return [...this.assignments.values()]
      .sort((a, b) => a.assignmentId.localeCompare(b.assignmentId))
      .map(clone);
  }

  async saveAssignment(
    record: KEP1AssignmentDecisionRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionAuditEvent
  ) {
    const current = this.assignments.get(record.assignmentId);
    if (expectedVersion === null) {
      if (current) throw new Error("ACQUISITION_ASSIGNMENT_ALREADY_EXISTS");
    } else if (!current || current.version !== expectedVersion) {
      throw new Error("ACQUISITION_VERSION_CONFLICT");
    }
    this.assignments.set(record.assignmentId, clone(record));
    this.events.set(event.eventId, clone(event));
  }

  async getSource(id: string) {
    const value = this.sources.get(id);
    return value ? clone(value) : null;
  }

  async listSources() {
    return [...this.sources.values()]
      .sort((a, b) => a.sourceId.localeCompare(b.sourceId))
      .map(clone);
  }

  async saveSource(
    record: KEP1SourceAcquisitionRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionAuditEvent
  ) {
    const current = this.sources.get(record.sourceId);
    if (expectedVersion === null) {
      if (current) throw new Error("ACQUISITION_SOURCE_ALREADY_EXISTS");
    } else if (!current || current.version !== expectedVersion) {
      throw new Error("ACQUISITION_VERSION_CONFLICT");
    }
    this.sources.set(record.sourceId, clone(record));
    this.events.set(event.eventId, clone(event));
  }
}
