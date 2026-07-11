import { OrganizationScopedEntity } from "../../../shared/domain/entities";

export type AllergyCategory = "medication" | "food" | "environment" | "biologic" | "other";
export type AllergyCriticality = "low" | "high" | "unknown";
export type AllergyVerificationStatus = "confirmed" | "unconfirmed" | "refuted" | "entered_in_error";

export interface AllergyIntolerance extends OrganizationScopedEntity {
  patientId: string;
  substanceConceptId?: string; // Reference to global clinicalConcepts table
  substanceText: string;
  category: AllergyCategory;
  criticality?: AllergyCriticality;
  verificationStatus: AllergyVerificationStatus;
  reactionDescriptions: string[];
  onsetDate?: string;
  notes?: string;
  provenance: {
    createdBy: string;
    createdAt: string;
    sourceType: "clinician" | "patient" | "caregiver";
  };
}
