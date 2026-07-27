import { KEP1_SOURCES } from "../expansion/kep1SourceDossiers";
import { serializePrivateOnboardingRecord } from "../onboarding/privateOnboardingService";
import type { KEP1PrivateOnboardingRepository } from "../onboarding/privateOnboardingTypes";
import type { KEP1AcquisitionRepository } from "./kep1AcquisitionTypes";
import type {
  DecideKEP1AcquisitionJobInput,
  ProposeKEP1AcquisitionJobInput,
  RecordKEP1SourceArtifactInput,
  VerifyKEP1SourceArtifactInput,
} from "./kep1AcquisitionJobSchemas";
import type {
  KEP1AcquisitionJobAuditEvent,
  KEP1AcquisitionJobRecord,
  KEP1AcquisitionJobRepository,
  KEP1ArtifactVerification,
  KEP1ImmutableSourceArtifact,
} from "./kep1AcquisitionJobTypes";

export interface KEP1AcquisitionJobActor {
  actorId: string;
}

export function kep1AcquisitionJobId(
  sourceId: string,
  rightsDecisionVersion: number
): string {
  return `KEP1-JOB-${sourceId}-R${rightsDecisionVersion}`;
}

function artifactId(jobId: string, sha256: string): string {
  return `${jobId}-ART-${sha256.slice(0, 16)}`;
}

function verificationId(artifactRecordId: string): string {
  return `${artifactRecordId}-VERIFY-1`;
}

function auditEvent(
  entityType: KEP1AcquisitionJobAuditEvent["entityType"],
  entityId: string,
  action: KEP1AcquisitionJobAuditEvent["action"],
  actorId: string,
  occurredAt: string,
  version: number
): KEP1AcquisitionJobAuditEvent {
  return {
    eventId: `KEP1-JOB-AUD-${entityId}-${version}-${action}`,
    programId: "KEP-1",
    entityType,
    entityId,
    action,
    actorId,
    occurredAt,
    version,
  };
}

function registeredExtractableSource(sourceId: string) {
  const source = KEP1_SOURCES.find((candidate) => candidate.id === sourceId);
  if (!source) throw new Error("ACQUISITION_JOB_UNKNOWN_SOURCE");
  if (
    source.usePolicy !== "governed-extraction" ||
    source.licence.status !== "public-domain" ||
    !source.licence.permitsExtraction ||
    !source.licence.permitsDerivedData
  ) {
    throw new Error("ACQUISITION_JOB_SOURCE_NOT_EXTRACTABLE");
  }
  return source;
}

async function assertCurrentRightsApproval(
  acquisitionRepository: KEP1AcquisitionRepository,
  sourceId: string,
  expectedDecisionVersion?: number
) {
  const decision = await acquisitionRepository.getSource(sourceId);
  if (
    !decision ||
    decision.decision !== "controlled-extraction-approved"
  ) {
    throw new Error("ACQUISITION_JOB_RIGHTS_APPROVAL_REQUIRED");
  }
  if (
    expectedDecisionVersion !== undefined &&
    decision.version !== expectedDecisionVersion
  ) {
    throw new Error("ACQUISITION_JOB_RIGHTS_DECISION_DRIFT");
  }
  return decision;
}

function assertVerifiedProgramOwner(record: Awaited<
  ReturnType<KEP1PrivateOnboardingRepository["get"]>
>) {
  if (
    !record ||
    record.kind !== "program-owner" ||
    record.status !== "eligible" ||
    record.identity.verificationStatus !== "verified"
  ) {
    throw new Error("ACQUISITION_JOB_VERIFIED_PROGRAM_OWNER_REQUIRED");
  }
  return record;
}

export async function proposeKEP1AcquisitionJob(
  jobRepository: KEP1AcquisitionJobRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  input: ProposeKEP1AcquisitionJobInput,
  actor: KEP1AcquisitionJobActor,
  now: string
): Promise<KEP1AcquisitionJobRecord> {
  const source = registeredExtractableSource(input.sourceId);
  const decision = await assertCurrentRightsApproval(
    acquisitionRepository,
    input.sourceId
  );
  const jobId = kep1AcquisitionJobId(input.sourceId, decision.version);
  const current = await jobRepository.getJob(jobId);
  if (
    (current === null && input.expectedVersion !== null) ||
    (current !== null && current.version !== input.expectedVersion)
  ) {
    throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
  }
  if (current && current.status !== "rejected") {
    throw new Error("ACQUISITION_JOB_ALREADY_EXISTS");
  }

  const record: KEP1AcquisitionJobRecord = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    jobId,
    sourceId: source.id,
    sourceVersion: source.sourceVersion,
    rightsDecisionVersion: decision.version,
    acquisitionMethod: input.acquisitionMethod,
    expectedMediaType: input.expectedMediaType,
    status: "proposed",
    proposalEvidenceRef: input.proposalEvidenceRef,
    proposedByActorId: actor.actorId,
    proposedAt: now,
    decisionEvidenceRef: null,
    programOwnerRecordId: null,
    decidedByActorId: null,
    decidedAt: null,
    artifactId: null,
    verificationId: null,
    version: (current?.version || 0) + 1,
  };
  await jobRepository.saveJob(
    record,
    current?.version || null,
    auditEvent("job", jobId, "JOB_PROPOSED", actor.actorId, now, record.version)
  );
  return record;
}

