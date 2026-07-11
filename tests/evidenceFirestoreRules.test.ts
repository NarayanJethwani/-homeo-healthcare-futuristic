import assert from "assert";
import fs from "fs";
import path from "path";

async function runEvidenceFirestoreRulesTests() {
  console.log("🚀 Running Firestore Rules verification tests...");
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ ${name}`);
      console.error(e.stack || e);
      failed++;
    }
  }

  test("Confirm firestore.rules blocks direct client writes to cms_drafts", () => {
    const rulesPath = path.join(__dirname, "../firestore.rules");
    const rulesContent = fs.readFileSync(rulesPath, "utf8");

    const draftsMatch = /match\s+\/cms_drafts\/\{draftId\}\s*\{[\s\S]*?allow\s+write:\s*if\s+false\s*;/i.test(rulesContent);
    assert.strictEqual(draftsMatch, true, "firestore.rules must block direct client writes to cms_drafts");
  });

  test("Confirm firestore.rules blocks direct client writes to cms_versions", () => {
    const rulesPath = path.join(__dirname, "../firestore.rules");
    const rulesContent = fs.readFileSync(rulesPath, "utf8");

    const versionsMatch = /match\s+\/cms_versions\/\{versionId\}\s*\{[\s\S]*?allow\s+write:\s*if\s+false\s*;/i.test(rulesContent);
    assert.strictEqual(versionsMatch, true, "firestore.rules must block direct client writes to cms_versions");
  });

  if (failed > 0) {
    process.exit(1);
  }
}

runEvidenceFirestoreRulesTests().catch(e => {
  console.error(e);
  process.exit(1);
});
