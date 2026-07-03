import assert from "assert";
import { normalizeRemedyId, remedyIdsMatch } from "../engine/remedyNormalizer";
import { getRemedyGradeWeight, normalizeRemedyGrade } from "../engine/canonicalTypes";

assert.strictEqual(normalizeRemedyId("Nux Vomica"), "Nux-v");
assert.strictEqual(normalizeRemedyId(" nux-v "), "Nux-v");
assert.strictEqual(normalizeRemedyId("Arsenicum Album"), "Ars");
assert.strictEqual(normalizeRemedyId("Sulfur"), "Sulph");
assert.strictEqual(normalizeRemedyId("Unknown Remedy"), "Unknown Remedy");
assert.strictEqual(normalizeRemedyId(null), "");

assert.strictEqual(remedyIdsMatch("Nux Vomica", "Nux-v"), true);
assert.strictEqual(remedyIdsMatch("Sulfur", "Sulph"), true);
assert.strictEqual(remedyIdsMatch("Sulph", "Ars"), false);

assert.strictEqual(normalizeRemedyGrade(-1), 0);
assert.strictEqual(normalizeRemedyGrade(2.4), 2);
assert.strictEqual(normalizeRemedyGrade(4.9), 4);
assert.strictEqual(normalizeRemedyGrade("3"), 3);
assert.strictEqual(normalizeRemedyGrade("not-a-grade"), 0);
assert.strictEqual(getRemedyGradeWeight(3), 3);

console.log("remedyNormalizer.test.ts passed");

