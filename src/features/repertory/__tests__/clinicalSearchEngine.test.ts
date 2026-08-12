import assert from "assert";
import { CanonicalRubric } from "../engine/canonicalTypes";
import { benchmarkClinicalSearch } from "../search/clinicalSearch/benchmark";
import { buildAndSearchCanonicalRubrics, searchCanonicalRubrics } from "../search/clinicalSearch/clinicalSearchEngine";
import { isSmallSpellingMistake } from "../search/clinicalSearch/fuzzyMatcher";
import { buildCanonicalSearchIndex } from "../search/clinicalSearch/searchIndex";
import { buildSynonymMap } from "../search/clinicalSearch/synonyms";
import { normalizeSearchText, tokenize } from "../search/clinicalSearch/tokenizer";

function rubric(partial: Partial<CanonicalRubric> & Pick<CanonicalRubric, "id" | "title">): CanonicalRubric {
  return {
    source: "jethwani",
    category: "unknown",
    clinicalSystem: "unknown",
    status: "active",
    synonyms: [],
    keywords: [],
    modalities: [],
    miasms: [],
    remedies: [],
    originalRecord: partial,
    warnings: [],
    ...partial,
  };
}

const fixtures: CanonicalRubric[] = [
  rubric({
    id: "panic-palpitations",
    title: "Panic disorder with palpitations and fear of death",
    plainLanguageMeaning: "Sudden anxious feeling with heart pounding",
    keywords: ["panic", "anxiety", "palpitations"],
    clinicalKeywords: ["panic disorder"],
    patientExpressions: ["I feel I am going to die"],
    clinicalPriority: "high",
    searchWeight: 1.2,
    remedies: [{ remedyId: "Acon", sourceRemedyId: "Acon", grade: 3 }],
  }),
  rubric({
    id: "abdominal-gas",
    title: "Abdominal bloating with flatulence",
    plainLanguageMeaning: "Gas and distension of abdomen",
    keywords: ["abdomen", "bloating", "flatulence"],
    synonyms: ["gas", "belly distension"],
    clinicalConditions: ["IBS"],
    organSystem: "Gastrointestinal",
    remedies: [{ remedyId: "Lyc", sourceRemedyId: "Lyc", grade: 3 }],
  }),
  rubric({
    id: "constipation-hard-stool",
    title: "Constipation with hard difficult stool",
    keywords: ["constipation", "hard stool"],
    patientExpressions: ["difficult stool"],
    organSystem: "Gastrointestinal",
    remedies: [{ remedyId: "Nux-v", sourceRemedyId: "Nux Vomica", grade: 3 }],
  }),
  rubric({
    id: "diarrhea-loose-stool",
    title: "Diarrhea with watery loose stool",
    keywords: ["diarrhea", "loose stool"],
    organSystem: "Gastrointestinal",
  }),
];

assert.strictEqual(normalizeSearchText("  Café, Anxiety!!!  "), "cafe anxiety");
assert.deepStrictEqual(tokenize("Diarrhoea / loose-stool").tokens, ["diarrhoea", "loose", "stool"]);

const synonymMap = buildSynonymMap();
assert.ok(synonymMap.get("abdomen")?.has("abdominal"));
assert.ok(synonymMap.get("diarrhoea")?.has("diarrhea"));
assert.ok(synonymMap.get("craving")?.has("desire"));

assert.strictEqual(isSmallSpellingMistake("anxety", "anxiety"), true);
assert.strictEqual(isSmallSpellingMistake("gas", "flatulence"), false);

const index = buildCanonicalSearchIndex(fixtures, "2026-07-03T00:00:00.000Z");
assert.strictEqual(index.documents.length, fixtures.length);
assert.ok(index.tokenToRubricIds.get("panic")?.has("panic-palpitations"));

const exactResults = searchCanonicalRubrics(index, "panic palpitations");
assert.strictEqual(exactResults[0].rubric.id, "panic-palpitations");
assert.ok(exactResults[0].matches.some((match) => match.type === "exact"));

const synonymResults = searchCanonicalRubrics(index, "gas abdomen");
assert.strictEqual(synonymResults[0].rubric.id, "abdominal-gas");
assert.ok(synonymResults[0].matches.some((match) => match.type === "synonym" || match.type === "exact"));

const spellingResults = searchCanonicalRubrics(index, "anxety");
assert.strictEqual(spellingResults[0].rubric.id, "panic-palpitations");
assert.ok(spellingResults[0].matches.some((match) => match.type === "fuzzy"));

const partialResults = searchCanonicalRubrics(index, "palpit");
assert.strictEqual(partialResults[0].rubric.id, "panic-palpitations");
assert.ok(partialResults[0].matches.some((match) => match.type === "starts_with" || match.type === "contains"));

const britishSpellingResults = searchCanonicalRubrics(index, "diarrhoea");
assert.strictEqual(britishSpellingResults[0].rubric.id, "diarrhea-loose-stool");
assert.ok(britishSpellingResults[0].matches.some((match) => match.type === "synonym"));
assert.strictEqual(
  britishSpellingResults.some((result) => result.rubric.id === "constipation-hard-stool"),
  false,
  "A British spelling synonym must not leak generic phrase tokens into an opposing stool concept",
);

const difficultStoolResults = buildAndSearchCanonicalRubrics(fixtures, "difficult stool");
assert.strictEqual(difficultStoolResults[0].rubric.id, "constipation-hard-stool");
assert.ok(difficultStoolResults[0].highlights.some((highlight) => highlight.html.includes("<mark>")));

const benchmark = benchmarkClinicalSearch(fixtures, ["panic", "gas", "diarrhoea", "constipaton"]);
assert.strictEqual(benchmark.documentCount, fixtures.length);
assert.strictEqual(benchmark.queryCount, 4);
assert.ok(benchmark.queriesPerSecond >= 0);

console.log("clinicalSearchEngine.test.ts passed");
