import assert from "node:assert/strict";
import {
  buildAuthorityLedExpansionSummary,
  getAuthorityLedDecisionRequirement,
} from "../src/features/knowledge/governance/authorityLedExpansionPolicy";
import type { FastTrackAssessment } from "../src/features/knowledge/governance/fastTrackPolicy";

function assessment(
  overrides: Partial<FastTrackAssessment> = {}
): FastTrackAssessment {
  return {
    entityId: "D-AUTHORITY-001",
    title: "Authority-led test",
    entityType: "disease",
    lane: "human-review",
    isNewOrUnverified: true,
    citationCount: 2,
    citationComplete: true,
    flags: [],
    recommendation: "Review.",
    ...overrides,
  };
}

const routine = getAuthorityLedDecisionRequirement(assessment());
assert.equal(routine.requirement, "owner-final-authorization");
assert.equal(routine.programOwnerDecisionRequired, true);
assert.equal(routine.independentClinicalCheckRequired, false);
assert.equal(routine.aiMayApprove, false);

const elevated = getAuthorityLedDecisionRequirement(
  assessment({
    flags: [
      {
        code: "DIAGNOSTIC_CERTAINTY_REVIEW",
        severity: "high",
        message: "Review diagnostic certainty.",
      },
    ],
  })
);
assert.equal(
  elevated.requirement,
  "owner-plus-independent-clinical-check"
);
assert.equal(elevated.independentClinicalCheckRequired, true);
assert.equal(elevated.controlledReleaseRequired, false);

const uncited = getAuthorityLedDecisionRequirement(
  assessment({ citationCount: 0, citationComplete: false })
);
assert.equal(
  uncited.requirement,
  "owner-plus-independent-clinical-check"
);

const critical = getAuthorityLedDecisionRequirement(
  assessment({
    lane: "blocked",
    flags: [
      {
        code: "PROHIBITED_MEDICAL_CLAIM",
        severity: "critical",
        message: "Unsafe claim.",
      },
    ],
  })
);
assert.equal(critical.requirement, "controlled-safety-release");
assert.equal(critical.programOwnerDecisionRequired, true);
assert.equal(critical.independentClinicalCheckRequired, true);
assert.equal(critical.controlledReleaseRequired, true);
assert.equal(critical.publicationAuthorityGranted, false);
assert.equal(critical.ragAuthorityGranted, false);

const monitoring = getAuthorityLedDecisionRequirement(
  assessment({
    lane: "background-monitoring",
    isNewOrUnverified: false,
  })
);
assert.equal(monitoring.requirement, "background-monitoring");
assert.equal(monitoring.programOwnerDecisionRequired, false);

const summary = buildAuthorityLedExpansionSummary([
  assessment(),
  assessment({
    entityId: "D-AUTHORITY-002",
    citationComplete: false,
  }),
  assessment({
    entityId: "D-AUTHORITY-003",
    lane: "blocked",
  }),
  assessment({
    entityId: "D-AUTHORITY-004",
    lane: "background-monitoring",
    isNewOrUnverified: false,
  }),
]);
assert.deepEqual(summary, {
  backgroundMonitoring: 1,
  ownerFinalAuthorization: 1,
  independentClinicalCheck: 1,
  controlledSafetyRelease: 1,
});

console.log(
  "knowledgeAuthorityLedExpansionPolicy.test.ts: all assertions passed"
);
