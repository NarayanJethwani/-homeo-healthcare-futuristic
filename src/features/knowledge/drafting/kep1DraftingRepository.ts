import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
  KEP1DraftingRepository,
} from "./kep1DraftingTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1DraftingRepository implements KEP1DraftingRepository {
  private heads = new Map<string, KEP1DraftHead>();
  private revisions = new Map<string, KEP1DraftBundleRevision>();
  private events = new Map<string, KEP1DraftAuditEvent>();

  async getHead(id: string) {
    const value = this.heads.get(id);
    return value ? clone(value) : null;
  }

  async listHeads() {
    return [...this.heads.values()]
      .sort((a, b) => a.entityId.localeCompare(b.entityId))
      .map(clone);
  }

  async getRevision(id: string) {
    const value = this.revisions.get(id);
    return value ? clone(value) : null;
  }

  async listRevisions() {
    return [...this.revisions.values()]
      .sort((a, b) => a.revisionId.localeCompare(b.revisionId))
      .map(clone);
  }

  async createRevision(
    head: KEP1DraftHead,
    expectedRevisionNumber: number | null,
    revision: KEP1DraftBundleRevision,
    event: KEP1DraftAuditEvent
  ) {
    const current = this.heads.get(head.draftId);
    if (expectedRevisionNumber === null) {
      if (current) throw new Error("DRAFT_HEAD_ALREADY_EXISTS");
    } else if (
      !current ||
      current.currentRevisionNumber !== expectedRevisionNumber
    ) {
      throw new Error("DRAFT_REVISION_CONFLICT");
    }
    if (this.revisions.has(revision.revisionId)) {
      throw new Error("DRAFT_REVISION_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("DRAFT_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.heads.set(head.draftId, clone(head));
    this.revisions.set(revision.revisionId, clone(revision));
    this.events.set(event.eventId, clone(event));
  }
}
