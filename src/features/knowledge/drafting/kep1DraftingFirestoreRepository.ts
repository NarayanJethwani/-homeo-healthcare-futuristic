import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
  KEP1DraftingRepository,
} from "./kep1DraftingTypes";

export const KEP1_DRAFTING_COLLECTIONS = {
  HEADS: "knowledgeGovernanceKep1DraftHeads",
  REVISIONS: "knowledgeGovernanceKep1DraftRevisions",
  AUDIT_EVENTS: "knowledgeGovernanceKep1DraftAuditEvents",
} as const;

export class FirestoreKEP1DraftingRepository
  implements KEP1DraftingRepository
{
  private db() {
    return getAdminDb();
  }

  async getHead(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_DRAFTING_COLLECTIONS.HEADS)
      .doc(id)
      .get();
    return snapshot.exists ? (snapshot.data() as KEP1DraftHead) : null;
  }

  async listHeads() {
    const snapshot = await this.db()
      .collection(KEP1_DRAFTING_COLLECTIONS.HEADS)
      .orderBy("entityId", "asc")
      .get();
    return snapshot.docs.map((document: any) => document.data() as KEP1DraftHead);
  }

  async getRevision(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_DRAFTING_COLLECTIONS.REVISIONS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1DraftBundleRevision)
      : null;
  }

  async listRevisions() {
    const snapshot = await this.db()
      .collection(KEP1_DRAFTING_COLLECTIONS.REVISIONS)
      .orderBy("revisionId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1DraftBundleRevision
    );
  }

  async createRevision(
    head: KEP1DraftHead,
    expectedRevisionNumber: number | null,
    revision: KEP1DraftBundleRevision,
    event: KEP1DraftAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const headRef = this.db()
        .collection(KEP1_DRAFTING_COLLECTIONS.HEADS)
        .doc(head.draftId);
      const revisionRef = this.db()
        .collection(KEP1_DRAFTING_COLLECTIONS.REVISIONS)
        .doc(revision.revisionId);
      const auditRef = this.db()
        .collection(KEP1_DRAFTING_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [headSnapshot, revisionSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(headRef),
        transaction.get(revisionRef),
        transaction.get(auditRef),
      ]);

      if (expectedRevisionNumber === null) {
        if (headSnapshot.exists) throw new Error("DRAFT_HEAD_ALREADY_EXISTS");
      } else if (
        !headSnapshot.exists ||
        (headSnapshot.data() as KEP1DraftHead).currentRevisionNumber !==
          expectedRevisionNumber
      ) {
        throw new Error("DRAFT_REVISION_CONFLICT");
      }
      if (revisionSnapshot.exists) {
        throw new Error("DRAFT_REVISION_IMMUTABLE_CONFLICT");
      }
      if (auditSnapshot.exists) {
        throw new Error("DRAFT_AUDIT_IMMUTABLE_CONFLICT");
      }

      transaction.set(headRef, head);
      transaction.create(revisionRef, revision);
      transaction.create(auditRef, event);
    });
  }
}
