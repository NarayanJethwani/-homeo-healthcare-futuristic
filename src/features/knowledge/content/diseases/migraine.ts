import { KnowledgeEntity } from "../../types";

export const MigraineDisease: KnowledgeEntity = {
  id: "D0003",
  slug: "migraine",
  entityType: "disease",
  editorialStatus: "published",
  versionInfo: {
    version: "1.0.0",
    created: "2026-06-30T12:00:00Z",
    updated: "2026-06-30T12:00:00Z",
    reviewed: "2026-06-30T12:00:00Z"
  },
  title: {
    en: "Migraine Headache",
    hi: "माइग्रेन (आधासीसी का दर्द)",
    gu: "આધાશીશી અને માથાનો દુખાવો (Migraine)",
    mr: "अर्धशिशी आणि डोकेदुखी (Migraine)",
    es: "Migraña",
    ar: "الصداع النصفي (Migraine)"
  },
  summary: {
    en: "A neurological condition characterized by recurrent, moderate-to-severe throbbing headaches, often unilateral and accompanied by nausea and sensory sensitivity.",
    hi: "एक न्यूरोलॉजिकल स्थिति जिसमें सिर के एक हिस्से में तेज, धड़कता हुआ दर्द होता है, साथ ही मतली और प्रकाश के प्रति संवेदनशीलता होती है.",
    gu: "એક ન્યુરોલોજીકલ સ્થિતિ જેમાં માથાના એક ભાગમાં તીવ્ર, ધબકારા સાથે દુખાવો થાય છે, સાથે ઉબકા અને પ્રકાશ-અવાજની એલર્જી હોય છે.",
    mr: "मेंदूशी संबंधित आजार ज्यामध्ये डोक्याच्या एका भागात तीव्र वेदना होतात, सोबत मळमळ आणि प्रकाश-आवाज न सहन होणे अशी लक्षणे दिसतात.",
    es: "Una condición neurológica caracterizada por dolores de cabeza recurrentes y palpitantes.",
    ar: "حالة عصبية تتميز بنوبات متكررة من الصداع النابض المعتدل إلى الشديد."
  },
  content: {
    overview: "Migraine is a common, disabling primary headache disorder. It is characterized by recurrent attacks of pulsating headache, typically unilateral, lasting 4 to 72 hours. It is frequently accompanied by autonomic nervous system symptoms like nausea, vomiting, photophobia (sensitivity to light), and phonophobia (sensitivity to sound).",
    definition: "Migraine is classified by the International Classification of Headache Disorders (ICHD) as a primary headache. It involves neurovascular mechanisms where trigeminal nerve activation leads to the release of calcitonin gene-related peptide (CGRP) and neurogenic inflammation of dural blood vessels.",
    causes: [
      "Trigeminovascular system activation.",
      "Cortical spreading depression (CSD): A wave of neuronal depolarization followed by suppression, associated with migraine aura.",
      "Fluctuations in central neurotransmitters, particularly serotonin (5-HT).",
      "Genetic susceptibility: Multiple genes affecting calcium and sodium channels in brain cells."
    ],
    riskFactors: [
      "Female sex (prevalence is 3 times higher in women due to hormonal cycles).",
      "Family history of migraine.",
      "High stress levels and anxiety.",
      "Irregular sleep patterns or sleep deprivation.",
      "Dietary triggers: Aged cheeses, artificial sweeteners, monosodium glutamate (MSG), nitrates, and alcohol."
    ],
    symptoms: [
      "Unilateral throbbing pain: Typically affects one side of the head, though it can be bilateral.",
      "Aura (in 25-30% of cases): Transient focal neurological symptoms, most commonly visual disturbances like zig-zag lines or flashing lights.",
      "Sensory sensitivities: Extreme aversion to light, sound, and smells.",
      "Gastrointestinal upset: Nausea, abdominal cramping, and vomiting."
    ],
    diagnosis: "Diagnosed clinically using diagnostic criteria. The standard requires at least 5 attacks lasting 4-72 hours, having at least two pain characteristics (unilateral, pulsating, moderate/severe pain, aggravation by physical activity) and at least one associated symptom (nausea/vomiting, photophobia/phonophobia).",
    differentialDiagnosis: "Tension-type headache, Cluster headache, Secondary headache (due to hypertension, aneurysm, or brain tumor), and Medication-overuse headache.",
    labTests: [
      "Thyroid Stimulating Hormone (TSH) to screen for hypo- or hyperthyroidism, which can exacerbate chronic headache patterns.",
      "Basic metabolic panel (BMP) to rule out electrolyte disturbances."
    ],
    imaging: "Brain MRI or CT scan is indicated only if atypical headache characteristics or focal neurological deficits are present, to rule out structural pathology.",
    redFlags: [
      "SNOOP criteria: Systemic symptoms (fever, weight loss).",
      "Neurological deficits or sudden cognitive changes.",
      "Onset sudden: 'Thunderclap' headache reaching maximum severity within 1 minute (suggests subarachnoid hemorrhage).",
      "Older age of onset: First headache after age 50 (suggests giant cell arteritis or mass lesion).",
      "Pattern change: Progressive headache or change in typical features."
    ],
    conventionalManagement: "Management includes acute abortive therapy (Triptans like Sumatriptan, NSAIDs, and CGRP antagonists like Ubrogepant) and preventive therapy (Beta-blockers, Amitriptyline, Topiramate, or monoclonal antibodies targeting CGRP pathways).",
    homeopathicApproach: "Homeopathy looks at the patient's individual pain patterns (e.g. right-sided vs. left-sided, ameliorated by pressure or cold), emotional triggers, and constitutional features. Remedies like Nux Vomica and Sulphur are prescribed based on these systemic correlations to reduce attack frequency without dependency.",
    lifestyleAdvice: "Maintain a structured daily routine with regular sleep times and consistent meals. Drink at least 2 liters of water daily. Keep a headache diary to identify trigger foods or weather conditions. Practice stress-reduction techniques (meditation, yoga). Limit caffeine consumption.",
    references: ["CIT-0003"]
  },
  author: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)"
  },
  reviewer: {
    name: "Dr. Narayan Jethwani",
    credentials: "MD (Hom)",
    specialty: "Constitutional Medicine",
    institution: "Homeo Healthcare Clinic"
  },
  evidenceLevel: "Level-B",
  tags: ["Migraine", "Headache", "Throbbing Pain", "Neurology", "Aura"],
  canonicalUrl: "https://homeo.healthcare/knowledge/diseases/migraine",
  readingTimeMinutes: 6,
  audience: "patient",
  license: "CC BY-NC-ND 4.5",
  changeLog: ["1.0.0: Initial release of Migraine disease profile"]
};
