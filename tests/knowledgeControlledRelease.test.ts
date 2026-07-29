import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import type { KmsKnowledgeEntity } from "../src/features/knowledge-admin/types";
import { MemoryFastTrackDecisionRepository } from "../src/features/knowledge/governance/fastTrackDecisionRepository";
import {
  computeFastTrackEntityRevisionSha256,
  recordFastTrackDecision,
  SAFETY_RESOLUTION_CONFIRMATION,
} from "../src/features/knowledge/governance/fastTrackDecisionService";
import { assessKnowledgeEntityForFastTrack } from "../src/features/knowledge/governance/fastTrackPolicy";
import { MemoryControlledReleaseRepository } from "../src/features/knowledge/governance/controlledReleaseRepository";
import {
  getControlledReleaseWorkspace,
  recordControlledReleaseAction,
} from "../src/features/knowledge/governance/controlledReleaseService";
import { controlledReleaseActionSchema } from "../src/features/knowledge/governance/controlledReleaseSchemas";

function entity(
  id: "FAQ-safety" | "D0007" | "R0006",
  entityType: "faq" | "disease" | "remedy",
  title: string
): KmsKnowledgeEntity {
  const now = "2026-07-29T00:00:00.000Z";
  return {
    id,
    slug: id.toLowerCase(),
    entityType,
    title: { en: title, hi: "", gu: "", mr: "", es: "", ar: "" },
    summary: {
      en: "A corrected, citation-bound safety article.",
      hi: "",
      gu: "",
      mr: "",
      es: "",
      ar: "",
    },
    relatedEntities: [],
    lastReviewed: now,
    lastUpdated: now,
    lastClinicalReview: now,
    author: { name: "Author" },
    reviewer: {
      name: "Independent Reviewer",
      credentials: "MD",
      specialty: "Medicine",
    },
    reviewStatus: "clinically-reviewed",
    legacyVerificationStatus: "verified-published",
    evidenceLevel: "Clinical-Evidence",
    tags: [],
    canonicalUrl: `https://homeo.healthcare/knowledge/${id}`,
    editorialStatus: "published",
    editorialNotes: "",
    nextReviewDate: "2027-07-29T00:00:00.000Z",
    versionInfo: {
      version: "2.0.0",
      created: now,
      updated: now,
      reviewed: now,
      changelog: [],
    },
    content: {
      overview:
        "Use as educational information alongside conventional medical care.",
      references: ["CIT-0017"],
    },
    readabilityScore: {
      score: 90,
      readingLevel: "Patient Friendly",
      readingTimeMinutes: 1,
    },
    seoGeoScores: { seoScore: 90, geoScore: 90, aiReadinessScore: 90 },
  };
}

const actor = {
  actorId: "super-admin-001",
  actorName: "Program Owner",
  actorRole: "super-admin",
  canAuthorizePublication: true,
  canAuthorizeRag: true,
  canBypassSafetyWithdrawal: true,
};
const releaseAttestations = {
  revisionRechecked: true as const,
  citationsRechecked: true as const,
  safetyBoundariesRechecked: true as const,
  rollbackReady: true as const,
};
const now = "2026-07-29T10:00:00.000Z";

async function expectCode(
  expected: string,
  operation: () => Promise<unknown>
) {
  await assert.rejects(operation, (error: unknown) => {
    return error instanceof Error && error.message === expected;
  });
}

async function recordSafetyResolution(
  repository: MemoryFastTrackDecisionRepository,
  target: KmsKnowledgeEntity,
  requestId: string
) {
  const assessment = assessKnowledgeEntityForFastTrack(target);
  return recordFastTrackDecision(
    repository,
    target,
    {
      action: "record-decision",
      requestId,
      entityId: target.id,
      expectedRevisionSha256:
        computeFastTrackEntityRevisionSha256(target),
      expectedPreviousDecisionId: null,
      outcome: "safety-resolution-recorded",
      reviewedFlagCodes: assessment.flags.map((flag) => flag.code),
      citationIds: ["CIT-0017"],
      rationale:
        "The corrected revision preserves conventional-care and emergency boundaries.",
      attestations: {
        citationsChecked: true,
        clinicalAccuracyChecked: true,
        conventionalCareBoundaryChecked: true,
        conflictOfInterestDeclared: true,
        safetyCauseResolved: true,
      },
      safetyConfirmation: SAFETY_RESOLUTION_CONFIRMATION,
    },
    {
      actorId: actor.actorId,
      actorName: actor.actorName,
      actorRole: actor.actorRole,
      canResolveSafetyWithdrawal: true,
    },
    now
  );
}

