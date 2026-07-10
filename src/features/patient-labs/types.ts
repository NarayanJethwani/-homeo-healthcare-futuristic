export type LabReviewStatus =
  | "pending-review"
  | "clinician-confirmed"
  | "corrected"
  | "rejected";

export interface ReviewedLabResult {
  id: string;
  patientId: string;
  attachmentId: string;
  sourceParameterId: string;
  testName: string;
  normalizedTestName: string;
  value: string;
  numericValue?: number;
  unit?: string;
  referenceRange?: string;
  flag: "low" | "normal" | "high" | "critical" | "unknown";
  reviewStatus: LabReviewStatus;
  originalExtractedValue?: string;
  correctedValue?: string;
  confirmedBy: string;
  confirmedAt: string;
  createdAt: string;
  updatedAt: string;
  observedAt?: string;
  sampleCollectedAt?: string;
}

export interface PatientLabTimelineEntry {
  id: string;
  patientId: string;
  testName: string;
  value: string;
  numericValue?: number;
  unit?: string;
  flag: string;
  date: string; // confirmedAt for V2.13
  sourceAttachmentId: string;
  reviewStatus: LabReviewStatus;
  referenceRange?: string;
}
