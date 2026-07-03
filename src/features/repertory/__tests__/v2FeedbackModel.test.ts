import assert from "assert";
import { createV2ClinicalFeedbackDocument, isValidV2FeedbackPayload } from "../liveMode/feedbackModel";

const payload = {
  mode: "compare" as const,
  decision: "v2_better" as const,
  query: "flatulence",
  note: "V2 found a useful synonym match.",
};

assert.strictEqual(isValidV2FeedbackPayload(payload), true);
assert.strictEqual(isValidV2FeedbackPayload({ ...payload, decision: "prescribe_now" }), false);

const document = createV2ClinicalFeedbackDocument(payload, {
  uid: "doctor-1",
  email: "doctor@example.com",
  role: "doctor",
  name: "Doctor",
}, "2026-07-03T00:00:00.000Z");

assert.strictEqual(document.safety.autoPrescribed, false);
assert.strictEqual(document.safety.patientRecordModified, false);
assert.strictEqual(document.safety.clinicianReviewed, true);

console.log("v2FeedbackModel.test.ts passed");
