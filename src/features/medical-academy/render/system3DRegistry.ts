/**
 * OSTM™ Interactive Human Anatomy Atlas — 12-System Modular 3D Registry
 * Maps System -> Asset Collections -> Structures -> Mesh Nodes -> Knowledge Graph IDs.
 */

import { AnatomySystemId } from "../data/medicalAcademyData";

export interface AnatomicalStructureDefinition {
  id: string;
  name: string;
  aliases: string[];
  meshNodeNames: string[];
  icon: string;
  description: string;
  focusHint: string;
  knowledgeGraphId: string;
  confidence: "verified" | "source-defined" | "metadata-mapped" | "unknown";
}

export interface AnatomicalAssetDefinition {
  id: string;
  name: string;
  filePath: string;
  source: string;
  sourceType: "imaging-derived" | "anatomically-modeled" | "anatomical-reference";
  structures: AnatomicalStructureDefinition[];
}

export interface SubOrganItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  focusHint: string;
}

export interface System3DConfig {
  id: AnatomySystemId;
  name: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  primaryAssetPath?: string;
  assets: AnatomicalAssetDefinition[];
  subOrgans: SubOrganItem[];
  overview: string;
  clinicalFocus: string;
}

export const SYSTEM_3D_REGISTRY: Record<AnatomySystemId, System3DConfig> = {
  digestive: {
    id: "digestive",
    name: "Digestive System & Gastrointestinal Tract",
    subtitle: "Nutrient Digestion, Hepatic Metabolism & Enteric Absorption",
    badge: "Metabolic Engine",
    accentColor: "#EA580C",
    primaryAssetPath: "/models/anatomy/digestive/stomach.glb",
    assets: [
      {
        id: "stomach_asset",
        name: "Stomach (Gaster)",
        filePath: "/models/anatomy/digestive/stomach.glb",
        source: "NIH 3D (3DPX-016666)",
        sourceType: "anatomically-modeled",
        structures: [
          {
            id: "stomach_fundus",
            name: "Gastric Fundus",
            aliases: ["fundus", "gastric dome"],
            meshNodeNames: ["Fundus"],
            icon: "🥣",
            description: "Superior dilated dome of the stomach trapping gas and accommodating initial food bolus expansion.",
            focusHint: "Left hypochondrium / Superior gastric pole",
            knowledgeGraphId: "kg_stomach_fundus",
            confidence: "verified",
          },
          {
            id: "stomach_body",
            name: "Gastric Body & Rugae",
            aliases: ["body", "corpus", "rugae"],
            meshNodeNames: ["Body", "LesserCurvature", "GreaterCurvature"],
            icon: "🫕",
            description: "Central gastric reservoir lined with thick rugal folds containing parietal cells (HCl, IF) and chief cells (pepsinogen).",
            focusHint: "Epigastric region / Main gastric body",
            knowledgeGraphId: "kg_stomach_body",
            confidence: "verified",
          },
          {
            id: "stomach_pylorus",
            name: "Pyloric Antrum & Canal",
            aliases: ["pylorus", "antrum", "pyloric sphincter"],
            meshNodeNames: ["Pylorus"],
            icon: "🚪",
            description: "Thick muscular valve gating chyme transit from stomach into the duodenal bulb.",
            focusHint: "Transpyloric plane (L1) / Right epigastrium",
            knowledgeGraphId: "kg_stomach_pylorus",
            confidence: "verified",
          },
        ],
      },
      {
        id: "liver_asset",
        name: "Liver & Biliary System",
        filePath: "/models/anatomy/digestive/liver_gallbladder.glb",
        source: "Human Reference Atlas / HuBMAP",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "liver_hepatic",
            name: "Hepatic Lobes & Parenchyma",
            aliases: ["liver", "hepatic lobe", "hepatocytes"],
            meshNodeNames: ["RightLobe", "LeftLobe"],
            icon: "🥩",
            description: "Largest internal metabolic organ performing bile synthesis, glycogen storage, drug biotransformation, and albumin synthesis.",
            focusHint: "Right hypochondrium & epigastrium",
            knowledgeGraphId: "kg_liver",
            confidence: "verified",
          },
          {
            id: "gallbladder",
            name: "Gallbladder & Cystic Duct",
            aliases: ["gallbladder", "cholecyst"],
            meshNodeNames: ["Gallbladder"],
            icon: "🍐",
            description: "Concentrates and stores hepatic bile, releasing it post-prandially via CCK stimulation into the duodenum.",
            focusHint: "Inferior visceral surface of right liver lobe",
            knowledgeGraphId: "kg_gallbladder",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "stomach_fundus",
        name: "Gastric Fundus",
        icon: "🥣",
        description: "Superior anatomical dome of stomach beneath the left hemidiaphragm.",
        focusHint: "Left hypochondrium",
      },
      {
        id: "stomach_body",
        name: "Gastric Body & Rugae",
        icon: "🫕",
        description: "Acid and intrinsic factor secretion by parietal cells; pepsinogen digestion.",
        focusHint: "Epigastric zone",
      },
      {
        id: "stomach_pylorus",
        name: "Pyloric Sphincter",
        icon: "🚪",
        description: "Regulated gastroduodenal outflow valve.",
        focusHint: "Transpyloric plane L1",
      },
      {
        id: "liver_hepatic",
        name: "Hepatic Lobules & Liver",
        icon: "🥩",
        description: "Metabolic detoxification, phase I/II CYP pathways, and bile synthesis.",
        focusHint: "Right upper quadrant",
      },
      {
        id: "gallbladder",
        name: "Gallbladder",
        icon: "🍐",
        description: "Bile storage, cholesterol emulsification, and biliary drainage.",
        focusHint: "Under right hepatic lobe",
      },
    ],
    overview: "Continuous alimentary canal and accessory glandular organs orchestrating mechanical breakdown, enzymatic hydrolysis, hepatic assimilation, and nutrient absorption.",
    clinicalFocus: "Peptic ulcer disease, GERD, gastroparesis, non-alcoholic fatty liver (NAFLD), cholelithiasis, and malabsorption syndromes.",
  },

  cardiovascular: {
    id: "cardiovascular",
    name: "Cardiovascular System & Hemodynamics",
    subtitle: "Pulsatile 4-Chamber Heart & Coronary Network",
    badge: "Vital Pump",
    accentColor: "#E11D48",
    primaryAssetPath: "/models/anatomy/cardiovascular/heart_great_vessels.glb",
    assets: [
      {
        id: "heart_asset",
        name: "Heart with Great Vessels",
        filePath: "/models/anatomy/cardiovascular/heart_great_vessels.glb",
        source: "NIH 3D / NHLBI (3DPX-023212)",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "left_ventricle",
            name: "Left Ventricle & Myocardium",
            aliases: ["left ventricle", "apex", "myocardium"],
            meshNodeNames: ["LeftVentricle"],
            icon: "❤️",
            description: "High-pressure muscular pump ejecting oxygenated blood into systemic arterial circulation.",
            focusHint: "Anterior-inferior apex / 5th left intercostal space",
            knowledgeGraphId: "kg_cardio_lv",
            confidence: "verified",
          },
          {
            id: "aorta_arch",
            name: "Aortic Arch & Branches",
            aliases: ["aorta", "aortic arch"],
            meshNodeNames: ["AorticArch"],
            icon: "🫀",
            description: "Main systemic arterial conduit giving rise to brachiocephalic, left carotid, and left subclavian trunks.",
            focusHint: "Superior mediastinum / T4 level",
            knowledgeGraphId: "kg_cardio_aorta",
            confidence: "verified",
          },
          {
            id: "coronary_arteries",
            name: "Coronary Arterial Tree",
            aliases: ["coronary", "lad", "rca"],
            meshNodeNames: ["LAD_Coronary"],
            icon: "🩸",
            description: "Left and right coronary arteries perfusing the beating myocardium with oxygenated blood.",
            focusHint: "Coronary and anterior interventricular sulci",
            knowledgeGraphId: "kg_cardio_coronary",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "left_ventricle",
        name: "Left Ventricle & Myocardium",
        icon: "❤️",
        description: "High-pressure muscular chamber generating systemic systolic blood pressure.",
        focusHint: "Anterior-inferior apex",
      },
      {
        id: "aorta_arch",
        name: "Aorta & Great Vessels",
        icon: "🫀",
        description: "Ascending aorta, aortic arch, and brachiocephalic/carotid trunks.",
        focusHint: "Superior mediastinum",
      },
      {
        id: "coronary_arteries",
        name: "Coronary Vasculature",
        icon: "🩸",
        description: "Left anterior descending and right coronary arterial perfusion network.",
        focusHint: "Interventricular sulcus",
      },
    ],
    overview: "Closed high-pressure systemic and low-pressure pulmonary circuit driven by rhythmic electromechanical myocardial contractions.",
    clinicalFocus: "Ischemic heart disease, coronary artery disease, heart failure with preserved/reduced ejection fraction, and valvular stenosis.",
  },

  renal: {
    id: "renal",
    name: "Renal & Urinary Excretory System",
    subtitle: "Glomerular Ultrafiltration, Acid-Base & Fluid Homeostasis",
    badge: "Master Filter",
    accentColor: "#0284C7",
    primaryAssetPath: "/models/anatomy/renal/kidneys_urinary.glb",
    assets: [
      {
        id: "renal_asset",
        name: "Bilateral Kidneys & Bladder",
        filePath: "/models/anatomy/renal/kidneys_urinary.glb",
        source: "Human Reference Atlas / HuBMAP",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "renal_cortex",
            name: "Renal Cortex & Glomeruli",
            aliases: ["kidney", "renal cortex", "glomeruli"],
            meshNodeNames: ["Kidney_L", "Kidney_R"],
            icon: "🫘",
            description: "Outer renal parenchyma containing ~1 million nephrons filtering 180 L of plasma daily.",
            focusHint: "T12-L3 vertebral levels, retroperitoneal space",
            knowledgeGraphId: "kg_renal_cortex",
            confidence: "verified",
          },
          {
            id: "ureters",
            name: "Peristaltic Ureters",
            aliases: ["ureter", "renal pelvis"],
            meshNodeNames: ["Ureters"],
            icon: "💧",
            description: "Muscular conduits propelling urine via smooth muscle peristalsis into the bladder.",
            focusHint: "Descending retroperitoneal conduits",
            knowledgeGraphId: "kg_renal_ureters",
            confidence: "verified",
          },
          {
            id: "urinary_bladder",
            name: "Detrusor Urinary Bladder",
            aliases: ["bladder", "detrusor"],
            meshNodeNames: ["Bladder"],
            icon: "🎈",
            description: "Distensible muscular reservoir storing urine until controlled micturition.",
            focusHint: "True pelvis / Retro-pubic space",
            knowledgeGraphId: "kg_renal_bladder",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "renal_cortex",
        name: "Renal Cortex & Glomeruli",
        icon: "🫘",
        description: "Nephron glomerular filtration and blood pressure osmoregulation.",
        focusHint: "Retroperitoneal flanks",
      },
      {
        id: "ureters",
        name: "Renal Pelvis & Ureters",
        icon: "💧",
        description: "Peristaltic conduits draining into pelvic reservoir.",
        focusHint: "Lumbar descending pathway",
      },
      {
        id: "urinary_bladder",
        name: "Detrusor Urinary Bladder",
        icon: "🎈",
        description: "Compliant reservoir and micturition sphincter mechanism.",
        focusHint: "Pelvic cavity",
      },
    ],
    overview: "Precision filtration and osmoregulatory system clearing nitrogenous metabolic wastes, balancing electrolytes, and secreting erythropoietin and renin.",
    clinicalFocus: "Chronic kidney disease (CKD), glomerulonephritis, nephrolithiasis, and diabetic nephropathy.",
  },

  nervous: {
    id: "nervous",
    name: "Nervous System & Neural Circuits",
    subtitle: "Cerebral Cortex, Synaptic Signaling & Central Integration",
    badge: "Command Matrix",
    accentColor: "#8B5CF6",
    primaryAssetPath: "/models/anatomy/nervous/brain_brainstem.glb",
    assets: [
      {
        id: "brain_asset",
        name: "Brain & Brainstem",
        filePath: "/models/anatomy/nervous/brain_brainstem.glb",
        source: "OpenAnatomy / SPL Harvard (SPL-BRAIN-001)",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "cerebral_cortex",
            name: "Cerebral Cortex & Hemispheres",
            aliases: ["cerebrum", "cortex", "gyri"],
            meshNodeNames: ["Cerebrum", "Cerebrum_R"],
            icon: "🧠",
            description: "Higher executive function, sensory integration, motor planning, and memory storage.",
            focusHint: "Cranial vault",
            knowledgeGraphId: "kg_nervous_cortex",
            confidence: "verified",
          },
          {
            id: "cerebellum",
            name: "Cerebellar Folia",
            aliases: ["cerebellum"],
            meshNodeNames: ["Cerebellum"],
            icon: "🌿",
            description: "Motor coordination, balance, procedural learning, and precision timing.",
            focusHint: "Posterior cranial fossa",
            knowledgeGraphId: "kg_nervous_cerebellum",
            confidence: "verified",
          },
          {
            id: "brainstem",
            name: "Brainstem (Pons & Medulla)",
            aliases: ["brainstem", "medulla", "pons"],
            meshNodeNames: ["Brainstem"],
            icon: "⚡",
            description: "Autonomic control centers for respiration, cardiac rhythm, vasomotor tone, and cranial nerve nuclei.",
            focusHint: "Foramen magnum / Cranial base",
            knowledgeGraphId: "kg_nervous_brainstem",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "cerebral_cortex",
        name: "Cerebral Cortex & Hemispheres",
        icon: "🧠",
        description: "Bilateral cerebral neocortex with frontal, parietal, temporal, and occipital lobes.",
        focusHint: "Cranial cavity",
      },
      {
        id: "cerebellum",
        name: "Cerebellum & Motor Tuning",
        icon: "🌿",
        description: "Fine motor control, equilibrium, and rapid proprioceptive modulation.",
        focusHint: "Infratentorial compartment",
      },
      {
        id: "brainstem",
        name: "Brainstem & Autonomics",
        icon: "⚡",
        description: "Vital cardiac/respiratory centers and ascending/descending tracts.",
        focusHint: "Base of skull",
      },
    ],
    overview: "Electro-chemical biological computational matrix integrating sensory inputs, voluntary motor outputs, and autonomic homeostatic reflexes.",
    clinicalFocus: "Neurodegenerative disorders, stroke, peripheral neuropathies, migraine, and autonomic dysautonomia.",
  },

  respiratory: {
    id: "respiratory",
    name: "Respiratory System & Gas Exchange",
    subtitle: "Pulmonary Ventilation, Alveolar Diffusion & Acid-Base Balance",
    badge: "Oxygen Gateway",
    accentColor: "#06B6D4",
    primaryAssetPath: "/models/anatomy/respiratory/lungs_airways.glb",
    assets: [
      {
        id: "lungs_asset",
        name: "Lungs & Tracheobronchial Tree",
        filePath: "/models/anatomy/respiratory/lungs_airways.glb",
        source: "NIH 3D / NIAID (3DPX-017420)",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "lung_parenchyma",
            name: "Pulmonary Parenchyma & Lobes",
            aliases: ["lungs", "alveoli"],
            meshNodeNames: ["RightLung", "LeftLung"],
            icon: "🫁",
            description: "Bilateral elastic organs with 3 right lobes and 2 left lobes providing 100 m² of alveolar gas exchange surface.",
            focusHint: "Thoracic pleural cavities",
            knowledgeGraphId: "kg_resp_lungs",
            confidence: "verified",
          },
          {
            id: "trachea_bronchi",
            name: "Trachea & Primary Bronchi",
            aliases: ["trachea", "bronchi"],
            meshNodeNames: ["Trachea"],
            icon: "🌬️",
            description: "Cartilaginous airway conducting humidified, filtered air into the alveolar tree.",
            focusHint: "Anterior mediastinum",
            knowledgeGraphId: "kg_resp_trachea",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "lung_parenchyma",
        name: "Lung Parenchyma & Lobes",
        icon: "🫁",
        description: "Alveolar capillary gas diffusion membrane.",
        focusHint: "Thoracic cavity",
      },
      {
        id: "trachea_bronchi",
        name: "Trachea & Airways",
        icon: "🌬️",
        description: "Cartilaginous conducting airway with ciliated mucociliary escalator.",
        focusHint: "Superior mediastinum",
      },
    ],
    overview: "Conducting airways and compliant alveolar parenchyma facilitating oxygen uptake and carbon dioxide elimination.",
    clinicalFocus: "Asthma, COPD, pneumonia, pulmonary fibrosis, and acute respiratory distress syndrome.",
  },

  skeletal: {
    id: "skeletal",
    name: "Skeletal System & Structural Framework",
    subtitle: "Osteology, Axial-Appendicular Biomechanics & Mineral Depot",
    badge: "Structural Matrix",
    accentColor: "#64748B",
    primaryAssetPath: "/models/anatomy/skeletal/human_skeleton.glb",
    assets: [
      {
        id: "skeleton_asset",
        name: "Human Skeleton Reference",
        filePath: "/models/anatomy/skeletal/human_skeleton.glb",
        source: "NIH 3D / NLM (3DPX-010214)",
        sourceType: "imaging-derived",
        structures: [
          {
            id: "cranium",
            name: "Cranium & Facial Skeleton",
            aliases: ["skull", "cranium"],
            meshNodeNames: ["Skull"],
            icon: "💀",
            description: "Rigid bony casing protecting the cerebrum, sensory organs, and facial masticatory apparatus.",
            focusHint: "Head & cephalic region",
            knowledgeGraphId: "kg_skel_skull",
            confidence: "verified",
          },
          {
            id: "spine_vertebrae",
            name: "Vertebral Column & Discs",
            aliases: ["spine", "vertebrae"],
            meshNodeNames: ["Spine"],
            icon: "🦴",
            description: "Segmented axial column providing weight-bearing structural support and spinal cord protection.",
            focusHint: "Posterior midline dorsal axis",
            knowledgeGraphId: "kg_skel_spine",
            confidence: "verified",
          },
          {
            id: "ribcage_thorax",
            name: "Thoracic Ribcage & Sternum",
            aliases: ["ribcage", "ribs", "sternum"],
            meshNodeNames: ["Ribcage"],
            icon: "🛡️",
            description: "Protective osseocartilaginous cage sheltering heart and lungs while expanding during inspiration.",
            focusHint: "Thoracic cage",
            knowledgeGraphId: "kg_skel_ribs",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "cranium",
        name: "Cranium & Skull",
        icon: "💀",
        description: "Neurocranium and viscerocranium protecting brain and sensory receptors.",
        focusHint: "Cephalic axis",
      },
      {
        id: "spine_vertebrae",
        name: "Vertebral Column",
        icon: "🦴",
        description: "Cervical, thoracic, lumbar, sacral and coccygeal spine segments.",
        focusHint: "Axial skeleton",
      },
      {
        id: "ribcage_thorax",
        name: "Thoracic Ribcage",
        icon: "🛡️",
        description: "12 pairs of ribs, costal cartilage, and sternum.",
        focusHint: "Chest cage",
      },
    ],
    overview: "Rigid mineralized osseous framework supporting soft tissues, shielding vital viscera, and anchoring musculoskeletal levers.",
    clinicalFocus: "Osteoporosis, osteoarthritis, fractures, spondylolisthesis, and scoliosis.",
  },

  endocrine: {
    id: "endocrine",
    name: "Endocrine System & Hormonal Axis",
    subtitle: "Hypothalamic-Pituitary-Thyroid-Adrenal Axis",
    badge: "Hormonal Regulators",
    accentColor: "#EAB308",
    primaryAssetPath: "/models/anatomy/endocrine/thyroid_glands.glb",
    assets: [
      {
        id: "thyroid_asset",
        name: "Thyroid & Parathyroid Glands",
        filePath: "/models/anatomy/endocrine/thyroid_glands.glb",
        source: "Human Reference Atlas / HuBMAP",
        sourceType: "anatomically-modeled",
        structures: [
          {
            id: "thyroid",
            name: "Thyroid Lobes & Isthmus",
            aliases: ["thyroid", "isthmus"],
            meshNodeNames: ["Thyroid", "Thyroid_R"],
            icon: "🦋",
            description: "Bi-lobed endocrine gland synthesizing thyroxine (T4) and triiodothyronine (T3) to regulate cellular metabolic rate.",
            focusHint: "Anterior neck / C5-T1",
            knowledgeGraphId: "kg_endo_thyroid",
            confidence: "verified",
          },
          {
            id: "parathyroids",
            name: "Parathyroid Glands",
            aliases: ["parathyroid"],
            meshNodeNames: ["Parathyroids"],
            icon: "✨",
            description: "Four lentiform posterior glands secreting parathyroid hormone (PTH) to govern serum calcium balance.",
            focusHint: "Posterior thyroid capsule",
            knowledgeGraphId: "kg_endo_parathyroid",
            confidence: "verified",
          },
        ],
      },
    ],
    subOrgans: [
      {
        id: "thyroid",
        name: "Thyroid & Parathyroids",
        icon: "🦋",
        description: "Basal metabolic rate regulation and calcium homeostasis.",
        focusHint: "Anterior cervical triangle",
      },
    ],
    overview: "Ductless endocrine glandular network coordinating hormonal signal cascades across systemic target receptors.",
    clinicalFocus: "Thyroid nodules, Hashimoto's, Graves' disease, hyperparathyroidism, and adrenal insufficiency.",
  },

  // Supporting 5 systems registered in the modular architecture
  muscular: {
    id: "muscular",
    name: "Muscular System & Biomechanics",
    subtitle: "Skeletal Muscle Fascicles, Tendons & Motor Units",
    badge: "Kinetic Drive",
    accentColor: "#EF4444",
    assets: [],
    subOrgans: [
      { id: "skeletal_muscle", name: "Skeletal Muscle Groups", icon: "💪", description: "Striated contractile motor units generating voluntary locomotion.", focusHint: "Anterior/Posterior body" },
      { id: "tendons_fascia", name: "Tendons & Deep Fascia", icon: "🔗", description: "Dense collagenous aponeuroses transmitting mechanical muscle tension to bone.", focusHint: "Joint insertions" },
    ],
    overview: "Contractile muscular apparatus generating kinetic locomotion, postural stability, and heat production.",
    clinicalFocus: "Myopathies, fibromyalgia, sarcopenia, tendinopathies, and myasthenia gravis.",
  },

  lymphatic: {
    id: "lymphatic",
    name: "Lymphatic & Immune Defense System",
    subtitle: "Lymph Nodes, Splenic White Pulp & Interstitial Drainage",
    badge: "Immune Sentinel",
    accentColor: "#10B981",
    assets: [],
    subOrgans: [
      { id: "spleen_lymph", name: "Spleen & Lymphoid Pulp", icon: "🛡️", description: "Secondary lymphoid organ filtering blood-borne antigens and senescent RBCs.", focusHint: "Left hypochondrium" },
      { id: "lymph_nodes", name: "Lymph Node Chains", icon: "🫧", description: "Encapsulated clusters presenting antigens to B/T lymphocytes.", focusHint: "Cervical, axillary, inguinal" },
    ],
    overview: "Vascular interstitial drainage network and immunologic surveillance apparatus defending against pathogens and cellular atypia.",
    clinicalFocus: "Lymphedema, lymphadenopathy, lymphoma, and autoimmune conditions.",
  },

  reproductive: {
    id: "reproductive",
    name: "Reproductive & Gonadal System",
    subtitle: "Gametogenesis, Gonadal Steroidogenesis & Uterine Physiology",
    badge: "Generative Axis",
    accentColor: "#EC4899",
    assets: [],
    subOrgans: [
      { id: "gonads", name: "Gonads (Ovaries / Testes)", icon: "🌸", description: "Gametogenesis and steroidogenesis (estrogen/progesterone/testosterone).", focusHint: "Pelvic / Scrotal cavity" },
      { id: "uterus_tract", name: "Uterine & Genital Pathway", icon: "👶", description: "Muscular reproductive organ with cyclical endometrial decidualization.", focusHint: "True pelvis" },
    ],
    overview: "Hormonally regulated gonadal and reproductive tract organs supporting gametogenesis, fertility, and embryonic gestation.",
    clinicalFocus: "PCOS, endometriosis, uterine fibroids, infertility, and gonadal hypogonadism.",
  },

  integumentary: {
    id: "integumentary",
    name: "Integumentary System & Skin Barrier",
    subtitle: "Stratified Epidermis, Dermis, Appendages & Tactile Receptors",
    badge: "Barrier Armor",
    accentColor: "#F97316",
    assets: [],
    subOrgans: [
      { id: "epidermis_dermis", name: "Epidermal-Dermal Barrier", icon: "🧴", description: "Keratinized stratified squamous epithelium preventing trans-epidermal water loss.", focusHint: "Cutaneous surface" },
      { id: "hair_sebaceous", name: "Pilosebaceous Units", icon: "💇", description: "Hair follicles with holocrine sebum secretion.", focusHint: "Dermal layer" },
    ],
    overview: "Primary protective cutaneous envelope regulating thermal homeostasis, sensation, and water retention.",
    clinicalFocus: "Atopic dermatitis, psoriasis, eczema, acne vulgaris, and melanoma.",
  },

  sensory: {
    id: "sensory",
    name: "Sensory Organs & Special Senses",
    subtitle: "Visual Retinal Cone/Rods, Auditory Cochlea & Olfactory Bulb",
    badge: "Perception Array",
    accentColor: "#3B82F6",
    assets: [],
    subOrgans: [
      { id: "eye_retina", name: "Ocular Globe & Retina", icon: "👁️", description: "Optical refracting apparatus and neural photoreceptor retina.", focusHint: "Bony orbit" },
      { id: "ear_cochlea", name: "Auditory Cochlea & Vestibule", icon: "👂", description: "Organ of Corti transducing acoustic vibrations into tonotopic neural impulses.", focusHint: "Petrous temporal bone" },
    ],
    overview: "Specialized sensory organs transducing photon wavelengths, acoustic frequencies, and chemical odorants into conscious perception.",
    clinicalFocus: "Glaucoma, macular degeneration, sensorineural hearing loss, vertigo, and tinnitus.",
  },
};
