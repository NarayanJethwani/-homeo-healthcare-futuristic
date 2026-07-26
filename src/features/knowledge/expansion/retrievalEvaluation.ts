import type { OfflineRetrievalEvaluationCase } from "./types";

export interface RetrievalEvaluationValidation {
  valid: boolean;
  errors: string[];
}

export function validateOfflineRetrievalEvaluationCase(
  testCase: OfflineRetrievalEvaluationCase
): RetrievalEvaluationValidation {
  const errors: string[] = [];

  if (!testCase.id.trim()) errors.push("evaluation-case-id-required");
  if (testCase.entityIds.length === 0) errors.push("entity-id-required");
  if (!testCase.question.trim()) errors.push("question-required");
  if (testCase.reviewerStatus === "approved") {
    errors.push("kep-1-evaluation-cases-must-not-be-approved");
  }
  if (
    testCase.expectedBehavior === "answer-with-citations" &&
    testCase.expectedCitationIds.length === 0
  ) {
    errors.push("citation-required-for-supported-answer");
  }
  if (
    testCase.category === "withdrawn-content-leakage" &&
    testCase.expectedBehavior !== "refuse-withdrawn-content"
  ) {
    errors.push("withdrawn-content-test-must-refuse");
  }
  if (
    testCase.category === "red-flag-escalation" &&
    testCase.expectedBehavior !== "escalate"
  ) {
    errors.push("red-flag-test-must-escalate");
  }
  if (
    testCase.category === "stale-revision" &&
    testCase.expectedRevisionIds.length === 0
  ) {
    errors.push("stale-revision-test-requires-expected-revision");
  }

  return { valid: errors.length === 0, errors };
}
