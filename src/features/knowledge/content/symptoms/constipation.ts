import { KnowledgeEntity } from "../../types";

export const ConstipationSymptom: KnowledgeEntity = {
  id: "S0010",
  slug: "constipation",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Constipation",
    hi: "कब्ज (Constipation)",
    gu: "કબજિયાત (Constipation)",
    mr: "बद्धकोष्ठता (Constipation)",
    es: "Estreñimiento (Constipation)",
    ar: "الإمساك (Constipation)"
  },
  summary: {
    en: "Clinical triage, Rome IV criteria, dietary fiber management, and colonoscopy boundaries for Constipation under ACG 2021 standards.",
    hi: "कब्ज के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "કબજિયાતના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "बद्धकोष्ठतेचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y criterios de Roma IV para el estreñimiento.",
    ar: "التفرقة السريرية والعلامات التحذيرية للإمساك."
  },
  content: {
    definition: "Constipation: A functional gastrointestinal disorder characterized by infrequent bowel movements (<3 per week), hard or lumpy stools (Bristol 1-2), straining, or sensation of incomplete evacuation according to Rome IV criteria.",
    clinicalMeaning: "Reflects dyssynergic defecation, slow-transit constipation, colonic structural lesion (adenocarcinoma/stricture), hypothyroidism, or drug side-effect (opioids, anticholinergics).",
    commonCauses: [
      "Low Dietary Fiber and Inadequate Fluid Intake",
      "Irritable Bowel Syndrome with Constipation (IBS-C) or Pelvic Floor Dysfunction",
      "Colorectal Malignancy, Stricture, or Volvulus",
      "Hypothyroidism, Hypercalcemia, or Medication-Induced (Opioids, Calcium Channel Blockers)"
    ],
    differentialDiagnosis: "Differentiate functional constipation (IBS-C, dyssynergic defecation) from mechanical colonic obstruction, hypothyroidism, and opioid-induced constipation.",
    redFlags: [
      "Acute onset obstipation with severe abdominal pain, distension, and vomiting (Bowel Obstruction)",
      "New onset constipation in patients >50 years with rectal bleeding or iron-deficiency anemia (Colorectal Cancer)",
      "Paradoxical overflow diarrhea with fecal impaction and urinary retention"
    ],
    lifestyleAdvice: "Increase soluble and insoluble dietary fiber to 25-30g daily, maintain fluid intake (>2L/day), engage in regular physical activity; seek colonoscopy evaluation for red flags.",
    references: [
      "CIT-0054",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0010-001",
        passage: "Acute obstipation accompanied by severe abdominal distension and vomitus indicates mechanical bowel obstruction or volvulus requiring emergency surgical evaluation.",
        citationIds: ["CIT-0054"]
      },
      {
        claimId: "CLM-S0010-002",
        passage: "New-onset constipation after age 50 associated with hematochezia or unexplained weight loss requires prompt diagnostic colonoscopy.",
        citationIds: ["CIT-0054"]
      },
      {
        claimId: "CLM-S0010-003",
        passage: "Severe fecal impaction causing stercoral ulceration or urinary outflow obstruction requires manual disimpaction or warm water enemas under medical care.",
        citationIds: ["CIT-0054"]
      },
      {
        claimId: "CLM-S0010-004",
        passage: "Homeopathic supportive remedies do not replace diagnostic colonoscopy, surgical intervention for volvulus, or medical management of intestinal obstruction.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What are the common triggers for digestive flares?",
      "answer": "Common triggers include dietary irritants (caffeine, alcohol, fatty foods), chronic emotional stress, irregular eating habits, and dysbiosis."
    },
    {
      "question": "How does the gut-brain axis affect digestive health?",
      "answer": "The gut and brain are in constant communication via the vagus nerve. Emotional stress can alter gut motility, increase visceral sensitivity, and worsen symptoms of GERD, gastritis, or IBS."
    },
    {
      "question": "Can homeopathy manage chronic acid reflux (GERD)?",
      "answer": "Yes, individualized homeopathy can help manage symptoms of chronic acid reflux by addressing digestive motility and hyperacidity alongside lifestyle modifications."
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
    specialty: "Internal Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Traditional-Literature",
  tags: ["Constipation", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/constipation",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Constipation symptom profile"]
};
