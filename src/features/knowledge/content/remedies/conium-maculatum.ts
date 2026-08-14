import { KnowledgeEntity } from "../../types";

export const ConiumMaculatumRemedy: KnowledgeEntity = {
  id: "R0037",
  slug: "conium-maculatum",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-14T12:00:00Z",
    reviewed: "2026-08-14T12:00:00Z"
  },
  title: {
    en: "Conium Maculatum (Poison Hemlock)",
    hi: "कोनियम मैकुलेटम (Poison Hemlock)",
    gu: "કોનિયમ મેક્યુલેટમ (Conium Maculatum)",
    mr: "कोनियम मॅक्युलेटम (Conium Maculatum)",
    es: "Conium Maculatum (Cicuta Mayor)",
    ar: "كونيوم ماكولاتوم (شوك الترياق)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Conium Maculatum (Poison Hemlock), covering neuromuscular ascending paralysis indications, glandular stony induration, breast lumps following contusion, positional rotary vertigo on turning the head or rolling over in bed, constitutional geriatric indications, and emergency red flags for acute ascending respiratory paralysis, malignant breast neoplasms, and urinary retention.",
    hi: "कोनियम मैकुलेटम (पॉइजन हेमलॉक) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें नीचे से ऊपर चढ़ने वाली मांसपेशियों की कमजोरी (Ascending Paralysis), ग्रंथियों व स्तनों की पत्थर जैसी सख्त गांठें (Stony Indurations), बिस्तर में करवट बदलने या सिर हिलाने पर चक्कर आना (Positional Vertigo), और श्वसन पक्षाघात व कैंसर की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "કોનિયમ મેક્યુલેટમ (ઝેરી હેમલોક) નું મટેરિયા મેડિકા વિવરણ, પગથી શરૂ થઈ ઉપર ચડતી સ્નાયુબદ્ધ નબળાઈ, સ્તનમાં ઈજા પછી થતી પથ્થર જેવી કઠણ ગાંઠો, માથું ફેરવતા આવતી ચક્કર (વર્ટિગો), અને શ્વાસનળીના લકવા તથા કેન્સરની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "कोनियम मॅक्युलेटम (Conium Maculatum) चे सविस्तर विवरण, स्नायूंची कमजोरी, स्तनातील व ग्रंथींमधील कठीण गाठी, डोके हलवल्यास किंवा कुस बदलल्यास येणारी चक्कर (Vertigo), आणि श्वसनविकार व कर्करोगाच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Conium Maculatum que cubre parálisis motora ascendente, induraciones glandulares pétreas, nódulos mamarios post-traumáticos, vértigo posicional al girar la cabeza, y banderas rojas de insuficiencia respiratoria y neoplasias.",
    ar: "دليل موثوق لدواء كونيوم ماكولاتوم يغطي الشلل الحركي الصاعد والتصلب الغدي العقيدي والدوار الموضعي عند تدوير الرأس والرعاية الداعمة وعلامات الخطر للشلل التنفسي والأورام الخبيثة."
  },
  content: {
    overview:
      "Conium Maculatum (Poison Hemlock, belonging to the Apiaceae / Umbelliferae family; historically renowned as the state poison administered to Socrates in ancient Athens) is a major classical homeopathic polychrest and deep-acting constitutional remedy. Prepared from the fresh flowering herb harvested during full blossom, its classical pharmacological and toxicological profile centers upon the alkaloid coniine (a potent neurotoxin that acts as a non-depolarizing blocker of nicotinic acetylcholine receptors at the neuromuscular junction, inducing progressive ascending motor paralysis from the lower extremities upward while preserving clear mental sensorium until respiratory muscles fail). In homeopathic practice, Conium is classically indicated for progressive motor weakness in elderly individuals, stony-hard induration of lymphatic and mammary glands following contusion or injury, and debilitating positional rotary vertigo precipitated by turning the head sideways or rolling over in bed.",
    definition:
      "A classical homeopathic medicine derived from Poison Hemlock (Conium maculatum), historically utilized for glandular enlargements with stony hardness, ascending muscular debility, and positional vertigo provoked by head rotation.",
    causes: [
      "Historical source: Conium maculatum (Poison Hemlock, Apiaceae family), indigenous to Europe and temperate Western Asia, containing neurotoxic piperidine alkaloids (coniine, conhydrine, pseudoconhydrine)",
      "Pharmacological mechanism in toxicology: competitive inhibition of nicotinic acetylcholine receptors at post-synaptic neuromuscular junctions, causing progressive ascending flaccid motor paresis",
      "Cellular trophic actions in classical proving: chronic inflammatory infiltration, fibrous hyperplasia, and dense collagenous induration of glandular and reproductive tissues (mammae, ovaries, prostate, testicles, cervical lymph nodes)",
      "Vestibular sensory mismatch: hypersensitivity of the horizontal semicircular canals and vestibular nuclei to angular head acceleration, triggering intense rotary vertigo during head turning"
    ],
    riskFactors: [
      "Blunt trauma or physical contusion to glandular tissues (especially traumatic blows to the breasts or testicles predisposing to chronic hard nodular induration)",
      "Elderly age with progressive cerebral atherosclerosis, gait ataxia, and motor debility",
      "Sedentary lifestyle or sudden enforced celibacy / suppression of natural sexual desire in individuals with previous active habits (classical Hahnemannian and Kentian indication)",
      "Exposure to raw unprocessed hemlock plant material (highly lethal toxin; requires emergency medical decontamination)"
    ],
    symptoms: [
      "Positional Rotary Vertigo (the cardinal keynote): violent whirling vertigo provoked immediately upon turning the head to either side, moving the eyes, or rolling over in bed from one side to the other, or when looking at moving objects",
      "Ascending Motor Weakness & Trembling: heavy, weary, dragging sensation in the lower limbs, progressing from the feet and calves upward toward the thighs and torso, with trembling knees and unsteady, shuffling, staggering gait",
      "Stony Glandular Induration: chronic, hard, nodular, tender enlargement of lymphatic glands (cervical, axillary, inguinal) and mammary glands, classically developing after a localized mechanical bruise or contusion",
      "Mammary Symptoms: breasts become engorged, stony-hard, exquisitely tender, and painful before and during every menstrual period, aggravated by walking or the slightest motion",
      "Urinary Intermittency: urine flows, stops, flows again, and stops repeatedly in a stuttering intermittent stream, accompanied by chronic prostatic enlargement or dribbling after voiding",
      "Ocular Photophobia: excessive lacrimation and intense aversion to light out of all proportion to visible conjunctival inflammation"
    ],
    diagnosis:
      "Homeopathic diagnosis is established through repertorization of the characteristic symptom totality: positional rotary vertigo on head turning/rolling in bed, ascending motor paresis, stony-hard glandular indurations following trauma, and urinary stream intermittency. In conventional medical practice, any patient presenting with a hard breast lump mandates formal triple assessment (clinical breast examination, bilateral diagnostic mammography / ultrasound, and core needle biopsy) to definitively rule out Infiltrating Ductal Carcinoma. Patients with acute ascending motor weakness require immediate neurological evaluation and nerve conduction studies / CSF analysis to exclude Guillain-Barré Syndrome or Lambert-Eaton Myasthenic Syndrome.",
    differentialDiagnosis:
      "Differentiate Conium Maculatum from Gelsemium Sempervirens (motor paralysis and heavy eyelids with profound muscular dullness, but lacks stony glandular induration), Baryta Carbonica (geriatric mental and physical dwarfism with chronic tonsillar/prostatic hypertrophy, but lacks positional rotary vertigo on head turning), Phytolacca Decandra (hard, tender mastitis with pain radiating down the arm, but acute and inflammatory rather than chronic stony nodules), Arnica Montana (acute soreness after trauma, but lacks chronic fibrous induration), and Asterias Rubens (breast carcinoma with axillary retraction).",
    conventionalManagement:
      "Homeopathic Conium Maculatum is administered under individualized constitutional potencies (6C, 30C, 200C, or 1M) as supportive holistic care. Conventional clinical care remains essential and mandatory: (1) Any discrete, hard, or growing breast or testicular mass requires immediate triple diagnostic oncological evaluation and standard surgical/oncological treatment. (2) Acute ascending motor paralysis is a medical emergency requiring ICU admission, mechanical ventilatory readiness, and IVIG/plasmapheresis. (3) Severe symptomatic benign prostatic hyperplasia (BPH) with urinary retention requires alpha-1 blockers (tamsulosin), 5-alpha reductase inhibitors, or urological surgical intervention (TURP).",
    homeopathicApproach:
      "Conium Maculatum serves as a supportive constitutional remedy to ease chronic positional dizziness, soothe benign glandular tenderness, and support muscular vitality alongside mammographic surveillance, urological management, and neurological monitoring.",
    lifestyleAdvice:
      "Move and turn the head slowly and smoothly during morning rising or rolling in bed to minimize positional vestibular stimulation, wear a soft, supportive, non-wired brassiere to prevent friction and bouncing if mammary tenderness is present, engage in gentle regular walking within individual stamina limits to maintain leg muscle tone, avoid holding urine for prolonged intervals, and maintain a balanced, fiber-rich diet to prevent constipation.",
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
        question: "Is homeopathic Conium safe given that Poison Hemlock is deadly poisonous?",
        answer: "Yes, when prepared according to standard homeopathic pharmacopoeias (HPUS). Through standardized serial dilution and succussion (potentization) beyond the 6C or 30C potency, the toxic alkaloids (coniine) are diluted far past toxicological thresholds. However, raw unpotentized hemlock plant material is lethal and must never be ingested."
      },
      {
        question: "Can Conium cure a hard lump in the breast?",
        answer: "No. Any hard, new, or changing breast lump must be examined immediately by a medical doctor, mammogram, and biopsy to rule out breast cancer. While Conium is traditionally used for benign, tender, traumatic fibrous breast nodules, it must never replace medical evaluation or cancer treatment."
      }
    ],
    redFlags: [
      "Acute Ascending Motor Weakness / Respiratory Paralysis: progressive loss of leg strength spreading to hands, arms, and chest, causing shortness of breath, weak cough, or inability to swallow (neurological emergency requiring immediate ICU admission and ventilatory support)",
      "Suspicious Hard Breast Lump: painless, hard, fixed, irregularly shaped breast mass with skin dimpling ('peau d'orange'), nipple retraction, or bloody nipple discharge (requires urgent diagnostic mammography, ultrasound, and core needle biopsy)",
      "Acute Complete Urinary Retention: agonizing lower abdominal pain with palpable bladder distension and total inability to pass urine in an elderly male (requires immediate catheter decompression)",
      "Ingestion of Raw Hemlock Plant: burning in mouth, vomiting, progressive paralysis, and respiratory failure (requires immediate 911 emergency dispatch and poison control decontamination)"
    ]
  },
  claimCitations: [
    { claimId: "R0037-TRADITIONAL-PROFILE", statement: "Homeopathic Conium maculatum profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0037-TRADITIONAL-PROFILE" },
    { claimId: "R0037-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for breast cancer oncology, acute ascending paralysis ICU resuscitation, or emergency urinary catheterization.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0037-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0037-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for acute ascending paralysis, malignant breast lumps, or urinary retention.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Progressive weakness spreading from legs to arms and chest indicating ascending paralysis requiring emergency ICU admission",
    "Painless hard fixed breast lump with nipple inversion indicating potential malignancy requiring immediate mammography and biopsy",
    "Agonizing lower abdominal pain with complete inability to urinate requiring emergency catheterization"
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
  tags: ["Conium Maculatum", "Poison Hemlock", "Ascending Paralysis", "Stony Glands", "Positional Vertigo", "Remedy", "Materia Medica", "Neurology"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/conium-maculatum",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive ascending neuromuscular weakness, stony glandular induration, positional vertigo clinical boundaries, respiratory paralysis/breast cancer red flags, and verified citations"],
  clinicalPearl: "Violent rotary vertigo precipitated specifically by turning the head sideways or rolling over in bed is the cardinal keynote of Conium Maculatum.",
  quickFacts: {
    "Source Material": "Fresh flowering herb of Conium maculatum (Poison Hemlock, Apiaceae)",
    "Key Modality": "Worse turning head sideways, rolling over in bed, or looking at moving objects",
    "Cardinal Field": "Neuromuscular motor weakness, glandular stony induration, and positional vertigo",
    "Safety Class": "Prescription homeopathic dilution; raw plant material is a lethal neurotoxin"
  },
  aiReadiness: {
    retrievalSummary: "Conium Maculatum is a homeopathic remedy for positional vertigo on turning the head, ascending leg weakness, and hard glandular nodules, used as supportive constitutional care.",
    clinicalSummary: "Conium Maculatum materia medica focuses on ascending motor debility, stony glandular indurations following trauma, and horizontal semicircular canal positional vertigo on rolling in bed. Homeopathic dilutions serve as supportive constitutional care and do not replace oncologic evaluation for breast lumps, or emergency ICU care for ascending respiratory paralysis.",
    patientSummary: "Conium is a traditional homeopathic medicine made from hemlock, used for dizziness that happens when rolling over in bed, muscle tiredness in older adults, and tender breast or gland lumps.",
    studentSummary: "Classical polychrest for ascending motor paresis, stony glandular indurations (breast/prostate post-trauma), and positional rotary vertigo on head rotation / turning in bed. Toxic alkaloid: coniine (nicotinic ACh blocker). Red flags: ascending paralysis (ICU/ventilation) and breast cancer (mammogram/biopsy).",
    keywords: ["conium maculatum", "poison hemlock", "vertigo rolling in bed", "stony hard breast lump", "ascending muscle weakness", "glandular induration", "intermittent urine stream"],
    semanticKeywords: ["ascending neuromuscular paresis", "positional rotational vertigo", "fibrous glandular induration"],
    icd: "T62.2X1A",
    mesh: "D003058",
    bodySystem: "Neurology & Oncology",
    urgency: "routine"
  }
};
