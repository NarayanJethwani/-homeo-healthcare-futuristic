import assert from "assert";
import { adaptFirestoreRubric } from "../adapters/firestoreRubricAdapter";
import { adaptKentBoerickeRubric } from "../adapters/kentBoerickeAdapter";
import { adaptLegacyJethwaniRubric } from "../adapters/legacyJethwaniAdapter";

const jethwaniRecord = Object.freeze({
  id: "jeth_a_panic_disorder",
  name: "Panic disorder, sudden onset of acute death terror",
  section: "Section A",
  category: "Section A",
  organSystem: "Psychology & Psychiatry",
  status: "active",
  keywords: ["panic", "death", "terror"],
  synonyms: ["panic attack"],
  modalities: ["worse midnight"],
  miasms: ["Psora"],
  remedies: { Acon: 3, Ars: 3 },
  researchCitation: { source: "Jethwani Clinical Repository", detail: "Fixture citation" },
});

const adaptedJethwani = adaptLegacyJethwaniRubric(jethwaniRecord);
assert.strictEqual(adaptedJethwani.id, "jeth_a_panic_disorder");
assert.strictEqual(adaptedJethwani.source, "jethwani");
assert.strictEqual(adaptedJethwani.status, "active");
assert.strictEqual(adaptedJethwani.remedies.length, 2);
assert.deepStrictEqual(jethwaniRecord.keywords, ["panic", "death", "terror"]);

const kentRecord = Object.freeze({
  id: "kent_mind_1",
  chapter: "Mind (Mental & Emotional)",
  name: "FEAR - death, of",
  remedies: { Acon: 3, Ars: 2 },
  source: "kent",
});

const adaptedKent = adaptKentBoerickeRubric(kentRecord);
assert.strictEqual(adaptedKent.source, "kent");
assert.strictEqual(adaptedKent.clinicalSystem, "psychology_psychiatry");
assert.strictEqual(adaptedKent.remedies[0].grade, 3);
assert.strictEqual(adaptedKent.citation?.sourceName, "Kent Repertory");

const firestoreRecord = Object.freeze({
  id: "jeth_exp_4732",
  name: "Panic disorder with palpitations and sweating, worse in cold damp weather",
  category: "Section A",
  organSystem: "Psychology & Psychiatry",
  status: "active",
  keywords: ["panic", "palpitations", "sweating"],
  modalities: ["cold damp weather"],
  miasms: ["Tubercular", "Syphilis"],
  remedies: { Acon: 2, "Nux Vomica": 3 },
  researchCitation: { source: "Fixture Source", detail: "Fixture Detail" },
});

const adaptedFirestore = adaptFirestoreRubric(firestoreRecord);
assert.strictEqual(adaptedFirestore.source, "firestore");
assert.strictEqual(adaptedFirestore.remedies.length, 2);
assert.strictEqual(adaptedFirestore.remedies[1].remedyId, "Nux-v");
assert.deepStrictEqual(adaptedFirestore.modalities, ["cold damp weather"]);
assert.deepStrictEqual(adaptedFirestore.miasms, ["Tubercular", "Syphilis"]);

const incomplete = adaptFirestoreRubric({});
assert.ok(incomplete.warnings.includes("missing_id"));
assert.ok(incomplete.warnings.includes("missing_remedies"));

console.log("repertoryAdapters.test.ts passed");

