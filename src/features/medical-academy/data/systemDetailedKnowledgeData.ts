/**
 * HoloHuman™ Deep System Knowledge & Clinical Intelligence Data
 * Comprehensive data for all 12 anatomical systems:
 * 1. Structures & Histological Sub-units
 * 2. Physiological & Endocrine Cascades
 * 3. Diagnostic Biomarkers & Reference Ranges
 * 4. Clinical Pathologies & Hahnemannian Miasmatic Mapping
 * 5. Homeopathic Organotropism & Affinity Remedies
 */

import { AnatomySystemId } from "./medicalAcademyData";

export interface AnatomicalStructureDetail {
  id: string;
  name: string;
  subOrganId?: string;
  vascularSupply: string;
  innervation: string;
  histology: string;
  clinicalSignificance: string;
}

export interface PhysiologicalCascadeStep {
  step: number;
  stage: string;
  mechanism: string;
  feedbackLoop: string;
}

export interface BiomarkerItem {
  name: string;
  standardRange: string;
  unit: string;
  elevatedIndication: string;
  lowIndication: string;
}

export interface SystemPathologyItem {
  name: string;
  icdCode: string;
  miasm: "Psora" | "Sycosis" | "Syphilis" | "Tubercular";
  pathophysiology: string;
  keySigns: string[];
  homeopathicSimilimum: string[];
}

export interface HomeopathicAffinityDetail {
  remedyName: string;
  potencyScope: string;
  targetTissues: string[];
  keynoteRubrics: string[];
  modalities: {
    worse: string;
    better: string;
  };
  clinicalPearls: string;
}

export interface SystemDetailedKnowledge {
  systemId: AnatomySystemId;
  systemName: string;
  latinName: string;
  functionalMotto: string;
  structures: AnatomicalStructureDetail[];
  cascade: {
    title: string;
    description: string;
    steps: PhysiologicalCascadeStep[];
  };
  biomarkers: BiomarkerItem[];
  pathologies: SystemPathologyItem[];
  homeopathicAffinities: HomeopathicAffinityDetail[];
}

