import { OrganizationScopedEntity } from "../../../shared/domain/entities";

export type ConsentType = "privacy" | "telemedicine" | "ai_processing" | "research" | "communication";
export type CaptureMethod = "digital_signature" | "verbal_witnessed" | "paper_scanned";

export interface PatientConsent extends OrganizationScopedEntity {
  patientId: string;
  consentType: ConsentType;
  granted: boolean;
  policyVersion: string;
  language: string;
  capturedBy: string; // Practitioner ID
  captureMethod: CaptureMethod;
  documentReferenceUrl?: string; // Optional link to physical signed form
  effectiveDate: string;
  expiryDate?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  auditMetadata: {
    ipAddress?: string;
    userAgent?: string;
  };
  notes?: string;
}
