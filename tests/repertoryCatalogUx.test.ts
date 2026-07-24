import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
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
for (const id of ["kent", "clarke", "boger", "knerr", "boenninghausen", "gentry", "synoptic", "jahr", "boericke"] as ClassicalRepertoryId[]) {
  recents = updateRecentRepertories(recents, id);
}
assert.deepStrictEqual(recents, ["boericke", "jahr", "synoptic", "gentry", "boenninghausen"]);
recents = updateRecentRepertories(recents, "knerr");
assert.deepStrictEqual(recents, ["knerr", "boericke", "jahr", "synoptic", "gentry"]);

const globalsCss = fs.readFileSync(path.resolve("src/app/globals.css"), "utf8");
const dashboardSource = fs.readFileSync(path.resolve("src/app/admin/dashboard/page.tsx"), "utf8");
assert.match(
  globalsCss,
  /\.repertory-context-bar\s*{[^}]*z-index:\s*80;/s,
  "The catalogue context must remain above both workbench panels",
);
assert.match(
  globalsCss,
  /\.repertory-browser-panel,\s*\.repertorization-panel\s*{[^}]*z-index:\s*1;/s,
  "Workbench panels must share a lower stacking layer than the catalogue",
);
assert.match(
  globalsCss,
  /\.repertory-panel-resizer\s*{[^}]*z-index:\s*2;/s,
  "The resizer must remain below the catalogue context",
);
assert.ok(
  dashboardSource.includes("repertory-zone-three-toolbar flex w-full flex-wrap"),
  "Zone 3 actions must wrap inside their panel instead of overflowing the viewport",
);
assert.ok(
  dashboardSource.includes("repertory-matrix-scroll max-w-full overflow-x-auto"),
  "The remedy matrix must scroll within Zone 3",
);
assert.ok(
  dashboardSource.includes('className="w-max min-w-full border-collapse'),
  "Remedy columns must retain their usable width inside the matrix scroller",
);
assert.match(
  globalsCss,
  /\.repertory-matrix-scroll\s*{[^}]*scrollbar-width:\s*thin;/s,
  "The matrix scroller must expose a visible horizontal scrollbar",
);

console.log("Scalable repertory catalogue and grouped-search UX tests passed.");
