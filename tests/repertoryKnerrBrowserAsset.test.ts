import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  KNERR_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
  type Rubric,
} from "../src/lib/repertoryData";

const assetPath = path.join(process.cwd(), "public", "data", "knerrHeringRepertoryData.json");
const knerr = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const occurrenceCount = knerr.reduce((sum, rubric) => sum + Object.keys(rubric.remedies).length, 0);
const grades = new Set(knerr.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(knerr.length >= 20_000);
assert.ok(occurrenceCount >= 145_000);
assert.strictEqual(new Set(knerr.map((rubric) => rubric.id)).size, knerr.length);
assert.strictEqual(new Set(knerr.map((rubric) => rubric.chapter)).size, 48);
assert.ok(knerr.every((rubric) => rubric.source === "knerr"));
assert.ok(knerr.every((rubric) => rubric.scoringEnabled === true));
assert.ok(knerr.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(knerr.every((rubric) => /Knerr.+1896.+p\. \d+/.test(rubric.citation || "")));
assert.ok(knerr.every((rubric) => Object.values(rubric.remedies).every((grade) => grade >= 1 && grade <= 5)));
assert.deepStrictEqual(Array.from(grades).sort(), [1, 2, 3, 4, 5]);

const anger = knerr.find((rubric) => rubric.name === "Anger");
assert.ok(anger);
assert.strictEqual(anger?.chapter, "Mind and disposition");
assert.strictEqual(anger?.remedies.Agar, 1);
assert.strictEqual(anger?.remedies.Acon, 2);
assert.strictEqual(anger?.remedies["Aur-m"], 3);
assert.strictEqual(anger?.remedies.Bry, 5);
assert.strictEqual(anger?.remedies.Calc, 2);

setRepertoryData([], [], [], [], knerr);
assert.strictEqual(getRepertoryData("knerr").length, knerr.length);
assert.strictEqual(getRepertoryData("combined").length, knerr.length);
assert.strictEqual(KNERR_CHAPTERS.length, 48);
assert.ok(getRepertoryData("knerr").every((rubric) => rubric.scoringEnabled === true));

console.log("Knerr–Hering 1896 browser asset tests passed.");
