export interface Personas {
  newlyDiagnosed: string;
  chronicSufferers: string;
  recurrentCases: string;
  complementaryCare: string;
  medicationSideEffects: string;
}

export interface RootCauseAxis {
  epigeneticSusceptibility: string;
  functionalAxis: string;
  clinicalManifestation: string;
}

export interface SymptomArray {
  mostCommon: string[];
  moderate: string[];
  advanced: string[];
}

export interface RiskFactors {
  lifestyle: string[];
  genetic: string[];
  environmental: string[];
  metabolic: string[];
  psychological: string[];
}

export interface TreatmentTimeline {
  week1: string;
  month1: string;
  month3: string;
  month6: string;
  longTermFollowUp: string;
}

export interface LifestyleRecommendations {
  diet: string;
  exercise: string;
  sleep: string;
  stress: string;
  hydration: string;
  environmentalExposure: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOMetadata {
  metaTitle: string;
  metaDescription: string;
  slug: string;
  keywords: string[];
  openGraphDescription: string;
}

export interface Microcopy {
  ctaButtonText: string;
  appointmentCta: string;
  trustBadge: string;
  emptyState: string;
  loadingMessage: string;
  consultationReminder: string;
}

export interface VisualSuggestions {
  icons: string[];
  illustrations: string[];
  infographics: string[];
  anatomicalDiagrams: string[];
  animatedPathways: string[];
  diseaseProgressionVisuals: string[];
}

export interface KnowledgeGraphJSON {
  condition: string;
  symptoms: string[];
  triggers: string[];
  riskFactors: string[];
  systemsInvolved: string[];
  clinicalPathways: string[];
  relatedServices: string[];
  tags: string[];
}

export interface SpecialtyProfile {
  id: string;
  title: string;
  shortSubtitle: string;
  heroDescription: string;
  overview: string;
  whoCanBenefit: Personas;
  rootCauseAxis: RootCauseAxis;
  underlyingBiologicalDrivers: string[];
  symptoms: SymptomArray;
  associatedConditions: string[];
  riskFactors: RiskFactors;
  constitutionalPerspective: string;
  treatmentPhilosophy: string;
  expectedTreatmentJourney: TreatmentTimeline;
  lifestyleRecommendations: LifestyleRecommendations;
  faqs: FAQItem[];
  medicalDisclaimer: string;
  seo: SEOMetadata;
  microcopy: Microcopy;
  visualSuggestions: VisualSuggestions;
  knowledgeGraph: KnowledgeGraphJSON;
}

export const SPECIALTY_PROFILES: Record<string, SpecialtyProfile> = {
  "heart-cardiovascular": {
    id: "heart-cardiovascular",
    title: "Heart & Cardiovascular Disorders",
    shortSubtitle: "Constitutional Cardiovascular Profile",
    heroDescription: "Cardiovascular conditions reflect systemic autonomic and vascular imbalances rather than isolated cardiac defects. Essential hypertension, rhythm disturbances, and arterial stiffness emerge when neuroendocrine stress, endothelial dysfunction, and genetic diathesis converge. Standard symptom suppression often leaves underlying vascular resistance unaddressed. Our constitutional approach evaluates individual arterial reactivity and systemic metabolism, working alongside conventional cardiology to restore physiological harmony and long-term vascular resilience.",
    overview: "Cardiovascular disease progresses silently along an endothelial and autonomic continuum. Chronic activation of the sympathetic nervous system increases arterial tone, driving microvascular remodeling and systemic blood pressure elevation. Common misconceptions view hypertension solely as a salt-sensitive or mechanical plumbing problem, ignoring the profound role of HPA axis dysregulation, oxidative arterial wall damage, and low-grade systemic inflammation. Lifestyle factors including circadian disruption, refined dietary sugars, and prolonged psychological strain accelerate vascular stiffness. Constitutional homeopathic care targets the underlying susceptibility—calming autonomic hyper-reactivity and supporting endogenous self-regulatory mechanisms while maintaining full alignment with standard medical care.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients with recent mild-to-moderate blood pressure spikes seeking non-invasive root-cause support.",
      chronicSufferers: "Individuals managing long-standing hypertension or vascular stiffness requiring systemic physiological balancing.",
      recurrentCases: "Patients experiencing recurrent stress-induced palpitations or labile blood pressure fluctuations.",
      complementaryCare: "Individuals undergoing conventional cardiology care who wish to optimize overall vascular wellness.",
      medicationSideEffects: "Patients seeking constitutional support to manage fatigue, cold extremities, or metabolic lethargy related to systemic burden."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited vulnerability for arterial wall stiffness, altered mineral transport, and autonomic hyper-reactivity.",
      functionalAxis: "Chronic Stress ➔ Autonomic Dysregulation ➔ Inflammatory Signalling ➔ Microvascular Dysfunction ➔ Arterial Hypertension",
      clinicalManifestation: "Elevated systemic blood pressure, cardiac rhythm fluctuations, arterial wall remodeling, and reduced exercise stamina."
    },
    underlyingBiologicalDrivers: [
      "Autonomic nervous system imbalance (sympathetic dominance)",
      "Endothelial nitric oxide synthase (eNOS) uncoupling",
      "Chronic systemic micro-inflammation",
      "HPA axis hyper-activation & elevated cortisol",
      "Arterial smooth muscle hyper-tonicity",
      "Oxidative stress & lipid peroxidation",
      "Renin-angiotensin-aldosterone system (RAAS) dysregulation",
      "Cellular magnesium & electrolyte transport alterations",
      "Subclinical insulin resistance & AGE deposition",
      "Mitochondrial fatigue within cardiomyocytes"
    ],
    symptoms: {
      mostCommon: [
        "Elevated blood pressure readings",
        "Occasional cardiac palpitations",
        "Exertional shortness of breath",
        "Occasional morning occipital headaches"
      ],
      moderate: [
        "Lightheadedness upon rapid standing",
        "Coldness or numbness in hands and feet",
        "Tightness in chest during acute stress",
        "Persistent fatigue and low stamina"
      ],
      advanced: [
        "Labile hypertension spikes under minimal stress",
        "Exertional angina-like tightness",
        "Lower extremity peripheral edema",
        "Chronic nocturnal dyspnea episodes"
      ]
    },
    associatedConditions: [
      "Essential Hypertension",
      "Hyperlipidemia & Atherosclerosis",
      "Metabolic Syndrome & Type 2 Diabetes",
      "Autonomic Cardioneurosis & Arrhythmia Support",
      "Peripheral Vascular Insufficiency"
    ],
    riskFactors: {
      lifestyle: ["Sedentary daily routine", "High refined sugar & sodium intake", "Tobacco use", "Circadian misalignment"],
      genetic: ["Family history of early hypertension", "Endothelial gene variants", "Hyper-homocysteinemia predisposition"],
      environmental: ["Chronic noise exposure", "Heavy metal toxicity", "Microplastic exposure"],
      metabolic: ["Insulin resistance", "Elevated ApoB and high-sensitivity CRP", "Central adiposity"],
      psychological: ["Suppressed chronic anger", "High-stress executive burnout", "Persistent health anxiety"]
    },
    constitutionalPerspective: "From a classical constitutional perspective, cardiovascular symptoms express an adaptive strain of the vital force under chronic stress and inherited diathesis. Rather than viewing high blood pressure as an isolated target to suppress, constitutional analysis evaluates the patient's thermal state, emotional reactivity, sleep architecture, and miasmatic profile. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We utilize precise, single-remedy constitutional selection tailored to the patient's unique physical and neuro-emotional totality. Treatment emphasizes long-term biological regulation, gradual autonomic resetting, and lifestyle optimization. We maintain active collaboration with treating cardiologists and primary care physicians, ensuring patient safety and objective monitoring of blood pressure, lipid panels, and vascular markers.",
    expectedTreatmentJourney: {
      week1: "Comprehensive baseline case taking, constitutional profiling, and initial autonomic calming support.",
      month1: "Stabilization of acute stress-induced pressure spikes and improvement in sleep quality.",
      month3: "Enhanced vascular elasticity, reduced frequency of palpitations, and improved exercise tolerance.",
      month6: "Sustained physiological regulation with measurable improvements in overall cardiovascular stamina.",
      longTermFollowUp: "Periodic constitutional reviews to maintain systemic balance and prevent stress-related relapses."
    },
    lifestyleRecommendations: {
      diet: "Whole-food, antioxidant-rich Mediterranean eating plan abundant in leafy greens, beets, bioflavonoids, and omega-3 fatty acids.",
      exercise: "30 minutes of moderate zone-2 aerobic activity daily (brisk walking, swimming) combined with gentle breathwork.",
      sleep: "Strict 7-8 hours of circadian-aligned rest in a completely darkened, quiet environment.",
      stress: "Daily 15-minute heart-rate variability (HRV) biofeedback or box breathing exercises.",
      hydration: "2.5 liters of filtered mineral-rich water daily, avoiding excessive caffeine and stimulant drinks.",
      environmentalExposure: "Minimize exposure to endocrine-disrupting plastics, pesticides, and chronic environmental noise."
    },
    faqs: [
      {
        question: "Can I continue my blood pressure medications while taking homeopathic remedies?",
        answer: "Yes. Homeopathic remedies work through gentle energetic regulation and do not interfere pharmacologically with blood pressure medications. Patients should never discontinue or adjust prescribed medications without direct guidance from their treating physician."
      },
      {
        question: "Can homeopathy be combined with conventional cardiology treatment?",
        answer: "Absoluty. Our practice is fully integrative. We collaborate with cardiologists, monitoring objective lab parameters and blood pressure logs alongside your medical team."
      },
      {
        question: "How long does constitutional cardiovascular support usually take?",
        answer: "While initial stress mitigation and autonomic stabilization often occur within 2 to 4 weeks, deeper constitutional balancing generally takes 3 to 6 months of steady care."
      },
      {
        question: "Is online consultation available for cardiovascular conditions?",
        answer: "Yes. Video consultations are available for comprehensive case taking, review of diagnostic reports, and constitutional remedy selection worldwide."
      },
      {
        question: "Does homeopathy treat structural heart defects?",
        answer: "No. Structural abnormalities such as severe valve stenosis or anatomical defects require medical and surgical management. Homeopathy acts supportively on autonomic function, vascular tone, and overall constitutional vitality."
      },
      {
        question: "How are treatment progress and safety monitored?",
        answer: "We track home blood pressure logs, heart rate variability markers, sleep quality scores, and clinical symptom diaries alongside standard lab tests."
      },
      {
        question: "What is the constitutional perspective on cholesterol?",
        answer: "Cholesterol is viewed as a vital repair substrate that rises in response to arterial inflammation and oxidative stress. Constitutional treatment aims to reduce systemic inflammation rather than focusing solely on a single serum number."
      },
      {
        question: "Are homeopathic cardiac remedies safe for elderly patients?",
        answer: "Yes. Classical homeopathic remedies are ultra-diluted, non-toxic, and free of organ toxicity or drug interactions, making them exceptionally safe for elderly patients."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients should never discontinue or alter prescribed cardiovascular medications without consulting their treating physician or cardiologist.",
    seo: {
      metaTitle: "Constitutional Cardiovascular Care | Integrative Heart & Vascular Health | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathy for hypertension, palpitations, and vascular health. Integrated with conventional cardiology for comprehensive, root-cause wellness.",
      slug: "heart-cardiovascular",
      keywords: ["cardiovascular homeopathy", "hypertension root cause", "palpitations relief", "integrative cardiology", "constitutional blood pressure support"],
      openGraphDescription: "Discover evidence-informed constitutional homeopathy for cardiovascular balance and vascular vitality at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Cardiovascular Care",
      appointmentCta: "Schedule Constitutional Cardiac Profile",
      trustBadge: "Integrative Cardiology Compliant • 20+ Years Clinical Expertise",
      emptyState: "Select a condition to view complete clinical root-cause analysis.",
      loadingMessage: "Loading constitutional cardiovascular profile...",
      consultationReminder: "Please bring your recent blood pressure logs and cardiac lab reports to your initial consultation."
    },
    visualSuggestions: {
      icons: ["Heart", "Activity", "ShieldCheck", "Dna"],
      illustrations: ["Vascular endothelium cross-section", "Autonomic nervous system balance diagram"],
      infographics: ["5-Phase Recovery Timeline for Vascular Tone", "Functional Axis of Hypertension"],
      anatomicalDiagrams: ["Arterial wall layers and endothelial nitric oxide pathways"],
      animatedPathways: ["Flow chart: Stress ➔ Autonomic Overdrive ➔ Arterial Resistance"],
      diseaseProgressionVisuals: ["Endothelial health preservation vs chronic arterial stiffness timeline"]
    },
    knowledgeGraph: {
      condition: "Heart & Cardiovascular Disorders",
      symptoms: ["Elevated blood pressure", "Palpitations", "Shortness of breath", "Occipital headache", "Chest tightness", "Fatigue"],
      triggers: ["Chronic psychological stress", "Circadian disruption", "High sodium intake", "Sedentary strain"],
      riskFactors: ["Family history of hypertension", "Insulin resistance", "Endothelial dysfunction", "Elevated hs-CRP"],
      systemsInvolved: ["Cardiovascular System", "Autonomic Nervous System", "Renal-Endocrine Axis"],
      clinicalPathways: ["Autonomic Regulation", "Endothelial Protection", "Stress-Axis Modulation"],
      relatedServices: ["Neuro & Mental Health", "Metabolic & Diabetes Support", "Kidney & Renal Care"],
      tags: ["Hypertension", "Cardiology", "Palpitations", "Vascular Health", "Constitutional Homeopathy"]
    }
  },

  "lungs-respiratory": {
    id: "lungs-respiratory",
    title: "Lungs & Respiratory Health",
    shortSubtitle: "Constitutional Pulmonary & Mucosal Profile",
    heroDescription: "Respiratory disorders such as bronchial asthma, chronic bronchitis, sinusitis, and allergic rhinitis represent heightened mucosal reactivity and compromised pulmonary clearance. Symptoms like bronchial spasm, excessive mucous production, and coughing are protective physiological attempts to expel irritants. Standard bronchodilators provide immediate rescue but rarely address the underlying atopic diathesis or immunodynamic instability. Our constitutional care recalibrates mucosal immunity and calms hypersensitive reflexes, offering supportive care alongside conventional pulmonology.",
    overview: "The respiratory tract serves as the primary barrier interface between the external atmosphere and the internal environment. When airway mucosal immunity is compromised or hyper-reactive, minor environmental triggers—such as dust mites, pollen, temperature shifts, or airborne toxins—trigger immediate mast cell degranulation, smooth muscle spasm, and hyper-secretion of mucous. Respiratory conditions often stem from an inherited atopic constitution compounded by repeated viral insults, environmental pollution, and gut-respiratory axis imbalances. Classical homeopathic treatment addresses bronchial susceptibility and mucosal vulnerability, strengthening pulmonary endurance naturally.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing early seasonal allergic rhinitis or reactive airway cough.",
      chronicSufferers: "Individuals with long-standing bronchial asthma or chronic bronchitis needing deep immunodynamic stabilization.",
      recurrentCases: "Patients suffering frequent sinusitis relapses every seasonal transition.",
      complementaryCare: "Individuals using inhalers who desire supportive constitutional care to build overall pulmonary resilience.",
      medicationSideEffects: "Patients seeking natural support for mucosal dryness or jitteriness associated with frequent bronchodilator use."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited atopic diathesis, bronchial hyper-responsiveness, and mucosal tight-junction permeability.",
      functionalAxis: "Vagal Nerve Hyper-reactivity ➔ Bronchial Smooth Muscle Spasm ➔ Mucosal Hyper-secretion ➔ Airway Resistance",
      clinicalManifestation: "Wheezing, spasmodic coughing, nasal congestion, dyspnea, and chronic sinus pressure."
    },
    underlyingBiologicalDrivers: [
      "Bronchial hyper-reactivity to environmental antigens",
      "Mast cell instability & IgE-mediated histamine release",
      "Epithelial mucosal barrier erosion",
      "Vagal nerve neuro-genic inflammation",
      "Gut-lung axis dysbiosis & systemic immune burden",
      "Chronic subclinical pulmonary inflammation",
      "Impaired ciliary clearance velocity",
      "Oxidative stress in alveolar tissue",
      "Environmental pollutant & particulate exposure",
      "Lymphatic stagnation in hilar and cervical nodes"
    ],
    symptoms: {
      mostCommon: [
        "Recurrent wheezing and chest tightness",
        "Spasmodic cough worse at night or early morning",
        "Nasal congestion and paroxysmal sneezing",
        "Frequent throat clearing"
      ],
      moderate: [
        "Shortness of breath during mild exertion",
        "Thick mucoid post-nasal drip",
        "Frontal sinus headache and facial tenderness",
        "Disturbed sleep due to coughing fits"
      ],
      advanced: [
        "Persistent nocturnal asthma attacks",
        "Chronic bronchial air trapping (COPD pattern support)",
        "Intercostal muscle strain from severe coughing",
        "Exercise-induced respiratory exhaustion"
      ]
    },
    associatedConditions: [
      "Bronchial Asthma",
      "Allergic Rhinitis & Sinusitis",
      "Chronic Bronchitis",
      "COPD Supportive Care",
      "Hypersensitivity Pneumonitis Support"
    ],
    riskFactors: {
      lifestyle: ["Active or passive tobacco smoke", "Poor indoor air ventilation", "Sedentary shallow breathing patterns"],
      genetic: ["Family history of asthma or eczema", "Atopic gene markers", "IgE hyper-production tendency"],
      environmental: ["High pollen counts", "Industrial smog & PM2.5 particulate matter", "Mold spore exposure"],
      metabolic: ["GERD (acid reflux irritating airways)", "Pro-inflammatory omega-6 heavy diet"],
      psychological: ["Emotional grief & suppressed anxiety", "Panic-induced hyperventilation"]
    },
    constitutionalPerspective: "In classical homeopathy, the lungs are recognized as major organs of elimination and emotional expression. Respiratory symptoms reflect an internal susceptibility (atopic miasmatic diathesis) where the mucous membranes over-respond to neutral ambient factors. Constitutional profiling evaluates the specific triggers (cold air, exertion, dampness), time of aggravation, thermal preferences, and emotional state. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We employ individualized constitutional remedies selected according to complete symptom totality. The aim is to reduce airway hypersensitivity, support natural mucosal repair, and enhance respiratory clearance. We advocate safe co-management with pulmonology recommendations, ensuring patients maintain prescribed rescue inhalers while systematically building long-term constitutional endurance.",
    expectedTreatmentJourney: {
      week1: "Detailed pulmonary case history, allergen identification, and initial spasmolytic constitutional support.",
      month1: "Reduction in acute bronchial spasm intensity and improved nocturnal breathing comfort.",
      month3: "Decreased frequency of seasonal allergic flares and improved exercise tolerance.",
      month6: "Enhanced pulmonary clearance, reduced reliance on symptomatic interventions, and sustained respiratory vitality.",
      longTermFollowUp: "Seasonal constitutional maintenance prior to known allergy peaks."
    },
    lifestyleRecommendations: {
      diet: "Mucus-reducing, anti-inflammatory warm meals, rich in quercetin (onions, apples), omega-3 fatty acids, and turmeric.",
      exercise: "Diaphragmatic breathing exercises, Pranayama, and moderate outdoor walking in clean air environments.",
      sleep: "Elevated head pillow alignment and HEPA air purification in the bedroom.",
      stress: "Mindful breathing techniques to prevent stress-induced hyperventilation.",
      hydration: "3 liters of warm water and herbal infusions daily to keep bronchial mucous thin and easily cleared.",
      environmentalExposure: "Encasing mattresses in dust-mite covers, eliminating artificial air fresheners, and avoiding mold."
    },
    faqs: [
      {
        question: "Should I stop using my asthma inhaler when starting homeopathic treatment?",
        answer: "No. Rescue and controller inhalers prescribed by your pulmonologist must be continued. Adjustments should only be made by your treating chest physician as your lung function improves objectively."
      },
      {
        question: "Can homeopathy help with chronic sinusitis that returns every winter?",
        answer: "Yes. Constitutional homeopathy targets mucosal vulnerability and sinus drainage mechanics, helping reduce winter relapse frequency."
      },
      {
        question: "Is homeopathic treatment safe for children with allergic bronchitis?",
        answer: "Extremely safe. Homeopathic remedies are gentle, sweet-tasting, non-addictive, and free of side effects such as growth suppression or oral thrush."
      },
      {
        question: "How does homeopathy address the root cause of allergies?",
        answer: "Rather than blocking histamine receptors artificially, constitutional remedies desensitize the immune response and strengthen epithelial barrier integrity over time."
      },
      {
        question: "Can COPD patients receive supportive homeopathic care?",
        answer: "Yes. While structural lung tissue damage in advanced COPD is irreversible, constitutional care supports bronchial clearance, reduces secondary infection vulnerability, and improves quality of life."
      },
      {
        question: "What diagnostic tests are helpful during consultation?",
        answer: "Spirometry (PFT), Absolute Eosinophil Count (AEC), Serum IgE levels, and sinus X-rays/CT scans provide valuable objective context."
      },
      {
        question: "How quickly can I expect relief from an acute bronchial cough?",
        answer: "Acute homeopathic remedies tailored to specific cough characteristics can bring comfort within days, while constitutional background work continues in parallel."
      },
      {
        question: "Are there dietary restrictions during respiratory treatment?",
        answer: "We recommend avoiding cold, damp, heavy foods, artificial preservatives, and known personal dietary triggers during active treatment."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients should never discontinue prescribed asthma inhalers or emergency respiratory medications without consulting their treating physician.",
    seo: {
      metaTitle: "Constitutional Respiratory & Asthma Care | Homeo Healthcare",
      metaDescription: "Comprehensive constitutional homeopathic support for asthma, bronchitis, sinusitis, and allergic rhinitis. Built on functional pulmonary medicine principles.",
      slug: "lungs-respiratory",
      keywords: ["asthma homeopathy", "chronic sinusitis natural care", "allergic rhinitis root cause", "pulmonary wellness", "bronchitis constitutional remedy"],
      openGraphDescription: "Breathe easier with evidence-informed constitutional respiratory care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Respiratory Care",
      appointmentCta: "Schedule Respiratory Constitutional Intake",
      trustBadge: "Pulmonary Safety Compliant • Non-Suppressive Care",
      emptyState: "Select a respiratory condition to review clinical mapping.",
      loadingMessage: "Loading constitutional respiratory profile...",
      consultationReminder: "Please bring recent spirometry reports and allergen test results to your consultation."
    },
    visualSuggestions: {
      icons: ["Wind", "ShieldCheck", "Activity", "Sprout"],
      illustrations: ["Bronchial tree lumen cross-section", "Alveolar gas exchange dynamics"],
      infographics: ["Mucosal Desensitization Timeline", "Gut-Lung Axis Pathway Diagram"],
      anatomicalDiagrams: ["Paranasal sinuses drainage pathways"],
      animatedPathways: ["Vagal stimulation ➔ Bronchial spasm ➔ Resolution pathway"],
      diseaseProgressionVisuals: ["Healthy mucosal lining vs chronic asthmatic remodeling graphic"]
    },
    knowledgeGraph: {
      condition: "Lungs & Respiratory Health",
      symptoms: ["Wheezing", "Spasmodic cough", "Nasal congestion", "Sinus headache", "Dyspnea", "Chest tightness"],
      triggers: ["Pollen", "Dust mites", "Cold draughts", "Air pollution", "Viral infections"],
      riskFactors: ["Atopic predisposition", "Tobacco exposure", "Impaired gut flora", "Environmental toxins"],
      systemsInvolved: ["Respiratory System", "Immune System", "Mucosal Lymphatic Network"],
      clinicalPathways: ["Bronchial Desensitization", "Mucosal Barrier Fortification", "Vagal Tone Balancing"],
      relatedServices: ["Allergies", "Paediatric Care", "Neuro & Mental Health"],
      tags: ["Asthma", "Sinusitis", "Bronchitis", "Allergies", "Pulmonary Health"]
    }
  },

  "neuro-mental-health": {
    id: "neuro-mental-health",
    title: "Neuro & Mental Health",
    shortSubtitle: "Constitutional Neuro-Endocrine Profile",
    heroDescription: "Neurological and psychological symptoms—such as chronic migraines, generalized anxiety, tension headaches, insomnia, and burnout—reflect systemic neuro-chemical and autonomic overload. The brain and peripheral nervous system do not function in isolation; they are intimately connected with the enteric nervous system, adrenal glands, and immune signalling pathways. Conventional therapies often focus exclusively on symptomatic neurotransmitter modulation. Constitutional homeopathy evaluates the totality of emotional history, neural sensitivities, and physical reactivity to restore neural homeostasis and stress resilience.",
    overview: "Neurological tension and emotional distress represent complex adaptive responses of the central nervous system to prolonged physical, environmental, or psychological strain. Chronic activation of the sympathetic nervous system triggers continuous cortisol secretion, neuro-inflammation, and eventual neurotransmitter depletion. Conditions like migraines stem from neuro-vascular instability and trigeminal nerve hyper-excitability, while insomnia and anxiety express underlying hypothalamic-pituitary-adrenal (HPA) axis dysregulation. Constitutional homeopathic treatment addresses the patient's unique neural sensitivity profile, calming sympathetic overdrive and fostering long-term emotional and neurological balance.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing recent onset stress-induced tension headaches or sleep fragmentation.",
      chronicSufferers: "Individuals enduring long-standing migraines, persistent anxiety, or chronic fatigue syndrome.",
      recurrentCases: "Patients with cyclical panic attacks or seasonal emotional fluctuations.",
      complementaryCare: "Individuals receiving psychotherapy or conventional psychiatric support seeking holistic vital balancing.",
      medicationSideEffects: "Patients looking for gentle constitutional support to manage morning groggy states or emotional blunting."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited nervous system hypersensitivity, neurotransmitter receptor vulnerability, and stress-axis labileness.",
      functionalAxis: "HPA Axis Hyper-activation ➔ Neuro-inflammation ➔ Neurotransmitter Imbalance ➔ Somatic Fatigue & Migraines",
      clinicalManifestation: "Unilateral throbbing headache, anxious rumination, sleep architecture disturbance, and cognitive brain fog."
    },
    underlyingBiologicalDrivers: [
      "Hypothalamic-pituitary-adrenal (HPA) axis overdrive",
      "Trigeminal nerve hyper-vascular reactivity",
      "Enteric-brain axis dysbiosis & neurotransmitter deficits",
      "Central nervous system micro-glial activation",
      "Melatonin synthesis & circadian rhythm impairment",
      "Excitatory glutamate-GABA neurotransmitter imbalance",
      "Subclinical thyroid-adrenal axis fatigue",
      "Cellular magnesium depletion from chronic stress",
      "Cerebral micro-circulatory vasospasm",
      "Unresolved psycho-emotional trauma & somatic hold"
    ],
    symptoms: {
      mostCommon: [
        "Recurrent throbbing headaches or migraines",
        "Persistent internal restlessness and worry",
        "Difficulty falling asleep or frequent night waking",
        "Mental fatigue and loss of concentration"
      ],
      moderate: [
        "Sensory hypersensitivity (light, sound, smells during headache)",
        "Somatic muscle tension in neck and shoulders",
        "Irritability and emotional vulnerability",
        "Morning exhaustion despite hours in bed"
      ],
      advanced: [
        "Frequent disabling migraine attacks with visual aura",
        "Sudden panic episodes with tachycardia and shortness of breath",
        "Profound chronic fatigue syndrome (CFS) state",
        "Cognitive slowing and memory fog under minor strain"
      ]
    },
    associatedConditions: [
      "Migraine & Tension Headaches",
      "Generalized Anxiety Disorder Support",
      "Chronic Insomnia",
      "Chronic Fatigue Syndrome (CFS / ME)",
      "Fibromyalgia & Somatic Tension"
    ],
    riskFactors: {
      lifestyle: ["Irregular sleep hours", "Excessive blue light screen time", "High caffeine dependency", "Sedentary confinement"],
      genetic: ["Family history of migraines or mood disorders", "COMT/MAO gene variations", "MTHFR methylation variants"],
      environmental: ["Fluorescent lighting", "Noise pollution", "Heavy mental workplace pressure"],
      metabolic: ["Hypoglycemia & blood sugar crashes", "Gut permeability & endotoxemia", "Adrenal fatigue"],
      psychological: ["Perfectionism & hyper-vigilance", "Unexpressed emotional grief", "Burnout from caretaking"]
    },
    constitutionalPerspective: "Classical homeopathy views the mind and body as an inseparable continuum. Neurological and psychological symptoms are not separate diseases but expressions of the central vital dynamics. Constitutional remedy selection takes into intense account the patient's temperament, fears, dream patterns, cognitive style, thermal reactions, and physical modalities. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We provide highly individualized constitutional remedies chosen according to deep mind-body totality. The goal is to calm central nervous system hyper-excitability, improve neuro-vascular stability, and restore healthy sleep architecture. We encourage open communication with neurologists, psychiatrists, and therapists, ensuring a safe, supportive, and integrative clinical journey.",
    expectedTreatmentJourney: {
      week1: "In-depth neuro-emotional case analysis, trigger identification, and initial calming constitutional support.",
      month1: "Reduction in acute migraine severity and gradual improvement in sleep onset time.",
      month3: "Decreased frequency of headaches, reduced daily anxiety baseline, and improved cognitive clarity.",
      month6: "Sustained neuro-vascular stability, resilience against daily stressors, and restored vital energy.",
      longTermFollowUp: "Periodic maintenance reviews during major life transitions or high-stress periods."
    },
    lifestyleRecommendations: {
      diet: "Brain-nourishing Mediterranean diet rich in wild-caught fish, walnuts, avocados, dark leafy greens, and magnesium-rich seeds.",
      exercise: "Daily gentle movement such as Yoga, Tai Chi, or walking in nature; avoid over-exhausting high-intensity workouts during burnout phases.",
      sleep: "Strict digital curfew 2 hours before bed, dark room, cool temperature, and consistent sleep-wake times.",
      stress: "Mindfulness meditation, journaling, and progressive muscle relaxation twice daily.",
      hydration: "2.5 liters of structured water daily, avoiding energy drinks and excessive alcohol.",
      environmentalExposure: "Blue-light blocking glasses, indoor plants, and dedicated periods of silent screen-free downtime."
    },
    faqs: [
      {
        question: "Can homeopathy be taken alongside prescribed anti-anxiety or migraine medications?",
        answer: "Yes. Homeopathic remedies do not interact with psychiatric or neurological drugs. Patients should continue all prescribed medications and consult their doctor for any changes."
      },
      {
        question: "How does constitutional homeopathy help with migraines?",
        answer: "It addresses underlying neuro-vascular hyper-reactivity, hormonal triggers, and stress susceptibility, working to reduce both attack frequency and intensity over time."
      },
      {
        question: "Is homeopathy effective for long-standing chronic insomnia?",
        answer: "Yes. By resetting sympathetic nervous system overdrive and supporting natural melatonin dynamics, constitutional remedies help restore natural sleep architecture."
      },
      {
        question: "How long until I see improvement in anxiety symptoms?",
        answer: "Many patients experience a soothing of physical tension within 2 to 3 weeks, with deeper neuro-emotional stability developing over 2 to 4 months of constitutional care."
      },
      {
        question: "Can homeopathy help with cognitive brain fog and memory fatigue?",
        answer: "Yes. By improving micro-circulation, sleep quality, and systemic vitality, brain fog often clears progressively during treatment."
      },
      {
        question: "What diagnostic documentation should I bring?",
        answer: "Brain MRI/CT reports, EEG studies, thyroid panels, vitamin B12/D3 levels, and any psychological assessments are helpful context."
      },
      {
        question: "Does homeopathy treat severe major psychiatric emergencies?",
        answer: "No. Acute psychiatric emergencies, severe clinical depression with suicidality, or psychoses require immediate hospital and specialist psychiatric care. Homeopathy acts supportively in non-emergency chronic states."
      },
      {
        question: "Are homeopathic remedies habit-forming or sedative?",
        answer: "Not at all. Homeopathic remedies are completely non-addictive, non-sedative, and do not cause dependence or withdrawal rebound symptoms."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients facing acute psychiatric crisis or severe neurological emergencies must seek immediate specialist emergency care.",
    seo: {
      metaTitle: "Constitutional Neuro & Mental Health Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic care for chronic migraines, anxiety, insomnia, and neural stress. Integrated with functional neurology.",
      slug: "neuro-mental-health",
      keywords: ["migraine homeopathy", "anxiety natural treatment", "chronic insomnia care", "neuro-vascular health", "constitutional mental wellness"],
      openGraphDescription: "Restore neural calm and mental balance through constitutional homeopathy at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Neurological Care",
      appointmentCta: "Schedule Neuro-Constitutional Assessment",
      trustBadge: "Integrative Neurology Compliant • Non-Sedative Support",
      emptyState: "Select a condition to view detailed neuro-functional axis.",
      loadingMessage: "Loading constitutional neuro-mental profile...",
      consultationReminder: "Please maintain a 2-week headache/sleep diary before your first appointment if possible."
    },
    visualSuggestions: {
      icons: ["Brain", "Activity", "Sparkles", "ShieldCheck"],
      illustrations: ["Trigeminal nerve vascular interaction", "Synaptic neurotransmitter balance schematic"],
      infographics: ["HPA Axis Stress Response Timeline", "Gut-Brain Signal Transduction"],
      anatomicalDiagrams: ["Hypothalamus-Pituitary-Adrenal Axis structure"],
      animatedPathways: ["Stress trigger ➔ Cortisol spike ➔ Neuro-calming pathway"],
      diseaseProgressionVisuals: ["Chronic neural hyper-excitability vs restored neuro-plasticity baseline"]
    },
    knowledgeGraph: {
      condition: "Neuro & Mental Health",
      symptoms: ["Migraine", "Anxiety", "Insomnia", "Brain fog", "Tension headache", "Restlessness", "Somatic fatigue"],
      triggers: ["Psychological stress", "Sleep deprivation", "Bright lights", "Hormonal surges", "Caffeine crashes"],
      riskFactors: ["HPA axis dysregulation", "COMT gene variants", "Chronic emotional strain", "Gut dysbiosis"],
      systemsInvolved: ["Central Nervous System", "Enteric Nervous System", "Endocrine Axis"],
      clinicalPathways: ["Neuro-Vascular Stabilization", "HPA Axis Calming", "GABAergic Modulation"],
      relatedServices: ["Digestive Health", "Hormonal & Thyroid", "Heart & Cardiovascular"],
      tags: ["Migraine", "Anxiety", "Insomnia", "Mental Health", "Neurology"]
    }
  },

  "joints-spine": {
    id: "joints-spine",
    title: "Joints & Spine Health",
    shortSubtitle: "Constitutional Musculoskeletal Profile",
    heroDescription: "Musculoskeletal pain, joint stiffness, osteoarthritis, spondylosis, rheumatoid flares, and sciatica reflect underlying inflammatory cascades, cartilage attrition, and impaired connective tissue metabolism. Pain and restricted mobility are not merely local wear-and-tear events; they represent systemic micro-circulatory stagnation, metabolic crystal deposition, or autoimmune synovial infiltration. Long-term anti-inflammatory reliance can strain renal and gastric organs. Our constitutional approach aims to reduce periarticular inflammation, improve synovial nourishment, and enhance spinal resilience alongside orthopedic care.",
    overview: "Joints and the axial spine bear constant mechanical load while relying on delicate synovial fluid lubrication and dense micro-capillary networks for cartilage nutrition. When systemic inflammation rises or uric acid/metabolic waste clearance slows, synovial membranes become hyperemic, cartilage matrices dehydrate, and periarticular tissues tighten. In osteoarthritis, chondrocyte senescence accelerates; in spondylosis, intervertebral discs lose hydration; and in rheumatoid arthritis, autoimmune complexes target synovial linings. Classical homeopathy addresses the systemic metabolic and constitutional factors governing connective tissue health, easing pain and supporting mobility naturally.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing initial morning joint stiffness or lumbar strain after exertion.",
      chronicSufferers: "Individuals with knee osteoarthritis, cervical spondylosis, or chronic sciatica seeking long-term relief.",
      recurrentCases: "Patients experiencing recurrent gouty flares or weather-sensitive joint pain episodes.",
      complementaryCare: "Individuals undergoing physiotherapy or orthopedic management wanting systemic joint support.",
      medicationSideEffects: "Patients needing natural anti-inflammatory options to avoid daily NSAID gastric irritation."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited vulnerability to synovial inflammatory cascades, cartilage matrix dehydration, or metabolic uric acid retention.",
      functionalAxis: "Systemic Inflammatory Trigger ➔ Synovial Hyperemia ➔ Cartilage Attrition ➔ Periarticular Spasm & Joint Stiffness",
      clinicalManifestation: "Articular pain, morning stiffness, reduced joint range of motion, crepitus, and radicular nerve radiation."
    },
    underlyingBiologicalDrivers: [
      "Synovial micro-vascular congestion & edema",
      "Pro-inflammatory cytokine escalation (TNF-alpha, IL-6)",
      "Cartilage matrix glycosaminoglycan loss",
      "Renal metabolic sluggishness & hyperuricemia",
      "Periarticular muscular spasm & tendonitis",
      "Subchondral bone micro-fractures & osteophyte formation",
      "Autoimmune anti-CCP and RF immune complex deposition",
      "Spinal nerve root compression & neuro-ischemia",
      "Systemic metabolic acidosis & mineral imbalance",
      "Post-traumatic connective tissue scar remodeling"
    ],
    symptoms: {
      mostCommon: [
        "Joint pain aggravated by movement or weather shifts",
        "Morning stiffness lasting over 30 minutes",
        "Lumbar or cervical spinal ache",
        "Crepitus (grating feeling or sound in joints)"
      ],
      moderate: [
        "Swelling and heat around specific joints (knees, ankles, fingers)",
        "Radiating sciatic pain down the leg",
        "Restricted joint flexion or extension",
        "Muscle spasms around inflamed spinal segments"
      ],
      advanced: [
        "Severe nocturnal joint pain breaking sleep",
        "Joint deformity (rheumatoid nodule or severe osteophytic enlargement)",
        "Inability to bear weight without support",
        "Chronic radicular numbness or weakness in limbs"
      ]
    },
    associatedConditions: [
      "Osteoarthritis (Knee, Hip, Hands)",
      "Cervical & Lumbar Spondylosis",
      "Rheumatoid Arthritis Support",
      "Gouty Arthritis",
      "Sciatica & Disc Bulge Support"
    ],
    riskFactors: {
      lifestyle: ["Sedentary posture at desks", "Repetitive mechanical overuse", "Obesity (excess joint load)", "Poor biomechanics"],
      genetic: ["HLA-B27 marker positivity", "Family history of early osteoarthritis or gout", "Collagen gene variants"],
      environmental: ["Cold, damp living environments", "Vibrational machinery exposure", "Prior physical trauma/sports injury"],
      metabolic: ["High purine diet", "Metabolic syndrome", "Systemic low-grade inflammation"],
      psychological: ["Emotional rigidity and chronic stress holding", "Psychogenic pain amplification"]
    },
    constitutionalPerspective: "In classical homeopathy, joint and spinal ailments are deeply linked to the rheumatic and miasmatic constitution (Sycotic or Tubercular diathesis). Remedy selection depends heavily on modalities—whether pain is relieved by motion or rest, warmth or cold application, dry weather or dampness—as well as the patient's thermal state and general vitality. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We prescribe targeted constitutional remedies based on the total symptom presentation, physical modalities, and structural health profile. Treatment focuses on calming periarticular edema, improving local blood circulation, promoting cartilage hydration, and addressing metabolic waste clearance. We work supportively alongside orthopedic surgeons and physiotherapists to optimize physical function.",
    expectedTreatmentJourney: {
      week1: "Comprehensive structural & constitutional evaluation, symptom mapping, and acute pain-soothing support.",
      month1: "Reduction in morning stiffness duration and decreased reliance on daily analgesics.",
      month3: "Improved joint flexibility, reduced joint swelling, and enhanced walking endurance.",
      month6: "Sustained articular stability, overall structural comfort, and better daily quality of life.",
      longTermFollowUp: "Periodic seasonal check-ups before cold/damp weather transitions."
    },
    lifestyleRecommendations: {
      diet: "Anti-inflammatory joint nourishing diet rich in bone broth, wild fish, cherries, turmeric, ginger, and green tea; limit purine-heavy red meats and alcohol.",
      exercise: "Low-impact joint movements such as hydrotherapy, swimming, cycling, and targeted physical therapy exercises.",
      sleep: "Ergonomic supportive orthopedic mattress and cervical pillow alignment.",
      stress: "Mindful body-scan relaxation to release chronic muscle guarding around painful joints.",
      hydration: "3 liters of warm water daily to support kidney purine excretion and cartilage hydration.",
      environmentalExposure: "Keep joints warm with natural wool clothing; avoid damp cold exposures."
    },
    faqs: [
      {
        question: "Can homeopathy reverse advanced cartilage loss in severe knee osteoarthritis?",
        answer: "Homeopathy cannot rebuild completely worn-away cartilage in grade-4 osteoarthritis. However, it can significantly reduce periarticular inflammation, ease pain, improve fluid dynamics, and enhance functional mobility."
      },
      {
        question: "How does homeopathy help in acute gout attacks?",
        answer: "Acute homeopathic remedies help calm intense joint inflammation and heat while constitutional care supports renal excretion of excess uric acid over time."
      },
      {
        question: "Can I take homeopathic remedies alongside physiotherapy?",
        answer: "Yes! Homeopathy and physiotherapy complement each other beautifully—homeopathy reduces inflammation and pain while physical therapy restores strength and range of motion."
      },
      {
        question: "Is homeopathy safe for patients with rheumatoid arthritis taking immunosuppressants?",
        answer: "Yes. Homeopathic remedies do not interfere with biologic or immunosuppressive therapy. Patients must remain on their prescribed medications while receiving supportive care."
      },
      {
        question: "How long does treatment take for chronic cervical spondylosis?",
        answer: "Initial relief from neck tightness and headache often begins in 3 to 4 weeks, with broader spinal stabilization over 3 to 6 months."
      },
      {
        question: "What imaging tests are necessary?",
        answer: "X-rays, MRI scans of the spine/joints, serum Uric Acid, Rheumatoid Factor (RF), anti-CCP, and ESR/hs-CRP reports provide important baseline data."
      },
      {
        question: "Are homeopathic joint remedies safe for the stomach?",
        answer: "Unlike NSAIDs, ultra-diluted homeopathic remedies cause zero gastric ulceration, bleeding, or renal stress, making them exceptionally safe for long-term use."
      },
      {
        question: "Can sciatica be managed homeopathically without surgery?",
        answer: "Mild to moderate disc protrusions causing sciatica often respond well to conservative care including homeopathy, rest, and physiotherapy. Severe neurological deficits require immediate neurosurgical consultation."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients with acute progressive nerve compression, loss of bowel/bladder control, or severe joint fractures must seek immediate emergency orthopedic or neurosurgical evaluation.",
    seo: {
      metaTitle: "Constitutional Joint & Spine Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathy for osteoarthritis, spondylosis, rheumatoid arthritis, and sciatica. Integrated with musculoskeletal medicine.",
      slug: "joints-spine",
      keywords: ["knee osteoarthritis homeopathy", "spondylosis natural treatment", "sciatica root cause", "gout remedy", "rheumatoid arthritis support"],
      openGraphDescription: "Restore mobility and ease joint stiffness with constitutional musculoskeletal care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Joint & Spine Care",
      appointmentCta: "Schedule Musculoskeletal Assessment",
      trustBadge: "Orthopedic Safety Compliant • Zero Gastric Side Effects",
      emptyState: "Select a joint condition to view anatomical root-cause mapping.",
      loadingMessage: "Loading constitutional joint & spine profile...",
      consultationReminder: "Please bring recent X-rays, MRI scans, and blood uric acid reports to your appointment."
    },
    visualSuggestions: {
      icons: ["Activity", "ShieldCheck", "Dna", "Sparkles"],
      illustrations: ["Synovial joint membrane friction vs smooth movement", "Intervertebral disc hydration cross-section"],
      infographics: ["3-Phase Synovial Restoration Timeline", "Uric Acid Metabolic Pathway"],
      anatomicalDiagrams: ["Knee joint synovial capsule & cartilage structures"],
      animatedPathways: ["Inflammatory cytokine trigger ➔ Synovial swelling ➔ De-congestion pathway"],
      diseaseProgressionVisuals: ["Articular cartilage degeneration stages vs constitutional preservation"]
    },
    knowledgeGraph: {
      condition: "Joints & Spine Health",
      symptoms: ["Joint pain", "Morning stiffness", "Crepitus", "Sciatica", "Joint swelling", "Restricted range of motion"],
      triggers: ["Cold damp weather", "Overexertion", "High purine meals", "Spinal slouching"],
      riskFactors: ["Obesity", "HLA-B27 marker", "Joint micro-trauma", "Hyperuricemia", "Sedentary lifestyle"],
      systemsInvolved: ["Musculoskeletal System", "Immune System", "Renal Elimination Axis"],
      clinicalPathways: ["Synovial De-congestion", "Connective Tissue Repair", "Uric Acid Clearance"],
      relatedServices: ["Autoimmune Disorders", "Kidney & Renal Care", "Neuro & Mental Health"],
      tags: ["Osteoarthritis", "Rheumatoid Arthritis", "Spondylosis", "Sciatica", "Gout"]
    }
  },

  "digestive-health": {
    id: "digestive-health",
    title: "Digestive & Gastrointestinal Health",
    shortSubtitle: "Constitutional Enteric & Mucosal Profile",
    heroDescription: "Gastrointestinal disorders like IBS, GERD, chronic acidity, ulcerative colitis, and sluggish digestion represent disruptions in the gut mucosal barrier, microbiome composition, and brain-gut axis signalling. The enteric nervous system ('second brain') tightly coordinates motility, acid secretion, and immune tolerance. Symptom suppression with daily acid blockers or laxatives often overlooks underlying dysbiosis, gut permeability, and stress responsiveness. Our constitutional homeopathic care restores physiological gastrointestinal motility and mucosal integrity alongside gastroenterology guidelines.",
    overview: "The gastrointestinal tract processes nutrients while acting as an essential immunological filter against toxins and foreign microbes. When tight junction proteins in the intestinal lining weaken ('leaky gut'), un-ingested food particles and bacterial endotoxins leak into systemic circulation, provoking chronic low-grade inflammation. Concurrently, stress-induced autonomic shifts alter gastric acid production and intestinal peristalsis, manifesting as GERD, bloating, erratic bowel habits, or inflammatory bowel changes. Classical homeopathy evaluates gastrointestinal symptoms alongside emotional patterns, food cravings/aversions, and digestive modalities to stimulate self-regulatory healing.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing recent acidity spikes, bloating, or irregular bowel motions.",
      chronicSufferers: "Individuals with long-standing Irritable Bowel Syndrome (IBS), chronic GERD, or functional dyspepsia.",
      recurrentCases: "Patients suffering recurrent gastritis flares after stressful events or spicy meals.",
      complementaryCare: "Individuals with Inflammatory Bowel Disease (IBD) seeking supportive care alongside gastroenterology protocols.",
      medicationSideEffects: "Patients looking to reduce dependency on daily proton-pump inhibitors (PPIs) under medical guidance."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited enteric nervous system hypersensitivity, intestinal tight-junction weakness, or sluggish biliary enzyme flow.",
      functionalAxis: "Brain-Gut Axis Strain ➔ Enteric Dysmotility ➔ Mucosal Inflammation ➔ Dysbiosis & Gastrointestinal Symptoms",
      clinicalManifestation: "Acid regurgitation, epigastric burning, abdominal cramping, painful bloating, and alternating bowel habits."
    },
    underlyingBiologicalDrivers: [
      "Brain-gut axis autonomic dysregulation",
      "Intestinal epithelial hyper-permeability (Leaky Gut)",
      "Microbiome dysbiosis & Small Intestinal Bacterial Overgrowth (SIBO)",
      "Hypochlorhydria or chaotic gastric acid secretion",
      "Sluggish gallbladder bile flow & liver congestion",
      "Enteric immune activation & mast cell degranulation",
      "Visceral hypersensitivity to lumen distension",
      "Chronic NSAID or antibiotic mucosal damage",
      "Food allergen reactivity (gluten, dairy, histamine)",
      "Unresolved psycho-emotional stress affecting stomach motility"
    ],
    symptoms: {
      mostCommon: [
        "Epigastric burning and acid regurgitation",
        "Abdominal bloating and flatulence after meals",
        "Alternating diarrhea and constipation (IBS pattern)",
        "Early satiety and upper abdominal fullness"
      ],
      moderate: [
        "Visceral abdominal cramping relieved or aggravated by stool",
        "Mucus in stool",
        "Nausea and sour belching",
        "Food intolerances to fatty or spicy items"
      ],
      advanced: [
        "Persistent nocturnal acid reflux causing chronic throat tickle",
        "Severe colicky abdominal pain with urgent loose stools",
        "Unintentional weight loss and nutrient malabsorption",
        "Hematochezia (blood in stool - requires urgent gastroenterology evaluation)"
      ]
    },
    associatedConditions: [
      "Irritable Bowel Syndrome (IBS)",
      "Gastroesophageal Reflux Disease (GERD)",
      "Chronic Gastritis & Peptic Ulcer Support",
      "Ulcerative Colitis & Crohn's Supportive Care",
      "Functional Dyspepsia & Fatty Liver"
    ],
    riskFactors: {
      lifestyle: ["Eating rapidly under stress", "Late night heavy dinners", "Excessive alcohol & coffee", "Low dietary fiber"],
      genetic: ["Family history of IBD or celiac disease", "Digestive enzyme genetic variants"],
      environmental: ["Overuse of broad-spectrum antibiotics", "Pesticide residues in non-organic food"],
      metabolic: ["Visceral adiposity", "Insulin resistance", "Sluggish thyroid metabolism"],
      psychological: ["Chronic anxiety felt directly in the stomach", "Suppressed emotional tension"]
    },
    constitutionalPerspective: "In homeopathy, the digestive organ system is deeply tied to emotional processing and general constitutional temperament. Gastric symptoms reflect how a person 'digests' life experiences. Remedy selection requires evaluating specific digestive modalities—such as thirst, desire for cold/warm drinks, aggravation time (e.g., 4-8 PM), stool consistency, and emotional state. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We prescribe constitutional remedies matched to the patient's individual physical and psychological profile. Treatment focuses on soothing hyperactive visceral nerve endings, supporting mucosal lining regeneration, optimizing stomach acid/bile production, and balancing bowel peristalsis. We collaborate with gastroenterologists and nutritionists to ensure safe, comprehensive care.",
    expectedTreatmentJourney: {
      week1: "Detailed gut-health case history, dietary analysis, and acute digestive soothing constitutional support.",
      month1: "Reduction in epigastric acidity, smoother bowel movements, and decreased post-meal bloating.",
      month3: "Improved mucosal barrier integrity, reduced visceral sensitivity, and broader food tolerance.",
      month6: "Sustained digestive rhythm, optimal nutrient assimilation, and overall enteric vitality.",
      longTermFollowUp: "Periodic dietary and constitutional reviews to maintain gut ecosystem health."
    },
    lifestyleRecommendations: {
      diet: "Whole-food, gut-healing diet rich in steamed vegetables, bone broth/vegetable soups, fermented foods (if tolerated), healthy fats; eliminate processed foods and refined sugars.",
      exercise: "Post-meal 15-minute gentle walk to stimulate gastric emptying; regular aerobic exercise for healthy peristalsis.",
      sleep: "Sleep with head elevated 6 inches if suffering from GERD; avoid eating within 3 hours of sleep.",
      stress: "Mindful eating without digital distractions; deep abdominal diaphragmatic breathing before meals.",
      hydration: "2.5 liters of warm water throughout the day; avoid drinking large amounts of iced water during meals.",
      environmentalExposure: "Minimize synthetic food additives, artificial sweeteners, and unnecessary OTC drug use."
    },
    faqs: [
      {
        question: "Can I reduce my acid reflux medication while taking constitutional homeopathy?",
        answer: "Any tapering of long-standing proton pump inhibitors (PPIs) must be done slowly and under the direct supervision of your gastroenterologist as gut function stabilizes."
      },
      {
        question: "How does homeopathy treat IBS with alternating diarrhea and constipation?",
        answer: "Constitutional remedies balance enteric nervous system tone, normalizing peristalsis rather than acting purely as a laxative or anti-diarrheal."
      },
      {
        question: "Is homeopathic treatment suitable for Ulcerative Colitis?",
        answer: "Yes. Homeopathy offers valuable supportive care during remission and mild flares, helping reduce inflammatory frequency alongside prescribed gastroenterology medications."
      },
      {
        question: "How long does it take to improve chronic bloating and indigestion?",
        answer: "Noticeable improvement in bloating and digestion often occurs within 2 to 4 weeks of starting constitutional remedies and dietary adjustments."
      },
      {
        question: "Does homeopathy treat H. Pylori infection?",
        answer: "H. Pylori eradication therapy should follow conventional gastroenterology protocols. Homeopathy helps restore mucosal lining health and stomach acidity balance post-treatment."
      },
      {
        question: "What diagnostic tests are helpful for GI evaluation?",
        answer: "Upper GI endoscopy, colonoscopy, stool routine/culture, stool calprotectin, breath tests (SIBO), and abdominal ultrasound provide vital clinical context."
      },
      {
        question: "Can children with chronic constipation be treated safely?",
        answer: "Yes. Homeopathic remedies are gentle, safe, and effective for pediatric digestive issues without causing bowel dependence."
      },
      {
        question: "What is the constitutional perspective on food allergies?",
        answer: "Food intolerances are viewed as secondary symptoms of a compromised mucosal barrier and hyper-reactive immune system. Healing the gut lining helps restore oral tolerance."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients presenting with severe gastrointestinal bleeding, persistent vomiting, unexplained rapid weight loss, or high fever must seek immediate emergency gastroenterological care.",
    seo: {
      metaTitle: "Constitutional Digestive & IBS Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic care for IBS, GERD, chronic acidity, gastritis, and gut health. Integrated with functional gastroenterology.",
      slug: "digestive-health",
      keywords: ["IBS homeopathy", "GERD natural treatment", "chronic acidity root cause", "gut mucosal healing", "ulcerative colitis support"],
      openGraphDescription: "Restore enteric harmony and mucosal integrity with constitutional digestive care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Digestive Care",
      appointmentCta: "Schedule Enteric Constitutional Assessment",
      trustBadge: "Gastroenterology Compliant • Non-Laxative Regulation",
      emptyState: "Select a digestive condition to review gut-brain mapping.",
      loadingMessage: "Loading constitutional digestive profile...",
      consultationReminder: "Please bring recent endoscopy/colonoscopy reports and stool tests to your consultation."
    },
    visualSuggestions: {
      icons: ["Shield", "Sparkles", "Dna", "Activity"],
      illustrations: ["Intestinal epithelial tight junction integrity vs leaky gut", "Brain-gut vagal nerve bidirectional signaling"],
      infographics: ["Enteric Recovery Pathway", "Bowel Motility Regulation Diagram"],
      anatomicalDiagrams: ["Stomach mucosal layer and gastric acid glands"],
      animatedPathways: ["Stress trigger ➔ Enteric nerve spasm ➔ Resolution pathway"],
      diseaseProgressionVisuals: ["Inflamed gastric mucosa vs healed epithelial barrier timeline"]
    },
    knowledgeGraph: {
      condition: "Digestive & Gastrointestinal Health",
      symptoms: ["Acid reflux", "Epigastric burning", "Bloating", "Abdominal cramping", "Alternating bowel habits", "Nausea"],
      triggers: ["Spicy/fatty food", "Late meals", "Work stress", "Antibiotic use", "Alcohol"],
      riskFactors: ["Intestinal dysbiosis", "HPA axis strain", "Sedentary routine", "NSAID overuse"],
      systemsInvolved: ["Gastrointestinal System", "Enteric Nervous System", "Immune System"],
      clinicalPathways: ["Mucosal Barrier Repair", "Visceral Nerve Calming", "Peristaltic Resetting"],
      relatedServices: ["Neuro & Mental Health", "Liver & Hepatic Health", "Allergies"],
      tags: ["IBS", "GERD", "Gastritis", "Gut Health", "Acidity"]
    }
  },

  "skin-disorders": {
    id: "skin-disorders",
    title: "Skin & Dermatological Health",
    shortSubtitle: "Constitutional Dermal & Immune Profile",
    heroDescription: "Chronic skin conditions—such as eczema, psoriasis, acne vulgaris, vitiligo, and chronic urticaria—are non-isolated internal immune and metabolic expressions upon the body's largest organ. Suppressing skin eruptions with topical corticosteroids or heavy immunosuppressants often forces underlying systemic inflammation deeper, creating internal organ stress or rebound flares. Constitutional homeopathy views skin eruptions as vital elimination attempts and immunological signals. Our clinical approach focuses on internal immune recalibration, gut-skin axis healing, and epidermal barrier restoration alongside dermatological safety standards.",
    overview: "The skin serves as a dynamic metabolic, immunological, and emotional mirror of internal health. Dermal cells regenerate continuously, heavily influenced by systemic cytokine concentrations, gut microbiome metabolites, hepatic clearance efficiency, and neuro-endocrine stress hormones. In eczema, epidermal barrier gene defects (such as filaggrin) combine with T-helper 2 immune hyper-reactivity; in psoriasis, accelerated keratinocyte turnover stems from T-helper 17 auto-inflammation; and in acne, androgenic sebum overproduction interacts with follicular inflammation. Classical homeopathic treatment addresses systemic predisposition without topical suppression, enabling durable dermal healing from within.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing recent onset eczematous patches or acute acne eruptions.",
      chronicSufferers: "Individuals enduring long-standing psoriasis plaques, chronic urticaria, or extensive vitiligo patches.",
      recurrentCases: "Patients who experience severe skin rebound flares every time topical steroid creams are stopped.",
      complementaryCare: "Individuals working with dermatologists who wish to address internal immune root causes.",
      medicationSideEffects: "Patients seeking natural options to avoid thin skin, striae, or systemic absorption from chronic steroid use."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited epidermal barrier vulnerability, immune-dermal hypersensitivity, or leaky-gut metabolic burden.",
      functionalAxis: "Internal Immune / Gut Disruption ➔ Systemic Cytokine Release ➔ Dermal Cell Hyper-reactivity ➔ Cutaneous Eruptions & Lesions",
      clinicalManifestation: "Intense pruritus (itching), erythema, scaling plaques, comedones/pustules, or pigment loss patches."
    },
    underlyingBiologicalDrivers: [
      "Th2/Th17 systemic immune axis dysregulation",
      "Epidermal filaggrin barrier protein deficiency",
      "Gut-skin axis permeability & circulating endotoxins",
      "Mast cell hyper-reactivity & histamine sensitivity",
      "Neuro-genic skin inflammation via neuropeptides (Substance P)",
      "Hepatic phase-II detoxification sluggishness",
      "Sebaceous gland androgenic receptor hyper-sensitivity",
      "Autoimmune melanocyte destruction (in vitiligo)",
      "Cutaneous microbiome dysbiosis (Staph aureus / C. acnes overgrowth)",
      "Psycho-dermatological stress triggers"
    ],
    symptoms: {
      mostCommon: [
        "Persistent itching (pruritus) worse at night or warmth",
        "Erythematous (red) dry inflamed skin patches",
        "Flaking or scaling skin (psoriatic or seborrheic)",
        "Papular or pustular acne eruptions on face/back"
      ],
      moderate: [
        "Lichenification (thickened leathery skin from chronic rubbing)",
        "Wheals and hives (urticaria) appearing suddenly",
        "Depigmented white patches (vitiligo)",
        "Cracking and painful skin fissures"
      ],
      advanced: [
        "Widespread erythrodermic skin redness and weeping",
        "Severe joint pain associated with skin plaques (Psoriatic Arthritis)",
        "Secondary bacterial super-infection of open lesions",
        "Profound sleep loss and distress due to relentless itching"
      ]
    },
    associatedConditions: [
      "Atopic Dermatitis & Eczema",
      "Psoriasis Vulgaris & Psoriatic Arthritis",
      "Acne Vulgaris & Rosacea",
      "Vitiligo & Hypopigmentation",
      "Chronic Urticaria & Angioedema"
    ],
    riskFactors: {
      lifestyle: ["Harsh chemical soaps & hot baths", "High refined sugar diet", "Synthetic clothing fabrics", "Chronic sleep loss"],
      genetic: ["Filaggrin gene mutations", "HLA-Cw6 marker (psoriasis)", "Family history of atopy or vitiligo"],
      environmental: ["Dry cold weather", "Occupational chemical allergen contact", "Dust mite & mold exposure"],
      metabolic: ["Gut dysbiosis & leaky gut", "Insulin resistance", "Sluggish liver metabolism"],
      psychological: ["Emotional stress triggering immediate skin flares", "Social anxiety regarding appearance"]
    },
    constitutionalPerspective: "In classical homeopathy, the skin is recognized as the ultimate outward boundary and defense organ. Skin eruptions represent the vital force expelling internal dysregulation outward to protect vital internal organs. Suppressing these eruptions topically often leads to internal shifts (such as suppressed eczema transforming into asthma). Constitutional treatment respects this dynamic, selecting remedies based on skin appearance, modalities (hot/cold water, night/day), emotional state, and constitutional type. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We utilize oral constitutional remedies aimed at internal immune balance, gut barrier sealing, and liver metabolism support. We strongly advise against harsh topical suppressive creams during active constitutional care, favoring mild organic emollients for hydration. We maintain open collaboration with dermatologists to monitor lesion resolution safely.",
    expectedTreatmentJourney: {
      week1: "Detailed dermatological & constitutional intake, elimination of irritants, and initial internal soothing support.",
      month1: "Reduction in itching intensity and stabilization of active flare spreading.",
      month3: "Gradual thinning of psoriatic plaques, healing of eczematous fissures, and reduced acne pustules.",
      month6: "Significant epidermal barrier restoration, clearer skin texture, and repigmentation progress in vitiligo.",
      longTermFollowUp: "Seasonal constitutional reviews to prevent recurring cutaneous flares."
    },
    lifestyleRecommendations: {
      diet: "Anti-inflammatory, anti-histamine whole food diet rich in omega-3s, zinc, vitamin E, leafy greens; strictly reduce refined sugar, dairy, and artificial colors.",
      exercise: "Moderate sweat-inducing exercise followed by immediate gentle lukewarm showering to eliminate metabolic waste.",
      sleep: "Cool bedroom temperature, 100% organic cotton bedding, and scratch-prevention soft cotton gloves for children at night.",
      stress: "Mind-body relaxation techniques to calm neuropeptide-driven skin inflammation.",
      hydration: "3 liters of pure water daily to maintain dermal cellular hydration.",
      environmentalExposure: "Switch to fragrance-free, hypoallergenic plant-based laundry detergents and skin cleansers."
    },
    faqs: [
      {
        question: "Why does homeopathy advise stopping topical steroid creams?",
        answer: "Topical steroids suppress outward skin symptoms without correcting internal immune dysregulation, often causing rebound flares upon discontinuation. We guide patients in gentle, gradual steroid tapering alongside their dermatologist."
      },
      {
        question: "Can homeopathy cure vitiligo completely?",
        answer: "Homeopathy does not guarantee complete repigmentation. However, constitutional remedies help stop active spread of white patches and stimulate dormant melanocyte activity, often achieving significant partial or complete repigmentation."
      },
      {
        question: "Why do skin symptoms sometimes worsen slightly at the start of treatment?",
        answer: "A temporary mild outward aggravation indicates that internal elimination channels are activating. This is a positive physiological response that quickly settles as internal healing progresses."
      },
      {
        question: "How long does eczema treatment usually take?",
        answer: "Initial itching relief often occurs within 2 to 4 weeks, while deep epidermal barrier restoration and immune stabilization take 3 to 6 months."
      },
      {
        question: "Can teenagers with severe cystic acne be treated homeopathically?",
        answer: "Yes! Homeopathy balances hormone-receptor sensitivity, reduces sebaceous gland inflammation, and prevents acne scarring naturally."
      },
      {
        question: "What diagnostic tests are helpful?",
        answer: "Skin biopsy reports, Serum IgE levels, food allergy panels, thyroid profiles, and gut microbiome analysis provide excellent diagnostic support."
      },
      {
        question: "Is homeopathic treatment safe during pregnancy for skin flares?",
        answer: "Yes. Homeopathic remedies are completely non-toxic and ultra-diluted, making them exceptionally safe for pregnant and nursing mothers."
      },
      {
        question: "What topical moisturizers should I use during treatment?",
        answer: "We recommend simple, non-medicated, fragrance-free emollients like pure coconut oil, shea butter, or plain ceramide creams to protect skin hydration."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients suffering from acute spreading bacterial skin infections (cellulitis), severe drug eruptions, or Stevens-Johnson syndrome must seek immediate emergency medical care.",
    seo: {
      metaTitle: "Constitutional Skin & Dermatology Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic care for eczema, psoriasis, acne, vitiligo, and urticaria. Healing skin from within without topical suppression.",
      slug: "skin-disorders",
      keywords: ["eczema homeopathy", "psoriasis natural treatment", "acne root cause", "vitiligo repigmentation", "urticaria constitutional remedy"],
      openGraphDescription: "Heal skin conditions from within with non-suppressive constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Skin Care",
      appointmentCta: "Schedule Dermal Constitutional Intake",
      trustBadge: "Dermatology Compliant • Non-Suppressive Healing",
      emptyState: "Select a dermatological condition to view immune-dermal mapping.",
      loadingMessage: "Loading constitutional skin profile...",
      consultationReminder: "Please refrain from applying heavy medicated creams on the morning of your skin examination."
    },
    visualSuggestions: {
      icons: ["Sparkles", "ShieldCheck", "Sprout", "Dna"],
      illustrations: ["Epidermal barrier layers filaggrin cross-section", "Gut-skin axis immune pathway"],
      infographics: ["Non-Suppressive Dermal Healing Timeline", "Th1/Th2 Immune Balance Diagram"],
      anatomicalDiagrams: ["Skin dermis, epidermis, and sebaceous gland structure"],
      animatedPathways: ["Internal immune trigger ➔ Cytokine release ➔ Dermal clearing pathway"],
      diseaseProgressionVisuals: ["Steroid dependence rebound cycle vs constitutional internal healing trajectory"]
    },
    knowledgeGraph: {
      condition: "Skin & Dermatological Health",
      symptoms: ["Itching", "Erythema", "Scaling plaques", "Acne pustules", "Depigmented patches", "Hives"],
      triggers: ["Harsh soaps", "Food allergens", "Stress spikes", "Steroid withdrawal", "Weather shifts"],
      riskFactors: ["Filaggrin gene defects", "Gut permeability", "Atopic family history", "Hepatic congestion"],
      systemsInvolved: ["Integumentary System", "Immune System", "Gastrointestinal Axis"],
      clinicalPathways: ["Epidermal Barrier Restoration", "Th2/Th17 Immunomodulation", "Hepatic Detoxification"],
      relatedServices: ["Allergies", "Digestive Health", "Autoimmune Disorders"],
      tags: ["Eczema", "Psoriasis", "Acne", "Vitiligo", "Skin Care"]
    }
  },

  "paediatric-care": {
    id: "paediatric-care",
    title: "Paediatric Care & Child Immunity",
    shortSubtitle: "Constitutional Paediatric Profile",
    heroDescription: "Childhood health concerns—such as recurrent tonsillitis, otitis media, childhood asthma, growth dynamics, and behavioral hyper-excitability—reflect an actively developing immune system and evolving neuro-endocrine axis. Frequent antibiotic use for viral upper respiratory infections can compromise developing gut microflora and weaken innate immune learning. Classical constitutional homeopathy offers sweet, gentle, non-suppressive remedies that support natural lymphatic clearance, build immune endurance, and harmonize emotional and physical development.",
    overview: "Children experience rapid physiological growth alongside intense immunological pattern learning. When a child's lymphatic system is overworked, adenoids and tonsils hypertrophy as protective barriers. Constitutional homeopathic treatment respects this natural maturation process, strengthening the child's vital force without chemical toxicity or organ burden.",
    whoCanBenefit: {
      newlyDiagnosed: "Children with recent recurrent ear infections or seasonal allergic cough.",
      chronicSufferers: "Children with chronic tonsillar enlargement, asthma, or eczema.",
      recurrentCases: "Children catching frequent colds after starting preschool.",
      complementaryCare: "Parents seeking holistic immune building alongside paediatric check-ups.",
      medicationSideEffects: "Children needing gentle alternatives to repeated antibiotics or steroid inhalers."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited lymphatic reactivity, immature digestive assimilation, and developing immune memory.",
      functionalAxis: "Immune Learning Delays ➔ Lymphatic Hypertrophy ➔ Mucosal Stagnation ➔ Recurrent Infections",
      clinicalManifestation: "Enlarged tonsils, mouth breathing, recurrent fever, nocturnal cough, and digestive sensitivity."
    },
    underlyingBiologicalDrivers: [
      "Innate immune system maturation dynamics",
      "Lymphatic node & tonsillar tissue hypertrophy",
      "Gut microbiome disruption from early antibiotics",
      "Mucosal IgA barrier development",
      "Rapid skeletal & neural growth demands",
      "Environmental pollen & dust hypersensitivity",
      "Food protein assimilation strain",
      "Sleep architecture & growth hormone release",
      "Emotional sensitivity to home/school environments",
      "Subclinical nutrient clearance efficiency"
    ],
    symptoms: {
      mostCommon: [
        "Recurrent sore throat & swollen tonsils",
        "Frequent colds and nasal congestion",
        "Mouth breathing during sleep",
        "Digestive discomfort & picky eating"
      ],
      moderate: [
        "Middle ear pain and fluid accumulation (otitis media)",
        "Nocturnal dry spasmodic cough",
        "Behavioral excitability and restless sleep",
        "Eczematous skin patches on flexural folds"
      ],
      advanced: [
        "Chronic adenoid hypertrophy causing sleep apnea",
        "Frequent asthma exacerbations requiring nebulization",
        "Growth percentile slowing",
        "Severe recurrent febrile convulsions"
      ]
    },
    associatedConditions: [
      "Recurrent Tonsillitis & Adenoiditis",
      "Childhood Asthma & Allergic Rhinitis",
      "Otitis Media (Ear Infections)",
      "Pediatric Eczema",
      "Growth & Behavioral Sensitivity Support"
    ],
    riskFactors: {
      lifestyle: ["High sugar & processed snack diet", "Excessive screen time", "Lack of outdoor sunshine play"],
      genetic: ["Family history of atopy or asthma", "Lymphatic constitution"],
      environmental: ["Daycare virus exposure", "Passive smoke exposure", "Damp home environments"],
      metabolic: ["Impaired gut flora balance", "Low Vitamin D levels"],
      psychological: ["School anxiety", "Sibling competition stress", "Sensitivity to parental friction"]
    },
    constitutionalPerspective: "In classical homeopathy, children respond dynamically to constitutional remedies because their vital force is unencumbered by decades of suppression. Profiling evaluates physical growth traits, thermal preferences, sleep positions, emotional temperament, and family health history.",
    treatmentPhilosophy: "We provide sweet, ultra-diluted, non-toxic constitutional remedies tailor-made for growing children. We work collaboratively with treating pediatricians to ensure comprehensive developmental safety.",
    expectedTreatmentJourney: {
      week1: "Gentle constitutional intake, parent consultation, and initial acute immune soothing.",
      month1: "Reduction in acute illness duration and improved sleep quality.",
      month3: "Decreased frequency of recurrent colds and reduced tonsillar swelling.",
      month6: "Sustained immune resilience, healthy weight/height progression, and robust vitality.",
      longTermFollowUp: "Seasonal check-ups prior to school terms or winter transitions."
    },
    lifestyleRecommendations: {
      diet: "Warm, nutrient-dense whole foods rich in Vitamin C, zinc, homemade vegetable soups, fruit, and healthy fats; eliminate refined sugars and artificial colors.",
      exercise: "Daily active outdoor play, running, and physical games in natural sunlight.",
      sleep: "Consistent 9-11 hours of sleep depending on age in a quiet, dark bedroom.",
      stress: "Calming bedtime reading routines and reassuring emotional connection.",
      hydration: "1.5 to 2 liters of warm water and clear broths daily.",
      environmentalExposure: "HEPA air filtering in nursery and elimination of chemical room sprays."
    },
    faqs: [
      {
        question: "Are homeopathic remedies safe for infants and toddlers?",
        answer: "Yes. Classical homeopathic remedies are completely non-toxic, ultra-diluted, and free of side effects, making them exceptionally safe from infancy onwards."
      },
      {
        question: "Can homeopathy help avoid tonsillectomy surgery for enlarged tonsils?",
        answer: "Constitutional remedies frequently help reduce tonsillar and adenoid inflammation, helping many children avoid surgical removal when started early."
      },
      {
        question: "How are remedies administered to young children?",
        answer: "Remedies are provided as tiny, sweet sucrose pills or liquid drops that children love to take."
      },
      {
        question: "Can homeopathy be taken alongside antibiotics if my pediatrician prescribes them?",
        answer: "Yes. Homeopathy operates on a complementary energetic level and does not interact with antibiotics."
      },
      {
        question: "How quickly do children respond to homeopathic treatment?",
        answer: "Children typically respond very quickly, often showing initial energetic and sleep improvements within 7 to 14 days."
      },
      {
        question: "Does homeopathy help with child appetite and assimilation?",
        answer: "Yes. By improving gut motility and digestive enzyme secretion, constitutional remedies naturally support healthy appetite."
      },
      {
        question: "What information is needed during paediatric consultation?",
        answer: "Pregnancy/birth history, vaccination records, growth charts, emotional milestones, and current symptoms."
      },
      {
        question: "Is homeopathy helpful for childhood behavioral hyper-excitability?",
        answer: "Constitutional remedies soothe nervous system over-excitability, helping children feel calmer and more focused."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Parents must seek immediate emergency medical care for high persistent fever, severe breathing difficulty, lethargy, or acute dehydration.",
    seo: {
      metaTitle: "Constitutional Paediatric Care & Child Immunity | Homeo Healthcare",
      metaDescription: "Gentle, non-toxic constitutional homeopathic care for recurrent tonsillitis, asthma, allergies, and childhood immunity building. Integrated with pediatric standards.",
      slug: "paediatric-care",
      keywords: ["paediatric homeopathy", "child immunity natural care", "tonsillitis root cause", "childhood asthma support", "gentle remedies for kids"],
      openGraphDescription: "Build your child's natural immunity and vital health with gentle constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Paediatric Care",
      appointmentCta: "Schedule Child Constitutional Intake",
      trustBadge: "Pediatric Safety Compliant • 100% Non-Toxic Care",
      emptyState: "Select a paediatric condition to view child immune mapping.",
      loadingMessage: "Loading constitutional paediatric profile...",
      consultationReminder: "Please bring your child's growth record book and recent pediatric reports to your appointment."
    },
    visualSuggestions: {
      icons: ["Baby", "ShieldCheck", "Sprout", "Sparkles"],
      illustrations: ["Lymphatic system tonsillar barrier cross-section", "Child immune learning timeline"],
      infographics: ["Pediatric Recovery Pathway", "Gut-Immune Axis in Children Diagram"],
      anatomicalDiagrams: ["Adenoid and tonsil tissue location schematic"],
      animatedPathways: ["Immune trigger ➔ Gentle lymphatic clearance ➔ Resilience pathway"],
      diseaseProgressionVisuals: ["Frequent antibiotic dependency cycle vs constitutional immune maturation"]
    },
    knowledgeGraph: {
      condition: "Paediatric Care & Child Immunity",
      symptoms: ["Enlarged tonsils", "Recurrent colds", "Mouth breathing", "Nocturnal cough", "Ear pain", "Restless sleep"],
      triggers: ["Daycare viruses", "Cold weather", "Refined sugar snacks", "Environmental dust"],
      riskFactors: ["Atopic diathesis", "Impaired gut flora", "Passive smoke exposure"],
      systemsInvolved: ["Immune System", "Respiratory System", "Lymphatic Network"],
      clinicalPathways: ["Lymphatic De-congestion", "Mucosal Immunity Fortification", "Vital Force Activation"],
      relatedServices: ["Lungs & Respiratory", "Allergies", "Digestive Health"],
      tags: ["Paediatrics", "Childhood Immunity", "Tonsillitis", "Adenoids", "Asthma"]
    }
  },

  "autoimmune-disorders": {
    id: "autoimmune-disorders",
    title: "Autoimmune Conditions & Immune Regulation",
    shortSubtitle: "Constitutional Immunomodulatory Profile",
    heroDescription: "Autoimmune conditions—such as Systemic Lupus Erythematosus (SLE), Hashimoto's Thyroiditis, Rheumatoid Arthritis, Ankylosing Spondylitis, and Psoriatic Disease—represent a breakdown in immunological self-tolerance. The immune system mistakenly identifies host tissues as foreign targets, generating autoantibodies and tissue-destructive inflammation. Conventional treatment relies heavily on broad immunosuppressive medications, which damp down symptoms while increasing infection risks. Constitutional homeopathy aims to recalibrate immune recognition, quiet auto-inflammatory cascades, and reduce flare frequency alongside specialist rheumatology management.",
    overview: "Immunological self-tolerance is maintained through complex cellular checkpoints involving regulatory T-cells (Tregs), central thymic selection, and peripheral immune signals. In autoimmune-prone individuals, a combination of genetic markers (such as specific HLA alleles), environmental triggers (viral infections, toxic exposures), and gut barrier breakdown allows self-antigens to activate autoreactive T and B lymphocytes. This leads to persistent autoantibody production and multi-system tissue damage. Classical homeopathy evaluates the patient's deep constitutional miasmatic heritage, emotional shocks, and physical symptom totality to re-establish immunological balance naturally.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients with recent elevated ANA or autoantibody titers seeking early immunomodulatory support.",
      chronicSufferers: "Individuals managing long-standing Lupus, Hashimoto's, or Ankylosing Spondylitis.",
      recurrentCases: "Patients experiencing frequent autoimmune inflammatory flares triggered by stress or seasonal changes.",
      complementaryCare: "Individuals taking conventional DMARDs or biologics who desire safe, supportive constitutional care.",
      medicationSideEffects: "Patients seeking natural support for chronic fatigue, brain fog, and systemic vulnerability."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Deficient T-regulatory cell function, HLA gene markers, and inherited auto-inflammatory diathesis.",
      functionalAxis: "Loss of Immune Self-Tolerance ➔ Autoantibody Spikes ➔ Systemic Tissue Targeting ➔ Chronic Organ Inflammation & Flares",
      clinicalManifestation: "Systemic fatigue, joint swelling, malar skin rashes, thyroid dysfunction, and elevated inflammatory markers."
    },
    underlyingBiologicalDrivers: [
      "Regulatory T-cell (Treg) deficiency & immune checkpoint failure",
      "Autoantibody production (ANA, Anti-dsDNA, Anti-TPO, Anti-CCP)",
      "Intestinal epithelial permeability & molecular mimicry",
      "Persistent sub-clinical viral triggers (EBV, CMV)",
      "Environmental toxic burden & heavy metal accumulation",
      "Chronic systemic inflammatory cytokine signaling (TNF-a, IL-17, IL-6)",
      "Mitochondrial failure within immune & tissue cells",
      "Severe psychological shock or prolonged emotional trauma",
      "Endocrine-disrupting chemical exposure",
      "Micro-circulatory immune complex deposition in small vessels"
    ],
    symptoms: {
      mostCommon: [
        "Profound, unexplained systemic fatigue",
        "Migratory joint pain and morning stiffness",
        "Low-grade recurrent fever episodes",
        "Brain fog and cognitive exhaustion"
      ],
      moderate: [
        "Malar (butterfly) facial rash or photosensitive skin lesions",
        "Cold, pale, or blue fingers under stress (Raynaud's phenomenon)",
        "Dry eyes and dry mouth (Sjögren's features)",
        "Thyroid swelling or metabolic fluctuations"
      ],
      advanced: [
        "Renal involvement (lupus nephritis markers / proteinuria)",
        "Spinal ankylosis & severe bamboo spine rigidity",
        "Multi-organ inflammation (pericarditis, pleuritis flares)",
        "Severe muscle weakness and auto-immune vasculitis"
      ]
    },
    associatedConditions: [
      "Systemic Lupus Erythematosus (SLE)",
      "Hashimoto's & Graves' Autoimmune Thyroiditis",
      "Rheumatoid & Psoriatic Arthritis",
      "Ankylosing Spondylitis",
      "Sjögren's Syndrome & Scleroderma Support"
    ],
    riskFactors: {
      lifestyle: ["Severe sleep deprivation", "Ultra-processed diet", "Chronic unmanaged emotional strain", "Lack of sunshine"],
      genetic: ["HLA-DR4, HLA-B27, HLA-DQ2/8 gene markers", "Family history of autoimmune diseases"],
      environmental: ["Silica dust & heavy metal exposure", "Mold mycotoxin illness", "Epstein-Barr virus infection history"],
      metabolic: ["Leaky gut syndrome", "Severe Vitamin D deficiency", "Estrogen dominance"],
      psychological: ["Deep unexpressed grief", "Perfectionistic self-criticism", "Severe nervous shock"]
    },
    constitutionalPerspective: "In classical homeopathy, autoimmunity is considered one of the deepest miasmatic dysregulations (Syphilitic/Tubercular miasmatic burden), where the body turns its vital energies inward in self-destructive patterns. Remedy selection requires thorough exploration of the patient's emotional history, family genetic background, physical modalities, thermal type, and specific organ vulnerabilities. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We utilize gentle, single constitutional remedies prescribed according to deep totality. Treatment focuses on supporting T-regulatory function, soothing systemic auto-inflammatory cascades, protecting organ tissue integrity, and improving vital energy. We emphasize safe co-management alongside rheumatologists, ensuring patients maintain necessary conventional therapies while building internal resilience.",
    expectedTreatmentJourney: {
      week1: "Deep constitutional intake, autoantibody & lab review, baseline flare evaluation, and calming immune support.",
      month1: "Reduction in daily fatigue levels, improved sleep, and soothing of acute joint or skin flare intensity.",
      month3: "Decreased flare frequency, stabilized inflammatory markers (ESR/CRP), and improved daily endurance.",
      month6: "Sustained immunological stability, better organ protection markers, and enhanced overall vitality.",
      longTermFollowUp: "Regular long-term constitutional monitoring aligned with rheumatology lab schedules."
    },
    lifestyleRecommendations: {
      diet: "Autoimmune Protocol (AIP) or nutrient-dense Mediterranean diet rich in wild fish, leafy greens, bone broth, berries, and olive oil; strictly eliminate processed grains, refined sugar, and seed oils.",
      exercise: "Gentle restorative movement (restorative yoga, walking, light swimming); strictly avoid over-exertion during active flares.",
      sleep: "8-9 hours of restorative sleep in a quiet, dark environment to allow immune cell repair.",
      stress: "Daily nervous system regulation practices (vagus nerve stimulation, meditation, somatic release therapy).",
      hydration: "3 liters of filtered water daily to support cellular detoxification and immune complex clearance.",
      environmentalExposure: "Eliminate artificial household chemicals, cosmetics with parabens, and heavy plastic food containers."
    },
    faqs: [
      {
        question: "Can I take homeopathic remedies while on biologic injections or steroids for Lupus/RA?",
        answer: "Yes. Homeopathic remedies do not interfere with immunosuppressants, DMARDs, or biologic therapies. Patients should continue all prescribed medications while receiving supportive constitutional care."
      },
      {
        question: "Will homeopathy cure my autoimmune disease permanently?",
        answer: "Homeopathy does not promise magic 'cures' for genetic autoimmune conditions. However, constitutional care can significantly reduce flare frequency, calm auto-inflammation, protect tissues, and improve quality of life."
      },
      {
        question: "How do you track treatment progress in autoimmune cases?",
        answer: "We monitor objective lab markers (ANA titers, ESR, hs-CRP, Anti-TPO, RF), symptom flare diaries, fatigue scales, and organ function panels alongside your rheumatologist."
      },
      {
        question: "Is homeopathy safe for Hashimoto's thyroiditis?",
        answer: "Yes. Constitutional care helps calm anti-TPO antibody activity, reduce thyroid gland inflammation, and improve systemic energy alongside standard thyroid hormone replacement."
      },
      {
        question: "How long does constitutional autoimmune balancing take?",
        answer: "Due to the deep immunological roots, autoimmune support requires steady constitutional care over 6 to 12 months for lasting stability."
      },
      {
        question: "What lab reports are essential for initial consultation?",
        answer: "ANA profile, ESR, CRP, CBC, Thyroid panel (TSH, Free T3/T4, Anti-TPO), Serum Vitamin D3, B12, and relevant organ function tests."
      },
      {
        question: "Can homeopathy help with Raynaud's phenomenon in autoimmune patients?",
        answer: "Yes. Remedies targeting micro-vascular tone and autonomic sensitivity help improve peripheral circulation to cold fingers and toes."
      },
      {
        question: "Does diet really matter in autoimmune management?",
        answer: "Extremely. Diet plays a pivotal role in repairing the gut mucosal barrier and eliminating inflammatory triggers that fuel autoimmune activity."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients experiencing acute autoimmune organ crisis (such as acute lupus nephritis, pericardial effusion, or severe respiratory distress) must seek immediate specialist hospital care.",
    seo: {
      metaTitle: "Constitutional Autoimmune Care & Immunomodulation | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic support for SLE Lupus, Hashimoto's, Rheumatoid Arthritis, and Ankylosing Spondylitis. Integrated with rheumatology.",
      slug: "autoimmune-disorders",
      keywords: ["lupus homeopathy", "rheumatoid arthritis support", "hashimotos natural care", "ankylosing spondylitis root cause", "autoimmune constitutional care"],
      openGraphDescription: "Calm auto-inflammatory flares and support immune self-tolerance with constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Autoimmune Care",
      appointmentCta: "Schedule Autoimmune Constitutional Intake",
      trustBadge: "Rheumatology Compliant • Immunomodulatory Support",
      emptyState: "Select an autoimmune condition to view immunological axis.",
      loadingMessage: "Loading constitutional autoimmune profile...",
      consultationReminder: "Please bring your complete rheumatology records and recent autoantibody lab panels to your consultation."
    },
    visualSuggestions: {
      icons: ["ShieldAlert", "Dna", "Activity", "ShieldCheck"],
      illustrations: ["T-regulatory cell checkpoint function vs autoimmune targeting", "Autoantibody immune complex clearance pathway"],
      infographics: ["Immunological Self-Tolerance Restoration Pathway", "AIP Diet & Gut Barrier Healing Diagram"],
      anatomicalDiagrams: ["Synovial membrane autoantibody infiltration diagram"],
      animatedPathways: ["Loss of tolerance ➔ Autoantibody spike ➔ Immunomodulatory calm pathway"],
      diseaseProgressionVisuals: ["Chronic autoimmune flare cycle vs constitutional stabilization baseline"]
    },
    knowledgeGraph: {
      condition: "Autoimmune Conditions & Immune Regulation",
      symptoms: ["Systemic fatigue", "Joint swelling", "Malar rash", "Brain fog", "Raynaud's cold fingers", "Low-grade fever"],
      triggers: ["Emotional trauma", "Viral infections", "Heavy metal burden", "Gluten intake", "Sleep loss"],
      riskFactors: ["HLA genetic markers", "Leaky gut syndrome", "Vitamin D deficiency", "Environmental toxins"],
      systemsInvolved: ["Immune System", "Musculoskeletal System", "Endocrine Axis", "Renal System"],
      clinicalPathways: ["T-Regulatory Cell Support", "Auto-inflammatory Calming", "Mucosal Barrier Sealing"],
      relatedServices: ["Joints & Spine", "Hormonal & Thyroid", "Skin Disorders"],
      tags: ["Lupus", "Rheumatoid Arthritis", "Hashimotos", "Autoimmune", "Ankylosing Spondylitis"]
    }
  },

  "hormonal-thyroid": {
    id: "hormonal-thyroid",
    title: "Hormonal & Thyroid Health",
    shortSubtitle: "Constitutional Neuro-Endocrine Profile",
    heroDescription: "Endocrine and metabolic imbalances—including hypothyroidism, hyperthyroidism, PCOS, insulin resistance, and perimenopausal distress—represent neuroendocrine signaling dysfunctions along the hypothalamic-pituitary-thyroid/adrenal/gonadal (HPT/HPA/HPG) axes. Glandular organs do not fail in isolation; they respond to central feedback signals, receptor sensitivity, cellular stress, and liver hormone metabolism. Standard synthetic hormone replacement restores serum levels but often leaves underlying root causes untouched. Our constitutional care recalibrates endocrine axis signaling and receptor sensitivity alongside endocrinology standards.",
    overview: "The endocrine system regulates cellular metabolism, energy production, reproductive function, and mood through delicate hormonal feedback loops. When chronic stress, environmental xenoestrogens, or autoimmune thyroiditis disrupt these feedback loops, target glands under- or over-produce hormones. In hypothyroidism, cellular energy production slows; in PCOS, insulin resistance drives ovarian androgen production; and in perimenopause, erratic estrogen drops cause vasomotor instability. Classical homeopathy evaluates the patient's complete endocrine totality—including thermal reactivity, cycle history, emotional state, and metabolic tendencies—to stimulate endogenous self-regulation.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients with recent mild TSH elevations or newly diagnosed PCOS seeking non-invasive endocrine support.",
      chronicSufferers: "Individuals managing chronic hypothyroid lethargy, weight gain, or irregular cycles despite standard medication.",
      recurrentCases: "Patients experiencing recurrent ovarian cysts or hormonal mood swings.",
      complementaryCare: "Individuals taking levothyroxine or metformin who wish to optimize overall metabolic and hormonal vitality.",
      medicationSideEffects: "Patients seeking natural support for hormonal hair thinning, acne, or fluid retention."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited vulnerability in hypothalamic-pituitary feedback sensitivity, thyroid hormone conversion, or insulin receptor signaling.",
      functionalAxis: "HPA / HPT Axis Stress ➔ Neuro-Endocrine Feedback Blockade ➔ Target Gland Dysregulation ➔ Metabolic & Hormonal Symptoms",
      clinicalManifestation: "Unexplained weight gain, cold intolerance, menstrual irregularity, hair thinning, chronic fatigue, and mood swings."
    },
    underlyingBiologicalDrivers: [
      "Hypothalamic-pituitary-thyroid/adrenal axis feedback dysregulation",
      "Peripheral T4 to T3 thyroid hormone conversion failure (sluggish deiodinase activity)",
      "Cellular insulin resistance & hyperinsulinemia",
      "Autoimmune thyroid destruction (Anti-TPO / Anti-Thyroglobulin antibodies)",
      "Estrogen dominance & sluggish hepatic hormone clearance",
      "Adrenal cortisol stealing & progesterone depletion",
      "Environmental xenoestrogen toxicity (BPA, phthalates)",
      "Ovarian follicular arrest & elevated LH:FSH ratio (PCOS)",
      "Cellular mitochondrial sluggishness",
      "Unresolved emotional stress impacting pituitary signaling"
    ],
    symptoms: {
      mostCommon: [
        "Unexplained weight gain or extreme difficulty losing weight",
        "Persistent fatigue and morning sluggishness",
        "Cold sensitivity (cold hands and feet)",
        "Irregular, delayed, or painful menstrual cycles"
      ],
      moderate: [
        "Diffusive hair thinning and brittle nails",
        "Dry skin and facial puffiness",
        "Hormonal acne along jawline and chin",
        "Mood fluctuations, brain fog, and mild depression"
      ],
      advanced: [
        "Thyroid nodule formation or goiter enlargement",
        "Severe PCOS with hirsutism (excess facial hair) and anovulation",
        "Severe hot flashes, night sweats, and sleep disruption",
        "Metabolic syndrome with elevated fasting insulin and blood pressure"
      ]
    },
    associatedConditions: [
      "Hypothyroidism & Hashimoto's Thyroiditis",
      "Hyperthyroidism & Graves' Disease Support",
      "Polycystic Ovary Syndrome (PCOS)",
      "Perimenopause & Menopausal Distress",
      "Insulin Resistance & Metabolic Slowing"
    ],
    riskFactors: {
      lifestyle: ["High refined carb & sugar consumption", "Late night light exposure", "Extreme crash dieting", "Sedentary routine"],
      genetic: ["Family history of thyroid disease or PCOS", "Deiodinase gene variations", "Insulin receptor gene variants"],
      environmental: ["Plastics & BPA exposure", "Fluoride & bromide competitive iodine inhibition", "Pesticides"],
      metabolic: ["Visceral fat accumulation", "Fatty liver (impaired hormone conversion)", "Chronic inflammation"],
      psychological: ["Chronic emotional suppression", "Caregiver burnout", "High workplace stress"]
    },
    constitutionalPerspective: "Classical homeopathy views endocrine organs as vital regulatory nodes governed by the central vital force. Hormonal symptoms are not viewed merely as gland failures but as systemic signals of constitutional imbalance. Remedy selection requires evaluating specific thermal modalities (chilly vs warm), thirst, food cravings (sweets, salt), sleep characteristics, menstrual details, and emotional temperament. Our clinical approach focuses on understanding constitutional susceptibility while working alongside appropriate medical care.",
    treatmentPhilosophy: "We utilize individualized constitutional remedies tailored to the patient's unique physical, metabolic, and emotional profile. Treatment aims to optimize pituitary signaling, improve peripheral hormone conversion, enhance insulin sensitivity, and support liver hormone detoxification. We collaborate with endocrinologists and gynecologists to ensure objective monitoring of hormone levels.",
    expectedTreatmentJourney: {
      week1: "Comprehensive endocrine case taking, lab evaluation, dietary structuring, and initial constitutional support.",
      month1: "Improved daily energy levels, better sleep quality, and soothing of hormonal mood swings.",
      month3: "More regular menstrual cycles, reduced cold sensitivity, and improved metabolic vitality.",
      month6: "Sustained hormonal stability, clearer skin, healthier hair growth, and optimized metabolic markers.",
      longTermFollowUp: "Periodic endocrine monitoring aligned with standard blood test schedules."
    },
    lifestyleRecommendations: {
      diet: "Blood-sugar-balancing whole food diet rich in clean proteins, healthy fats (avocado, coconut oil, nuts), brassica vegetables (cooked), selenium-rich Brazil nuts, and zinc; eliminate refined sugars and processed junk.",
      exercise: "Strength training 3 times weekly to build muscle insulin sensitivity, combined with daily walking; avoid excessive chronic cardio during adrenal burnout.",
      sleep: "8 hours of dark, cool sleep; no screens 90 minutes before bed to protect melatonin and pituitary function.",
      stress: "Daily box breathing, yoga, or nature walks to calm the HPA axis.",
      hydration: "2.5 to 3 liters of filtered water daily.",
      environmentalExposure: "Eliminate plastic water bottles, switch to non-toxic glass/stainless steel containers, and use organic personal care products."
    },
    faqs: [
      {
        question: "Can I take homeopathic remedies along with my prescribed Levothyroxine (Thyronorm/Eltroxin)?",
        answer: "Yes. Homeopathic remedies do not interfere with synthetic thyroid hormones. Patients should continue their prescribed thyroid medication and monitor TSH levels with their physician."
      },
      {
        question: "Can homeopathy help dissolve ovarian cysts in PCOS?",
        answer: "Constitutional homeopathy helps restore normal pituitary-ovarian signaling, promoting regular ovulation and gradual regression of functional ovarian cysts over 3 to 6 months."
      },
      {
        question: "How does homeopathy address hormonal weight gain?",
        answer: "By improving insulin sensitivity, supporting thyroid hormone conversion, and reducing cortisol overdrive, constitutional treatment helps optimize metabolic rate."
      },
      {
        question: "Can homeopathy help with hot flashes and night sweats in menopause?",
        answer: "Yes! Constitutional remedies effectively calm vasomotor instability, reducing the frequency and severity of hot flashes naturally without synthetic HRT risks."
      },
      {
        question: "How long does treatment take for chronic hypothyroidism?",
        answer: "Initial energy and mood improvements usually begin within 3 to 4 weeks, with broader endocrine stabilization taking 3 to 6 months."
      },
      {
        question: "What lab tests are needed for initial consultation?",
        answer: "Complete Thyroid Panel (TSH, Free T3, Free T4, Anti-TPO), Fasting Insulin, HbA1c, Lipid profile, and relevant female hormone panels (FSH, LH, Prolactin, Serum Testosterone)."
      },
      {
        question: "Does homeopathy treat thyroid nodules?",
        answer: "Benign thyroid nodules often respond well to constitutional care, showing size stabilization or reduction. Any suspicious or malignant nodules require immediate surgical oncology evaluation."
      },
      {
        question: "Why is liver health important in hormonal balance?",
        answer: "The liver is responsible for metabolizing excess estrogens and converting T4 into active T3. Supporting liver clearance is essential for endocrine wellness."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients with acute thyroid storm, severe hyperthyroidism, or malignant thyroid nodules must seek immediate specialist endocrinology or emergency surgical care.",
    seo: {
      metaTitle: "Constitutional Hormonal & Thyroid Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic care for hypothyroidism, PCOS, perimenopause, and insulin resistance. Integrated with functional endocrinology.",
      slug: "hormonal-thyroid",
      keywords: ["hypothyroidism homeopathy", "PCOS natural treatment", "hashimotos root cause", "perimenopause care", "thyroid constitutional remedy"],
      openGraphDescription: "Balance your endocrine axis and restore metabolic energy with constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Hormonal & Thyroid Care",
      appointmentCta: "Schedule Endocrine Constitutional Assessment",
      trustBadge: "Endocrinology Compliant • Metabolic Axis Regulation",
      emptyState: "Select a hormonal condition to view neuro-endocrine mapping.",
      loadingMessage: "Loading constitutional endocrine profile...",
      consultationReminder: "Please bring recent blood test reports (Thyroid, HbA1c, Fasting Insulin) to your appointment."
    },
    visualSuggestions: {
      icons: ["Dna", "Sparkles", "ShieldCheck", "Activity"],
      illustrations: ["Hypothalamus-pituitary-thyroid feedback loop", "Ovarian follicle maturation vs PCOS arrest"],
      infographics: ["Endocrine Axis Recovery Timeline", "T4 to T3 Liver Conversion Diagram"],
      anatomicalDiagrams: ["Thyroid gland & adrenal axis anatomy"],
      animatedPathways: ["Stress trigger ➔ Cortisol spike ➔ Endocrine re-balancing pathway"],
      diseaseProgressionVisuals: ["Sluggish thyroid metabolism vs restored cellular energy baseline"]
    },
    knowledgeGraph: {
      condition: "Hormonal & Thyroid Health",
      symptoms: ["Weight gain", "Fatigue", "Cold sensitivity", "Irregular periods", "Hair thinning", "Hot flashes", "Mood swings"],
      triggers: ["Chronic stress", "Crash diets", "Xenoestrogen exposure", "Sleep deprivation"],
      riskFactors: ["Autoimmune thyroiditis", "Insulin resistance", "Family history", "Hepatic congestion"],
      systemsInvolved: ["Endocrine System", "Reproductive System", "Metabolic Axis"],
      clinicalPathways: ["HPT Axis Recalibration", "Insulin Sensitization", "Hepatic Estrogen Metabolism"],
      relatedServices: ["Neuro & Mental Health", "Women's Health", "Obesity & Diabetes Support"],
      tags: ["Hypothyroidism", "PCOS", "Thyroid", "Hormones", "Menopause"]
    }
  },

  "allergies": {
    id: "allergies",
    title: "Allergies & Clinical Immunology",
    shortSubtitle: "Constitutional Immunodynamic Profile",
    heroDescription: "Allergic conditions—such as allergic rhinitis, food protein sensitivities, chronic urticaria, and environmental antigen hyper-reactivity—reflect mast cell instability and T-helper 2 immune dominance. Suppressing allergic symptoms with antihistamines or decongestants provides temporary relief while leaving underlying immunological hypersensitivity untreated. Classical constitutional homeopathy aims to desensitize immune responses, seal mucosal epithelial barriers, and restore oral and environmental tolerance alongside allergist guidelines.",
    overview: "Allergies arise when the immune system misidentifies harmless environmental or dietary proteins as dangerous pathogens. IgE antibodies bind to tissue mast cells, triggering histamine release and tissue swelling upon antigen contact. Constitutional care re-trains immune recognition without chemical dependency.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing recent seasonal pollen rhinitis or hives.",
      chronicSufferers: "Individuals enduring long-standing multi-allergen sensitivities.",
      recurrentCases: "Patients with recurring urticaria outbreaks every weather shift.",
      complementaryCare: "Individuals taking daily antihistamines wanting natural root-cause balancing.",
      medicationSideEffects: "Patients seeking non-drowsy alternatives to daily allergy pills."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Mast cell hyper-excitability, high baseline IgE production, and mucosal barrier permeability.",
      functionalAxis: "Mast Cell Hypersensitivity ➔ IgE Binding ➔ Histamine Release ➔ Mucosal & Dermal Edema",
      clinicalManifestation: "Paroxysmal sneezing, watery eyes, itching, hives, and food digestion distress."
    },
    underlyingBiologicalDrivers: [
      "Th2 immune axis dominance",
      "Mast cell membrane hyper-fragility",
      "Intestinal & respiratory mucosal tight junction erosion",
      "Hepatic phase-II histamine breakdown sluggishness (DAO/HNMT deficiency)",
      "Subclinical gut dysbiosis",
      "Chronic environmental toxin exposure",
      "Autonomic vagal nerve hyper-reactivity",
      "High circulating total IgE titers",
      "Cross-reactive oral allergy syndrome drivers",
      "Emotional stress triggering mast cell degranulation"
    ],
    symptoms: {
      mostCommon: [
        "Frequent sneezing fits and runny nose",
        "Itchy, watery red eyes (allergic conjunctivitis)",
        "Nasal congestion & post-nasal drip",
        "Itchy skin hives or redness"
      ],
      moderate: [
        "Food intolerances causing bloating or skin flushing",
        "Chronic sinus pressure and headache",
        "Throat tickle & dry allergic cough",
        "Fatigue and sluggishness during peak pollen seasons"
      ],
      advanced: [
        "Severe chronic urticaria and angioedema (swelling of lips/eyelids)",
        "Reactive airway constriction during pollen surges",
        "Multiple severe food protein sensitivities",
        "Relentless sleep loss from airway blockage"
      ]
    },
    associatedConditions: [
      "Allergic Rhinitis & Seasonal Hay Fever",
      "Chronic Urticaria & Angioedema",
      "Food Intolerances & Oral Allergy Syndrome",
      "Atopic Eczema",
      "Allergic Bronchial Asthma"
    ],
    riskFactors: {
      lifestyle: ["High histamine diet (aged cheese, wine, processed meats)", "Indoor mold exposure"],
      genetic: ["Atopic family history", "DAO enzyme gene variants"],
      environmental: ["High pollen counts", "Dust mite infestation", "Pet dander"],
      metabolic: ["Leaky gut syndrome", "Liver clearance sluggishness"],
      psychological: ["High psychological stress amplifying allergic flares"]
    },
    constitutionalPerspective: "Homeopathy views allergies as an outward manifestation of an over-vigilant immune system (atopic miasm). Profiling analyzes specific allergen triggers, thermal sensitivities, and physical modalities.",
    treatmentPhilosophy: "We utilize oral constitutional remedies aimed at mast cell stabilization, mucosal barrier repair, and gradual antigen desensitization.",
    expectedTreatmentJourney: {
      week1: "Allergen mapping, constitutional intake, and acute histamine soothing.",
      month1: "Reduced sneezing intensity and less eye itching.",
      month3: "Decreased seasonal flare frequency and reduced daily antihistamine need.",
      month6: "Sustained immune desensitization, clearer nasal passages, and enhanced tolerance.",
      longTermFollowUp: "Seasonal check-ups prior to peak pollen months."
    },
    lifestyleRecommendations: {
      diet: "Low-histamine, anti-inflammatory whole food diet rich in quercetin, Vitamin C, leafy greens, cooked vegetables; eliminate artificial additives.",
      exercise: "Indoor exercising on high pollen days; gentle walking in clean air.",
      sleep: "HEPA air purifier in bedroom; shower before bed to wash off airborne pollen.",
      stress: "Mindful breathing to calm nervous system mast cell triggering.",
      hydration: "3 liters of pure water daily.",
      environmentalExposure: "Encase pillows and mattress in dust-mite covers; avoid synthetic perfumes."
    },
    faqs: [
      {
        question: "Can homeopathy permanently cure severe food anaphylaxis?",
        answer: "No. True life-threatening anaphylactic food allergies require strict avoidance and emergency epinephrine (EpiPen). Homeopathy supports general immune tolerance and mild-to-moderate sensitivities."
      },
      {
        question: "How long does allergy desensitization take?",
        answer: "Initial symptom soothing occurs within 2 to 4 weeks, with deeper immunodynamic desensitization developing over 3 to 6 months."
      },
      {
        question: "Can I take homeopathic allergy remedies alongside my daily antihistamine?",
        answer: "Yes. Homeopathy does not interact pharmacologically with antihistamines. You can safely co-manage while working with your doctor."
      },
      {
        question: "Is homeopathic allergy treatment suitable for children?",
        answer: "Extremely safe, non-drowsy, and gentle for children of all ages."
      },
      {
        question: "What lab tests are helpful?",
        answer: "Total Serum IgE, Absolute Eosinophil Count (AEC), and allergen-specific IgE blood panels."
      },
      {
        question: "Why do allergies worsen during stress?",
        answer: "Stress neuropeptides directly trigger mast cells to release histamine, worsening physical symptoms."
      },
      {
        question: "Does gut health impact allergies?",
        answer: "Significantly. 70% of immune tissue resides in the gut; repairing intestinal lining helps reduce systemic allergic reactivity."
      },
      {
        question: "Are homeopathic remedies non-drowsy?",
        answer: "100% non-drowsy, non-sedating, and free of brain fog side effects."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Anyone experiencing acute anaphylaxis, throat swelling, or severe respiratory distress must use emergency epinephrine and seek immediate emergency hospital care.",
    seo: {
      metaTitle: "Constitutional Allergy & Immunology Care | Homeo Healthcare",
      metaDescription: "Evidence-informed constitutional homeopathic care for allergic rhinitis, chronic urticaria, food sensitivities, and hay fever. Non-drowsy immune balancing.",
      slug: "allergies",
      keywords: ["allergy homeopathy", "allergic rhinitis natural treatment", "urticaria root cause", "non-drowsy allergy relief", "hay fever remedy"],
      openGraphDescription: "Desensitize immune hypersensitivity naturally with constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Allergy Care",
      appointmentCta: "Schedule Allergy Constitutional Assessment",
      trustBadge: "Immunology Compliant • Non-Drowsy Care",
      emptyState: "Select an allergy condition to view immune desensitization mapping.",
      loadingMessage: "Loading constitutional allergy profile...",
      consultationReminder: "Please bring recent IgE allergy panel reports to your consultation."
    },
    visualSuggestions: {
      icons: ["ShieldOff", "Wind", "Sparkles", "Activity"],
      illustrations: ["Mast cell degranulation histamine release diagram", "Mucosal epithelial barrier integrity"],
      infographics: ["Allergy Desensitization Timeline", "Low Histamine Diet Guide"],
      anatomicalDiagrams: ["Nasal turbinates and sinus mucosal lining"],
      animatedPathways: ["Antigen contact ➔ Mast cell response ➔ Desensitization pathway"],
      diseaseProgressionVisuals: ["Chronic antihistamine dependence vs constitutional immune recalibration"]
    },
    knowledgeGraph: {
      condition: "Allergies & Clinical Immunology",
      symptoms: ["Sneezing", "Runny nose", "Itchy eyes", "Hives", "Nasal congestion", "Post-nasal drip"],
      triggers: ["Pollen", "Dust mites", "Pet dander", "Aged foods", "Mold spores"],
      riskFactors: ["Atopic diathesis", "DAO enzyme deficiency", "Leaky gut", "High stress"],
      systemsInvolved: ["Immune System", "Respiratory System", "Integumentary System"],
      clinicalPathways: ["Mast Cell Stabilization", "IgE Modulation", "Mucosal Barrier Sealing"],
      relatedServices: ["Lungs & Respiratory", "Skin Disorders", "Digestive Health"],
      tags: ["Allergies", "Rhinitis", "Urticaria", "Hay Fever", "Immunology"]
    }
  },

  "integrative-cancer-care": {
    id: "integrative-cancer-care",
    title: "Integrative Cancer Care & Supportive Oncology",
    shortSubtitle: "Constitutional Supportive Oncology Profile",
    heroDescription: "Integrative cancer care offers compassionate, evidence-informed constitutional homeopathic support alongside conventional oncology (chemotherapy, radiation, immunotherapy, and surgery). Cancer and its intensive treatments often cause profound vital force exhaustion, treatment-induced nausea, mucositis, peripheral neuropathy, and severe fatigue. Homeopathy does NOT claim to replace conventional oncology or cure cancer. Instead, our supportive constitutional care aims to mitigate side effects, protect non-targeted healthy tissues, enhance appetite, and nurture emotional resilience throughout the cancer journey.",
    overview: "Conventional cancer treatments destroy rapidly dividing cells to eradicate malignancy. While life-saving, these therapies can strain healthy mucosal linings, bone marrow, liver metabolism, and peripheral nerve endings. Classical homeopathy provides gentle, non-interacting supportive care that works harmoniously alongside your oncology team to maintain vitality and quality of life.",
    whoCanBenefit: {
      newlyDiagnosed: "Patients preparing for upcoming chemotherapy or surgery seeking supportive vitality building.",
      chronicSufferers: "Patients undergoing active chemo/radiation experiencing treatment side effects.",
      recurrentCases: "Individuals recovering from post-treatment exhaustion or chronic radiation tissue stiffness.",
      complementaryCare: "Patients working with oncologists who want integrative symptom support.",
      medicationSideEffects: "Patients seeking relief from chemo-induced nausea, vomiting, mouth ulcers, or neuropathy."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Cellular microenvironment stagnation, mitochondrial decline, and systemic vital force depletion.",
      functionalAxis: "Oncology Treatment Strain ➔ Mucosal & Cellular Stress ➔ Toxic Cachexia Burden ➔ Systemic Fatigue & Side Effects",
      clinicalManifestation: "Chemo nausea, radiation skin burns, oral mucositis ulcers, peripheral neuropathy, and profound fatigue."
    },
    underlyingBiologicalDrivers: [
      "Chemotherapy cytotoxic mucosal damage",
      "Radiation-induced tissue fibrosis & skin burns",
      "Bone marrow suppression & low blood counts",
      "Mitochondrial energy failure causing cancer fatigue",
      "Post-surgical wound healing demands",
      "Chemo-induced peripheral nerve toxicity",
      "Hepatic drug metabolism burden",
      "Loss of appetite & cancer cachexia strain",
      "Profound emotional fear & nervous exhaustion",
      "Subclinical systemic inflammatory cytokine elevation"
    ],
    symptoms: {
      mostCommon: [
        "Chemotherapy-induced nausea & vomiting",
        "Profound post-treatment physical exhaustion",
        "Loss of appetite & metallic taste",
        "Dry mouth and painful oral mucositis (mouth sores)"
      ],
      moderate: [
        "Radiation skin erythema, dryness, or superficial burns",
        "Peripheral neuropathy (tingling/numbness in fingers and toes)",
        "Post-surgical wound ache & lymphatic edema",
        "Emotional anxiety, insomnia, and fear"
      ],
      advanced: [
        "Severe cancer cachexia & muscle wasting support",
        "Persistent bone pain post-radiation",
        "Chronic digestive dysmotility after abdominal treatment",
        "Severe vital depletion"
      ]
    },
    associatedConditions: [
      "Chemotherapy Side-Effect Management",
      "Radiation Therapy Support & Skin Recovery",
      "Post-Surgical Recovery & Wound Healing",
      "Cancer-Related Fatigue & Cachexia Support",
      "Chemo-Induced Peripheral Neuropathy"
    ],
    riskFactors: {
      lifestyle: ["Severe nutritional depletion", "Lack of sleep", "Emotional isolation"],
      genetic: ["Inherited cellular vulnerability"],
      environmental: ["Carcinogen exposure history", "Heavy toxic load"],
      metabolic: ["Mitochondrial dysfunction", "Systemic metabolic acidosis"],
      psychological: ["Profound cancer diagnosis shock", "Fear of recurrence"]
    },
    constitutionalPerspective: "In classical homeopathy, cancer support honors the patient's totality. Remedies are selected according to specific physical side effects, thermal state, sleep pattern, and emotional state.",
    treatmentPhilosophy: "We offer non-toxic, non-interfering supportive constitutional care alongside oncology protocols. We maintain full transparency and alignment with treating oncologists.",
    expectedTreatmentJourney: {
      week1: "Supportive intake, review of oncology schedule, and initial anti-nausea/vital support.",
      month1: "Reduced chemo nausea severity, faster mouth sore healing, and better appetite.",
      month3: "Improved energy levels between chemo cycles and reduced radiation skin discomfort.",
      month6: "Sustained post-treatment recovery, improved nerve sensation, and restored vital stamina.",
      longTermFollowUp: "Ongoing constitutional support during remission maintenance."
    },
    lifestyleRecommendations: {
      diet: "Nourishing, easily digestible whole-food diet rich in clean proteins, cooked soups, steamed greens, healthy oils, organic juices; strictly avoid unpasteurized raw items during low neutrophil counts.",
      exercise: "Gentle daily walking and light stretching as tolerated; strictly avoid over-exertion.",
      sleep: "8-9 hours of quiet, dark, comfortable sleep.",
      stress: "Guided meditation, gentle music therapy, and supportive counseling.",
      hydration: "2.5 to 3 liters of warm filtered water and soothing herbal teas daily.",
      environmentalExposure: "Avoid harsh chemical fragrances, synthetic cleaning agents, and crowded public spaces during low WBC phases."
    },
    faqs: [
      {
        question: "Does homeopathy replace chemotherapy or surgery for cancer?",
        answer: "NO. Homeopathy does NOT replace conventional oncology treatments. It is strictly supportive and complementary, aimed at mitigating treatment side effects and improving quality of life alongside your oncology team."
      },
      {
        question: "Will homeopathic remedies interfere with chemotherapy or immunotherapy drugs?",
        answer: "No. Ultra-diluted homeopathic remedies operate non-pharmacologically and do not interfere with chemotherapy, immunotherapy, or targeted radiation treatments."
      },
      {
        question: "Can homeopathy help with chemo-induced nausea and vomiting?",
        answer: "Yes. Specific supportive remedies effectively reduce acute chemo nausea, vomiting, and metallic taste, helping patients eat more comfortably."
      },
      {
        question: "How does homeopathy help with radiation skin burns?",
        answer: "Supportive remedies promote rapid skin tissue healing, calm local heat, and ease soreness following radiation sessions."
      },
      {
        question: "Is online consultation available for cancer patients who cannot travel?",
        answer: "Yes. Video consultations allow patients to receive supportive care from the comfort of their home."
      },
      {
        question: "What documentation should be shared during consultation?",
        answer: "Oncology diagnostic reports, biopsy summaries, current chemotherapy schedules, blood counts (CBC), and doctor notes."
      },
      {
        question: "Can homeopathy help with chemo-induced peripheral neuropathy (tingling fingers/toes)?",
        answer: "Yes. Remedies targeting peripheral nerve micro-circulation help soothe nerve tingling, burning, and numbness."
      },
      {
        question: "Is supportive care safe during low white blood cell (neutropenia) phases?",
        answer: "Yes. Homeopathic remedies are completely sterile, non-toxic, and safe during low blood count phases."
      }
    ],
    medicalDisclaimer: "Homeopathy in cancer care is strictly supportive and complementary. It does NOT replace conventional oncology surgery, chemotherapy, radiation, or immunotherapy. Patients must maintain full care with their licensed oncologist.",
    seo: {
      metaTitle: "Integrative Cancer Care & Supportive Oncology | Homeo Healthcare",
      metaDescription: "Compassionate, evidence-informed supportive homeopathic care alongside chemotherapy, radiation, and surgery. Relief from nausea, fatigue, and treatment side effects.",
      slug: "integrative-cancer-care",
      keywords: ["supportive oncology homeopathy", "chemo nausea natural relief", "radiation burn care", "cancer fatigue support", "integrative cancer care"],
      openGraphDescription: "Enhance comfort, mitigate treatment side effects, and build vital energy with supportive constitutional care at Homeo Healthcare."
    },
    microcopy: {
      ctaButtonText: "Explore Supportive Oncology",
      appointmentCta: "Schedule Supportive Oncology Intake",
      trustBadge: "Oncology Co-Management Compliant • Non-Interfering Care",
      emptyState: "Select a supportive oncology section to view care mapping.",
      loadingMessage: "Loading supportive oncology profile...",
      consultationReminder: "Please share your current oncology treatment protocol and recent blood count reports."
    },
    visualSuggestions: {
      icons: ["Sprout", "ShieldCheck", "Heart", "Sparkles"],
      illustrations: ["Cellular mitochondrial vitality support schematic", "Integrative oncology care co-management diagram"],
      infographics: ["Supportive Oncology Recovery Pathway", "Chemo Side Effect Mitigation Guide"],
      anatomicalDiagrams: ["Mucosal epithelial lining protection schematic"],
      animatedPathways: ["Treatment stress ➔ Soothing support ➔ Vital energy restoration pathway"],
      diseaseProgressionVisuals: ["Severe treatment exhaustion vs supportive constitutional vitality preservation"]
    },
    knowledgeGraph: {
      condition: "Integrative Cancer Care & Supportive Oncology",
      symptoms: ["Chemo nausea", "Profound fatigue", "Radiation burns", "Mouth sores", "Peripheral neuropathy", "Loss of appetite"],
      triggers: ["Chemotherapy cycles", "Radiation therapy", "Post-surgical strain", "Oncology diagnosis shock"],
      riskFactors: ["Toxic treatment load", "Mitochondrial decline", "Nutritional depletion"],
      systemsInvolved: ["Whole Body System", "Gastrointestinal System", "Nervous System", "Immune System"],
      clinicalPathways: ["Treatment Side Effect Mitigation", "Mucositis & Tissue Healing", "Vital Force Resuscitation"],
      relatedServices: ["Digestive Health", "Neuro & Mental Health", "Skin Disorders"],
      tags: ["Supportive Oncology", "Chemo Support", "Radiation Support", "Integrative Cancer Care"]
    }
  }
};

export const getSpecialtyProfileByTitle = (title: string): SpecialtyProfile => {
  const normalized = title.toLowerCase();
  if (normalized.includes("heart") || normalized.includes("cardio")) return SPECIALTY_PROFILES["heart-cardiovascular"];
  if (normalized.includes("lung") || normalized.includes("respiratory")) return SPECIALTY_PROFILES["lungs-respiratory"];
  if (normalized.includes("neuro") || normalized.includes("mental")) return SPECIALTY_PROFILES["neuro-mental-health"];
  if (normalized.includes("joint") || normalized.includes("spine")) return SPECIALTY_PROFILES["joints-spine"];
  if (normalized.includes("digestive") || normalized.includes("gut")) return SPECIALTY_PROFILES["digestive-health"];
  if (normalized.includes("skin")) return SPECIALTY_PROFILES["skin-disorders"];
  if (normalized.includes("paediatric") || normalized.includes("child")) return SPECIALTY_PROFILES["paediatric-care"];
  if (normalized.includes("autoimmune")) return SPECIALTY_PROFILES["autoimmune-disorders"];
  if (normalized.includes("hormonal") || normalized.includes("thyroid")) return SPECIALTY_PROFILES["hormonal-thyroid"];
  if (normalized.includes("allergy") || normalized.includes("allergies")) return SPECIALTY_PROFILES["allergies"];
  if (normalized.includes("cancer") || normalized.includes("oncology")) return SPECIALTY_PROFILES["integrative-cancer-care"];
  
  // Safe default fallback profile for any unmapped title
  return {
    id: "general-specialty",
    title: title,
    shortSubtitle: `Constitutional ${title} Profile`,
    heroDescription: `${title} conditions represent complex multi-system physiological and constitutional imbalances. Our clinical approach evaluates individual reactivity, root-cause pathways, and biological drivers to provide personalized, non-invasive constitutional support alongside standard medical care.`,
    overview: `Chronic ${title.toLowerCase()} conditions often develop along an autonomic, metabolic, and immunological continuum. Classical homeopathic treatment addresses underlying susceptibility, supporting endogenous self-regulatory mechanisms while maintaining full alignment with conventional medical standards.`,
    whoCanBenefit: {
      newlyDiagnosed: "Patients experiencing recent onset symptoms seeking early non-invasive root-cause support.",
      chronicSufferers: "Individuals managing long-standing chronic conditions requiring systemic physiological balancing.",
      recurrentCases: "Patients experiencing recurring symptom flares during stress or seasonal transitions.",
      complementaryCare: "Individuals undergoing conventional care who wish to optimize overall constitutional vitality.",
      medicationSideEffects: "Patients seeking gentle support to manage fatigue or systemic burden."
    },
    rootCauseAxis: {
      epigeneticSusceptibility: "Inherited constitutional vulnerability and metabolic predisposition.",
      functionalAxis: "Systemic Stress ➔ Autonomic Shift ➔ Inflammatory Signaling ➔ Somatic Expression",
      clinicalManifestation: `Somatic symptoms associated with ${title.toLowerCase()} strain.`
    },
    underlyingBiologicalDrivers: [
      "Autonomic nervous system dysregulation",
      "Systemic low-grade micro-inflammation",
      "HPA axis strain & elevated cortisol",
      "Mitochondrial cellular fatigue",
      "Immune signaling imbalance",
      "Epithelial & mucosal barrier permeability",
      "Cellular oxidative stress",
      "Sluggish metabolic waste clearance",
      "Subclinical nutrient assimilation deficits",
      "Unresolved psycho-emotional stress"
    ],
    symptoms: {
      mostCommon: ["Fatigue and low stamina", "Recurrent local discomfort", "Sleep disturbance", "Stress reactivity"],
      moderate: ["Flaring during weather changes", "Somatic muscle tension", "Digestive sluggishness", "Mood fluctuations"],
      advanced: ["Persistent chronic symptom burden", "Restricted physical activity", "Sleep disruption", "Systemic exhaustion"]
    },
    associatedConditions: [`Chronic ${title} Imbalances`, "Stress Axis Strain", "Metabolic Slowing"],
    riskFactors: {
      lifestyle: ["Sedentary routine", "High processed sugar diet", "Sleep deprivation", "Chronic stress"],
      genetic: ["Family history of chronic ailments", "Constitutional predisposition"],
      environmental: ["Pollution exposure", "Workplace strain", "Chemical irritants"],
      metabolic: ["Insulin resistance", "Low-grade inflammation", "Gut dysbiosis"],
      psychological: ["Suppressed emotional stress", "Burnout", "Anxiety"]
    },
    constitutionalPerspective: `From a classical perspective, ${title.toLowerCase()} symptoms express adaptive strain of the vital force under chronic stress and inherited diathesis. Profiling evaluates the totality of thermal preferences, physical modalities, and emotional state.`,
    treatmentPhilosophy: "We prescribe individualized constitutional remedies tailored to the patient's unique physical and emotional totality, working supportively alongside primary medical care.",
    expectedTreatmentJourney: {
      week1: "Baseline intake, constitutional profiling, and initial calming support.",
      month1: "Reduction in acute stress spikes and improved sleep quality.",
      month3: "Enhanced physiological stamina and reduced symptom frequency.",
      month6: "Sustained physiological regulation and overall vital balance.",
      longTermFollowUp: "Periodic maintenance check-ups to preserve long-term health."
    },
    lifestyleRecommendations: {
      diet: "Anti-inflammatory, antioxidant-rich whole food diet with clean proteins and green vegetables.",
      exercise: "30 minutes of moderate aerobic activity daily combined with gentle stretching.",
      sleep: "7-8 hours of circadian-aligned rest in a quiet, dark environment.",
      stress: "Daily 15-minute relaxation or box breathing exercises.",
      hydration: "2.5 liters of pure filtered water daily.",
      environmentalExposure: "Minimize exposure to artificial additives, plastics, and environmental noise."
    },
    faqs: [
      {
        question: "Can I continue my prescribed medications while taking homeopathic remedies?",
        answer: "Yes. Homeopathic remedies do not interfere with conventional medications. Patients should always consult their physician before making any prescription changes."
      },
      {
        question: "Is online consultation available?",
        answer: "Yes. High-quality video consultations are available worldwide."
      },
      {
        question: "How long does constitutional treatment take?",
        answer: "Initial symptom soothing usually begins within 2 to 4 weeks, with deeper constitutional balancing taking 3 to 6 months."
      },
      {
        question: "Are homeopathic remedies safe?",
        answer: "Yes. Ultra-diluted homeopathic remedies are non-toxic, non-addictive, and free of side effects."
      }
    ],
    medicalDisclaimer: "Homeopathy is complementary and individualized. Patients should never discontinue prescribed medical treatments without consulting their treating physician.",
    seo: {
      metaTitle: `Constitutional ${title} Care | Homeo Healthcare`,
      metaDescription: `Evidence-informed constitutional homeopathic care for ${title.toLowerCase()}. Integrated with root-cause medicine.`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      keywords: [`${title.toLowerCase()} homeopathy`, "constitutional care", "root cause wellness"],
      openGraphDescription: `Discover constitutional care for ${title.toLowerCase()} at Homeo Healthcare.`
    },
    microcopy: {
      ctaButtonText: `Explore ${title} Care`,
      appointmentCta: `Schedule ${title} Consultation`,
      trustBadge: "Clinical Standard Compliant • Non-Suppressive Care",
      emptyState: "Select a condition to view complete clinical root-cause analysis.",
      loadingMessage: "Loading constitutional profile...",
      consultationReminder: "Please bring your recent medical records and lab reports to your consultation."
    },
    visualSuggestions: {
      icons: ["Activity", "ShieldCheck", "Sparkles", "Dna"],
      illustrations: ["Constitutional vital pathway schematic"],
      infographics: ["5-Phase Recovery Timeline"],
      anatomicalDiagrams: ["Organ system anatomical cross-section"],
      animatedPathways: ["Stress trigger ➔ Constitutional regulation pathway"],
      diseaseProgressionVisuals: ["Chronic strain vs constitutional balance baseline"]
    },
    knowledgeGraph: {
      condition: title,
      symptoms: ["Fatigue", "Local discomfort", "Sleep disturbance", "Stress reactivity"],
      triggers: ["Psychological stress", "Sleep loss", "Poor diet"],
      riskFactors: ["Family history", "Sedentary routine", "Gut dysbiosis"],
      systemsInvolved: ["Whole Body System", "Autonomic Nervous System"],
      clinicalPathways: ["Autonomic Balancing", "Constitutional Regulation"],
      relatedServices: ["Neuro & Mental Health", "Digestive Health"],
      tags: [title, "Constitutional Homeopathy", "Root Cause Health"]
    }
  };
};
