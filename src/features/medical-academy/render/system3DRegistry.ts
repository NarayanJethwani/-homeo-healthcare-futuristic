/**
 * HoloHuman™ 3D Organ System Registry
 * Dedicated 3D models, sub-organ highlights, camera viewpoints, and shader profiles
 * for all 12 human anatomical systems.
 */

import { AnatomySystemId } from "../data/medicalAcademyData";

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
  modelUrl: string;
  subOrgans: SubOrganItem[];
  overview: string;
  clinicalFocus: string;
}

export const SYSTEM_3D_REGISTRY: Record<AnatomySystemId, System3DConfig> = {
  endocrine: {
    id: "endocrine",
    name: "Endocrine System & Hormonal Axis",
    subtitle: "Hypothalamic-Pituitary-Thyroid-Adrenal Network",
    badge: "Hormonal Regulators",
    accentColor: "#EAB308",
    // Dedicated 3D Endocrine / Glandular System Model
    modelUrl: "https://sketchfab.com/models/2e21b8b6e6f140689b703e2c33ebf7b4/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "pituitary",
        name: "Pituitary & Hypothalamus",
        icon: "🧠",
        description: "Master gland regulating growth hormone, TSH, ACTH, and gonadotropins (LH/FSH).",
        focusHint: "Sella turcica / Central cerebral base"
      },
      {
        id: "thyroid",
        name: "Thyroid & Parathyroids",
        icon: "🦋",
        description: "Regulates basal metabolic rate (T3/T4) and calcium/phosphate homeostasis (PTH & Calcitonin).",
        focusHint: "Anterior neck, inferior to thyroid cartilage"
      },
      {
        id: "adrenals",
        name: "Suprarenal Adrenal Glands",
        icon: "⚡",
        description: "Adrenal cortex secretes cortisol, aldosterone & DHEA; medulla secretes epinephrine & norepinephrine.",
        focusHint: "Superior poles of both kidneys"
      },
      {
        id: "pancreas_endocrine",
        name: "Islets of Langerhans (Pancreas)",
        icon: "🧪",
        description: "Alpha cells produce glucagon; Beta cells synthesize and secrete insulin to control blood glucose.",
        focusHint: "Retroperitoneal abdominal cavity, pancreatic tail/body"
      },
      {
        id: "pineal",
        name: "Pineal Gland",
        icon: "✨",
        description: "Synthesizes melatonin in response to light-dark cycles, orchestrating circadian rhythms.",
        focusHint: "Epithalamus, posterior to third ventricle"
      }
    ],
    overview: "Complex network of ductless glands that secrete hormones directly into the bloodstream to regulate metabolism, growth, stress response, and internal homeostasis.",
    clinicalFocus: "HPA axis dysregulation, Hashimoto's thyroiditis, adrenal burnout, Addison's, and metabolic syndrome."
  },

  cardiovascular: {
    id: "cardiovascular",
    name: "Cardiovascular System & Hemodynamics",
    subtitle: "Pulsatile 4-Chamber Heart & Coronary Network",
    badge: "Vital Pump",
    accentColor: "#E11D48",
    // Dedicated 3D Heart with coronary vasculature & chambers
    modelUrl: "https://sketchfab.com/models/02d53ea7f12e4f019a7102604d57c2fe/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "left_ventricle",
        name: "Left Ventricle & Myocardium",
        icon: "❤️",
        description: "High-pressure muscular chamber generating systemic systolic blood pressure and cardiac output.",
        focusHint: "Anterior-inferior apex of the cardiac silhouette"
      },
      {
        id: "aorta_valves",
        name: "Aorta & Coronary Arteries",
        icon: "🫀",
        description: "Ascending aorta and left/right coronary arterial tree delivering oxygenated blood to the myocardium.",
        focusHint: "Cardiac base & aortic root"
      },
      {
        id: "conduction_system",
        name: "SA/AV Nodes & Purkinje Fibers",
        icon: "⚡",
        description: "Intrinsic electrical conduction system initiating sinus rhythm and synchronized ventricular contractions.",
        focusHint: "Right atrial wall & interventricular septum"
      },
      {
        id: "atria_pulmonary",
        name: "Atria & Pulmonary Artery",
        icon: "🔄",
        description: "Receiving chambers and pulmonary trunk routing deoxygenated blood through the pulmonary capillary bed.",
        focusHint: "Superior cardiac base"
      }
    ],
    overview: "The central hemodynamic engine circulating 5 liters of blood per minute, delivering oxygen, nutrients, and immune cells to all bodily tissues.",
    clinicalFocus: "Coronary artery disease, angina pectoris, valvular stenosis, cardiac hypertrophy, and arrhythmias."
  },

  nervous: {
    id: "nervous",
    name: "Nervous System & Neural Pathways",
    subtitle: "Cerebral Cortex, Limbic System & Cranial Nerves",
    badge: "Master Processing Unit",
    accentColor: "#7C3AED",
    // Dedicated 3D Human Brain & Central Nervous System Model
    modelUrl: "https://sketchfab.com/models/38cf48c3b7a5449fb67ea9b119183427/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "cerebral_cortex",
        name: "Cerebral Hemispheres & Lobes",
        icon: "🧠",
        description: "Frontal, parietal, temporal, and occipital cortices governing executive function, motor control, memory, and perception.",
        focusHint: "Superior & lateral cranial vault"
      },
      {
        id: "cerebellum",
        name: "Cerebellum",
        icon: "⚖️",
        description: "Coordinates voluntary motor movements, posture, fine motor precision, and vestibular equilibrium.",
        focusHint: "Posterior cranial fossa, beneath occipital lobes"
      },
      {
        id: "brainstem",
        name: "Brainstem & Cranial Nerves",
        icon: "⚡",
        description: "Midbrain, pons, and medulla oblongata regulating vital respiratory, vasomotor, and cranial nerve reflexes.",
        focusHint: "Central base anterior to cerebellum"
      },
      {
        id: "spinal_cord",
        name: "Spinal Cord & Radicular Nerves",
        icon: "🧬",
        description: "Descending motor tracts (corticospinal) and ascending sensory tracts (spinothalamic) linking brain and body.",
        focusHint: "Vertebral canal"
      }
    ],
    overview: "High-speed electrochemical communication network consisting of 86 billion neurons orchestrating thought, reflex, autonomic regulation, and sensory perception.",
    clinicalFocus: "Neuralgia, migraine, demyelination, autonomic dystonia, neuropathies, and stroke recovery."
  },

  respiratory: {
    id: "respiratory",
    name: "Respiratory System & Gas Exchange",
    subtitle: "Tracheobronchial Tree & Alveolar-Capillary Bed",
    badge: "Vital Ventilation",
    accentColor: "#0284C7",
    // Dedicated 3D Lungs & Respiratory Tree
    modelUrl: "https://sketchfab.com/models/eb9ea2ea7e744111815fe5b2b2a60bf6/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "trachea_bronchi",
        name: "Trachea & Primary Bronchi",
        icon: "🫁",
        description: "Cartilaginous airway conducting humidified, filtered air into right and left lung lobes.",
        focusHint: "Mediastinum anterior to esophagus"
      },
      {
        id: "lung_parenchyma",
        name: "Right (3 Lobes) & Left (2 Lobes)",
        icon: "💨",
        description: "Elastic lung tissue accommodating expanding tidal volumes during diaphragmatic excursion.",
        focusHint: "Bilateral thoracic pleural cavities"
      },
      {
        id: "alveolar_bed",
        name: "Alveolar Sacs & Surfactant",
        icon: "🔬",
        description: "300 million micro-sacs providing 100m² of surface area for passive O2/CO2 diffusion across the capillary membrane.",
        focusHint: "Terminal respiratory bronchioles"
      },
      {
        id: "diaphragm",
        name: "Diaphragm & Intercostals",
        icon: "⛰️",
        description: "Primary respiratory muscle innervated by phrenic nerve (C3-C5), creating negative intrathoracic pressure.",
        focusHint: "Inferior thoracic aperture"
      }
    ],
    overview: "Exchanges oxygen and carbon dioxide between blood and atmospheric air, maintains acid-base pH balance, and filters inhaled particulates.",
    clinicalFocus: "Bronchial asthma, acute bronchitis, pneumonia, COPD, pleurisy, and hyperventilation syndrome."
  },

  renal: {
    id: "renal",
    name: "Renal & Urinary Excretory System",
    subtitle: "Glomerular Filtration & Osmoregulation",
    badge: "Fluid & Toxin Filtration",
    accentColor: "#0D9488",
    // Dedicated 3D Kidneys & Urinary Tract
    modelUrl: "https://sketchfab.com/models/0b1ba5ec3c1d4cf29b68a3fbfa251509/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "renal_cortex",
        name: "Renal Cortex & Glomeruli",
        icon: "🫘",
        description: "Site of ultrafiltration where blood is filtered at 125 mL/min across glomerular fenestrated capillaries.",
        focusHint: "Outer parenchyma of kidneys"
      },
      {
        id: "renal_medulla",
        name: "Medullary Pyramids & Loops of Henle",
        icon: "💧",
        description: "Countercurrent multiplier system establishing hyperosmolar interstitial gradient for water reabsorption.",
        focusHint: "Inner renal tissue"
      },
      {
        id: "ureters_pelvis",
        name: "Renal Pelvis & Ureters",
        icon: "🔄",
        description: "Peristaltic muscular tubes transporting filtered urine to the storage bladder.",
        focusHint: "Retroperitoneal lumbar region to pelvis"
      },
      {
        id: "urinary_bladder",
        name: "Detrusor Urinary Bladder",
        icon: "🎈",
        description: "Elastic reservoir holding 400-600 mL urine under parasympathetic micturition control.",
        focusHint: "Lesser pelvis behind pubic symphysis"
      }
    ],
    overview: "Filters 180 liters of plasma daily, maintains electrolyte balance (Na+, K+, HCO3-), regulates blood volume/pressure, and excretes metabolic wastes.",
    clinicalFocus: "Nephrolithiasis (kidney stones), cystitis, glomerulonephritis, CKD, and renal colic."
  },

  digestive: {
    id: "digestive",
    name: "Digestive System & Gastrointestinal Tract",
    subtitle: "Nutrient Digestion, Hepatic Metabolism & Absorption",
    badge: "Metabolic Core",
    accentColor: "#D97706",
    // Dedicated 3D Gastrointestinal Tract & Liver
    modelUrl: "https://sketchfab.com/models/cbbd8419616e4db99482701b22896da4/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "stomach",
        name: "Gastric Rugae & Acid Secretion",
        icon: "🥣",
        description: "Parietal cells secrete HCl (pH 1.5-2.0) and intrinsic factor; chief cells secrete pepsinogen.",
        focusHint: "Left upper quadrant / epigastrium"
      },
      {
        id: "liver_hepatic",
        name: "Hepatic Lobules & Bile Synthesis",
        icon: "🥩",
        description: "Central biochemical factory for detoxification, glycogen storage, protein synthesis, and bile acid production.",
        focusHint: "Right upper quadrant beneath diaphragm"
      },
      {
        id: "gallbladder_biliary",
        name: "Gallbladder & Cystic Duct",
        icon: "🟢",
        description: "Concentrates and stores bile, contracting in response to CCK during fatty meal ingestion.",
        focusHint: "Inferior visceral surface of liver"
      },
      {
        id: "intestines",
        name: "Small & Large Intestine (Microbiome)",
        icon: "🌀",
        description: "Duodenum, jejunum, ileum with villi for nutrient absorption, followed by colon for water retrieval and microbiota fermentation.",
        focusHint: "Umbilical and lower abdominal quadrants"
      }
    ],
    overview: "Converts ingested food into bioavailable nutrients, neutralizes toxins via hepatic portal circulation, and sustains the enteric nervous system.",
    clinicalFocus: "GERD, gastritis, peptic ulcer, fatty liver (NAFLD), cholecystitis, IBS, and dysbiosis."
  },

  skeletal: {
    id: "skeletal",
    name: "Skeletal System & Osteology",
    subtitle: "206 Articulated Bones, Trabecular Matrix & Joint Architecture",
    badge: "Structural Framework",
    accentColor: "#64748B",
    // Dedicated 3D Articulated Skeleton & Osteology
    modelUrl: "https://sketchfab.com/models/30616b7134cb48208da0d71a1795779c/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "axial_skeleton",
        name: "Cranium & Vertebral Column",
        icon: "🦴",
        description: "Protects CNS; 24 mobile vertebrae, sacrum, and coccyx supporting upright axial load.",
        focusHint: "Central axis from skull to pelvis"
      },
      {
        id: "synovial_joints",
        name: "Synovial Joints & Cartilage",
        icon: "🔗",
        description: "Articular hyaline cartilage, synovial fluid, and stabilizing ligamentous capsules enabling friction-free articulation.",
        focusHint: "Knee, hip, shoulder, and spinal facet joints"
      },
      {
        id: "bone_marrow",
        name: "Trabecular Bone & Marrow",
        icon: "🩸",
        description: "Hematopoietic stem cells producing red blood cells, leukocytes, and platelets within cancellous bone matrix.",
        focusHint: "Epiphyses of long bones and iliac crest"
      }
    ],
    overview: "Provides rigid structural support, protects internal visceral organs, acts as a mineral bank for calcium/phosphate, and facilitates locomotion.",
    clinicalFocus: "Osteoporosis, osteoarthritis, fractures, periostitis, spondylosis, and bone spurring."
  },

  muscular: {
    id: "muscular",
    name: "Muscular System & Myofascial Chains",
    subtitle: "600+ Muscles, Sarcomere Kinetics & Tendinous Anchors",
    badge: "Locomotor & Force Generation",
    accentColor: "#DC2626",
    // Dedicated 3D Muscular Anatomy Model
    modelUrl: "https://sketchfab.com/models/df23bc1912954a26a4225a07d35ef6b0/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "core_postural",
        name: "Core & Paraspinal Myofascia",
        icon: "🏋️",
        description: "Erector spinae, multifidus, and transversus abdominis maintaining spinal stability and gravity resistance.",
        focusHint: "Posterior dorsal and abdominal wall"
      },
      {
        id: "appendicular_muscles",
        name: "Limb & Locomotor Muscle Groups",
        icon: "🏃",
        description: "Quadriceps, hamstrings, deltoids, and rotator cuff powering locomotion, grasping, and dynamic stabilization.",
        focusHint: "Upper and lower extremities"
      },
      {
        id: "sarcomere_unit",
        name: "Sarcomere & Sarcoplasmic Reticulum",
        icon: "🔬",
        description: "Actin-myosin filament sliding fueled by ATP hydrolysis and regulated by calcium influx.",
        focusHint: "Microscopic myofibrils"
      }
    ],
    overview: "Generates biomechanical force for movement, supports upright posture, produces body heat through thermogenesis, and propels venous blood returns.",
    clinicalFocus: "Myalgia, muscle sprains, fibro-myositis, chronic muscle spasms, tendonitis, and physical fatigue."
  },

  lymphatic: {
    id: "lymphatic",
    name: "Lymphatic & Immune Defense System",
    subtitle: "Lymph Nodes, Thoracic Duct, Spleen & Thymus",
    badge: "Immune Surveillance",
    accentColor: "#10B981",
    // Dedicated 3D Lymphatic & Vascular Immune System Model
    modelUrl: "https://sketchfab.com/models/9b0b079953b840bc9a13f524b60041e4/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "lymph_nodes",
        name: "Lymph Node Chains (Cervical/Axillary/Inguinal)",
        icon: "🛡️",
        description: "Biological filter stations containing B and T lymphocytes sampling lymph for pathogens and antigens.",
        focusHint: "Neck, axillae, groin, and mesentery"
      },
      {
        id: "spleen",
        name: "Spleen (Red & White Pulp)",
        icon: "🟣",
        description: "Filters senescent red blood cells, stores platelets, and mounts rapid humoral immune responses to blood-borne antigens.",
        focusHint: "Left hypochondrium beneath 9th-11th ribs"
      },
      {
        id: "thoracic_duct",
        name: "Thoracic Duct & Cisterna Chyli",
        icon: "🌊",
        description: "Main lymphatic vessel returning 3 liters of lymph and emulsified dietary fats (chyle) into left subclavian vein.",
        focusHint: "Posterior mediastinum along aorta"
      }
    ],
    overview: "Maintains fluid homeostasis by returning interstitial fluid to circulation, absorbs dietary lipids, and mounts cell-mediated and antibody immune defenses.",
    clinicalFocus: "Lymphadenopathy, lymphedema, chronic tonsillitis, splenomegaly, and recurrent immune weakness."
  },

  reproductive: {
    id: "reproductive",
    name: "Reproductive System & Pelvic Anatomy",
    subtitle: "Gonads, Gametogenesis & Reproductive Hormonal Axis",
    badge: "Endocrine & Life Perpetuation",
    accentColor: "#EC4899",
    // Dedicated 3D Reproductive & Pelvic Anatomy Model
    modelUrl: "https://sketchfab.com/models/1912954a26a4225a07d35ef6b0b23b19/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "gonads",
        name: "Ovaries / Testes",
        icon: "🥚",
        description: "Primary gametogenic and steroidogenic organs producing ova/spermatozoa, estrogens, progesterone, and testosterone.",
        focusHint: "Lateral pelvic walls / Scrotum"
      },
      {
        id: "uterine_tract",
        name: "Uterus, Fallopian Tubes & Endometrium",
        icon: "🌸",
        description: "Thick-walled muscular organ undergoing monthly cyclical endometrial proliferation, secretory transformation, and shedding.",
        focusHint: "True pelvis between bladder and rectum"
      },
      {
        id: "prostate_adnexa",
        name: "Prostate & Seminal Vesicles",
        icon: "💧",
        description: "Exocrine glandular organ producing alkaline seminal fluid aiding spermatozoa viability and motility.",
        focusHint: "Inferior to bladder neck surrounding urethra"
      }
    ],
    overview: "Governs gametogenesis, fertilization, hormonal maturation, and secondary sexual characteristics through coordinated hypothalamic-pituitary-gonadal signaling.",
    clinicalFocus: "Dysmenorrhea, endometriosis, PCOS, benign prostatic hyperplasia (BPH), infertility, and climacteric flushes."
  },

  integumentary: {
    id: "integumentary",
    name: "Integumentary System & Skin Barrier",
    subtitle: "Epidermis, Dermis, Appendages & Neurosensory Endings",
    badge: "External Barrier Shield",
    accentColor: "#F59E0B",
    // Dedicated 3D Multi-Layer Skin & Histology Model
    modelUrl: "https://sketchfab.com/models/0d68dbd982b647f29b68e9f2910fa4e1/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "epidermis",
        name: "Epidermis (Stratum Corneum to Basale)",
        icon: "🛡️",
        description: "Keratinized stratified squamous epithelium providing water-impermeable barrier and UV protection via melanocytes.",
        focusHint: "Most superficial body layer"
      },
      {
        id: "dermis",
        name: "Dermis (Collagen & Elastin Matrix)",
        icon: "🕸️",
        description: "Vascularized connective tissue layer housing hair follicles, sebaceous glands, sweat glands, and Meissner/Pacinian corpuscles.",
        focusHint: "Mid-layer beneath basement membrane"
      },
      {
        id: "hypodermis",
        name: "Subcutaneous Adipose Tissue",
        icon: "🧈",
        description: "Lipid-rich fat layer providing thermal insulation, mechanical shock absorption, and systemic energy reserve.",
        focusHint: "Deep layer anchoring skin to fascia"
      }
    ],
    overview: "The human body's largest organ (2m², 4kg), providing physical, microbiological, and chemical barrier defenses, thermoregulation, and tactile sensation.",
    clinicalFocus: "Atopic dermatitis, eczema, psoriasis, acne vulgaris, urticaria, pruritus, and dry lichenified skin."
  },

  sensory: {
    id: "sensory",
    name: "Special Sensory System (Eye & Ear)",
    subtitle: "Photoreceptor Optics & Auditory-Vestibular Apparatus",
    badge: "Sensory Transduction",
    accentColor: "#38BDF8",
    // Dedicated 3D Eye & Ear Anatomy Model
    modelUrl: "https://sketchfab.com/models/f52e55a454d642bcbf4eb6874df1ec44/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=1&ui_annotations=1&ui_help=0",
    subOrgans: [
      {
        id: "ocular_globe",
        name: "Ocular Globe, Cornea & Retina",
        icon: "👁️",
        description: "Light refraction through cornea/lens focused onto rod/cone photoreceptors in the macular retina (Cranial Nerve II).",
        focusHint: "Bilateral cranial orbits"
      },
      {
        id: "cochlea_vestibular",
        name: "Cochlea & Semicircular Canals",
        icon: "👂",
        description: "Organ of Corti transducing fluid sound vibrations into nerve impulses (CN VIII); vestibular canals regulating spatial orientation.",
        focusHint: "Petrous part of temporal bone"
      }
    ],
    overview: "Highly specialized neuro-epithelial structures converting light waves into vision and mechanical sound/gravity pressure into audition and spatial balance.",
    clinicalFocus: "Allergic conjunctivitis, eyestrain (asthenopia), tinnitus, Meniere's disease, vertigo, and otitis media."
  }
};
