import { createHmac } from "crypto";
import { buildKEP1ContributorIntakeManifest } from "../expansion/kep1ContributorIntake";
import { buildKEP1OnboardingOperationsReport } from "../expansion/kep1OnboardingOperations";
import type {
  KEP1ContributorIntakeManifest,
  KEP1ContributorRecord,
  KEP1ProgramOwnerRecord,
} from "../expansion/types";
import type {
  CreatePrivateOnboardingRecordInput,
  VerifyPrivateOnboardingRecordInput,
} from "./privateOnboardingSchemas";
import type {
  KEP1PrivateOnboardingAuditEvent,
  KEP1PrivateOnboardingRecord,
  KEP1PrivateOnboardingRecordDTO,
  KEP1PrivateOnboardingRepository,
} from "./privateOnboardingTypes";

export interface KEP1PrivateOnboardingActor {
  actorId: string;
}

export function createIdentityHasher(secret: string): (value: string) => string {
  if (secret.length < 32) {
    throw new Error("GOVERNANCE_IDENTITY_HASH_SECRET_INVALID");
  }
  return (value: string) =>
    createHmac("sha256", secret)
      .update(value.trim().toLowerCase(), "utf8")
      .digest("hex");
}

function auditEvent(
  record: KEP1PrivateOnboardingRecord,
  actorId: string,
  action: KEP1PrivateOnboardingAuditEvent["action"],
  now: string
): KEP1PrivateOnboardingAuditEvent {
  return {
    eventId: `KEP1-ONBOARD-${record.recordId}-${record.version}-${action}`,
    programId: "KEP-1",
    recordId: record.recordId,
    action,
    actorId,
    occurredAt: now,
    recordVersion: record.version,
  };
}

function attestationsComplete(record: KEP1PrivateOnboardingRecord): boolean {
  return (
    record.attestations.conflictOfInterestDeclared &&
    record.attestations.editorialIndependenceAccepted &&
    record.attestations.aiAssistanceDisclosureAccepted &&
    record.attestations.sourceUsePolicyAccepted &&
    Boolean(record.attestations.acceptanceEvidenceRef)
  );
}

export function serializePrivateOnboardingRecord(
  record: KEP1PrivateOnboardingRecord
): KEP1PrivateOnboardingRecordDTO {
  return {
    recordId: record.recordId,
    kind: record.kind,
    status: record.status,
    eligibleRoles: [...record.eligibleRoles],
    expertiseDomains: [...record.expertiseDomains],
    credentialCount: record.credentials.length,
    verifiedCredentialCount: record.credentials.filter(
      (credential) => credential.verificationStatus === "verified"
    ).length,
    identityVerificationStatus: record.identity.verificationStatus,
    attestationsComplete: attestationsComplete(record),
    version: record.version,
    updatedAt: record.updatedAt,
  };
}

export async function createPrivateOnboardingRecord(
  repository: KEP1PrivateOnboardingRepository,
  input: CreatePrivateOnboardingRecordInput,
  actor: KEP1PrivateOnboardingActor,
  hashIdentity: (value: string) => string,
  now: string
): Promise<KEP1PrivateOnboardingRecordDTO> {
  const valueHash = hashIdentity(input.identityValue);
  if (await repository.findByIdentityHash(valueHash)) {
    throw new Error("ONBOARDING_IDENTITY_ALREADY_EXISTS");
  }

  const record: KEP1PrivateOnboardingRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    recordId: input.recordId,
    kind: input.kind,
    fullName: input.fullName,
    status: "verification-pending",
    identity: {
      scheme: input.identityScheme,
      valueHash,
      verificationStatus: "pending",
      evidenceRef: null,
      verifiedAt: null,
      verifiedBy: null,
    },
    eligibleRoles: [...input.eligibleRoles],
    expertiseDomains: [...input.expertiseDomains],
    credentials: input.credentials.map((credential) => ({
      ...credential,
      verificationStatus: "pending",
      verifiedAt: null,
      verifiedBy: null,
    })),
    attestations: { ...input.attestations },
    createdAt: now,
    createdBy: actor.actorId,
    updatedAt: now,
    updatedBy: actor.actorId,
    version: 1,
  };

  await repository.create(
    record,
    auditEvent(record, actor.actorId, "RECORD_CREATED", now)
  );
  return serializePrivateOnboardingRecord(record);
}

