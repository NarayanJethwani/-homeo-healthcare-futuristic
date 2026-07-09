"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const firestoreRubricAdapter_1 = require("../adapters/firestoreRubricAdapter");
const kentBoerickeAdapter_1 = require("../adapters/kentBoerickeAdapter");
const legacyJethwaniAdapter_1 = require("../adapters/legacyJethwaniAdapter");
const jethwaniRecord = Object.freeze({
    id: "jeth_a_panic_disorder",
    name: "Panic disorder, sudden onset of acute death terror",
    plainLanguageMeaning: "Sudden panic with fear of death",
    classicalWording: "Mind; fear; death; sudden",
    section: "Section A",
    category: "Section A",
    subCategory: "Acute anxiety",
    organSystem: "Psychology & Psychiatry",
    status: "active",
    indexWeights: { stress_load: 0.8, anxiety_severity: 1 },
    keywords: ["panic", "death", "terror"],
    clinicalKeywords: ["panic disorder"],
    synonyms: ["panic attack"],
    patientExpressions: ["I feel I am going to die"],
    relatedSymptoms: ["jeth_sleep_startle"],
    relatedDiseases: ["Panic disorder"],
    modalities: ["worse midnight"],
    miasms: ["Psora"],
    miasmaticWeight: { Psora: 0.8, Syphilis: 0.2 },
    intensityScale: 9,
    polarity: "positive",
    mentalEmotionalState: ["terror"],
    aggravations: ["midnight"],
    ameliorations: ["reassurance"],
    clinicalNotes: "Fixture note",
    confidence: 0.9,
    author: "Dr. Jethwani",
    reviewer: "Clinical reviewer",
    lastUpdated: "2026-07-01T00:00:00.000Z",
    remedies: { Acon: 3, Ars: -2 },
    relatedRemedies: [{
            remedyId: "Nux-v",
            remedyName: "Nux Vomica",
            grade: 4,
            confidence: 0.75,
            keynoteReason: "Overwork trigger",
            sourceReference: "Fixture materia medica",
            clinicalExperienceWeight: 0.8,
            contraindicationNotes: "Do not infer without clinician review",
            differentialNotes: "Different from Acon by chronicity",
        }],
    researchCitation: { source: "Jethwani Clinical Repository", detail: "Fixture citation" },
    sourceOnlyFutureField: "must be retained in metadata",
});
const adaptedJethwani = (0, legacyJethwaniAdapter_1.adaptLegacyJethwaniRubric)(jethwaniRecord);
assert_1.default.strictEqual(adaptedJethwani.id, "jeth_a_panic_disorder");
assert_1.default.strictEqual(adaptedJethwani.source, "jethwani");
assert_1.default.strictEqual(adaptedJethwani.status, "active");
assert_1.default.strictEqual(adaptedJethwani.plainLanguageMeaning, "Sudden panic with fear of death");
assert_1.default.deepStrictEqual(adaptedJethwani.indexWeights, { stress_load: 0.8, anxiety_severity: 1 });
assert_1.default.deepStrictEqual(adaptedJethwani.patientExpressions, ["I feel I am going to die"]);
assert_1.default.deepStrictEqual(adaptedJethwani.miasmaticWeight, { Psora: 0.8, Syphilis: 0.2 });
assert_1.default.strictEqual(adaptedJethwani.remedies.length, 3);
assert_1.default.strictEqual(adaptedJethwani.remedies[1].sourceRemedyId, "Ars");
assert_1.default.strictEqual(adaptedJethwani.remedies[1].sourceGrade, -2);
assert_1.default.strictEqual(adaptedJethwani.remedies[1].isEliminating, true);
assert_1.default.strictEqual(adaptedJethwani.remedies[1].polarity, "negative");
assert_1.default.strictEqual(adaptedJethwani.remedies[2].keynoteReason, "Overwork trigger");
assert_1.default.strictEqual(adaptedJethwani.metadata?.sourceOnlyFutureField, "must be retained in metadata");
assert_1.default.deepStrictEqual(jethwaniRecord.keywords, ["panic", "death", "terror"]);
const kentRecord = Object.freeze({
    id: "kent_mind_1",
    chapter: "Mind (Mental & Emotional)",
    name: "FEAR - death, of",
    remedies: { Acon: 3, Ars: 2 },
    source: "kent",
});
const adaptedKent = (0, kentBoerickeAdapter_1.adaptKentBoerickeRubric)(kentRecord);
assert_1.default.strictEqual(adaptedKent.source, "kent");
assert_1.default.strictEqual(adaptedKent.clinicalSystem, "psychology_psychiatry");
assert_1.default.strictEqual(adaptedKent.remedies[0].grade, 3);
assert_1.default.strictEqual(adaptedKent.citation?.sourceName, "Kent Repertory");
const firestoreRecord = Object.freeze({
    id: "jeth_exp_4732",
    name: "Panic disorder with palpitations and sweating, worse in cold damp weather",
    slug: "panic-disorder-palpitations-sweating",
    parentRubricId: "jeth_exp_parent",
    description: "Firestore fixture description",
    category: "Section A",
    subcategory: "Panic spectrum",
    organSystem: "Psychology & Psychiatry",
    clinicalPriority: "high",
    createdDate: "2026-06-01T00:00:00.000Z",
    modifiedDate: "2026-06-02T00:00:00.000Z",
    status: "active",
    searchWeight: 1.5,
    indexWeights: { anxiety_severity: 1, sleep_quality: -0.3 },
    keywords: ["panic", "palpitations", "sweating"],
    synonyms: ["fear episode"],
    clinicalConditions: ["Panic disorder"],
    modalities: ["cold damp weather"],
    miasms: ["Tubercular", "Syphilis"],
    remedies: { Acon: 2, "Nux Vomica": 3, Ars: -1 },
    researchCitation: { source: "Fixture Source", detail: "Fixture Detail" },
    firestoreOnlyFutureField: { retained: true },
});
const adaptedFirestore = (0, firestoreRubricAdapter_1.adaptFirestoreRubric)(firestoreRecord);
assert_1.default.strictEqual(adaptedFirestore.source, "firestore");
assert_1.default.strictEqual(adaptedFirestore.slug, "panic-disorder-palpitations-sweating");
assert_1.default.strictEqual(adaptedFirestore.parentRubricId, "jeth_exp_parent");
assert_1.default.strictEqual(adaptedFirestore.description, "Firestore fixture description");
assert_1.default.strictEqual(adaptedFirestore.subcategory, "Panic spectrum");
assert_1.default.strictEqual(adaptedFirestore.clinicalPriority, "high");
assert_1.default.strictEqual(adaptedFirestore.searchWeight, 1.5);
assert_1.default.deepStrictEqual(adaptedFirestore.indexWeights, { anxiety_severity: 1, sleep_quality: -0.3 });
assert_1.default.strictEqual(adaptedFirestore.remedies.length, 3);
assert_1.default.strictEqual(adaptedFirestore.remedies[1].remedyId, "Nux-v");
assert_1.default.strictEqual(adaptedFirestore.remedies[1].sourceRemedyId, "Nux Vomica");
assert_1.default.strictEqual(adaptedFirestore.remedies[2].isEliminating, true);
assert_1.default.deepStrictEqual(adaptedFirestore.modalities, ["cold damp weather"]);
assert_1.default.deepStrictEqual(adaptedFirestore.miasms, ["Tubercular", "Syphilis"]);
assert_1.default.deepStrictEqual(adaptedFirestore.metadata?.firestoreOnlyFutureField, { retained: true });
const incomplete = (0, firestoreRubricAdapter_1.adaptFirestoreRubric)({});
assert_1.default.ok(incomplete.warnings.includes("missing_id"));
assert_1.default.ok(incomplete.warnings.includes("missing_remedies"));
console.log("repertoryAdapters.test.ts passed");
