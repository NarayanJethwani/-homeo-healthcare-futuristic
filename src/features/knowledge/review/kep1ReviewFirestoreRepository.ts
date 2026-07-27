import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1IndependentReviewRecord,
  KEP1ReviewAuditEvent,
  KEP1ReviewRepository,
} from "./kep1ReviewTypes";

export const KEP1_REVIEW_COLLECTIONS = {
  REVIEWS: "knowledgeGovernanceKep1IndependentReviews",
  AUDIT_EVENTS: "knowledgeGovernanceKep1ReviewAuditEvents",
} as const;

export class FirestoreKEP1ReviewRepository implements KEP1ReviewRepository {
  private db() {
    return getAdminDb();
  }

  async getReview(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_REVIEW_COLLECTIONS.REVIEWS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1IndependentReviewRecord)
      : null;
  }

  async listReviews() {
    const snapshot = await this.db()
      .collection(KEP1_REVIEW_COLLECTIONS.REVIEWS)
      .orderBy("reviewId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1IndependentReviewRecord
    );
  }

  async createReview(
    review: KEP1IndependentReviewRecord,
    event: KEP1ReviewAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const reviewRef = this.db()
        .collection(KEP1_REVIEW_COLLECTIONS.REVIEWS)
        .doc(review.reviewId);
      const auditRef = this.db()
        .collection(KEP1_REVIEW_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [reviewSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(reviewRef),
        transaction.get(auditRef),
      ]);
      if (reviewSnapshot.exists) throw new Error("REVIEW_IMMUTABLE_CONFLICT");
      if (auditSnapshot.exists) {
        throw new Error("REVIEW_AUDIT_IMMUTABLE_CONFLICT");
      }
      transaction.create(reviewRef, review);
      transaction.create(auditRef, event);
    });
  }
}
