import assert from "assert";
import fs from "fs";
import path from "path";
import { KEP1_DOSSIERS } from "../src/features/knowledge/expansion/kep1SourceDossiers";
import type {
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
} from "../src/features/knowledge/expansion/types";
import { MemoryKEP1PrivateOnboardingRepository } from "../src/features/knowledge/onboarding/privateOnboardingRepository";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
} from "../src/features/knowledge/onboarding/privateOnboardingTypes";
import { MemoryKEP1AcquisitionRepository } from "../src/features/knowledge/acquisition/kep1AcquisitionRepository";
import {
  decideKEP1Assignment,
  decideKEP1SourceRights,
  getKEP1AcquisitionWorkspace,
  proposeKEP1Assignment,
} from "../src/features/knowledge/acquisition/kep1AcquisitionService";

const NOW = "2026-07-27T09:00:00.000Z";
const OWNER_ID = "OWNER-KEP1-001";
const MAKER = { actorId: "ADMIN-MAKER-001" };
const CHECKER = { actorId: "ADMIN-CHECKER-002" };

function privateRecord(input: {
  id: string;
  kind?: "contributor" | "program-owner";
  roles?: KEP1EditorialRole[];
  expertise?: KEP1ExpertiseDomain[];
}): KEP1PrivateOnboardingRecord {
  const kind = input.kind || "contributor";
  return {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: input.id,
    kind,
    fullName: `PRIVATE NAME ${input.id}`,
    status: "eligible",
    identity: {
      scheme: "staff-id",
      valueHash: `private-hash-${input.id}`,
      verificationStatus: "verified",
      evidenceRef: `private://identity/${input.id}`,
      verifiedAt: "2026-07-26",
      verifiedBy: "ADMIN-VERIFY-000",
    },
    eligibleRoles: input.roles || [],
    expertiseDomains: input.expertise || [],
    credentials:
      kind === "contributor"
        ? [
            {
              credentialId: `CRED-${input.id}`,
              title: "Private verified credential",
              issuer: "Private authority",
              evidenceRef: `private://credential/${input.id}`,
              verificationStatus: "verified",
              verifiedAt: "2026-07-26",
              verifiedBy: "ADMIN-VERIFY-000",
              expiresAt: "2027-07-27",
            },
          ]
        : [],
    attestations: {
      conflictOfInterestDeclared: true,
      editorialIndependenceAccepted: true,
      aiAssistanceDisclosureAccepted: true,
      sourceUsePolicyAccepted: true,
      acceptanceEvidenceRef: `private://attestations/${input.id}`,
    },
    createdAt: "2026-07-26T08:00:00.000Z",
    createdBy: "ADMIN-ONBOARD-001",
    updatedAt: "2026-07-26T09:00:00.000Z",
    updatedBy: "ADMIN-VERIFY-000",
    version: 2,
  };
}

function audit(record: KEP1PrivateOnboardingRecord) {
  return {
    eventId: `TEST-${record.recordId}`,
    programId: "KEP-1",
    recordId: record.recordId,
    action: "RECORD_CREATED",
    actorId: "ADMIN-ONBOARD-001",
    occurredAt: record.createdAt,
    recordVersion: 1,
  } satisfies KEP1PrivateOnboardingAuditEvent;
}

