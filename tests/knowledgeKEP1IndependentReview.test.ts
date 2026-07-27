import assert from "assert";
import fs from "fs";
import path from "path";
import { MemoryKEP1AcquisitionRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionRepository";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import { MemoryKEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingRepository";
import { MemoryKEP1ReviewRepository } from "../src/features/knowledge/review/kep1ReviewRepository";
import {
  getKEP1ReviewWorkspace,
  submitKEP1IndependentReview,
} from "../src/features/knowledge/review/kep1ReviewService";
import type { SubmitKEP1IndependentReviewInput } from "../src/features/knowledge/review/kep1ReviewSchemas";
import type {
  KEP1AcquisitionAuditEvent,
  KEP1AssignmentDecisionRecord,
  KEP1SourceAcquisitionRecord,
} from "../src/features/knowledge/acquisition/kep1AcquisitionTypes";
import type {
  KEP1DraftAuditEvent,
  KEP1DraftBundleRevision,
  KEP1DraftHead,
} from "../src/features/knowledge/drafting/kep1DraftingTypes";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingTypes";

const NOW = "2026-07-27T15:00:00.000Z";
const AUTHOR = "CONTRIB-AUTHOR-001";
const CLINICAL = "CONTRIB-CLINICAL-002";
const EVIDENCE = "CONTRIB-EVIDENCE-003";
const REVISION_ID = "KEP1-DRAFT-R0001-V1";
const CONTENT_HASH = "c".repeat(64);

function acquisitionEvent(
  entityType: "assignment" | "source",
  entityId: string,
  action: KEP1AcquisitionAuditEvent["action"],
  version = 1
): KEP1AcquisitionAuditEvent {
  return {
    eventId: `AUD-${entityType}-${entityId}-${version}-${action}`,
    programId: "KEP-1",
    entityType,
    entityId,
    action,
    actorId: "ADMIN-SEED-001",
    occurredAt: NOW,
    version,
  };
}

function contributor(
  id: string,
  roles: KEP1PrivateOnboardingRecord["eligibleRoles"]
): KEP1PrivateOnboardingRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: id,
    kind: "contributor",
    fullName: `PRIVATE NAME ${id}`,
    status: "eligible",
    identity: {
      scheme: "staff-id",
      valueHash: `private-hash-${id}`,
      verificationStatus: "verified",
      evidenceRef: `private://identity/${id}`,
      verifiedAt: "2026-07-26",
      verifiedBy: "ADMIN-IDENTITY-001",
    },
    eligibleRoles: roles,
    expertiseDomains: ["homeopathy-subject-matter", "evidence-methodology"],
    credentials: [
      {
        credentialId: `CRED-${id}`,
        title: "Verified reviewer credential",
        issuer: "Governance office",
        evidenceRef: `private://credential/${id}`,
        verificationStatus: "verified",
        verifiedAt: "2026-07-26",
        verifiedBy: "ADMIN-IDENTITY-001",
        expiresAt: "2027-07-26",
      },
    ],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: `private://attestation/${id}`,
    },
    createdAt: NOW,
    createdBy: "ADMIN-IDENTITY-001",
    updatedAt: NOW,
    updatedBy: "ADMIN-IDENTITY-001",
    version: 1,
  };
}

async function addContributor(
  repository: MemoryKEP1PrivateOnboardingRepository,
  record: KEP1PrivateOnboardingRecord
) {
  const event: KEP1PrivateOnboardingAuditEvent = {
    eventId: `ONBOARD-${record.recordId}`,
    programId: "KEP-1",
    recordId: record.recordId,
    action: "RECORD_CREATED",
    actorId: "ADMIN-IDENTITY-001",
    occurredAt: NOW,
    recordVersion: 1,
  };
  await repository.create(record, event);
}

