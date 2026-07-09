"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const feedbackModel_1 = require("../liveMode/feedbackModel");
const payload = {
    mode: "compare",
    decision: "v2_better",
    query: "flatulence",
    note: "V2 found a useful synonym match.",
};
assert_1.default.strictEqual((0, feedbackModel_1.isValidV2FeedbackPayload)(payload), true);
assert_1.default.strictEqual((0, feedbackModel_1.isValidV2FeedbackPayload)({ ...payload, decision: "prescribe_now" }), false);
const document = (0, feedbackModel_1.createV2ClinicalFeedbackDocument)(payload, {
    uid: "doctor-1",
    email: "doctor@example.com",
    role: "doctor",
    name: "Doctor",
}, "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(document.safety.autoPrescribed, false);
assert_1.default.strictEqual(document.safety.patientRecordModified, false);
assert_1.default.strictEqual(document.safety.clinicianReviewed, true);
console.log("v2FeedbackModel.test.ts passed");
