import assert from "assert";
import fs from "fs";
import path from "path";
import { MemoryKEP1AcquisitionRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionRepository";
import { MemoryKEP1AcquisitionJobRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionJobRepository";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import { MemoryKEP1DraftingRepository } from "../src/features/knowledge/drafting/kep1DraftingRepository";
import {
  createKEP1DraftRevision,
  getKEP1DraftingWorkspace,
} from "../src/features/knowledge/drafting/kep1DraftingService";
import type { CreateKEP1DraftRevisionInput } from "../src/features/knowledge/drafting/kep1DraftingSchemas";
import type {
  KEP1AcquisitionAuditEvent,
  KEP1AssignmentDecisionRecord,
  KEP1SourceAcquisitionRecord,
} from "../src/features/knowledge/acquisition/kep1AcquisitionTypes";
import type {
  KEP1AcquisitionJobAuditEvent,
  KEP1AcquisitionJobRecord,
  KEP1ArtifactVerification,
  KEP1ImmutableSourceArtifact,
} from "../src/features/knowledge/acquisition/kep1AcquisitionJobTypes";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingTypes";

const NOW = "2026-07-27T14:00:00.000Z";
const AUTHOR_ID = "CONTRIB-KEP1-AUTHOR-001";
const SOURCE_ID = "SRC-KEP1-KENT-1905";
const JOB_ID = `KEP1-JOB-${SOURCE_ID}-R1`;
const ARTIFACT_ID = `${JOB_ID}-ART-${"a".repeat(16)}`;
const VERIFICATION_ID = `${ARTIFACT_ID}-VERIFY-1`;

function acquisitionEvent(
  entityType: "assignment" | "source",
  entityId: string,
  action: KEP1AcquisitionAuditEvent["action"]
): KEP1AcquisitionAuditEvent {
  return {
    eventId: `AUD-${entityType}-${entityId}`,
    programId: "KEP-1",
    entityType,
    entityId,
    action,
    actorId: "ADMIN-SEED-001",
    occurredAt: NOW,
    version: 1,
  };
}

function jobEvent(
  entityType: "job" | "artifact",
  entityId: string,
  action: KEP1AcquisitionJobAuditEvent["action"],
  version: number
): KEP1AcquisitionJobAuditEvent {
  return {
    eventId: `JOB-AUD-${entityId}-${version}-${action}`,
    programId: "KEP-1",
    entityType,
    entityId,
    action,
    actorId: "ADMIN-SEED-001",
    occurredAt: NOW,
    version,
  };
}

function authorRecord(): KEP1PrivateOnboardingRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: AUTHOR_ID,
    kind: "contributor",
    fullName: "PRIVATE AUTHOR NAME",
    status: "eligible",
    identity: {
      scheme: "staff-id",
      valueHash: "private-author-identity-hash",
      verificationStatus: "verified",
      evidenceRef: "private://identity/author",
      verifiedAt: "2026-07-26",
      verifiedBy: "ADMIN-IDENTITY-001",
    },
    eligibleRoles: ["clinical-author"],
    expertiseDomains: ["homeopathy-subject-matter"],
    credentials: [
      {
        credentialId: "CRED-AUTHOR-001",
        title: "Verified clinical author",
        issuer: "Governance office",
        evidenceRef: "private://credential/author",
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
      acceptanceEvidenceRef: "private://attestation/author",
    },
    createdAt: NOW,
    createdBy: "ADMIN-IDENTITY-001",
    updatedAt: NOW,
    updatedBy: "ADMIN-IDENTITY-001",
    version: 1,
  };
}

async function seed() {
  const drafting = new MemoryKEP1DraftingRepository();
  const acquisition = new MemoryKEP1AcquisitionRepository();
  const jobs = new MemoryKEP1AcquisitionJobRepository();
  const onboarding = new MemoryKEP1PrivateOnboardingRepository();
  const author = authorRecord();
  const onboardingAudit: KEP1PrivateOnboardingAuditEvent = {
    eventId: "ONBOARD-AUD-AUTHOR",
    programId: "KEP-1",
    recordId: AUTHOR_ID,
    action: "RECORD_CREATED",
    actorId: "ADMIN-IDENTITY-001",
    occurredAt: NOW,
    recordVersion: 1,
  };
  await onboarding.create(author, onboardingAudit);

  const assignment: KEP1AssignmentDecisionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    assignmentId: "R0001:clinical-author",
    entityId: "R0001",
    role: "clinical-author",
    contributorId: AUTHOR_ID,
    status: "approved",
    proposedByActorId: "ADMIN-MAKER-001",
    proposedAt: NOW,
    decidedByActorId: "ADMIN-CHECKER-002",
    decidedAt: NOW,
    programOwnerRecordId: "OWNER-001",
    decisionEvidenceRef: "private://decision/author",
    version: 1,
  };
  await acquisition.saveAssignment(
    assignment,
    null,
    acquisitionEvent(
      "assignment",
      assignment.assignmentId,
      "ASSIGNMENT_APPROVED"
    )
  );
  const rights: KEP1SourceAcquisitionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    sourceId: SOURCE_ID,
    decision: "controlled-extraction-approved",
    rightsReviewerContributorId: "RIGHTS-REVIEWER-001",
    rightsEvidenceRef: "private://rights/kent",
    decidedByActorId: "ADMIN-RIGHTS-001",
    decidedAt: NOW,
    version: 1,
  };
  await acquisition.saveSource(
    rights,
    null,
    acquisitionEvent("source", SOURCE_ID, "SOURCE_RIGHTS_RECORDED")
  );

  const approvedJob: KEP1AcquisitionJobRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    jobId: JOB_ID,
    sourceId: SOURCE_ID,
    sourceVersion: "Kent-1905",
    rightsDecisionVersion: 1,
    acquisitionMethod: "manual-controlled-import",
    expectedMediaType: "text/plain",
    status: "approved",
    proposalEvidenceRef: "private://proposal/kent",
    proposedByActorId: "ADMIN-JOB-MAKER-001",
    proposedAt: NOW,
    decisionEvidenceRef: "private://decision/kent",
    programOwnerRecordId: "OWNER-001",
    decidedByActorId: "ADMIN-JOB-CHECKER-002",
    decidedAt: NOW,
    artifactId: null,
    verificationId: null,
    version: 1,
  };
  await jobs.saveJob(
    approvedJob,
    null,
    jobEvent("job", JOB_ID, "JOB_APPROVED", 1)
  );
  const artifact: KEP1ImmutableSourceArtifact = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    artifactId: ARTIFACT_ID,
    jobId: JOB_ID,
    sourceId: SOURCE_ID,
    sourceVersion: "Kent-1905",
    sha256: "a".repeat(64),
    byteLength: 4096,
    mediaType: "text/plain",
    privateObjectRef: "private://artifact/kent",
    custodyEvidenceRef: "private://custody/kent",
    recordedByActorId: "ADMIN-CUSTODY-003",
    recordedAt: NOW,
  };
  const artifactJob = {
    ...approvedJob,
    status: "artifact-recorded" as const,
    artifactId: ARTIFACT_ID,
    version: 2,
  };
  await jobs.recordArtifact(
    artifactJob,
    1,
    artifact,
    jobEvent("artifact", ARTIFACT_ID, "ARTIFACT_RECORDED", 2)
  );
  const verification: KEP1ArtifactVerification = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    verificationId: VERIFICATION_ID,
    artifactId: ARTIFACT_ID,
    jobId: JOB_ID,
    observedSha256: artifact.sha256,
    observedByteLength: artifact.byteLength,
    verificationEvidenceRef: "private://verification/kent",
    verifiedByActorId: "ADMIN-VERIFY-004",
    verifiedAt: NOW,
  };
  await jobs.verifyArtifact(
    {
      ...artifactJob,
      status: "verified",
      verificationId: VERIFICATION_ID,
      version: 3,
    },
    2,
    verification,
    jobEvent("artifact", ARTIFACT_ID, "ARTIFACT_VERIFIED", 3)
  );
  return { drafting, acquisition, jobs, onboarding };
}

