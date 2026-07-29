export type ControlledReleasePhase = "canary" | "general";

export type ControlledReleaseOutcome =
  | "release-authorized"
  | "canary-observation-passed"
  | "release-rolled-back";

export interface ControlledReleaseChannels {
  publication: boolean;
  rag: boolean;
}

export interface ControlledReleaseAttestations {
  revisionRechecked: true;
  citationsRechecked: true;
  safetyBoundariesRechecked: true;
  rollbackReady: true;
}

export interface ControlledReleaseObservation {
  observationMinutes: number;
  safetyIncidentCount: 0;
  prohibitedClaimDetectionCount: 0;
  retrievalLeakageCount: 0;
}

export interface ControlledReleaseRecord {
  schemaVersion: "1.0.0";
  releaseId: string;
  entityId: string;
  entityRevisionSha256: string;
  safetyDecisionId: string;
  phase: ControlledReleasePhase;
  outcome: ControlledReleaseOutcome;
  channels: ControlledReleaseChannels;
  rationale: string;
  attestations: ControlledReleaseAttestations;
  observation: ControlledReleaseObservation | null;
  actorId: string;
  actorName: string;
  actorRole: string;
  recordedAt: string;
  supersedesReleaseId: string | null;
  publicationReleaseAuthorized: boolean;
  ragReleaseAuthorized: boolean;
  executionApplied: false;
}

export interface ControlledReleaseAuditEvent {
  schemaVersion: "1.0.0";
  eventId: string;
  releaseId: string;
  entityId: string;
  entityRevisionSha256: string;
  outcome: ControlledReleaseOutcome;
  actorId: string;
  occurredAt: string;
  previousReleaseId: string | null;
}

export interface ControlledReleaseHead {
  entityId: string;
  releaseId: string;
  entityRevisionSha256: string;
  recordedAt: string;
}

export interface ControlledReleaseRepository {
  getRelease(releaseId: string): Promise<ControlledReleaseRecord | null>;
  getHead(entityId: string): Promise<ControlledReleaseHead | null>;
  listReleases(): Promise<ControlledReleaseRecord[]>;
  createRelease(
    release: ControlledReleaseRecord,
    auditEvent: ControlledReleaseAuditEvent,
    expectedPreviousReleaseId: string | null
  ): Promise<void>;
}

export interface ControlledReleaseCandidate {
  entityId: string;
  title: string;
  entityType: string;
  entityRevisionSha256: string;
  safetyDecisionId: string;
  citationIds: string[];
  preflightPassed: boolean;
  blockingReasons: string[];
  recommendedCanary: boolean;
  currentRelease: ControlledReleaseRecord | null;
  executionApplied: boolean;
  currentExecutionId: string | null;
  observationEligibleAt: string | null;
  observationWindowComplete: boolean;
}

export interface ControlledReleaseWorkspace {
  candidates: ControlledReleaseCandidate[];
  canaryPassed: boolean;
  canaryEntityId: string | null;
  authorizedCount: number;
  rolledBackCount: number;
  executionAppliedCount: number;
}

export interface ControlledReleaseActor {
  actorId: string;
  actorName: string;
  actorRole: string;
  canAuthorizePublication: boolean;
  canAuthorizeRag: boolean;
  canBypassSafetyWithdrawal: boolean;
}
