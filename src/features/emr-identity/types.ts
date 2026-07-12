export type PatientIdentityStatus =
  | "verified"
  | "possible-duplicate"
  | "merge-review"
  | "archived";

export type PatientIdentityMatchMethod =
  | "exact-id"
  | "uhid"
  | "reviewed-demographic-match";

export interface CanonicalPatientIdentity {
  canonicalPatientId: string;
  organizationId: string;
  clinicId?: string;
  uhid: string;
  sourcePatientIds: string[];
  identityStatus: PatientIdentityStatus;
  schemaVersion: 1;
  projectionVersion: number;
  projectedAt: string;
}

export interface PatientIdentityMapping {
  mappingId: string;
  canonicalPatientId: string;
  sourceSystem: string;
  sourcePatientId: string;
  organizationId: string;
  matchMethod: PatientIdentityMatchMethod;
  reviewStatus: "automatic" | "pending-review" | "approved" | "rejected";
  createdBy: string;
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface PatientIdentityCandidate {
  sourceSystem: string;
  sourcePatientId: string;
  organizationId?: string;
  clinicId?: string;
  uhid?: string;
  name?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
}

export type PatientReconciliationIssueCode =
  | "missing-organization"
  | "missing-canonical-id"
  | "duplicate-source-id"
  | "duplicate-uhid"
  | "possible-demographic-duplicate";

export interface PatientReconciliationIssue {
  code: PatientReconciliationIssueCode;
  severity: "blocking" | "review";
  candidateKeys: string[];
  explanation: string;
}

export interface PatientReconciliationReport {
  mode: "dry-run";
  generatedAt: string;
  scannedCount: number;
  eligibleExactMappings: number;
  writeCount: 0;
  issues: PatientReconciliationIssue[];
}

export interface PatientLinkedRecordReference {
  collection: string;
  recordId: string;
  patientId?: string;
}

export interface PatientPortalLinkReference {
  userId: string;
  patientId?: string;
}

export interface PatientIdentityInventoryReport {
  mode: "read-only-inventory";
  generatedAt: string;
  patientCount: number;
  portalLinkCount: number;
  invalidPortalLinkCount: number;
  linkedRecordCount: number;
  orphanedLinkedRecordCount: number;
  linkedRecordCountsByCollection: Record<string, number>;
  orphanedRecordCountsByCollection: Record<string, number>;
  truncatedCollections: string[];
  reconciliation: PatientReconciliationReport;
  writeCount: 0;
}