export const SYSTEM_DETAILED_KNOWLEDGE: Record<AnatomySystemId, SystemDetailedKnowledge> = {
  endocrine: {
    systemId: "endocrine",
    systemName: "Endocrine System",
    latinName: "Systema Endocrinum",
    functionalMotto: "Systemic Biochemical Symphony & Homeostasis",
    structures: [
      {
        id: "pituitary_gland",
        name: "Hypophysis Cerebri (Pituitary)",
        subOrganId: "pituitary",
        vascularSupply: "Superior & inferior hypophyseal arteries from internal carotid",
        innervation: "Hypothalamo-hypophyseal tract & autonomic carotid plexus",
        histology: "Adenohypophysis (cords of chromophils/chromophobes) + Neurohypophysis (unmyelinated axons & pituicytes)",
        clinicalSignificance: "Master gland commanding adrenal, thyroid, gonadal, and somatic growth axes."
      },
      {
        id: "thyroid_gland",
        name: "Glandula Thyroidea (Thyroid)",
        subOrganId: "thyroid",
        vascularSupply: "Superior thyroid (ECA) & Inferior thyroid (thyrocervical trunk)",
        innervation: "Recurrent laryngeal & superior laryngeal nerves",
        histology: "Spherical follicles lined with simple cuboidal follicular cells enclosing colloidal thyroglobulin",
        clinicalSignificance: "Sets basal metabolic rate, oxygen consumption, and body thermogenesis."
      },
      {
        id: "adrenal_cortex_medulla",
        name: "Glandula Suprarenalis (Adrenal)",
        subOrganId: "adrenals",
        vascularSupply: "Superior, middle, and inferior suprarenal arteries",
        innervation: "Preganglionic sympathetic fibers from greater splanchnic nerve (T5-T9)",
        histology: "Zona glomerulosa (aldosterone), fasciculata (cortisol), reticularis (DHEA) + Chromaffin medulla (adrenaline)",
        clinicalSignificance: "Mediates acute flight-or-fight response and chronic HPA stress adaptation."
      },
      {
        id: "islets_pancreas",
        name: "Islets of Langerhans (Endocrine Pancreas)",
        subOrganId: "pancreas_endocrine",
        vascularSupply: "Splenic artery branches & superior/inferior pancreaticoduodenal arteries",
        innervation: "Vagus nerve (parasympathetic) & splanchnic nerves (sympathetic)",
        histology: "Pale endocrine micro-clusters (Beta 70%, Alpha 20%, Delta 5%, PP 5%) within exocrine acini",
        clinicalSignificance: "Orchestrates systemic glucose homeostasis, fuel storage, and keto-protection."
      }
    ],
    cascade: {
      title: "The Hypothalamic-Pituitary-Thyroid (HPT) & Adrenal (HPA) Axis",
      description: "Pulsatile release of neurohormones orchestrates systemic hormonal feedback loops.",
      steps: [
        {
          step: 1,
          stage: "Hypothalamic Trigger",
          mechanism: "Paraventricular nucleus releases TRH (thyrotropin-releasing) or CRH (corticotropin-releasing) into hypophyseal portal portal system.",
          feedbackLoop: "Inhibited by high serum T3/T4 or free Cortisol."
        },
        {
          step: 2,
          stage: "Pituitary Release",
          mechanism: "Anterior pituitary thyrotrophs secrete TSH; corticotrophs synthesize POMC cleaved into ACTH.",
          feedbackLoop: "Downregulated by dopamine and somatostatin."
        },
        {
          step: 3,
          stage: "Target Organ Activation",
          mechanism: "TSH stimulates iodide trapping and T3/T4 release; ACTH binds MC2R receptors in adrenal cortex to synthesize Cortisol.",
          feedbackLoop: "Target tissue cellular transcription and nuclear receptor binding."
        },
        {
          step: 4,
          stage: "Metabolic & Immune Homeostasis",
          mechanism: "Elevated cellular metabolic rate, gluconeogenesis, glycogenolysis, and anti-inflammatory suppression.",
          feedbackLoop: "Long-loop negative feedback shuts down hypothalamic TRH/CRH and pituitary TSH/ACTH."
        }
      ]
    },
    biomarkers: [
      {
        name: "Thyroid Stimulating Hormone (TSH)",
        standardRange: "0.45 - 4.50",
        unit: "μIU/mL",
        elevatedIndication: "Primary Hypothyroidism, Hashimoto's Thyroiditis",
        lowIndication: "Hyperthyroidism, Graves' Disease, Central Pituitary Failure"
      },
      {
        name: "Free Triiodothyronine (FT3)",
        standardRange: "2.3 - 4.2",
        unit: "pg/mL",
        elevatedIndication: "Thyrotoxicosis, Autonomous Toxic Nodule",
        lowIndication: "Euthyroid Sick Syndrome, Hypothyroidism"
      },
      {
        name: "Morning Serum Cortisol (8:00 AM)",
        standardRange: "6.2 - 19.4",
        unit: "μg/dL",
        elevatedIndication: "Cushing's Syndrome, Acute Severe Stress, Adrenal Adenoma",
        lowIndication: "Addison's Disease, Secondary Adrenal Insufficiency, Burnout"
      },
      {
        name: "Fasting Serum Insulin",
        standardRange: "2.6 - 24.9",
        unit: "μIU/mL",
        elevatedIndication: "Insulin Resistance (HOMA-IR > 2.0), Insulinoma, PCOS",
        lowIndication: "Type 1 Diabetes Mellitus, Beta-cell Exhaustion"
      }
    ],
    pathologies: [
      {
        name: "Hashimoto's Autoimmune Thyroiditis",
        icdCode: "E06.3",
        miasm: "Tubercular",
        pathophysiology: "Autoimmune destruction of thyroid follicles via anti-TPO and anti-Tg antibodies leading to chronic hypothyroidism.",
        keySigns: ["Fatigue", "Cold intolerance", "Weight gain with low appetite", "Periorbital edema", "Depression", "Constipation"],
        homeopathicSimilimum: ["Thyroidinum", "Iodium", "Calcarea Carb", "Sepia", "Graphites"]
      },
      {
        name: "Adrenal Exhaustion & Burnout Dysregulation",
        icdCode: "E27.4",
        miasm: "Psora",
        pathophysiology: "Blunted diurnal cortisol curve following prolonged sympathetic nervous hyperstimulation, causing profound neuro-endocrine asthenia.",
        keySigns: ["Severe morning exhaustion", "Salt craving", "Orthostatic dizziness", "Brain fog", "Hypoglycemic dips"],
        homeopathicSimilimum: ["Adrenalinum", "Phosphoric Acid", "Kali Phos", "Arsenicum Album", "Gelsemium"]
      },
      {
        name: "Metabolic Syndrome & Insulin Resistance",
        icdCode: "E88.81",
        miasm: "Sycosis",
        pathophysiology: "Impaired peripheral GLUT4 translocation in skeletal muscle and adipose tissue triggering compensatory hyperinsulinemia.",
        keySigns: ["Central abdominal adiposity", "Acanthosis nigricans", "Postprandial somnolence", "Hypertriglyceridemia"],
        homeopathicSimilimum: ["Lycopodium", "Sulphur", "Syzygium Jambolanum", "Uranium Nitricum", "Thuja"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Thyroidinum",
        potencyScope: "3X to 200C",
        targetTissues: ["Thyroid Gland", "Metabolic Axis", "Adipose Tissue"],
        keynoteRubrics: ["Generalities; thyroid gland, complaints of", "Mind; exhaustion, mental; thyroid weakness from", "Skin; dry, withered"],
        modalities: { worse: "Cold, damp air, physical exertion", better: "Rest, gentle warmth" },
        clinicalPearls: "Specific sarcodic regulator in subclinical hypothyroidism, metabolic sluggishness, and arrested development."
      },
      {
        remedyName: "Iodium",
        potencyScope: "6C to 1M",
        targetTissues: ["Thyroid", "Lymphatic Glands", "Pancreas"],
        keynoteRubrics: ["Generalities; emaciation, ravenous hunger with", "Mind; anxiety; must keep moving", "Stomach; appetite increased; losing weight while eating well"],
        modalities: { worse: "Warmth, quiet rest, fasting", better: "Cold air, eating, continuous motion" },
        clinicalPearls: "Indicated when glandular hypertrophy accompanies hypermetabolic state with rapid weight loss despite excessive appetite."
      },
      {
        remedyName: "Natrum Muriaticum",
        potencyScope: "30C to 10M",
        targetTissues: ["Pituitary", "Adrenal Cortex", "Fluid Balance"],
        keynoteRubrics: ["Mind; grief, silent; dwelling on past", "Generalities; weakness, morning; salt craving with", "Head; pain, throbbing; sun from"],
        modalities: { worse: "Sun exposure, 10-11 AM, sea air, consolation", better: "Open air, cool bath, lying on right side" },
        clinicalPearls: "Deeply acts on the adrenal-pituitary salt/water osmoregulation axis and psychosomatic endocrine suppression."
      }
    ]
  },

  cardiovascular: {
    systemId: "cardiovascular",
    systemName: "Cardiovascular System",
    latinName: "Systema Cardiovasculare",
    functionalMotto: "Pulsatile Hemodynamic Force & Systemic Perfusion",
    structures: [
      {
        id: "myocardium",
        name: "Ventricular Myocardium",
        subOrganId: "left_ventricle",
        vascularSupply: "Left anterior descending (LAD) & Right coronary artery (RCA)",
        innervation: "Cardiac plexus (T1-T4 sympathetics & Vagus parasympathetics)",
        histology: "Striated, branched cardiomyocytes linked by intercalated discs with gap junctions & desmosomes",
        clinicalSignificance: "Generates systolic stroke volume and systemic mean arterial pressure."
      },
      {
        id: "coronary_arteries",
        name: "Coronary Arterial Vasculature",
        subOrganId: "aorta_valves",
        vascularSupply: "Ostia originating at the sinuses of Valsalva above aortic valve",
        innervation: "Autonomic sympathetic coronary vasodilation/vasoconstriction",
        histology: "Muscular arteries with prominent internal elastic lamina and smooth muscle media",
        clinicalSignificance: "Perfuses the continuously working heart muscle during ventricular diastole."
      },
      {
        id: "cardiac_conduction",
        name: "Sinoatrial (SA) & Atrioventricular (AV) Nodes",
        subOrganId: "conduction_system",
        vascularSupply: "SA nodal artery (60% RCA, 40% Circumflex) & AV nodal artery (90% RCA)",
        innervation: "Rich vagal parasympathetic innervation slowing rate; cardiac sympathetics accelerating rate",
        histology: "Specialized modified pale myocytes with high automaticity and rapid action potential velocity",
        clinicalSignificance: "Paces intrinsic heartbeat at 60-100 bpm and prevents ventricular desynchrony."
      }
    ],
    cascade: {
      title: "The Cardiac Cycle & Stroke Volume Cascade",
      description: "Isovolumetric contraction $\\rightarrow$ Rapid Ejection $\\rightarrow$ Isovolumetric Relaxation $\\rightarrow$ Ventricular Filling.",
      steps: [
        {
          step: 1,
          stage: "Electrical Depolarization",
          mechanism: "SA node action potential spreads across atria (P-wave), causing atrial systole (20% ventricular priming).",
          feedbackLoop: "Baroreceptor carotid sinus reflex regulates parasympathetic brake."
        },
        {
          step: 2,
          stage: "Isovolumetric Ventricular Contraction",
          mechanism: "QRS depolarization triggers ventricular pressure rise exceeding atrial pressure, snapping Mitral/Tricuspid valves shut (S1 sound).",
          feedbackLoop: "Frank-Starling law: increased end-diastolic volume enhances myocardial contractility."
        },
        {
          step: 3,
          stage: "Rapid Systolic Ejection",
          mechanism: "Ventricular pressure surpasses aortic (80 mmHg) and pulmonary (10 mmHg) pressures, opening semilunar valves.",
          feedbackLoop: "Total peripheral resistance (afterload) sets ejection velocity."
        },
        {
          step: 4,
          stage: "Diastolic Filling & Coronary Perfusion",
          mechanism: "Ventricles repolarize (T-wave), semilunar valves close (S2 sound); blood flows back into coronary sinuses to perfuse myocardium.",
          feedbackLoop: "ANP/BNP released in response to atrial stretch promotes natriuresis."
        }
      ]
    },
    biomarkers: [
      {
        name: "High-Sensitivity Cardiac Troponin I (hs-cTnI)",
        standardRange: "< 14.0",
        unit: "ng/L",
        elevatedIndication: "Acute Myocardial Infarction, Myocarditis, Severe Cardiac Strain",
        lowIndication: "Normal Myocardial Integrity"
      },
      {
        name: "N-Terminal Pro-BNP (NT-proBNP)",
        standardRange: "< 125.0",
        unit: "pg/mL",
        elevatedIndication: "Congestive Heart Failure, Ventricular Wall Stress, Valvular Disease",
        lowIndication: "Excludes Acute Heart Failure with > 98% NPV"
      },
      {
        name: "High-Sensitivity C-Reactive Protein (hs-CRP)",
        standardRange: "< 1.0",
        unit: "mg/L",
        elevatedIndication: "Systemic Endothelial Vascular Inflammation, Atherosclerotic Plaque Instability",
        lowIndication: "Low Vascular Cardiovascular Risk Profile"
      }
    ],
    pathologies: [
      {
        name: "Angina Pectoris & Coronary Ischemia",
        icdCode: "I20.9",
        miasm: "Syphilis",
        pathophysiology: "Mismatch between myocardial oxygen supply and demand due to fixed atherosclerotic plaque or vasospasm.",
        keySigns: ["Substernal squeezing chest pain", "Radiation to left arm/jaw", "Exertional dyspnea", "Diaphoresis"],
        homeopathicSimilimum: ["Cactus Grandiflorus", "Lachesis", "Spigelia", "Latrodectus Mactans", "Arsenicum Album"]
      },
      {
        name: "Congestive Heart Failure (Systolic & Diastolic)",
        icdCode: "I50.9",
        miasm: "Sycosis",
        pathophysiology: "Inability of ventricles to pump sufficient blood volume, resulting in pulmonary congestion and peripheral edema.",
        keySigns: ["Orthopnea", "Paroxysmal nocturnal dyspnea", "Bilateral pedal edema", "Jugular venous distention", "Fatigue"],
        homeopathicSimilimum: ["Digitalis", "Crataegus Oxyacantha", "Strophanthus", "Convallaria", "Apocynum"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Cactus Grandiflorus",
        potencyScope: "Q (Mother Tincture) to 200C",
        targetTissues: ["Cardiac Muscle", "Coronary Arteries", "Circular Muscle Fibers"],
        keynoteRubrics: ["Chest; constriction, heart; iron band, as if by", "Heart; pain, clutching; extending down left arm", "Pulse; irregular, intermittent"],
        modalities: { worse: "Lying on left side, 11 PM, exertion, stairs", better: "Open air, resting quietly" },
        clinicalPearls: "The classic 'iron band clutching the heart' sensation in angina, valvular incompetency, and cardiac dyspnea."
      },
      {
        remedyName: "Crataegus Oxyacantha",
        potencyScope: "Q (Tincture) to 30C",
        targetTissues: ["Heart Muscle", "Vascular Endothelium", "Myocardial Capillaries"],
        keynoteRubrics: ["Heart; weakness, myocardial; heart tonic", "Chest; oppression, heart; dyspnea on least exertion", "Pulse; feeble, irregular, rapid"],
        modalities: { worse: "Warm room, least exertion", better: "Fresh cool air, quiet rest" },
        clinicalPearls: "A premier nutritional heart tonic that dissolves calcified plaques, restores myocardial tone, and lowers arterial hypertension."
      }
    ]
  },

  nervous: {
    systemId: "nervous",
    systemName: "Nervous System",
    latinName: "Systema Nervosum",
    functionalMotto: "Electrochemical Intelligence, Reflexes & Consciousness",
    structures: [
      {
        id: "cerebral_cortex",
        name: "Cerebral Cortex & Gray Matter",
        subOrganId: "cerebral_cortex",
        vascularSupply: "Circle of Willis (Anterior, Middle, and Posterior Cerebral Arteries)",
        innervation: "Intrinsic neuronal circuits & meningeal trigeminal/vagal sensory supply",
        histology: "6-layered neocortex containing pyramidal cells, stellate interneurons, and glial support network",
        clinicalSignificance: "Executes higher cognition, language, volitional movement, and conscious awareness."
      },
      {
        id: "cerebellum_vermis",
        name: "Cerebellum & Deep Nuclei",
        subOrganId: "cerebellum",
        vascularSupply: "SCA, AICA, and PICA from vertebrobasilar arterial system",
        innervation: "Mossy and climbing fibers communicating via cerebellar peduncles",
        histology: "Molecular layer, Purkinje cell monolayer with dense dendritic arbors, and granular layer",
        clinicalSignificance: "Calibrates motor accuracy, posture, equilibrium, and motor learning."
      }
    ],
    cascade: {
      title: "Action Potential Propagation & Synaptic Neurotransmission",
      description: "Voltage-gated $Na^+$ influx $\\rightarrow$ Depolarization $\\rightarrow$ Vesicular neurotransmitter exocytosis $\\rightarrow$ Postsynaptic EPSP/IPSP.",
      steps: [
        {
          step: 1,
          stage: "Resting Membrane Potential (-70 mV)",
          mechanism: "$Na^+/K^+$ ATPase maintains intracellular high $K^+$ and extracellular high $Na^+$.",
          feedbackLoop: "Leak $K^+$ channels establish resting electrochemical gradient."
        },
        {
          step: 2,
          stage: "Threshold Depolarization (-55 mV)",
          mechanism: "Voltage-gated $Na^+$ channels snap open in axonal hillock, generating +30 mV spike in 1 millisecond.",
          feedbackLoop: "All-or-none propagation along myelinated Ranvier nodes (saltatory conduction)."
        },
        {
          step: 3,
          stage: "Synaptic Calcium Influx",
          mechanism: "Depolarization reaches presynaptic terminal, activating P/Q and N-type $Ca^{2+}$ channels.",
          feedbackLoop: "Synaptotagmin and SNARE complex trigger neurotransmitter vesicle fusion."
        },
        {
          step: 4,
          stage: "Postsynaptic Receptor Binding",
          mechanism: "Neurotransmitters (GABA, Glutamate, Acetylcholine) bind ligand-gated ionotropic/metabotropic receptors.",
          feedbackLoop: "Reuptake transporters (SERT, DAT, NET) and enzymatic cleavage (AChE) terminate signal."
        }
      ]
    },
    biomarkers: [
      {
        name: "Serum Neurofilament Light Chain (NfL)",
        standardRange: "< 12.0",
        unit: "pg/mL",
        elevatedIndication: "Neuroaxonal Damage, Multiple Sclerosis, Neurodegeneration, Stroke",
        lowIndication: "Intact Neuroaxonal Architecture"
      },
      {
        name: "C-Reactive Protein (Neuro-inflammatory)",
        standardRange: "< 0.5",
        unit: "mg/L",
        elevatedIndication: "Neurovascular Inflammation, Blood-Brain Barrier Disruption",
        lowIndication: "Normal Cerebral Vascular Integrity"
      }
    ],
    pathologies: [
      {
        name: "Trigeminal & Peripheral Neuralgia",
        icdCode: "G50.0",
        miasm: "Psora",
        pathophysiology: "Microvascular compression or demyelination of cranial/peripheral nerve root causing lightning-like paroxysmal pain.",
        keySigns: ["Lancinating electric-shock face pain", "Triggered by light touch or wind", "Facial twitching"],
        homeopathicSimilimum: ["Spigelia", "Magnesia Phos", "Hypericum", "Verbascum", "Causticum"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Gelsemium Sempervirens",
        potencyScope: "30C to 10M",
        targetTissues: ["Motor Nervous System", "Spinal Cord", "Autonomic Ganglia"],
        keynoteRubrics: ["Mind; anticipation, ailments from", "Generalities; weakness, trembling; heavy eyelids with", "Head; pain, occipital; radiating to forehead"],
        modalities: { worse: "Bad news, anticipation, damp weather, 10 AM", better: "Profuse urination, open air, continuous bending" },
        clinicalPearls: "The classic '3 D's': Dull, Drowsy, Dizzy with complete muscular trembling and nervous dread before challenges."
      },
      {
        remedyName: "Hypericum Perforatum",
        potencyScope: "30C to 1M",
        targetTissues: ["Nerve Endings", "Spinal Nerve Roots", "Neuro-sensory Tissues"],
        keynoteRubrics: ["Nerves; pain, shooting, upward along nerve", "Injuries; nerve-rich parts, crushed fingertips", "Spine; concussion, pain after injury"],
        modalities: { worse: "Cold, dampness, touch, fog", better: "Bending head backward" },
        clinicalPearls: "The 'Arnica of the nerves' — specific for crushed nerve endings, tailbone (coccyx) injuries, and shooting upward pains."
      }
    ]
  },

  respiratory: {
    systemId: "respiratory",
    systemName: "Respiratory System",
    latinName: "Systema Respiratorium",
    functionalMotto: "Pulmonary Ventilation, Alveolar Diffusion & Vital Breath",
    structures: [
      {
        id: "tracheobronchial_tree",
        name: "Tracheobronchial Tree",
        subOrganId: "trachea_bronchi",
        vascularSupply: "Bronchial arteries originating directly from descending thoracic aorta",
        innervation: "Pulmonary plexus (Vagus parasympathetics bronchoconstrict; sympathetics bronchodilate)",
        histology: "Pseudostratified ciliated columnar epithelium with goblet cells and hyaline cartilage rings",
        clinicalSignificance: "Mucociliary escalator filtering 10,000 liters of inhaled air daily."
      },
      {
        id: "alveolar_membrane",
        name: "Alveolar-Capillary Diffusion Membrane",
        subOrganId: "alveolar_bed",
        vascularSupply: "Pulmonary arterial circulation receiving 100% of right ventricular cardiac output",
        innervation: "Juxtacapillary (J) receptors sensing alveolar wall interstitial congestion",
        histology: "Type I pneumocytes (95% surface), Type II pneumocytes (surfactant synthesis), and alveolar macrophages",
        clinicalSignificance: "Ultra-thin 0.5-micron barrier allowing rapid passive $O_2$ loading and $CO_2$ unloading."
      }
    ],
    cascade: {
      title: "The Mechanics of Respiration & Gas Exchange",
      description: "Inspiratory muscle contraction $\\rightarrow$ Negative pleural pressure $\\rightarrow$ Alveolar airflow $\\rightarrow$ Hemoglobin oxygen saturation.",
      steps: [
        {
          step: 1,
          stage: "Inspiratory Initiation",
          mechanism: "Medullary dorsal respiratory group fires down phrenic nerve; diaphragm descends 1-7 cm.",
          feedbackLoop: "Central chemoreceptors in medulla sense $H^+ / CO_2$ in cerebrospinal fluid."
        },
        {
          step: 2,
          stage: "Intrapleural Pressure Drop",
          mechanism: "Intrapleural pressure drops from -5 cm $H_2O$ to -8 cm $H_2O$, expanding alveolar volume.",
          feedbackLoop: "Hering-Breuer stretch reflex prevents pulmonary over-inflation."
        },
        {
          step: 3,
          stage: "Alveolar Gas Diffusion",
          mechanism: "$O_2$ moves down partial pressure gradient ($P_{A}O_2$ 104 mmHg $\\rightarrow$ capillary $P_vO_2$ 40 mmHg).",
          feedbackLoop: "Hypoxic pulmonary vasoconstriction optimizes ventilation/perfusion (V/Q) matching."
        }
      ]
    },
    biomarkers: [
      {
        name: "Fractional Exhaled Nitric Oxide (FeNO)",
        standardRange: "< 25.0",
        unit: "ppb",
        elevatedIndication: "Eosinophilic Airway Inflammation, Allergic Asthma",
        lowIndication: "Non-eosinophilic airway, normal baseline"
      },
      {
        name: "Arterial Blood Gas: $PaO_2$",
        standardRange: "75 - 100",
        unit: "mmHg",
        elevatedIndication: "Hyperoxia under supplemental oxygen therapy",
        lowIndication: "Hypoxemia, Respiratory Failure, V/Q Mismatch"
      }
    ],
    pathologies: [
      {
        name: "Bronchial Asthma & Hyperreactive Airway",
        icdCode: "J45.9",
        miasm: "Tubercular",
        pathophysiology: "Chronic eosinophilic airway inflammation with bronchial smooth muscle spasm and excessive mucus plug formation.",
        keySigns: ["Expiratory wheezing", "Nocturnal coughing fits", "Chest tightness", "Dyspnea on exertion"],
        homeopathicSimilimum: ["Arsenicum Album", "Blatta Orientalis", "Ipecacuanha", "Medorrhinum", "Spongia Tosta"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Antimonium Tartaricum",
        potencyScope: "6C to 200C",
        targetTissues: ["Bronchioles", "Alveoli", "Vagal Respiratory Center"],
        keynoteRubrics: ["Respiration; rattling, large mucus; too weak to expectorate", "Chest; suffocative cough, child; drowsy with", "Face; cyanotic, cold sweat on forehead"],
        modalities: { worse: "Lying flat, warm room, 3 AM, eating", better: "Sitting erect, expectoration, cool fresh air" },
        clinicalPearls: "Classic remedy when chest is loaded with heavy, rattling mucus that patient lacks vitality to cough up."
      },
      {
        remedyName: "Bryonia Alba",
        potencyScope: "30C to 1M",
        targetTissues: ["Pleural Membranes", "Bronchial Mucosa", "Chest Wall Musculature"],
        keynoteRubrics: ["Chest; pain, stitching; breathing or coughing on", "Cough; dry, hard; holding chest with hands", "Generalities; motion aggravates absolutely"],
        modalities: { worse: "Least movement, deep breath, warm room", better: "Absolute rest, lying on painful side, firm pressure" },
        clinicalPearls: "Dry, hacking painful cough where patient must hold chest firmly to prevent agonizing stitching pains."
      }
    ]
  },

  renal: {
    systemId: "renal",
    systemName: "Renal & Urinary System",
    latinName: "Systema Urinarium",
    functionalMotto: "Plasma Ultrafiltration, Acid-Base Buffer & Fluid Osmoregulation",
    structures: [
      {
        id: "nephron_glomerulus",
        name: "Nephron Glomerular Apparatus",
        subOrganId: "renal_cortex",
        vascularSupply: "Afferent arteriole $\\rightarrow$ Glomerular capillary tuft $\\rightarrow$ Efferent arteriole",
        innervation: "Renal sympathetic plexus (T10-L1) regulating renin secretion and arteriolar tone",
        histology: "Fenestrated endothelium, glomerular basement membrane, and podocyte slit diaphragms",
        clinicalSignificance: "Filters 180 liters of blood plasma daily, preventing protein leakage into urine."
      },
      {
        id: "loop_of_henle",
        name: "Medullary Loops of Henle & Collecting Ducts",
        subOrganId: "renal_medulla",
        vascularSupply: "Vasa recta maintaining hypertonic medullary gradient",
        innervation: "Autonomic modulation of tubuloglomerular feedback",
        histology: "Thin descending limb (water permeable) + Thick ascending limb (Na-K-2Cl cotransporter)",
        clinicalSignificance: "Establishes osmotic concentration gradient allowing urine concentration up to 1200 mOsm/kg."
      }
    ],
    cascade: {
      title: "Renin-Angiotensin-Aldosterone System (RAAS)",
      description: "Low renal perfusion $\\rightarrow$ Renin release $\\rightarrow$ Angiotensin II vasoconstriction $\\rightarrow$ Aldosterone $Na^+/H_2O$ retention.",
      steps: [
        {
          step: 1,
          stage: "Renal Hypoperfusion Detection",
          mechanism: "Juxtaglomerular apparatus senses reduced renal arterial pressure or low tubular sodium chloride.",
          feedbackLoop: "Sympathetic beta-1 stimulation accelerates renin exocytosis."
        },
        {
          step: 2,
          stage: "Angiotensin Conversion",
          mechanism: "Renin cleaves hepatic angiotensinogen into Angiotensin I; ACE in pulmonary endothelium converts it to Angiotensin II.",
          feedbackLoop: "Angiotensin II provides rapid systemic arteriolar vasoconstriction."
        },
        {
          step: 3,
          stage: "Adrenal & Tubular Response",
          mechanism: "Angiotensin II stimulates adrenal zona glomerulosa to release Aldosterone, upregulating ENaC channels in collecting ducts.",
          feedbackLoop: "Retained sodium and water expand extracellular volume and restore renal perfusion."
        }
      ]
    },
    biomarkers: [
      {
        name: "Estimated Glomerular Filtration Rate (eGFR)",
        standardRange: "> 90.0",
        unit: "mL/min/1.73m²",
        elevatedIndication: "Glomerular Hyperfiltration (early diabetic nephropathy)",
        lowIndication: "Chronic Kidney Disease Stage 1-5, Acute Kidney Injury"
      },
      {
        name: "Serum Creatinine",
        standardRange: "0.70 - 1.20",
        unit: "mg/dL",
        elevatedIndication: "Decreased Renal Clearance, Glomerulonephritis, Dehydration",
        lowIndication: "Low Muscle Mass, Cachexia"
      }
    ],
    pathologies: [
      {
        name: "Nephrolithiasis (Renal Calculi / Stones)",
        icdCode: "N20.0",
        miasm: "Sycosis",
        pathophysiology: "Supersaturation of calcium oxalate or uric acid in renal collecting system forming crystalline concretions.",
        keySigns: ["Severe flank to groin radiating colic", "Gross or microscopic hematuria", "Dysuria", "Nausea & vomiting"],
        homeopathicSimilimum: ["Berberis Vulgaris", "Lycopodium", "Sarsaparilla", "Ocimum Canum", "Hydrangea"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Berberis Vulgaris",
        potencyScope: "Q (Tincture) to 200C",
        targetTissues: ["Renal Pelvis", "Ureters", "Urinary Bladder"],
        keynoteRubrics: ["Kidneys; pain, radiating, ureters to bladder and thighs", "Urine; sediment, red sand or mucus with", "Back; pain, bubbling sensation in renal region"],
        modalities: { worse: "Motion, jar, stepping hard, standing", better: "Rest, lying still" },
        clinicalPearls: "The supreme remedy for renal colic with pain radiating from kidney downwards into bladder, testicles, or thighs."
      },
      {
        remedyName: "Cantharis Vesicatoria",
        potencyScope: "6C to 1M",
        targetTissues: ["Bladder Neck", "Urethra", "Urinary Mucosa"],
        keynoteRubrics: ["Bladder; urination, dysuria; burning, scalding like fire", "Urine; bloody, drop by drop passing", "Bladder; tenesmus, intolerable urge with"],
        modalities: { worse: "During and after micturition, drinking cold water", better: "Warmth, quiet rest" },
        clinicalPearls: "Intolerable, constant urging with cutting, burning pains during urination as if scalded with boiling water."
      }
    ]
  },

  digestive: {
    systemId: "digestive",
    systemName: "Digestive System",
    latinName: "Systema Digestorium",
    functionalMotto: "Gastrointestinal Digestion, Hepatic Cleansing & Absorption",
    structures: [
      {
        id: "gastric_mucosa",
        name: "Gastric Rugae & Acid Barrier",
        subOrganId: "stomach",
        vascularSupply: "Left and right gastric arteries along lesser curvature; gastro-omental along greater curvature",
        innervation: "Vagus nerve (Anterior & Posterior Latarjet nerves) driving cephalic acid secretion",
        histology: "Gastric pits with surface mucous cells, Parietal cells ($HCl$ & intrinsic factor), and Chief cells (pepsinogen)",
        clinicalSignificance: "Breaks down protein matrix and sterilizes ingested food via low pH (1.5 - 2.0)."
      },
      {
        id: "hepatic_parenchyma",
        name: "Hepatic Lobules & Portal Triads",
        subOrganId: "liver_hepatic",
        vascularSupply: "Portal vein (75% flow, nutrient-rich) & Hepatic artery proper (25% flow, oxygenated)",
        innervation: "Hepatic nerve plexus from celiac ganglion and vagus",
        histology: "Hexagonal lobules with hepatocytes arranged in plates radiating from central vein, flanked by sinusoids and Kupffer cells",
        clinicalSignificance: "Primary metabolic hub executing Phase I/II detoxification, glycogen storage, and albumin synthesis."
      }
    ],
    cascade: {
      title: "Cephalic, Gastric & Intestinal Digestive Cascade",
      description: "Sensory cues $\\rightarrow$ Gastrin release $\\rightarrow$ $H^+/K^+$ ATPase activation $\\rightarrow$ Secretin/CCK pancreatic-biliary surge.",
      steps: [
        {
          step: 1,
          stage: "Cephalic Phase (Vagal)",
          mechanism: "Sight and smell of food trigger vagal acetylcholine release, stimulating G cells to secrete Gastrin.",
          feedbackLoop: "Somatostatin from D cells inhibits gastrin when gastric pH drops below 1.5."
        },
        {
          step: 2,
          stage: "Gastric Phase (Parietal Activation)",
          mechanism: "Histamine (ECL cells), Gastrin, and ACh bind parietal receptors, activating $H^+/K^+$ ATPase proton pumps.",
          feedbackLoop: "Pepsinogen cleaves into active pepsin in the acidic lumen."
        },
        {
          step: 3,
          stage: "Intestinal Phase (CCK & Secretin)",
          mechanism: "Acidic chyme entering duodenum stimulates S cells (Secretin $\\rightarrow$ $HCO_3^-$) and I cells (CCK $\\rightarrow$ Gallbladder contraction).",
          feedbackLoop: "Bile salts emulsify lipid droplets for pancreatic lipase digestion."
        }
      ]
    },
    biomarkers: [
      {
        name: "Alanine Aminotransferase (ALT)",
        standardRange: "7 - 56",
        unit: "U/L",
        elevatedIndication: "Hepatocellular Injury, Viral Hepatitis, Fatty Liver (NAFLD), Toxic Injury",
        lowIndication: "Normal Baseline Liver Function"
      },
      {
        name: "Gamma-Glutamyl Transferase (GGT)",
        standardRange: "9 - 48",
        unit: "U/L",
        elevatedIndication: "Biliary Obstruction, Cholestasis, Alcohol-induced Hepatic Stress",
        lowIndication: "Normal Biliary Duct Integrity"
      }
    ],
    pathologies: [
      {
        name: "Gastroesophageal Reflux Disease (GERD) & Gastritis",
        icdCode: "K21.9",
        miasm: "Psora",
        pathophysiology: "Transient lower esophageal sphincter relaxation allowing acidic gastric contents to erode esophageal epithelium.",
        keySigns: ["Retrosternal heartburn", "Sour regurgitation", "Epigastric burning", "Postprandial bloating"],
        homeopathicSimilimum: ["Nux Vomica", "Robinia", "Carbo Veg", "Iris Versicolor", "Phosphorus"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Nux Vomica",
        potencyScope: "30C to 10M",
        targetTissues: ["Gastric Mucosa", "Liver", "Enteric Nervous System"],
        keynoteRubrics: ["Stomach; indigestion, overeating, alcohol or coffee from", "Stomach; pain, cramping, weight like a stone after eating", "Rectum; ineffectual urging for stool"],
        modalities: { worse: "Morning, after eating, cold air, mental exertion", better: "Warmth, short nap, hot drinks, evening" },
        clinicalPearls: "Premier remedy for toxic digestive overload, modern high-stress lifestyle, sedentary habits, and gastric cramps."
      },
      {
        remedyName: "Chelidonium Majus",
        potencyScope: "Q (Tincture) to 200C",
        targetTissues: ["Liver", "Gallbladder", "Biliary Ducts"],
        keynoteRubrics: ["Liver; pain, extending to right inferior angle of scapula", "Skin; jaundice, yellow discoloration of sclera", "Stomach; desires hot drinks, boiling water"],
        modalities: { worse: "Right side, 4 AM and 4 PM, cold weather", better: "Hot milk, boiling water, eating" },
        clinicalPearls: "Famous landmark keynote: Constant severe pain under the right lower angle of the scapula in hepatic and biliary congestion."
      }
    ]
  },

  skeletal: {
    systemId: "skeletal",
    systemName: "Skeletal System",
    latinName: "Systema Skeletale",
    functionalMotto: "Mineralized Scaffold, Joint Articulation & Hematopoiesis",
    structures: [
      {
        id: "cortical_trabecular_bone",
        name: "Bone Matrix & Osteons",
        subOrganId: "axial_skeleton",
        vascularSupply: "Nutrient arteries entering via nutrient foramina and Haversian canals",
        innervation: "Sensory nociceptive fibers densely innervating the vascularized periosteum",
        histology: "Concentric lamellae surrounding central Haversian canals; osteocytes inside lacunae",
        clinicalSignificance: "Houses 99% of bodily calcium reserves and shields thoracic/cranial vital organs."
      }
    ],
    cascade: {
      title: "Bone Remodeling & Calcium Homeostasis",
      description: "Osteoclast resorption $\\rightarrow$ Matrix transition $\\rightarrow$ Osteoblast osteoid deposition $\\rightarrow$ Hydroxyapatite mineralization.",
      steps: [
        {
          step: 1,
          stage: "Activation & Resorption",
          mechanism: "RANKL binds osteoclast precursor RANK receptors, activating acid phosphatase to dissolve mineral matrix.",
          feedbackLoop: "Inhibited by Osteoprotegerin (OPG) and systemic Estrogen."
        },
        {
          step: 2,
          stage: "Osteoid Synthesis",
          mechanism: "Osteoblasts lay down Type I collagen matrix and osteocalcin.",
          feedbackLoop: "Vitamin D (1,25-OH2D3) stimulates calcium absorption in gut."
        },
        {
          step: 3,
          stage: "Mineralization",
          mechanism: "Alkaline phosphatase precipitates calcium and phosphate into crystalline hydroxyapatite.",
          feedbackLoop: "Parathyroid hormone (PTH) and Calcitonin maintain dynamic balance."
        }
      ]
    },
    biomarkers: [
      {
        name: "Bone-Specific Alkaline Phosphatase (BAP)",
        standardRange: "14.3 - 42.7",
        unit: "U/L",
        elevatedIndication: "High Bone Turnover, Paget's Disease, Fracture Healing, Osteomalacia",
        lowIndication: "Hypophosphatasia, Adynamic Bone Disease"
      }
    ],
    pathologies: [
      {
        name: "Osteoarthritis & Cartilage Degradation",
        icdCode: "M19.9",
        miasm: "Sycosis",
        pathophysiology: "Mechanical wear and inflammatory cytokine release eroding articular cartilage, producing subchondral sclerosis and osteophytes.",
        keySigns: ["Joint stiffness on waking", "Crepitus on movement", "Bony enlargement (Heberden/Bouchard nodes)", "Weight-bearing pain"],
        homeopathicSimilimum: ["Ruta Graveolens", "Calcarea Fluor", "Rhus Tox", "Symphytum", "Bryonia"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Symphytum Officinale (Knitbone)",
        potencyScope: "Q to 200C",
        targetTissues: ["Periosteum", "Bone Matrix", "Osteoblasts"],
        keynoteRubrics: ["Bones; fractures, union of, promoting", "Periosteum; pain, persistent after blunt trauma", "Eyes; injury, blunt, eyeball to"],
        modalities: { worse: "Touch, pressure", better: "Rest, gentle support" },
        clinicalPearls: "Stimulates rapid osteoblast proliferation, accelerating callus formation in non-union fractures and traumatic periostitis."
      },
      {
        remedyName: "Calcarea Phosphorica",
        potencyScope: "6X to 1M",
        targetTissues: ["Bones", "Epiphyseal Growth Plates", "Sutures"],
        keynoteRubrics: ["Bones; growth, delayed; fontanelles open", "Back; curvature, scoliosis; young growing people in", "Extremities; pain, growing pains in children"],
        modalities: { worse: "Cold, damp, changing weather, melting snow", better: "Warm, dry weather, lying down" },
        clinicalPearls: "Constitutional tissue salt for delayed bone development, rickets, delayed fontanelle closure, and non-healing fractures."
      }
    ]
  },

  muscular: {
    systemId: "muscular",
    systemName: "Muscular System",
    latinName: "Systema Musculare",
    functionalMotto: "Myofascial Contraction, Biomechanical Force & Thermogenesis",
    structures: [
      {
        id: "skeletal_myofiber",
        name: "Skeletal Muscle Fibers & Sarcolemma",
        subOrganId: "appendicular_muscles",
        vascularSupply: "Extensive capillary networks aligned parallel to muscle fibers",
        innervation: "Alpha motor neurons via motor endplates (Acetylcholine)",
        histology: "Multinucleated cylindrical fibers filled with repeating myofibril sarcomeres (actin and myosin)",
        clinicalSignificance: "Converts chemical ATP into mechanical movement and postural stability."
      }
    ],
    cascade: {
      title: "Excitation-Contraction Coupling in Sarcomeres",
      description: "Action potential $\\rightarrow$ T-tubule DHP receptor $\\rightarrow$ Sarcoplasmic $Ca^{2+}$ flood $\\rightarrow$ Actin-myosin power stroke.",
      steps: [
        {
          step: 1,
          stage: "Neuromuscular Transmission",
          mechanism: "ACh released from alpha motor neuron binds nicotinic receptors on motor endplate, triggering endplate potential.",
          feedbackLoop: "Acetylcholinesterase cleaves ACh in microseconds."
        },
        {
          step: 2,
          stage: "Calcium Efflux",
          mechanism: "Action potential travels down T-tubules, opening Ryanodine receptors (RyR1) on sarcoplasmic reticulum.",
          feedbackLoop: "$Ca^{2+}$ binds Troponin C, moving Tropomyosin away from actin binding sites."
        },
        {
          step: 3,
          stage: "Cross-Bridge Cycling",
          mechanism: "Myosin head hydrolyzes ATP, binds actin, and pivots 45 degrees (power stroke), shortening the sarcomere.",
          feedbackLoop: "SERCA pumps actively pump $Ca^{2+}$ back into sarcoplasmic reticulum for relaxation."
        }
      ]
    },
    biomarkers: [
      {
        name: "Creatine Kinase (CK / CPK Total)",
        standardRange: "30 - 200",
        unit: "U/L",
        elevatedIndication: "Rhabdomyolysis, Myositis, Heavy Physical Strain, Myocardial Injury",
        lowIndication: "Low Muscle Mass, Inactive Lifestyle"
      }
    ],
    pathologies: [
      {
        name: "Myofascial Pain Syndrome & Fibrositis",
        icdCode: "M79.1",
        miasm: "Psora",
        pathophysiology: "Sustained sarcomere contraction producing taut bands and hyperirritable trigger points with referred pain patterns.",
        keySigns: ["Taut palpable muscular bands", "Aching regional pain", "Reduced range of motion", "Trigger point tenderness"],
        homeopathicSimilimum: ["Arnica Montana", "Rhus Toxicodendron", "Magnesia Phos", "Cimicifuga", "Cuprum Met"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Arnica Montana",
        potencyScope: "30C to 10M",
        targetTissues: ["Muscle Fibers", "Capillary Walls", "Myofascial Sheaths"],
        keynoteRubrics: ["Generalities; sore, bruised feeling; bed feels too hard", "Muscles; pain, overworked; from excessive strain", "Trauma; blunt, injuries to soft tissues"],
        modalities: { worse: "Least touch, motion, damp cold", better: "Lying down, head low, resting" },
        clinicalPearls: "The universal remedy for muscular trauma, physical overexertion, sore bruised aching, and bed feeling too hard."
      },
      {
        remedyName: "Rhus Toxicodendron",
        potencyScope: "30C to 1M",
        targetTissues: ["Tendons", "Ligaments", "Fibrous Muscle Sheaths"],
        keynoteRubrics: ["Generalities; stiffness, first motion; better continued motion", "Muscles; pain, sprains and strains; overreaching", "Mind; restlessness; must constantly change position"],
        modalities: { worse: "First movement, rest, cold damp weather, midnight", better: "Continued motion, warm applications, dry weather" },
        clinicalPearls: "The classic 'rusty hinge' modality: intense stiffness and pain on first movement, greatly relieved by continuous motion."
      }
    ]
  },

  lymphatic: {
    systemId: "lymphatic",
    systemName: "Lymphatic & Immune System",
    latinName: "Systema Lymphoideum",
    functionalMotto: "Interstitial Clearance, Immune Surveillance & Pathogen Defense",
    structures: [
      {
        id: "lymph_nodes_cortex",
        name: "Lymph Node Architecture",
        subOrganId: "lymph_nodes",
        vascularSupply: "High endothelial venules (HEVs) allowing lymphocyte extravasation",
        innervation: "Autonomic sympathetic nerve fibers modulating lymphocyte egress",
        histology: "Outer cortex (B-cell germinal centers), Paracortex (T-cells), and Medullary cords (plasma cells)",
        clinicalSignificance: "Primary antigen-presentation and clonal expansion hub for adaptive immunity."
      }
    ],
    cascade: {
      title: "Antigen Presentation & Clonal Expansion",
      description: "Pathogen phagocytosis $\\rightarrow$ Dendritic cell migration $\\rightarrow$ MHC-II presentation $\\rightarrow$ T/B cell activation.",
      steps: [
        {
          step: 1,
          stage: "Antigen Capture",
          mechanism: "Tissue dendritic cells engulf foreign pathogens and migrate via afferent lymphatics into regional lymph node.",
          feedbackLoop: "Chemokine receptor CCR7 directs homing into T-cell paracortex."
        },
        {
          step: 2,
          stage: "T-Cell Activation",
          mechanism: "TCR binds MHC-II-antigen complex with CD28-B7 costimulation, triggering IL-2 clonal proliferation.",
          feedbackLoop: "CTLA-4 and PD-1 pathways provide inhibitory feedback to prevent autoimmunity."
        },
        {
          step: 3,
          stage: "Humoral Plasma Differentiation",
          mechanism: "Follicular helper T-cells induce B-cells in germinal centers to undergo somatic hypermutation and class-switch into IgG/IgA.",
          feedbackLoop: "Antibodies circulate systemically to neutralize antigens and activate complement."
        }
      ]
    },
    biomarkers: [
      {
        name: "Absolute Lymphocyte Count (ALC)",
        standardRange: "1.0 - 4.8",
        unit: "x10³/μL",
        elevatedIndication: "Viral Infections, Chronic Lymphocytic Leukemia (CLL), Mononucleosis",
        lowIndication: "Immunodeficiency, Viral Destruction (HIV), Severe Stress/Corticosteroids"
      }
    ],
    pathologies: [
      {
        name: "Chronic Lymphadenitis & Tonsillar Hypertrophy",
        icdCode: "I88.9",
        miasm: "Tubercular",
        pathophysiology: "Persistent antigenic challenge leading to benign follicular hyperplasia of lymphoid tissue.",
        keySigns: ["Enlarged painless or tender lymph nodes", "Chronic sore throat", "Post-nasal drip", "Malaise"],
        homeopathicSimilimum: ["Baryta Carbonica", "Merc Sol", "Phytolacca", "Calcarea Carb", "Silicea"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Phytolacca Decandra",
        potencyScope: "30C to 1M",
        targetTissues: ["Lymph Nodes", "Tonsils", "Mammary Glands"],
        keynoteRubrics: ["Throat; pain, swallowing; shooting to ears", "Glands; swelling, stony hard; lymph nodes", "Mouth; tongue, red tip, protruded"],
        modalities: { worse: "Cold damp weather, swallowing hot drinks, right side", better: "Warm dry weather, rest" },
        clinicalPearls: "Specific for hard, swollen lymphatic glands, intense follicular tonsillitis, and pain shooting into the ears upon swallowing."
      },
      {
        remedyName: "Baryta Carbonica",
        potencyScope: "30C to 200C",
        targetTissues: ["Cervical Lymphatics", "Tonsils", "Vascular Endothelium"],
        keynoteRubrics: ["Throat; tonsillitis, chronic, suppurating on least cold", "Mind; shyness, backwardness, lack of self-confidence", "Generalities; glandular swelling, induration"],
        modalities: { worse: "Cold air, washing head, thinking of complaints", better: "Walking in open air, warm wrapping" },
        clinicalPearls: "Indicated in individuals with chronic tonsillar enlargement who catch cold from the least exposure and suffer chronic glandular induration."
      }
    ]
  },

  reproductive: {
    systemId: "reproductive",
    systemName: "Reproductive System",
    latinName: "Systema Genitale",
    functionalMotto: "Gametogenesis, Steroidogenesis & Reproductive Perpetuation",
    structures: [
      {
        id: "uterine_myometrium_endometrium",
        name: "Uterine Wall & Endometrial Layers",
        subOrganId: "uterine_tract",
        vascularSupply: "Uterine arteries from internal iliac; spiral arteries supplying functionalis layer",
        innervation: "Uterovaginal plexus from inferior hypogastric plexus",
        histology: "Stratum functionalis (cyclically shed) and stratum basalis, surrounded by interlacing smooth myometrium",
        clinicalSignificance: "Implantation site for blastocyst, sustaining gestation and delivering rhythmic labor contractions."
      }
    ],
    cascade: {
      title: "Hypothalamic-Pituitary-Gonadal (HPG) Cycle",
      description: "GnRH pulses $\\rightarrow$ LH/FSH secretion $\\rightarrow$ Ovarian/Testicular steroidogenesis $\\rightarrow$ Ovulation/Spermatogenesis.",
      steps: [
        {
          step: 1,
          stage: "Pulsatile GnRH Release",
          mechanism: "Arcuate nucleus of hypothalamus secretes GnRH pulses every 60-90 minutes into portal circulation.",
          feedbackLoop: "Continuous non-pulsatile GnRH causes receptor downregulation."
        },
        {
          step: 2,
          stage: "Gonadotropin Surge",
          mechanism: "FSH stimulates follicular growth and aromatase synthesis of Estradiol; LH surge triggers follicular rupture (ovulation).",
          feedbackLoop: "High estradiol in late follicular phase flips to positive feedback for LH surge."
        },
        {
          step: 3,
          stage: "Luteal Progesterone Production",
          mechanism: "Ruptured follicle transforms into Corpus Luteum, producing high Progesterone to mature the endometrium.",
          feedbackLoop: "Absence of hCG causes corpus luteum regression, precipitating menses."
        }
      ]
    },
    biomarkers: [
      {
        name: "Progesterone (Mid-Luteal Phase)",
        standardRange: "5.0 - 25.0",
        unit: "ng/mL",
        elevatedIndication: "Confirmed Ovulation, Pregnancy, Luteal Cyst",
        lowIndication: "Anovulatory Cycle, Luteal Phase Defect"
      },
      {
        name: "Total Serum Testosterone",
        standardRange: "300 - 1000 (M) / 15 - 70 (F)",
        unit: "ng/dL",
        elevatedIndication: "PCOS (in females), Androgen-secreting Tumor",
        lowIndication: "Male Hypogonadism, Andropause, Adrenal Insufficiency"
      }
    ],
    pathologies: [
      {
        name: "Dysmenorrhea & Endometriosis",
        icdCode: "N94.6",
        miasm: "Sycosis",
        pathophysiology: "Excessive PGF2alpha uterine prostaglandins causing myometrial ischemia, or ectopic endometrial implants outside uterus.",
        keySigns: ["Severe cramping pelvic pain", "Radiating to lower back and thighs", "Heavy clotted menses", "Nausea with cramps"],
        homeopathicSimilimum: ["Sepia", "Pulsatilla", "Sabina", "Magnesia Phos", "Chamomilla"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Sepia Officinalis",
        potencyScope: "30C to 10M",
        targetTissues: ["Pelvic Venous Plexus", "Uterine Ligaments", "HPG Axis"],
        keynoteRubrics: ["Female; bearing down, uterus; must cross legs to prevent protrusion", "Mind; indifference, loved ones to; irritability", "Generalities; weakness, stagnation; better vigorous exercise"],
        modalities: { worse: "Cold air, morning, evening, standing, laundry work", better: "Vigorous exertion, dancing, warmth, pressure" },
        clinicalPearls: "The supreme pelvic venous regulator: sensation of pelvic heaviness with bearing-down, mental indifference, and relief from vigorous exercise."
      },
      {
        remedyName: "Pulsatilla Pratensis",
        potencyScope: "30C to 1M",
        targetTissues: ["Ovaries", "Endometrium", "Venous Circulation"],
        keynoteRubrics: ["Female; menses, delayed, suppressed by getting feet wet", "Mind; weeping, gentle; consolation relieves", "Generalities; changeable symptoms; thirstless with dry mouth"],
        modalities: { worse: "Warm closed room, rich fatty food, evening", better: "Open cool fresh air, gentle walking, consolation" },
        clinicalPearls: "Extremely changeable symptoms, delayed or suppressed menses, mild weeping disposition, and total thirstlessness."
      }
    ]
  },

  integumentary: {
    systemId: "integumentary",
    systemName: "Integumentary System",
    latinName: "Integumentum Commune",
    functionalMotto: "Stratified Epithelial Shield, Acid Mantle & Thermoregulation",
    structures: [
      {
        id: "epidermal_strata",
        name: "Epidermal Strata (Corneum to Basale)",
        subOrganId: "epidermis",
        vascularSupply: "Avascular; nourished via passive diffusion from dermal capillary loops",
        innervation: "Free nerve endings (pain/temperature) and Merkel discs (fine touch)",
        histology: "Stratum corneum, lucidum, granulosum, spinosum, and basale renewing every 28 days",
        clinicalSignificance: "Primary physical, microbiological, and chemical barrier protecting internal tissues."
      }
    ],
    cascade: {
      title: "Keratinization & Barrier Lipid Envelope Formation",
      description: "Basal stem cell division $\\rightarrow$ Keratohyalin synthesis $\\rightarrow$ Lamellar body lipid extrusion $\\rightarrow$ Corneocyte cornification.",
      steps: [
        {
          step: 1,
          stage: "Basal Mitosis",
          mechanism: "Stem cells in stratum basale divide, giving rise to keratinocytes attached by desmosomes.",
          feedbackLoop: "EGF and TGF-alpha regulate mitotic turnover rate."
        },
        {
          step: 2,
          stage: "Lipid Matrix Secretion",
          mechanism: "Granulosum cells extrude lamellar bodies packed with ceramides, cholesterol, and free fatty acids.",
          feedbackLoop: "Establishes 'brick-and-mortar' hydrophobic barrier preventing water loss (TEWL)."
        },
        {
          step: 3,
          stage: "Desquamation",
          mechanism: "Kallikrein enzymes degrade corneodesmosomes under optimal skin acid mantle (pH 4.5-5.5).",
          feedbackLoop: "Alkaline pH disrupts enzyme kinetics, causing scaling and xerosis."
        }
      ]
    },
    biomarkers: [
      {
        name: "Serum Total IgE",
        standardRange: "< 100.0",
        unit: "IU/mL",
        elevatedIndication: "Atopic Dermatitis, Eczema, Allergic Hypersensitivity, Parasitic Infection",
        lowIndication: "Normal Non-atopic Immunological State"
      }
    ],
    pathologies: [
      {
        name: "Atopic Eczema & Chronic Dermatitis",
        icdCode: "L20.9",
        miasm: "Psora",
        pathophysiology: "Filaggrin gene mutation and Th2-skewed inflammation producing defective barrier and intense pruritus.",
        keySigns: ["Dry lichenified patches", "Intense nocturnal itching", "Vesicular oozing or flaking", "Flexural distribution"],
        homeopathicSimilimum: ["Sulphur", "Graphites", "Psorinum", "Petroleum", "Mezereum"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Sulphur",
        potencyScope: "30C to 10M",
        targetTissues: ["Epidermis", "Sebaceous Glands", "Capillary Bed"],
        keynoteRubrics: ["Skin; itching, voluptuous; scratch until it bleeds", "Skin; eruptions, burning after scratching", "Generalities; heat, burning; feet out of covers at night"],
        modalities: { worse: "Water, washing, warmth of bed, 11 AM standing", better: "Dry warm weather, open air" },
        clinicalPearls: "The king of skin remedies: intense voluptuous itching where scratching feels delicious but is followed by burning and soreness."
      },
      {
        remedyName: "Graphites",
        potencyScope: "30C to 1M",
        targetTissues: ["Skin Fissures", "Flexures", "Connective Tissue"],
        keynoteRubrics: ["Skin; eruptions, exudation, sticky honey-like fluid", "Skin; fissures, cracks behind ears, nipples, corners of mouth", "Generalities; obesity, chilliness, constipation with"],
        modalities: { worse: "Warmth, night, menses, cold damp air", better: "Wrapping up, walking in open air" },
        clinicalPearls: "Thick, hard, cracked skin in flexures exuding a sticky, glue-like, honey-colored watery secretion."
      }
    ]
  },

  sensory: {
    systemId: "sensory",
    systemName: "Special Sensory System",
    latinName: "Organa Sensuum",
    functionalMotto: "Photoreceptive Transduction, Auditory Tonotopy & Equilibrium",
    structures: [
      {
        id: "retinal_photoreceptors",
        name: "Retina & Macular Fovea",
        subOrganId: "ocular_globe",
        vascularSupply: "Central retinal artery (branch of ophthalmic artery from internal carotid)",
        innervation: "Optic Nerve (Cranial Nerve II) transmitting visual signals to lateral geniculate nucleus",
        histology: "10 retinal layers; Rods (120 million, low light) & Cones (6 million, color and high-acuity fovea)",
        clinicalSignificance: "Transduces photon wavelengths (400-700 nm) into visual neural representations."
      },
      {
        id: "organ_of_corti",
        name: "Cochlear Organ of Corti",
        subOrganId: "cochlea_vestibular",
        vascularSupply: "Labyrinthine artery from anterior inferior cerebellar artery (AICA)",
        innervation: "Vestibulocochlear Nerve (Cranial Nerve VIII)",
        histology: "Inner and outer hair cells resting on basilar membrane with stereocilia embedded in tectorial membrane",
        clinicalSignificance: "Decomposes acoustic sound waves across frequency spectrum (20 Hz to 20,000 Hz)."
      }
    ],
    cascade: {
      title: "Phototransduction & Auditory Hair Cell Transduction",
      description: "Photon absorption by 11-cis-retinal $\\rightarrow$ Rhodopsin activation $\\rightarrow$ Transducin $\\rightarrow$ cGMP breakdown $\\rightarrow$ Photoreceptor hyperpolarization.",
      steps: [
        {
          step: 1,
          stage: "Dark Current",
          mechanism: "High intracellular cGMP keeps $Na^+/Ca^{2+}$ channels open, continuously releasing glutamate in darkness.",
          feedbackLoop: "Guanylyl cyclase maintains basal cGMP levels."
        },
        {
          step: 2,
          stage: "Photon Isomerization",
          mechanism: "Light converts 11-cis-retinal to all-trans-retinal, activating Metarhodopsin II.",
          feedbackLoop: "Rhodopsin kinase and Arrestin rapidly quench active rhodopsin."
        },
        {
          step: 3,
          stage: "Hyperpolarization Spike",
          mechanism: "Phosphodiesterase-6 breaks down cGMP, closing cation channels and hyperpolarizing membrane to -70 mV.",
          feedbackLoop: "Decreased glutamate release signals bipolar cells to fire optic nerve action potentials."
        }
      ]
    },
    biomarkers: [
      {
        name: "Intraocular Pressure (IOP)",
        standardRange: "10 - 21",
        unit: "mmHg",
        elevatedIndication: "Ocular Hypertension, Glaucoma Risk",
        lowIndication: "Ocular Hypotony, Post-surgical Leak"
      }
    ],
    pathologies: [
      {
        name: "Allergic Ocular Asthenopia & Conjunctivitis",
        icdCode: "H10.1",
        miasm: "Psora",
        pathophysiology: "Mast cell degranulation on ocular surface releasing histamine, producing vascular engorgement and profuse lacrimation.",
        keySigns: ["Burning acrid tears", "Intense photophobia", "Conjunctival hyperemia", "Eyestrain headaches"],
        homeopathicSimilimum: ["Euphrasia", "Ruta Graveolens", "Allium Cepa", "Pulsatilla", "Belladonna"]
      }
    ],
    homeopathicAffinities: [
      {
        remedyName: "Euphrasia Officinalis (Eyebright)",
        potencyScope: "3X to 200C",
        targetTissues: ["Conjunctiva", "Cornea", "Lacrimal Glands"],
        keynoteRubrics: ["Eye; lacrimation, acrid, burning; with bland nasal discharge", "Eye; photophobia, daylight; burning in eyes", "Eye; lids, agglutinated in morning"],
        modalities: { worse: "Evening, indoor warmth, light, wind", better: "Open air, dark room, bathing eyes in cool water" },
        clinicalPearls: "The classic key comparison: Euphrasia has burning acrid lacrimation with bland nasal coryza (opposite of Allium Cepa)."
      },
      {
        remedyName: "Ruta Graveolens",
        potencyScope: "30C to 200C",
        targetTissues: ["Ciliary Muscle", "Ocular Tendons", "Periosteum"],
        keynoteRubrics: ["Eye; asthenopia, fine work, reading, screens from", "Eye; pain, aching, balls of fire, burning", "Head; pain, forehead; after eyestrain"],
        modalities: { worse: "Fine close work, reading at night, cold damp", better: "Rest, lying with closed eyes, gentle warmth" },
        clinicalPearls: "Specific for modern computer vision syndrome, accommodative eyestrain, and ciliary muscle spasm from prolonged near focus."
      }
    ]
  }
};
