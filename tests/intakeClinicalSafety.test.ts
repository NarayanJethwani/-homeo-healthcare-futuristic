import assert from "assert";
import { evaluateIntakeClinicalSafety } from "../src/features/dashboard/application/intakeClinicalSafety";

function runIntakeClinicalSafetyTests() {
  const empty = evaluateIntakeClinicalSafety({});
  assert.strictEqual(empty.canSynthesize, false);
  assert.match(empty.missingRequirements.join(" "), /chief complaint/i);
  assert.match(empty.missingRequirements.join(" "), /red-flag/i);

  const safe = evaluateIntakeClinicalSafety({
    complaint: "Acute sore throat for two days",
    hpiAnswerCount: 2,
    medicationsStatus: "none-known",
    allergiesStatus: "none-known",
    redFlagStatus: "none",
    pregnancyStatus: "not-applicable",
  });
  assert.strictEqual(safe.canSynthesize, true);
  assert.strictEqual(safe.emergencyReferralRequired, false);

  const redFlag = evaluateIntakeClinicalSafety({
    complaint: "Sudden severe breathing difficulty",
    hpiAnswerCount: 3,
    medicationsStatus: "recorded",
    medications: "Inhaler",
    allergiesStatus: "none-known",
    redFlagStatus: "present",
    redFlagDetails: "Severe dyspnoea; emergency referral initiated",
  });
  assert.strictEqual(redFlag.canSynthesize, false);
  assert.strictEqual(redFlag.emergencyReferralRequired, true);
  assert.match(redFlag.blockingReasons.join(" "), /emergency assessment or referral/i);

  const missingRecordedDetail = evaluateIntakeClinicalSafety({
    complaint: "Acute sore throat for two days",
    hpiAnswerCount: 2,
    medicationsStatus: "recorded",
    medications: "",
    allergiesStatus: "recorded",
    allergies: "",
    redFlagStatus: "none",
  });
  assert.strictEqual(missingRecordedDetail.canSynthesize, false);
  assert.match(missingRecordedDetail.missingRequirements.join(" "), /medicine/i);
  assert.match(missingRecordedDetail.missingRequirements.join(" "), /allergy/i);

  console.log("✅ Intake clinical safety tests passed");
}

runIntakeClinicalSafetyTests();
