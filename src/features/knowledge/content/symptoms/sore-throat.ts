import { KnowledgeEntity } from "../../types";

export const SoreThroatSymptom: KnowledgeEntity = {
  id: "S0008",
  slug: "sore-throat",
  entityType: "symptom",
  editorialStatus: "published",
  versionInfo: {
    version: "1.1.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-07-31T20:30:00Z",
    reviewed: "2026-07-31T20:30:00Z"
  },
  title: {
    en: "Sore Throat",
    hi: "गले में खराश / दर्द (Sore Throat)",
    gu: "ગળામાં દુખાવો / ખરાશ (Sore Throat)",
    mr: "घसा दुखी / खवखव (Sore Throat)",
    es: "Dolor de Garganta (Sore Throat)",
    ar: "ألم الحلق (Sore Throat)"
  },
  summary: {
    en: "A sore throat is usually caused by a viral infection and often improves within a week. Find simple relief options, possible causes, and the warning signs that need urgent assessment.",
    hi: "गले की खराश के लक्षण की नैदानिक समझ और आपातकालीन एयरवे चेतावनी लक्षण.",
    gu: "ગળામાં દુખાવાની તબીબી સમજણ અને ઈમરજન્સી એરવે રેડ ફ્લેગ્સ.",
    mr: "घसा दुखीच्या लक्षणांची वैद्यकीय माहिती आणि आपत्कालीन इशारे.",
    es: "Evaluación clínica, puntuación de Centor y señales de alarma de la vía aérea según AAO-HNS 2020.",
    ar: "التقييم السريري وعلامات الخطر لألم الحلق."
  },
  content: {
    definition: "Sore Throat: Pain, scratchiness, or irritation of the pharynx, palatine tonsils, or supraglottic laryngeal structures, aggravated by deglutition.",
    clinicalMeaning: "Reflects acute viral or bacterial pharyngitis, tonsillitis, deep neck space infection, or environmental mucosal drying.",
    commonCauses: [
      "Viral Pharyngitis (Rhinovirus, Adenovirus, Influenza, EBV infectious mononucleosis)",
      "Group A Beta-Hemolytic Streptococcus (GABHS / Strep Throat)",
      "Acute Tonsillitis, Post-Nasal Drip, GERD Laryngopharyngeal Reflux",
      "Environmental Irritants, Dry Air, Tobacco Smoke Exposure"
    ],
    differentialDiagnosis: "Differentiate benign viral/streptococcal pharyngitis from Acute Epiglottitis, Peritonsillar Abscess (Quinsy), Retropharyngeal Abscess, Lemierre Syndrome, and Acute HIV Seroconversion.",
    redFlags: [
      "Inability to swallow saliva, drooling, or severe odynophagia",
      "Inspiratory stridor, tripod position, or acute respiratory distress (Acute Epiglottitis)",
      "Muffled 'hot potato' voice, trismus, or unilateral soft palate bulge (Peritonsillar Abscess)",
      "Neck swelling, severe systemic toxicity, or high fever with rigors"
    ],
    lifestyleAdvice: "Gargle with warm salt water, maintain high fluid intake, use throat lozenges, avoid vocal strain and tobacco smoke, and rest adequately.",
    references: [
      "CIT-0076",
      "CIT-0023"
    ],
    claimCitations: [
      {
        claimId: "CLM-S0008-001",
        passage: "Drooling, stridor, or inability to swallow saliva in a patient with sore throat indicates acute supraglottic swelling (Epiglottitis) requiring immediate emergency airway management.",
        citationIds: ["CIT-0076"]
      },
      {
        claimId: "CLM-S0008-002",
        passage: "Unilateral tonsillar swelling with trismus and a muffled voice points to Peritonsillar Abscess requiring urgent needle aspiration or drainage.",
        citationIds: ["CIT-0076"]
      },
      {
        claimId: "CLM-S0008-003",
        passage: "Modified Centor Criteria (fever, tonsillar exudate, tender anterior cervical lymphadenopathy, absence of cough) guide GABHS rapid antigen testing and antibiotic decision making.",
        citationIds: ["CIT-0076"]
      },
      {
        claimId: "CLM-S0008-004",
        passage: "Homeopathic supportive remedies (e.g., Belladonna, Hepar Sulf, Merc Sol) do not replace emergency intubation or surgical drainage in deep neck space abscesses.",
        citationIds: ["CIT-0023"]
      }
    ],
  "faqs": [
    {
      "question": "What can I do for a sore throat at home?",
      "answer": "Rest, fluids, and simple pain relief that is safe for you may help. Adults can try warm salt-water gargles. Avoid smoking and smoky environments. Ask a pharmacist if you are unsure what is suitable for you or your child."
    },
    {
      "question": "When should I get urgent help for a sore throat?",
      "answer": "Get urgent medical help for trouble breathing, drooling or being unable to swallow saliva, a high-pitched sound when breathing, severe symptoms that worsen quickly, or trouble drinking enough fluids."
    },
    {
      "question": "Do I need antibiotics?",
      "answer": "Most sore throats are caused by viruses, so antibiotics will not help. A clinician may examine you or arrange testing when a bacterial infection is possible. Take antibiotics only when prescribed and as directed."
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
  tags: ["Sore Throat", "Symptom", "Clinical"],
  canonicalUrl: "https://homeo.healthcare/knowledge/symptoms/sore-throat",
  readingTimeMinutes: 3,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: ["1.0.0: Initial release of Sore Throat symptom profile"]
};
