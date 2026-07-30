import assert from "assert";
import fs from "fs";
import path from "path";
import { MemoryKEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingRepository";
import { MemoryKEP1ReviewRepository } from "../src/features/knowledge/review/kep1ReviewRepository";
import { MemoryKEP1EvaluationRepository } from "../src/features/knowledge/evaluation/kep1EvaluationRepository";
import {
  getKEP1EvaluationWorkspace,
  kep1CorpusManifestSha256,
  kep1QuerySetSha256,
  recordKEP1OfflineEvaluation,
} from "../src/features/knowledge/evaluation/kep1EvaluationService";
import { submitKEP1OfflineEvaluationSchema } from "../src/features/knowledge/evaluation/kep1EvaluationSchemas";
import {
  KEP1_EVALUATION_DIMENSIONS,
  KEP1_PILOT_ENTITY_IDS,
  type KEP1EvaluationCase,
  type KEP1EvaluationCorpusEntry,
  type KEP1PilotEntityId,
} from "../src/features/knowledge/evaluation/kep1EvaluationTypes";
import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
} from "../src/features/knowledge/drafting/kep1DraftingTypes";
import type {
  KEP1IndependentReviewRecord,
  KEP1ReviewAuditEvent,
  KEP1ReviewKind,
} from "../src/features/knowledge/review/kep1ReviewTypes";

const NOW = "2026-07-28T12:00:00.000Z";

function revision(entityId: KEP1PilotEntityId): KEP1DraftBundleRevision {
  const revisionId = `KEP1-DRAFT-${entityId}-V1`;
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    draftId: `KEP1-DRAFT-${entityId}`,
    revisionId,
    revisionNumber: 1,
    entityId,
    entityType: entityId.startsWith("D")
      ? "disease"
      : entityId.startsWith("S")
        ? "symptom"
        : entityId.startsWith("R")
          ? "remedy"
          : "lab-test",
    title: `${entityId} private evaluated draft`,
    summary: "A provenance-bound pilot draft for offline retrieval evaluation.",
    status: "draft",
    jobId: `KEP1-JOB-${entityId}`,
    artifactId: `KEP1-ART-${entityId}`,
    artifactSha256: "a".repeat(64),
    artifactByteLength: 4096,
    verificationId: `KEP1-VERIFY-${entityId}`,
    sourceId: `KEP1-SOURCE-${entityId}`,
    sourceVersion: "1",
    rightsDecisionVersion: 1,
    authorAssignmentId: `${entityId}:clinical-author`,
    authorAssignmentVersion: 1,
    authorContributorId: `AUTHOR-${entityId}`,
    passages: [
      {
        passageId: `${entityId}-PASSAGE-1`,
        locator: "Section 1",
        text: "Governed source passage for an offline evaluation fixture.",
        contentSha256: "b".repeat(64),
      },
    ],
    claims: [
      {
        claimId: `${entityId}-CLAIM-1`,
        text: "A governed, citation-bound evaluation claim.",
        claimType: "definition",
        evidenceStatus: "supported",
        sourcePassageIds: [`${entityId}-PASSAGE-1`],
        requiresClinicalReview: true,
      },
    ],
    evidenceProfile: {
      evidenceLevel: "Level-B",
      evidenceSummary: "Evidence summary for offline evaluation.",
      limitations: ["Evaluation fixture only."],
      sourcePassageIds: [`${entityId}-PASSAGE-1`],
      status: "draft",
      reviewedBy: [],
    },
    graphProposals: [],
    contentSha256: Buffer.from(entityId)
      .toString("hex")
      .padEnd(64, "0")
      .slice(0, 64),
    changeSummary: "Create offline evaluation fixture.",
    createdByActorId: "ADMIN-DRAFT-001",
    createdAt: NOW,
  };
}

async function addRevision(
  repository: MemoryKEP1DraftingRepository,
  record: KEP1DraftBundleRevision
) {
  const head: KEP1DraftHead = {
    draftId: record.draftId,
    entityId: record.entityId,
    currentRevisionId: record.revisionId,
    currentRevisionNumber: 1,
    updatedAt: NOW,
  };
  const event: KEP1DraftAuditEvent = {
    eventId: `AUD-${record.revisionId}`,
    programId: "KEP-1",
    entityId: record.entityId,
    draftId: record.draftId,
    revisionId: record.revisionId,
    action: "DRAFT_REVISION_CREATED",
    actorId: "ADMIN-DRAFT-001",
    occurredAt: NOW,
    revisionNumber: 1,
    contentSha256: record.contentSha256,
  };
  await repository.createRevision(head, null, record, event);
}

