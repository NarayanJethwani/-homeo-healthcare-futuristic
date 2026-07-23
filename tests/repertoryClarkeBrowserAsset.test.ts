import assert from "assert";
import fs from "fs";
import path from "path";
import {
  CLARKE_CHAPTERS,
  getRepertoryData,
  setRepertoryData,
  type Rubric,
} from "../src/lib/repertoryData";

const assetPath = path.join(process.cwd(), "public", "data", "clarkeClinicalRepertoryData.json");
const clarke = JSON.parse(fs.readFileSync(assetPath, "utf8")) as Rubric[];

assert.ok(clarke.length >= 2_000);
assert.strictEqual(new Set(clarke.map((rubric) => rubric.id)).size, clarke.length);
assert.ok(clarke.every((rubric) => rubric.source === "clarke"));
assert.ok(clarke.every((rubric) => rubric.scoringEnabled === false));
assert.ok(clarke.every((rubric) => Object.keys(rubric.remedies).length === 0));
assert.ok(clarke.every((rubric) => Boolean(rubric.citation)));
assert.ok(clarke.some((rubric) => rubric.name === "Abdomen — Coldness in"));
assert.ok(clarke.some((rubric) => rubric.name === "Acne — Rosacea"));
assert.ok(clarke.some((rubric) => rubric.name === "Scorbutic Affections"));
assert.ok(clarke.some((rubric) => rubric.name === "Spermatorrhoea"));
assert.ok(clarke.every((rubric) => !/[a-z][A-Z]/.test(rubric.name)));
assert.ok(clarke.every((rubric) => !/^['‘’"“”•*—–-]/.test(rubric.name)));
assert.ok(clarke.every((rubric) => !/SpennatoiThoBa|Edbma|Tamntnla|Acpomegaly/.test(rubric.name)));
assert.ok(clarke.every((rubric) => /^[A-ZÀ-ÖØ-ÞŒ]/.test(rubric.name)));
assert.ok(clarke.every((rubric) => !/^(?:always|amount of|and |are )/.test(rubric.name)));
assert.ok(clarke.every((rubric) => !/ — [A-Z][a-z]{0,3}\. [a-z]$/.test(rubric.name)));

setRepertoryData([], [], clarke);
assert.strictEqual(getRepertoryData("clarke").length, clarke.length);
assert.strictEqual(getRepertoryData("combined").length, clarke.length);
assert.ok(CLARKE_CHAPTERS.length > 0);
assert.ok(getRepertoryData("combined").every((rubric) => rubric.scoringEnabled === false));

console.log("Clarke browser asset tests passed.");