export async function decideKEP1AcquisitionJob(
  jobRepository: KEP1AcquisitionJobRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository,
  input: DecideKEP1AcquisitionJobInput,
  actor: KEP1AcquisitionJobActor,
  now: string
): Promise<KEP1AcquisitionJobRecord> {
  const current = await jobRepository.getJob(input.jobId);
  if (!current) throw new Error("ACQUISITION_JOB_NOT_FOUND");
  if (current.version !== input.expectedVersion) {
    throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
  }
  if (current.status !== "proposed") {
    throw new Error("ACQUISITION_JOB_NOT_PROPOSED");
  }
  if (current.proposedByActorId === actor.actorId) {
    throw new Error("ACQUISITION_JOB_MAKER_CHECKER_REQUIRED");
  }
  registeredExtractableSource(current.sourceId);
  await assertCurrentRightsApproval(
    acquisitionRepository,
    current.sourceId,
    current.rightsDecisionVersion
  );
  const owner = assertVerifiedProgramOwner(
    await onboardingRepository.get(input.programOwnerRecordId)
  );

  const next: KEP1AcquisitionJobRecord = {
    ...current,
    status: input.decision === "approve" ? "approved" : "rejected",
    decisionEvidenceRef: input.decisionEvidenceRef,
    programOwnerRecordId: owner.recordId,
    decidedByActorId: actor.actorId,
    decidedAt: now,
    version: current.version + 1,
  };
  await jobRepository.saveJob(
    next,
    current.version,
    auditEvent(
      "job",
      current.jobId,
      input.decision === "approve" ? "JOB_APPROVED" : "JOB_REJECTED",
      actor.actorId,
      now,
      next.version
    )
  );
  return next;
}

export async function recordKEP1ImmutableArtifact(
  jobRepository: KEP1AcquisitionJobRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  input: RecordKEP1SourceArtifactInput,
  actor: KEP1AcquisitionJobActor,
  now: string
): Promise<KEP1ImmutableSourceArtifact> {
  const current = await jobRepository.getJob(input.jobId);
  if (!current) throw new Error("ACQUISITION_JOB_NOT_FOUND");
  if (current.version !== input.expectedVersion) {
    throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
  }
  if (current.status !== "approved") {
    throw new Error("ACQUISITION_JOB_APPROVAL_REQUIRED");
  }
  if (current.decidedByActorId === actor.actorId) {
    throw new Error("ACQUISITION_JOB_CUSTODY_SEPARATION_REQUIRED");
  }
  if (input.mediaType !== current.expectedMediaType) {
    throw new Error("ACQUISITION_ARTIFACT_MEDIA_TYPE_MISMATCH");
  }
  if (
    !input.privateObjectRef.startsWith("private://") ||
    input.privateObjectRef.includes("..") ||
    /[\r\n]/.test(input.privateObjectRef)
  ) {
    throw new Error("ACQUISITION_ARTIFACT_PRIVATE_REF_REQUIRED");
  }
  registeredExtractableSource(current.sourceId);
  await assertCurrentRightsApproval(
    acquisitionRepository,
    current.sourceId,
    current.rightsDecisionVersion
  );

  const id = artifactId(current.jobId, input.sha256);
  const artifact: KEP1ImmutableSourceArtifact = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    artifactId: id,
    jobId: current.jobId,
    sourceId: current.sourceId,
    sourceVersion: current.sourceVersion,
    sha256: input.sha256,
    byteLength: input.byteLength,
    mediaType: input.mediaType,
    privateObjectRef: input.privateObjectRef,
    custodyEvidenceRef: input.custodyEvidenceRef,
    recordedByActorId: actor.actorId,
    recordedAt: now,
  };
  const next = {
    ...current,
    status: "artifact-recorded" as const,
    artifactId: id,
    version: current.version + 1,
  };
  await jobRepository.recordArtifact(
    next,
    current.version,
    artifact,
    auditEvent("artifact", id, "ARTIFACT_RECORDED", actor.actorId, now, next.version)
  );
  return artifact;
}