async function seedOnboarding(
  repository: MemoryKEP1PrivateOnboardingRepository
) {
  const contributors = [
    privateRecord({
      id: "CONTRIB-GASTRO-AUTHOR",
      roles: ["clinical-author"],
      expertise: ["gastroenterology"],
    }),
    privateRecord({
      id: "CONTRIB-GASTRO-REVIEW",
      roles: ["independent-clinical-reviewer"],
      expertise: ["gastroenterology"],
    }),
    privateRecord({
      id: "CONTRIB-DERM-AUTHOR",
      roles: ["clinical-author"],
      expertise: ["dermatology"],
    }),
    privateRecord({
      id: "CONTRIB-DERM-REVIEW",
      roles: ["independent-clinical-reviewer"],
      expertise: ["dermatology"],
    }),
    privateRecord({
      id: "CONTRIB-LAB-AUTHOR",
      roles: ["clinical-author"],
      expertise: ["laboratory-medicine"],
    }),
    privateRecord({
      id: "CONTRIB-LAB-REVIEW",
      roles: ["independent-clinical-reviewer"],
      expertise: ["laboratory-medicine"],
    }),
    privateRecord({
      id: "CONTRIB-HOMEO-AUTHOR",
      roles: ["clinical-author"],
      expertise: ["homeopathy-subject-matter"],
    }),
    privateRecord({
      id: "CONTRIB-HOMEO-REVIEW",
      roles: ["independent-clinical-reviewer"],
      expertise: ["homeopathy-subject-matter"],
    }),
    privateRecord({
      id: "CONTRIB-EVIDENCE",
      roles: ["evidence-reviewer"],
      expertise: ["evidence-methodology"],
    }),
    privateRecord({
      id: "CONTRIB-RIGHTS",
      roles: ["rights-reviewer"],
      expertise: ["source-rights"],
    }),
    privateRecord({ id: OWNER_ID, kind: "program-owner" }),
  ];
  for (const record of contributors) {
    await repository.create(record, audit(record));
  }
}

function contributorFor(entityId: string, role: KEP1EditorialRole): string {
  if (role === "evidence-reviewer") return "CONTRIB-EVIDENCE";
  if (role === "rights-reviewer") return "CONTRIB-RIGHTS";
  const suffix =
    role === "clinical-author" ? "AUTHOR" : "REVIEW";
  if (["D0001", "S0001"].includes(entityId)) {
    return `CONTRIB-GASTRO-${suffix}`;
  }
  if (["D0002", "S0002"].includes(entityId)) {
    return `CONTRIB-DERM-${suffix}`;
  }
  if (["L0001", "L0002"].includes(entityId)) {
    return `CONTRIB-LAB-${suffix}`;
  }
  return `CONTRIB-HOMEO-${suffix}`;
}

