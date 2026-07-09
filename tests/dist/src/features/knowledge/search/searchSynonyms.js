"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandQuery = exports.MISSSPELLINGS_MAP = exports.SYNONYM_MAP = void 0;
/**
 * Synonym expansion dictionary for the Clinical Knowledge Platform.
 * Maps layman terms, common misspellings, abbreviations, and medical terms.
 */
exports.SYNONYM_MAP = {
    // GERD & Reflux
    "gerd": ["gerd", "acidity", "heartburn", "acid reflux", "gastroesophageal reflux disease", "reflux", "pyrosis", "dyspepsia", "indigestion"],
    "acidity": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis", "dyspepsia", "indigestion"],
    "heartburn": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis"],
    "acid reflux": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis"],
    "reflux": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis"],
    "gastroesophageal reflux disease": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis"],
    "pyrosis": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis"],
    "indigestion": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis", "dyspepsia", "indigestion", "bloating", "flatulence"],
    "dyspepsia": ["gerd", "acidity", "heartburn", "acid reflux", "reflux", "pyrosis", "dyspepsia", "indigestion"],
    // IBS & Digestion
    "ibs": ["ibs", "irritable bowel syndrome", "spastic colon", "bloating", "flatulence", "colic", "constipation", "diarrhea"],
    "irritable bowel syndrome": ["ibs", "irritable bowel syndrome", "spastic colon", "bloating", "flatulence"],
    "spastic colon": ["ibs", "irritable bowel syndrome", "spastic colon", "bloating", "flatulence"],
    "bloating": ["ibs", "irritable bowel syndrome", "bloating", "flatulence", "gas", "indigestion"],
    "flatulence": ["ibs", "irritable bowel syndrome", "bloating", "flatulence", "gas", "indigestion"],
    "gas": ["ibs", "irritable bowel syndrome", "bloating", "flatulence", "gas", "indigestion"],
    "constipation": ["ibs", "constipation", "stools", "indigestion"],
    "diarrhea": ["ibs", "diarrhea", "loose motion", "stools"],
    // Eczema & Skin
    "eczema": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus", "dry skin"],
    "atopic dermatitis": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    "dermatitis": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    "skin rash": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    "skin eruption": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    "itching": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    "pruritus": ["eczema", "atopic dermatitis", "dermatitis", "skin rash", "skin eruption", "itching", "pruritus"],
    // Migraine & Headache
    "migraine": ["migraine", "headache", "cephalgia", "throbbing head", "hemicrania", "sick headache"],
    "headache": ["migraine", "headache", "cephalgia", "throbbing head", "hemicrania", "sick headache"],
    "cephalgia": ["migraine", "headache", "cephalgia", "throbbing head", "hemicrania", "sick headache"],
    "throbbing head": ["migraine", "headache", "cephalgia", "throbbing head", "hemicrania"],
    "hemicrania": ["migraine", "headache", "cephalgia", "throbbing head", "hemicrania"],
    // PCOS
    "pcos": ["pcos", "polycystic ovary syndrome", "polycystic ovarian disease", "pcod", "irregular periods", "ovarian cysts"],
    "pcod": ["pcos", "polycystic ovary syndrome", "pcod", "irregular periods"],
    "polycystic ovary syndrome": ["pcos", "polycystic ovary syndrome", "pcod", "irregular periods"],
    // Common Remedy Synonyms & Contractions
    "aconitum": ["aconitum napellus", "aconite", "monkshood"],
    "arnica": ["arnica montana", "leopard's bane", "bruises", "trauma"],
    "arsenicum": ["arsenicum album", "ars alb", "white arsenic"],
    "belladonna": ["atropa belladonna", "deadly nightshade"],
    "bryonia": ["bryonia alba", "wild hops"],
    "calc carb": ["calcarea carbonica", "oyster shell"],
    "carbo veg": ["carbo vegetabilis", "vegetable charcoal"],
    "gelsemium": ["gelsemium sempervirens", "yellow jasmine"],
    "hepar sulph": ["hepar sulphuris calcareum", "calcium sulfide"],
    "ignatia": ["ignatia amara", "st ignatius bean"],
    "kali bich": ["kali bichromicum", "potassium bichromate"],
    "merc sol": ["mercurius solubilis", "mercury solubilis"],
    "nat mur": ["natrum muriaticum", "common salt", "sodium chloride"],
    "phos": ["phosphorus"],
    "rhus tox": ["rhus toxicodendron", "poison ivy"],
    "sepia": ["sepia officinalis", "cuttlefish ink"],
    "silicea": ["silicea terra", "pure silica", "silica"],
    "thuja": ["thuja occidentalis", "arbor vitae"],
    // Common Lab Investigation Abbreviations
    "cbc": ["cbc", "complete blood count", "blood test", "hemoglobin", "platelets", "white blood cells", "red blood cells"],
    "complete blood count": ["cbc", "complete blood count", "blood test", "hemoglobin"],
    "esr": ["esr", "erythrocyte sedimentation rate", "inflammation", "blood test"],
    "crp": ["crp", "c-reactive protein", "inflammation test", "blood test"],
    "hba1c": ["hba1c", "glycated hemoglobin", "average blood glucose", "diabetes test"],
    "tsh": ["tsh", "thyroid stimulating hormone", "thyroid test", "hypothyroidism", "hyperthyroidism", "thyroid"],
    "thyroid stimulating hormone": ["tsh", "thyroid stimulating hormone", "thyroid test", "thyroid"],
    "lft": ["lft", "liver function test", "bilirubin", "sgot", "sgpt", "liver panel"],
    "kft": ["kft", "kidney function test", "renal function test", "creatinine", "blood urea nitrogen", "kidney panel"],
    "renal function test": ["kft", "kidney function test", "creatinine", "renal panel"],
    // Scale-up additions
    "anemia": ["anemia", "blood deficiency", "low hemoglobin", "iron deficiency", "weak blood"],
    "vitamin d": ["vitamin d", "sunshine vitamin", "cholecalciferol", "vit d"],
    "vitamin b12": ["vitamin b12", "cobalamin", "vit b12", "methylcobalamin"],
    "low back pain": ["low back pain", "lumbago", "back ache", "lumbar strain"],
    "recurrent cold": ["recurrent cold", "frequent cold", "susceptible to cold", "chronic runny nose"],
    "burning urination": ["burning urination", "dysuria", "painful urine", "urine burn"],
    "menstrual irregularity": ["menstrual irregularity", "pcod periods", "irregular periods", "delayed periods"],
    "ana": ["ana", "antinuclear antibodies", "autoimmune screen"],
    "psa": ["psa", "prostate specific antigen", "prostate test"],
    "anti-tpo": ["anti-tpo", "thyroid antibodies", "anti-tpo antibodies", "hashimotos"]
};
/**
 * Common misspellings mapper.
 */
