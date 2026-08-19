export type AcademySection =
  | "home"
  | "learn"
  | "explore"
  | "practice"
  | "assess"
  | "research"
  | "certify";

export type AnatomySystemId =
  | "cardiovascular"
  | "nervous"
  | "respiratory"
  | "renal"
  | "digestive"
  | "skeletal"
  | "muscular"
  | "endocrine"
  | "lymphatic"
  | "reproductive"
  | "integumentary"
  | "sensory";

export type AnatomyRegionId =
  | "right-hypochondriac"
  | "epigastric"
  | "left-hypochondriac"
  | "right-lumbar"
  | "umbilical"
  | "left-lumbar"
  | "right-iliac"
  | "hypogastric"
  | "left-iliac";

export interface AcademyReference {
  title: string;
  publisher: string;
  url: string;
  evidenceType: "Open textbook" | "Government health reference";
  reviewedOn: string;
}

export interface AnatomySystem {
  id: AnatomySystemId;
  name: string;
  shortName: string;
  accent: string;
  lightAccent: string;
  overview: string;
  structures: string[];
  functions: string[];
  clinicalConnections: string[];
  reference: AcademyReference;
}

export interface AnatomyRegion {
  id: AnatomyRegionId;
  name: string;
  position: string;
  description: string;
  typicalContents: string[];
}

export const REGIONAL_ANATOMY_REFERENCE: AcademyReference = {
  title: "1.6 Anatomical Terminology — Anatomy and Physiology 2e",
  publisher: "OpenStax, Rice University",
  url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology",
  evidenceType: "Open textbook",
  reviewedOn: "2026-08-19",
};

export const ANATOMY_REGIONS: AnatomyRegion[] = [
  {
    id: "right-hypochondriac",
    name: "Right hypochondriac region",
    position: "Upper right (patient's right)",
    description: "Lateral to the epigastric region and inferior to the right costal margin.",
    typicalContents: ["Right lobe of liver", "Gallbladder", "Superior right kidney"],
  },
  {
    id: "epigastric",
    name: "Epigastric region",
    position: "Upper midline",
    description: "The superior central region between the right and left hypochondriac regions.",
    typicalContents: ["Part of stomach", "Part of liver", "Pancreas and duodenum"],
  },
  {
    id: "left-hypochondriac",
    name: "Left hypochondriac region",
    position: "Upper left (patient's left)",
    description: "Lateral to the epigastric region and inferior to the left costal margin.",
    typicalContents: ["Spleen", "Fundus of stomach", "Superior left kidney"],
  },
  {
    id: "right-lumbar",
    name: "Right lumbar region",
    position: "Middle right (patient's right)",
    description: "The middle lateral region between the subcostal and intertubercular planes.",
    typicalContents: ["Ascending colon", "Right kidney", "Small intestine"],
  },
  {
    id: "umbilical",
    name: "Umbilical region",
    position: "Central abdomen",
    description: "The central region surrounding the umbilicus.",
    typicalContents: ["Jejunum and ileum", "Transverse colon", "Inferior duodenum"],
  },
  {
    id: "left-lumbar",
    name: "Left lumbar region",
    position: "Middle left (patient's left)",
    description: "The middle lateral region on the patient's left side.",
    typicalContents: ["Descending colon", "Left kidney", "Small intestine"],
  },
  {
    id: "right-iliac",
    name: "Right iliac region",
    position: "Lower right (patient's right)",
    description: "The inferior lateral region overlying the right iliac fossa.",
    typicalContents: ["Cecum", "Appendix", "Terminal ileum"],
  },
  {
    id: "hypogastric",
    name: "Hypogastric region",
    position: "Lower midline",
    description: "The inferior central region, also called the pubic region.",
    typicalContents: ["Urinary bladder", "Small intestine", "Pelvic reproductive organs"],
  },
  {
    id: "left-iliac",
    name: "Left iliac region",
    position: "Lower left (patient's left)",
    description: "The inferior lateral region overlying the left iliac fossa.",
    typicalContents: ["Sigmoid colon", "Lower descending colon", "Small intestine"],
  },
];

export const ACADEMY_SECTIONS: Array<{
  id: AcademySection;
  label: string;
  description: string;
}> = [
  { id: "home", label: "Home", description: "Learning overview" },
  { id: "learn", label: "Learn", description: "Reviewed modules" },
  { id: "explore", label: "Atlas", description: "Interactive anatomy" },
  { id: "practice", label: "Practice", description: "Educational cases" },
  { id: "assess", label: "Assess", description: "Knowledge checks" },
  { id: "research", label: "Sources", description: "Evidence registry" },
  { id: "certify", label: "Progress", description: "Completion records" },
];

