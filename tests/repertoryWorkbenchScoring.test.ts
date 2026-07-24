import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import type { Rubric } from "../src/lib/repertoryData";
import {
  calculateWorkbenchRemedyRankings,
  getTopWorkbenchRemedyColumns,
  projectWorkbenchScores,
  type SelectedWorkbenchRubric,
} from "../src/features/repertory/scoring/repertoryWorkbenchScoring";

function selected(
  id: string,
  source: NonNullable<Rubric["source"]>,
  remedies: Record<string, number>,
  options: Partial<Rubric> = {},
): SelectedWorkbenchRubric {
  return {
    rubric: {
      id,
      source,
      chapter: "Test",
      name: id,
      remedies,
      scoringEnabled: true,
      scoringMode: "graded",
      ...options,
    },
    grade: 1,
  };
}

const sourceCases: Array<{ source: NonNullable<Rubric["source"]>; expected: string; rubrics: SelectedWorkbenchRubric[] }> = [
  { source: "kent", expected: "Acon", rubrics: [selected("kent-a", "kent", { Acon: 4, Puls: 1 })] },
  { source: "boericke", expected: "Lyc", rubrics: [selected("boericke-a", "boericke", { Lyc: 3, Sulph: 1 })] },
  {
    source: "clarke",
    expected: "Apis",
    rubrics: [
      selected("clarke-a", "clarke", { Apis: 1, Bell: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
      selected("clarke-b", "clarke", { Apis: 1, Cham: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
    ],
  },
  { source: "boger", expected: "Bry", rubrics: [selected("boger-a", "boger", { Bry: 5, Nux: 2 })] },
  { source: "knerr", expected: "Puls", rubrics: [selected("knerr-a", "knerr", { Puls: 5, Sep: 2 })] },
  { source: "boenninghausen", expected: "Ars", rubrics: [selected("boenninghausen-a", "boenninghausen", { Ars: 5, Calc: 2 })] },
  {
    source: "gentry",
    expected: "Acon",
    rubrics: [
      selected("gentry-a", "gentry", { Acon: 1, Bell: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
      selected("gentry-b", "gentry", { Acon: 1, Puls: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
    ],
  },
  { source: "synoptic", expected: "Bry", rubrics: [selected("synoptic-a", "synoptic", { Bry: 4, Puls: 1 })] },
  { source: "jahr", expected: "Puls", rubrics: [selected("jahr-a", "jahr", { Puls: 3, Acon: 2, Ars: 1 })] },
  { source: "lippe", expected: "Acon", rubrics: [selected("lippe-a", "lippe", { Acon: 2, Bry: 1 })] },
  {
    source: "hering-specialized",
    expected: "Acon",
    rubrics: [
      selected("hering-specialized-a", "hering-specialized", { Acon: 1, Bell: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
      selected("hering-specialized-b", "hering-specialized", { Acon: 1, Puls: 1 }, { scoringMode: "occurrence", occurrenceScoringEnabled: true }),
    ],
  },
];

for (const sourceCase of sourceCases) {
  const columns = getTopWorkbenchRemedyColumns(sourceCase.rubrics);
  assert.strictEqual(columns[0], sourceCase.expected, `${sourceCase.source} must derive its own leading remedy`);
}

const kentColumns = getTopWorkbenchRemedyColumns(sourceCases[0].rubrics);
const boerickeColumns = getTopWorkbenchRemedyColumns(sourceCases[1].rubrics);
assert.notDeepStrictEqual(kentColumns, boerickeColumns, "Changing rubrics must rebuild remedy columns");

const combinedRubrics = sourceCases.flatMap(({ rubrics }) => rubrics);
const combinedRankings = calculateWorkbenchRemedyRankings(combinedRubrics);
assert.ok(combinedRankings.some(({ remedy }) => remedy === "Acon"));
assert.ok(combinedRankings.some(({ remedy }) => remedy === "Apis"));
assert.ok(combinedRankings.some(({ remedy }) => remedy === "Bry"));
assert.ok(combinedRankings.some(({ remedy }) => remedy === "Puls"));

const referenceOnlyClarke = selected(
  "clarke-reference",
  "clarke",
  { Ars: 5 },
  { scoringEnabled: false, scoringMode: "graded", occurrenceScoringEnabled: false },
);
assert.deepStrictEqual(getTopWorkbenchRemedyColumns([referenceOnlyClarke]), []);

const projected = projectWorkbenchScores(sourceCases[4].rubrics, ["Puls", "Sep"]);
assert.deepStrictEqual(projected, [
  { remedy: "Puls", coverage: "1/1", score: 5 },
  { remedy: "Sep", coverage: "1/1", score: 2 },
]);

const productionAssets = [
  "kentRepertoryData.json",
  "boerickeRepertoryData.json",
  "clarkeClinicalRepertoryData.json",
  "bogerBoenninghausenRepertoryData.json",
  "knerrHeringRepertoryData.json",
  "boenninghausenTherapeuticPocketBookData.json",
  "gentryConcordanceRepertoryData.json",
  "bogerSynopticKeyRepertoryData.json",
  "jahrClinicalGuideRepertoryData.json",
  "lippeCharacteristicRepertoryData.json",
  "heringSpecializedRepertoriesData.json",
];
const productionSelections: SelectedWorkbenchRubric[] = [];

for (const filename of productionAssets) {
  const rubrics = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", filename), "utf8"),
  ) as Rubric[];
  const representative = rubrics.find((rubric) =>
    isScoringReady(rubric) && Object.keys(rubric.remedies).length >= 3
  );
  assert.ok(representative, `${filename} must contain a scoring-ready representative rubric`);
  const selection = { rubric: representative, grade: 1 };
  productionSelections.push(selection);
  const columns = getTopWorkbenchRemedyColumns([selection]);
  assert.ok(columns.length > 0, `${filename} must produce dynamic remedy columns`);
  assert.ok(columns.every((remedy) => remedy in representative.remedies));
}

assert.ok(calculateWorkbenchRemedyRankings(productionSelections).length > 10);

console.log("Shared repertory workbench scoring tests passed for all eleven sources and combined mode.");

function isScoringReady(rubric: Rubric): boolean {
  if (rubric.source !== "clarke") return rubric.scoringEnabled !== false;
  return rubric.scoringMode === "occurrence" && rubric.occurrenceScoringEnabled === true;
}
