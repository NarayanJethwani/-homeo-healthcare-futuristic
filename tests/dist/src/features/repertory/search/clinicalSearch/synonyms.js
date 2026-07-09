"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CLINICAL_SYNONYMS = void 0;
exports.buildSynonymMap = buildSynonymMap;
exports.expandTokensWithSynonyms = expandTokensWithSynonyms;
const tokenizer_1 = require("./tokenizer");
exports.DEFAULT_CLINICAL_SYNONYMS = {
    abdomen: ["abdominal", "belly", "stomach"],
    abdominal: ["abdomen", "belly", "stomach"],
    acidity: ["heartburn", "reflux", "gerd"],
    aggravation: ["worse", "worsening"],
    amelioration: ["better", "relief", "improved"],
    anxious: ["anxiety", "worry", "fearful"],
    anxiety: ["anxious", "worry", "nervousness", "fear"],
    appetite: ["hunger", "desire"],
    bloating: ["distension", "gas", "flatulence"],
    cold: ["chilly", "chilliness"],
    constipation: ["difficult stool", "hard stool", "infrequent stool"],
    craving: ["cravings", "desire", "longing"],
    cravings: ["craving", "desire", "longing"],
    desire: ["craving", "cravings", "longing"],
    diarrhoea: ["diarrhea", "loose stool", "watery stool"],
    diarrhea: ["diarrhoea", "loose stool", "watery stool"],
    distension: ["bloating", "gas", "flatulence"],
    fear: ["anxiety", "anxious", "terror"],
    flatulence: ["gas", "bloating", "distension"],
    gas: ["flatulence", "bloating", "distension"],
    gerd: ["reflux", "acidity", "heartburn"],
    grief: ["sadness", "sorrow"],
    headache: ["head pain", "cephalgia"],
    heartburn: ["acidity", "reflux", "gerd"],
    heat: ["hot", "warm"],
    insomnia: ["sleeplessness", "poor sleep"],
    irritability: ["irritable", "anger"],
    irritable: ["irritability", "anger"],
    menses: ["menstruation", "period"],
    nausea: ["vomiting sensation", "queasiness"],
    nervousness: ["anxiety", "anxious"],
    pain: ["ache", "aching"],
    palpitation: ["palpitations", "heart pounding"],
    palpitations: ["palpitation", "heart pounding"],
    period: ["menses", "menstruation"],
    reflux: ["gerd", "acidity", "heartburn"],
    restlessness: ["restless", "agitation"],
    sadness: ["grief", "sorrow"],
    sleep: ["insomnia", "sleeplessness"],
    stool: ["bowel movement", "motion"],
    stress: ["strain", "tension"],
    thirst: ["thirsty"],
    tiredness: ["fatigue", "weakness"],
    vomiting: ["emesis", "nausea"],
    weakness: ["fatigue", "tiredness"],
    worry: ["anxiety", "anxious"],
};
function addSymmetricEntry(target, token, synonym) {
    if (!target.has(token))
        target.set(token, new Set());
    target.get(token)?.add(synonym);
}
function buildSynonymMap(dictionary = exports.DEFAULT_CLINICAL_SYNONYMS) {
    const synonymMap = new Map();
    Object.entries(dictionary).forEach(([term, synonyms]) => {
        const termTokens = (0, tokenizer_1.uniqueTokens)(term);
        const synonymTokens = synonyms.flatMap((synonym) => (0, tokenizer_1.uniqueTokens)(synonym));
        termTokens.forEach((termToken) => {
            synonymTokens.forEach((synonymToken) => {
                if (termToken !== synonymToken)
                    addSymmetricEntry(synonymMap, termToken, synonymToken);
            });
        });
        synonymTokens.forEach((synonymToken) => {
            termTokens.forEach((termToken) => {
                if (termToken !== synonymToken)
                    addSymmetricEntry(synonymMap, synonymToken, termToken);
            });
        });
    });
    return synonymMap;
}
function expandTokensWithSynonyms(tokens, synonymMap = buildSynonymMap()) {
    const expanded = new Map();
    tokens.forEach((token) => {
        expanded.set(token, new Set(synonymMap.get(token) || []));
    });
    return expanded;
}
