export type AttachmentType =
  | "lab-report"
  | "prescription"
  | "imaging-report"
  | "discharge-summary"
  | "case-note"
  | "consent-form"
  | "other";

export type AttachmentStatus =
  | "uploaded"
  | "processing"
  | "processed"
  | "extraction-failed"
  | "review-required"
  | "archived"
  | "deleted";

export type ExtractionStatus =
  | "not-started"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "requires-clinician-review";

export interface PatientAttachment {
  id: string;
  patientId: string;
  uploadedBy: string;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  type: AttachmentType;
  status: AttachmentStatus;
  extractionStatus: ExtractionStatus;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  deletedAt?: string;
  notes?: string;
  source?: "clinician-upload" | "patient-upload" | "import";
}

export interface ExtractedLabParameter {
  id: string;
  attachmentId: string;
  patientId: string;
  testName: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  flag?: "low" | "normal" | "high" | "critical" | "unknown";
  confidence?: number;
  extractedFromText?: string;
  reviewStatus: "pending-review" | "clinician-confirmed" | "corrected" | "rejected";
  originalValue?: string;
  originalUnit?: string;
  originalFlag?: "low" | "normal" | "high" | "critical" | "unknown";
  createdAt: string;
  updatedAt: string;
}
