import type {
  ControlledReleaseAuditEvent,
  ControlledReleaseHead,
  ControlledReleaseRecord,
  ControlledReleaseRepository,
} from "./controlledReleaseTypes";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class MemoryControlledReleaseRepository
  implements ControlledReleaseRepository
{
  private releases = new Map<string, ControlledReleaseRecord>();
  private auditEvents = new Map<string, ControlledReleaseAuditEvent>();
  private heads = new Map<string, ControlledReleaseHead>();

  async getRelease(releaseId: string) {
    const release = this.releases.get(releaseId);
    return release ? clone(release) : null;
  }

  async getHead(entityId: string) {
    const head = this.heads.get(entityId);
    return head ? clone(head) : null;
  }

  async listReleases() {
    return [...this.releases.values()]
      .map(clone)
      .sort((left, right) => right.recordedAt.localeCompare(left.recordedAt));
  }

  async createRelease(
    release: ControlledReleaseRecord,
    auditEvent: ControlledReleaseAuditEvent,
    expectedPreviousReleaseId: string | null
  ) {
    if (
      this.releases.has(release.releaseId) ||
      this.auditEvents.has(auditEvent.eventId)
    ) {
      throw new Error("CONTROLLED_RELEASE_IMMUTABLE_CONFLICT");
    }
    const head = this.heads.get(release.entityId);
    if ((head?.releaseId || null) !== expectedPreviousReleaseId) {
      throw new Error("CONTROLLED_RELEASE_HEAD_CONFLICT");
    }
    this.releases.set(release.releaseId, clone(release));
    this.auditEvents.set(auditEvent.eventId, clone(auditEvent));
    this.heads.set(release.entityId, {
      entityId: release.entityId,
      releaseId: release.releaseId,
      entityRevisionSha256: release.entityRevisionSha256,
      recordedAt: release.recordedAt,
    });
  }

  async listAuditEventsForTests() {
    return [...this.auditEvents.values()].map(clone);
  }
}
