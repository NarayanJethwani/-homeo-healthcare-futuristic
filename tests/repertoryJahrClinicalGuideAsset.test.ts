import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { Rubric } from "../src/lib/repertoryData";
import {
  JAHR_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
} from "../src/lib/repertoryData";

const assetPath = path.resolve("public", "data", "jahrClinicalGuideRepertoryData.json");
const jahr = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const remedyOccurrences = jahr.reduce(
  (total, rubric) => total + Object.keys(rubric.remedies).length,
  0,
);

assert.ok(jahr.length >= 3_150, "The governed clinical corpus must not silently shrink.");
assert.ok(remedyOccurrences >= 32_000, "The governed remedy relationships must remain complete.");
assert.strictEqual(new Set(jahr.map((rubric) => rubric.id)).size, jahr.length);
assert.strictEqual(new Set(jahr.map((rubric) => rubric.chapter)).size, 8);
assert.ok(jahr.every((rubric) => rubric.source === "jahr"));
assert.ok(jahr.every((rubric) => rubric.scoringEnabled === true));
assert.ok(jahr.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(jahr.every((rubric) => rubric.citation?.includes("Clinical Guide or Pocket-Repertory (1850)")));
assert.ok(jahr.every((rubric) => !/[»^<>]/.test(rubric.name)));
assert.ok(jahr.every((rubric) =>
  !/ — (?:Mercurius|Belladonna|Sepia|Cuprum|Veratrum|Nux vom|Pulsatilla|Sulphur)$/.test(rubric.name)
), "Remedy-description headings must not be exposed as symptom rubrics.");

const amenia = jahr.find((rubric) => rubric.name === "Amenia");
assert.ok(amenia);
assert.strictEqual(amenia?.remedies.Puls, 3);
assert.strictEqual(amenia?.remedies.Sep, 3);
assert.strictEqual(amenia?.remedies.Acon, 2);

const whoopingCough = jahr.find((rubric) => rubric.name === "Whooping-Cough");
assert.ok(whoopingCough);
assert.strictEqual(whoopingCough?.remedies.Acon, 3);
assert.strictEqual(whoopingCough?.remedies.Cham, 2);
assert.strictEqual(whoopingCough?.remedies.Ars, 1);

assert.doesNotThrow(() => setRepertoryData([], [], [], [], [], [], [], [], jahr));
assert.strictEqual(getRepertoryData("jahr").length, jahr.length);
assert.strictEqual(JAHR_CHAPTERS.length, 8);

console.log("Jahr Clinical Guide governed asset tests passed.");
