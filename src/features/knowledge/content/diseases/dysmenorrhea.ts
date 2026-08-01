import { KnowledgeEntity } from "../../types";

export const DysmenorrheaDisease: KnowledgeEntity = {
  id: "D0033",
  slug: "dysmenorrhea",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Primary & Secondary Dysmenorrhea",
    hi: "कष्टार्तव / मासिक धर्म में दर्द (Dysmenorrhea)",
    gu: "કષ્ટાર્તવ / માસિક સમયનો પેડૂનો દુખાવો (Dysmenorrhea)",
    mr: "मासिक पाळीतील वेदना / कष्टार्तव (Dysmenorrhea)",
    es: "Dismenorrea Primaria y Secundaria",
    ar: "عسر الطمث",
  },
  summary: {
    en: "An authoritative clinical profile of Primary and Secondary Dysmenorrhea covering ACOG 2018 guidelines, endometrial prostaglandin F2α hyper-secretion mechanics, ectopic pregnancy / PID emergency red flags, and gynecological diagnostic boundaries.",
    hi: "कष्टार्तव (Dysmenorrhea) का ACOG 2018 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "કષ્ટાર્તવનું ACOG 2018 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "कष्टार्तवाचे ACOG 2018 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Dismenorrea según los criterios ACOG 2018 y límites de emergencia.",
    ar: "دليل سريري موثوق لعسر الطمث وفقًا لمعايير ACOG 2018 وحدود السلامة.",
  },
  content: {
    overview:
      "Dysmenorrhea refers to painful menstrual cramps of uterine origin, categorized into primary (absence of pelvic pathology) and secondary (underlying pelvic disease) dysmenorrhea [D0033-KEYNOTES, CIT-0057]. ACOG 2018 emphasizes early evaluation for secondary causes like endometriosis.",
    definition:
      "Recurrent, painful suprapubic uterine cramping occurring with menses. Primary dysmenorrhea is driven by elevated endometrial prostaglandin F2α (PGF2α) causing uterine hyper-contractility and ischemia. Secondary dysmenorrhea stems from identifiable pelvic organ pathology.",
    causes: [
      "Prostaglandin F2α and E2 overproduction during endometrial shedding causing myometrial contractions and ischemic pain [D0033-KEYNOTES, CIT-0057]",
      "Secondary pelvic diseases: Endometriosis, Adenomyosis, Uterine Fibroids (leiomyomas), Pelvic Inflammatory Disease (PID), and IUD placement",
      "Cervical stenosis or congenital obstructive Müllerian tract anomalies",
    ],
    riskFactors: [
      "Age <30 years, early menarche (<12 years), nulliparity, and heavy menstrual flow (menorrhagia)",
      "Cigarette smoking, low BMI, family history of dysmenorrhea or endometriosis",
      "Psychosocial stress and history of pelvic inflammatory disease",
    ],
    symptoms: [
      "Sharply localized or spasmodic lower abdominal / suprapubic pain starting 1-2 days before or with menstrual onset, lasting 12-72 hours [D0033-KEYNOTES, CIT-0057]",
      "Radiation of cramping discomfort to the lower back and anterior thighs",
      "Associated systemic symptoms: Nausea, vomiting, diarrhea, fatigue, dizziness, and headache",
    ],
    diagnosis:
      "Primary dysmenorrhea is diagnosed clinically in adolescents and young women based on history and normal pelvic exam. Secondary dysmenorrhea requires pelvic transvaginal ultrasound, STI screening (chlamydia/gonorrhea), and high-resolution MRI or laparoscopy for suspected endometriosis [CIT-0057].",
    differentialDiagnosis:
      "Differentiate Primary Dysmenorrhea from Endometriosis, Adenomyosis, Ectopic Pregnancy, Acute Pelvic Inflammatory Disease (PID), Ovarian Cyst Rupture/Torsion, and Appendicitis.",
    conventionalManagement:
      "Management includes first-line nonsteroidal anti-inflammatory drugs (NSAIDs - ibuprofen, naproxen, mefenamic acid) to inhibit cyclooxygenase and prostaglandin synthesis, combined hormonal contraceptives (oral, transdermal, vaginal ring, levonorgestrel IUD), and surgical excision for endometriosis/fibroids [CIT-0057].",
    homeopathicApproach:
      "Homeopathic remedies (such as Magnesia Phosphorica, Colocynthis, Pulsatilla, Chamomilla, Sabina) serve as supportive care to relieve spasmodic uterine cramping, calm emotional irritability, and improve menstrual comfort alongside gynecological monitoring.",
    lifestyleAdvice:
      "Apply localized heat (heating pad) to lower abdomen, engage in regular aerobic exercise, practice stress relaxation techniques, and maintain dietary magnesium and omega-3 fatty acid intake.",
    references: ["CIT-0004", "CIT-0005", "CIT-0006", "CIT-0057"],
    faqs: [
      {
        question: "When does severe pelvic or menstrual pain indicate a life-threatening gynecological emergency?",
        answer:
          "Sudden acute severe unilateral pelvic pain with a missed period, fainting, or shoulder tip pain (RUPTURED ECTOPIC PREGNANCY), or high fever with purulent vaginal discharge and severe cervical motion tenderness (ACUTE PID) is a GYNECOLOGICAL EMERGENCY [D0033-EMERGENCY-LIMITS, CIT-0057]. Seek IMMEDIATE ER CARE.",
      },
      {
        question: "Can homeopathic remedies replace pelvic ultrasound, pregnancy testing, or surgical treatment for secondary dysmenorrhea?",
        answer:
          "NO. Homeopathy MUST NOT replace emergency pregnancy testing (hCG), pelvic transvaginal ultrasound, or surgical intervention for secondary causes like endometriosis or fibroids [D0033-REGULATORY-LIMITS].",
      },
      {
        question: "How does homeopathy integrate with standard gynecological care for dysmenorrhea?",
        answer:
          "Homeopathy serves as complementary constitutional care while patients remain under standard gynecological care, NSAID protocols, and imaging surveillance [D0033-REGULATORY-LIMITS].",
      },
    ],
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Gynecology & Clinical Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Dysmenorrhea", "Disease", "ACOG-2018", "Gynecology", "Menstrual-Pain", "Endometriosis", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/dysmenorrhea",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Dysmenorrhea profile",
    "1.1.0: Upgraded with ACOG 2018 evidence citations (CIT-0057), passage-level claim citations (D0033-KEYNOTES, D0033-EMERGENCY-LIMITS, D0033-REGULATORY-LIMITS), ectopic pregnancy / acute PID red flags, and gynecological safety boundaries",
  ],
};
