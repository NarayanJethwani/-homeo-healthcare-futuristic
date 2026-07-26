import assert from "node:assert/strict";
import type { Rubric } from "../src/lib/repertoryData";
import { isRubricScoringEnabled } from "../src/features/repertory/scoring/repertoryScoringPolicy";

const clarkeRubric: Rubric = {
  id: "clarke-clinical-spermatorrhoea",
  chapter: "Clinical",
  name: "Spermatorrhoea",
  remedies: { "Nux-v": 1, Sel: 1 },
  source: "clarke",
  scoringEnabled: false,
  scoringMode: "occurrence",
  occurrenceScoringEnabled: true,
  citation: "John Henry Clarke, A Clinical Repertory (1904)",
};

const kentRubric: Rubric = {
  id: "kent-mind-anxiety",
  chapter: "Mind",
  name: "Anxiety",
  remedies: { Ars: 3 },
  source: "kent",
  scoringEnabled: true,
};

const clarkeReferenceOnlyRubric: Rubric = {
  ...clarkeRubric,
  id: "clarke-reference-only",
  remedies: {},
};

assert.equal(isRubricScoringEnabled(clarkeRubric), true);
assert.equal(isRubricScoringEnabled(clarkeReferenceOnlyRubric), false);
assert.equal(isRubricScoringEnabled(kentRubric), true);
assert.deepEqual(clarkeRubric.remedies, { "Nux-v": 1, Sel: 1 });
assert.ok(Object.values(clarkeRubric.remedies).every((weight) => weight === 1));

console.log("Clarke equal-occurrence selection/scoring tests passed.");
