import assert from "assert";
import { runClinicalSearchShadowComparison } from "../integration/clinicalSearchShadow";

const originalInfo = console.info;
const logs: string[] = [];
console.info = (...args: unknown[]) => {
  logs.push(args.map(String).join(" "));
};

try {
  const v1Results = [
    {
      id: "abdominal-gas",
      name: "Abdominal bloating with gas",
      description: "Gas and distension",
      category: "Section D",
      subcategory: "Digestive",
      organSystem: "Gastrointestinal",
      status: "active",
      searchWeight: 1,
      remedies: { Lyc: 3 },
      keywords: ["gas", "bloating"],
      synonyms: [],
      clinicalConditions: ["IBS"],
      modalities: [],
      miasms: [],
    },
    {
      id: "unrelated-v1-only",
      name: "Unrelated rubric",
      description: "Legacy-only result",
      category: "Section D",
      subcategory: "Digestive",
      organSystem: "Gastrointestinal",
      status: "active",
      searchWeight: 1,
      remedies: { Nux: 1 },
      keywords: ["legacy"],
      synonyms: [],
      clinicalConditions: [],
      modalities: [],
      miasms: [],
    },
  ];

  const candidateRubrics = [
    v1Results[0],
    {
      id: "flatulence",
      name: "Flatulence with abdominal distension",
      description: "Gas accumulation and bloating",
      category: "Section D",
      subcategory: "Digestive",
      organSystem: "Gastrointestinal",
      status: "active",
      searchWeight: 1,
      remedies: { Lyc: 2, Carbo_v: 2 },
      keywords: ["flatulence", "distension"],
      synonyms: ["gas"],
      clinicalConditions: ["IBS"],
      modalities: [],
      miasms: [],
    },
  ];

  runClinicalSearchShadowComparison({
    query: "gas",
    filters: {
      category: "Section D",
      organSystem: "Gastrointestinal",
      miasm: "All",
      remedy: "All",
    },
    v1Results,
    candidateRubrics,
    startedAt: Date.now(),
  });

  assert.strictEqual(logs.length, 1);
  assert.ok(logs[0].startsWith("[repertory-v2-search-shadow]"));

  const payload = JSON.parse(logs[0].replace("[repertory-v2-search-shadow] ", ""));
  assert.strictEqual(payload.query, "gas");
  assert.strictEqual(payload.v1Count, 2);
  assert.ok(payload.v2Count >= 1);
  assert.ok(payload.matchedRubricIds.includes("abdominal-gas"));
  assert.ok(payload.missingRubricIds.includes("unrelated-v1-only"));
  assert.ok(payload.additionalRubricIds.includes("flatulence"));
  assert.ok(payload.rankingDifferences.length > 0);
  assert.ok(payload.searchScoreDifferences.length > 0);
  assert.ok(payload.synonymMatches.some((item: { rubricId: string }) => item.rubricId === "flatulence"));
} finally {
  console.info = originalInfo;
}

console.log("clinicalSearchShadow.test.ts passed");