function assignment(
  role:
    | "clinical-author"
    | "independent-clinical-reviewer"
    | "evidence-reviewer",
  contributorId: string,
  version = 1
): KEP1AssignmentDecisionRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    assignmentId: `R0001:${role}`,
    entityId: "R0001",
    role,
    contributorId,
    status: "approved",
    proposedByActorId: "ADMIN-MAKER-001",
    proposedAt: NOW,
    decidedByActorId: "ADMIN-CHECKER-002",
    decidedAt: NOW,
    programOwnerRecordId: "OWNER-001",
    decisionEvidenceRef: `private://decision/${role}`,
    version,
  };
}

function revision(
  revisionId = REVISION_ID,
  revisionNumber = 1,
  contentSha256 = CONTENT_HASH
): KEP1DraftBundleRevision {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    draftId: "KEP1-DRAFT-R0001",
    revisionId,
    revisionNumber,
    entityId: "R0001",
    entityType: "remedy",
    title: "Sulphur — private reviewed draft",
    summary:
      "A private provenance-bound traditional description awaiting independent review.",
    status: "draft",
    jobId: "KEP1-JOB-SRC-KEP1-KENT-1905-R1",
    artifactId: "KEP1-ARTIFACT-KENT-001",
    artifactSha256: "a".repeat(64),
    artifactByteLength: 4096,
    verificationId: "KEP1-VERIFY-KENT-001",
    sourceId: "SRC-KEP1-KENT-1905",
    sourceVersion: "Kent-1905",
    rightsDecisionVersion: 1,
    authorAssignmentId: "R0001:clinical-author",
    authorAssignmentVersion: 1,
    authorContributorId: AUTHOR,
    passages: [
      {
        passageId: "R0001-PASSAGE-1",
        locator: "Sulphur paragraph 1",
        text: "Traditional materia medica source passage for independent review.",
        contentSha256: "b".repeat(64),
      },
    ],
    claims: [
      {
        claimId: "R0001-CLAIM-1",
        text: "The source traditionally describes Sulphur.",
        claimType: "traditional-use",
        evidenceStatus: "traditional-description",
        sourcePassageIds: ["R0001-PASSAGE-1"],
        requiresClinicalReview: true,
      },
    ],
    evidenceProfile: {
      evidenceLevel: "Traditional-Literature",
      evidenceSummary:
        "Historical source description that does not establish clinical efficacy.",
      limitations: ["Traditional literature is not modern clinical proof."],
      sourcePassageIds: ["R0001-PASSAGE-1"],
      status: "draft",
      reviewedBy: [],
    },
    graphProposals: [
      {
        proposalId: "R0001-GRAPH-1",
        relationshipType: "related-to",
        targetEntityId: "S0001",
        rationale: "Reviewable navigation proposal based on the passage.",
        sourcePassageIds: ["R0001-PASSAGE-1"],
        status: "proposed",
        requiresClinicalReview: true,
      },
    ],
    contentSha256,
    changeSummary: "Create review fixture.",
    createdByActorId: "ADMIN-DRAFT-001",
    createdAt: NOW,
  };
}

async function addRevision(
  repository: MemoryKEP1DraftingRepository,
  record: KEP1DraftBundleRevision,
  expectedRevisionNumber: number | null
) {
  const head: KEP1DraftHead = {
    draftId: record.draftId,
    entityId: record.entityId,
    currentRevisionId: record.revisionId,
    currentRevisionNumber: record.revisionNumber,
    updatedAt: record.createdAt,
  };
  const event: KEP1DraftAuditEvent = {
    eventId: `DRAFT-AUD-${record.revisionId}`,
    programId: "KEP-1",
    entityId: record.entityId,
    draftId: record.draftId,
    revisionId: record.revisionId,
    action: "DRAFT_REVISION_CREATED",
    actorId: record.createdByActorId,
    occurredAt: record.createdAt,
    revisionNumber: record.revisionNumber,
    contentSha256: record.contentSha256,
  };
  await repository.createRevision(
    head,
    expectedRevisionNumber,
    record,
    event
  );
}

