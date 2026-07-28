import type {
  KEP3CohortPlanningAuditEvent,
  KEP3CohortPlanningRepository,
  KEP3CohortProposalRecord,
} from "./kep3CohortPlanningTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP3CohortPlanningRepository
  implements KEP3CohortPlanningRepository
{
  private proposals = new Map<string, KEP3CohortProposalRecord>();
  private events = new Map<string, KEP3CohortPlanningAuditEvent>();

  async getProposal(proposalId: string) {
    const proposal = this.proposals.get(proposalId);
    return proposal ? clone(proposal) : null;
  }

  async listProposals() {
    return [...this.proposals.values()]
      .sort((left, right) => right.proposedAt.localeCompare(left.proposedAt))
      .map(clone);
  }

  async createProposal(
    proposal: KEP3CohortProposalRecord,
    event: KEP3CohortPlanningAuditEvent
  ) {
    if (this.proposals.has(proposal.proposalId)) {
      throw new Error("KEP3_PLANNING_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("KEP3_PLANNING_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.proposals.set(proposal.proposalId, clone(proposal));
    this.events.set(event.eventId, clone(event));
  }
}