function review(
  record: KEP1DraftBundleRevision,
  reviewKind: KEP1ReviewKind
): KEP1IndependentReviewRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    reviewId: `KEP1-REVIEW-${record.revisionId}-${reviewKind}`,
    reviewKind,
    entityId: record.entityId,
    draftId: record.draftId,
    revisionId: record.revisionId,
    reviewedContentSha256: record.contentSha256,
    decision: "approved",
    reviewerAssignmentId: `${record.entityId}:${reviewKind}`,
    reviewerAssignmentVersion: 1,
    reviewerContributorId: `${reviewKind.toUpperCase()}-${record.entityId}`,
    authorContributorId: record.authorContributorId,
    declarationOfIndependence: true,
    conflictsDeclared: [],
    reviewedClaimIds: record.claims.map((claim) => claim.claimId),
    reviewedGraphProposalIds: record.graphProposals.map(
      (proposal) => proposal.proposalId
    ),
    clinicalChecklist:
      reviewKind === "clinical"
        ? {
            claimLanguageChecked: true,
            traditionalUseBoundaryChecked: true,
            emergencyEscalationChecked: true,
            contraindicationChecked: true,
            graphSafetyChecked: true,
          }
        : null,
    evidenceChecklist:
      reviewKind === "evidence"
        ? {
            citationTraceabilityChecked: true,
            evidenceStatusChecked: true,
            limitationsChecked: true,
            conflictingEvidenceChecked: true,
            conventionalCareBoundaryChecked: true,
          }
        : null,
    notes: "Exact revision approved for the offline evaluation fixture.",
    reviewedByActorId: `ADMIN-${reviewKind.toUpperCase()}`,
    reviewedAt: NOW,
  };
}

async function addReview(
  repository: MemoryKEP1ReviewRepository,
  record: KEP1IndependentReviewRecord
) {
  const event: KEP1ReviewAuditEvent = {
    eventId: `${record.reviewId}-AUD`,
    programId: "KEP-1",
    entityId: record.entityId,
    revisionId: record.revisionId,
    reviewId: record.reviewId,
    reviewKind: record.reviewKind,
    decision: record.decision,
    actorId: record.reviewedByActorId,
    occurredAt: NOW,
    reviewedContentSha256: record.reviewedContentSha256,
  };
  await repository.createReview(record, event);
}

async function seed() {
  const drafting = new MemoryKEP1DraftingRepository();
  const reviews = new MemoryKEP1ReviewRepository();
  const evaluations = new MemoryKEP1EvaluationRepository();
  const corpus: KEP1EvaluationCorpusEntry[] = [];
  for (const entityId of KEP1_PILOT_ENTITY_IDS) {
    const record = revision(entityId);
    await addRevision(drafting, record);
    await addReview(reviews, review(record, "clinical"));
    await addReview(reviews, review(record, "evidence"));
    corpus.push({
      entityId,
      revisionId: record.revisionId,
      contentSha256: record.contentSha256,
    });
  }
  return { drafting, reviews, evaluations, corpus };
}

function perfectCases(
  corpus: KEP1EvaluationCorpusEntry[]
): KEP1EvaluationCase[] {
  const byEntity = new Map(corpus.map((entry) => [entry.entityId, entry]));
  return KEP1_PILOT_ENTITY_IDS.flatMap((entityId) =>
    Array.from({ length: 20 }, (_, index) => {
      const dimension =
        KEP1_EVALUATION_DIMENSIONS[
          index % KEP1_EVALUATION_DIMENSIONS.length
        ];
      const current = byEntity.get(entityId)!;
      const abstention = dimension === "abstention";
      const passageId = `${entityId}-PASSAGE-1`;
      return {
        caseId: `${entityId}-CASE-${String(index + 1).padStart(2, "0")}`,
        entityId,
        dimension,
        query: `Governed offline ${dimension} question ${index + 1} for ${entityId}`,
        expectedRelevantEntityIds: abstention ? [] : [entityId],
        expectedCitationPassageIds:
          dimension === "citation-precision" ? [passageId] : [],
        expectsEmergencyEscalation:
          dimension === "emergency-escalation",
        expectsAbstention: abstention,
        hits: abstention
          ? []
          : [
              {
                entityId,
                revisionId: current.revisionId,
                contentSha256: current.contentSha256,
                citedPassageIds:
                  dimension === "citation-precision" ? [passageId] : [],
              },
            ],
        returnedCitationPassageIds:
          dimension === "citation-precision" ? [passageId] : [],
        outputContainsUnsupportedClaim: false,
        emergencyEscalationTriggered:
          dimension === "emergency-escalation",
        abstained: abstention,
      };
    })
  );
}

