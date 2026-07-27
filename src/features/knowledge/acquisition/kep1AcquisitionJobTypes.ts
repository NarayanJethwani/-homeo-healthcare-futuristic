export type KEP1AcquisitionJobStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "artifact-recorded"
  | "verified";

export type KEP1AcquisitionMethod =
  | "manual-controlled-import"
  | "object-storage-transfer";

export type KEP1ArtifactMediaType =
  | "text/plain"
  | "application/pdf"
  | "application/zip";

export interface KEP1AcquisitionJobRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  jobId: string;
  sourceId: string;
  sourceVersion: string;
  rightsDecisionVersion: number;
  acquisitionMethod: KEP1AcquisitionMethod;
  expectedMediaType: KEP1ArtifactMediaType;
  status: KEP1AcquisitionJobStatus;
  proposalEvidenceRef: string;
  proposedByActorId: string;
  proposedAt: string;
  decisionEvidenceRef: string | null;
  programOwnerRecordId: string | null;
  decidedByActorId: string | null;
  decidedAt: string | null;
  artifactId: string | null;
  verificationId: string | null;
  version: number;
}

export interface KEP1ImmutableSourceArtifact {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  artifactId: string;
  jobId: string;
  sourceId: string;
  sourceVersion: string;
  sha256: string;
  byteLength: number;
  mediaType: KEP1ArtifactMediaType;
  privateObjectRef: string;
  custodyEvidenceRef: string;
  recordedByActorId: string;
  recordedAt: string;
}

export interface KEP1ArtifactVerification {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  verificationId: string;
  artifactId: string;
  jobId: string;
  observedSha256: string;
  observedByteLength: number;
  verificationEvidenceRef: string;
  verifiedByActorId: string;
  verifiedAt: string;
}

export interface KEP1AcquisitionJobAuditEvent {
  eventId: string;
  programId: "KEP-1";
  entityType: "job" | "artifact";
  entityId: string;
  action:
    | "JOB_PROPOSED"
    | "JOB_APPROVED"
    | "JOB_REJECTED"
    | "ARTIFACT_RECORDED"
    | "ARTIFACT_VERIFIED";
  actorId: string;
  occurredAt: string;
  version: number;
}

export interface KEP1AcquisitionJobRepository {
  getJob(jobId: string): Promise<KEP1AcquisitionJobRecord | null>;
  listJobs(): Promise<KEP1AcquisitionJobRecord[]>;
  saveJob(
    record: KEP1AcquisitionJobRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionJobAuditEvent
  ): Promise<void>;
  getArtifact(artifactId: string): Promise<KEP1ImmutableSourceArtifact | null>;
  listArtifacts(): Promise<KEP1ImmutableSourceArtifact[]>;
  recordArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedJobVersion: number,
    artifact: KEP1ImmutableSourceArtifact,
    event: KEP1AcquisitionJobAuditEvent
  ): Promise<void>;
  getVerification(
    verificationId: string
  ): Promise<KEP1ArtifactVerification | null>;
  listVerifications(): Promise<KEP1ArtifactVerification[]>;
  verifyArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedJobVersion: number,
    verification: KEP1ArtifactVerification,
    event: KEP1AcquisitionJobAuditEvent
  ): Promise<void>;
}
