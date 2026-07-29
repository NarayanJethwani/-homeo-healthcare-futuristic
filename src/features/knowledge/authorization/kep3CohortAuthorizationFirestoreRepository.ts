import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP3CohortAuthorizationAuditEvent,
  KEP3CohortAuthorizationRecord,
  KEP3CohortAuthorizationRepository,
} from "./kep3CohortAuthorizationTypes";

export const KEP3_COHORT_AUTHORIZATION_COLLECTIONS = {
  AUTHORIZATIONS: "knowledgeGovernanceKep3CohortAuthorizations",
  AUDIT_EVENTS: "knowledgeGovernanceKep3CohortAuthorizationAuditEvents",
} as const;

export class FirestoreKEP3CohortAuthorizationRepository
  implements KEP3CohortAuthorizationRepository
{
  private db() {
    return getAdminDb();
  }

  async getAuthorization(authorizationId: string) {
    const snapshot = await this.db()
      .collection(KEP3_COHORT_AUTHORIZATION_COLLECTIONS.AUTHORIZATIONS)
      .doc(authorizationId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP3CohortAuthorizationRecord)
      : null;
  }

  async listAuthorizations() {
    const snapshot = await this.db()
      .collection(KEP3_COHORT_AUTHORIZATION_COLLECTIONS.AUTHORIZATIONS)
      .orderBy("authorizedAt", "desc")
      .get();
    return snapshot.docs.map(
      (document: any) =>
        document.data() as KEP3CohortAuthorizationRecord
    );
  }

  async createAuthorization(
    authorization: KEP3CohortAuthorizationRecord,
    event: KEP3CohortAuthorizationAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const authorizationRef = this.db()
        .collection(KEP3_COHORT_AUTHORIZATION_COLLECTIONS.AUTHORIZATIONS)
        .doc(authorization.authorizationId);
      const auditRef = this.db()
        .collection(KEP3_COHORT_AUTHORIZATION_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [authorizationSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(authorizationRef),
        transaction.get(auditRef),
      ]);
      if (authorizationSnapshot.exists) {
        throw new Error("KEP3_AUTHORIZATION_IMMUTABLE_CONFLICT");
      }
      if (auditSnapshot.exists) {
        throw new Error("KEP3_AUTHORIZATION_AUDIT_IMMUTABLE_CONFLICT");
      }
      transaction.create(authorizationRef, authorization);
      transaction.create(auditRef, event);
    });
  }
}
