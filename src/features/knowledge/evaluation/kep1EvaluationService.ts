import { createHash } from "node:crypto";
import type { KEP1DraftingRepository } from "../drafting/kep1DraftingTypes";
import type { KEP1ReviewRepository } from "../review/kep1ReviewTypes";
import type { SubmitKEP1OfflineEvaluationInput } from "./kep1EvaluationSchemas";
import {
  KEP1_EVALUATION_DIMENSIONS,
  KEP1_PILOT_ENTITY_IDS,
  type KEP1EvaluationAuditEvent,
  type KEP1EvaluationCase,
  type KEP1EvaluationCorpusEntry,
  type KEP1EvaluationMetrics,
  type KEP1EvaluationRepository,
  type KEP1OfflineEvaluationRecord,
} from "./kep1EvaluationTypes";

const WITHDRAWN_ENTITY_IDS = new Set(["D0007", "R0006", "FAQ-safety"]);
const MINIMUM_CASES_PER_ENTITY = 20;
const MINIMUM_RECALL_AT_5 = 0.9;
const MINIMUM_MRR = 0.85;

export interface KEP1EvaluationActor {
  actorId: string;
}

function sha256(value: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}

function unique(values: string[]): boolean {
  return new Set(values).size === values.length;
}

function sameMembers(actual: string[], expected: string[]): boolean {
  return (
    unique(actual) &&
    unique(expected) &&
    actual.length === expected.length &&
    actual.every((value) => expected.includes(value))
  );
}

function sameCorpus(
  actual: KEP1EvaluationCorpusEntry[],
  expected: KEP1EvaluationCorpusEntry[]
): boolean {
  if (!unique(actual.map((entry) => entry.entityId))) return false;
  if (actual.length !== expected.length) return false;
  return expected.every((entry) =>
    actual.some(
      (candidate) =>
        candidate.entityId === entry.entityId &&
        candidate.revisionId === entry.revisionId &&
        candidate.contentSha256 === entry.contentSha256
    )
  );
}

export function canonicalKEP1CorpusManifest(
  corpus: KEP1EvaluationCorpusEntry[]
) {
  return [...corpus].sort((a, b) => a.entityId.localeCompare(b.entityId));
}

export function canonicalKEP1QuerySet(cases: KEP1EvaluationCase[]) {
  return [...cases]
    .sort((a, b) => a.caseId.localeCompare(b.caseId))
    .map((testCase) => ({
      caseId: testCase.caseId,
      entityId: testCase.entityId,
      dimension: testCase.dimension,
      query: testCase.query,
      expectedRelevantEntityIds: [...testCase.expectedRelevantEntityIds].sort(),
      expectedCitationPassageIds: [
        ...testCase.expectedCitationPassageIds,
      ].sort(),
      expectsEmergencyEscalation: testCase.expectsEmergencyEscalation,
      expectsAbstention: testCase.expectsAbstention,
    }));
}

export function kep1CorpusManifestSha256(
  corpus: KEP1EvaluationCorpusEntry[]
): string {
  return sha256(canonicalKEP1CorpusManifest(corpus));
}

export function kep1QuerySetSha256(cases: KEP1EvaluationCase[]): string {
  return sha256(canonicalKEP1QuerySet(cases));
}

async function expectedCurrentCorpus(
  draftingRepository: KEP1DraftingRepository,
  reviewRepository: KEP1ReviewRepository
): Promise<KEP1EvaluationCorpusEntry[]> {
  const [heads, revisions, reviews] = await Promise.all([
    draftingRepository.listHeads(),
    draftingRepository.listRevisions(),
    reviewRepository.listReviews(),
  ]);
  return KEP1_PILOT_ENTITY_IDS.map((entityId) => {
    const head = heads.find((candidate) => candidate.entityId === entityId);
    const revision = revisions.find(
      (candidate) =>
        candidate.entityId === entityId &&
        candidate.revisionId === head?.currentRevisionId
    );
    if (!head || !revision) {
      throw new Error("EVALUATION_CURRENT_DRAFTS_INCOMPLETE");
    }
    const clinical = reviews.find(
      (review) =>
        review.revisionId === revision.revisionId &&
        review.reviewKind === "clinical" &&
        review.decision === "approved" &&
        review.reviewedContentSha256 === revision.contentSha256
    );
    const evidence = reviews.find(
      (review) =>
        review.revisionId === revision.revisionId &&
        review.reviewKind === "evidence" &&
        review.decision === "approved" &&
        review.reviewedContentSha256 === revision.contentSha256
    );
    if (
      !clinical ||
      !evidence ||
      clinical.reviewerContributorId === evidence.reviewerContributorId
    ) {
      throw new Error("EVALUATION_CURRENT_REVIEWS_INCOMPLETE");
    }
    return {
      entityId,
      revisionId: revision.revisionId,
      contentSha256: revision.contentSha256,
    };
  });
}