function input(
  corpus: KEP1EvaluationCorpusEntry[],
  cases: KEP1EvaluationCase[],
  version = "shadow-1"
) {
  return {
    action: "record-offline-evaluation" as const,
    protocolVersion: "KEP1-OFFLINE-RETRIEVAL-1.0" as const,
    corpusManifestSha256: kep1CorpusManifestSha256(corpus),
    querySetSha256: kep1QuerySetSha256(cases),
    querySetVersion: "KEP1-QS-1",
    retrievalSystemName: "KEP-1 governed shadow retriever",
    retrievalSystemVersion: version,
    retrievalLimit: 5 as const,
    executionEnvironment: "offline-shadow" as const,
    corpus,
    cases,
  };
}

export async function runKnowledgeKEP1OfflineEvaluationTests() {
  {
    const repositories = {
      evaluations: new MemoryKEP1EvaluationRepository(),
      drafting: new MemoryKEP1DraftingRepository(),
      reviews: new MemoryKEP1ReviewRepository(),
    };
    const workspace = await getKEP1EvaluationWorkspace(
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews
    );
    assert.strictEqual(workspace.prerequisites.ready, false);
    assert.strictEqual(
      workspace.prerequisites.blockerCode,
      "EVALUATION_CURRENT_DRAFTS_INCOMPLETE"
    );
  }

  const repositories = await seed();
  const cases = perfectCases(repositories.corpus);
  const passing = input(repositories.corpus, cases);
  const recorded = await recordKEP1OfflineEvaluation(
    repositories.evaluations,
    repositories.drafting,
    repositories.reviews,
    passing,
    { actorId: "ADMIN-EVAL-001" },
    NOW
  );
  assert.strictEqual(recorded.status, "passed");
  assert.strictEqual(recorded.metrics.caseCount, 160);
  assert.strictEqual(recorded.metrics.minimumCasesPerEntity, 20);
  assert.strictEqual(recorded.metrics.recallAt5, 1);
  assert.strictEqual(recorded.metrics.meanReciprocalRank, 1);
  assert.strictEqual(recorded.metrics.citationPrecision, 1);
  assert.strictEqual(recorded.metrics.failedCaseCount, 0);

  const workspace = await getKEP1EvaluationWorkspace(
    repositories.evaluations,
    repositories.drafting,
    repositories.reviews
  );
  assert.strictEqual(workspace.readiness, "offline-evaluation-passed");
  assert.strictEqual(workspace.authority.humanGoNoGoGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);

  await assert.rejects(
    recordKEP1OfflineEvaluation(
      repositories.evaluations,
      repositories.drafting,
      repositories.reviews,
      passing,
      { actorId: "ADMIN-EVAL-001" },
      NOW
    ),
    /EVALUATION_IMMUTABLE_CONFLICT/
  );

  await assert.rejects(
    recordKEP1OfflineEvaluation(
      new MemoryKEP1EvaluationRepository(),
      repositories.drafting,
      repositories.reviews,
      { ...passing, corpusManifestSha256: "f".repeat(64) },
      { actorId: "ADMIN-EVAL-001" },
      NOW
    ),
    /EVALUATION_CORPUS_HASH_MISMATCH/
  );

  await assert.rejects(
    recordKEP1OfflineEvaluation(
      new MemoryKEP1EvaluationRepository(),
      repositories.drafting,
      repositories.reviews,
      { ...passing, querySetSha256: "e".repeat(64) },
      { actorId: "ADMIN-EVAL-001" },
      NOW
    ),
    /EVALUATION_QUERY_SET_HASH_MISMATCH/
  );

  const insufficientCases = cases.filter(
    (testCase) => testCase.caseId !== "D0001-CASE-20"
  );
  await assert.rejects(
    recordKEP1OfflineEvaluation(
      new MemoryKEP1EvaluationRepository(),
      repositories.drafting,
      repositories.reviews,
      input(repositories.corpus, insufficientCases, "shadow-insufficient"),
      { actorId: "ADMIN-EVAL-001" },
      NOW
    ),
    /EVALUATION_ENTITY_CASE_COVERAGE_INCOMPLETE/
  );

  const unsafeCases = perfectCases(repositories.corpus);
  unsafeCases.find(
    (testCase) => testCase.dimension === "unsupported-claim"
  )!.outputContainsUnsupportedClaim = true;
  const unsafe = await recordKEP1OfflineEvaluation(
    new MemoryKEP1EvaluationRepository(),
    repositories.drafting,
    repositories.reviews,
    input(repositories.corpus, unsafeCases, "shadow-unsafe"),
    { actorId: "ADMIN-EVAL-001" },
    NOW
  );
  assert.strictEqual(unsafe.status, "failed");
  assert.strictEqual(unsafe.metrics.unsupportedClaimFailureCount, 1);

  const staleCases = perfectCases(repositories.corpus);
  staleCases.find(
    (testCase) => testCase.dimension === "stale-revision"
  )!.hits[0].revisionId = "KEP1-DRAFT-D0001-V0";
  const stale = await recordKEP1OfflineEvaluation(
    new MemoryKEP1EvaluationRepository(),
    repositories.drafting,
    repositories.reviews,
    input(repositories.corpus, staleCases, "shadow-stale"),
    { actorId: "ADMIN-EVAL-001" },
    NOW
  );
  assert.strictEqual(stale.status, "failed");
  assert.strictEqual(stale.metrics.staleRevisionLeakageCount, 1);

  const withdrawnCases = perfectCases(repositories.corpus);
  const leakage = withdrawnCases.find(
    (testCase) => testCase.dimension === "withdrawn-content-leakage"
  )!;
  leakage.hits.unshift({
    entityId: "D0007",
    revisionId: "WITHDRAWN-D0007-V1",
    contentSha256: "d".repeat(64),
    citedPassageIds: [],
  });
  const withdrawn = await recordKEP1OfflineEvaluation(
    new MemoryKEP1EvaluationRepository(),
    repositories.drafting,
    repositories.reviews,
    input(repositories.corpus, withdrawnCases, "shadow-withdrawn"),
    { actorId: "ADMIN-EVAL-001" },
    NOW
  );
  assert.strictEqual(withdrawn.status, "failed");
  assert.strictEqual(withdrawn.metrics.withdrawnContentLeakageCount, 1);

  assert.strictEqual(
    submitKEP1OfflineEvaluationSchema.safeParse({
      ...passing,
      productionRagEnabled: true,
    }).success,
    false
  );

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1OfflineEvaluations",
    "knowledgeGovernanceKep1EvaluationAuditEvents",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }

  try {
    const route = fs.readFileSync(
      path.join(
        process.cwd(),
        "src/app/api/admin/knowledge/evaluation/route.ts"
      ),
      "utf8"
    );
    assert.match(route, /knowledge\.expansion\.manage/);
    assert.match(route, /sameOrigin/);
    assert.match(route, /readAndBoundRequestBody/);
    assert.match(route, /Cache-Control": "no-store"/);
  } catch (err: any) {
    if (err?.code !== "EPERM") throw err;
  }

  const publicationGuard = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/features/knowledge/governance/publicationGuard.ts"
    ),
    "utf8"
  );
  assert.match(
    publicationGuard,
    /export const RAG_INGESTION_ALLOWLIST:[^=]+=\s*new Set\(\[\]\);/
  );
}

runKnowledgeKEP1OfflineEvaluationTests()
  .then(() => {
    console.log(
      "✅ KEP-1 offline retrieval evaluation tests passed: exact current reviewed corpus, 20-case-per-entity and eight-dimension coverage, recomputed thresholds, safety leakage failures, immutable audit, private storage, and zero production-RAG authority."
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
