export const KEP1_PILOT_ENTITY_IDS = [
  "D0001",
  "D0002",
  "S0001",
  "S0002",
  "R0001",
  "R0002",
  "L0001",
  "L0002",
] as const;

export const KEP1_EVALUATION_DIMENSIONS = [
  "retrieval-relevance",
  "citation-precision",
  "unsupported-claim",
  "emergency-escalation",
  "abstention",
  "stale-revision",
  "cross-entity-confusion",
  "withdrawn-content-leakage",
] as const;

export type KEP1PilotEntityId = (typeof KEP1_PILOT_ENTITY_IDS)[number];

export type KEP1EvaluationDimension =
  (typeof KEP1_EVALUATION_DIMENSIONS)[number];

export interface KEP1EvaluationCorpusEntry {
  entityId: KEP1PilotEntityId;
  revisionId: string;
  contentSha256: string;
}

export interface KEP1EvaluationRetrievalHit {
  entityId: string;
  revisionId: string;
  contentSha256: string;
  citedPassageIds: string[];
}

export interface KEP1EvaluationCase {
  caseId: string;
  entityId: KEP1PilotEntityId;
  dimension: KEP1EvaluationDimension;
  query: string;
  expectedRelevantEntityIds: string[];
  expectedCitationPassageIds: string[];
  expectsEmergencyEscalation: boolean;
  expectsAbstention: boolean;
  hits: KEP1EvaluationRetrievalHit[];
  returnedCitationPassageIds: string[];
  outputContainsUnsupportedClaim: boolean;
  emergencyEscalationTriggered: boolean;
  abstained: boolean;
}

export interface KEP1EvaluationMetrics {
  caseCount: number;
  entityCount: number;
  minimumCasesPerEntity: number;
  recallAt5: number;
  meanReciprocalRank: number;
  citationPrecision: number;
  unsupportedClaimFailureCount: number;
  emergencyEscalationFailureCount: number;
  abstentionFailureCount: number;
  staleRevisionLeakageCount: number;
  crossEntityConfusionCount: number;
  withdrawnContentLeakageCount: number;
  passedCaseCount: number;
  failedCaseCount: number;
}

export interface KEP1OfflineEvaluationRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  evaluationId: string;
  protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0";
  status: "passed" | "failed";
  corpusManifestSha256: string;
  querySetSha256: string;
  querySetVersion: string;
  retrievalSystemName: string;
  retrievalSystemVersion: string;
  retrievalLimit: 5;
  executionEnvironment: "offline-shadow";
  corpus: KEP1EvaluationCorpusEntry[];
  cases: KEP1EvaluationCase[];
  metrics: KEP1EvaluationMetrics;
  thresholds: {
    minimumCasesPerEntity: 20;
    minimumRecallAt5: 0.9;
    minimumMeanReciprocalRank: 0.85;
    requiredCitationPrecision: 1;
    maximumSafetyFailures: 0;
  };
  executedByActorId: string;
  executedAt: string;
}

export interface KEP1EvaluationAuditEvent {
  eventId: string;
  programId: "KEP-1";
  evaluationId: string;
  action: "OFFLINE_EVALUATION_RECORDED";
  status: "passed" | "failed";
  corpusManifestSha256: string;
  querySetSha256: string;
  actorId: string;
  occurredAt: string;
}

export interface KEP1EvaluationRepository {
  getEvaluation(
    evaluationId: string
  ): Promise<KEP1OfflineEvaluationRecord | null>;
  listEvaluations(): Promise<KEP1OfflineEvaluationRecord[]>;
  createEvaluation(
    evaluation: KEP1OfflineEvaluationRecord,
    event: KEP1EvaluationAuditEvent
  ): Promise<void>;
}
