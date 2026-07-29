import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  ControlledReleaseAuditEvent,
  ControlledReleaseHead,
  ControlledReleaseRecord,
  ControlledReleaseRepository,
} from "./controlledReleaseTypes";

export const CONTROLLED_RELEASE_COLLECTIONS = {
  RELEASES: "knowledgeGovernanceControlledReleases",
  AUDIT_EVENTS: "knowledgeGovernanceControlledReleaseAuditEvents",
  HEADS: "knowledgeGovernanceControlledReleaseHeads",
} as const;

export class FirestoreControlledReleaseRepository
  implements ControlledReleaseRepository
{
  private db() {
    return getAdminDb();
  }

  async getRelease(releaseId: string) {
    const snapshot = await this.db()
      .collection(CONTROLLED_RELEASE_COLLECTIONS.RELEASES)
      .doc(releaseId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as ControlledReleaseRecord)
      : null;
  }

  async getHead(entityId: string) {
    const snapshot = await this.db()
      .collection(CONTROLLED_RELEASE_COLLECTIONS.HEADS)
      .doc(entityId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as ControlledReleaseHead)
      : null;
  }

  async listReleases() {
    const snapshot = await this.db()
      .collection(CONTROLLED_RELEASE_COLLECTIONS.RELEASES)
      .orderBy("recordedAt", "desc")
      .limit(1_000)
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as ControlledReleaseRecord
    );
  }

  async createRelease(
    release: ControlledReleaseRecord,
    auditEvent: ControlledReleaseAuditEvent,
    expectedPreviousReleaseId: string | null
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const releaseRef = this.db()
        .collection(CONTROLLED_RELEASE_COLLECTIONS.RELEASES)
        .doc(release.releaseId);
      const auditRef = this.db()
        .collection(CONTROLLED_RELEASE_COLLECTIONS.AUDIT_EVENTS)
        .doc(auditEvent.eventId);
      const headRef = this.db()
        .collection(CONTROLLED_RELEASE_COLLECTIONS.HEADS)
        .doc(release.entityId);
      const [releaseSnapshot, auditSnapshot, headSnapshot] =
        await Promise.all([
          transaction.get(releaseRef),
          transaction.get(auditRef),
          transaction.get(headRef),
        ]);

      if (releaseSnapshot.exists || auditSnapshot.exists) {
        throw new Error("CONTROLLED_RELEASE_IMMUTABLE_CONFLICT");
      }
      const currentHead = headSnapshot.exists
        ? (headSnapshot.data() as ControlledReleaseHead)
        : null;
      if (
        (currentHead?.releaseId || null) !== expectedPreviousReleaseId
      ) {
        throw new Error("CONTROLLED_RELEASE_HEAD_CONFLICT");
      }

      transaction.create(releaseRef, release);
      transaction.create(auditRef, auditEvent);
      transaction.set(headRef, {
        entityId: release.entityId,
        releaseId: release.releaseId,
        entityRevisionSha256: release.entityRevisionSha256,
        recordedAt: release.recordedAt,
      } satisfies ControlledReleaseHead);
    });
  }
}
