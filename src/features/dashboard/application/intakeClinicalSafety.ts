export const MIN_INTAKE_COMPLAINT_CHARACTERS = 10;
export const MIN_INTAKE_HPI_ANSWERS = 2;

export type IntakeReviewStatus = "not-reviewed" | "none-known" | "recorded";
export type IntakeRedFlagStatus = "not-screened" | "none" | "present";
export type IntakePregnancyStatus =
  | "not-applicable"
  | "not-assessed"
  | "not-pregnant"
  | "pregnant"
  | "lactating";

export interface IntakeClinicalSafetyInput {
  complaint?: string;
  hpiAnswerCount?: number;
  medicationsStatus?: IntakeReviewStatus;
  medications?: string;
  allergiesStatus?: IntakeReviewStatus;
  allergies?: string;
  redFlagStatus?: IntakeRedFlagStatus;
  redFlagDetails?: string;
  pregnancyStatus?: IntakePregnancyStatus;
}

export interface IntakeClinicalSafetyAssessment {
  canSynthesize: boolean;
  emergencyReferralRequired: boolean;
  missingRequirements: string[];
  blockingReasons: string[];
}

export function evaluateIntakeClinicalSafety(
  input: IntakeClinicalSafetyInput,
): IntakeClinicalSafetyAssessment {
  const complaint = input.complaint?.trim() || "";
  const hpiAnswerCount = Math.max(0, Number(input.hpiAnswerCount || 0));
  const missingRequirements: string[] = [];
  const blockingReasons: string[] = [];

  if (complaint.length < MIN_INTAKE_COMPLAINT_CHARACTERS) {
    missingRequirements.push(
      `Chief complaint must contain at least ${MIN_INTAKE_COMPLAINT_CHARACTERS} meaningful characters.`,
    );
  }
  if (hpiAnswerCount < MIN_INTAKE_HPI_ANSWERS) {
    missingRequirements.push(
      `Record at least ${MIN_INTAKE_HPI_ANSWERS} history-of-present-illness answers.`,
    );
  }
  if (!input.medicationsStatus || input.medicationsStatus === "not-reviewed") {
    missingRequirements.push("Review current medicines and ongoing conventional treatment.");
  } else if (input.medicationsStatus === "recorded" && (input.medications?.trim().length || 0) < 2) {
    missingRequirements.push("Record the current medicine or conventional treatment details.");
  }
  if (!input.allergiesStatus || input.allergiesStatus === "not-reviewed") {
    missingRequirements.push("Review medicine, substance, and treatment allergies.");
  } else if (input.allergiesStatus === "recorded" && (input.allergies?.trim().length || 0) < 2) {
    missingRequirements.push("Record the allergy and reaction details.");
  }
  if (!input.redFlagStatus || input.redFlagStatus === "not-screened") {
    missingRequirements.push("Complete the urgent red-flag screen.");
  }

  const emergencyReferralRequired = input.redFlagStatus === "present";
  if (emergencyReferralRequired) {
    blockingReasons.push(
      "Urgent red flags are present. Stop complementary-care synthesis and complete emergency assessment or referral first.",
    );
    if ((input.redFlagDetails?.trim().length || 0) < 5) {
      blockingReasons.push("Document the red flag and the escalation action taken.");
    }
  }

  return {
    canSynthesize: missingRequirements.length === 0 && blockingReasons.length === 0,
    emergencyReferralRequired,
    missingRequirements,
    blockingReasons,
  };
}
