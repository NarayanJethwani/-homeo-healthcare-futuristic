import assert from "assert";
import fs from "fs";
import path from "path";
import { MemoryKEP1AcquisitionRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionRepository";
import { MemoryKEP1AcquisitionJobRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionJobRepository";
import {
  decideKEP1AcquisitionJob,
  getKEP1AcquisitionJobWorkspace,
  proposeKEP1AcquisitionJob,
  recordKEP1ImmutableArtifact,
  verifyKEP1ImmutableArtifact,
} from "../src/features/knowledge/acquisition/kep1AcquisitionJobService";
import type {
  KEP1AcquisitionAuditEvent,
  KEP1SourceAcquisitionRecord,
} from "../src/features/knowledge/acquisition/kep1AcquisitionTypes";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingTypes";

const NOW = "2026-07-27T12:30:00.000Z";
const MAKER = { actorId: "ADMIN-JOB-MAKER-001" };
const CHECKER = { actorId: "ADMIN-JOB-CHECKER-002" };
const VERIFIER = { actorId: "ADMIN-JOB-VERIFY-003" };
const OWNER_ID = "OWNER-KEP1-JOBS-001";

function ownerRecord(): KEP1PrivateOnboardingRecord {
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: OWNER_ID,
    kind: "program-owner",
    fullName: "PRIVATE PROGRAM OWNER",
    status: "eligible",
    identity: {
      scheme: "staff-id",
      valueHash: "private-owner-hash",
      verificationStatus: "verified",
      evidenceRef: "private://identity/owner",
      verifiedAt: "2026-07-26",
      verifiedBy: "ADMIN-IDENTITY-001",
    },
    eligibleRoles: [],
    expertiseDomains: [],
    credentials: [],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: "private://attestation/owner",
    },
    createdAt: "2026-07-26T08:00:00.000Z",
    createdBy: "ADMIN-IDENTITY-001",
    updatedAt: "2026-07-26T09:00:00.000Z",
    updatedBy: "ADMIN-IDENTITY-001",
    version: 1,
  };
}

function onboardingAudit(
  record: KEP1PrivateOnboardingRecord
): KEP1PrivateOnboardingAuditEvent {
  return {
    eventId: `AUD-${record.recordId}`,
    programId: "KEP-1",
    recordId: record.recordId,
    action: "RECORD_CREATED",
    actorId: "ADMIN-IDENTITY-001",
    occurredAt: record.createdAt,
    recordVersion: 1,
  };
}

async function seedRights(
  repository: MemoryKEP1AcquisitionRepository,
  sourceId: string,
  version = 1
) {
  const record: KEP1SourceAcquisitionRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    sourceId,
    decision: "controlled-extraction-approved",
    rightsReviewerContributorId: "CONTRIB-RIGHTS-001",
    rightsEvidenceRef: `private://rights/${sourceId}/${version}`,
    decidedByActorId: "ADMIN-RIGHTS-001",
    decidedAt: NOW,
    version,
  };
  const event: KEP1AcquisitionAuditEvent = {
    eventId: `AUD-RIGHTS-${sourceId}-${version}`,
    programId: "KEP-1",
    entityType: "source",
    entityId: sourceId,
    action: "SOURCE_RIGHTS_RECORDED",
    actorId: "ADMIN-RIGHTS-001",
    occurredAt: NOW,
    version,
  };
  await repository.saveSource(record, version === 1 ? null : version - 1, event);
}

