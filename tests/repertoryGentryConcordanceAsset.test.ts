import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  GENTRY_REPERTORY_DATA,
  setRepertoryData,
  type Rubric,
} from "../src/lib/repertoryData";

const assetPath = path.join(
  process.cwd(),
  "public",
  "data",
  "gentryConcordanceRepertoryData.json",
);
const gentry = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const remedyOccurrences = gentry.reduce(
  (total, rubric) => total + Object.keys(rubric.remedies).length,
  0,
);

assert.ok(gentry.length >= 150_000);
assert.ok(remedyOccurrences >= 240_000);
assert.strictEqual(new Set(gentry.map((rubric) => rubric.id)).size, gentry.length);
assert.strictEqual(new Set(gentry.map((rubric) => rubric.chapter)).size, 30);
assert.ok(gentry.every((rubric) => rubric.source === "gentry"));
assert.ok(gentry.every((rubric) => rubric.scoringEnabled === true));
assert.ok(gentry.every((rubric) => rubric.scoringMode === "occurrence"));
assert.ok(gentry.every((rubric) => rubric.occurrenceScoringEnabled === true));
assert.ok(gentry.every((rubric) =>
  Object.values(rubric.remedies).every((grade) => grade === 1)
));
assert.ok(gentry.every((rubric) =>
  /William D\. Gentry.+1890.+vol\. [1-6]/.test(rubric.citation || "")
));

assert.doesNotThrow(() => setRepertoryData([], [], [], [], [], [], gentry));
assert.strictEqual(
  GENTRY_REPERTORY_DATA.length,
  gentry.length,
  "Large governed corpora must hydrate without overflowing the browser call stack",
);

const abandoned = gentry.find((rubric) =>
  rubric.chapter === "Mind and Disposition"
  && rubric.name.startsWith("Abandoned. — Frightful fancies")
);
assert.ok(abandoned);
assert.deepStrictEqual(abandoned?.remedies, { Stram: 1 });

const achingAbdomen = gentry.find((rubric) =>
  rubric.chapter === "Abdomen"
  && rubric.name === "Aching. — A. in abdomen."
);
assert.ok(achingAbdomen);
assert.ok(Object.keys(achingAbdomen?.remedies || {}).length >= 10);
assert.ok(Object.values(achingAbdomen?.remedies || {}).every((grade) => grade === 1));

console.log("Gentry Concordance Repertory browser asset tests passed.");