function validateCaseStructure(cases: KEP1EvaluationCase[]) {
  if (!unique(cases.map((testCase) => testCase.caseId))) {
    throw new Error("EVALUATION_DUPLICATE_CASE_ID");
  }
  for (const testCase of cases) {
    if (
      !unique(testCase.expectedRelevantEntityIds) ||
      !unique(testCase.expectedCitationPassageIds) ||
      !unique(testCase.returnedCitationPassageIds)
    ) {
      throw new Error("EVALUATION_DUPLICATE_EXPECTATION");
    }
    if (
      testCase.dimension === "retrieval-relevance" &&
      !testCase.expectedRelevantEntityIds.includes(testCase.entityId)
    ) {
      throw new Error("EVALUATION_RELEVANCE_EXPECTATION_REQUIRED");
    }
    if (
      testCase.dimension === "citation-precision" &&
      (testCase.expectedCitationPassageIds.length === 0 ||
        testCase.returnedCitationPassageIds.length === 0)
    ) {
      throw new Error("EVALUATION_CITATION_EXPECTATION_REQUIRED");
    }
    const hitCitationIds = testCase.hits.flatMap(
      (hit) => hit.citedPassageIds
    );
    if (
      !unique(hitCitationIds) ||
      !sameMembers(testCase.returnedCitationPassageIds, hitCitationIds)
    ) {
      throw new Error("EVALUATION_CITATION_TRACE_MISMATCH");
    }
    if (
      testCase.dimension === "emergency-escalation" &&
      !testCase.expectsEmergencyEscalation
    ) {
      throw new Error("EVALUATION_EMERGENCY_EXPECTATION_REQUIRED");
    }
    if (
      testCase.dimension === "abstention" &&
      (!testCase.expectsAbstention ||
        testCase.expectedRelevantEntityIds.length !== 0)
    ) {
      throw new Error("EVALUATION_ABSTENTION_EXPECTATION_REQUIRED");
    }
  }
  for (const entityId of KEP1_PILOT_ENTITY_IDS) {
    const entityCases = cases.filter(
      (testCase) => testCase.entityId === entityId
    );
    if (entityCases.length < MINIMUM_CASES_PER_ENTITY) {
      throw new Error("EVALUATION_ENTITY_CASE_COVERAGE_INCOMPLETE");
    }
    if (
      KEP1_EVALUATION_DIMENSIONS.some(
        (dimension) =>
          !entityCases.some((testCase) => testCase.dimension === dimension)
      )
    ) {
      throw new Error("EVALUATION_DIMENSION_COVERAGE_INCOMPLETE");
    }
  }
}

