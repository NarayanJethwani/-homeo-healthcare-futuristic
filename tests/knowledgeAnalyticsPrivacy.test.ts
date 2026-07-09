import assert from "assert";
import { redactSensitiveSearchQuery, normalizeQuery } from "../src/features/knowledge/analytics/knowledgeSearchAnalytics";
import { trackClinicalOsKnowledgeUsage, getEntityOsUsageCounts, clearClinicalOsUsageCache } from "../src/features/knowledge/analytics/clinicalOsKnowledgeUsage";

function runTests() {
  console.log("🚀 Starting Privacy & PHI Redaction Test Suite...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ TEST PASSED: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ TEST FAILED: ${name}`);
      console.error(err.stack || err);
      failed++;
    }
  }

  // 1. Email Redaction
  test("Redacts email addresses in query string", () => {
    const raw = "GERD treatments sent to narayan@homeo.healthcare";
    assert.strictEqual(redactSensitiveSearchQuery(raw), "[redacted-sensitive-query]");
  });

  // 2. Phone Redaction
  test("Redacts phone numbers in various formats", () => {
    assert.strictEqual(redactSensitiveSearchQuery("Bloating remedies (555) 123-4567"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("migraine help 555.123.4567"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("asthma 5551234567"), "[redacted-sensitive-query]");
  });

  // 3. DOB Redaction
  test("Redacts Date of Birth and general date strings", () => {
    assert.strictEqual(redactSensitiveSearchQuery("born 10/12/1984 eczema"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("IBS patient dob 1984-12-10"), "[redacted-sensitive-query]");
  });

  // 4. Address-like Redaction
  test("Redacts addresses and ZIP codes", () => {
    assert.strictEqual(redactSensitiveSearchQuery("Sulphur supplier at 123 Main Street NY"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("acne clinic zip 90210"), "[redacted-sensitive-query]");
  });

  // 5. Case Number Redaction
  test("Redacts case files and patient record tags", () => {
    assert.strictEqual(redactSensitiveSearchQuery("acid reflux Kent case #4321"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("Lycopodium patient 90123"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("chart no 11234 allergy"), "[redacted-sensitive-query]");
  });

  // 6. Patient-name-like Redaction
  test("Redacts name patterns indicating individual patient identification", () => {
    assert.strictEqual(redactSensitiveSearchQuery("treatment plan for Mr. Narayan Jethwani"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("Dr. Patel's custom mix for headache"), "[redacted-sensitive-query]");
  });

  // 7. Long Clinical Note Redaction
  test("Redacts long clinical note logs or copy-pasted medical reports", () => {
    const raw = "Patient presents with severe hyperacidity, epigastric pain radiating to back, worse after meals, relieved by warm drinks. Recommended Nux vomica constitutional curation.";
    assert.strictEqual(redactSensitiveSearchQuery(raw), "[redacted-sensitive-query]");
  });

  // 8. Prescription-style Note Redaction
  test("Redacts prescription potencies and dosing guidelines", () => {
    assert.strictEqual(redactSensitiveSearchQuery("Sulphur 30C qd dosage"), "[redacted-sensitive-query]");
    assert.strictEqual(redactSensitiveSearchQuery("Arnica 200c drops twice daily"), "[redacted-sensitive-query]");
  });

  // 9. Mixed safe + unsafe query
  test("Redacts mixed queries containing both safe terms and PII", () => {
    assert.strictEqual(redactSensitiveSearchQuery("GERD research study contact 555-0199"), "[redacted-sensitive-query]");
  });

  // 10. Raw unsafe query is never returned as normalized query
  test("Normalization strips raw text if query is flagged unsafe", () => {
    const raw = "Nux Vomica potency 30c twice daily";
    assert.strictEqual(normalizeQuery(raw), "[redacted-sensitive-query]");
  });

  // 11. Safe query remains usable
  test("Preserves safe query strings", () => {
    assert.strictEqual(normalizeQuery("  Nux Vomica  "), "nux vomica");
    assert.strictEqual(normalizeQuery("Acid Reflux symptoms"), "acid reflux symptoms");
  });

  // 12. Clinical OS Telemetry Safety
  test("Clinical OS Telemetry aggregate metrics track safely", () => {
    clearClinicalOsUsageCache();
    
    // Log safe remedy hovers
    const ok1 = trackClinicalOsKnowledgeUsage({
      entityId: "sulphur",
      entityType: "remedy",
      action: "hover"
    });
    assert.strictEqual(ok1, true);

    const ok2 = trackClinicalOsKnowledgeUsage({
      entityId: "sulphur",
      entityType: "remedy",
      action: "click"
    });
    assert.strictEqual(ok2, true);

    const counts = getEntityOsUsageCounts("sulphur");
    assert.strictEqual(counts.views, 1);
    assert.strictEqual(counts.hovers, 1);
  });

  console.log(`\n🎉 Privacy & Redaction Tests Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
