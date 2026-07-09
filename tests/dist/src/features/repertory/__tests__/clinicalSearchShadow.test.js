"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const clinicalSearchShadow_1 = require("../integration/clinicalSearchShadow");
const originalInfo = console.info;
const logs = [];
console.info = (...args) => {
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
    (0, clinicalSearchShadow_1.runClinicalSearchShadowComparison)({
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
    assert_1.default.strictEqual(logs.length, 1);
    assert_1.default.ok(logs[0].startsWith("[repertory-v2-search-shadow]"));
    const payload = JSON.parse(logs[0].replace("[repertory-v2-search-shadow] ", ""));
    assert_1.default.strictEqual(payload.query, "gas");
    assert_1.default.strictEqual(payload.v1Count, 2);
    assert_1.default.ok(payload.v2Count >= 1);
    assert_1.default.ok(payload.matchedRubricIds.includes("abdominal-gas"));
    assert_1.default.ok(payload.missingRubricIds.includes("unrelated-v1-only"));
    assert_1.default.ok(payload.additionalRubricIds.includes("flatulence"));
    assert_1.default.ok(payload.rankingDifferences.length > 0);
    assert_1.default.ok(payload.searchScoreDifferences.length > 0);
    assert_1.default.ok(payload.synonymMatches.some((item) => item.rubricId === "flatulence"));
}
finally {
    console.info = originalInfo;
}
console.log("clinicalSearchShadow.test.ts passed");