export const ANATOMY_SYSTEMS: AnatomySystem[] = [
  {
    id: "cardiovascular",
    name: "Cardiovascular system",
    shortName: "Heart",
    accent: "#e11d48",
    lightAccent: "#fff1f2",
    overview:
      "The cardiovascular system comprises the heart and blood vessels. The four cardiac chambers and one-way valves maintain pulmonary and systemic circulation.",
    structures: [
      "Right and left atria",
      "Right and left ventricles",
      "Tricuspid, pulmonary, mitral and aortic valves",
      "Coronary arteries and cardiac veins",
      "Aorta, venae cavae and pulmonary vessels",
    ],
    functions: [
      "Generate pressure for pulmonary and systemic blood flow",
      "Deliver oxygen and nutrients to tissues",
      "Return carbon dioxide and metabolic products for removal",
    ],
    clinicalConnections: [
      "Valve anatomy and murmurs",
      "Coronary circulation and myocardial ischemia",
      "Conduction pathways and electrocardiography",
    ],
    reference: {
      title: "19.1 Heart Anatomy — Anatomy and Physiology 2e",
      publisher: "OpenStax, Rice University",
      url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy",
      evidenceType: "Open textbook",
      reviewedOn: "2026-08-19",
    },
  },
  {
    id: "nervous",
    name: "Nervous system",
    shortName: "Brain & nerves",
    accent: "#7c3aed",
    lightAccent: "#f5f3ff",
    overview:
      "The nervous system integrates sensory information and coordinates motor, cognitive and autonomic responses through central and peripheral structures.",
    structures: [
      "Cerebrum and cerebral cortex",
      "Diencephalon",
      "Brain stem and cerebellum",
      "Spinal cord",
      "Peripheral nerves and ganglia",
    ],
    functions: [
      "Receive sensory information",
      "Integrate information and generate responses",
      "Coordinate voluntary, reflex and autonomic activity",
    ],
    clinicalConnections: [
      "Localization of neurological findings",
      "Cranial nerve examination",
      "Motor, sensory and autonomic pathways",
    ],
    reference: {
      title: "13.2 The Central Nervous System — Anatomy and Physiology 2e",
      publisher: "OpenStax, Rice University",
      url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system",
      evidenceType: "Open textbook",
      reviewedOn: "2026-08-19",
    },
  },
  {
    id: "respiratory",
    name: "Respiratory system",
    shortName: "Lungs",
    accent: "#0284c7",
    lightAccent: "#f0f9ff",
    overview:
      "The respiratory system conducts air to the lungs and exchanges oxygen and carbon dioxide across the respiratory membrane.",
    structures: [
      "Nasal cavity, pharynx and larynx",
      "Trachea and main bronchi",
      "Bronchioles and alveoli",
      "Right and left lungs",
      "Pleura and diaphragm",
    ],
    functions: [
      "Conduct and condition inspired air",
      "Exchange gases between alveoli and pulmonary capillaries",
      "Support acid-base regulation and phonation",
    ],
    clinicalConnections: [
      "Airway obstruction and spirometry",
      "Alveolar disease and impaired gas exchange",
      "Pleural anatomy and respiratory examination",
    ],
    reference: {
      title: "22.2 The Lungs — Anatomy and Physiology 2e",
      publisher: "OpenStax, Rice University",
      url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs",
      evidenceType: "Open textbook",
      reviewedOn: "2026-08-19",
    },
  },
  {
    id: "renal",
    name: "Urinary and renal system",
    shortName: "Kidneys",
    accent: "#0f766e",
    lightAccent: "#f0fdfa",
    overview:
      "The kidneys filter blood and regulate fluid, electrolyte and acid-base balance. Urine passes through the ureters to the urinary bladder.",
    structures: [
      "Renal cortex and medulla",
      "Renal pyramids, calyces and pelvis",
      "Glomerulus and Bowman's capsule",
      "Renal tubules and collecting ducts",
      "Ureters and urinary bladder",
    ],
    functions: [
      "Filter plasma and excrete selected waste products",
      "Regulate water, electrolytes and acid-base status",
      "Participate in blood-pressure and red-cell regulation",
    ],
    clinicalConnections: [
      "Glomerular filtration and eGFR",
      "Urinalysis and nephron localization",
      "Obstruction along the urinary tract",
    ],
    reference: {
      title: "25.3 Gross Anatomy of the Kidney — Anatomy and Physiology 2e",
      publisher: "OpenStax, Rice University",
      url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney",
      evidenceType: "Open textbook",
      reviewedOn: "2026-08-19",
    },
  },
  {
    id: "digestive",
    name: "Digestive system",
    shortName: "Digestive tract",
    accent: "#b45309",
    lightAccent: "#fffbeb",
    overview:
      "The digestive system mechanically and chemically processes food, absorbs nutrients and water, and eliminates indigestible material.",
    structures: [
      "Oral cavity, pharynx and esophagus",
      "Stomach",
      "Small and large intestines",
      "Liver and gallbladder",
      "Pancreas",
    ],
    functions: [
      "Ingest and propel food",
      "Digest macromolecules and absorb nutrients",
      "Process nutrients and eliminate solid waste",
    ],
    clinicalConnections: [
      "Anatomical localization of abdominal symptoms",
      "Hepatobiliary and pancreatic pathways",
      "Mucosal absorption and intestinal motility",
    ],
    reference: {
      title: "23.2 Digestive System Processes and Regulation",
      publisher: "OpenStax, Rice University",
      url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation",
      evidenceType: "Open textbook",
      reviewedOn: "2026-08-19",
    },
  },
  {
    id: "skeletal",
    name: "Skeletal system",
    shortName: "Skeleton",
    accent: "#64748b",
    lightAccent: "#f8fafc",
    overview: "The skeletal system provides support and protection, acts as a framework for movement, stores minerals, and contains marrow involved in blood-cell production.",
    structures: ["Axial skeleton", "Appendicular skeleton", "Joints", "Cartilage", "Bone marrow"],
    functions: ["Support and protect organs", "Provide levers for movement", "Store minerals and support haematopoiesis"],
    clinicalConnections: ["Fracture localization", "Joint alignment and movement", "Bone density and marrow function"],
    reference: { title: "7.1 Divisions of the Skeletal System — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/7-1-divisions-of-the-skeletal-system", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "muscular",
    name: "Muscular system",
    shortName: "Muscles",
    accent: "#dc2626",
    lightAccent: "#fef2f2",
    overview: "Skeletal muscles generate voluntary movement and maintain posture, while smooth and cardiac muscle support organ and circulatory function.",
    structures: ["Skeletal muscles", "Tendons and aponeuroses", "Fascial compartments", "Smooth muscle", "Cardiac muscle"],
    functions: ["Generate movement", "Maintain posture and joint stability", "Produce heat"],
    clinicalConnections: ["Muscle groups and actions", "Tendon injury", "Motor-unit and neuromuscular assessment"],
    reference: { title: "10.2 Skeletal Muscle — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/10-2-skeletal-muscle", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "endocrine",
    name: "Endocrine system",
    shortName: "Endocrine",
    accent: "#d97706",
    lightAccent: "#fffbeb",
    overview: "The endocrine system uses hormones released into the circulation to coordinate metabolism, growth, reproduction, stress responses, and internal homeostasis.",
    structures: ["Hypothalamus and pituitary", "Thyroid and parathyroids", "Adrenal glands", "Endocrine pancreas", "Gonads and pineal gland"],
    functions: ["Coordinate long-range chemical signalling", "Regulate metabolism and growth", "Support reproduction and stress adaptation"],
    clinicalConnections: ["Hormone feedback loops", "Thyroid and adrenal axes", "Glucose regulation"],
    reference: { title: "17.1 An Overview of the Endocrine System — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/17-1-an-overview-of-the-endocrine-system", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "lymphatic",
    name: "Lymphatic and immune system",
    shortName: "Lymphatic",
    accent: "#16a34a",
    lightAccent: "#f0fdf4",
    overview: "The lymphatic system returns interstitial fluid to the circulation, transports absorbed lipids, and provides organs and pathways for immune surveillance.",
    structures: ["Lymphatic vessels", "Lymph nodes", "Spleen", "Thymus", "Tonsils and mucosa-associated lymphoid tissue"],
    functions: ["Return tissue fluid to blood", "Transport dietary lipids", "Support immune surveillance and lymphocyte activity"],
    clinicalConnections: ["Lymph-node drainage", "Oedema and impaired lymph flow", "Spleen and thymus function"],
    reference: { title: "21.1 Anatomy of the Lymphatic and Immune Systems — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/21-1-anatomy-of-the-lymphatic-and-immune-systems", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "reproductive",
    name: "Reproductive system",
    shortName: "Reproductive",
    accent: "#db2777",
    lightAccent: "#fdf2f8",
    overview: "The reproductive system produces gametes and sex hormones and includes sex-specific internal and external structures involved in reproduction.",
    structures: ["Gonads", "Reproductive ducts", "Accessory glands", "External genitalia", "Uterus and associated structures"],
    functions: ["Produce gametes", "Secrete reproductive hormones", "Support fertilization, gestation, or gamete delivery"],
    clinicalConnections: ["Pelvic anatomy", "Gonadal and duct anatomy", "Reproductive endocrine regulation"],
    reference: { title: "27.1 Anatomy and Physiology of the Male Reproductive System — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/27-1-anatomy-and-physiology-of-the-male-reproductive-system", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "integumentary",
    name: "Integumentary system",
    shortName: "Skin",
    accent: "#c2410c",
    lightAccent: "#fff7ed",
    overview: "The integumentary system forms the body's external barrier through skin and its appendages, contributing to protection, sensation, temperature control, and vitamin D synthesis.",
    structures: ["Epidermis", "Dermis", "Subcutaneous tissue", "Hair and nails", "Sweat and sebaceous glands"],
    functions: ["Provide a protective barrier", "Support sensation and thermoregulation", "Contribute to vitamin D synthesis"],
    clinicalConnections: ["Skin layers and wound depth", "Burn surface assessment", "Cutaneous glands and appendages"],
    reference: { title: "5.1 Layers of the Skin — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/5-1-layers-of-the-skin", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
  {
    id: "sensory",
    name: "Special sensory system",
    shortName: "Sense organs",
    accent: "#2563eb",
    lightAccent: "#eff6ff",
    overview: "Specialized sensory organs transduce light, sound, head movement, taste, and smell into neural signals interpreted by the central nervous system.",
    structures: ["Eye and retina", "External, middle, and inner ear", "Vestibular apparatus", "Olfactory epithelium", "Taste buds"],
    functions: ["Transduce specialized stimuli", "Support vision and hearing", "Maintain balance and spatial orientation"],
    clinicalConnections: ["Visual pathways", "Hearing and vestibular anatomy", "Cranial-nerve sensory pathways"],
    reference: { title: "14.1 Sensory Perception — Anatomy and Physiology 2e", publisher: "OpenStax, Rice University", url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception", evidenceType: "Open textbook", reviewedOn: "2026-08-19" },
  },
];

export const PRACTICE_CASES = [
  {
    id: "cardiac-flow",
    systemId: "cardiovascular" as const,
    title: "Trace cardiac blood flow",
    level: "Foundation",
    prompt:
      "Trace blood from the venae cavae through the heart and lungs until it reaches the aorta. Name each chamber and valve in order.",
    objective: "Relate chamber and valve anatomy to pulmonary and systemic circulation.",
  },
  {
    id: "nephron-map",
    systemId: "renal" as const,
    title: "Map the nephron",
    level: "Intermediate",
    prompt:
      "Starting at the afferent arteriole, map the filtration and tubular pathway to the collecting duct. Identify where blood and filtrate diverge.",
    objective: "Distinguish renal vascular anatomy from the tubular system.",
  },
  {
    id: "gas-exchange",
    systemId: "respiratory" as const,
    title: "Localize gas exchange",
    level: "Foundation",
    prompt:
      "Follow inspired air from the nasal cavity to the alveoli, then identify the tissue boundary across which gases diffuse.",
    objective: "Differentiate conducting and respiratory zones.",
  },
];

export const ASSESSMENT_QUESTIONS = [
  {
    id: "heart-chamber",
    systemId: "cardiovascular" as const,
    question: "Which chamber ejects blood into the systemic circulation?",
    options: ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"],
    answer: 3,
    rationale: "The left ventricle ejects blood through the aortic valve into the aorta.",
    sourceUrl:
      "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy",
  },
  {
    id: "renal-unit",
    systemId: "renal" as const,
    question: "What is the functional unit of the kidney?",
    options: ["Renal pelvis", "Nephron", "Ureter", "Calyx"],
    answer: 1,
    rationale: "The nephron contains the renal corpuscle and tubular components that process filtrate.",
    sourceUrl:
      "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney",
  },
  {
    id: "resp-zone",
    systemId: "respiratory" as const,
    question: "Where does pulmonary gas exchange principally occur?",
    options: ["Trachea", "Main bronchi", "Alveoli", "Pleural cavity"],
    answer: 2,
    rationale: "Alveoli form the respiratory surface adjacent to pulmonary capillaries.",
    sourceUrl:
      "https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs",
  },
  {
    id: "central-nervous-system",
    systemId: "nervous" as const,
    question: "Which structures form the central nervous system?",
    options: ["Brain and spinal cord", "Cranial nerves only", "Spinal nerves and ganglia", "Brain and skeletal muscle"],
    answer: 0,
    rationale: "The central nervous system consists of the brain and spinal cord; nerves and ganglia belong to the peripheral nervous system.",
    sourceUrl:
      "https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system",
  },
  {
    id: "nutrient-absorption",
    systemId: "digestive" as const,
    question: "Where does most chemical digestion and nutrient absorption occur?",
    options: ["Esophagus", "Stomach", "Small intestine", "Large intestine"],
    answer: 2,
    rationale: "The small intestine is the principal site of chemical digestion and nutrient absorption.",
    sourceUrl:
      "https://openstax.org/books/anatomy-and-physiology-2e/pages/23-2-digestive-system-processes-and-regulation",
  },
];

export function getAnatomySystem(id: AnatomySystemId): AnatomySystem {
  return ANATOMY_SYSTEMS.find((system) => system.id === id) ?? ANATOMY_SYSTEMS[0];
}
