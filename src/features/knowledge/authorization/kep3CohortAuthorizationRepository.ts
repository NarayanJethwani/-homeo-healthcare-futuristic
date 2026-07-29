import type {
  KEP3CohortAuthorizationAuditEvent,
  KEP3CohortAuthorizationRecord,
  KEP3CohortAuthorizationRepository,
} from "./kep3CohortAuthorizationTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP3CohortAuthorizationRepository
  implements KEP3CohortAuthorizationRepository
{
  private authorizations = new Map<
    string,
    KEP3CohortAuthorizationRecord
  >();
  private events = new Map<string, KEP3CohortAuthorizationAuditEvent>();

  async getAuthorization(authorizationId: string) {
    const authorization = this.authorizations.get(authorizationId);
    return authorization ? clone(authorization) : null;
  }

  async listAuthorizations() {
    return [...this.authorizations.values()]
      .sort((left, right) =>
        right.authorizedAt.localeCompare(left.authorizedAt)
      )
      .map(clone);
  }

  async createAuthorization(
    authorization: KEP3CohortAuthorizationRecord,
    event: KEP3CohortAuthorizationAuditEvent
  ) {
    if (this.authorizations.has(authorization.authorizationId)) {
      throw new Error("KEP3_AUTHORIZATION_IMMUTABLE_CONFLICT");
    }
    if (this.events.has(event.eventId)) {
      throw new Error("KEP3_AUTHORIZATION_AUDIT_IMMUTABLE_CONFLICT");
    }
    this.authorizations.set(
      authorization.authorizationId,
      clone(authorization)
    );
    this.events.set(event.eventId, clone(event));
  }
}