export async function runKnowledgeKEP1AcquisitionControlTests() {
  const repository = new MemoryKEP1AcquisitionRepository();
  const onboarding = new MemoryKEP1PrivateOnboardingRepository();
  await seedOnboarding(onboarding);

  await assert.rejects(
    decideKEP1SourceRights(
      repository,
      onboarding,
      {
        action: "decide-source",
        sourceId: "SRC-KEP1-KENT-1905",
        expectedVersion: null,
        decision: "controlled-extraction-approved",
        rightsReviewerContributorId: "CONTRIB-RIGHTS",
        rightsEvidenceRef: "private://rights/kent",
      },
      CHECKER,
      NOW
    ),
    /ACQUISITION_ALL_ASSIGNMENTS_REQUIRED/
  );

  let assignmentIndex = 0;
  for (const dossier of KEP1_DOSSIERS) {
    for (const slot of dossier.assignments) {
      assignmentIndex += 1;
      let proposed = await proposeKEP1Assignment(
        repository,
        onboarding,
        {
          action: "propose-assignment",
          entityId: dossier.entityId,
          role: slot.role,
          contributorId: contributorFor(dossier.entityId, slot.role),
          expectedVersion: null,
        },
        MAKER,
        NOW
      );
      if (assignmentIndex === 1) {
        await assert.rejects(
          decideKEP1Assignment(
            repository,
            onboarding,
            {
              action: "decide-assignment",
              assignmentId: proposed.assignmentId,
              expectedVersion: proposed.version,
              decision: "approve",
              programOwnerRecordId: OWNER_ID,
              decisionEvidenceRef: "private://owner/decision",
            },
            MAKER,
            NOW
          ),
          /ACQUISITION_MAKER_CHECKER_SEPARATION_REQUIRED/
        );
        const rejected = await decideKEP1Assignment(
          repository,
          onboarding,
          {
            action: "decide-assignment",
            assignmentId: proposed.assignmentId,
            expectedVersion: proposed.version,
            decision: "reject",
            programOwnerRecordId: OWNER_ID,
            decisionEvidenceRef: "private://owner/rejection",
          },
          CHECKER,
          NOW
        );
        proposed = await proposeKEP1Assignment(
          repository,
          onboarding,
          {
            action: "propose-assignment",
            entityId: dossier.entityId,
            role: slot.role,
            contributorId: contributorFor(dossier.entityId, slot.role),
            expectedVersion: rejected.version,
          },
          MAKER,
          NOW
        );
      }
      await decideKEP1Assignment(
        repository,
        onboarding,
        {
          action: "decide-assignment",
          assignmentId: proposed.assignmentId,
          expectedVersion: proposed.version,
          decision: "approve",
          programOwnerRecordId: OWNER_ID,
          decisionEvidenceRef: `private://owner/decision/${assignmentIndex}`,
        },
        CHECKER,
        NOW
      );
    }
  }

  await assert.rejects(
    decideKEP1SourceRights(
      repository,
      onboarding,
      {
        action: "decide-source",
        sourceId: "SRC-KEP1-NICE-CG184",
        expectedVersion: null,
        decision: "controlled-extraction-approved",
        rightsReviewerContributorId: "CONTRIB-RIGHTS",
        rightsEvidenceRef: "private://rights/nice",
      },
      CHECKER,
      NOW
    ),
    /ACQUISITION_CITATION_ONLY_EXTRACTION_FORBIDDEN/
  );

  const citationDecision = await decideKEP1SourceRights(
    repository,
    onboarding,
    {
      action: "decide-source",
      sourceId: "SRC-KEP1-NICE-CG184",
      expectedVersion: null,
      decision: "citation-only-confirmed",
      rightsReviewerContributorId: "CONTRIB-RIGHTS",
      rightsEvidenceRef: "private://rights/nice-citation-only",
    },
    CHECKER,
    NOW
  );
  assert.strictEqual(citationDecision.decision, "citation-only-confirmed");

  const extractionDecision = await decideKEP1SourceRights(
    repository,
    onboarding,
    {
      action: "decide-source",
      sourceId: "SRC-KEP1-KENT-1905",
      expectedVersion: null,
      decision: "controlled-extraction-approved",
      rightsReviewerContributorId: "CONTRIB-RIGHTS",
      rightsEvidenceRef: "private://rights/kent-public-domain",
    },
    CHECKER,
    NOW
  );
  assert.strictEqual(
    extractionDecision.decision,
    "controlled-extraction-approved"
  );

  const workspace = await getKEP1AcquisitionWorkspace(repository, onboarding);
  assert.strictEqual(workspace.summary.approvedAssignmentCount, 32);
  assert.strictEqual(workspace.authority.acquisitionDecisionGateOpen, true);
  assert.strictEqual(
    workspace.authority.controlledExtractionQueueGranted,
    true
  );
  assert.strictEqual(workspace.authority.draftingAuthorityGranted, false);
  assert.strictEqual(workspace.authority.publicationAuthorityGranted, false);
  assert.strictEqual(workspace.authority.productionRagAuthorityGranted, false);
  const publicJson = JSON.stringify(workspace);
  for (const privateValue of [
    "PRIVATE NAME",
    "private://",
    "private-hash-",
    "ADMIN-MAKER",
    "ADMIN-CHECKER",
  ]) {
    assert.ok(!publicJson.includes(privateValue));
  }

  const rules = fs.readFileSync(
    path.resolve(__dirname, "../firestore.rules"),
    "utf8"
  );
  for (const collection of [
    "knowledgeGovernanceKep1Assignments",
    "knowledgeGovernanceKep1SourceAcquisition",
    "knowledgeGovernanceKep1AcquisitionAuditEvents",
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
      "../src/app/api/admin/knowledge/acquisition/route.ts"
    ),
    "utf8"
  );
  assert.ok(route.includes('"knowledge.expansion.manage"'));
  assert.ok(route.includes("sameOrigin(request)"));
  assert.ok(route.includes("readAndBoundRequestBody"));
  assert.ok(route.includes('"Cache-Control": "no-store"'));

  console.log(
    "✅ KEP-1 assignment maker-checker, verified roster, rights-policy, privacy, immutable audit, Firestore denial, and zero-publication/RAG boundaries verified."
  );
}

if (require.main === module) {
  runKnowledgeKEP1AcquisitionControlTests().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
