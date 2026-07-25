import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { Rubric } from "../src/lib/repertoryData";

const assetPath = path.join(
  process.cwd(),
  "public",
  "data",
  "bogerSynopticKeyRepertoryData.json",
);
const synoptic = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const remedyOccurrences = synoptic.reduce(
  (total, rubric) => total + Object.keys(rubric.remedies).length,
  0,
);
const grades = new Set(synoptic.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(synoptic.length >= 2_750);
assert.ok(remedyOccurrences >= 20_000);
assert.strictEqual(new Set(synoptic.map((rubric) => rubric.id)).size, synoptic.length);
assert.strictEqual(new Set(synoptic.map((rubric) => rubric.chapter)).size, 77);
assert.deepStrictEqual([...grades].sort(), [1, 2, 3, 4]);
assert.ok(synoptic.every((rubric) => rubric.source === "synoptic"));
assert.ok(synoptic.every((rubric) => rubric.scoringEnabled === true));
assert.ok(synoptic.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(synoptic.every((rubric) =>
  /C\. M\. Boger.+Synoptic Key.+1916.+Part I/.test(rubric.citation || "")
));

const breathingDeeply = synoptic.find((rubric) =>
  rubric.chapter === "Conditions Of Aggravation And Amelioration"
  && rubric.name === "Breathing deeply, agg."
);
assert.ok(breathingDeeply);
assert.strictEqual(breathingDeeply?.remedies.Bry, 4);

const oldAge = synoptic.find((rubric) =>
  rubric.chapter === "Generalities"
  && rubric.name === "Old age, senility"
);
assert.ok(oldAge);
assert.strictEqual(oldAge?.remedies["Baryta-c"], 4);
assert.strictEqual(oldAge?.remedies.Lach, 4);

console.log("Boger's Synoptic Key 1916 browser asset tests passed.");
