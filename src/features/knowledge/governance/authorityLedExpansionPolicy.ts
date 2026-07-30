import type { FastTrackAssessment } from "./fastTrackPolicy";

export type AuthorityLedReviewRequirement =
  | "background-monitoring"
  | "owner-final-authorization"
  | "owner-plus-independent-clinical-check"
  | "controlled-safety-release";

export interface AuthorityLedDecisionRequirement {
  requirement: AuthorityLedReviewRequirement;
  riskTier: "routine" | "elevated" | "critical";
  programOwnerDecisionRequired: boolean;
  independentClinicalCheckRequired: boolean;
  controlledReleaseRequired: boolean;
  aiMayPrepare: true;
  aiMayApprove: false;
  publicationAuthorityGranted: false;
  ragAuthorityGranted: false;
  explanation: string;
}

export interface AuthorityLedExpansionSummary {
  backgroundMonitoring: number;
  ownerFinalAuthorization: number;
  independentClinicalCheck: number;
  controlledSafetyRelease: number;
}

/**
 * Keeps the accountable program owner as final decision-maker while adding a
 * second human only when a clinical-risk signal makes separation material.
 */
export function getAuthorityLedDecisionRequirement(
  assessment: FastTrackAssessment
): AuthorityLedDecisionRequirement {
  if (assessment.lane === "background-monitoring") {
    return {
      requirement: "background-monitoring",
      riskTier: "routine",
      programOwnerDecisionRequired: false,
      independentClinicalCheckRequired: false,
      controlledReleaseRequired: false,
      aiMayPrepare: true,
      aiMayApprove: false,
      publicationAuthorityGranted: false,
      ragAuthorityGranted: false,
      explanation:
        "No new decision is needed while the reviewed revision remains unchanged; AI continues citation and safety monitoring.",
    };
  }

  if (assessment.lane === "blocked") {
    return {
      requirement: "controlled-safety-release",
      riskTier: "critical",
      programOwnerDecisionRequired: true,
      independentClinicalCheckRequired: true,
      controlledReleaseRequired: true,
      aiMayPrepare: true,
      aiMayApprove: false,
      publicationAuthorityGranted: false,
      ragAuthorityGranted: false,
      explanation:
        "The program owner makes the final decision after an independent clinical check, and any restoration remains subject to the separate controlled-release gate.",
    };
  }

  const elevated =
    !assessment.citationComplete ||
    assessment.flags.some(
      (flag) => flag.severity === "high" || flag.severity === "critical"
    );

  if (elevated) {
    return {
      requirement: "owner-plus-independent-clinical-check",
      riskTier: "elevated",
      programOwnerDecisionRequired: true,
      independentClinicalCheckRequired: true,
      controlledReleaseRequired: false,
      aiMayPrepare: true,
      aiMayApprove: false,
      publicationAuthorityGranted: false,
      ragAuthorityGranted: false,
      explanation:
        "AI prepares the evidence packet; one independent clinical check is required before the program owner's final authorization.",
    };
  }

  return {
    requirement: "owner-final-authorization",
    riskTier: "routine",
    programOwnerDecisionRequired: true,
    independentClinicalCheckRequired: false,
    controlledReleaseRequired: false,
    aiMayPrepare: true,
    aiMayApprove: false,
    publicationAuthorityGranted: false,
    ragAuthorityGranted: false,
    explanation:
      "The cited, low-risk revision can proceed directly to the accountable program owner's final authorization.",
  };
}

export function buildAuthorityLedExpansionSummary(
  assessments: readonly FastTrackAssessment[]
): AuthorityLedExpansionSummary {
  const summary: AuthorityLedExpansionSummary = {
    backgroundMonitoring: 0,
    ownerFinalAuthorization: 0,
    independentClinicalCheck: 0,
    controlledSafetyRelease: 0,
  };

  for (const assessment of assessments) {
    const requirement = getAuthorityLedDecisionRequirement(assessment);
    if (requirement.requirement === "background-monitoring") {
      summary.backgroundMonitoring += 1;
    } else if (requirement.requirement === "owner-final-authorization") {
      summary.ownerFinalAuthorization += 1;
    } else if (
      requirement.requirement === "owner-plus-independent-clinical-check"
    ) {
      summary.independentClinicalCheck += 1;
    } else {
      summary.controlledSafetyRelease += 1;
    }
  }

  return summary;
}
