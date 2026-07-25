import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  BOENNINGHAUSEN_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
  type Rubric,
} from "../src/lib/repertoryData";

const assetPath = path.join(
  process.cwd(),
  "public",
  "data",
  "boenninghausenTherapeuticPocketBookData.json",
);
const pocketBook = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const occurrenceCount = pocketBook.reduce(
  (sum, rubric) => sum + Object.keys(rubric.remedies).length,
  0,
);
const grades = new Set(pocketBook.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(pocketBook.length >= 2_300);
assert.ok(occurrenceCount >= 80_000);
assert.strictEqual(new Set(pocketBook.map((rubric) => rubric.id)).size, pocketBook.length);
assert.strictEqual(new Set(pocketBook.map((rubric) => rubric.chapter)).size, 6);
assert.ok(pocketBook.every((rubric) => rubric.source === "boenninghausen"));
assert.ok(pocketBook.every((rubric) => rubric.scoringEnabled === true));
assert.ok(pocketBook.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(pocketBook.every((rubric) => /Bönninghausen.+1846.+1847.+source scan \d+/.test(rubric.citation || "")));
assert.ok(pocketBook.every((rubric) =>
  Object.values(rubric.remedies).every((grade) => grade >= 1 && grade <= 5)
));
assert.deepStrictEqual(Array.from(grades).sort(), [1, 2, 3, 4, 5]);

// Rubric headings are reconciled against two independent scans of the 1847
// Hempel edition. Running page headers must never surface as selectable rubrics.
const inTheMorning = pocketBook.find((rubric) => rubric.name === "In the morning");
assert.ok(inTheMorning);
assert.strictEqual(
  inTheMorning?.id,
  "boenninghausen-scan-292-alterations-of-the-state-of-health-f-at-morning-1847",
);
assert.strictEqual(Object.keys(inTheMorning?.remedies || {}).length, 106);
assert.strictEqual(inTheMorning?.remedies.Acon, 4);
assert.strictEqual(inTheMorning?.remedies["Am-m"], 5);

for (const heading of [
  "Vanishing of sight",
  "Bloody",
  "Dark",
  "Blood-vessels, burning sensation in the",
  "pulsations of the",
  "after cutting the",
  "without husks",
  "From sucking the gums",
  "From the sun burning",
  "Warm, the air being",
]) {
  assert.ok(pocketBook.some((rubric) => rubric.name === heading), `Missing corrected heading: ${heading}`);
}

const severeOcrArtifact = /^f at|Duriag|\b(?:tlic|tlie|tfhc)\b|ni£ht|witBi|siSent|llae|saaaa|PBVBIt|WAiioN|[§£©€■•]/i;
assert.ok(pocketBook.every((rubric) => !severeOcrArtifact.test(rubric.name)));
assert.ok(pocketBook.every((rubric) =>
  !/(?:SENSATIONS?|AGGRAVATION ACCORDING TO|AMELIORATION)\D*\d/i.test(rubric.name)
));

// This is the grading example Bönninghausen gives in his own preface.
const covetousness = pocketBook.find((rubric) => rubric.name === "Covetousness");
assert.ok(covetousness);
assert.strictEqual(covetousness?.chapter, "Mind & Soul");
assert.strictEqual(covetousness?.remedies.Puls, 5);
assert.strictEqual(covetousness?.remedies.Ars, 4);
assert.strictEqual(covetousness?.remedies.Lyc, 4);
assert.strictEqual(covetousness?.remedies["Nat-c"], 3);
assert.strictEqual(covetousness?.remedies.Sep, 3);
assert.strictEqual(covetousness?.remedies.Calc, 2);

setRepertoryData([], [], [], [], [], pocketBook);
assert.strictEqual(getRepertoryData("boenninghausen").length, pocketBook.length);
assert.strictEqual(getRepertoryData("combined").length, pocketBook.length);
assert.strictEqual(BOENNINGHAUSEN_CHAPTERS.length, 6);
assert.ok(getRepertoryData("boenninghausen").every((rubric) => rubric.scoringEnabled === true));

console.log("Bönninghausen Therapeutic Pocket Book browser asset tests passed.");
