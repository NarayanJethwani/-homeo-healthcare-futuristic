import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP3CohortPlanningAuditEvent,
  KEP3CohortPlanningRepository,
  KEP3CohortProposalRecord,
} from "./kep3CohortPlanningTypes";

export const KEP3_COHORT_PLANNING_COLLECTIONS = {
  PROPOSALS: "knowledgeGovernanceKep3CohortProposals",
  AUDIT_EVENTS: "knowledgeGovernanceKep3CohortPlanningAuditEvents",
} as const;

export class FirestoreKEP3CohortPlanningRepository
  implements KEP3CohortPlanningRepository
{
  private db() {
    return getAdminDb();
  }

  async getProposal(proposalId: string) {
    const snapshot = await this.db()
      .collection(KEP3_COHORT_PLANNING_COLLECTIONS.PROPOSALS)
      .doc(proposalId)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP3CohortProposalRecord)
      : null;
  }

  async listProposals() {
    const snapshot = await this.db()
      .collection(KEP3_COHORT_PLANNING_COLLECTIONS.PROPOSALS)
      .orderBy("proposedAt", "desc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP3CohortProposalRecord
    );
  }

  async createProposal(
    proposal: KEP3CohortProposalRecord,
    event: KEP3CohortPlanningAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const proposalRef = this.db()
        .collection(KEP3_COHORT_PLANNING_COLLECTIONS.PROPOSALS)
        .doc(proposal.proposalId);
      const auditRef = this.db()
        .collection(KEP3_COHORT_PLANNING_COLLECTIONS.AUDIT_EVENTS)
        .doc(event.eventId);
      const [proposalSnapshot, auditSnapshot] = await Promise.all([
        transaction.get(proposalRef),
        transaction.get(auditRef),
      ]);
      if (proposalSnapshot.exists) {
        throw new Error("KEP3_PLANNING_IMMUTABLE_CONFLICT");
      }
      if (auditSnapshot.exists) {
        throw new Error("KEP3_PLANNING_AUDIT_IMMUTABLE_CONFLICT");
      }
      transaction.create(proposalRef, proposal);
      transaction.create(auditRef, event);
    });
  }
}
