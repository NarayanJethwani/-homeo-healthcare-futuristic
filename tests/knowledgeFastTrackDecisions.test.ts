import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { KmsKnowledgeEntity } from "../src/features/knowledge-admin/types";
import { assessKnowledgeEntityForFastTrack } from "../src/features/knowledge/governance/fastTrackPolicy";
import { MemoryFastTrackDecisionRepository } from "../src/features/knowledge/governance/fastTrackDecisionRepository";
import {
  computeFastTrackEntityRevisionSha256,
  getFastTrackDecisionWorkspace,
  recordFastTrackDecision,
  SAFETY_RESOLUTION_CONFIRMATION,
} from "../src/features/knowledge/governance/fastTrackDecisionService";
import type { RecordFastTrackDecisionInput } from "../src/features/knowledge/governance/fastTrackDecisionSchemas";

function entity(
  overrides: Partial<KmsKnowledgeEntity> = {}
): KmsKnowledgeEntity {
  const now = "2026-07-29T00:00:00.000Z";
  return {
    id: "L-DECISION-001",
    slug: "decision-test",
    entityType: "lab-test",
    title: {
      en: "Decision Test",
      hi: "",
      gu: "",
      mr: "",
      es: "",
      ar: "",
    },
    summary: {
      en: "A laboratory result confirms a disease condition.",
      hi: "",
      gu: "",
      mr: "",
      es: "",
      ar: "",
    },
    relatedEntities: [],
    lastReviewed: now,
    lastUpdated: now,
    author: { name: "Author" },
    reviewer: {
      name: "Independent Reviewer",
      credentials: "MD",
      specialty: "Medicine",
    },
    lastClinicalReview: now,
    reviewStatus: "clinically-reviewed",
    legacyVerificationStatus: "verified-published",
    evidenceLevel: "Clinical-Evidence",
    tags: [],
    canonicalUrl:
      "https://homeo.healthcare/knowledge/lab-tests/decision-test",
    editorialStatus: "published",
    editorialNotes: "",
    nextReviewDate: "2027-07-29T00:00:00.000Z",
    versionInfo: {
      version: "1.0.0",
      created: now,
      updated: now,
      reviewed: now,
      changelog: [],
    },
    content: {
      overview: "This result confirms a disease condition.",
      references: ["CIT-0017"],
    },
    readabilityScore: {
      score: 90,
      readingLevel: "Patient Friendly",
      readingTimeMinutes: 1,
    },
    seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
    ...overrides,
  };
}

function inputFor(
  target: KmsKnowledgeEntity,
  overrides: Partial<RecordFastTrackDecisionInput> = {}
): RecordFastTrackDecisionInput {
  const assessment = assessKnowledgeEntityForFastTrack(target);
  return {
    action: "record-decision",
    requestId: "11111111-1111-4111-8111-111111111111",
    entityId: target.id,
    expectedRevisionSha256:
      computeFastTrackEntityRevisionSha256(target),
    expectedPreviousDecisionId: null,
    outcome: "approved-reviewed",
    reviewedFlagCodes: assessment.flags.map((flag) => flag.code),
    citationIds: ["CIT-0017"],
    rationale:
      "The cited source supports this wording for the reviewed revision.",
    attestations: {
      citationsChecked: true,
      clinicalAccuracyChecked: true,
      conventionalCareBoundaryChecked: true,
      conflictOfInterestDeclared: true,
      safetyCauseResolved: false,
    },
    ...overrides,
  };
}

const actor = {
  actorId: "reviewer-001",
  actorName: "Clinical Reviewer",
  actorRole: "clinical-reviewer",
  canResolveSafetyWithdrawal: false,
};
const superAdmin = {
  ...actor,
  actorId: "super-admin-001",
  actorName: "Program Owner",
  actorRole: "super-admin",
  canResolveSafetyWithdrawal: true,
};
const now = "2026-07-29T08:00:00.000Z";

async function expectCode(
  expectedCode: string,
  operation: () => Promise<unknown>
) {
  await assert.rejects(operation, (error: unknown) => {
    return error instanceof Error && error.message === expectedCode;
  });
}

