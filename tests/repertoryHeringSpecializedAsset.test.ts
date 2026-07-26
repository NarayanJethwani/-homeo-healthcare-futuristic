import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { Rubric } from "../src/lib/repertoryData";
import {
  HERING_SPECIALIZED_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
} from "../src/lib/repertoryData";

const assetPath = path.resolve(
  "public",
  "data",
  "heringSpecializedRepertoriesData.json",
);
const rubrics = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const remedyRelationships = rubrics.reduce(
  (total, rubric) => total + Object.keys(rubric.remedies).length,
  0,
);
const grades = new Set(rubrics.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(rubrics.length >= 8_500, "The governed Hering specialist corpus must not silently shrink.");
assert.ok(
  remedyRelationships >= 14_500,
  "The governed Hering specialist remedy relationships must remain complete.",
);
assert.strictEqual(new Set(rubrics.map((rubric) => rubric.id)).size, rubrics.length);
assert.strictEqual(new Set(rubrics.map((rubric) => rubric.chapter)).size, 9);
assert.deepStrictEqual([...grades], [1]);
assert.ok(rubrics.every((rubric) => rubric.source === "hering-specialized"));
assert.ok(rubrics.every((rubric) => rubric.scoringEnabled === true));
assert.ok(rubrics.every((rubric) => rubric.scoringMode === "occurrence"));
assert.ok(rubrics.every((rubric) => rubric.occurrenceScoringEnabled === true));
assert.ok(rubrics.every((rubric) =>
  rubric.citation?.includes("Repertory to Hering's Condensed Materia Medica (1889)")
));

const kneeAbscess = rubrics.find((rubric) =>
  rubric.chapter.startsWith("Lower Extremities")
  && rubric.name === "Abscess of knee, gouty, with pain and loss of sleep"
);
assert.strictEqual(kneeAbscess?.remedies.Guai, 1);

const tongueAdherence = rubrics.find((rubric) =>
  rubric.chapter.startsWith("Tongue Symptoms")
  && rubric.name === "Adhering to the palate, as if"
);
assert.strictEqual(tongueAdherence?.remedies.Caust, 1);

const heartFear = rubrics.find((rubric) =>
  rubric.chapter.startsWith("Heart Symptoms")
  && rubric.name === "Fear of apoplexy, particularly with palpitation"
);
assert.strictEqual(heartFear?.remedies["Arg-m"], 1);

assert.doesNotThrow(() =>
  setRepertoryData([], [], [], [], [], [], [], [], [], [], rubrics)
);
assert.strictEqual(getRepertoryData("hering-specialized").length, rubrics.length);
assert.strictEqual(HERING_SPECIALIZED_CHAPTERS.length, 9);

console.log("Hering's Specialized Repertories governed asset tests passed.");
