import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { Rubric } from "../src/lib/repertoryData";
import {
  LIPPE_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
} from "../src/lib/repertoryData";

const assetPath = path.resolve(
  "public",
  "data",
  "lippeCharacteristicRepertoryData.json",
);
const lippe = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const remedyRelationships = lippe.reduce(
  (total, rubric) => total + Object.keys(rubric.remedies).length,
  0,
);
const grades = new Set(lippe.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(lippe.length >= 15_000, "The governed Lippe corpus must not silently shrink.");
assert.ok(
  remedyRelationships >= 70_000,
  "The governed Lippe remedy relationships must remain complete.",
);
assert.strictEqual(new Set(lippe.map((rubric) => rubric.id)).size, lippe.length);
assert.strictEqual(new Set(lippe.map((rubric) => rubric.chapter)).size, 34);
assert.deepStrictEqual([...grades].sort(), [1, 2]);
assert.ok(lippe.every((rubric) => rubric.source === "lippe"));
assert.ok(lippe.every((rubric) => rubric.scoringEnabled === true));
assert.ok(lippe.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(lippe.every((rubric) =>
  rubric.citation?.includes(
    "Repertory to the More Characteristic Symptoms of the Materia Medica (1879)",
  )
));

const fearOfDeath = lippe.find((rubric) =>
  rubric.chapter === "1. Mind and Disposition"
  && rubric.name === "Fear of death"
);
assert.ok(fearOfDeath);
assert.strictEqual(fearOfDeath?.remedies.Acon, 2);
assert.strictEqual(fearOfDeath?.remedies.Ars, 2);
assert.strictEqual(fearOfDeath?.remedies.Bry, 1);

assert.doesNotThrow(() =>
  setRepertoryData([], [], [], [], [], [], [], [], [], lippe)
);
assert.strictEqual(getRepertoryData("lippe").length, lippe.length);
assert.strictEqual(LIPPE_CHAPTERS.length, 34);

console.log("Lippe Characteristic Repertory governed asset tests passed.");
