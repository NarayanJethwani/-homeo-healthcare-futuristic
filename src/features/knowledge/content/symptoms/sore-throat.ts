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
    en: "Sore Throat (Pharyngitis)",
    hi: "गले में खराश / दर्द (Sore Throat)",
    gu: "ગળામાં દુખાવો / ખરાશ (Sore Throat)",
    mr: "घसा दुखी / खवखव (Sore Throat)",
    es: "Dolor de Garganta (Sore Throat)",
    ar: "ألم الحلق (Sore Throat)"
  },
  summary: {
    en: "Clinical evaluation, Centor scoring, airway emergency red flags, and supportive management for Sore Throat under AAO-HNS 2020 guidelines.",
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
      "question": "What is the difference between allergic rhinitis and a common cold?",
      "answer": "Allergic rhinitis is an IgE-mediated immune response triggered by allergens (pollen, dust), presenting with itchy eyes, sneezing, and clear watery discharge. A cold is a viral infection, usually presenting with thicker discharge, throat irritation, and sometimes a low-grade fever."
    },
    {
      "question": "Can untreated allergies lead to asthma?",
      "answer": "Yes. The 'atopic march' describes how upper airway allergic inflammation (allergic rhinitis) can progress to involve the lower airways, triggering asthma in susceptible individuals."
    },
    {
      "question": "How does homeopathy support respiratory allergies?",
      "answer": "Homeopathic remedies aim to reduce the body's hyper-reactivity to environmental allergens and strengthen mucosal defenses, using acute and deep-acting constitutional remedies."
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
