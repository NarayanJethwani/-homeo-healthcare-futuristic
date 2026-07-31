import { KnowledgeEntity } from "../../types";

export const DiarrheaSymptom: KnowledgeEntity = {
  id: "S0011",
  slug: "diarrhea",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T19:50:00Z",
    reviewed: "2026-07-31T19:50:00Z"
  },
  title: {
    en: "Diarrhea",
    hi: "दस्त (Diarrhea)",
    gu: "ઝાડા (Diarrhea)",
    mr: "अतिसार (Diarrhea)",
    es: "Diarrea (Diarrhea)",
    ar: "الإسهال (Diarrhea)"
  },
  summary: {
    en: "Clinical triage, fluid rehydration, and diagnostic management of Diarrhea under IDSA 2021 standards.",
    hi: "दस्त के लक्षण की नैदानिक समझ और आपातकालीन खतरे के संकेत.",
    gu: "ઝાડાના લક્ષણ ની સમજણ અને ઇમરજન્સી ફ્લેગ્સ.",
    mr: "अतिसाराचे लक्षण आणि तातडीचे रेड फ्लॅग्स.",
    es: "Triaje clínico y rehidratación de la diarrea según las guías IDSA 2021.",
    ar: "التفرقة السريرية والعلامات التحذيرية للإسهال."
  },
  content: {
    definition: "Diarrhea: An increase in stool frequency (3 or more loose/liquid bowel movements per 24 hours) or stool weight (>200 g/day), categorized into secretory, osmotic, inflammatory (exudative), and hypermotility etiologies.",
    clinicalMeaning: "Reflects mucosal inflammation, viral/bacterial enterotoxin excretion, malabsorption, or intestinal hypermotility requiring hydration and stool diagnostic testing.",
    commonCauses: [
      "Acute Viral Gastroenteritis (Norovirus, Rotavirus)",
      "Bacterial Enteritis (Campylobacter, Salmonella, Shigella, E. coli)",
      "Clostridioides difficile Colitis (Post-Antibiotic)",
      "Inflammatory Bowel Disease (Ulcerative Colitis, Crohn's) or IBS-D"
    ],
    differentialDiagnosis: "Differentiate acute self-limited viral diarrhea from invasive bacterial dysentery, C. difficile colitis, malabsorption, and inflammatory bowel disease.",
    redFlags: [
      "Grossly bloody stools (dysentery) with high fever and tenesmus",
      "Signs of severe hypovolemic shock (hypotension, anuria, lethargy)",
      "Toxic megacolon symptoms (severe abdominal distension, fever, tachycardia in colitis)"
    ],
    lifestyleAdvice: "Prioritize oral rehydration salts (ORS), avoid dairy and high-sugar solutions; seek immediate medical evaluation for bloody diarrhea, high fever, or severe dehydration.",
    references: [
      "CIT-0065",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0011-001",
        passage: "Grossly bloody diarrhea accompanied by high fever requires immediate stool culture, PCR panel, and evaluation for invasive bacterial infection or IBD.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0011-002",
        passage: "Severe dehydration with anuria, sunken eyes, and postural hypotension indicates impending hypovolemic shock demanding emergency IV fluid resuscitation.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0011-003",
        passage: "Recent antibiotic exposure followed by profuse watery diarrhea requires testing for Clostridioides difficile toxin.",
        citationIds: ["CIT-0065"]
      },
      {
        claimId: "CLM-S0011-004",
        passage: "Homeopathic supportive remedies do not replace fluid and electrolyte rehydration or emergency medical care in severe infectious diarrhea.",
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
  tags: ["Diarrhea", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/diarrhea",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Diarrhea symptom profile"]
};
