import { ClinicScopedEntity } from "../../../shared/domain/entities";

export type PatientGender = "male" | "female" | "other" | "unknown";

export interface PatientDemographics {
  name: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup?: string;
  phone: string;
  email: string;
  address: string;
  occupation?: string;
  education?: string;
  lifestyleDetails?: {
    dietType?: string;
    exerciseHabits?: string;
    sleepDurationHrs?: number;
    substanceUse?: string[];
  };
  insuranceDetails?: {
    providerName?: string;
    policyNumber?: string;
    expiryDate?: string;
  };
  referringDoctor?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Patient extends ClinicScopedEntity, PatientDemographics {
  uhid: string;
  isActive: boolean;
}