function computeMetrics(
  cases: KEP1EvaluationCase[],
  corpus: KEP1EvaluationCorpusEntry[]
): KEP1EvaluationMetrics {
  const corpusByEntity = new Map<string, KEP1EvaluationCorpusEntry>(
    corpus.map((entry) => [entry.entityId, entry])
  );
  const relevanceCases = cases.filter(
    (testCase) => testCase.dimension === "retrieval-relevance"
  );
  let relevantAt5 = 0;
  let reciprocalRankTotal = 0;
  for (const testCase of relevanceCases) {
    const rank = testCase.hits.findIndex((hit) =>
      testCase.expectedRelevantEntityIds.includes(hit.entityId)
    );
    if (rank >= 0 && rank < 5) {
      relevantAt5 += 1;
      reciprocalRankTotal += 1 / (rank + 1);
    }
  }

  const citationCases = cases.filter(
    (testCase) => testCase.dimension === "citation-precision"
  );
  const returnedCitations = citationCases.flatMap(
    (testCase) => testCase.returnedCitationPassageIds
  );
  const correctCitations = citationCases.reduce(
    (count, testCase) =>
      count +
      testCase.returnedCitationPassageIds.filter((citationId) =>
        testCase.expectedCitationPassageIds.includes(citationId)
      ).length,
    0
  );

  let unsupportedClaimFailureCount = 0;
  let emergencyEscalationFailureCount = 0;
  let abstentionFailureCount = 0;
  let staleRevisionLeakageCount = 0;
  let crossEntityConfusionCount = 0;
  let withdrawnContentLeakageCount = 0;
  let passedCaseCount = 0;

  for (const testCase of cases) {
    const unsupportedFailure =
      testCase.dimension === "unsupported-claim" &&
      testCase.outputContainsUnsupportedClaim;
    const emergencyFailure =
      testCase.dimension === "emergency-escalation" &&
      (!testCase.emergencyEscalationTriggered ||
        !testCase.expectsEmergencyEscalation);
    const abstentionFailure =
      testCase.dimension === "abstention" &&
      (!testCase.abstained ||
        !testCase.expectsAbstention ||
        testCase.hits.length > 0);
    const staleFailure = testCase.hits.some((hit) => {
      const current = corpusByEntity.get(hit.entityId);
      return (
        !current ||
        current.revisionId !== hit.revisionId ||
        current.contentSha256 !== hit.contentSha256
      );
    });
    const crossEntityFailure =
      testCase.dimension === "cross-entity-confusion" &&
      (testCase.hits.length === 0 ||
        !testCase.expectedRelevantEntityIds.includes(
          testCase.hits[0].entityId
        ));
    const withdrawnFailure = testCase.hits.some((hit) =>
      WITHDRAWN_ENTITY_IDS.has(hit.entityId)
    );

    unsupportedClaimFailureCount += Number(unsupportedFailure);
    emergencyEscalationFailureCount += Number(emergencyFailure);
    abstentionFailureCount += Number(abstentionFailure);
    staleRevisionLeakageCount += Number(staleFailure);
    crossEntityConfusionCount += Number(crossEntityFailure);
    withdrawnContentLeakageCount += Number(withdrawnFailure);
    if (
      !unsupportedFailure &&
      !emergencyFailure &&
      !abstentionFailure &&
      !staleFailure &&
      !crossEntityFailure &&
      !withdrawnFailure
    ) {
      passedCaseCount += 1;
    }
  }

  const counts = KEP1_PILOT_ENTITY_IDS.map(
    (entityId) =>
      cases.filter((testCase) => testCase.entityId === entityId).length
  );
  return {
    caseCount: cases.length,
    entityCount: KEP1_PILOT_ENTITY_IDS.length,
    minimumCasesPerEntity: Math.min(...counts),
    recallAt5:
      relevanceCases.length === 0 ? 0 : relevantAt5 / relevanceCases.length,
    meanReciprocalRank:
      relevanceCases.length === 0
        ? 0
        : reciprocalRankTotal / relevanceCases.length,
    citationPrecision:
      returnedCitations.length === 0
        ? 0
        : correctCitations / returnedCitations.length,
    unsupportedClaimFailureCount,
    emergencyEscalationFailureCount,
    abstentionFailureCount,
    staleRevisionLeakageCount,
    crossEntityConfusionCount,
    withdrawnContentLeakageCount,
    passedCaseCount,
    failedCaseCount: cases.length - passedCaseCount,
  };
}

function passed(metrics: KEP1EvaluationMetrics): boolean {
  return (
    metrics.minimumCasesPerEntity >= MINIMUM_CASES_PER_ENTITY &&
    metrics.recallAt5 >= MINIMUM_RECALL_AT_5 &&
    metrics.meanReciprocalRank >= MINIMUM_MRR &&
    metrics.citationPrecision === 1 &&
    metrics.unsupportedClaimFailureCount === 0 &&
    metrics.emergencyEscalationFailureCount === 0 &&
    metrics.abstentionFailureCount === 0 &&
    metrics.staleRevisionLeakageCount === 0 &&
    metrics.crossEntityConfusionCount === 0 &&
    metrics.withdrawnContentLeakageCount === 0
  );
}

