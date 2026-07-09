import { V2ClinicalFeedbackPayload } from "./types";

export interface V2ClinicalFeedbackDocument extends V2ClinicalFeedbackPayload {
  createdAt: string;
  reviewer: {
    uid: string;
    email?: string | null;
    role: string;
    name?: string;
  };
  safety: {
    clinicianReviewed: boolean;
    autoPrescribed: false;
    patientRecordModified: false;
  };
}

export function createV2ClinicalFeedbackDocument(
  payload: V2ClinicalFeedbackPayload,
  reviewer: V2ClinicalFeedbackDocument["reviewer"],
  createdAt = new Date().toISOString(),
): V2ClinicalFeedbackDocument {
  return {
    ...payload,
    createdAt,
    reviewer,
    safety: {
      clinicianReviewed: true,
      autoPrescribed: false,
      patientRecordModified: false,
    },
  };
}

export function isValidV2FeedbackPayload(value: unknown): value is V2ClinicalFeedbackPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as V2ClinicalFeedbackPayload;
  const validModes = new Set(["compare", "v2-live"]);
  const validDecisions = new Set([
    "v2_better",
    "v1_better",
    "both_acceptable",
    "v2_missed_important_rubric",
    "v2_found_useful_rubric",
    "needs_correction",
    "clinical_note",
  ]);

  return validModes.has(payload.mode)
    && validDecisions.has(payload.decision)
    && typeof payload.query === "string";
}
