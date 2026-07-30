import type {
  FastTrackAssessment,
  FastTrackSummary,
} from "./fastTrackPolicy";
import type { AuthorityLedDecisionRequirement } from "./authorityLedExpansionPolicy";

export type FastTrackDecisionOutcome =
  | "approved-reviewed"
  | "correction-requested"
  | "safety-block-maintained"
  | "safety-resolution-recorded";

export interface FastTrackDecisionAttestations {
  citationsChecked: true;
  clinicalAccuracyChecked: true;
  conventionalCareBoundaryChecked: true;
  conflictOfInterestDeclared: true;
  safetyCauseResolved: boolean;
}

export interface FastTrackDecisionRecord {
  schemaVersion: "1.0.0";
  decisionId: string;
  entityId: string;
  entityRevisionSha256: string;
  outcome: FastTrackDecisionOutcome;
  reviewedFlagCodes: string[];
  citationIds: string[];
  rationale: string;
  attestations: FastTrackDecisionAttestations;
  actorId: string;
  actorName: string;
  actorRole: string;
  recordedAt: string;
  supersedesDecisionId: string | null;
  publicationAuthorityGranted: false;
  ragAuthorityGranted: false;
}

export interface FastTrackDecisionAuditEvent {
  schemaVersion: "1.0.0";
  eventId: string;
  decisionId: string;
  entityId: string;
  entityRevisionSha256: string;
  outcome: FastTrackDecisionOutcome;
  actorId: string;
  occurredAt: string;
  previousDecisionId: string | null;
}

export interface FastTrackDecisionHead {
  entityId: string;
  decisionId: string;
  entityRevisionSha256: string;
  recordedAt: string;
}

export interface FastTrackDecisionRepository {
  getDecision(decisionId: string): Promise<FastTrackDecisionRecord | null>;
  getHead(entityId: string): Promise<FastTrackDecisionHead | null>;
  listDecisions(): Promise<FastTrackDecisionRecord[]>;
  createDecision(
    decision: FastTrackDecisionRecord,
    auditEvent: FastTrackDecisionAuditEvent,
    expectedPreviousDecisionId: string | null
  ): Promise<void>;
}

export interface FastTrackDecisionAssessment extends FastTrackAssessment {
  authorityRequirement: AuthorityLedDecisionRequirement;
  entityRevisionSha256: string;
  availableCitationIds: string[];
  currentDecision: FastTrackDecisionRecord | null;
  latestDecisionId: string | null;
  decisionRequired: boolean;
}

export interface FastTrackDecisionWorkspace {
  summary: FastTrackSummary;
  assessments: FastTrackDecisionAssessment[];
  openDecisionCount: number;
  decidedCount: number;
  activeSafetyControlCount: number;
}

export interface FastTrackDecisionActor {
  actorId: string;
  actorName: string;
  actorRole: string;
  canResolveSafetyWithdrawal: boolean;
}
