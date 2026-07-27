import "server-only";

import { getAdminDb } from "@/lib/firebaseAdmin";
import type {
  KEP1AcquisitionJobAuditEvent,
  KEP1AcquisitionJobRecord,
  KEP1AcquisitionJobRepository,
  KEP1ArtifactVerification,
  KEP1ImmutableSourceArtifact,
} from "./kep1AcquisitionJobTypes";

export const KEP1_ACQUISITION_JOB_COLLECTIONS = {
  JOBS: "knowledgeGovernanceKep1AcquisitionJobs",
  ARTIFACTS: "knowledgeGovernanceKep1SourceArtifacts",
  VERIFICATIONS: "knowledgeGovernanceKep1ArtifactVerifications",
  AUDIT_EVENTS: "knowledgeGovernanceKep1AcquisitionJobAuditEvents",
} as const;

export class FirestoreKEP1AcquisitionJobRepository
  implements KEP1AcquisitionJobRepository
{
  private db() {
    return getAdminDb();
  }

  async getJob(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.JOBS)
      .doc(id)
      .get();
    return snapshot.exists ? (snapshot.data() as KEP1AcquisitionJobRecord) : null;
  }

  async listJobs() {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.JOBS)
      .orderBy("jobId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1AcquisitionJobRecord
    );
  }

  async saveJob(
    record: KEP1AcquisitionJobRecord,
    expectedVersion: number | null,
    auditEvent: KEP1AcquisitionJobAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const jobRef = this.db()
        .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.JOBS)
        .doc(record.jobId);
      const auditRef = this.auditRef(auditEvent.eventId);
      const snapshot = await transaction.get(jobRef);
      if (expectedVersion === null) {
        if (snapshot.exists) throw new Error("ACQUISITION_JOB_ALREADY_EXISTS");
        transaction.create(jobRef, record);
      } else {
        this.assertExpectedJob(snapshot, record, expectedVersion);
        transaction.update(jobRef, record);
      }
      transaction.create(auditRef, auditEvent);
    });
  }

  async getArtifact(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.ARTIFACTS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1ImmutableSourceArtifact)
      : null;
  }

  async listArtifacts() {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.ARTIFACTS)
      .orderBy("artifactId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1ImmutableSourceArtifact
    );
  }

  async recordArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedJobVersion: number,
    artifact: KEP1ImmutableSourceArtifact,
    auditEvent: KEP1AcquisitionJobAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const jobRef = this.db()
        .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.JOBS)
        .doc(job.jobId);
      const artifactRef = this.db()
        .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.ARTIFACTS)
        .doc(artifact.artifactId);
      const auditRef = this.auditRef(auditEvent.eventId);
      const [jobSnapshot, artifactSnapshot] = await Promise.all([
        transaction.get(jobRef),
        transaction.get(artifactRef),
      ]);
      this.assertExpectedJob(jobSnapshot, job, expectedJobVersion);
      if (artifactSnapshot.exists) {
        throw new Error("ACQUISITION_ARTIFACT_IMMUTABLE_CONFLICT");
      }
      transaction.update(jobRef, job);
      transaction.create(artifactRef, artifact);
      transaction.create(auditRef, auditEvent);
    });
  }

  async getVerification(id: string) {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.VERIFICATIONS)
      .doc(id)
      .get();
    return snapshot.exists
      ? (snapshot.data() as KEP1ArtifactVerification)
      : null;
  }

  async listVerifications() {
    const snapshot = await this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.VERIFICATIONS)
      .orderBy("verificationId", "asc")
      .get();
    return snapshot.docs.map(
      (document: any) => document.data() as KEP1ArtifactVerification
    );
  }

  async verifyArtifact(
    job: KEP1AcquisitionJobRecord,
    expectedJobVersion: number,
    verification: KEP1ArtifactVerification,
    auditEvent: KEP1AcquisitionJobAuditEvent
  ) {
    await this.db().runTransaction(async (transaction: any) => {
      const jobRef = this.db()
        .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.JOBS)
        .doc(job.jobId);
      const verificationRef = this.db()
        .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.VERIFICATIONS)
        .doc(verification.verificationId);
      const auditRef = this.auditRef(auditEvent.eventId);
      const [jobSnapshot, verificationSnapshot] = await Promise.all([
        transaction.get(jobRef),
        transaction.get(verificationRef),
      ]);
      this.assertExpectedJob(jobSnapshot, job, expectedJobVersion);
      if (verificationSnapshot.exists) {
        throw new Error("ACQUISITION_VERIFICATION_IMMUTABLE_CONFLICT");
      }
      transaction.update(jobRef, job);
      transaction.create(verificationRef, verification);
      transaction.create(auditRef, auditEvent);
    });
  }

  private auditRef(eventId: string) {
    return this.db()
      .collection(KEP1_ACQUISITION_JOB_COLLECTIONS.AUDIT_EVENTS)
      .doc(eventId);
  }

  private assertExpectedJob(
    snapshot: any,
    next: KEP1AcquisitionJobRecord,
    expectedVersion: number
  ) {
    if (
      !snapshot.exists ||
      (snapshot.data() as { version?: number }).version !== expectedVersion
    ) {
      throw new Error("ACQUISITION_JOB_VERSION_CONFLICT");
    }
    const current = snapshot.data() as KEP1AcquisitionJobRecord;
    if (
      current.jobId !== next.jobId ||
      current.sourceId !== next.sourceId ||
      current.sourceVersion !== next.sourceVersion ||
      current.rightsDecisionVersion !== next.rightsDecisionVersion
    ) {
      throw new Error("ACQUISITION_JOB_IMMUTABLE_IDENTITY_CONFLICT");
    }
  }
}