function validInput(): CreateKEP1DraftRevisionInput {
  return {
    action: "create-revision",
    entityId: "R0001",
    artifactId: ARTIFACT_ID,
    authorContributorId: AUTHOR_ID,
    expectedRevisionNumber: null,
    entityType: "remedy",
    title: "Sulphur — governed traditional description",
    summary:
      "A private, provenance-bound description prepared for independent clinical and evidence review.",
    passages: [
      {
        passageId: "R0001-PASSAGE-1",
        locator: "Chapter Sulphur, paragraph 1",
        text: "Sulphur is described in the source using traditional materia medica terminology.",
      },
    ],
    claims: [
      {
        claimId: "R0001-CLAIM-1",
        text: "The source traditionally describes Sulphur in materia medica terms.",
        claimType: "traditional-use",
        evidenceStatus: "traditional-description",
        sourcePassageIds: ["R0001-PASSAGE-1"],
      },
    ],
    evidenceProfile: {
      evidenceLevel: "Traditional-Literature",
      evidenceSummary:
        "This draft reflects a historical source and does not establish modern clinical efficacy.",
      limitations: ["Historical descriptive source; not clinical proof."],
      sourcePassageIds: ["R0001-PASSAGE-1"],
    },
    graphProposals: [
      {
        proposalId: "R0001-GRAPH-1",
        relationshipType: "related-to",
        targetEntityId: "S0001",
        rationale:
          "Proposed only as a reviewable navigation relationship derived from the cited passage.",
        sourcePassageIds: ["R0001-PASSAGE-1"],
      },
    ],
    changeSummary: "Create the first private provenance-bound draft revision.",
  };
}

