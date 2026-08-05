import assert from "assert";
import { evaluateClinicalSafety } from "../../src/features/consultation/services/clinicalRedFlagEngine";

async function runClinicalSafetyTests() {
  // Test 1: Clear Symptoms (no red flags)
  const safeResult = evaluateClinicalSafety(["mild headache", "chronic dyspepsia"]);
  assert.strictEqual(safeResult.status, "clear");
  assert.strictEqual(safeResult.triggeredRules.length, 0);

  // Test 2: Emergency Red Flag Trigger (Chest Pain)
  const emergencyResult = evaluateClinicalSafety(["crushing chest pain", "radiating to jaw"]);
  assert.strictEqual(emergencyResult.status, "emergency");
  assert.ok(emergencyResult.triggeredRules.length >= 1);
  assert.strictEqual(emergencyResult.triggeredRules[0].category, "cardiovascular");
  assert.ok(emergencyResult.triggeredRules[0].recommendedAction.includes("emergency transfer"));

  // Test 3: Emergency Red Flag Trigger (Anaphylaxis)
  const anaphylaxisResult = evaluateClinicalSafety(["anaphylaxis", "laryngeal edema"]);
  assert.strictEqual(anaphylaxisResult.status, "emergency");
  assert.strictEqual(anaphylaxisResult.triggeredRules[0].category, "anaphylactic");

  console.log("✅ Governed Clinical Red-Flag Safety unit tests passed.");
}

runClinicalSafetyTests();
