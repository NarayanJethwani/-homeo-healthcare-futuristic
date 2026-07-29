export type ControlledReleaseExecutionOutcome =
  | "publication-canary-executed"
  | "publication-canary-rolled-back";

export interface ControlledReleaseExecutionRecord {
  schemaVersion: "1.0.0";
  executionId: string;
  releaseId: string;
  entityId: string;
  entityRevisionSha256: string;
  outcome: ControlledReleaseExecutionOutcome;
  publicationApplied: boolean;
  ragApplied: false;
  actorId: string;
  actorName: string;
  actorRole: string;
  rationale: string;
  executedAt: string;
  observationEligibleAt: string | null;
  automaticRollbackAt: string | null;
  supersedesExecutionId: string | null;
}

export interface ControlledReleaseExecutionAuditEvent {
  schemaVersion: "1.0.0";
  eventId: string;
  executionId: string;
  releaseId: string;
  entityId: string;
  entityRevisionSha256: string;
  outcome: ControlledReleaseExecutionOutcome;
  actorId: string;
  occurredAt: string;
  previousExecutionId: string | null;
}

export interface ControlledReleaseExecutionHead {
  entityId: string;
  executionId: string;
  releaseId: string;
  entityRevisionSha256: string;
  outcome: ControlledReleaseExecutionOutcome;
  executedAt: string;
}

export interface ControlledReleaseExecutionRepository {
  getExecution(
    executionId: string
  ): Promise<ControlledReleaseExecutionRecord | null>;
  getHead(
    entityId: string
  ): Promise<ControlledReleaseExecutionHead | null>;
  listExecutions(): Promise<ControlledReleaseExecutionRecord[]>;
  createExecution(
    execution: ControlledReleaseExecutionRecord,
    auditEvent: ControlledReleaseExecutionAuditEvent,
    expectedPreviousExecutionId: string | null
  ): Promise<void>;
}

export interface ControlledReleaseExecutionCandidate {
  entityId: string;
  title: string;
  entityRevisionSha256: string;
  releaseId: string;
  releaseOutcome: string;
  canExecute: boolean;
  blockingReasons: string[];
  currentExecution: ControlledReleaseExecutionRecord | null;
}

export interface ControlledReleaseExecutionWorkspace {
  candidates: ControlledReleaseExecutionCandidate[];
  activeCanaryCount: number;
  executedCount: number;
  rolledBackCount: number;
}

export interface ControlledReleaseExecutionActor {
  actorId: string;
  actorName: string;
  actorRole: string;
  canExecutePublication: boolean;
  canBypassSafetyWithdrawal: boolean;
}

export interface ControlledPublicationOverride {
  entityId: string;
  entityRevisionSha256: string;
  releaseId: string;
  executionId: string;
  publicationApplied: true;
  ragApplied: false;
}