export async function runKnowledgeKEP1DraftingWorkbenchTests() {
  const repositories = await seed();
  const input = validInput();

  await assert.rejects(
    createKEP1DraftRevision(
      repositories.drafting,
      repositories.acquisition,
      repositories.jobs,
      repositories.onboarding,
      {
        ...input,
        claims: [
          {
            ...input.claims[0],
            sourcePassageIds: ["UNKNOWN-PASSAGE"],
          },
        ],
      },
      { actorId: "ADMIN-DRAFT-001" },
      NOW
    ),
    /DRAFT_UNKNOWN_PASSAGE_REFERENCE/
  );
  await assert.rejects(
    createKEP1DraftRevision(
      repositories.drafting,
      repositories.acquisition,
      repositories.jobs,
      repositories.onboarding,
      {
        ...input,
        claims: [
          {
            ...input.claims[0],
            claimType: "treatment",
            evidenceStatus: "supported",
          },
        ],
      },
      { actorId: "ADMIN-DRAFT-001" },
      NOW
    ),
    /DRAFT_TRADITIONAL_SOURCE_CLINICAL_PROOF_FORBIDDEN/
  );
  await assert.rejects(
    createKEP1DraftRevision(
      repositories.drafting,
      repositories.acquisition,
      repositories.jobs,
      repositories.onboarding,
      { ...input, authorContributorId: "CONTRIB-WRONG-999" },
      { actorId: "ADMIN-DRAFT-001" },
      NOW
    ),
    /DRAFT_APPROVED_AUTHOR_ASSIGNMENT_REQUIRED/
  );

  const revision = await createKEP1DraftRevision(
    repositories.drafting,
    repositories.acquisition,
    repositories.jobs,
    repositories.onboarding,
    input,
    { actorId: "ADMIN-DRAFT-001" },
    NOW
  );
  assert.strictEqual(revision.revisionNumber, 1);
  assert.match(revision.contentSha256, /^[a-f0-9]{64}$/);
  assert.match(revision.passages[0].contentSha256, /^[a-f0-9]{64}$/);
  assert.strictEqual(revision.status, "draft");
  assert.strictEqual(revision.evidenceProfile.status, "draft");
  assert.deepStrictEqual(revision.evidenceProfile.reviewedBy, []);
  assert.strictEqual(revision.claims[0].requiresClinicalReview, true);
  assert.strictEqual(revision.graphProposals[0].status, "proposed");

  await assert.rejects(
    createKEP1DraftRevision(
      repositories.drafting,
      repositories.acquisition,
      repositories.jobs,
      repositories.onboarding,
      input,
      { actorId: "ADMIN-DRAFT-002" },
      NOW
    ),
    /DRAFT_REVISION_CONFLICT/
  );
  const revision2 = await createKEP1DraftRevision(
    repositories.drafting,
    repositories.acquisition,
    repositories.jobs,
    repositories.onboarding,
    { ...input, expectedRevisionNumber: 1, changeSummary: "Clarify limits." },
    { actorId: "ADMIN-DRAFT-002" },
    "2026-07-27T14:10:00.000Z"
  );
  assert.strictEqual(revision2.revisionNumber, 2);
  assert.ok(await repositories.drafting.getRevision(revision.revisionId));

  const workspace = await getKEP1DraftingWorkspace(
    repositories.drafting,
    repositories.acquisition,
    repositories.jobs
  );
  assert.strictEqual(workspace.summary.draftEntityCount, 1);
  assert.strictEqual(workspace.summary.revisionCount, 2);
  assert.strictEqual(workspace.authority.clinicalApprovalGranted, false);
  assert.strictEqual(workspace.authority.evidenceApprovalGranted, false);
  assert.strictEqual(workspace.authority.graphApprovalGranted, false);
  assert.strictEqual(workspace.authority.publicationAuthorityGranted, false);
  assert.strictEqual(workspace.authority.publicIndexAuthorityGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);
  const publicJson = JSON.stringify(workspace);
  for (const privateValue of [
    "PRIVATE AUTHOR NAME",
    "private://",
    "private-author-identity-hash",
    "ADMIN-DRAFT-",
  ]) {
    assert.ok(!publicJson.includes(privateValue), `DTO leaked ${privateValue}`);
  }

  const rules = fs.readFileSync(
    path.resolve(__dirname, "../firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1DraftHeads",
    "knowledgeGovernanceKep1DraftRevisions",
    "knowledgeGovernanceKep1DraftAuditEvents",
  ]) {
    assert.ok(
      rules.includes(
        `match /${collection}/{docId} { allow read, write: if false; }`
      )
    );
  }
  const route = fs.readFileSync(
    path.resolve(
      __dirname,
      "../src/app/api/admin/knowledge/drafting/route.ts"
    ),
    "utf8"
  );
  assert.ok(route.includes('"knowledge.expansion.manage"'));
  assert.ok(route.includes("sameOrigin(request)"));
  assert.ok(route.includes("readAndBoundRequestBody"));
  assert.ok(route.includes('"Cache-Control": "no-store"'));

  console.log(
    "✅ KEP-1 drafting enforces verified-artifact lineage, current rights, approved authors, immutable revisions, passage hashes, traditional-use boundaries, privacy, and zero approval/publication/RAG authority."
  );
}

if (require.main === module) {
  runKnowledgeKEP1DraftingWorkbenchTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
