import assert from "node:assert";
import type { Rubric } from "../src/lib/repertoryData";
import {
  toggleFavouriteRepertory,
  updateRecentRepertories,
  type ClassicalRepertoryId,
} from "../src/features/repertory/components/RepertoryCatalogSelector";
import { groupRepertoryRubrics } from "../src/features/repertory/components/GroupedRepertoryResults";

const rubric = (
  id: string,
  source: NonNullable<Rubric["source"]>,
  name: string,
  remedies: Record<string, number>,
): Rubric => ({
  id,
  source,
  chapter: "Mind",
  name,
  remedies,
  scoringEnabled: true,
  scoringMode: "graded",
  citation: `${source} source citation`,
});

const kentAnxiety = rubric("kent-anxiety", "kent", "Anxiety — health, about", {
  Ars: 3,
  Calc: 1,
});
const knerrAnxiety = rubric("knerr-anxiety", "knerr", "Anxiety - health, about", {
  Ars: 1,
  Phos: 5,
});
const tpbFear = rubric("tpb-fear", "boenninghausen", "Fear of death", {
  Acon: 5,
});

const grouped = groupRepertoryRubrics([kentAnxiety, knerrAnxiety, tpbFear], true);
assert.strictEqual(grouped.length, 2);
const anxietyGroup = grouped.find((group) => group.rubrics.length === 2);
assert.ok(anxietyGroup);
assert.deepStrictEqual(anxietyGroup?.rubrics.map((item) => item.id), [
  "kent-anxiety",
  "knerr-anxiety",
]);
assert.strictEqual(anxietyGroup?.rubrics[0].remedies.Ars, 3);
assert.strictEqual(anxietyGroup?.rubrics[1].remedies.Ars, 1);
assert.strictEqual(anxietyGroup?.rubrics[1].remedies.Phos, 5);
assert.notStrictEqual(
  anxietyGroup?.rubrics[0].remedies,
  anxietyGroup?.rubrics[1].remedies,
  "Grouped results must retain independent source remedy maps",
);

const ungrouped = groupRepertoryRubrics([kentAnxiety, knerrAnxiety], false);
assert.strictEqual(ungrouped.length, 2);
assert.ok(ungrouped.every((group) => group.rubrics.length === 1));

let favourites: ClassicalRepertoryId[] = [];
favourites = toggleFavouriteRepertory(favourites, "kent");
favourites = toggleFavouriteRepertory(favourites, "boenninghausen");
assert.deepStrictEqual(favourites, ["kent", "boenninghausen"]);
favourites = toggleFavouriteRepertory(favourites, "kent");
assert.deepStrictEqual(favourites, ["boenninghausen"]);

let recents: ClassicalRepertoryId[] = [];
for (const id of ["kent", "clarke", "boger", "knerr", "boenninghausen", "boericke"] as ClassicalRepertoryId[]) {
  recents = updateRecentRepertories(recents, id);
}
assert.deepStrictEqual(recents, ["boericke", "boenninghausen", "knerr", "boger", "clarke"]);
recents = updateRecentRepertories(recents, "knerr");
assert.deepStrictEqual(recents, ["knerr", "boericke", "boenninghausen", "boger", "clarke"]);

console.log("Scalable repertory catalogue and grouped-search UX tests passed.");
