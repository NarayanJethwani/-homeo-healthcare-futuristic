import type {
  KEP1AcquisitionJobAuditEvent,
  KEP1AcquisitionJobRecord,
  KEP1AcquisitionJobRepository,
  KEP1ArtifactVerification,
  KEP1ImmutableSourceArtifact,
} from "./kep1AcquisitionJobTypes";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MemoryKEP1AcquisitionJobRepository
  implements KEP1AcquisitionJobRepository
{
  private jobs = new Map<string, KEP1AcquisitionJobRecord>();
  private artifacts = new Map<string, KEP1ImmutableSourceArtifact>();
  private verifications = new Map<string, KEP1ArtifactVerification>();
  private events = new Map<string, KEP1AcquisitionJobAuditEvent>();

  async getJob(id: string) {
    const value = this.jobs.get(id);
    return value ? clone(value) : null;
  }

  async listJobs() {
    return [...this.jobs.values()]
      .sort((a, b) => a.jobId.localeCompare(b.jobId))
      .map(clone);
  }

  async saveJob(
    record: KEP1AcquisitionJobRecord,
    expectedVersion: number | null,
    event: KEP1AcquisitionJobAuditEvent
  ) {
    const current = this.jobs.get(record.jobId);
    if (expectedVersion === null) {
      if (current) throw new Error("ACQUISITION_JOB_ALREADY_EXISTS");
    } else if (!current || current.version !== expectedVersion) {
      throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
    }
    this.jobs.set(record.jobId, clone(record));
    this.events.set(event.eventId, clone(event));
  }

  async getArtifact(id: string) {
    const value = this.artifacts.get(id);
    return value ? clone(value) : null;
  }

  async listArtifacts() {
    return [...this.artifacts.values()]
      .sort((a, b) => a.artifactId.localeCompare(b.artifactId))
      .map(clone);
  }

  async recordArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedVersion: number,
    artifact: KEP1ImmutableSourceArtifact,
    event: KEP1AcquisitionJobAuditEvent
  ) {
    const current = this.jobs.get(job.jobId);
    if (!current || current.version !== expectedVersion) {
      throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
    }
    if (this.artifacts.has(artifact.artifactId)) {
      throw new Error("ACQUISITION_ARTIFACT_IMMUTABLE_CONFLICT");
    }
    this.jobs.set(job.jobId, clone(job));
    this.artifacts.set(artifact.artifactId, clone(artifact));
    this.events.set(event.eventId, clone(event));
  }

  async getVerification(id: string) {
    const value = this.verifications.get(id);
    return value ? clone(value) : null;
  }

  async listVerifications() {
    return [...this.verifications.values()]
      .sort((a, b) => a.verificationId.localeCompare(b.verificationId))
      .map(clone);
  }

  async verifyArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedVersion: number,
    verification: KEP1ArtifactVerification,
    event: KEP1AcquisitionJobAuditEvent
  ) {
    const current = this.jobs.get(job.jobId);
    if (!current || current.version !== expectedVersion) {
      throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
    }
    if (this.verifications.has(verification.verificationId)) {
      throw new Error("ACQUISITION_VERIFICATION_IMMUTABLE_CONFLICT");
    }
    this.jobs.set(job.jobId, clone(job));
    this.verifications.set(verification.verificationId, clone(verification));
    this.events.set(event.eventId, clone(event));
  }
}
