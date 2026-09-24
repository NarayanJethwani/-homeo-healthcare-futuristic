import { KnowledgeEntity } from "../../types";

export const SinusitisDisease: KnowledgeEntity = {
  id: "D0006",
  slug: "sinusitis",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.2.0",
    created: "2026-07-08T12:00:00Z",
    updated: "2026-09-24T12:00:00Z",
    reviewed: "2026-07-31T12:00:00Z",
  },
  title: {
    en: "Sinusitis",
    hi: "साइनसाइटिस / नाक का पोलिप (Sinusitis)",
    gu: "સાઇનસાઇટિસ (Sinusitis)",
    mr: "सायनसायटिस (Sinusitis)",
    es: "Sinusitis",
    ar: "التهاب الجيوب الأنفية",
  },
  summary: {
    en: "Sinusitis is swelling of the sinuses, often after a cold or flu. It can cause a blocked nose, facial pressure, reduced smell, and discoloured mucus. Learn what usually helps and when symptoms need review.",
    hi: "साइनसाइटिस का EPOS 2020 मानकों के अनुसार प्रामाणिक विवरण और आपातकालीन सुरक्षा सीमाएँ।",
    gu: "સાઇનસાઇટિસનું EPOS 2020 ધોરણો મુજબનું નૈદાનિક વિવરણ અને ઇમરજન્સી સીમાઓ.",
    mr: "सायनसायटिसचे EPOS 2020 निकषांनुसार वैद्यकीय विश्लेषण आणि आणीबाणीच्या मर्यादा.",
    es: "Un perfil clínico autorizado de la Sinusitis según los criterios EPOS 2020 y límites de emergencia.",
    ar: "دليل سريري موثوق لالتهاب الجيوب الأنفية وفقًا لمعايير EPOS 2020 وحدود السلامة.",
  },
  content: {
    overview:
      "Sinusitis is swelling in the small air spaces around the nose. It commonly follows a viral illness and usually improves without antibiotics. Allergies, nasal swelling, or other factors can contribute when symptoms keep returning or last longer than expected.",
    definition:
      "It is inflammation of the lining of the nose and nearby air spaces called sinuses. It can be short-lived or last longer, especially when allergies, nasal polyps, or another ongoing problem are involved.",
    causes: [
      "A viral cold or flu-like illness is a common trigger for a short episode.",
      "Allergies, nasal polyps, or a structural blockage can contribute to ongoing symptoms.",
      "A dental infection or, less commonly, a bacterial infection may need targeted assessment.",
    ],
    riskFactors: [
      "Allergies, asthma, smoke exposure, or other airborne irritants.",
      "Nasal polyps, a deviated septum, or another problem affecting sinus drainage.",
      "A dental infection near the upper teeth.",
    ],
    symptoms: [
      "A blocked or runny nose, facial pressure or tenderness, and a reduced sense of smell.",
      "Headache, cough, ear pressure, tiredness, bad breath, or tooth discomfort can also occur.",
      "A fever or coloured mucus can occur, but neither alone confirms a bacterial infection.",
    ],
    diagnosis:
      "A clinician usually diagnoses sinusitis from the pattern and duration of symptoms and an examination of the nose. Persistent, recurrent, or unusual symptoms may need further assessment, sometimes with imaging or an ENT review.",
    differentialDiagnosis:
      "Differentiate acute bacterial rhinosinusitis from viral URTI, allergic rhinitis, tension headache, migraine, dental abscess, and trigeminal neuralgia.",
    conventionalManagement:
      "Care may include symptom relief, saline nasal rinses, and a clinician- or pharmacist-advised nasal spray. Antibiotics or surgery are reserved for selected situations after assessment.",
    homeopathicApproach:
      "Reliable clinical evidence has not established homeopathy as a treatment for sinusitis. It should not delay assessment of severe, worsening, persistent, or eye-related symptoms, or treatment advised by a clinician.",
    lifestyleAdvice:
      "Rest, fluids, simple pain relief if safe for you, and saline nasal rinses can help some people. Ask a pharmacist or clinician about nasal sprays and use them as directed. Avoid smoke and do not put hot steam close to the face, especially for children.",
    references: ["CIT-0020", "CIT-0021", "CIT-0022", "CIT-0043"],
    faqs: [
      {
        question: "When should sinusitis symptoms be checked urgently?",
        answer:
          "Seek urgent care for swelling or redness around an eye, a change in vision, a severe or worsening headache, confusion, a stiff neck, severe illness, or a very high fever. These symptoms are uncommon but can signal a serious complication.",
      },
      {
        question: "Can homeopathy replace medical treatment for sinusitis?",
        answer:
          "No. Do not use homeopathy to delay urgent care, prescribed treatment, or an ENT assessment when a clinician recommends one.",
      },
      {
        question: "What is a sensible first step for new sinus symptoms?",
        answer:
          "Most new symptoms follow a cold and settle with time. Speak to a pharmacist or clinician if you are very unwell, symptoms worsen, they keep returning, or they do not improve as expected.",
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
    specialty: "Clinical Otolaryngology & Governance",
    institution: "Homeo Healthcare Clinical Board",
  },
  reviewerRole: "Program-owner final clinical authorization",
  lastClinicalReview: "2026-07-31",
  nextClinicalReview: "2027-07-31",
  evidenceLevel: "Consensus-Guidance",
  tags: ["Sinusitis", "Disease", "EPOS-2020", "Rhinology", "Emergency-Safety"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/sinusitis",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.0",
  changeLog: [
    "1.0.0: Initial release of Sinusitis profile",
    "1.1.0: Upgraded with EPOS 2020 evidence citations (CIT-0043), passage-level claim citations (D0006-KEYNOTES, D0006-EMERGENCY-LIMITS, D0006-REGULATORY-LIMITS), orbital cellulitis red flags, and emergency ENT non-replacement rules",
    "1.2.0: Reframed the opening around symptoms, expected recovery, and evidence-based care boundaries.",
  ],
};
