import assert from "assert";
import { checkPrescriptionSafety } from "../src/lib/clinicalDecisionSupport";
import { ragService } from "../src/lib/ragService";
import { aiRouterService } from "../src/lib/aiRouter";

async function runTests() {
  console.log("🚀 Starting Clinical Portal Suite E2E Regression Tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
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

  // ==========================================
  // 1. Prescription Safety Engine Tests
  // ==========================================
  test("checkPrescriptionSafety - Silicea with pacemaker implant contraindication", () => {
    const res = checkPrescriptionSafety("Silicea", ["Patient has pacemaker installed in 2024"], []);
    assert.strictEqual(res.isSafe, false);
    assert.ok(res.warnings.some(w => w.includes("Foreign Body Expulsion Hazard")));
  });

  test("checkPrescriptionSafety - Silicea safe when no implants exist", () => {
    const res = checkPrescriptionSafety("Silicea", ["Patient has atopic dermatitis and joint stiffness"], []);
    assert.strictEqual(res.isSafe, true);
    assert.strictEqual(res.warnings.length, 0);
  });

  test("checkPrescriptionSafety - Antagonistic (inimical) pair Sulphur & Sepia", () => {
    const res = checkPrescriptionSafety("Sepia", [], ["Sulphur 200C"]);
    assert.strictEqual(res.isSafe, false);
    assert.ok(res.warnings.some(w => w.includes("Antagonistic Pair")));
  });

  test("checkPrescriptionSafety - Safe combination Lycopodium & Sulphur", () => {
    const res = checkPrescriptionSafety("Lycopodium", [], ["Sulphur 30C"]);
    assert.strictEqual(res.isSafe, true);
    assert.strictEqual(res.warnings.length, 0);
  });

  // ==========================================
  // 2. AI Routing Task Classification Tests
  // ==========================================
  test("aiRouterService - Classify coding task query", () => {
    const cat = aiRouterService.classifyTask("write a python script to parse intake notes");
    assert.strictEqual(cat, "coding");
  });

  test("aiRouterService - Classify FAQ query", () => {
    const cat = aiRouterService.classifyTask("how long does homeopathic treatment take to show results?");
    assert.strictEqual(cat, "faq");
  });

  test("aiRouterService - Classify medical reasoning query", () => {
    const cat = aiRouterService.classifyTask("explain the pathophysiological mechanism of HPA axis dysregulation");
    assert.strictEqual(cat, "reasoning");
  });

  // ==========================================
  // 3. RAG Grounding Search Tests
  // ==========================================
  console.log("\n🔍 Running RAG Knowledge Base Hybrid Search tests...");
  try {
    const searchResults = await ragService.hybridSearch("Like cures like");
    const topDoc = searchResults[0];
    test("ragService - Hybrid search matches Law of Similars", () => {
      assert.ok(topDoc.document.title.includes("The Law of Similars"));
      assert.ok(topDoc.score >= 0.70);
    });
  } catch (err: any) {
    console.error("❌ RAG Search test failed: ", err.message);
    failed++;
  }

  try {
    const searchResults = await ragService.hybridSearch("who founded homeo healthcare");
    const topDoc = searchResults[0];
    test("ragService - Hybrid search matches Dr. Narayan Jethwani", () => {
      assert.ok(topDoc.document.title.includes("Philosophy"));
      assert.ok(topDoc.document.content.includes("Narayan Jethwani"));
    });
  } catch (err: any) {
    console.error("❌ RAG Search test failed: ", err.message);
    failed++;
  }

  // ==========================================
  // 4. Summarize Results
  // ==========================================
  console.log(`\n🎉 Test Run Completed. Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(err => {
  console.error("Fatal Test Failure: ", err);
  process.exit(1);
});