async function run() {
  const faq = entity("FAQ-safety", "faq", "Safety FAQ");
  const asthma = entity("D0007", "disease", "Asthma");
  const arsenicum = entity("R0006", "remedy", "Arsenicum Album");
  const entities = [faq, asthma, arsenicum];
  const decisionRepository = new MemoryFastTrackDecisionRepository();
  const releaseRepository = new MemoryControlledReleaseRepository();

  const faqDecision = await recordSafetyResolution(
    decisionRepository,
    faq,
    "11111111-1111-4111-8111-111111111111"
  );
  const asthmaDecision = await recordSafetyResolution(
    decisionRepository,
    asthma,
    "22222222-2222-4222-8222-222222222222"
  );
  await recordSafetyResolution(
    decisionRepository,
    arsenicum,
    "33333333-3333-4333-8333-333333333333"
  );

  const initial = await getControlledReleaseWorkspace(
    entities,
    decisionRepository,
    releaseRepository
  );
  assert.equal(initial.canaryPassed, false);
  assert.equal(initial.candidates.length, 3);
  assert.equal(
    initial.candidates.find((candidate) => candidate.entityId === faq.id)
      ?.recommendedCanary,
    true
  );
  assert.equal(
    initial.candidates.find(
      (candidate) => candidate.entityId === asthma.id
    )?.recommendedCanary,
    false
  );

  const authorizeFaq = {
    action: "authorize-release" as const,
    requestId: "44444444-4444-4444-8444-444444444444",
    entityId: faq.id,
    expectedRevisionSha256: computeFastTrackEntityRevisionSha256(faq),
    expectedSafetyDecisionId: faqDecision.decisionId,
    expectedPreviousReleaseId: null,
    phase: "canary" as const,
    channels: { publication: true, rag: false },
    rationale:
      "Authorize the lowest-risk publication-only FAQ canary with rollback ready.",
    attestations: releaseAttestations,
  };
  await expectCode("CONTROLLED_RELEASE_CANARY_POLICY_FAILED", () =>
    recordControlledReleaseAction(
      entities,
      decisionRepository,
      releaseRepository,
      {
        ...authorizeFaq,
        entityId: asthma.id,
        expectedRevisionSha256:
          computeFastTrackEntityRevisionSha256(asthma),
        expectedSafetyDecisionId: asthmaDecision.decisionId,
      },
      actor,
      now
    )
  );
  await expectCode("CONTROLLED_RELEASE_CANARY_POLICY_FAILED", () =>
    recordControlledReleaseAction(
      entities,
      decisionRepository,
      releaseRepository,
      {
        ...authorizeFaq,
        channels: { publication: true, rag: true },
      },
      actor,
      now
    )
  );

  const canaryAuthorization = await recordControlledReleaseAction(
    entities,
    decisionRepository,
    releaseRepository,
    authorizeFaq,
    actor,
    now
  );
  assert.equal(canaryAuthorization.publicationReleaseAuthorized, true);
  assert.equal(canaryAuthorization.ragReleaseAuthorized, false);
  assert.equal(canaryAuthorization.executionApplied, false);

  const observationInput = {
      action: "record-canary-observation",
      requestId: "55555555-5555-4555-8555-555555555555",
      entityId: faq.id,
      expectedRevisionSha256:
        computeFastTrackEntityRevisionSha256(faq),
      expectedSafetyDecisionId: faqDecision.decisionId,
      expectedPreviousReleaseId: canaryAuthorization.releaseId,
      phase: "canary",
      observation: {
        observationMinutes: 1_440,
        safetyIncidentCount: 0,
        prohibitedClaimDetectionCount: 0,
        retrievalLeakageCount: 0,
      },
      rationale:
        "The publication-only FAQ canary completed 24 hours with zero safety signals.",
      attestations: releaseAttestations,
    } as const;
  await expectCode("CONTROLLED_RELEASE_OBSERVATION_WINDOW_INCOMPLETE", () =>
    recordControlledReleaseAction(
      entities,
      decisionRepository,
      releaseRepository,
      observationInput,
      actor,
      "2026-07-29T11:00:00.000Z"
    )
  );
  const observation = await recordControlledReleaseAction(
    entities,
    decisionRepository,
    releaseRepository,
    observationInput,
    actor,
    "2026-07-30T10:00:00.000Z"
  );
  assert.equal(observation.outcome, "canary-observation-passed");

  const afterObservation = await getControlledReleaseWorkspace(
    entities,
    decisionRepository,
    releaseRepository
  );
  assert.equal(afterObservation.canaryPassed, true);

  const general = await recordControlledReleaseAction(
    entities,
    decisionRepository,
    releaseRepository,
    {
      action: "authorize-release",
      requestId: "66666666-6666-4666-8666-666666666666",
      entityId: asthma.id,
      expectedRevisionSha256:
        computeFastTrackEntityRevisionSha256(asthma),
      expectedSafetyDecisionId: asthmaDecision.decisionId,
      expectedPreviousReleaseId: null,
      phase: "general",
      channels: { publication: true, rag: true },
      rationale:
        "Authorize publication and RAG separately after the canary observation passed.",
      attestations: releaseAttestations,
    },
    actor,
    "2026-07-30T10:05:00.000Z"
  );
  assert.equal(general.publicationReleaseAuthorized, true);
  assert.equal(general.ragReleaseAuthorized, true);
  assert.equal(general.executionApplied, false);

  const rollback = await recordControlledReleaseAction(
    entities,
    decisionRepository,
    releaseRepository,
    {
      action: "rollback-release",
      requestId: "77777777-7777-4777-8777-777777777777",
      entityId: asthma.id,
      expectedRevisionSha256:
        computeFastTrackEntityRevisionSha256(asthma),
      expectedSafetyDecisionId: asthmaDecision.decisionId,
      expectedPreviousReleaseId: general.releaseId,
      rationale:
        "Record an immediate fail-closed rollback while preserving the complete audit trail.",
      attestations: releaseAttestations,
    },
    actor,
    "2026-07-30T10:06:00.000Z"
  );
  assert.equal(rollback.outcome, "release-rolled-back");
  assert.equal(rollback.publicationReleaseAuthorized, false);
  assert.equal(rollback.ragReleaseAuthorized, false);

  assert.equal(
    controlledReleaseActionSchema.safeParse({
      ...authorizeFaq,
      unexpectedAuthority: true,
    }).success,
    false
  );
  assert.equal(
    controlledReleaseActionSchema.safeParse({
      ...authorizeFaq,
      channels: { publication: false, rag: false },
    }).success,
    true
  );

  const routeSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/app/api/admin/knowledge/controlled-release/route.ts"
    ),
    "utf8"
  );
  assert.ok(routeSource.includes('"knowledge.publish"'));
  assert.ok(routeSource.includes('"RAG_INDEX_MANAGE"'));
  assert.ok(routeSource.includes('"knowledge.bypassReview"'));
  assert.ok(routeSource.includes("sameOrigin(request)"));
  assert.ok(routeSource.includes("readAndBoundRequestBody"));

  const panelSource = fs.readFileSync(
    path.join(
      process.cwd(),
      "src/features/knowledge-admin/components/ControlledReleasePanel.tsx"
    ),
    "utf8"
  );
  for (const control of [
    "Run release preflight",
    "Authorize publication canary",
    "RAG eligibility authorization",
    "Record 24-hour observation",
    "Record rollback",
    "Confirm and record",
  ]) {
    assert.ok(panelSource.includes(control));
  }
  assert.ok(panelSource.includes("execution not applied"));

  const rules = fs.readFileSync(
    path.join(process.cwd(), "firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceControlledReleases",
    "knowledgeGovernanceControlledReleaseAuditEvents",
    "knowledgeGovernanceControlledReleaseHeads",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }

  console.log("knowledgeControlledRelease.test.ts: all assertions passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