async function seed() {
  const reviews = new MemoryKEP1ReviewRepository();
  const drafting = new MemoryKEP1DraftingRepository();
  const acquisition = new MemoryKEP1AcquisitionRepository();
  const onboarding = new MemoryKEP1PrivateOnboardingRepository();
  await addContributor(onboarding, contributor(AUTHOR, ["clinical-author"]));
  await addContributor(
    onboarding,
    contributor(CLINICAL, [
      "independent-clinical-reviewer",
      "evidence-reviewer",
    ])
  );
  await addContributor(onboarding, contributor(EVIDENCE, ["evidence-reviewer"]));
  for (const record of [
    assignment("clinical-author", AUTHOR),
    assignment("independent-clinical-reviewer", CLINICAL),
    assignment("evidence-reviewer", CLINICAL),
  ]) {
    await acquisition.saveAssignment(
      record,
      null,
      acquisitionEvent(
        "assignment",
        record.assignmentId,
        "ASSIGNMENT_APPROVED"
      )
    );
  }
  const rights: KEP1SourceAcquisitionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    sourceId: "SRC-KEP1-KENT-1905",
    decision: "controlled-extraction-approved",
    rightsReviewerContributorId: "RIGHTS-001",
    rightsEvidenceRef: "private://rights/kent",
    decidedByActorId: "ADMIN-RIGHTS-001",
    decidedAt: NOW,
    version: 1,
  };
  await acquisition.saveSource(
    rights,
    null,
    acquisitionEvent(
      "source",
      rights.sourceId,
      "SOURCE_RIGHTS_RECORDED"
    )
  );
  await addRevision(drafting, revision(), null);
  return { reviews, drafting, acquisition, onboarding };
}

function clinicalInput(): SubmitKEP1IndependentReviewInput {
  return {
    action: "submit-review",
    reviewKind: "clinical",
    entityId: "R0001",
    revisionId: REVISION_ID,
    expectedContentSha256: CONTENT_HASH,
    reviewerContributorId: CLINICAL,
    decision: "approved",
    declarationOfIndependence: true,
    conflictsDeclared: [],
    reviewedClaimIds: ["R0001-CLAIM-1"],
    reviewedGraphProposalIds: ["R0001-GRAPH-1"],
    clinicalChecklist: {
      claimLanguageChecked: true,
      traditionalUseBoundaryChecked: true,
      emergencyEscalationChecked: true,
      contraindicationChecked: true,
      graphSafetyChecked: true,
    },
    evidenceChecklist: null,
    notes: "The exact revision was independently reviewed against all controls.",
  };
}

function evidenceInput(
  reviewerContributorId = EVIDENCE
): SubmitKEP1IndependentReviewInput {
  return {
    action: "submit-review",
    reviewKind: "evidence",
    entityId: "R0001",
    revisionId: REVISION_ID,
    expectedContentSha256: CONTENT_HASH,
    reviewerContributorId,
    decision: "approved",
    declarationOfIndependence: true,
    conflictsDeclared: [],
    reviewedClaimIds: ["R0001-CLAIM-1"],
    reviewedGraphProposalIds: [],
    clinicalChecklist: null,
    evidenceChecklist: {
      citationTraceabilityChecked: true,
      evidenceStatusChecked: true,
      limitationsChecked: true,
      conflictingEvidenceChecked: true,
      conventionalCareBoundaryChecked: true,
    },
    notes: "The exact revision evidence classification and limits were reviewed.",
  };
}

