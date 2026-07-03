import assert from "assert";
import { compareRemedyScores, compareRubricSnapshots } from "../liveMode/comparisonEngine";

const comparison = compareRubricSnapshots(
  [
    { id: "rubric-1", title: "Anxiety before examination" },
    { id: "rubric-2", title: "Abdomen flatulence" },
  ],
  [
    { id: "rubric-2", title: "Abdomen flatulence" },
    { id: "rubric-3", title: "Mind anxious anticipation" },
  ],
);

assert.deepStrictEqual(comparison.commonRubrics.map((rubric) => rubric.id), ["rubric-2"]);
assert.deepStrictEqual(comparison.v1OnlyRubrics.map((rubric) => rubric.id), ["rubric-1"]);
assert.deepStrictEqual(comparison.v2OnlyRubrics.map((rubric) => rubric.id), ["rubric-3"]);
assert.deepStrictEqual(comparison.rankingDifferences.find((item) => item.rubricId === "rubric-2"), {
  rubricId: "rubric-2",
  title: "Abdomen flatulence",
  v1Rank: 2,
  v2Rank: 1,
  rankDelta: -1,
});

const scoreDiffs = compareRemedyScores(
  [
    { remedyId: "nux-v", totalScore: 12 },
    { remedyId: "lyc", totalScore: 8 },
  ],
  [
    { remedyId: "nux-v", totalScore: 15 },
    { remedyId: "ars", totalScore: 6 },
  ],
);

assert.deepStrictEqual(scoreDiffs.find((item) => item.remedyId === "nux-v"), {
  remedyId: "nux-v",
  v1Score: 12,
  v2Score: 15,
  delta: 3,
});

console.log("v2ComparisonMode.test.ts passed");
