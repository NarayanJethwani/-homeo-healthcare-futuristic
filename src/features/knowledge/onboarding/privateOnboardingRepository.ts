import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
  KEP1PrivateOnboardingRepository,
} from "./privateOnboardingTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1PrivateOnboardingRepository
  implements KEP1PrivateOnboardingRepository
{
  private records = new Map<string, KEP1PrivateOnboardingRecord>();
  private auditEvents = new Map<string, KEP1PrivateOnboardingAuditEvent>();

  async create(
    record: KEP1PrivateOnboardingRecord,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void> {
    if (this.records.has(record.recordId)) {
      throw new Error("ONBOARDING_RECORD_ALREADY_EXISTS");
    }
    if (await this.findByIdentityHash(record.identity.valueHash)) {
      throw new Error("ONBOARDING_IDENTITY_ALREADY_EXISTS");
    }
    this.records.set(record.recordId, clone(record));
    this.auditEvents.set(auditEvent.eventId, clone(auditEvent));
  }

  async verify(
    record: KEP1PrivateOnboardingRecord,
    expectedVersion: number,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void> {
    const current = this.records.get(record.recordId);
    if (!current) {
      throw new Error("ONBOARDING_RECORD_NOT_FOUND");
    }
    if (current.version !== expectedVersion) {
      throw new Error("ONBOARDING_VERSION_CONFLICT");
    }
    if (
      current.identity.scheme !== record.identity.scheme ||
      current.identity.valueHash !== record.identity.valueHash ||
      current.kind !== record.kind
    ) {
      throw new Error("ONBOARDING_IMMUTABLE_IDENTITY_CONFLICT");
    }
    this.records.set(record.recordId, clone(record));
    this.auditEvents.set(auditEvent.eventId, clone(auditEvent));
  }

  async get(recordId: string): Promise<KEP1PrivateOnboardingRecord | null> {
    const record = this.records.get(recordId);
    return record ? clone(record) : null;
  }

  async findByIdentityHash(
    valueHash: string
  ): Promise<KEP1PrivateOnboardingRecord | null> {
    const record = [...this.records.values()].find(
      (candidate) => candidate.identity.valueHash === valueHash
    );
    return record ? clone(record) : null;
  }

  async list(): Promise<KEP1PrivateOnboardingRecord[]> {
    return [...this.records.values()]
      .sort((left, right) => left.recordId.localeCompare(right.recordId))
      .map(clone);
  }

  async listAuditEvents(
    recordId: string
  ): Promise<KEP1PrivateOnboardingAuditEvent[]> {
    return [...this.auditEvents.values()]
      .filter((event) => event.recordId === recordId)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt))
      .map(clone);
  }
}