export async function runKnowledgeKEP1AcquisitionJobTests() {
  const jobs = new MemoryKEP1AcquisitionJobRepository();
  const acquisition = new MemoryKEP1AcquisitionRepository();
  const onboarding = new MemoryKEP1PrivateOnboardingRepository();
  const owner = ownerRecord();
  await onboarding.create(owner, onboardingAudit(owner));

  await assert.rejects(
    proposeKEP1AcquisitionJob(
      jobs,
      acquisition,
      {
        action: "propose-job",
        sourceId: "SRC-KEP1-NICE-CG184",
        expectedVersion: null,
        acquisitionMethod: "manual-controlled-import",
        expectedMediaType: "application/pdf",
        proposalEvidenceRef: "private://proposal/nice",
      },
      MAKER,
      NOW
    ),
    /ACQUISITION_JOB_SOURCE_NOT_EXTRACTABLE/
  );

  await seedRights(acquisition, "SRC-KEP1-BOERICKE-1901");
  const driftJob = await proposeKEP1AcquisitionJob(
    jobs,
    acquisition,
    {
      action: "propose-job",
      sourceId: "SRC-KEP1-BOERICKE-1901",
      expectedVersion: null,
      acquisitionMethod: "object-storage-transfer",
      expectedMediaType: "application/pdf",
      proposalEvidenceRef: "private://proposal/boericke",
    },
    MAKER,
    NOW
  );
  await seedRights(acquisition, "SRC-KEP1-BOERICKE-1901", 2);
  await assert.rejects(
    decideKEP1AcquisitionJob(
      jobs,
      acquisition,
      onboarding,
      {
        action: "decide-job",
        jobId: driftJob.jobId,
        expectedVersion: driftJob.version,
        decision: "approve",
        programOwnerRecordId: OWNER_ID,
        decisionEvidenceRef: "private://decision/boericke",
      },
      CHECKER,
      NOW
    ),
    /ACQUISITION_JOB_RIGHTS_DECISION_DRIFT/
  );

  await seedRights(acquisition, "SRC-KEP1-KENT-1905");
  const proposed = await proposeKEP1AcquisitionJob(
    jobs,
    acquisition,
    {
      action: "propose-job",
      sourceId: "SRC-KEP1-KENT-1905",
      expectedVersion: null,
      acquisitionMethod: "manual-controlled-import",
      expectedMediaType: "text/plain",
      proposalEvidenceRef: "private://proposal/kent",
    },
    MAKER,
    NOW
  );
  await assert.rejects(
    decideKEP1AcquisitionJob(
      jobs,
      acquisition,
      onboarding,
      {
        action: "decide-job",
        jobId: proposed.jobId,
        expectedVersion: proposed.version,
        decision: "approve",
        programOwnerRecordId: OWNER_ID,
        decisionEvidenceRef: "private://decision/kent",
      },
      MAKER,
      NOW
    ),
    /ACQUISITION_JOB_MAKER_CHECKER_REQUIRED/
  );
  const approved = await decideKEP1AcquisitionJob(
    jobs,
    acquisition,
    onboarding,
    {
      action: "decide-job",
      jobId: proposed.jobId,
      expectedVersion: proposed.version,
      decision: "approve",
      programOwnerRecordId: OWNER_ID,
      decisionEvidenceRef: "private://decision/kent",
    },
    CHECKER,
    NOW
  );

  const digest = "a".repeat(64);
  const artifactInput = {
    action: "record-artifact" as const,
    jobId: approved.jobId,
    expectedVersion: approved.version,
    sha256: digest,
    byteLength: 1589,
    mediaType: "text/plain" as const,
    privateObjectRef: "private://knowledge/kep1/kent/source.txt",
    custodyEvidenceRef: "private://custody/kent",
  };
  await assert.rejects(
    recordKEP1ImmutableArtifact(
      jobs,
      acquisition,
      artifactInput,
      CHECKER,
      NOW
    ),
    /ACQUISITION_JOB_CUSTODY_SEPARATION_REQUIRED/
  );
  await assert.rejects(
    recordKEP1ImmutableArtifact(
      jobs,
      acquisition,
      { ...artifactInput, privateObjectRef: "../../private/source.txt" },
      MAKER,
      NOW
    ),
    /ACQUISITION_ARTIFACT_PRIVATE_REF_REQUIRED/
  );
  const artifact = await recordKEP1ImmutableArtifact(
    jobs,
    acquisition,
    artifactInput,
    MAKER,
    NOW
  );
  const artifactJob = await jobs.getJob(approved.jobId);
  assert.ok(artifactJob);
  await assert.rejects(
    verifyKEP1ImmutableArtifact(
      jobs,
      acquisition,
      {
        action: "verify-artifact",
        jobId: approved.jobId,
        expectedVersion: artifactJob!.version,
        artifactId: artifact.artifactId,
        observedSha256: "b".repeat(64),
        observedByteLength: 1589,
        verificationEvidenceRef: "private://verification/kent",
      },
      VERIFIER,
      NOW
    ),
    /ACQUISITION_ARTIFACT_INTEGRITY_MISMATCH/
  );
  await assert.rejects(
    verifyKEP1ImmutableArtifact(
      jobs,
      acquisition,
      {
        action: "verify-artifact",
        jobId: approved.jobId,
        expectedVersion: artifactJob!.version,
        artifactId: artifact.artifactId,
        observedSha256: digest,
        observedByteLength: 1589,
        verificationEvidenceRef: "private://verification/kent",
      },
      MAKER,
      NOW
    ),
    /ACQUISITION_ARTIFACT_INDEPENDENT_VERIFIER_REQUIRED/
  );
  const verification = await verifyKEP1ImmutableArtifact(
    jobs,
    acquisition,
    {
      action: "verify-artifact",
      jobId: approved.jobId,
      expectedVersion: artifactJob!.version,
      artifactId: artifact.artifactId,
      observedSha256: digest,
      observedByteLength: 1589,
      verificationEvidenceRef: "private://verification/kent",
    },
    VERIFIER,
    NOW
  );
  assert.strictEqual(verification.observedSha256, digest);

  const workspace = await getKEP1AcquisitionJobWorkspace(
    jobs,
    acquisition,
    onboarding
  );
  assert.strictEqual(workspace.summary.verifiedArtifactCount, 1);
  assert.strictEqual(workspace.authority.extractionAuthorityGranted, false);
  assert.strictEqual(workspace.authority.draftingAuthorityGranted, false);
  assert.strictEqual(workspace.authority.publicationAuthorityGranted, false);
  assert.strictEqual(workspace.authority.publicIndexAuthorityGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);
  const publicJson = JSON.stringify(workspace);
  for (const secret of [
    "PRIVATE PROGRAM OWNER",
    "private://",
    "private-owner-hash",
    "ADMIN-JOB-",
  ]) {
    assert.ok(!publicJson.includes(secret), `DTO leaked ${secret}`);
  }

  const rules = fs.readFileSync(
    path.resolve(__dirname, "../firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1AcquisitionJobs",
    "knowledgeGovernanceKep1SourceArtifacts",
    "knowledgeGovernanceKep1ArtifactVerifications",
    "knowledgeGovernanceKep1AcquisitionJobAuditEvents",
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
      "../src/app/api/admin/knowledge/acquisition-jobs/route.ts"
    ),
    "utf8"
  );
  assert.ok(route.includes('"knowledge.expansion.manage"'));
  assert.ok(route.includes("sameOrigin(request)"));
  assert.ok(route.includes("readAndBoundRequestBody"));
  assert.ok(route.includes('"Cache-Control": "no-store"'));

  console.log(
    "✅ KEP-1 acquisition jobs enforce rights-version binding, maker-checker approval, custody separation, immutable artifacts, independent checksum verification, privacy, and zero-publication/RAG authority."
  );
}

if (require.main === module) {
  runKnowledgeKEP1AcquisitionJobTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
