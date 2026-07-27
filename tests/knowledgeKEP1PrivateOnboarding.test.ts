import assert from "assert";
import fs from "fs";
import path from "path";
import {
  createPrivateOnboardingRecordSchema,
  verifyPrivateOnboardingRecordSchema,
} from "../src/features/knowledge/onboarding/privateOnboardingSchemas";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import {
  createIdentityHasher,
  createPrivateOnboardingRecord,
  getPrivateOnboardingWorkspace,
  verifyPrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingService";

const NOW = "2026-07-27T05:00:00.000Z";
const hashIdentity = createIdentityHasher(
  "test-only-private-onboarding-secret-123456789"
);

function contributorInput(
  recordId = "CONTRIB-GASTRO-AUTHOR",
  identityValue = "private-staff-identity-001"
) {
  return createPrivateOnboardingRecordSchema.parse({
    action: "create",
    recordId,
    kind: "contributor",
    fullName: "Private Test Contributor",
    identityScheme: "staff-id",
    identityValue,
    eligibleRoles: ["clinical-author"],
    expertiseDomains: ["gastroenterology"],
    credentials: [
      {
        credentialId: "CREDENTIAL-GASTRO-001",
        title: "Verified clinical qualification",
        issuer: "Private credential authority",
        evidenceRef: "private://credential/evidence-001",
        expiresAt: "2027-07-27",
      },
    ],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: "private://attestations/evidence-001",
    },
  });
}

export async function runKnowledgeKEP1PrivateOnboardingTests(): Promise<void> {
  const repository = new MemoryKEP1PrivateOnboardingRepository();
  const input = contributorInput();
  const created = await createPrivateOnboardingRecord(
    repository,
    input,
    { actorId: "ADMIN-MAKER-001" },
    hashIdentity,
    NOW
  );
  assert.strictEqual(created.status, "verification-pending");
  assert.strictEqual(created.version, 1);
  assert.ok(!JSON.stringify(created).includes(input.fullName));
  assert.ok(!JSON.stringify(created).includes(input.identityValue));
  assert.ok(!JSON.stringify(created).includes("evidence-001"));

  const privateRecord = await repository.get(input.recordId);
  assert.ok(privateRecord);
  assert.notStrictEqual(privateRecord.identity.valueHash, input.identityValue);
  assert.strictEqual(privateRecord.identity.valueHash.length, 64);
  assert.strictEqual(privateRecord.identity.verificationStatus, "pending");

  const verifyInput = verifyPrivateOnboardingRecordSchema.parse({
    action: "verify",
    recordId: input.recordId,
    expectedVersion: 1,
    identityEvidenceRef: "private://identity/evidence-001",
    verifiedCredentialIds: ["CREDENTIAL-GASTRO-001"],
  });
  await assert.rejects(
    verifyPrivateOnboardingRecord(
      repository,
      verifyInput,
      { actorId: "ADMIN-MAKER-001" },
      NOW
    ),
    /ONBOARDING_MAKER_CHECKER_SEPARATION_REQUIRED/
  );

  const verified = await verifyPrivateOnboardingRecord(
    repository,
    verifyInput,
    { actorId: "ADMIN-CHECKER-002" },
    NOW
  );
  assert.strictEqual(verified.status, "eligible");
  assert.strictEqual(verified.version, 2);
  assert.strictEqual(verified.verifiedCredentialCount, 1);
  assert.strictEqual(verified.identityVerificationStatus, "verified");

  await assert.rejects(
    verifyPrivateOnboardingRecord(
      repository,
      verifyInput,
      { actorId: "ADMIN-CHECKER-003" },
      NOW
    ),
    /ONBOARDING_VERSION_CONFLICT/
  );

  await assert.rejects(
    createPrivateOnboardingRecord(
      repository,
      contributorInput(
        "CONTRIB-DUPLICATE-IDENTITY",
        input.identityValue.toUpperCase()
      ),
      { actorId: "ADMIN-MAKER-003" },
      hashIdentity,
      NOW
    ),
    /ONBOARDING_IDENTITY_ALREADY_EXISTS/
  );

  const expiredRepository = new MemoryKEP1PrivateOnboardingRepository();
  const expiredInput = contributorInput(
    "CONTRIB-EXPIRED-CREDENTIAL",
    "private-staff-identity-expired"
  );
  expiredInput.credentials[0].expiresAt = "2026-07-26";
  await createPrivateOnboardingRecord(
    expiredRepository,
    expiredInput,
    { actorId: "ADMIN-MAKER-004" },
    hashIdentity,
    NOW
  );
  await assert.rejects(
    verifyPrivateOnboardingRecord(
      expiredRepository,
      {
        ...verifyInput,
        recordId: expiredInput.recordId,
      },
      { actorId: "ADMIN-CHECKER-004" },
      NOW
    ),
    /ONBOARDING_EXPIRED_CREDENTIAL_FORBIDDEN/
  );

  const workspace = await getPrivateOnboardingWorkspace(
    repository,
    "2026-07-27"
  );
  assert.strictEqual(workspace.records.length, 1);
  assert.strictEqual(workspace.operations.summary.coveredOperatingSeats, 1);
  assert.strictEqual(
    workspace.operations.summary.qualifiedAssignmentSlotsCovered,
    2
  );
  assert.strictEqual(workspace.operations.summary.intakeGateReady, false);
  assert.deepStrictEqual(workspace.authority, {
    assignmentApprovalGranted: false,
    draftingAuthorityGranted: false,
    publicationAuthorityGranted: false,
    productionRagAuthorityGranted: false,
  });
  const workspaceJson = JSON.stringify(workspace);
  assert.ok(!workspaceJson.includes(input.fullName));
  assert.ok(!workspaceJson.includes(input.identityValue));
  assert.ok(!workspaceJson.includes("private://"));
  assert.ok(!workspaceJson.includes(privateRecord.identity.valueHash));

  const auditEvents = await repository.listAuditEvents(input.recordId);
  assert.deepStrictEqual(
    auditEvents.map((event) => event.action),
    ["RECORD_CREATED", "RECORD_VERIFIED"]
  );
  assert.ok(!JSON.stringify(auditEvents).includes(input.fullName));

  const rules = fs.readFileSync(
    path.resolve(__dirname, "../firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceOnboardingRecords",
    "knowledgeGovernanceOnboardingIdentityLocks",
    "knowledgeGovernanceOnboardingAuditEvents",
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
      "../src/app/api/admin/knowledge/onboarding/route.ts"
    ),
    "utf8"
  );
  assert.ok(route.includes('"knowledge.contributor.manage"'));
  assert.ok(route.includes("sameOrigin(request)"));
  assert.ok(route.includes("readAndBoundRequestBody"));
  assert.ok(route.includes('"Cache-Control": "no-store"'));

  assert.throws(
    () => createIdentityHasher("short-secret"),
    /GOVERNANCE_IDENTITY_HASH_SECRET_INVALID/
  );

  console.log(
    "✅ KEP-1 private onboarding maker-checker, identity hashing, immutable versioning, credential currency, privacy, RBAC, Firestore denial, audit, and zero-authority boundaries verified."
  );
}

if (require.main === module) {
  runKnowledgeKEP1PrivateOnboardingTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
