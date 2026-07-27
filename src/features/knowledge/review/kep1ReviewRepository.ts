import type {
  KEP1IndependentReviewRecord,
  KEP1ReviewAuditEvent,
  KEP1ReviewRepository,
} from "./kep1ReviewTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1ReviewRepository implements KEP1ReviewRepository {
  private reviews = new Map<string, KEP1IndependentReviewRecord>();
  private events = new Map<string, KEP1ReviewAuditEvent>();

  async getReview(id: string) {
    const value = this.reviews.get(id);
    return value ? clone(value) : null;
  }

  async listReviews() {
    return [...this.reviews.values()]
      .sort((a, b) => a.reviewId.localeCompare(b.reviewId))
      .map(clone);
  }

  async createReview(
    review: KEP1IndependentReviewRecord,
    event: KEP1ReviewAuditEvent
  ) {
    if (this.reviews.has(review.reviewId)) {
      throw new Error("REVIEW_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("REVIEW_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.reviews.set(review.reviewId, clone(review));
    this.events.set(event.eventId, clone(event));
  }
}
