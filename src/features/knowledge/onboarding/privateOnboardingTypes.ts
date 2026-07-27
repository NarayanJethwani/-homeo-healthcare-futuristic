import type {
  KEP1EditorialRole,
  KEP1ExpertiseDomain,
  KEP1IdentityScheme,
} from "../expansion/types";

export type KEP1PrivateOnboardingKind = "contributor" | "program-owner";
export type KEP1PrivateOnboardingStatus =
  | "verification-pending"
  | "eligible"
  | "suspended";

export interface KEP1PrivateCredentialRecord {
  credentialId: string;
  title: string;
  issuer: string;
  evidenceRef: string;
  verificationStatus: "pending" | "verified" | "rejected" | "expired";
  verifiedAt: string | null;
  verifiedBy: string | null;
  expiresAt: string | null;
}

export interface KEP1PrivateOnboardingRecord {
  schemaVersion: "1.0.0";
  programId: "KEP-1";
  recordId: string;
  kind: KEP1PrivateOnboardingKind;
  fullName: string;
  status: KEP1PrivateOnboardingStatus;
  identity: {
    scheme: KEP1IdentityScheme;
    valueHash: string;
    verificationStatus: "pending" | "verified" | "rejected";
    evidenceRef: string | null;
    verifiedAt: string | null;
    verifiedBy: string | null;
  };
  eligibleRoles: KEP1EditorialRole[];
  expertiseDomains: KEP1ExpertiseDomain[];
  credentials: KEP1PrivateCredentialRecord[];
  attestations: {
    conflictOfInterestDeclared: boolean;
    editorialIndependenceAccepted: boolean;
    aiAssistanceDisclosureAccepted: boolean;
    sourceUsePolicyAccepted: boolean;
    acceptanceEvidenceRef: string;
  };
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  version: number;
}

export interface KEP1PrivateOnboardingAuditEvent {
  eventId: string;
  programId: "KEP-1";
  recordId: string;
  action: "RECORD_CREATED" | "RECORD_VERIFIED" | "RECORD_SUSPENDED";
  actorId: string;
  occurredAt: string;
  recordVersion: number;
}

export interface KEP1PrivateOnboardingRepository {
  create(
    record: KEP1PrivateOnboardingRecord,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void>;
  verify(
    record: KEP1PrivateOnboardingRecord,
    expectedVersion: number,
    auditEvent: KEP1PrivateOnboardingAuditEvent
  ): Promise<void>;
  get(recordId: string): Promise<KEP1PrivateOnboardingRecord | null>;
  findByIdentityHash(
    valueHash: string
  ): Promise<KEP1PrivateOnboardingRecord | null>;
  list(): Promise<KEP1PrivateOnboardingRecord[]>;
  listAuditEvents(recordId: string): Promise<KEP1PrivateOnboardingAuditEvent[]>;
}

export interface KEP1PrivateOnboardingRecordDTO {
  recordId: string;
  kind: KEP1PrivateOnboardingKind;
  status: KEP1PrivateOnboardingStatus;
  eligibleRoles: KEP1EditorialRole[];
  expertiseDomains: KEP1ExpertiseDomain[];
  credentialCount: number;
  verifiedCredentialCount: number;
  identityVerificationStatus: "pending" | "verified" | "rejected";
  attestationsComplete: boolean;
  version: number;
  updatedAt: string;
}
