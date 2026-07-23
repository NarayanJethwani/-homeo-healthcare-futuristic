import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  BOGER_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
  type Rubric,
} from "../src/lib/repertoryData";

const assetPath = path.join(process.cwd(), "public", "data", "bogerBoenninghausenRepertoryData.json");
const boger = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];
const occurrenceCount = boger.reduce((sum, rubric) => sum + Object.keys(rubric.remedies).length, 0);
const grades = new Set(boger.flatMap((rubric) => Object.values(rubric.remedies)));

assert.ok(boger.length >= 12_000);
assert.ok(occurrenceCount >= 160_000);
assert.strictEqual(new Set(boger.map((rubric) => rubric.id)).size, boger.length);
assert.ok(boger.every((rubric) => rubric.source === "boger"));
assert.ok(boger.every((rubric) => rubric.scoringEnabled === true));
assert.ok(boger.every((rubric) => rubric.scoringMode === "graded"));
assert.ok(boger.every((rubric) => Boolean(rubric.citation)));
assert.ok(boger.every((rubric) => Object.values(rubric.remedies).every((grade) => grade >= 1 && grade <= 5)));
assert.deepStrictEqual(Array.from(grades).sort(), [1, 2, 3, 4, 5]);

const absenceOfMind = boger.find((rubric) => rubric.name === "Absence of Mind");
assert.ok(absenceOfMind);
assert.strictEqual(absenceOfMind?.chapter, "Mind");
assert.strictEqual(absenceOfMind?.remedies.Acon, 4);
assert.strictEqual(absenceOfMind?.remedies.Apis, 5);
assert.strictEqual(absenceOfMind?.remedies.Alum, 2);
assert.ok(boger.some((rubric) => rubric.chapter === "Head — Internal"));
assert.ok(boger.some((rubric) => rubric.chapter === "Head — External"));
assert.ok(boger.some((rubric) => rubric.chapter === "Stool & Rectum"));
assert.ok(boger.some((rubric) => rubric.chapter === "Male Genitalia"));
assert.ok(boger.some((rubric) => rubric.chapter === "Female Genitalia"));

setRepertoryData([], [], [], boger);
assert.strictEqual(getRepertoryData("boger").length, boger.length);
assert.strictEqual(getRepertoryData("combined").length, boger.length);
assert.ok(BOGER_CHAPTERS.length >= 30);
assert.ok(getRepertoryData("boger").every((rubric) => rubric.scoringEnabled === true));

console.log("Boger–Boenninghausen browser asset tests passed.");