export async function runKnowledgeKEP1IndependentReviewTests() {
  const repositories = await seed();
  const clinical = clinicalInput();
  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      { ...clinical, expectedContentSha256: "d".repeat(64) },
      { actorId: "ADMIN-REVIEW-001" },
      NOW
    ),
    /REVIEW_CONTENT_HASH_MISMATCH/
  );
  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      { ...clinical, reviewedClaimIds: [] },
      { actorId: "ADMIN-REVIEW-001" },
      NOW
    ),
    /REVIEW_CLAIM_COVERAGE_INCOMPLETE/
  );
  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      {
        ...clinical,
        clinicalChecklist: {
          ...clinical.clinicalChecklist!,
          graphSafetyChecked: false,
        },
      },
      { actorId: "ADMIN-REVIEW-001" },
      NOW
    ),
    /REVIEW_CLINICAL_CHECKLIST_INCOMPLETE/
  );
  const clinicalReview = await submitKEP1IndependentReview(
    repositories.reviews,
    repositories.drafting,
    repositories.acquisition,
    repositories.onboarding,
    clinical,
    { actorId: "ADMIN-REVIEW-001" },
    NOW
  );
  assert.strictEqual(clinicalReview.decision, "approved");
  assert.strictEqual(clinicalReview.reviewedContentSha256, CONTENT_HASH);

  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      evidenceInput(CLINICAL),
      { actorId: "ADMIN-REVIEW-002" },
      NOW
    ),
    /REVIEW_DUAL_ROLE_CONFLICT/
  );
  const replacement = assignment("evidence-reviewer", EVIDENCE, 2);
  await repositories.acquisition.saveAssignment(
    replacement,
    1,
    acquisitionEvent(
      "assignment",
      replacement.assignmentId,
      "ASSIGNMENT_APPROVED",
      2
    )
  );
  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      {
        ...evidenceInput(),
        conflictsDeclared: ["Reviewer has an unresolved financial conflict."],
      },
      { actorId: "ADMIN-REVIEW-002" },
      NOW
    ),
    /REVIEW_UNRESOLVED_CONFLICTS/
  );
  const evidenceReview = await submitKEP1IndependentReview(
    repositories.reviews,
    repositories.drafting,
    repositories.acquisition,
    repositories.onboarding,
    evidenceInput(),
    { actorId: "ADMIN-REVIEW-002" },
    NOW
  );
  assert.strictEqual(evidenceReview.decision, "approved");

  let workspace = await getKEP1ReviewWorkspace(
    repositories.reviews,
    repositories.drafting,
    repositories.acquisition
  );
  assert.strictEqual(workspace.summary.reviewCompleteCount, 1);
  assert.strictEqual(workspace.drafts[0].readiness, "review-complete");
  assert.strictEqual(workspace.authority.reviewReadinessOnly, true);
  assert.strictEqual(
    workspace.authority.editorialWorkflowApprovalGranted,
    false
  );
  assert.strictEqual(workspace.authority.publicationAuthorityGranted, false);
  assert.strictEqual(workspace.authority.publicIndexAuthorityGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);
  const publicJson = JSON.stringify(workspace);
  for (const value of [
    "PRIVATE NAME",
    "private://",
    "private-hash-",
    "ADMIN-REVIEW-",
  ]) {
    assert.ok(!publicJson.includes(value), `DTO leaked ${value}`);
  }

  await assert.rejects(
    submitKEP1IndependentReview(
      repositories.reviews,
      repositories.drafting,
      repositories.acquisition,
      repositories.onboarding,
      clinical,
      { actorId: "ADMIN-REVIEW-003" },
      NOW
    ),
    /REVIEW_IMMUTABLE_CONFLICT/
  );
  await addRevision(
    repositories.drafting,
    revision("KEP1-DRAFT-R0001-V2", 2, "e".repeat(64)),
    1
  );
  workspace = await getKEP1ReviewWorkspace(
    repositories.reviews,
    repositories.drafting,
    repositories.acquisition
  );
  assert.strictEqual(workspace.summary.reviewCompleteCount, 0);
  assert.strictEqual(workspace.drafts[0].readiness, "pending");

  const rules = fs.readFileSync(
    path.resolve(__dirname, "../firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1IndependentReviews",
    "knowledgeGovernanceKep1ReviewAuditEvents",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }
  const route = fs.readFileSync(
    path.resolve(__dirname, "../src/app/api/admin/knowledge/review/route.ts"),
    "utf8"
  );
  assert.ok(route.includes('"knowledge.expansion.manage"'));
  assert.ok(route.includes("sameOrigin(request)"));
  assert.ok(route.includes("readAndBoundRequestBody"));
  assert.ok(route.includes('"Cache-Control": "no-store"'));

  console.log(
    "✅ KEP-1 review enforces exact-current-hash decisions, complete coverage, approved current reviewers, author and dual-role separation, immutable audit, revision invalidation, privacy, and zero publication/RAG authority."
  );
}

if (require.main === module) {
  runKnowledgeKEP1IndependentReviewTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