exports.MISSSPELLINGS_MAP = {
    "migrane": "migraine",
    "headach": "headache",
    "ezcema": "eczema",
    "egzema": "eczema",
    "ecxema": "eczema",
    "acidityy": "acidity",
    "heratburn": "heartburn",
    "heatburn": "heartburn",
    "reflx": "reflux",
    "sulfur": "sulphur",
    "nuxvomica": "nux-vomica",
    "lycopodum": "lycopodium",
    "licopodium": "lycopodium",
    "hba1c": "hba1c",
    "hbac1": "hba1c",
    "pcos": "pcos",
    "pcod": "pcod"
};
/**
 * Expands query text into an array of related search terms using synonyms and misspelling corrections.
 */
const expandQuery = (query) => {
    const words = query
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 1);
    const expanded = [];
    for (const word of words) {
        // Add original word
        expanded.push(word);
        // Apply spelling correction
        const corrected = exports.MISSSPELLINGS_MAP[word];
        if (corrected) {
            expanded.push(corrected);
        }
        // Apply synonym mapping
        const lookupWord = corrected || word;
        const synonyms = exports.SYNONYM_MAP[lookupWord];
        if (synonyms) {
            expanded.push(...synonyms);
        }
    }
    return Array.from(new Set(expanded));
};
exports.expandQuery = expandQuery;