async function run() {
  const reviewedEntity = entity();
  assert.equal(
    assessKnowledgeEntityForFastTrack(reviewedEntity).lane,
    "human-review"
  );

  const repository = new MemoryFastTrackDecisionRepository();
  const approval = await recordFastTrackDecision(
    repository,
    reviewedEntity,
    inputFor(reviewedEntity),
    actor,
    now
  );
  assert.equal(approval.outcome, "approved-reviewed");
  assert.equal(approval.publicationAuthorityGranted, false);
  assert.equal(approval.ragAuthorityGranted, false);
  assert.equal(approval.entityRevisionSha256.length, 64);

  const workspace = await getFastTrackDecisionWorkspace(
    [reviewedEntity],
    repository
  );
  assert.equal(workspace.openDecisionCount, 0);
  assert.equal(workspace.decidedCount, 1);
  assert.equal(
    workspace.assessments[0].currentDecision?.decisionId,
    approval.decisionId
  );

  const changed = entity({
    content: {
      overview:
        "This changed revision confirms a disease condition and requires review.",
      references: ["CIT-0017"],
    },
  });
  const changedWorkspace = await getFastTrackDecisionWorkspace(
    [changed],
    repository
  );
  assert.equal(changedWorkspace.openDecisionCount, 1);
  assert.equal(changedWorkspace.assessments[0].currentDecision, null);
  assert.equal(
    changedWorkspace.assessments[0].latestDecisionId,
    approval.decisionId
  );

  await expectCode("FAST_TRACK_REVISION_HASH_MISMATCH", () =>
    recordFastTrackDecision(
      new MemoryFastTrackDecisionRepository(),
      reviewedEntity,
      inputFor(reviewedEntity, {
        expectedRevisionSha256: "a".repeat(64),
      }),
      actor,
      now
    )
  );

  await expectCode("FAST_TRACK_CITATION_NOT_LINKED", () =>
    recordFastTrackDecision(
      new MemoryFastTrackDecisionRepository(),
      reviewedEntity,
      inputFor(reviewedEntity, { citationIds: ["CIT-0002"] }),
      actor,
      now
    )
  );

  await expectCode("FAST_TRACK_FLAG_COVERAGE_INCOMPLETE", () =>
    recordFastTrackDecision(
      new MemoryFastTrackDecisionRepository(),
      reviewedEntity,
      inputFor(reviewedEntity, { reviewedFlagCodes: [] }),
      actor,
      now
    )
  );

  const blockedEntity = entity({
    id: "D-BLOCKED-001",
    entityType: "disease",
    content: {
      overview: "This is a guaranteed cure with no side effects.",
      references: ["CIT-0017"],
    },
  });
  assert.equal(
    assessKnowledgeEntityForFastTrack(blockedEntity).lane,
    "blocked"
  );

  await expectCode("FAST_TRACK_OUTCOME_LANE_MISMATCH", () =>
    recordFastTrackDecision(
      new MemoryFastTrackDecisionRepository(),
      blockedEntity,
      inputFor(blockedEntity),
      actor,
      now
    )
  );

  const safetyInput = inputFor(blockedEntity, {
    outcome: "safety-resolution-recorded",
    attestations: {
      citationsChecked: true,
      clinicalAccuracyChecked: true,
      conventionalCareBoundaryChecked: true,
      conflictOfInterestDeclared: true,
      safetyCauseResolved: true,
    },
    safetyConfirmation: SAFETY_RESOLUTION_CONFIRMATION,
  });
  await expectCode("FAST_TRACK_SAFETY_RESOLUTION_FORBIDDEN", () =>
    recordFastTrackDecision(
      new MemoryFastTrackDecisionRepository(),
      blockedEntity,
      safetyInput,
      actor,
      now
    )
  );

  const safetyRepository = new MemoryFastTrackDecisionRepository();
  const safetyResolution = await recordFastTrackDecision(
    safetyRepository,
    blockedEntity,
    safetyInput,
    superAdmin,
    now
  );
  assert.equal(
    safetyResolution.outcome,
    "safety-resolution-recorded"
  );
  assert.equal(safetyResolution.publicationAuthorityGranted, false);
  assert.equal(safetyResolution.ragAuthorityGranted, false);

  const idempotentRetry = await recordFastTrackDecision(
    safetyRepository,
    blockedEntity,
    safetyInput,
    superAdmin,
    now
  );
  assert.equal(idempotentRetry.decisionId, safetyResolution.decisionId);
  assert.equal(
    (await safetyRepository.listAuditEventsForTests()).length,
    1
  );

  const routeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/app/api/admin/knowledge/fast-track-decisions/route.ts"
    ),
    "utf8"
  );
  assert.ok(routeSource.includes('"knowledge.approve"'));
  assert.ok(routeSource.includes('"knowledge.bypassReview"'));
  assert.ok(routeSource.includes("sameOrigin(request)"));
  assert.ok(routeSource.includes("readAndBoundRequestBody"));

  const panelSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/features/knowledge-admin/components/FastTrackGovernancePanel.tsx"
    ),
    "utf8"
  );
  for (const control of [
    "Approve",
    "Approve reviewed revision",
    "Request correction",
    "Keep blocked",
    "Keep safety block",
    "Record safety resolution",
    "Record accountable decision",
  ]) {
    assert.ok(panelSource.includes(control));
  }
  assert.ok(
    panelSource.includes(
      "This decision grants neither publication authority nor RAG"
    )
  );

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceFastTrackDecisions",
    "knowledgeGovernanceFastTrackDecisionAuditEvents",
    "knowledgeGovernanceFastTrackDecisionHeads",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }

  console.log(
    "knowledgeFastTrackDecisions.test.ts: all assertions passed"
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
