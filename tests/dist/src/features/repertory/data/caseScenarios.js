"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLINICAL_CASE_SCENARIOS = void 0;
exports.CLINICAL_CASE_SCENARIOS = [
    {
        caseId: "case_01_aconite_panic",
        title: "Sudden Panic and Death Terror",
        difficulty: "easy",
        intakeText: "Suddenly felt a violent panic, heart pounding, convinced I was going to die right then. Desperately wanted cold fresh air.",
        expectedRemedyId: "Acon",
        expectedRubrics: ["jeth_rb_panic_death_terror", "jeth_rb_amel_open_air"],
        rationale: "Aconite is indicated for sudden, intense panic with extreme fear of death. For clinician review."
    },
    {
        caseId: "case_02_ignatia_grief",
        title: "Silent Grief and Sighing",
        difficulty: "easy",
        intakeText: "Have been carrying silent grief since my sister passed. Sighing all the time, feel a lump in my throat, cannot talk about it.",
        expectedRemedyId: "Ign",
        expectedRubrics: ["jeth_rb_grief_silent", "jeth_rb_ailments_from_grief"],
        rationale: "Ignatia is the classic remedy for silent grief, sighing, and lump in the throat. For clinician review."
    },
    {
        caseId: "case_03_nux_reflux",
        title: "Impatient Workaholic with Acid Reflux",
        difficulty: "moderate",
        intakeText: "Stressed from work, drinking constant coffee, waking at 3 AM thinking of my business. Retrosternal burning after meals.",
        expectedRemedyId: "Nux-v",
        expectedRubrics: ["jeth_rb_wakes_3am_business", "jeth_rb_acid_reflux_heartburn"],
        rationale: "Nux Vomica fits the workaholic profile waking at 3 AM with irritability and acid reflux. For clinician review."
    },
    {
        caseId: "case_04_gels_fatigue",
        title: "Post-Viral Fatigue and Muscle Heavy weakness",
        difficulty: "moderate",
        intakeText: "Never recovered after my flu last winter. Muscles feel incredibly heavy, eyes feel droopy and dazed, trembling from least effort.",
        expectedRemedyId: "Gels",
        expectedRubrics: ["jeth_rb_post_viral_fatigue", "jeth_rb_weakness_sudden"],
        rationale: "Gelsemium corresponds to post-viral fatigue with heavy limbs, droopy eyelids, and dazed weakness. For clinician review."
    },
    {
        caseId: "case_05_sulph_eczema",
        title: "Itching Eczema Worse from Bed Warmth",
        difficulty: "easy",
        intakeText: "Unbearable dry itching rash on my skin, worse from the warmth of the bed at night, scratch until it bleeds.",
        expectedRemedyId: "Sulph",
        expectedRubrics: ["jeth_rb_eczema_itching_scratching", "jeth_rb_warm_blooded"],
        rationale: "Sulphur is indicated for dry, intensely itching eczema worse from bed warmth. For clinician review."
    },
    {
        caseId: "case_06_coloc_anger",
        title: "Cramping Abdominal Pain after Suppressed Anger",
        difficulty: "moderate",
        intakeText: "Had a huge argument with my boss, kept my rage bottled up. Now have severe cramping stomach pain, relieved by bending double and firm pressure.",
        expectedRemedyId: "Coloc",
        expectedRubrics: ["jeth_rb_ailments_from_anger"],
        rationale: "Colocynthis is indicated for ailments from anger, especially cramping pains relieved by bending double and firm pressure. For clinician review."
    },
    {
        caseId: "case_07_lach_climacteric",
        title: "Left-sided Hot Flashes Worse After Sleep",
        difficulty: "complex",
        intakeText: "Severe hot flushes since menopause, worse after sleep, mostly on the left side. Cannot tolerate any tight necklaces or collars.",
        expectedRemedyId: "Lach",
        expectedRubrics: ["jeth_rb_hot_flushes_climacteric", "jeth_rb_sleep_aggravation", "jeth_rb_left_sided"],
        rationale: "Lachesis features menopausal hot flushes, left-sided symptoms, sleep aggravation, and neck sensitivity. For clinician review."
    },
    {
        caseId: "case_08_lyc_bloating",
        title: "Right-sided Gas Bloating and Sweet Craving",
        difficulty: "complex",
        intakeText: "Bloated immediately after eating just a few bites. Gas fills the right side of my lower stomach, worse from 4 to 8 PM. Craving hot sweet drinks.",
        expectedRemedyId: "Lyc",
        expectedRubrics: ["jeth_rb_ibs_bloating", "jeth_rb_right_sided", "jeth_rb_craves_sweets"],
        rationale: "Lycopodium covers right-sided symptoms, bloating soon after eating, 4-8 PM aggravation, and sweet cravings. For clinician review."
    },
    {
        caseId: "case_09_sil_chilliness",
        title: "Chilly Sensitive to Drafts Wrapping Head",
        difficulty: "moderate",
        intakeText: "Chilly to the bone, sensitive to any cold draft. Need to wrap my head up warmly.",
        expectedRemedyId: "Sil",
        expectedRubrics: ["jeth_rb_chilly_sensitive", "jeth_rb_extreme_chilliness"],
        rationale: "Silicea is characterized by extreme chilliness, sensitivity to cold/drafts, and amelioration from warm wrapping. For clinician review."
    },
    {
        caseId: "case_10_natm_grief_salt",
        title: "Chronic Grief Headache and Salt Craving",
        difficulty: "complex",
        intakeText: "Deeply depressed after emotional loss years ago. Prone to severe headaches in the sun, cracked lips, and strong salt cravings.",
        expectedRemedyId: "Nat-m",
        expectedRubrics: ["jeth_rb_grief_silent", "jeth_rb_craves_salt"],
        rationale: "Natrum Muriaticum corresponds to silent grief, salt cravings, sun-aggravated headaches, and cracked lips. For clinician review."
    },
    {
        caseId: "case_11_phos_bleeding",
        title: "Hemorrhagic Diathesis with Sudden Weakness",
        difficulty: "moderate",
        intakeText: "Easy bruising and frequent nosebleeds. Small cuts bleed forever, leaving me suddenly weak. Desiring ice-cold water.",
        expectedRemedyId: "Phos",
        expectedRubrics: ["jeth_rb_haemorrhagic_diathesis", "jeth_rb_weakness_sudden", "jeth_rb_craves_cold_drinks"],
        rationale: "Phosphorus is indicated for hemorrhagic diathesis, easy bleeding, and cold drink cravings. For clinician review."
    },
    {
        caseId: "case_12_rhust_stiffness",
        title: "Stiff Joints Better Continuous Movement",
        difficulty: "easy",
        intakeText: "Stiff joints and backache, terrible when first getting up from bed, but much better after walking around for a while.",
        expectedRemedyId: "Rhus-t",
        expectedRubrics: ["jeth_rb_motion_amelioration", "jeth_rb_motion_aggravation"],
        rationale: "Rhus Tox is defined by stiffness worse on beginning motion but better by continuous movement. For clinician review."
    }
];
