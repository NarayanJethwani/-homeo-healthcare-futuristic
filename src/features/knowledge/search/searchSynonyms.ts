/**
 * Synonym expansion dictionary for the Clinical Knowledge Platform.
 * Maps layman terms, common misspellings, abbreviations, and medical terms.
 */
export const SYNONYM_MAP: Record<string, string[]> = {
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
  "dandruff": ["dandruff", "scalp flakes", "flaky scalp", "itchy scalp", "pityriasis capitis", "seborrheic dermatitis"],
  "scalp flakes": ["dandruff", "scalp flakes", "flaky scalp", "itchy scalp", "pityriasis capitis"],
  "flaky scalp": ["dandruff", "scalp flakes", "flaky scalp", "itchy scalp", "pityriasis capitis"],
  "itchy scalp": ["dandruff", "scalp flakes", "flaky scalp", "itchy scalp", "seborrheic dermatitis"],
  "hives": ["urticaria", "hives", "raised itchy rash", "welts", "angioedema", "allergy rash"],
  "urticaria": ["urticaria", "hives", "raised itchy rash", "welts", "angioedema", "allergy rash"],
  "welts": ["urticaria", "hives", "raised itchy rash", "welts", "allergy rash"],
  "seborrheic dermatitis": ["seborrheic dermatitis", "dandruff", "greasy scalp", "facial flakes", "flaky eyebrows", "scalp dermatitis"],
  "greasy scalp": ["seborrheic dermatitis", "dandruff", "greasy scalp", "facial flakes", "scalp dermatitis"],
  "flaky eyebrows": ["seborrheic dermatitis", "facial flakes", "flaky eyebrows", "dandruff"],
  "intertrigo": ["intertrigo", "skin fold rash", "chafing rash", "sweat rash", "fungal fold rash"],
  "skin fold rash": ["intertrigo", "skin fold rash", "chafing rash", "sweat rash", "fungal fold rash"],
  "chafing rash": ["intertrigo", "skin fold rash", "chafing rash", "sweat rash"],
  "dry skin": ["dry skin", "xerosis", "flaky skin", "rough skin", "itchy dry skin", "skin barrier"],
  "xerosis": ["dry skin", "xerosis", "flaky skin", "rough skin", "itchy dry skin"],
  "flaky skin": ["dry skin", "xerosis", "flaky skin", "rough skin", "itchy dry skin"],
  "rough skin": ["dry skin", "xerosis", "flaky skin", "rough skin", "itchy dry skin"],
  "contact dermatitis": ["contact dermatitis", "skin allergy", "irritant rash", "allergic rash", "fragrance allergy", "nickel allergy"],
  "skin allergy": ["contact dermatitis", "skin allergy", "allergic rash", "fragrance allergy", "nickel allergy"],
  "irritant rash": ["contact dermatitis", "irritant rash", "skin allergy", "allergic rash"],
  "ringworm": ["ringworm", "tinea corporis", "fungal skin infection", "itchy ring rash", "circular rash"],
  "tinea": ["ringworm", "tinea corporis", "fungal skin infection", "itchy ring rash"],
  "fungal skin infection": ["ringworm", "tinea corporis", "fungal skin infection", "itchy ring rash"],
  "athlete's foot": ["athlete's foot", "athletes foot", "tinea pedis", "foot fungus", "itchy toes", "peeling between toes"],
  "athletes foot": ["athlete's foot", "athletes foot", "tinea pedis", "foot fungus", "itchy toes", "peeling between toes"],
  "tinea pedis": ["athlete's foot", "athletes foot", "tinea pedis", "foot fungus", "itchy toes", "peeling between toes"],
  "foot fungus": ["athlete's foot", "athletes foot", "tinea pedis", "foot fungus", "itchy toes", "peeling between toes"],
  "jock itch": ["jock itch", "tinea cruris", "fungal groin rash", "itchy inner thigh", "groin rash"],
  "tinea cruris": ["jock itch", "tinea cruris", "fungal groin rash", "itchy inner thigh", "groin rash"],
  "fungal groin rash": ["jock itch", "tinea cruris", "fungal groin rash", "itchy inner thigh", "groin rash"],
  "tinea versicolor": ["tinea versicolor", "pityriasis versicolor", "patchy skin colour", "white patches on back", "discoloured skin patches"],
  "pityriasis versicolor": ["tinea versicolor", "pityriasis versicolor", "patchy skin colour", "white patches on back", "discoloured skin patches"],
  "white patches on back": ["tinea versicolor", "pityriasis versicolor", "white patches on back", "patchy skin colour", "discoloured skin patches"],
  "patchy skin colour": ["tinea versicolor", "pityriasis versicolor", "patchy skin colour", "white patches on back", "discoloured skin patches"],

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
  "cbc": ["cbc", "complete blood count", "full blood count", "blood test", "hemoglobin", "haemoglobin", "platelets", "white blood cells", "red blood cells"],
  "complete blood count": ["cbc", "complete blood count", "full blood count", "blood test", "hemoglobin", "haemoglobin"],
  "esr": ["esr", "erythrocyte sedimentation rate", "inflammation", "blood test"],
  "crp": ["crp", "c-reactive protein", "inflammation test", "blood test"],
  "hba1c": ["hba1c", "glycated hemoglobin", "average blood glucose", "diabetes test"],
  "tsh": ["tsh", "thyroid stimulating hormone", "thyroid test", "hypothyroidism", "hyperthyroidism", "thyroid"],
  "thyroid stimulating hormone": ["tsh", "thyroid stimulating hormone", "thyroid test", "thyroid"],
  "lft": ["lft", "liver function test", "bilirubin", "sgot", "sgpt", "liver panel"],
  "kft": ["kft", "kidney function test", "renal function test", "creatinine", "blood urea nitrogen", "kidney panel"],
  "renal function test": ["kft", "kidney function test", "creatinine", "renal panel"],

  // Scale-up additions
  "anemia": ["anemia", "anaemia", "blood deficiency", "low hemoglobin", "low haemoglobin", "iron deficiency", "weak blood"],
  "anaemia": ["anemia", "anaemia", "blood deficiency", "low hemoglobin", "low haemoglobin", "iron deficiency", "weak blood"],
  "vitamin d": ["vitamin d", "vitamin d deficiency", "low vitamin d", "sunshine vitamin", "cholecalciferol", "vit d"],
  "low vitamin d": ["vitamin d", "vitamin d deficiency", "low vitamin d", "low d", "25 oh d", "25 hydroxyvitamin d"],
  "vitamin b12": ["vitamin b12", "vitamin b12 deficiency", "low b12", "cobalamin", "vit b12", "methylcobalamin"],
  "low b12": ["vitamin b12", "vitamin b12 deficiency", "low b12", "cobalamin", "methylcobalamin", "b12 test"],
  "low back pain": ["low back pain", "lumbago", "back ache", "lumbar strain"],
  "recurrent cold": ["recurrent cold", "frequent cold", "susceptible to cold", "chronic runny nose"],
  "burning urination": ["burning urination", "dysuria", "painful urine", "urine burn"],
  "menstrual irregularity": ["menstrual irregularity", "pcod periods", "irregular periods", "delayed periods"],
  "ana": ["ana", "antinuclear antibodies", "autoimmune screen"],
  "psa": ["psa", "prostate specific antigen", "prostate test"],
  "anti-tpo": ["anti-tpo", "thyroid antibodies", "anti-tpo antibodies", "hashimotos"]
};

