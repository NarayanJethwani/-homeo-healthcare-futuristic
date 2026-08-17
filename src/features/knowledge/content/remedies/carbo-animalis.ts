import { KnowledgeEntity } from "../../types";

export const CarboAnimalisRemedy: KnowledgeEntity = {
  id: "R0137",
  slug: "carbo-animalis",
  entityType: "remedy",
  editorialStatus: "published",
  reviewStatus: "owner-authorization-required",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-08-17T14:00:00Z",
    reviewed: "2026-08-17T14:00:00Z"
  },
  title: {
    en: "Carbo Animalis (Animal Charcoal / Carbo Carnis)",
    hi: "कार्बो एनिमेलिस (Carbo Animalis / जानवर का कोयला)",
    gu: "કાર્બો એનિમલિસ (Carbo Animalis / પ્રાણીજ કોલસો)",
    mr: "कार्बो ॲनिमलिस (Carbo Animalis / Animal Charcoal)",
    es: "Carbo Animalis (Carbón Animal / Carbón de Huesos)",
    ar: "كاربو أنيماليس (الفحم الحيواني / فحم العظام)"
  },
  summary: {
    en: "An authoritative clinical and educational materia medica profile of Carbo Animalis (Animal Charcoal), covering severe constitutional cachexia and malignancy diathesis characterized by stony-hard, non-tender or lancinating burning indurations of the axillary, inguinal, and mammary lymph glands, deep cyanotic, purple-livid discoloration of the skin and chronic ulcer margins with offensive ichorous discharges, characteristic copper-colored or dark reddish-brown eruptions on the nose and face, profound venous stasis and sluggish vitality in elderly debilitated individuals, constitutional indications, and emergency red flags for locally advanced ulcerating breast or lymph node malignancies with acute hemorrhage, acute septic thrombophlebitis, acute severe hypovolemic / septic shock with vascular collapse, and acute gangrene.",
    hi: "कार्बो एनिमेलिस (जानवर का कोयला / एनिमल चारकोल) का शास्त्रीय होम्योपैथिक मटेरिया मेडिका विवरण, जिसमें शरीर की गंभीर कमजोरी व रसौली/कैंसर की प्रवृत्ति (Constitutional Cachexia - स्तनों, बगल व जांघों की ग्रंथियों का पत्थर जैसा कड़ा होना), त्वचा व घावों का बैंगनी-नीला पड़ना (Cyanotic Purple Discoloration & Foul Ulcers), नाक व चेहरे पर तांबे जैसे भूरे-लाल दाने (Copper-Colored Eruptions on Nose), बुजुर्गों में नसों की भारी कमजोरी, और स्तनों के उन्नत घाव से रक्तस्राव (Malignant Ulcer Hemorrhage), सेप्टिक थ्रोम्बोफ्लेबिटिस (DVT/Sepsis) व गैंग्रीन की आपातकालीन सुरक्षा सीमाएं शामिल हैं.",
    gu: "કાર્બો એનિમલિસ (પ્રાણીજ કોલસો) નું મટેરિયા મેડિકા વિવરણ, શરીરની અત્યંત જીર્ણ નબળાઈ અને કેન્સર-ગાંઠોની પ્રકૃતિ (કેચેક્સિયા - સ્તન, બગલ અને જાંઘની લસિકા ગાંઠો પથ્થર જેવી કઠણ થઈ જવી), ચામડી અને જૂના ચાંદાઓનો રંગ જાંબુડિયો-વાદળી થઈ જવો અને દુર્ગંધવાળું પરુ નીકળવું, નાક અને ચહેરા પર તાંબા જેવા રંગના લાલ-કથ્થઈ ફોડલા (કોપર-કલર્ડ ઇરપ્શન્સ ઓન નોઝ), વૃદ્ધાવસ્થામાં નસોમાં લોહીનું ધીમું વહન, અને સ્તનના અલ્સર કે કેન્સરમાંથી લોહી વહેવું તથા સેપ્ટિક શોકની ઇમરજન્સી સીમાઓનું વિવરણ.",
    mr: "कार्बो ॲनिमलिस (Carbo Animalis / Animal Charcoal) चे सविस्तर विवरण, शरीराचा तीव्र क्षय व गाठींचा कडकपणा (Constitutional Cachexia - स्तन, काख व जांघेतील गाठी दगडासारख्या कडक होणे), त्वचा व जुनाट जखमांचा रंग जांभळट-निळा पडणे व दुर्गंधी येणे, नाकावर तांबूस-तपकिरी डाग (Copper-Colored Eruptions on Nose), वृद्धांमधील रक्ताभिसरणाची मंद गती, पारंपरिक होमिओपॅथिक पद्धत आणि प्रगत कर्करोगातील रक्तस्त्राव (Malignant Bleeding) व गँगरीनच्या आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico y educativo autorizado de Carbo Animalis que cubre caquexia constitucional grave y diátesis tumoral patognomónica caracterizada por induraciones pétreas ardientes de ganglios axilares, inguinales y mamas, decoloración cutánea púrpura y cianótica con úlceras fétidas, erupciones cobrizas en la nariz, y banderas rojas de ulceración maligna avanzada con hemorragia y choque séptico.",
    ar: "دليل موثوق لدواء كاربو أنيماليس يغطي الدنف الدستوري الشديد وأهبة الأورام الخبيثة المميزة بالتصلب الحجري الحارق المؤلم للغدد اللمفاوية الإبطية والمغبنية والثديين والتلون الأزرق الأرجواني الداكن للجلد وقروح الجلد الكريهة والطفح الجلدي النحاسي على الأنف والركود الوريدي لدى كبار السن وعلامات الخطر للنزف الحاد من القروح الورمية والصدمة الإنتانية الحادة والغرغرينا."
  },
  content: {
    overview:
      "Carbo Animalis (Animal Charcoal, prepared by charring roasted ox-hide / bovine connective tissues in an enclosed crucible; proven and introduced into classical homeopathic practice by Dr. Samuel Hahnemann in the Chronic Diseases) is a profound, deep-acting constitutional polychrest for malignant glandular degenerations, chronic venous stasis, senile cachexia, and copper-colored dermatoses. Prepared through serial chemical trituration of pure purified animal charcoal with pure lactose monohydrate according to pharmacopoeial standards, its complex elemental carbon matrix contains trace organo-mineral phosphates, calcium carbonates, and structural ash that exert profound absorbent, decongestant, microvascular restorative, and cellular trophic actions upon the lymphatic system, venous capillary beds, and deep connective tissues. In classical homeopathic provings and clinical oncology-geriatrics, Carbo Animalis is universally recognized for its cardinal keynote: non-suppurating, STONY-HARD INDURATION OF LYMPHATIC GLANDS AND BREASTS accompanied by burning, lancinating, cutting pains—occurring typically in elderly, broken-down, cachectic constitutions suffering from extreme venous sluggishness, easy prostration, and weak digestion. A second unmistakable diagnostic signature is the deep CYANOTIC, PURPLE-LIVID DISCOLORATION of the skin, veins, and ulcer margins (with thin, offensive, ichorous discharges) paired with distinctive COPPER-COLORED, brownish-red eruptions across the nose and cheeks (often after debility, nursing, or loss of vital fluids).",
    definition:
      "A classical homeopathic medicine prepared from Animal Charcoal (Carbo animalis), historically indicated for stony-hard glandular indurations of the breasts and lymphatics, cyanotic purple skin and ulcers, copper-colored eruptions on the nose, and senile cachexia.",
    causes: [
      "Animal charcoal source: Pure carbonized bovine hide / animal tissue (Carbo animalis), triturated and potentized through standardized decimal or centesimal methods",
      "Lymphatic and mammary proving pathophysiology: chronic lymphocytic hyperplasia and dense fibrous collagenous encapsulation within axillary, cervical, inguinal, and mammary glands, creating rock-hard, non-suppurating nodular tumors with lancinating burning nociception",
      "Venous microvascular proving stasis: chronic loss of endothelial vascular tone and microcirculatory stagnation in capillary beds, producing localized tissue hypoxia, livid purple/cyanotic discoloration, and coldness of affected parts",
      "Cutaneous melanocytic and sebaceous proving alterations: localized chronic inflammatory pigmentation producing circumscribed copper-colored maculopapular plaques across the nasal bridge and cheeks"
    ],
    riskFactors: [
      "Elderly, debilitated patients suffering from profound physical prostration, chronic venous stasis, or cachexia",
      "Women with chronic stony-hard mammary nodules, breast indurations, or post-lactational glandular enlargement",
      "Patients with chronic, foul-smelling, indolent leg ulcers surrounded by purple, cyanotic, cold skin",
      "Individuals with chronic copper-colored skin eruptions across the nose following debilitating illnesses"
    ],
    symptoms: [
      "Stony-Hard Glandular Induration of Breasts & Lymph Nodes (the cardinal keynote): mammary glands, axillary, cervical, and inguinal lymph nodes are enlarged, indurated, and hard as stone, with sharp, lancinating, burning, cutting pains radiating into the surrounding tissues, without tending to suppurate",
      "Cyanotic Purple-Livid Skin & Foul Ulcers: affected skin, veins, and ulcer margins turn dark blue, livid, or purple; ulcers discharge thin, burning, corrosive, putrid, ichorous fluid that stains bandages dark and smells like carrion",
      "Copper-Colored Eruptions on the Nose & Face (the dermatological keynote): smooth, brownish-red or copper-colored macules, papules, and patches appearing across the bridge of the nose and cheeks, accompanied by coldness of the tip of the nose",
      "Extreme Exhaustion After Loss of Vital Fluids: patient feels completely drained, faint, and exhausted from nursing a baby, minor bleeding, or diarrhea; feels as if they have no blood left in their veins",
      "Venous Sluggishness with Cold Extremities: hands, feet, nose, and breath feel cold to the touch, with visible purple engorgement of superficial veins and heavy bruised soreness in the limbs",
      "Sensation of Coldness in the Stomach: patient feels a distinct sensation of icy coldness in the stomach during digestion, which is relieved by pressing hard or drinking warm water",
      "Modality: symptoms worsen in cold air, from physical exertion, after loss of vital fluids (nursing, bleeding), and at night; relieved by resting in a warm bed, wrapping up warmly, and gentle pressure"
    ],
    diagnosis:
      "Homeopathic diagnosis is established by matching the characteristic glandular-cyanotic totality: stony-hard glandular indurations of breasts/lymphatics, cyanotic purple ulcers, copper-colored eruptions on nose, and senile cachexia. In modern conventional medicine, any patient presenting with stony-hard breast lumps, progressive lymphadenopathy, non-healing purple ulcers, or severe cachexia requires urgent comprehensive objective clinical evaluation: Diagnostic Digital Mammography & High-Resolution Breast Ultrasound with BI-RADS Classification (mandatory to evaluate Breast Carcinoma), Ultrasound-Guided Core Needle Biopsy / Excisional Lymph Node Biopsy with Histopathology & Immunohistochemistry (the definitive gold standard distinguishing Benign Fibroadenoma / Granulomatous Mastitis from Infiltrating Ductal Carcinoma, Lobular Carcinoma, or Lymphoma [Hodgkin's/Non-Hodgkin's]), Contrast-Enhanced CT of the Chest, Abdomen, and Pelvis / Whole-Body PET-CT (evaluating Metastatic Disease and Lymph Node Staging), Complete Blood Count, Serum Albumin, ESR, CRP, and Venous Duplex Ultrasound (evaluating Deep Vein Thrombosis and Septic Thrombophlebitis).",
    differentialDiagnosis:
      "Differentiate Carbo Animalis from Carbo Vegetabilis (Carbo Veg is prepared from vegetable wood charcoal and is characterized by extreme abdominal flatulence, continuous loud belching, cold breath and cold sweat with an intense desire to be fanned rapidly, and acute cardiovascular collapse, whereas Carbo Animalis is prepared from animal hide, acts DEEPER ON HARD GLANDS AND TUMORS [stony-hard breasts/lymph nodes], has copper-colored nose eruptions, and lacks Carbo Veg's intense demand for fanning), Conium Maculatum (stony-hard glands and breasts from contusions with vertigo on turning head in bed, but Conium has less cyanotic purple ulceration and no copper-colored nose patches), Asterias Rubens (breast cancer with lancinating pains, but Asterias has intense redness, nighttime neuralgias, and rectal constipation), Silicea Terra (indurated glands that suppurate and form fistulae with offensive foot sweat, whereas Carbo Animalis glands do not form pus), and Phytolacca Decandra (stony-hard painful breasts during nursing with pains shooting all over the body, but Phytolacca is acute and hot, whereas Carbo Animalis is chronic, cold, and cyanotic).",
    conventionalManagement:
      "Homeopathic Carbo Animalis is administered in medium to high centesimal potencies (30C, 200C, 1M) as supportive palliative and constitutional care. Conventional surgical oncology, medical oncology, and emergency medical management is paramount, vital, and mandatory: (1) Histopathologically Confirmed Breast Cancer / Malignant Lymphoma requires multidisciplinary oncological treatment including Surgical Resection (Lumpectomy / Modified Radical Mastectomy / Sentinel Lymph Node Biopsy), Systemic Chemotherapy / Targeted HER2-Directed Therapy / Endocrine Therapy, and Adjuvant Radiation Therapy. (2) Locally Advanced Malignant Fungating Ulcer with Acute Hemorrhage requires emergency surgical hemostasis, cauterization, topical hemostatic dressings (calcium alginate / tranexamic acid), and radiation therapy. (3) Acute Septic Thrombophlebitis requires IV broad-spectrum antibiotics and therapeutic anticoagulation.",
    homeopathicApproach:
      "Carbo Animalis serves as a supportive constitutional and palliative remedy to ease deep burning glandular aches, soothe purple cutaneous ulcerations, and support vitality alongside oncological management, surgical monitoring, and nutritional care.",
    lifestyleAdvice:
      "Maintain a warm, comfortable living environment and dress in warm layered thermal clothing to counter sluggish peripheral venous circulation, clean chronic ulcers gently with sterile normal saline and apply moist, non-adherent, absorbent dressings to manage exudate and odor, consume a high-protein, nutrient-dense diet rich in cooked whole foods, iron, and vitamin C to combat cachexia and support tissue repair, avoid direct mechanical pressure or trauma to swollen lymph nodes or breast tissue, practice gentle seated limb range-of-motion movements to prevent venous stasis, and adhere strictly to regular oncological and surgical follow-up visits.",
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
        question: "How is Carbo Animalis different from Carbo Vegetabilis?",
        answer: "While Carbo Vegetabilis is made from wood charcoal and is famous for severe stomach bloating, air hunger, and wanting to be fanned, Carbo Animalis is made from charred animal hide and penetrates deeper into the glandular system. It is indicated when lymph nodes and breasts become hard as stone, the skin turns dark purple, and copper-colored spots appear on the nose."
      },
      {
        question: "Why does Carbo Animalis produce stony-hard glands?",
        answer: "In classical homeopathy, Carbo Animalis has a specific affinity for the lymphatic system in debilitated people. When glands become inflamed, they undergo dense fibrous hardening without forming soft pus, making them feel like rigid pebbles under the skin."
      }
    ],
    redFlags: [
      "Locally Advanced Malignant Breast/Lymph Ulceration with Acute Bleeding: rapid enlargement of a hard breast mass with overlying skin tethering ('peau d'orange'), nipple retraction, bleeding ulceration, or palpable axillary matted nodes (oncological emergency requiring immediate surgical oncology evaluation and biopsy)",
      "Acute Septic Thrombophlebitis: severe erythema, induration, and tenderness along a superficial vein with high spiking fever and chills (requires emergent IV antibiotics and anticoagulation)",
      "Acute Severe Septic / Hypovolemic Shock: systolic blood pressure <90 mmHg, cold clammy extremities, rapid thready pulse, and confusion in a cachectic patient",
      "Acute Gangrene of Extremities: sudden blackening of toes or fingers with loss of sensation, severe pain, and foul-smelling necrotic breakdown"
    ]
  },
  claimCitations: [
    { claimId: "R0137-TRADITIONAL-PROFILE", statement: "Homeopathic Carbo animalis profiles represent historical symptom indications from classical materia medica.", citationIds: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0007"], passageId: "CIT-0004-R0137-TRADITIONAL-PROFILE" },
    { claimId: "R0137-EVIDENCE-LIMITS", statement: "Traditional literature does not establish modern curative clinical efficacy for breast malignancy surgical resection, malignant ulcer hemorrhage emergency hemostasis, or septic shock ICU hemodynamic resuscitation.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0023-HOMEOPATHY-EVIDENCE-LIMITS" },
    { claimId: "R0137-PRODUCT-SAFETY", statement: "A homeopathic dilution label does not guarantee product composition, quality, safety, or effectiveness.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-HOMEOPATHIC-PRODUCT-SAFETY" },
    { claimId: "R0137-CARE-BOUNDARY", statement: "This profile must not delay emergency assessment or replace proven treatment for suspected malignant tumors, severe ulcer hemorrhage, or acute septic shock.", citationIds: ["CIT-0023", "CIT-0024"], passageId: "CIT-0024-SERIOUS-CONDITION-BOUNDARY" }
  ],
  redFlags: [
    "Hard growing lump in the breast with skin dimpling and bleeding requiring immediate hospital surgical oncology evaluation",
    "Rapidly spreading red painful swollen vein with high fever indicating septic thrombophlebitis",
    "Extremely low blood pressure with cold clammy skin in an exhausted debilitated patient"
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
  tags: ["Carbo Animalis", "Animal Charcoal", "Carbo Carnis", "Stony Hard Glands", "Mammary Induration", "Cyanotic Purple Skin", "Foul Ulcers", "Copper Colored Eruptions Nose", "Senile Cachexia", "Remedy", "Materia Medica", "Oncology", "Dermatology", "Geriatrics"],
  canonicalUrl: "https://homeo.healthcare/knowledge/remedies/carbo-animalis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.1.0: Promoted to governed v1.1.0 with comprehensive stony-hard glandular indurations of breasts/lymphatics, cyanotic purple skin and ulcers, copper-colored eruptions on nose, and senile cachexia clinical boundaries, malignant tumor/septic shock red flags, and verified citations"],
  clinicalPearl: "Stony-hard non-suppurating induration of breasts and lymph nodes with burning lancinating pains, paired with cyanotic purple skin ulcers and copper-colored eruptions across the nose, is pathognomonic of Carbo Animalis.",
  quickFacts: {
    "Source Material": "Pure carbonized bovine hide / animal charcoal (Carbo animalis, triturated)",
    "Key Keynote": "Stony-hard glands and breasts; cyanotic purple skin/ulcers; copper-colored eruptions on nose",
    "Cardinal Field": "Glandular indurations, malignant cachexia, chronic venous stasis, and copper-colored dermatoses",
    "Safety Class": "Prescription homeopathic dilution; non-toxic in potentized forms"
  },
  aiReadiness: {
    retrievalSummary: "Carbo Animalis is a homeopathic remedy for rock-hard swollen breast lumps or neck glands that burn and ache, purple-blue skin sores with bad-smelling drainage, and copper-colored freckles across the nose, used as supportive care.",
    clinicalSummary: "Carbo Animalis materia medica focuses on severe constitutional cachexia and malignancy diathesis (stony-hard non-suppurating indurations of mammary glands, axillary, and inguinal lymph nodes with burning lancinating pains), deep cyanotic purple-livid discoloration of the skin and foul ulcer margins, copper-colored eruptions across the bridge of the nose, and senile venous sluggishness. Homeopathic dilutions serve as supportive care and do not replace surgical biopsy/oncological therapy for suspected breast malignancies or emergency care for septic shock.",
    patientSummary: "Carbo Animalis (Animal Charcoal) is a traditional homeopathic medicine for people with rock-hard swollen lumps in their breasts or neck that have sharp burning pains, dark purple sores that smell bad, and copper-brown spots on their nose.",
    studentSummary: "Premier stony-hard glandular induration, cyanotic ulceration, and senile cachexia polychrest. Keynotes: stony-hard non-suppurating induration of lymph nodes and mammary glands with lancinating burning pains, dark purple-livid cyanotic skin and ulcer margins with putrid ichorous discharge, distinctive copper-colored eruptions across nose and cheeks, and extreme prostration from vital fluid loss. Bovine carbon matrix. Red flags: locally advanced ulcerating breast malignancy and acute septic thrombophlebitis.",
    keywords: ["carbo animalis", "animal charcoal", "carbo carnis", "stony hard glands breasts", "mammary induration lumps", "cyanotic purple skin ulcers", "copper colored eruptions nose", "senile cachexia exhaustion"],
    semanticKeywords: ["dense fibrous lymphatic-mammary collagen encapsulation", "microvascular venous stasis tissue hypoxia", "melanocytic copper maculopapular pigmentation"],
    icd: "R53.81",
    mesh: "D029864",
    bodySystem: "Oncology & Dermatology & Geriatrics",
    urgency: "routine"
  }
};
