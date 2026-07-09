"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const comparisonEngine_1 = require("../liveMode/comparisonEngine");
const comparison = (0, comparisonEngine_1.compareRubricSnapshots)([
    { id: "rubric-1", title: "Anxiety before examination" },
    { id: "rubric-2", title: "Abdomen flatulence" },
], [
    { id: "rubric-2", title: "Abdomen flatulence" },
    { id: "rubric-3", title: "Mind anxious anticipation" },
]);
assert_1.default.deepStrictEqual(comparison.commonRubrics.map((rubric) => rubric.id), ["rubric-2"]);
assert_1.default.deepStrictEqual(comparison.v1OnlyRubrics.map((rubric) => rubric.id), ["rubric-1"]);
assert_1.default.deepStrictEqual(comparison.v2OnlyRubrics.map((rubric) => rubric.id), ["rubric-3"]);
assert_1.default.deepStrictEqual(comparison.rankingDifferences.find((item) => item.rubricId === "rubric-2"), {
    rubricId: "rubric-2",
    title: "Abdomen flatulence",
    v1Rank: 2,
    v2Rank: 1,
    rankDelta: -1,
});
const scoreDiffs = (0, comparisonEngine_1.compareRemedyScores)([
    { remedyId: "nux-v", totalScore: 12 },
    { remedyId: "lyc", totalScore: 8 },
], [
    { remedyId: "nux-v", totalScore: 15 },
    { remedyId: "ars", totalScore: 6 },
]);
assert_1.default.deepStrictEqual(scoreDiffs.find((item) => item.remedyId === "nux-v"), {
    remedyId: "nux-v",
    v1Score: 12,
    v2Score: 15,
    delta: 3,
});
console.log("v2ComparisonMode.test.ts passed");
