"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const benchmark_1 = require("../search/clinicalSearch/benchmark");
const clinicalSearchEngine_1 = require("../search/clinicalSearch/clinicalSearchEngine");
const fuzzyMatcher_1 = require("../search/clinicalSearch/fuzzyMatcher");
const searchIndex_1 = require("../search/clinicalSearch/searchIndex");
const synonyms_1 = require("../search/clinicalSearch/synonyms");
const tokenizer_1 = require("../search/clinicalSearch/tokenizer");
function rubric(partial) {
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
const fixtures = [
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
assert_1.default.strictEqual((0, tokenizer_1.normalizeSearchText)("  Café, Anxiety!!!  "), "cafe anxiety");
assert_1.default.deepStrictEqual((0, tokenizer_1.tokenize)("Diarrhoea / loose-stool").tokens, ["diarrhoea", "loose", "stool"]);
const synonymMap = (0, synonyms_1.buildSynonymMap)();
assert_1.default.ok(synonymMap.get("abdomen")?.has("abdominal"));
assert_1.default.ok(synonymMap.get("diarrhoea")?.has("diarrhea"));
assert_1.default.ok(synonymMap.get("craving")?.has("desire"));
assert_1.default.strictEqual((0, fuzzyMatcher_1.isSmallSpellingMistake)("anxety", "anxiety"), true);
assert_1.default.strictEqual((0, fuzzyMatcher_1.isSmallSpellingMistake)("gas", "flatulence"), false);
const index = (0, searchIndex_1.buildCanonicalSearchIndex)(fixtures, "2026-07-03T00:00:00.000Z");
assert_1.default.strictEqual(index.documents.length, fixtures.length);
assert_1.default.ok(index.tokenToRubricIds.get("panic")?.has("panic-palpitations"));
const exactResults = (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, "panic palpitations");
assert_1.default.strictEqual(exactResults[0].rubric.id, "panic-palpitations");
assert_1.default.ok(exactResults[0].matches.some((match) => match.type === "exact"));
const synonymResults = (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, "gas abdomen");
assert_1.default.strictEqual(synonymResults[0].rubric.id, "abdominal-gas");
assert_1.default.ok(synonymResults[0].matches.some((match) => match.type === "synonym" || match.type === "exact"));
const spellingResults = (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, "anxety");
assert_1.default.strictEqual(spellingResults[0].rubric.id, "panic-palpitations");
assert_1.default.ok(spellingResults[0].matches.some((match) => match.type === "fuzzy"));
const partialResults = (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, "palpit");
assert_1.default.strictEqual(partialResults[0].rubric.id, "panic-palpitations");
assert_1.default.ok(partialResults[0].matches.some((match) => match.type === "starts_with" || match.type === "contains"));
const britishSpellingResults = (0, clinicalSearchEngine_1.searchCanonicalRubrics)(index, "diarrhoea");
assert_1.default.strictEqual(britishSpellingResults[0].rubric.id, "diarrhea-loose-stool");
assert_1.default.ok(britishSpellingResults[0].matches.some((match) => match.type === "synonym"));
const difficultStoolResults = (0, clinicalSearchEngine_1.buildAndSearchCanonicalRubrics)(fixtures, "difficult stool");
assert_1.default.strictEqual(difficultStoolResults[0].rubric.id, "constipation-hard-stool");
assert_1.default.ok(difficultStoolResults[0].highlights.some((highlight) => highlight.html.includes("<mark>")));
const benchmark = (0, benchmark_1.benchmarkClinicalSearch)(fixtures, ["panic", "gas", "diarrhoea", "constipaton"]);
assert_1.default.strictEqual(benchmark.documentCount, fixtures.length);
assert_1.default.strictEqual(benchmark.queryCount, 4);
assert_1.default.ok(benchmark.queriesPerSecond >= 0);
console.log("clinicalSearchEngine.test.ts passed");
