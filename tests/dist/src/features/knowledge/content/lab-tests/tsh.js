"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TshLabTest = void 0;
exports.TshLabTest = {
    id: "L0002",
    slug: "tsh",
    entityType: "lab-test",
    editorialStatus: "published",
    versionInfo: {
        version: "1.0.0",
        created: "2026-06-30T12:00:00Z",
        updated: "2026-06-30T12:00:00Z",
        reviewed: "2026-06-30T12:00:00Z"
    },
    title: {
        en: "Thyroid Stimulating Hormone (TSH)",
        hi: "थायराइड उत्तेजक हार्मोन (टीएसएच)",
        gu: "થાઇરોઇડ હોર્મોન તપાસ (TSH)",
        mr: "थायरॉईड टेस्ट (TSH)",
        es: "Hormona Estimulante de la Tiroides (TSH)",
        ar: "هرمون الغدة الدرقية (TSH)"
    },
    summary: {
        en: "A diagnostic blood test measuring TSH levels to screen for thyroid dysfunction, including hypothyroidism (underactive) and hyperthyroidism (overactive).",
        hi: "एक रक्त जांच जो थायराइड ग्रंथि की कार्यप्रणाली का आकलन करने के लिए टीएसएच स्तर को मापती है.",
        gu: "લોહીની તપાસ જે થાઇરોઇડ ગ્રંથિની સક્રિયતા માપે છે, હાઇપો કે હાઇપર થાઇરોઇડ નક્કી કરવા.",
        mr: "थायरॉईड ग्रंथीचे कार्य मोजण्यासाठी रक्तातील टीएसएच संप्रेरकाची तपासणी.",
        es: "Un análisis de sangre para evaluar la función tiroidea midiendo los niveles de TSH.",
        ar: "فحص دم تشخيصي يقيس مستويات TSH للكشف عن خلل الغدة الدرقية."
    },
    content: {
        "overview": "TSH: A specialized laboratory marker or endocrine hormone measurement used to evaluate thyroid gland function, metabolic control, and autoimmune thyroid activity.",
        "normalRange": "TSH: 0.45 - 4.5 uIU/mL; Free T4: 0.8 - 1.8 ng/dL; Free T3: 2.3 - 4.2 pg/mL; Anti-TPO: < 9.0 IU/mL.",
        "highValues": [
            "Primary hypothyroidism (elevated TSH)",
            "Thyrotoxicosis or Graves' disease (elevated Free T4/T3)",
            "Active autoimmune thyroiditis (elevated Anti-TPO / Anti-Tg)"
        ],
        "lowValues": [
            "Hyperthyroidism or secondary hypothyroidism (low TSH)",
            "Overt hypothyroidism (low Free T4/T3)",
            "Non-thyroidal illness syndrome"
        ],
        "clinicalInterpretation": "TSH evaluation: Elevated TSH with low Free T4 indicates primary hypothyroidism. Conversely, low TSH with high Free T4/T3 confirms hyperthyroidism. Elevated Anti-TPO indicates autoimmune thyroid disease.",
        "references": [
            "CIT-0012",
            "CIT-0013",
            "CIT-0014"
        ],
        "faqs": [
            {
                "question": "What causes autoimmune thyroid flares?",
                "answer": "Thyroid autoantibody flares are typically triggered by systemic immune dysregulation, chronic physical or emotional stress, high iodine intake, or underlying genetic susceptibility."
            },
            {
                "question": "Can thyroid status affect weight and energy levels?",
                "answer": "Yes. Thyroid hormones regulate the body's metabolic rate. Hypothyroidism slows metabolism leading to weight gain and fatigue, while hyperthyroidism accelerates it."
            },
            {
                "question": "What is the role of homeopathy in thyroid health?",
                "answer": "Homeopathic care utilizes constitutional remedies to optimize the body's self-regulatory mechanisms and support endocrine balance, always evaluated in conjunction with standard lab monitoring."
            }
        ]
    },
    author: {
        name: "Dr. Narayan Jethwani",
        credentials: "MD (Hom)"
    },
    reviewer: {
        name: "Dr. Narayan Jethwani",
        credentials: "MD (Hom)",
        specialty: "Endocrinology & Clinical Diagnostics",
        institution: "Homeo Healthcare Clinic"
    },
    evidenceLevel: "Level-A",
    tags: ["TSH", "Thyroid", "Hormone", "Blood Test", "Diagnostics"],
    canonicalUrl: "https://homeo.healthcare/knowledge/lab-tests/tsh",
    readingTimeMinutes: 5,
    audience: "patient",
    license: "CC BY-NC-ND 4.5",
    clinicalPearl: "TSH fluctuates diurnally, peaking overnight. A borderline elevation should always be confirmed with an early morning repeat specimen.",
    quickFacts: {
        "Specimen Type": "Venous Blood (Serum)",
        "Preparation": "Fasting optional; early morning draw is preferred",
        "Turnaround Time": "12–24 Hours",
        "Clinical Category": "Endocrine Screen"
    },
    aiReadiness: {
        retrievalSummary: "Thyroid Stimulating Hormone (TSH) is a pituitary glycoprotein that stimulates secretion of thyroxine (T4) and triiodothyronine (T3), serving as the primary diagnostic screen for thyroid disorders.",
        clinicalSummary: "TSH is secreted by thyrotropes in the anterior pituitary under TRH stimulation. It binds to the G-protein coupled TSH receptor (TSHR) on thyroid follicular cells, initiating thyroglobulin synthesis and iodination.",
        patientSummary: "TSH is a hormone from your brain that tells your thyroid to work. High levels suggest your thyroid is underactive; low levels suggest it is overactive.",
        studentSummary: "Serum TSH is the most sensitive biomarker for primary hypothyroidism (elevated) and primary hyperthyroidism (suppressed) due to the log-linear relationship between TSH and free thyroid hormones.",
        keywords: ["tsh", "thyroid stimulating hormone", "thyrotropin", "pituitary thyroid feedback", "hypothyroidism screen"],
        semanticKeywords: ["thyroid regulator", "endocrine feedforward", "pituitary control"],
        icd: "R79.89",
        bodySystem: "Endocrine",
        urgency: "routine"
    },
    visualBodySystem: {
        system: "Endocrine",
        organs: ["Pituitary Gland", "Thyroid Gland"],
        hormones: ["TSH", "TRH", "T4", "T3"]
    },
    structuredEvidence: {
        system: "Endocrine",
        prevalence: "Standard endocrine biomarker",
        typicalAge: "All age groups",
        causes: [
            "Primary thyroid gland failure (elevated TSH)",
            "Pituitary adenoma or central failure (suppressed/low TSH)"
        ],
        investigations: ["Free T4", "Free T3", "Anti-TPO Autoantibodies"],
        urgency: "routine"
    },
    interpretationAlgorithm: {
        title: "Clinician TSH Interpretation Flowchart",
        steps: [
            {
                label: "Measure initial serum TSH level",
                type: "action"
            },
            {
                label: "Is TSH level elevated (> 4.5 mIU/L)?",
                type: "question",
                options: [
                    { value: "Yes", nextStepLabel: "Evaluate Free T4" },
                    { value: "No", nextStepLabel: "Check for low TSH (< 0.4 mIU/L)" }
                ]
            },
            {
                label: "Measure Free T4 level",
                type: "action"
            },
            {
                label: "Is Free T4 level decreased?",
                type: "question",
                options: [
                    { value: "Yes", nextStepLabel: "Confirm Primary Hypothyroidism" },
                    { value: "No", nextStepLabel: "Subclinical Hypothyroidism" }
                ]
            },
            {
                label: "Screen for Anti-TPO autoantibodies to evaluate for autoimmune etiology (Hashimoto's)",
                type: "consideration"
            },
            {
                label: "Correlate with clinical findings (hypometabolic symptoms, bradycardia) to guide care",
                type: "consideration"
            }
        ]
    },
    aiKnowledge: {
        retrievalSummary: "Laboratory reference guide for Thyroid Stimulating Hormone (TSH) testing protocols, physiological pituitary-thyroid feedback loops, and clinical diagnostic interpretations.",
        differentialSummary: "Distinguish between primary thyroid dysfunction (high TSH / low FT4) and subclinical states or central pituitary disorders.",
        practitionerSummary: "Practitioner resource on TSH monitoring guidelines. Details log-linear feedback, diurnal rhythms, and autoantibody anti-TPO cross-screening criteria.",
        patientSummary: "Understand TSH lab reports. High values generally point to an underactive thyroid, while low values suggest an overactive gland.",
        educationalSummary: "Study guide detailing thyrotrope cell function, TRH-induced TSH release mechanisms, and diagnostic interpretation algorithms.",
        graphContext: "Central laboratory node. Connects to Hypothyroidism (D0011), Hyperthyroidism (D0012), Free T4 (L0036), and Anti-TPO (L0039).",
        embeddingText: "tsh thyroid stimulating hormone thyrotropin laboratory blood test range endocrine hypothyroid hyperthyroid feedback"
    },
    knowledgeEmbedding: {
        overview: "Thyroid Stimulating Hormone (TSH) is a glycoprotein hormone synthesized and secreted by thyrotropes in the anterior pituitary gland, regulating thyroid hormone production.",
        pathology: "TSH secretion is highly sensitive to negative feedback from thyroid hormones (T4/T3). Pathological states manifest as secondary elevations or suppressions.",
        diagnosis: "TSH is the gold-standard screening parameter for primary hypo- and hyper-thyroidism.",
        investigations: "Used alongside Free T4, Free T3, and anti-thyroid antibodies to fully delineate thyroid function.",
        differentialDiagnosis: "Helps differentiate primary thyroid failure from subclinical thyroid disease, pituitary insufficiency, or euthyroid sick syndrome.",
        managementOverview: "Guides dosage adjustment of levothyroxine in hypothyroidism and antithyroid medications in hyperthyroidism.",
        homeopathicPerspective: "Evaluated as a systemic vital marker representing the regulatory stress on the neuro-endocrine axis.",
        complications: "Abnormal TSH reflects systemic complications such as cardiovascular disease, dyslipidemias, and osteoporosis (if hyperthyroid).",
        prognosis: "Excellent tracking tool; longitudinal stabilization corresponds with constitutional homeostatic recovery.",
        patientEducation: "Instructs patients on proper fasting compliance and avoiding biotin supplements prior to venipuncture.",
        graphContext: "Main thyroid marker node. Intersects with T3, T4, thyroid autoantibodies, and constitutional remedies.",
        semanticKeywords: ["tsh", "thyrotropin", "thyroid stimulating hormone", "euthyroid", "pituitary feedback"],
        embeddingText: "tsh thyroid stimulating hormone laboratory reference ranges subclinical hypothyroidism hyperthyroidism pituitary"
    },
    qualityScore: {
        editorialQuality: 5,
        clinicalDepth: 95,
        graphConnectivity: 96,
        citationQuality: 92,
        educationalValue: 95,
        aiReadiness: 100,
        seoReadiness: 97
    }
};