/**
 * Intent phrases make symptom-first, natural-language questions useful without
 * requiring a visitor to know the medical name of a condition.
 */
const PHRASE_SYNONYMS: Record<string, string[]> = {
  "burning in chest after food": ["heartburn", "acid reflux", "gerd"],
  "burning in chest after eating": ["heartburn", "acid reflux", "gerd"],
  "why is my tsh high": ["tsh", "thyroid", "hypothyroidism"],
  "hair is falling": ["hair fall", "alopecia", "thyroid"],
  "hair loss": ["hair fall", "alopecia", "thyroid"],
  "why am i dizzy": ["dizziness", "vertigo"],
  "headache with nausea": ["migraine", "headache"],
  "stomach pain after eating": ["indigestion", "acid reflux", "gastritis"],
  "what does low vitamin d mean": ["vitamin d", "vitamin d deficiency", "25 hydroxyvitamin d"],
  "do i need a vitamin d test": ["vitamin d", "vitamin d deficiency", "25 hydroxyvitamin d"],
  "why am i tired and low vitamin d": ["vitamin d", "vitamin d deficiency", "fatigue", "anemia", "thyroid"],
  "what does low b12 mean": ["vitamin b12", "vitamin b12 deficiency", "cobalamin", "b12 test"],
  "why are my hands and feet tingling": ["vitamin b12", "peripheral neuropathy", "diabetes", "thyroid"],
  "do i need a b12 test": ["vitamin b12", "vitamin b12 deficiency", "cobalamin"],
  "what does low hemoglobin mean": ["anemia", "anaemia", "cbc", "ferritin", "iron deficiency"],
  "why am i tired and dizzy": ["anemia", "anaemia", "fatigue", "dizziness", "thyroid"],
  "should i take iron tablets": ["anemia", "anaemia", "iron deficiency", "ferritin"],
  "what does my cbc mean": ["cbc", "complete blood count", "blood test"],
  "how do i read a blood test report": ["cbc", "complete blood count", "hemoglobin", "platelets", "white blood cells"],
  "why is my hemoglobin low": ["anemia", "anaemia", "cbc", "ferritin", "iron deficiency"],
  "why is my scalp flaky": ["dandruff", "scalp flakes", "itchy scalp", "seborrheic dermatitis"],
  "why is my scalp itchy": ["dandruff", "itchy scalp", "scalp flakes", "seborrheic dermatitis"],
  "why do i get hives": ["urticaria", "hives", "raised itchy rash", "allergy rash"],
  "raised itchy rash": ["urticaria", "hives", "skin rash", "itching"],
  "why are my eyebrows flaky": ["seborrheic dermatitis", "flaky eyebrows", "dandruff", "facial flakes"],
  "why is my face flaky": ["seborrheic dermatitis", "facial flakes", "dandruff", "eczema"],
  "why do i get a rash in skin folds": ["intertrigo", "skin fold rash", "chafing rash", "fungal fold rash"],
  "rash under skin folds": ["intertrigo", "skin fold rash", "chafing rash", "fungal fold rash"],
  "why is my skin so dry": ["dry skin", "xerosis", "itchy dry skin", "eczema"],
  "dry itchy skin": ["dry skin", "xerosis", "itchy dry skin", "eczema", "skin rash"],
  "what kind of rash is this": ["skin rash", "eczema", "urticaria", "contact dermatitis"],
  "rash with fever": ["skin rash", "fever"],
  "rash after using a new product": ["contact dermatitis", "skin allergy", "irritant rash", "skin rash"],
  "rash from perfume": ["contact dermatitis", "fragrance allergy", "skin allergy"],
  "ring shaped itchy rash": ["ringworm", "tinea corporis", "fungal skin infection"],
  "is ringworm contagious": ["ringworm", "tinea corporis", "fungal skin infection"],
  "why are my toes itchy and peeling": ["athlete's foot", "tinea pedis", "foot fungus", "peeling between toes"],
  "is athletes foot contagious": ["athlete's foot", "tinea pedis", "foot fungus"],
  "why is my inner thigh itchy and scaly": ["jock itch", "tinea cruris", "fungal groin rash", "itchy inner thigh"],
  "is jock itch contagious": ["jock itch", "tinea cruris", "fungal groin rash"],
  "why do i have white patches on my back": ["tinea versicolor", "pityriasis versicolor", "white patches on back", "patchy skin colour"],
  "patches on my chest that do not tan": ["tinea versicolor", "pityriasis versicolor", "patchy skin colour"],
};

/**
 * Common misspellings mapper.
 */
export const MISSSPELLINGS_MAP: Record<string, string> = {
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
export const expandQuery = (query: string): string[] => {
  const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const words = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 1);

  const expanded: string[] = [];

  Object.entries(PHRASE_SYNONYMS).forEach(([phrase, synonyms]) => {
    if (normalizedQuery.includes(phrase)) expanded.push(...synonyms);
  });

  for (const word of words) {
    // Add original word
    expanded.push(word);

    // Apply spelling correction
    const corrected = MISSSPELLINGS_MAP[word];
    if (corrected) {
      expanded.push(corrected);
    }

    // Apply synonym mapping
    const lookupWord = corrected || word;
    const synonyms = SYNONYM_MAP[lookupWord];
    if (synonyms) {
      expanded.push(...synonyms);
    }
  }

  return Array.from(new Set(expanded));
};