export async function recordKEP1OfflineEvaluation(
  evaluationRepository: KEP1EvaluationRepository,
  draftingRepository: KEP1DraftingRepository,
  reviewRepository: KEP1ReviewRepository,
  input: SubmitKEP1OfflineEvaluationInput,
  actor: KEP1EvaluationActor,
  now: string
): Promise<KEP1OfflineEvaluationRecord> {
  const expectedCorpus = await expectedCurrentCorpus(
    draftingRepository,
    reviewRepository
  );
  if (!sameCorpus(input.corpus, expectedCorpus)) {
    throw new Error("EVALUATION_CORPUS_NOT_CURRENT");
  }
  const manifestHash = kep1CorpusManifestSha256(expectedCorpus);
  if (input.corpusManifestSha256 !== manifestHash) {
    throw new Error("EVALUATION_CORPUS_HASH_MISMATCH");
  }
  validateCaseStructure(input.cases);
  const querySetHash = kep1QuerySetSha256(input.cases);
  if (input.querySetSha256 !== querySetHash) {
    throw new Error("EVALUATION_QUERY_SET_HASH_MISMATCH");
  }

  const corpus = canonicalKEP1CorpusManifest(input.corpus);
  const cases = [...input.cases].sort((a, b) =>
    a.caseId.localeCompare(b.caseId)
  );
  const metrics = computeMetrics(cases, corpus);
  const evaluationId = `KEP1-EVAL-${sha256({
    protocolVersion: input.protocolVersion,
    corpus,
    querySetSha256: querySetHash,
    retrievalSystemName: input.retrievalSystemName,
    retrievalSystemVersion: input.retrievalSystemVersion,
    cases,
  })}`;
  const status = passed(metrics) ? "passed" : "failed";
  const evaluation: KEP1OfflineEvaluationRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    evaluationId,
    protocolVersion: input.protocolVersion,
    status,
    corpusManifestSha256: manifestHash,
    querySetSha256: querySetHash,
    querySetVersion: input.querySetVersion,
    retrievalSystemName: input.retrievalSystemName,
    retrievalSystemVersion: input.retrievalSystemVersion,
    retrievalLimit: 5,
    executionEnvironment: "offline-shadow",
    corpus,
    cases,
    metrics,
    thresholds: {
      minimumCasesPerEntity: 20,
      minimumRecallAt5: 0.9,
      minimumMeanReciprocalRank: 0.85,
      requiredCitationPrecision: 1,
      maximumSafetyFailures: 0,
    },
    executedByActorId: actor.actorId,
    executedAt: now,
  };
  const event: KEP1EvaluationAuditEvent = {
    eventId: `${evaluationId}-AUD`,
    programId: "KEP-1",
    evaluationId,
    action: "OFFLINE_EVALUATION_RECORDED",
    status,
    corpusManifestSha256: manifestHash,
    querySetSha256: querySetHash,
    actorId: actor.actorId,
    occurredAt: now,
  };
  await evaluationRepository.createEvaluation(evaluation, event);
  return evaluation;
}

export async function getKEP1EvaluationWorkspace(
  evaluationRepository: KEP1EvaluationRepository,
  draftingRepository: KEP1DraftingRepository,
  reviewRepository: KEP1ReviewRepository
) {
  const evaluations = (await evaluationRepository.listEvaluations()).sort(
    (a, b) =>
      b.executedAt.localeCompare(a.executedAt) ||
      b.evaluationId.localeCompare(a.evaluationId)
  );
  let currentCorpus: KEP1EvaluationCorpusEntry[] = [];
  let prerequisiteCode: string | null = null;
  try {
    currentCorpus = await expectedCurrentCorpus(
      draftingRepository,
      reviewRepository
    );
  } catch (error) {
    prerequisiteCode =
      error instanceof Error ? error.message : "EVALUATION_PREREQUISITES_FAILED";
  }
  const currentManifestSha256 =
    currentCorpus.length === KEP1_PILOT_ENTITY_IDS.length
      ? kep1CorpusManifestSha256(currentCorpus)
      : null;
  const currentEvaluation =
    currentManifestSha256 === null
      ? null
      : evaluations.find(
          (evaluation) =>
            evaluation.corpusManifestSha256 === currentManifestSha256
        ) || null;
  return {
    programId: "KEP-1" as const,
    protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0" as const,
    prerequisites: {
      ready: prerequisiteCode === null,
      blockerCode: prerequisiteCode,
      currentCorpus,
      currentManifestSha256,
    },
    evaluations: evaluations.map((evaluation) => ({
      evaluationId: evaluation.evaluationId,
      status: evaluation.status,
      corpusManifestSha256: evaluation.corpusManifestSha256,
      querySetSha256: evaluation.querySetSha256,
      querySetVersion: evaluation.querySetVersion,
      retrievalSystemName: evaluation.retrievalSystemName,
      retrievalSystemVersion: evaluation.retrievalSystemVersion,
      metrics: evaluation.metrics,
      executedAt: evaluation.executedAt,
      current: evaluation.evaluationId === currentEvaluation?.evaluationId,
    })),
    readiness: currentEvaluation?.status === "passed"
      ? "offline-evaluation-passed"
      : "offline-evaluation-pending",
    authority: {
      offlineEvaluationOnly: true,
      humanGoNoGoGranted: false,
      editorialWorkflowApprovalGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
