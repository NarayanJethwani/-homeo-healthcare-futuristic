import { KnowledgeEntity } from "../../types";

export const HyperthyroidismDisease: KnowledgeEntity = {
  id: "D0012",
  slug: "hyperthyroidism",
  entityType: "disease",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Hyperthyroidism & Thyrotoxicosis (Overactive Thyroid & Graves' Disease)",
    hi: "हाइपरथायरायडिज्म / थायराइड हार्मोन की अधिकता (Hyperthyroidism / Thyrotoxicosis)",
    gu: "હાઈપરથાઈરોઈડિઝમ / થાઈરોઈડ હોર્મોનનું વધુ પડતું ઉત્પાદન (Hyperthyroidism)",
    mr: "हायपरथायरॉईडीझम / थायरॉईड संप्रेरकांचे अतिउत्पादन (Hyperthyroidism)",
    es: "Hipertiroidismo y Tirotoxicosis (Enfermedad de Graves)",
    ar: "فرط نشاط الغدة الدرقية والانسمام الدرقي (Hyperthyroidism)"
  },
  summary: {
    en: "An authoritative clinical and educational profile of Hyperthyroidism and Thyrotoxicosis, covering TSH-receptor autoantibody (TRAb) stimulation, autonomous thyroid nodular hypersecretion, hypermetabolic state, constitutional homeopathic supportive management, and emergency red flags for life-threatening Thyroid Storm (thyrotoxic crisis), atrial fibrillation, and acute heart failure.",
    hi: "हाइपरथायरायडिज्म (थायराइड ग्रंथि की अतिसक्रियता) का टीएसएच-रिसेप्टर ऑटोएंटीबॉडी (TRAb) पैथोलॉजी, हाइपरमेटाबॉलिक स्थिति, वजन घटना, दिल की धड़कन तेज होना, पारंपरिक संवैधानिक होम्योपैथिक प्रबंधन, और थायराइड स्टॉर्म (Thyroid Storm) व एट्रियल फिब्रिलेशन की आपातकालीन सुरक्षा सीमाओं सहित प्रामाणिक विवरण.",
    gu: "હાઈપરથાઈરોઈડિઝમ (વધુ પડતો થાઈરોઈડ સ્ત્રાવ) ની પેથોલોજી, અચાનક વજન ઘટવું, હૃદયના ધબકારા વધવા, ગરમી સહન ન થવી, પરંપરાગત હોમિયોપેથીક સહાયક સારવાર અને થાઈરોઈડ સ્ટોર્મ (Thyroid Storm) ની જીવલેણ ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "हायपरथायरॉईडीझम (थायरॉईड ग्रंथीची अतिसक्रियता), वजन कमी होणे, धडधड वाढणे, उष्णता सहन न होणे, पारंपरिक होमिओपॅथिक पद्धत आणि थायरॉईड स्टॉर्मच्या (Thyroid Storm) आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado del hipertiroidismo y tirotoxicosis que cubre la estimulación por TRAb, estado hipermetabólico, taquiarritmias, manejo homeopático complementario y banderas rojas de tormenta tiroidea y fibrilación auricular.",
    ar: "دليل سريري وتعليمي موثوق لفرط نشاط الغدة الدرقية والانسمام الدرقي يغطي تحفيز الأجسام المضادة لمستقبلات TSH والحالة فرط الاستقلابية والرعاية التكميلية وعلامات الخطر للعاصفة الدرقية والرجفان الأذيني."
  },
  content: {
    overview:
      "Hyperthyroidism is a hypermetabolic clinical syndrome characterized by inappropriately high synthesis and secretion of thyroid hormones (triiodothyronine [T3] and thyroxine [T4]) by the thyroid gland. When circulating thyroid hormone levels are elevated from any cause (including thyroiditis or exogenous ingestion), the condition is termed Thyrotoxicosis. The most prevalent etiology is Graves' Disease (an autoimmune disorder driven by stimulating autoantibodies targeting the TSH receptor [TRAb/TSI]), followed by Toxic Multinodular Goiter (Plummer's disease) and Toxic Adenoma (autonomous functioning nodules). It characteristically manifests as profound sympathetic overdrive, unexplained weight loss despite hyperphagia, sinus tachycardia, fine resting tremors, heat intolerance, and neuropsychiatric hyperarousal.",
    definition:
      "A clinical state resulting from excessive production of thyroid hormones by the thyroid gland, defined biochemically by a suppressed serum Thyroid-Stimulating Hormone (TSH <0.01 mIU/L) with elevated Free T4 and/or Free T3 levels.",
    causes: [
      "Graves' Disease: autoantibodies (TSH-receptor antibodies [TRAb / TSI]) bind to and stimulate the follicular TSH receptor, inducing unregulated, constitutive thyroid hormone synthesis, follicular hyperplasia, and diffuse vascular goiter",
      "Toxic Multinodular Goiter (TMNG) and Toxic Adenoma: somatic gain-of-function mutations in the TSH receptor or Gs-alpha subunit genes leading to autonomous, TSH-independent thyroid hormone hypersecretion",
      "Subacute Granulomatous Thyroiditis (de Quervain's) and Painless Postpartum Thyroiditis: transient inflammatory follicular cell destruction releasing preformed thyroid hormones into circulation",
      "Iodine-induced hyperthyroidism (Jod-Basedow phenomenon): administration of pharmacological iodine (amiodarone, IV radiocontrast agents) in patients with underlying autonomous nodules",
      "Exogenous thyrotoxicosis (thyrotoxicosis factitia): surreptitious or accidental ingestion of excessive exogenous levothyroxine"
    ],
    riskFactors: [
      "Female gender (prevalence 5 to 10 times higher in women, commonly presenting between 20–50 years of age)",
      "Personal or family history of autoimmune disorders (Type 1 Diabetes, Vitiligo, Celiac Disease, Rheumatoid Arthritis)",
      "High dietary iodine exposure or sudden excess iodine intake in an iodine-deficient population",
      "Recent pregnancy (postpartum period within 12 months)",
      "Severe physiological or psychological stress triggering immune modulation in genetically predisposed individuals"
    ],
    symptoms: [
      "Cardiovascular sympathetic overdrive: resting tachycardia (heart rate >100 bpm), forceful palpitations, systolic hypertension with widened pulse pressure, and dyspnea on exertion",
      "Metabolic acceleration: rapid, unintentional weight loss despite increased appetite (hyperphagia), heat intolerance, and profuse diaphoresis (warm, moist, velvety skin)",
      "Neuromuscular manifestations: fine resting postural tremor of outstretched hands and tongue, proximal muscle weakness (difficulty climbing stairs or standing from a squat), hyperreflexia, and fatigue",
      "Neuropsychiatric disturbances: anxiety, emotional lability, restlessness, insomnia, irritability, and shortened attention span",
      "Gastrointestinal: hyperdefecation (frequent, loose bowel movements) and increased bowel frequency without frank malabsorption",
      "Graves' specific extrathyroidal signs: Graves' Orbitopathy / Exophthalmos (proptosis, lid retraction [Dalrymple's sign], lid lag [von Graefe's sign], periorbital edema, diplopia) and Pretibial Myxedema (thyroid dermopathy; non-pitting violaceous orange-peel induration on the shins)"
    ],
    diagnosis:
      "Diagnosed biochemically with a complete Thyroid Function Panel: suppressed serum TSH (<0.01–0.1 mIU/L) with elevated Free T4 (FT4) and Free T3 (FT3). In isolated T3-toxicosis, Free T4 may be normal while Free T3 is elevated. Etiological differentiation is confirmed using: (1) Serum TSH-Receptor Antibodies (TRAb / TSI; highly sensitive and specific for Graves' disease). (2) Radioactive Iodine Uptake and Scan (RAIU; diffuse homogenous high uptake in Graves'; patchy/nodular uptake in toxic multinodular goiter; low/absent uptake in thyroiditis). (3) Thyroid Doppler Ultrasound (marked diffuse hypervascularity ['thyroid inferno'] in Graves').",
    differentialDiagnosis:
      "Differentiate Hyperthyroidism from Panic Disorder / Generalized Anxiety, Pheochromocytoma (episodic paroxysmal hypertension, headache, and palpitations), Subacute Thyroiditis (painful anterior neck tenderness with elevated ESR/CRP), Exogenous Levothyroxine Overdose (low serum thyroglobulin), and Malignancy / Occult Carcinoma (weight loss without hypermetabolic signs).",
    conventionalManagement:
      "A multimodal endocrine strategy balances rapid symptom control and definitive reduction of thyroid hormone synthesis: (1) Beta-adrenergic blockers (propranolol, atenolol) provide immediate relief from tachycardia, tremors, heat intolerance, and anxiety. (2) Antithyroid drugs (thionamides: Methimazole is first-line; Propylthiouracil [PTU] is preferred during first-trimester pregnancy and thyroid storm due to peripheral T4-to-T3 conversion inhibition). (3) Radioactive Iodine Ablation (RAI / I-131; definitive destruction of overactive follicular tissue). (4) Total or Near-Total Thyroidectomy (surgical excision for compressive large goiters, severe Graves' orbitopathy, or suspected coexisting thyroid cancer).",
    homeopathicApproach:
      "Homeopathic constitutional and endocrine-balancing remedies (such as Iodum, Natrum Muriaticum, Lachesis Muta, Spigelia Anthelmia, Lycopus Virginicus, Thyroidinum, Phosphorus, Calcarea Carbonica, Glonoine) serve as supportive care to ease nervous hyperarousal, soothe palpitations, and assist vitality alongside strict endocrinological monitoring, serial TSH/FT4 testing, and conventional antithyroid medications.",
    lifestyleAdvice:
      "Avoid excess dietary iodine intake (avoid kelp, seaweeds, and high-iodine dietary supplements), completely avoid cigarette smoking (smoking increases the risk of severe, vision-threatening Graves' orbitopathy by over 8-fold), practice relaxation and mindfulness to soothe autonomic sympathetic overdrive, ensure adequate caloric and protein intake to prevent lean muscle wasting, and avoid unmonitored high-intensity athletic exertion while resting heart rate remains elevated.",
    references: [
      "CIT-0004",
      "CIT-0005",
      "CIT-0006",
      "CIT-0007",
      "CIT-0023",
      "CIT-0024"
    ],
    faqs: [
      {
        question: "What is the difference between hyperthyroidism and thyrotoxicosis?",
        answer: "Hyperthyroidism specifically refers to overproduction of thyroid hormones by the thyroid gland itself (such as in Graves' disease). Thyrotoxicosis is the broader term referring to the clinical syndrome of excess circulating thyroid hormone from any cause, including leaking of stored hormones in thyroiditis or accidental overdose of thyroid medication."
      },
      {
        question: "Why is smoking particularly dangerous for people with Graves' disease?",
        answer: "Smoking is the single most potent modifiable risk factor for Graves' eye disease (orbitopathy). Smoking stimulates inflammatory cytokines behind the eyes, multiplying the risk of severe bulging eyes, double vision, and permanent vision damage by more than 8 times."
      }
    ],
    redFlags: [
      "Thyroid Storm (Thyrotoxic Crisis): life-threatening emergency characterized by hyperpyrexia (high fever 39–41°C / 102–106°F), extreme tachycardia (>140–160 bpm), tachyarrhythmias (atrial fibrillation), severe agitation, delirium, psychosis, jaundice, vomiting, diarrhea, and cardiovascular collapse (medical emergency requiring immediate intensive care admission, IV beta-blockers, high-dose thionamides, Lugol's iodine, and IV hydrocortisone)",
      "New-onset rapid Atrial Fibrillation with palpitations, syncope, or thromboembolic symptoms (requires urgent cardiology evaluation and anticoagulation)",
      "Severe Graves' Orbitopathy: progressive visual loss, corneal ulceration, optic nerve compression, or severe proptosis (requires emergency ophthalmologic high-dose IV glucocorticoid therapy)",
      "Antithyroid drug-induced Agranulocytosis: sudden onset of high fever and severe sore throat in a patient taking methimazole or PTU (requires immediate cessation of the drug and emergency STAT absolute neutrophil count [ANC] test)"
    ]
  },
  claimCitations: [
    { claimId: "D0012-TRADITIONAL-PROFILE", statement: "Homeopathic hyperthyroidism profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-D0012-TRADITIONAL-PROFILE" },
    { claimId: "D0012-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for thyroid hormone normalization, radioactive iodine ablation, or thyroid storm management.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "D0012-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "D0012-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for thyroid storm, atrial fibrillation, or antithyroid drug agranulocytosis.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "High fever, extreme tachycardia, agitation, and delirium indicating Thyroid Storm requiring immediate emergency ICU admission",
    "Rapid irregular pulse indicating thyrotoxic atrial fibrillation requiring urgent cardiac evaluation",
    "Fever and severe sore throat while on methimazole/PTU indicating drug-induced agranulocytosis requiring emergency CBC"
  ],
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Clinical Governance & Materia Medica",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Hyperthyroidism", "Thyrotoxicosis", "Graves Disease", "Disease", "Overactive Thyroid", "Tachycardia", "Weight Loss", "Endocrinology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/hyperthyroidism",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive endocrinological thyrotoxicosis clinical boundaries, thyroid storm red flags, and verified citations"],
  clinicalPearl: "Always check Free T3 in addition to Free T4 when TSH is suppressed; isolated T3-toxicosis accounts for up to 5% of hyperthyroid presentations.",
  quickFacts: {
    "Prevalence": "Affects approximately 1.2% of the population (0.5% overt, 0.7% subclinical; 5x higher in women)",
    "Primary System": "Endocrine System & Metabolism (Thyroid / Neuroendocrine)",
    "Diagnostic Standard": "Serum TSH, Free T4/T3 Panel, TRAb Antibodies, & Radioactive Iodine Scan",
    "Clinical Character": "Hypermetabolic syndrome caused by excess circulating thyroid hormones producing sympathetic hyperarousal"
  },
  aiReadiness: {
    retrievalSummary: "Hyperthyroidism is an overactive thyroid condition causing weight loss, rapid heart rate, heat intolerance, and tremors, managed with supportive care, beta-blockers, antithyroid drugs, and endocrinology monitoring.",
    clinicalSummary: "Hyperthyroidism pathophysiology involves TSH receptor autoantibody stimulation (Graves') or toxic multinodular goiter hypersecretion. Homeopathic remedies serve as supportive nervous care and do not replace conventional antithyroid thionamides, radioactive iodine, or emergency ICU resuscitation for life-threatening Thyroid Storm.",
    patientSummary: "Hyperthyroidism happens when your thyroid gland produces too much thyroid hormone, speeding up your body's metabolism and causing sudden weight loss, fast heartbeats, shaking hands, and feeling hot all the time.",
    studentSummary: "Biochemical hallmark: suppressed TSH with elevated FT4/FT3. Graves' disease is the most common cause (positive TRAb/TSI). First-line treatments: methimazole and beta-blockers. Red flags: Thyroid Storm (hyperpyrexia + tachycardia) and thionamide-induced agranulocytosis.",
    keywords: ["hyperthyroidism", "thyrotoxicosis", "graves disease", "overactive thyroid", "low tsh", "elevated t4", "thyroid storm"],
    semanticKeywords: ["tsh receptor autoantibodies", "hypermetabolic thyrotoxic state", "toxic nodular goiter"],
    icd: "E05.00",
    mesh: "D006980",
    bodySystem: "Endocrinology & Metabolism",
    urgency: "routine"
  }
};