export async function verifyPrivateOnboardingRecord(
  repository: KEP1PrivateOnboardingRepository,
  input: VerifyPrivateOnboardingRecordInput,
  actor: KEP1PrivateOnboardingActor,
  now: string
): Promise<KEP1PrivateOnboardingRecordDTO> {
  const current = await repository.get(input.recordId);
  if (!current) {
    throw new Error("ONBOARDING_RECORD_NOT_FOUND");
  }
  if (current.version !== input.expectedVersion) {
    throw new Error("ONBOARDING_VERSION_CONFLICT");
  }
  if (current.createdBy === actor.actorId) {
    throw new Error("ONBOARDING_MAKER_CHECKER_SEPARATION_REQUIRED");
  }
  if (!attestationsComplete(current)) {
    throw new Error("ONBOARDING_ATTESTATIONS_INCOMPLETE");
  }

  const verifiedCredentialIds = new Set(input.verifiedCredentialIds);
  const verificationDate = now.slice(0, 10);
  if (
    current.kind === "contributor" &&
    (verifiedCredentialIds.size === 0 ||
      [...verifiedCredentialIds].some(
        (credentialId) =>
          !current.credentials.some(
            (credential) => credential.credentialId === credentialId
          )
      ))
  ) {
    throw new Error("ONBOARDING_VERIFIED_CREDENTIAL_REQUIRED");
  }
  if (
    current.kind === "contributor" &&
    current.credentials.some(
      (credential) =>
        verifiedCredentialIds.has(credential.credentialId) &&
        credential.expiresAt !== null &&
        credential.expiresAt < verificationDate
    )
  ) {
    throw new Error("ONBOARDING_EXPIRED_CREDENTIAL_FORBIDDEN");
  }
  if (
    current.kind === "program-owner" &&
    input.verifiedCredentialIds.length > 0
  ) {
    throw new Error("ONBOARDING_OWNER_CREDENTIAL_OVERRIDE_FORBIDDEN");
  }

  const updated: KEP1PrivateOnboardingRecord = {
    ...current,
    status: "eligible",
    identity: {
      ...current.identity,
      verificationStatus: "verified",
      evidenceRef: input.identityEvidenceRef,
      verifiedAt: verificationDate,
      verifiedBy: actor.actorId,
    },
    credentials: current.credentials.map((credential) =>
      verifiedCredentialIds.has(credential.credentialId)
        ? {
            ...credential,
            verificationStatus: "verified" as const,
            verifiedAt: verificationDate,
            verifiedBy: actor.actorId,
          }
        : credential
    ),
    updatedAt: now,
    updatedBy: actor.actorId,
    version: current.version + 1,
  };

  await repository.verify(
    updated,
    input.expectedVersion,
    auditEvent(updated, actor.actorId, "RECORD_VERIFIED", now)
  );
  return serializePrivateOnboardingRecord(updated);
}

function toContributor(
  record: KEP1PrivateOnboardingRecord
): KEP1ContributorRecord {
  return {
    contributorId: record.recordId,
    fullName: record.fullName,
    status: record.status === "eligible" ? "eligible" : "verification-pending",
    identity: {
      scheme: record.identity.scheme,
      value: record.identity.valueHash,
      verificationStatus: record.identity.verificationStatus,
      verifiedAt: record.identity.verifiedAt,
      verifiedBy: record.identity.verifiedBy,
    },
    eligibleRoles: [...record.eligibleRoles],
    expertiseDomains: [...record.expertiseDomains],
    credentials: record.credentials.map((credential) => ({
      credentialId: credential.credentialId,
      title: credential.title,
      issuer: credential.issuer,
      verificationStatus: credential.verificationStatus,
      evidenceLocation: credential.evidenceRef,
      verifiedAt: credential.verifiedAt,
      expiresAt: credential.expiresAt,
    })),
    attestations: {
      conflictOfInterestDeclared:
        record.attestations.conflictOfInterestDeclared,
      editorialIndependenceAccepted:
        record.attestations.editorialIndependenceAccepted,
      aiAssistanceDisclosureAccepted:
        record.attestations.aiAssistanceDisclosureAccepted,
      sourceUsePolicyAccepted: record.attestations.sourceUsePolicyAccepted,
    },
  };
}

function toProgramOwner(
  record: KEP1PrivateOnboardingRecord
): KEP1ProgramOwnerRecord {
  return {
    approverId: record.recordId,
    fullName: record.fullName,
    status: record.status === "eligible" ? "active" : "suspended",
    identity: {
      scheme: record.identity.scheme,
      value: record.identity.valueHash,
      verificationStatus: record.identity.verificationStatus,
      verifiedAt: record.identity.verifiedAt,
      verifiedBy: record.identity.verifiedBy,
    },
  };
}

export async function getPrivateOnboardingWorkspace(
  repository: KEP1PrivateOnboardingRepository,
  asOfDate = new Date().toISOString().slice(0, 10)
) {
  const records = await repository.list();
  const intake: KEP1ContributorIntakeManifest =
    buildKEP1ContributorIntakeManifest();
  intake.asOfDate = asOfDate;
  intake.contributors = records
    .filter((record) => record.kind === "contributor")
    .map(toContributor);
  intake.programOwners = records
    .filter((record) => record.kind === "program-owner")
    .map(toProgramOwner);
  intake.summary.contributorCount = intake.contributors.length;
  intake.summary.eligibleContributorCount = intake.contributors.filter(
    (contributor) => contributor.status === "eligible"
  ).length;
  intake.summary.activeProgramOwnerCount = intake.programOwners.filter(
    (owner) => owner.status === "active"
  ).length;

  return {
    records: records.map(serializePrivateOnboardingRecord),
    operations: buildKEP1OnboardingOperationsReport(intake),
    authority: {
      assignmentApprovalGranted: false,
      draftingAuthorityGranted: false,
      publicationAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
