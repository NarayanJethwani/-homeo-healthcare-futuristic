"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createV2ClinicalFeedbackDocument = createV2ClinicalFeedbackDocument;
exports.isValidV2FeedbackPayload = isValidV2FeedbackPayload;
function createV2ClinicalFeedbackDocument(payload, reviewer, createdAt = new Date().toISOString()) {
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
function isValidV2FeedbackPayload(value) {
    if (!value || typeof value !== "object")
        return false;
    const payload = value;
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
