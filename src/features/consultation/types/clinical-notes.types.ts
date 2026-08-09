/**
 * Domain Types for Phase 2 Structured Clinical Documentation
 */

export interface ChiefComplaintItem {
  id: string;
  complaint: string;
  location?: string;
  sensation?: string;
  modalityAggravation?: string;
  modalityAmelioration?: string;
  concomitant?: string;
  duration?: string;
  severity: "mild" | "moderate" | "severe" | "unbearable";
}

export interface PhysicalGenerals {
  appetite?: string;
  thirst?: "absent" | "small_quantity_frequent" | "large_quantity_infrequent" | "unquenchable" | "normal";
  cravings?: string[];
  aversions?: string[];
  sleep?: string;
  dreams?: string;
  sweat?: "profuse" | "scanty" | "offensive" | "staining" | "normal";
  bowelHabits?: string;
  urineHabits?: string;
}

export interface MentalGenerals {
  mindState?: string;
  anxieties?: string[];
  fears?: string[];
  temperament?: "irritable" | "mild_yielding" | "reserved" | "restless" | "depressed" | "obstinate";
  consolationEffect?: "aggravates" | "ameliorates" | "neutral";
  memoryIntellect?: string;
}

export type ThermalState = "hot" | "chilly" | "ambithermal";

export type MiasmaticState = "psora" | "sycosis" | "syphilis" | "tubercular" | "mixed";

export interface PatientVitals {
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRateBpm?: number;
  temperatureCelsius?: number;
  spo2Percentage?: number;
  weightKg?: number;
  heightCm?: number;
  bmiCalculated?: number;
  recordedAt?: string;
}

export interface CaseDiscussionEntry {
  id: string;
  author: string;
  noteText: string;
  createdAt: string;
}

export interface TreatmentPlan {
  primaryRemedyStrategy?: string;
  intercurrentRemedyStrategy?: string;
  potencyLadder?: string;
  heringsLawObserved?: {
    aboveToDownward?: boolean;
    insideToOutward?: boolean;
    reverseOrderOfAppearance?: boolean;
  };
  followUpIntervalDays?: number;
  caseDiscussionLogs?: CaseDiscussionEntry[];
  savedFeeSimulatorDecision?: any;
}

export interface StructuredClinicalNotes {
  chiefComplaints: ChiefComplaintItem[];
  historyOfPresentIllness: string;
  pastMedicalHistory?: string;
  familyHistory?: string;
  physicalGenerals: PhysicalGenerals;
  mentalGenerals: MentalGenerals;
  thermalState: ThermalState;
  miasmaticExpression: MiasmaticState;
  vitals: PatientVitals;
  clinicalObservations?: string;
  treatmentPlan?: TreatmentPlan;
  updatedAt: string;
}

export const DEFAULT_CLINICAL_NOTES: StructuredClinicalNotes = {
  chiefComplaints: [],
  historyOfPresentIllness: "",
  pastMedicalHistory: "",
  familyHistory: "",
  physicalGenerals: {
    appetite: "",
    thirst: "normal",
    cravings: [],
    aversions: [],
    sleep: "",
    dreams: "",
    sweat: "normal",
    bowelHabits: "",
    urineHabits: "",
  },
  mentalGenerals: {
    mindState: "",
    anxieties: [],
    fears: [],
    temperament: "mild_yielding",
    consolationEffect: "neutral",
    memoryIntellect: "",
  },
  thermalState: "ambithermal",
  miasmaticExpression: "mixed",
  vitals: {},
  clinicalObservations: "",
  updatedAt: "",
};
