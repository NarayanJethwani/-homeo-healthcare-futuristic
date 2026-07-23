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

assert.strictEqual(clarke.length, 7_222);
assert.strictEqual(new Set(clarke.map((rubric) => rubric.id)).size, 7_222);
assert.ok(clarke.every((rubric) => rubric.source === "clarke"));
assert.ok(clarke.every((rubric) => rubric.scoringEnabled === false));
assert.ok(clarke.every((rubric) => Object.keys(rubric.remedies).length === 0));
assert.ok(clarke.every((rubric) => Boolean(rubric.citation)));

setRepertoryData([], [], clarke);
assert.strictEqual(getRepertoryData("clarke").length, 7_222);
assert.strictEqual(getRepertoryData("combined").length, 7_222);
assert.ok(CLARKE_CHAPTERS.length > 0);
assert.ok(getRepertoryData("combined").every((rubric) => rubric.scoringEnabled === false));

console.log("Clarke browser asset tests passed.");