export async function verifyKEP1ImmutableArtifact(
  jobRepository: KEP1AcquisitionJobRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  input: VerifyKEP1SourceArtifactInput,
  actor: KEP1AcquisitionJobActor,
  now: string
): Promise<KEP1ArtifactVerification> {
  const current = await jobRepository.getJob(input.jobId);
  if (!current) throw new Error("ACQUISITION_JOB_NOT_FOUND");
  if (current.version !== input.expectedVersion) {
    throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
  }
  if (
    current.status !== "artifact-recorded" ||
    current.artifactId !== input.artifactId
  ) {
    throw new Error("ACQUISITION_ARTIFACT_NOT_READY");
  }
  const artifact = await jobRepository.getArtifact(input.artifactId);
  if (!artifact || artifact.jobId !== current.jobId) {
    throw new Error("ACQUISITION_ARTIFACT_NOT_FOUND");
  }
  if (artifact.recordedByActorId === actor.actorId) {
    throw new Error("ACQUISITION_ARTIFACT_INDEPENDENT_VERIFIER_REQUIRED");
  }
  if (
    artifact.sha256 !== input.observedSha256 ||
    artifact.byteLength !== input.observedByteLength
  ) {
    throw new Error("ACQUISITION_ARTIFACT_INTEGRITY_MISMATCH");
  }
  await assertCurrentRightsApproval(
    acquisitionRepository,
    current.sourceId,
    current.rightsDecisionVersion
  );

  const id = verificationId(artifact.artifactId);
  const verification: KEP1ArtifactVerification = {
    schemaVersion: "1.0.0",
    programId: "KEP-1",
    verificationId: id,
    artifactId: artifact.artifactId,
    jobId: current.jobId,
    observedSha256: input.observedSha256,
    observedByteLength: input.observedByteLength,
    verificationEvidenceRef: input.verificationEvidenceRef,
    verifiedByActorId: actor.actorId,
    verifiedAt: now,
  };
  const next = {
    ...current,
    status: "verified" as const,
    verificationId: id,
    version: current.version + 1,
  };
  await jobRepository.verifyArtifact(
    next,
    current.version,
    verification,
    auditEvent("artifact", artifact.artifactId, "ARTIFACT_VERIFIED", actor.actorId, now, next.version)
  );
  return verification;
}

export async function getKEP1AcquisitionJobWorkspace(
  jobRepository: KEP1AcquisitionJobRepository,
  acquisitionRepository: KEP1AcquisitionRepository,
  onboardingRepository: KEP1PrivateOnboardingRepository
) {
  const [jobs, artifacts, verifications, decisions, onboardingRecords] =
    await Promise.all([
      jobRepository.listJobs(),
      jobRepository.listArtifacts(),
      jobRepository.listVerifications(),
      acquisitionRepository.listSources(),
      onboardingRepository.list(),
    ]);
  const sources = KEP1_SOURCES.map((source) => {
    const decision = decisions.find((item) => item.sourceId === source.id);
    return {
      sourceId: source.id,
      title: source.title,
      sourceVersion: source.sourceVersion,
      usePolicy: source.usePolicy,
      rightsDecision: decision?.decision || "pending",
      rightsDecisionVersion: decision?.version || 0,
      jobEligible:
        source.usePolicy === "governed-extraction" &&
        decision?.decision === "controlled-extraction-approved",
    };
  });
  const publicJobs = jobs.map((job) => {
    const artifact = job.artifactId
      ? artifacts.find((item) => item.artifactId === job.artifactId)
      : null;
    return {
      jobId: job.jobId,
      sourceId: job.sourceId,
      sourceTitle:
        KEP1_SOURCES.find((source) => source.id === job.sourceId)?.title ||
        job.sourceId,
      sourceVersion: job.sourceVersion,
      rightsDecisionVersion: job.rightsDecisionVersion,
      acquisitionMethod: job.acquisitionMethod,
      expectedMediaType: job.expectedMediaType,
      status: job.status,
      artifactId: job.artifactId,
      verificationId: job.verificationId,
      version: job.version,
      artifact:
        artifact
          ? {
              sha256: artifact.sha256,
              byteLength: artifact.byteLength,
              mediaType: artifact.mediaType,
            }
          : null,
    };
  });

  return {
    programId: "KEP-1" as const,
    sources,
    programOwners: onboardingRecords
      .filter((record) => record.kind === "program-owner")
      .map(serializePrivateOnboardingRecord),
    jobs: publicJobs,
    summary: {
      eligibleSourceCount: sources.filter((source) => source.jobEligible).length,
      proposedJobCount: jobs.filter((job) => job.status === "proposed").length,
      approvedJobCount: jobs.filter((job) => job.status === "approved").length,
      artifactCount: artifacts.length,
      verifiedArtifactCount: verifications.length,
    },
    authority: {
      acquisitionExecutionAutomaticallyGranted: false,
      extractionAuthorityGranted: false,
      draftingAuthorityGranted: false,
      publicationAuthorityGranted: false,
      publicIndexAuthorityGranted: false,
      productionRagAuthorityGranted: false,
    },
  };
}
