"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Sparkles, Filter, CheckCircle2, 
  ArrowRight, ArrowLeft, Phone, MessageSquare, ShieldCheck, Truck, Clock,
  Sliders, Plus, Trash2, Share2, Copy, Save, LayoutGrid, Layers, Activity,
  Info, Percent, HelpCircle, UserCheck, Folder, FileSpreadsheet, AlertTriangle,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

interface Package {
  id: string;
  title: string;
  price?: string;
  priceWeekly?: string;
  priceMonthly?: string;
  category: "consultation" | "specialty";
  desc: string;
  features: string[];
  duration: string;
  badge?: string;
  glowColor: string;
  colorTheme?: {
    text: string;
    border: string;
    bg: string;
    badgeBg: string;
    badgeText: string;
    glow: string;
  };
  productId?: string;
  productIdWeekly?: string;
  productIdMonthly?: string;
}

const packages: Package[] = [
  {
    id: "focused-care",
    title: "Deep Systemic Care",
    priceWeekly: "₹3,500",
    priceMonthly: "₹12,500",
    category: "consultation",
    desc: "Deep homeopathic treatment for complex chronic or systemic health conditions (e.g. asthma, migraine, severe eczema).",
    features: [
      "Targeted single-condition evaluation",
      "Custom constitutional remedy preparation",
      "Standard diet & allergen avoidance instructions",
      "Standard clinical response monitoring"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(147,51,234,0.15)",
    colorTheme: {
      text: "text-purple-700 dark:text-purple-400",
      border: "border-purple-200/80 hover:border-purple-400/80 dark:border-purple-950 dark:hover:border-purple-800",
      bg: "bg-purple-500/[0.04] dark:bg-purple-950/20",
      badgeBg: "bg-purple-100 dark:bg-purple-950/40 border border-purple-200/50",
      badgeText: "text-purple-700 dark:text-purple-300",
      glow: "rgba(147,51,234,0.15)"
    },
    productIdWeekly: "focused_care_weekly",
    productIdMonthly: "focused_care_monthly"
  },
  {
    id: "recommended-system-care",
    title: "Advanced Pathological Care",
    priceWeekly: "₹5,000",
    priceMonthly: "₹18,500",
    category: "consultation",
    desc: "Targeted recovery protocols for deep-seated pathology, including organ system rebalancing and biomarker reviews.",
    features: [
      "Primary organ system constitutional analysis",
      "Systemic homeopathic rebalancing protocol",
      "Biomarker checks & lab report reviews",
      "Comprehensive systemic dietary guidelines"
    ],
    duration: "Flexible Billing",
    badge: "⭐ Recommended",
    glowColor: "rgba(59,130,246,0.15)",
    colorTheme: {
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-300/80 hover:border-indigo-500/80 dark:border-indigo-900 dark:hover:border-indigo-700 shadow-sm shadow-indigo-500/5",
      bg: "bg-indigo-500/[0.04] dark:bg-indigo-950/20",
      badgeBg: "bg-indigo-600 dark:bg-indigo-500 border border-indigo-700",
      badgeText: "text-white",
      glow: "rgba(59,130,246,0.2)"
    },
    productIdWeekly: "system_care_weekly",
    productIdMonthly: "system_care_monthly"
  },
  {
    id: "comprehensive-care",
    title: "Multisystem Integrative Care",
    priceWeekly: "₹7,000",
    priceMonthly: "₹25,000",
    category: "consultation",
    desc: "High-intensity multi-organ care program under direct physician supervision for advanced chronic diseases.",
    features: [
      "Deeper multi-system constitutional evaluation",
      "Deeper chronic pathology case reviews",
      "High-frequency dosage reviews & titration",
      "Ongoing supervision by clinical team"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(16,185,129,0.15)",
    colorTheme: {
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200/80 hover:border-emerald-400/80 dark:border-emerald-950 dark:hover:border-emerald-800",
      bg: "bg-emerald-500/[0.04] dark:bg-emerald-950/20",
      badgeBg: "bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/50",
      badgeText: "text-emerald-700 dark:text-emerald-300",
      glow: "rgba(16,185,129,0.15)"
    },
    productIdWeekly: "comprehensive_care_weekly",
    productIdMonthly: "comprehensive_care_monthly"
  },
  {
    id: "advanced-care",
    title: "Advanced Care",
    priceWeekly: "Personalized",
    priceMonthly: "After evaluation",
    category: "consultation",
    desc: "Advanced strategic medical supervision for complex cases requiring expert clinical coordination.",
    features: [
      "Strategic medical supervision by Dr. Jethwani",
      "Complex pathology integration analysis",
      "High-frequency clinical updates",
      "Collaborative diagnostic plan customization"
    ],
    duration: "Personalized Care",
    glowColor: "rgba(234,179,8,0.15)",
    colorTheme: {
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200/80 hover:border-amber-400/80 dark:border-amber-950 dark:hover:border-amber-800",
      bg: "bg-amber-500/[0.04] dark:bg-amber-950/20",
      badgeBg: "bg-amber-100 dark:bg-amber-950/40 border border-amber-200/50",
      badgeText: "text-amber-700 dark:text-amber-300",
      glow: "rgba(234,179,8,0.15)"
    }
  },
  {
    id: "heart-care",
    title: "Supportive Heart Care",
    price: "₹6,000.00 – ₹10,000.00",
    category: "specialty",
    desc: "Co-management of hypertension, cardiac palpitations, and lipid balance alongside allopathy.",
    features: [
      "Cardiovascular autonomic monitoring",
      "Targeted circulation & arterial remedies",
      "Biomarker outcome tracking (cholesterol/BP)",
      "Coordinated safety with cardiologist prescription"
    ],
    duration: "Chronic Care Program",
    glowColor: "rgba(239,68,68,0.15)",
    productId: "heart_care"
  },
  {
    id: "diabease",
    title: "DiabEaseCare Program",
    price: "₹6,000.00 – ₹10,000.00",
    category: "specialty",
    desc: "Supportive endocrine remedies to regulate insulin sensitivity and prevent diabetic complications.",
    features: [
      "Pancreatic cellular support remedies",
      "Peripheral neuropathy mitigation",
      "HbA1c progress mapping charts",
      "Specialized diabetic foot & nerve safety"
    ],
    duration: "Chronic Care Program",
    glowColor: "rgba(34,197,94,0.15)",
    productId: "diabease"
  },
  {
    id: "hair-care",
    title: "Homeo Hair Care",
    price: "₹6,000.00 – ₹10,000.00",
    category: "specialty",
    desc: "Constitutional remedies addressing alopecia, chronic dandruff, and stress-induced telogen effluvium.",
    features: [
      "Scalp & follicular vital analysis",
      "Targeted follicular nourishment remedies",
      "Hormonal/thyroid axis rebalancing",
      "Custom anti-dandruff oil formulas"
    ],
    duration: "Hair Vitality Plan",
    glowColor: "rgba(20,184,166,0.15)",
    productId: "hair_care"
  },
  {
    id: "cancer-care",
    title: "Homeopathic Cancer Care Services",
    price: "₹9,000.00 – ₹75,000.00",
    category: "specialty",
    desc: "Integrative supportive care to reduce toxicity, nausea, and neuropathic pain from chemo and radiation.",
    features: [
      "Vital force resuscitation therapy",
      "Non-toxic chemotherapy side-effect mitigation",
      "Appetite and stamina stabilization",
      "Close coordination with conventional oncology teams"
    ],
    duration: "Oncology Support Plan",
    badge: "Clinical Specialty",
    glowColor: "rgba(132,204,22,0.15)",
    productId: "cancer_care"
  },
  {
    id: "pediatric-care",
    title: "Homeo Pediatric Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Gentle child-friendly remedies for recurrent tonsillitis, asthma, behavioral issues, and growth.",
    features: [
      "Childhood lymphatic decongestion remedies",
      "Non-suppressive cold & fever protocols",
      "Sweet pills, highly accepted by infants",
      "Immune learning desensitization schedules"
    ],
    duration: "Pediatric Wellness Plan",
    glowColor: "rgba(245,158,11,0.15)",
    productId: "pediatric_care"
  },
  {
    id: "hypertension",
    title: "Hypertension Homeopathic Treatment",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Vascular dilation and parasympathetic activation to regulate systemic blood pressure naturally.",
    features: [
      "Arterial smooth muscle relaxant remedies",
      "HPA axis tension reduction support",
      "Clinical blood pressure profile logs",
      "Lifestyle & cardiovascular dietary guidelines"
    ],
    duration: "BP Regulation Program",
    glowColor: "rgba(99,102,241,0.15)",
    productId: "hypertension"
  },
  {
    id: "joints-care",
    title: "Homeo Joints Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Anti-inflammatory and lubricating protocols for rheumatoid arthritis, gout, and spinal spondylosis.",
    features: [
      "Synovial fluid lubrication remedies",
      "Uric acid renal elimination support",
      "Morning rigidity reduction logs",
      "Safe, non-steroidal pain mitigation"
    ],
    duration: "Joint Mobility Program",
    glowColor: "rgba(249,115,22,0.15)",
    productId: "joints_care"
  },
  {
    id: "skin-care",
    title: "Homeo Skin Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Deep constitutional relief for psoriasis plaques, chronic eczema flares, hives, and vitiligo.",
    features: [
      "Epidermal turn-over control remedies",
      "Gut barrier permeability (leaky gut) sealing",
      "Outward toxin venting tracking",
      "Steroid withdrawal rehabilitation"
    ],
    duration: "Dermal Recovery Program",
    glowColor: "rgba(20,184,166,0.15)",
    productId: "skin_care"
  },
  {
    id: "lungs-care",
    title: "Homeo Lungs Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Alleviates bronchial spasms, COPD airway limits, and severe dust/pollen sensitivities.",
    features: [
      "Bronchial muscle relaxant remedies",
      "IgE allergic antibody stabilization",
      "Mucus liquidity & clearing support",
      "Seasonal cold exposure profiling"
    ],
    duration: "Respiratory Recovery",
    glowColor: "rgba(6,182,212,0.15)",
    productId: "lungs_care"
  },
  {
    id: "digestive-care",
    title: "Homeo Digestive Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Visceral motor coordination for IBS, chronic acid reflux, GERD, constipation, and liver strain.",
    features: [
      "Enteric nervous system calm remedies",
      "Acidity & sour belching neutralization",
      "Hepatocyte cell regeneration support",
      "Bowel motility synchronization"
    ],
    duration: "Gastro-Intestinal Reset",
    glowColor: "rgba(16,185,129,0.15)",
    productId: "digestive_care"
  },
  {
    id: "neuro-care",
    title: "Homeo Neuro Care",
    price: "₹6,000.00 – ₹20,000.00",
    category: "specialty",
    desc: "Relief for chronic vascular headaches, neuralgias, synaptic exhaustion, and sleep patterns.",
    features: [
      "Vascular dilation remedies for migraine",
      "Trigeminal & peripheral nerve soothing",
      "Circadian rhythm sleep stabilization",
      "Cognitive fatigue & synaptic recovery"
    ],
    duration: "Neurological Rebalance",
    glowColor: "rgba(168,85,247,0.15)",
    productId: "neuro_care"
  }
];

export interface SavedConfig {
  id: string;
  name: string;
  careLevel: "mild" | "moderate" | "focused" | "organ" | "comprehensive";
  billingCycle: "weekly" | "monthly";
  durationValue: number;
  finalPrice: number;
  date: string;
  conditionsCount: number;
}


const careLevelsDetails = {
  mild: {
    title: "Acute & Wellness Care",
    weeklyPrice: 1000,
    monthlyPrice: 3500,
    badge: "Acute & General Support",
    icon: "🌱",
    description: "Ideal for general immunity, hair fall, seasonal acute complaints, or general wellness guidance.",
    features: [
      "General constitutional wellness analysis",
      "Corrective micro-dosing remedy supply",
      "Standard wellness dietary guide sheet",
      "WhatsApp clinical team updates (bi-weekly)"
    ],
    glowColor: "rgba(20,184,166,0.15)"
  },
  moderate: {
    title: "Standard Chronic Care",
    weeklyPrice: 2000,
    monthlyPrice: 7500,
    badge: "Focused Chronic Management",
    icon: "⚡",
    description: "Designed for a single chronic condition (e.g. eczema, IBS, thyroid) requiring active tracking and bi-weekly checks.",
    features: [
      "Single chronic condition profile mapping",
      "Targeted constitutional remedy preparation",
      "Anti-inflammatory diet & lifestyle sheets",
      "Standard clinical response monitoring checkups"
    ],
    glowColor: "rgba(168,85,247,0.15)"
  },
  focused: {
    title: "Deep Systemic Care",
    weeklyPrice: 3500,
    monthlyPrice: 12500,
    badge: "Complex Chronic Therapy",
    icon: "🎯",
    description: "Deep management of complex chronic or systemic health conditions (e.g. asthma, migraine, severe eczema).",
    features: [
      "Deep-seated target system pathology analysis",
      "High-potency customized constitutional dilutions",
      "Custom anti-inflammatory & allergen guides",
      "Priority clinical checkins over WhatsApp"
    ],
    glowColor: "rgba(14,165,233,0.15)"
  },
  organ: {
    title: "Advanced Pathological Care",
    weeklyPrice: 5000,
    monthlyPrice: 18500,
    badge: "Organ System Recovery",
    icon: "🫁",
    description: "Advanced recovery protocols for deep-seated pathology, including organ system rebalancing and biomarker reviews.",
    features: [
      "Multi-remedy support for organ pathology",
      "Advanced systemic rebalancing protocols",
      "Biomarker timeline mapping & reviews",
      "Personalized organ-support lifestyle sheets"
    ],
    glowColor: "rgba(16,185,129,0.15)"
  },
  comprehensive: {
    title: "Multisystem Integrative Care",
    weeklyPrice: 7000,
    monthlyPrice: 25000,
    badge: "Multi-Organ Intensive Care",
    icon: "🔮",
    description: "For long-standing, multi-system chronic pathologies requiring intensive clinical supervision by Dr. Jethwani.",
    features: [
      "Multi-organ pathogenetic profile mapping",
      "Direct clinical supervision by Dr. Jethwani",
      "High-frequency dosage titrations & reviews",
      "Direct priority clinical assistance channel"
    ],
    glowColor: "rgba(244,63,94,0.15)"
  }
};

const shippingCountries = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Australia",
  "Other"
];

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const majorIndianCities = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Surat",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivli",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Solapur",
  "Hubli-Dharwad",
  "Mysore",
  "Gurgaon",
  "Aligarh",
  "Jalandhar",
  "Bhubaneswar",
  "Salem",
  "Warangal",
  "Guntur",
  "Amravati",
];

interface DiseaseConfig {
  name: string;
  careLevel: "mild" | "moderate" | "focused" | "organ" | "comprehensive";
  conditionsCount: number;
  rationale: string;
}

interface DiseaseCategory {
  id: string;
  label: string;
  icon: string;
  conditions: DiseaseConfig[];
}

const diseaseCategories: DiseaseCategory[] = [
  {
    id: "skin-hair",
    label: "Dermatology & Hair",
    icon: "🧴",
    conditions: [
      { name: "Alopecia Areata / Hair Fall", careLevel: "mild", conditionsCount: 1, rationale: "Constitutional trichology care to arrest hair fall and stimulate follicle regrowth." },
      { name: "Chronic Eczema / Dermatitis", careLevel: "moderate", conditionsCount: 1, rationale: "Restores skin barrier function, targets chronic flares, and includes detailed diet sheets." },
      { name: "Severe Psoriasis Vulgaris", careLevel: "focused", conditionsCount: 1, rationale: "Systemic immunomodulatory treatment targeting rapid epidermal turnover." },
      { name: "Vitiligo / Leukoderma", careLevel: "focused", conditionsCount: 1, rationale: "Deep pigment rebalancing, melanocyte activation, and long-term supervision." },
      { name: "Lichen Planus (Dermal/Oral)", careLevel: "focused", conditionsCount: 1, rationale: "Targets chronic mucosal or cutaneous auto-aggressive inflammatory lesions." },
      { name: "Chronic Urticaria / Hives", careLevel: "moderate", conditionsCount: 1, rationale: "Histamine pathway desensitization and chronic allergy mapping." },
      { name: "Seborrheic Dermatitis", careLevel: "moderate", conditionsCount: 1, rationale: "Normalizes scalp sebum secretions and controls fungal colonization." },
      { name: "Melasma & Hyperpigmentation", careLevel: "mild", conditionsCount: 1, rationale: "Hormonal & dermal pigment rebalancing with photoprotection guidance." }
    ]
  },
  {
    id: "lungs-respiratory",
    label: "Respiratory & Pulmonology",
    icon: "🫁",
    conditions: [
      { name: "Allergic Rhinitis / Sinusitis", careLevel: "moderate", conditionsCount: 1, rationale: "Targets mucosal hyper-reactivity, chronic congestion, and sinus drainage." },
      { name: "Bronchial Asthma", careLevel: "focused", conditionsCount: 1, rationale: "Constitutional treatment to reduce airway bronchospasm and dependency on inhalers." },
      { name: "COPD / Emphysema", careLevel: "organ", conditionsCount: 1, rationale: "Advanced pathological support to optimize remaining lung capacity and reduce dyspnea." },
      { name: "Chronic Bronchitis", careLevel: "moderate", conditionsCount: 1, rationale: "Clears productive cough, resolves bronchial wall inflammation, and maps triggers." },
      { name: "Adenoid Hypertrophy (Pediatric)", careLevel: "moderate", conditionsCount: 1, rationale: "Aims to shrink hypertrophied tonsillar/adenoid tissue and improve nasal breathing." },
      { name: "Nasal Polyps", careLevel: "focused", conditionsCount: 1, rationale: "Targets recurrent mucosal growths and sinus congestion to avoid surgical interventions." }
    ]
  },
  {
    id: "digestive-liver",
    label: "Gastroenterology & Liver",
    icon: "🥑",
    conditions: [
      { name: "Acid Reflux / GERD / Gastritis", careLevel: "mild", conditionsCount: 1, rationale: "Constitutional gut restoration, lower esophageal sphincter toning, and diet guide." },
      { name: "Chronic IBS (Irritable Bowel)", careLevel: "moderate", conditionsCount: 1, rationale: "Addresses visceral hypersensitivity and aligns the gut-brain axis." },
      { name: "Fatty Liver / Elevated Enzymes", careLevel: "organ", conditionsCount: 1, rationale: "Reverses hepatocyte lipid accumulation and monitors liver biomarker recovery." },
      { name: "Ulcerative Colitis / Crohn's", careLevel: "organ", conditionsCount: 2, rationale: "Mucosal healing, pathogenetic immune moderation, and flare co-management." },
      { name: "Chronic Constipation & Piles", careLevel: "moderate", conditionsCount: 1, rationale: "Improves bowel motility and venous congestion in the rectal plexus." },
      { name: "Fissure-in-Ano / Fistula support", careLevel: "focused", conditionsCount: 1, rationale: "Speeds up mucosal healing, controls painful spasms, and manages chronic drainage." },
      { name: "Gallstones (Cholelithiasis) prevention", careLevel: "moderate", conditionsCount: 1, rationale: "Aims to improve bile solubility and prevent stone enlargement / new formations." }
    ]
  },
  {
    id: "kidney-urinary",
    label: "Nephrology & Urology",
    icon: "💧",
    conditions: [
      { name: "Recurrent UTIs / Cystitis", careLevel: "moderate", conditionsCount: 1, rationale: "Improves bladder mucosal immunity and resolves chronic low-grade bacterial colonization." },
      { name: "Early Chronic Kidney Disease (CKD)", careLevel: "organ", conditionsCount: 1, rationale: "GFR preservation, nephron support, and coordination with regular nephrology tests." },
      { name: "Kidney Stones (Nephrolithiasis)", careLevel: "moderate", conditionsCount: 1, rationale: "Facilitates stone expulsion, targets spasm pain, and prevents recurrence." },
      { name: "Chronic Prostatitis", careLevel: "focused", conditionsCount: 1, rationale: "Targets deep pelvic congestion, perineal discomfort, and chronic prostatic inflammation." },
      { name: "Benign Prostatic Hyperplasia (BPH)", careLevel: "focused", conditionsCount: 1, rationale: "Aims to improve urinary flow velocity, reduce nocturia, and relax bladder neck." }
    ]
  },
  {
    id: "endocrine-metabolic",
    label: "Endocrinology & Diabetes",
    icon: "🧬",
    conditions: [
      { name: "Hypothyroidism (Hashimoto's)", careLevel: "focused", conditionsCount: 1, rationale: "Addresses auto-immune thyroiditis, metabolic slows, and optimizes hormone levels." },
      { name: "Insulin Resistance / Pre-Diabetes", careLevel: "moderate", conditionsCount: 1, rationale: "Targets receptor sensitivity, manages postprandial spikes, and tracks metabolic health." },
      { name: "Type 2 Diabetes Mellitus", careLevel: "focused", conditionsCount: 1, rationale: "Constitutional endocrine support to regulate glucose levels and prevent microvascular risks." },
      { name: "Hyperuricemia / Gout", careLevel: "moderate", conditionsCount: 1, rationale: "Normalizes renal uric acid excretion and prevents recurrent painful joint deposits." },
      { name: "Chronic Adrenal Burnout / Fatigue", careLevel: "mild", conditionsCount: 1, rationale: "Restores HPA-axis balance, sleep rhythms, and energy production." }
    ]
  },
  {
    id: "joints-bones",
    label: "Rheumatology & Orthopedics",
    icon: "🦴",
    conditions: [
      { name: "Cervical / Lumbar Spondylosis", careLevel: "moderate", conditionsCount: 1, rationale: "Manages disc degeneration, osteophytic changes, and localized nerve compression." },
      { name: "Osteoarthritis (Single/Double Joint)", careLevel: "moderate", conditionsCount: 1, rationale: "Targets synovial fluid maintenance, cartilage protection, and mobility tracking." },
      { name: "Rheumatoid Arthritis (RA)", careLevel: "organ", conditionsCount: 2, rationale: "Systemic autoimmune joint management with immunomodulating remedies." },
      { name: "Ankylosing Spondylitis", careLevel: "organ", conditionsCount: 2, rationale: "Focuses on spine flexibility, morning stiffness reduction, and systemic inflammation." },
      { name: "Osteoporosis / Bone Density loss", careLevel: "mild", conditionsCount: 1, rationale: "Mineral assimilation support, bone density tracking, and constitutional wellness." }
    ]
  },
  {
    id: "brain-neuro",
    label: "Neurology & Brain",
    icon: "🧠",
    conditions: [
      { name: "Vascular Migraine / Headaches", careLevel: "focused", conditionsCount: 1, rationale: "Targets neurological vasodilation, reduces trigger sensitivity, and curtails attack frequency." },
      { name: "Fibromyalgia & Chronic Pain", careLevel: "focused", conditionsCount: 1, rationale: "Balances central pain pathways, improves sleep architecture, and reduces fatigue." },
      { name: "Sciatica / Lumbar Radiculopathy", careLevel: "moderate", conditionsCount: 1, rationale: "Relieves nerve root compression, reduces neural swelling, and restores motor power." },
      { name: "Trigeminal Neuralgia", careLevel: "focused", conditionsCount: 1, rationale: "Deep nerve-sheath rebalancing to control sharp, paroxysmal facial pain." },
      { name: "Anxiety & Mild Depression", careLevel: "moderate", conditionsCount: 1, rationale: "Constitutional neuro-emotional rebalancing, sleep monitoring, and stress resilience." },
      { name: "Chronic Insomnia / Sleep Disorders", careLevel: "mild", conditionsCount: 1, rationale: "Regulates circadian rhythms and promotes natural GABA-mimetic relaxation." }
    ]
  },
  {
    id: "heart-blood",
    label: "Cardiology & Circulation",
    icon: "❤️",
    conditions: [
      { name: "Essential Hypertension", careLevel: "focused", conditionsCount: 1, rationale: "Targets arterial wall stiffness, reduces vascular resistance, and monitors blood pressure." },
      { name: "Dyslipidemia / High Cholesterol", careLevel: "moderate", conditionsCount: 1, rationale: "Optimizes hepatic cholesterol synthesis, lipid transport, and diet parameters." },
      { name: "Varicose Veins / Venous Insufficiency", careLevel: "moderate", conditionsCount: 1, rationale: "Strengthens venous wall elasticity, improves valvular competence, and prevents stasis." },
      { name: "Iron Deficiency Anemia", careLevel: "mild", conditionsCount: 1, rationale: "Enhances intestinal iron absorption and targets constitutional red blood cell synthesis." }
    ]
  },
  {
    id: "hormonal-reproductive",
    label: "Gynecology & Men's Health",
    icon: "🌺",
    conditions: [
      { name: "PCOS / Ovulatory Dysfunction", careLevel: "focused", conditionsCount: 1, rationale: "Regulates LH/FSH ratio, controls ovarian hyper-androgenism, and restores cycles." },
      { name: "Endometriosis", careLevel: "organ", conditionsCount: 2, rationale: "Targets pelvic endometrial implants, reduces severe dysmenorrhea, and manages adhesions." },
      { name: "Menopausal Symptoms (Hot Flashes)", careLevel: "mild", conditionsCount: 1, rationale: "Soothes vasomotor instability, mood swings, and provides constitutional support." },
      { name: "Severe Dysmenorrhea / PMS", careLevel: "moderate", conditionsCount: 1, rationale: "Normalizes uterine prostaglandins, relieves spasmodic pain, and reduces premenstrual bloating." },
      { name: "Erectile Dysfunction / Performance", careLevel: "focused", conditionsCount: 1, rationale: "Constitutional stress-reduction, pelvic vascular flow optimization, and hormonal balance." }
    ]
  },
  {
    id: "psychiatry-mental",
    label: "Psychiatry & Mental Health",
    icon: "🧘",
    conditions: [
      { name: "Panic Attacks & Severe Anxiety", careLevel: "focused", conditionsCount: 1, rationale: "Deep neuro-chemical balance to calm hyper-sympathetic nervous reactions." },
      { name: "Chronic Depressive Episodes", careLevel: "focused", conditionsCount: 1, rationale: "Constitutional care targeting neurotransmitter dynamics, sleep, and vital forces." },
      { name: "ADHD / Focus / Pediatric Behavior", careLevel: "moderate", conditionsCount: 1, rationale: "Improves concentration thresholds, sensory integration, and hyperactive states." },
      { name: "Obsessive-Compulsive Disorder", careLevel: "focused", conditionsCount: 1, rationale: "Systemic neuro-somatic support targeting rigid behavioral loops and intrusive thoughts." },
      { name: "Bipolar Mood Stabilization support", careLevel: "organ", conditionsCount: 2, rationale: "Long-term pathogenetic co-management of extreme emotional oscillation phases." }
    ]
  },
  {
    id: "counseling-services",
    label: "Counseling Services",
    icon: "🗣️",
    conditions: [
      { name: "Burnout & Stress Management", careLevel: "mild", conditionsCount: 1, rationale: "Proactive life-stress mapping, counseling sessions, and energy restoration guides." },
      { name: "Relationship / Family Therapy", careLevel: "moderate", conditionsCount: 1, rationale: "Guided dynamic sessions focused on conflict resolution, communication, and emotional coping." },
      { name: "Trauma & Grief Processing", careLevel: "focused", conditionsCount: 1, rationale: "Deep emotional processing, resilience building, and specialized narrative therapy support." },
      { name: "Career & Performance Anxiety", careLevel: "mild", conditionsCount: 1, rationale: "CBT-aligned counseling focused on imposter syndrome, stress reduction, and goal mapping." }
    ]
  },
  {
    id: "veterinary-medicine",
    label: "Veterinary Homeopathy",
    icon: "🐾",
    conditions: [
      { name: "Pet Atopic Dermatitis / Allergies", careLevel: "moderate", conditionsCount: 1, rationale: "Resolves feline/canine skin flaking, intense itching, and chronic coat shedding." },
      { name: "Canine / Feline Arthritis", careLevel: "moderate", conditionsCount: 1, rationale: "Natural anti-inflammatory joint therapy to restore mobility and alleviate pain." },
      { name: "Chronic Pet Renal Failure (CKD)", careLevel: "organ", conditionsCount: 1, rationale: "Supports nephron filtration, reduces uremic toxins, and optimizes hydration levels." },
      { name: "Pet Separation Anxiety / Fear", careLevel: "mild", conditionsCount: 1, rationale: "Constitutional remedies for dogs/cats exhibiting destructive behaviors or extreme fear." },
      { name: "Acute Gastric Distress in Animals", careLevel: "mild", conditionsCount: 1, rationale: "Gentle recovery guidelines for vomiting, diarrhea, and metabolic resets in pets." }
    ]
  },
  {
    id: "pediatric-care",
    label: "Pediatric Care",
    icon: "🧸",
    conditions: [
      { name: "Recurrent Tonsillitis / Adenoids", careLevel: "moderate", conditionsCount: 1, rationale: "Shrinks tonsillar tissue and builds lymphatic immunity in growing children." },
      { name: "Pediatric Eczema / Cradle Cap", careLevel: "moderate", conditionsCount: 1, rationale: "Gentle skin barrier recovery mapping without toxic topical steroid application." },
      { name: "Bedwetting (Nocturnal Enuresis)", careLevel: "mild", conditionsCount: 1, rationale: "Constitutional bladder tone strengthening and nervous system calming." },
      { name: "Recurrent Pediatric Colds & Coughs", careLevel: "mild", conditionsCount: 1, rationale: "Builds natural immunological tolerance to environmental triggers." },
      { name: "Dentition-Related Fevers & Diarrhea", careLevel: "mild", conditionsCount: 1, rationale: "Soothes nerve irritation during teething phases and resolves gastric distress." }
    ]
  },
  {
    id: "geriatric-care",
    label: "Geriatric Care",
    icon: "👴",
    conditions: [
      { name: "Parkinson's Disease / Tremors", careLevel: "organ", conditionsCount: 1, rationale: "Neurological support to slow down degenerative motor changes and tremors." },
      { name: "Chronic Osteoarthritis & Frailty", careLevel: "focused", conditionsCount: 1, rationale: "Deep joint cartilage preservation, pain relief, and mineral assimilation support." },
      { name: "Senile Dementia / Cognitive Decline", careLevel: "focused", conditionsCount: 1, rationale: "Enhances cerebral circulation, memory support, and mental clarity." },
      { name: "BPH & Nocturia in Seniors", careLevel: "focused", conditionsCount: 1, rationale: "Relaxes bladder neck, improves urinary flow rate, and curtails nighttime urination." },
      { name: "Chronic Sleep Disorders in Seniors", careLevel: "mild", conditionsCount: 1, rationale: "Gentle circadian cycle stabilization without habit-forming sedative dependency." }
    ]
  },
  {
    id: "multisystem",
    label: "Multisystem Complex",
    icon: "🔮",
    conditions: [
      { name: "Diabetes + Hypertension + Joints", careLevel: "comprehensive", conditionsCount: 3, rationale: "Requires intensive multi-organ pathogenetic mapping and direct physician supervision." },
      { name: "Complex Autoimmune Pathologies", careLevel: "comprehensive", conditionsCount: 2, rationale: "Requires direct, high-frequency supervision by Dr. Jethwani and multi-remedy titration." },
      { name: "Metabolic Syndrome (PCOS+Fatty Liver)", careLevel: "comprehensive", conditionsCount: 3, rationale: "Visceral lipid management, insulin sensitizing remedies, and multi-system alignment." },
      { name: "Post-Viral Chronic Fatigue (CFS)", careLevel: "comprehensive", conditionsCount: 2, rationale: "Rebalances neuro-immune axis, supports mitochondrial function, and restores vitality." },
      { name: "RA + Osteoporosis + Acid Reflux", careLevel: "comprehensive", conditionsCount: 3, rationale: "Complex coordination to treat autoimmune joints while protecting the gastrointestinal lining." }
    ]
  }
];

export default function StorePage() {
  const [viewMode, setViewMode] = useState<"dashboard" | "catalog" | "doctorPlan">("dashboard");

  // Calculator states
  const [careLevel, setCareLevel] = useState<"mild" | "moderate" | "focused" | "organ" | "comprehensive">("focused");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [durationValue, setDurationValue] = useState<number>(1); // Default to 1 period (1 month or 4 weeks depending on cycle)
  const [conditionsCount, setConditionsCount] = useState<number>(1); // 1, 2, or 3

  // Saved configs list
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // AI Helper and Guidelines states
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [triageStep, setTriageStep] = useState<number | "result">(1);
  const [triageAnswers, setTriageAnswers] = useState({
    symptomsComplexity: "moderate", // 'mild' | 'moderate' | 'focused' | 'organ'
    conditionsNumber: 1, // 1 | 2 | 3
    supervisionNeed: "standard" // 'standard' | 'high'
  });
  const [triageRecommendationExplanation, setTriageRecommendationExplanation] = useState<string | null>(null);

  // Checkout Modal states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"intake" | "payment" | "success">("intake");
  
  // Patient Intake fields
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [deliveryMode, setDeliveryMode] = useState<"shipping" | "walkin" | "pickup">("shipping");
  const [patientCountry, setPatientCountry] = useState("India");
  const [patientState, setPatientState] = useState("");
  const [patientCity, setPatientCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [patientComplaint, setPatientComplaint] = useState("");
  
  // Walk-in / Let Doctor Plan states
  const [walkInName, setWalkInName] = useState("");
  const [walkInAge, setWalkInAge] = useState("");
  const [walkInGender, setWalkInGender] = useState("Male");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");
  const [walkInComplaint, setWalkInComplaint] = useState("");
  const [walkInType, setWalkInType] = useState("Walk-In Appointment");
  const [walkInTier, setWalkInTier] = useState("moderate");
  const [isWalkInSubmitting, setIsWalkInSubmitting] = useState(false);
  const [walkInResult, setWalkInResult] = useState<{ folderUrl: string; sheetUrl: string; isMock?: boolean } | null>(null);
  const [walkInSuccess, setWalkInSuccess] = useState(false);
  const [walkInError, setWalkInError] = useState<string | null>(null);
  const [walkInBillingCycle, setWalkInBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [walkInConditionsCount, setWalkInConditionsCount] = useState<number>(1);
  const [walkInDurationValue, setWalkInDurationValue] = useState<number>(1);
  
  // Concession states
  const [walkInApplyConcession, setWalkInApplyConcession] = useState(false);
  const [walkInConcessionType, setWalkInConcessionType] = useState<"senior" | "compassionate" | "override">("senior");
  const [walkInOverridePrice, setWalkInOverridePrice] = useState("");
  
  // Medicine Add-on states
  const [walkInApplyMedicineAddon, setWalkInApplyMedicineAddon] = useState(false);
  const [walkInMedicineAddons, setWalkInMedicineAddons] = useState<{ id: string; type: string; details: string; amount: string }[]>([
    { id: "1", type: "Dilution", details: "", amount: "" }
  ]);
  
  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  
  // Validation errors
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  // Plan info to be passed to checkout
  const [checkoutPlan, setCheckoutPlan] = useState<{
    title: string;
    description: string;
    finalPrice: number;
    billingCycle: "weekly" | "monthly";
    durationText: string;
    conditionsText: string;
    discountPercent: number;
    careLevel?: "mild" | "moderate" | "focused" | "organ" | "comprehensive";
    conditionsCount?: number;
    durationValue?: number;
  } | null>(null);
  const [activeDiagnosisTab, setActiveDiagnosisTab] = useState("skin-hair");

  const isSenior = checkoutPlan ? parseInt(patientAge) >= 60 : false;
  const publicSeniorDiscount = isSenior && checkoutPlan ? Math.round(checkoutPlan.finalPrice * 0.15) : 0;
  const finalPayable = checkoutPlan 
    ? (checkoutPlan.finalPrice - publicSeniorDiscount + (deliveryMode === "shipping" && patientCountry === "India" ? 300 : 0)) 
    : 0;

  const [filter, setFilter] = useState<"all" | "consultation" | "specialty">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogBillingCycle, setCatalogBillingCycle] = useState<"weekly" | "monthly">("monthly");

  // Load saved configs from localStorage and deep links on mount
  useEffect(() => {
    // 1. LocalStorage
    try {
      const saved = localStorage.getItem("homeo_saved_configs");
      if (saved) {
        setSavedConfigs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Error reading saved configs:", e);
    }

    // 2. URL params
    try {
      const params = new URLSearchParams(window.location.search);
      const levelParam = params.get("level");
      const cycleParam = params.get("cycle");
      const durationParam = params.get("duration");
      const conditionsParam = params.get("conditions");
      const modeParam = params.get("mode");

      if (modeParam === "catalog" || modeParam === "dashboard") {
        setViewMode(modeParam as any);
      }
      
      if (levelParam && ["mild", "moderate", "focused", "organ", "comprehensive"].includes(levelParam)) {
        setCareLevel(levelParam as any);
      }
      
      if (cycleParam && ["weekly", "monthly"].includes(cycleParam)) {
        setBillingCycle(cycleParam as any);
      }
      
      if (durationParam) {
        const val = parseInt(durationParam);
        if (!isNaN(val) && val > 0) {
          setDurationValue(val);
        }
      }

      if (conditionsParam) {
        const val = parseInt(conditionsParam);
        if (val === 1 || val === 2 || val === 3) {
          setConditionsCount(val);
        }
      }
    } catch (e) {
      console.error("Error parsing URL parameters:", e);
    }
  }, []);

  // Automatically trigger Senior Concession if walk-in age >= 60
  useEffect(() => {
    const ageVal = parseInt(walkInAge);
    if (!isNaN(ageVal) && ageVal >= 60) {
      setWalkInApplyConcession(true);
      setWalkInConcessionType("senior");
    } else if (walkInAge === "" || (!isNaN(ageVal) && ageVal < 60)) {
      setWalkInApplyConcession(false);
    }
  }, [walkInAge]);


  const calculatePricing = (
    level: keyof typeof careLevelsDetails,
    cycle: "weekly" | "monthly",
    duration: number,
    conditions: number = 1
  ) => {
    const details = careLevelsDetails[level];
    const basePrice = cycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
    
    // Dynamic coordination surcharges lookup based on care level and cycle
    const surchargesLookup = {
      mild: { weekly2: 300, weekly3: 600, monthly2: 1000, monthly3: 2000 },
      moderate: { weekly2: 500, weekly3: 1000, monthly2: 1500, monthly3: 3000 },
      focused: { weekly2: 800, weekly3: 1600, monthly2: 2500, monthly3: 5000 },
      organ: { weekly2: 1200, weekly3: 2400, monthly2: 3500, monthly3: 7000 },
      comprehensive: { weekly2: 1500, weekly3: 3000, monthly2: 4500, monthly3: 9000 },
    };

    let surcharge = 0;
    const tierSurcharges = surchargesLookup[level];
    if (conditions === 2) {
      surcharge = cycle === "weekly" ? tierSurcharges.weekly2 : tierSurcharges.monthly2;
    } else if (conditions >= 3) {
      surcharge = cycle === "weekly" ? tierSurcharges.weekly3 : tierSurcharges.monthly3;
    }

    const adjustedBasePrice = basePrice + surcharge;
    const rawTotal = adjustedBasePrice * duration;
    
    // Equivalent weeks
    const equivalentWeeks = cycle === "weekly" ? duration : duration * 4;
    
    let discountPercent = 0;
    if (equivalentWeeks >= 48) {
      discountPercent = 30; // 12 Months (48 weeks) or more
    } else if (equivalentWeeks >= 24) {
      discountPercent = 25; // 6 Months (24 weeks)
    } else if (equivalentWeeks >= 12) {
      discountPercent = 20; // 3 Months (12 weeks)
    } else if (equivalentWeeks >= 8) {
      discountPercent = 15; // 2 Months (8 weeks)
    } else if (equivalentWeeks >= 4) {
      discountPercent = 10; // 1 Month (4 weeks)
    } else if (equivalentWeeks >= 2) {
      discountPercent = 5; // 2 Weeks
    } else {
      discountPercent = 0;
    }
    
    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const finalPrice = rawTotal - discountAmount;
    
    return {
      basePrice,
      surcharge,
      adjustedBasePrice,
      rawTotal,
      discountPercent,
      discountAmount,
      finalPrice
    };
  };

  const getWalkInFinalPrice = () => {
    const basePricing = calculatePricing(walkInTier as keyof typeof careLevelsDetails, walkInBillingCycle, walkInDurationValue, walkInConditionsCount);
    let price = basePricing.finalPrice;
    
    if (walkInApplyConcession) {
      if (walkInConcessionType === "senior") {
        price = Math.round(basePricing.finalPrice * 0.85);
      } else if (walkInConcessionType === "compassionate") {
        price = Math.round(basePricing.finalPrice * 0.70);
      } else if (walkInConcessionType === "override") {
        const overrideVal = parseInt(walkInOverridePrice);
        price = isNaN(overrideVal) ? basePricing.finalPrice : Math.max(0, overrideVal);
      }
    }
    
    if (walkInApplyMedicineAddon) {
      const addonsSum = walkInMedicineAddons.reduce((sum, item) => {
        const amt = parseInt(item.amount);
        return sum + (isNaN(amt) || amt < 0 ? 0 : amt);
      }, 0);
      price += addonsSum;
    }
    
    return price;
  };

  const handleCycleChange = (cycle: "weekly" | "monthly") => {
    setBillingCycle(cycle);
    setDurationValue(cycle === "weekly" ? 4 : 1);
  };

  const handleSaveConfig = () => {
    const pricing = calculatePricing(careLevel, billingCycle, durationValue, conditionsCount);
    const details = careLevelsDetails[careLevel];
    const durationText = billingCycle === "weekly"
      ? `${durationValue} ${durationValue === 1 ? "Week" : "Weeks"}`
      : `${durationValue} ${durationValue === 1 ? "Month" : "Months"}`;
    const conditionsText = conditionsCount === 1 ? "1 Cond." : conditionsCount === 2 ? "2 Cond." : "3+ Cond.";

    const newConfig: SavedConfig = {
      id: Math.random().toString(36).substring(2, 9),
      name: `${details.title} (${conditionsText}, ${durationText} - ${billingCycle === "weekly" ? "Weekly" : "Monthly"})`,
      careLevel,
      billingCycle,
      durationValue,
      conditionsCount,
      finalPrice: pricing.finalPrice,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    
    const updated = [...savedConfigs, newConfig];
    setSavedConfigs(updated);
    try {
      localStorage.setItem("homeo_saved_configs", JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error("Error saving config:", e);
    }
  };

  const handleDeleteConfig = (id: string) => {
    const updated = savedConfigs.filter(c => c.id !== id);
    setSavedConfigs(updated);
    try {
      localStorage.setItem("homeo_saved_configs", JSON.stringify(updated));
    } catch (e) {
      console.error("Error deleting config:", e);
    }
  };

  const handleCopyLink = (
    level = careLevel,
    cycle = billingCycle,
    duration = durationValue,
    conditions = conditionsCount
  ) => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const shareUrl = `${baseUrl}?level=${level}&cycle=${cycle}&duration=${duration}&conditions=${conditions}&mode=dashboard`;
      navigator.clipboard.writeText(shareUrl);
      setShareSuccess(shareUrl);
      setTimeout(() => setShareSuccess(null), 3000);
    } catch (e) {
      console.error("Error copying link:", e);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInAge || !walkInPhone || !walkInComplaint) {
      return;
    }
    const generatedId = `P-${Math.floor(100000 + Math.random() * 900000)}`;
    setIsWalkInSubmitting(true);
    setWalkInError(null);
    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: generatedId,
          name: walkInName,
          email: walkInEmail || "N/A",
          phone: walkInPhone,
          gender: walkInGender,
          age: String(walkInAge),
          complaint: walkInComplaint,
          careLevel: careLevelsDetails[walkInTier as keyof typeof careLevelsDetails]?.title || "Doctor-Led Custom Care",
          conditionsCount: walkInConditionsCount,
          durationText: `${walkInDurationValue} ${walkInBillingCycle === "weekly" ? (walkInDurationValue === 1 ? "week" : "weeks") : (walkInDurationValue === 1 ? "month" : "months")} (${walkInBillingCycle === "weekly" ? "Weekly Settle" : "Monthly Commit"})${walkInApplyConcession ? ` [Concession: ${walkInConcessionType === "senior" ? "Senior 15%" : walkInConcessionType === "compassionate" ? "Socio-Economic 30%" : "Custom Override"}]` : ""}${
            walkInApplyMedicineAddon 
              ? ` [Medicine Add-ons: ${walkInMedicineAddons
                  .filter(item => {
                    const amt = parseInt(item.amount);
                    return !isNaN(amt) && amt > 0;
                  })
                  .map(item => `+₹${item.amount} for ${item.type}${item.details ? ` (${item.details})` : ""}`)
                  .join(", ")
                }]`
              : ""
          }`,
          finalPrice: getWalkInFinalPrice(),
          deliveryMode: walkInType === "Walk-In Appointment" 
            ? "walkin" 
            : walkInType === "Shipping / Courier Delivery" 
              ? "shipping" 
              : "pickup",
          address: walkInType
        })
      });
      const data = await response.json();
      if (data.success) {
        setWalkInResult({
          folderUrl: data.folderUrl,
          sheetUrl: data.sheetUrl,
          isMock: data.isMock
        });
        setWalkInSuccess(true);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error("Walk-in intake failed:", err);
      if (process.env.NODE_ENV === "development") {
        // Use mock fallback in local dev
        const addonsString = walkInApplyMedicineAddon
          ? walkInMedicineAddons
              .filter(item => {
                const amt = parseInt(item.amount);
                return !isNaN(amt) && amt > 0;
              })
              .map(item => `+₹${item.amount} for ${item.type}${item.details ? ` (${item.details})` : ""}`)
              .join(", ")
          : "";
        const durationTextVal = `${walkInDurationValue} ${walkInBillingCycle === "weekly" ? "weeks" : "months"} (${walkInBillingCycle === "weekly" ? "Weekly" : "Monthly"})${walkInApplyConcession ? ` [Concession: ${walkInConcessionType === "senior" ? "Senior 15%" : walkInConcessionType === "compassionate" ? "Socio-Economic 30%" : "Override"}]` : ""}${addonsString ? ` [Medicine Add-ons: ${addonsString}]` : ""}`;
        setWalkInResult({
          folderUrl: "https://drive.google.com/drive/folders/1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb?usp=share_link",
          sheetUrl: `/admin/mock-sheet?name=${encodeURIComponent(walkInName)}&id=${generatedId}&age=${encodeURIComponent(walkInAge)}&gender=${encodeURIComponent(walkInGender)}&phone=${encodeURIComponent(walkInPhone)}&email=${encodeURIComponent(walkInEmail)}&complaint=${encodeURIComponent(walkInComplaint)}&careLevel=${encodeURIComponent(careLevelsDetails[walkInTier as keyof typeof careLevelsDetails]?.title || "Doctor-Led Custom Care")}&durationText=${encodeURIComponent(durationTextVal)}&finalPrice=${encodeURIComponent(getWalkInFinalPrice())}`,
          isMock: true
        });
        setWalkInSuccess(true);
      } else {
        setWalkInError(err.message || "Failed to complete Google services integration or database sync. Please verify that your credentials are set up.");
      }
    } finally {
      setIsWalkInSubmitting(false);
    }
  };

  const handleSelectCalculatedPlan = () => {
    const pricing = calculatePricing(careLevel, billingCycle, durationValue, conditionsCount);
    const details = careLevelsDetails[careLevel];
    const durationText = billingCycle === "weekly"
      ? `${durationValue} ${durationValue === 1 ? "week" : "weeks"}`
      : `${durationValue} ${durationValue === 1 ? "month" : "months"}`;
    const conditionsText = conditionsCount === 1 
      ? "1 Condition (Standard)" 
      : conditionsCount === 2 
        ? "2 co-existing conditions" 
        : "3+ co-existing conditions";
      
    setCheckoutPlan({
      title: details.title,
      description: details.badge,
      finalPrice: pricing.finalPrice,
      billingCycle,
      durationText,
      conditionsText,
      discountPercent: pricing.discountPercent,
      careLevel,
      conditionsCount,
      durationValue
    });

    if (!patientComplaint && triageRecommendationExplanation) {
      setPatientComplaint(triageRecommendationExplanation);
    } else if (!patientComplaint) {
      setPatientComplaint(`Constitutional care evaluation for ${details.title}. Primary concerns include: `);
    }

    setCheckoutStep("intake");
    setFormErrors({});
    setTransactionRef("");
    setPaymentScreenshot(null);
    setIsCheckoutOpen(true);
  };

  const handleSelectPlan = (pkg: Package) => {
    const cycle = pkg.category === "consultation" ? catalogBillingCycle : "monthly";
    const rawPriceStr = pkg.category === "consultation" 
      ? (catalogBillingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly) 
      : pkg.price;
    
    const finalPrice = rawPriceStr ? parseInt(rawPriceStr.replace(/[^0-9]/g, "")) : 0;
    const durationText = pkg.category === "consultation" 
      ? (catalogBillingCycle === "weekly" ? "1 Week" : "1 Month") 
      : pkg.duration;

    setCheckoutPlan({
      title: pkg.title,
      description: pkg.desc,
      finalPrice,
      billingCycle: cycle as "weekly" | "monthly",
      durationText,
      conditionsText: "1 Condition (Standard)",
      discountPercent: 0
    });

    if (!patientComplaint && triageRecommendationExplanation) {
      setPatientComplaint(triageRecommendationExplanation);
    } else if (!patientComplaint) {
      setPatientComplaint(`Interested in booking ${pkg.title}. Clinical details: `);
    }

    setCheckoutStep("intake");
    setFormErrors({});
    setTransactionRef("");
    setPaymentScreenshot(null);
    setIsCheckoutOpen(true);
  };

  const handleSelectSavedPlan = (config: SavedConfig) => {
    const pricing = calculatePricing(config.careLevel, config.billingCycle, config.durationValue, config.conditionsCount || 1);
    const details = careLevelsDetails[config.careLevel];
    const durationText = config.billingCycle === "weekly"
      ? `${config.durationValue} ${config.durationValue === 1 ? "week" : "weeks"}`
      : `${config.durationValue} ${config.durationValue === 1 ? "month" : "months"}`;
    const conditionsText = (config.conditionsCount || 1) === 1 
      ? "1 Condition (Standard)" 
      : (config.conditionsCount || 1) === 2 
        ? "2 co-existing conditions" 
        : "3+ co-existing conditions";

    setCheckoutPlan({
      title: details.title,
      description: details.badge,
      finalPrice: pricing.finalPrice,
      billingCycle: config.billingCycle,
      durationText,
      conditionsText,
      discountPercent: pricing.discountPercent,
      careLevel: config.careLevel,
      conditionsCount: config.conditionsCount || 1,
      durationValue: config.durationValue
    });

    if (!patientComplaint && triageRecommendationExplanation) {
      setPatientComplaint(triageRecommendationExplanation);
    } else if (!patientComplaint) {
      setPatientComplaint(`Constitutional care evaluation for ${details.title}. Primary concerns include: `);
    }

    setCheckoutStep("intake");
    setFormErrors({});
    setTransactionRef("");
    setPaymentScreenshot(null);
    setIsCheckoutOpen(true);
  };

  const handleLoadConfig = (config: SavedConfig) => {
    setCareLevel(config.careLevel);
    setBillingCycle(config.billingCycle);
    setDurationValue(config.durationValue);
    setConditionsCount(config.conditionsCount || 1);
    setViewMode("dashboard");
  };

  const getTriageRecommendation = () => {
    const { symptomsComplexity, conditionsNumber, supervisionNeed } = triageAnswers;
    
    let recommendedLevel: "mild" | "moderate" | "focused" | "organ" | "comprehensive" = "focused";
    
    if (supervisionNeed === "high") {
      if (symptomsComplexity === "organ" || conditionsNumber >= 3) {
        recommendedLevel = "comprehensive";
      } else {
        recommendedLevel = "organ";
      }
    } else {
      if (symptomsComplexity === "mild") {
        if (conditionsNumber === 1) recommendedLevel = "mild";
        else if (conditionsNumber === 2) recommendedLevel = "moderate";
        else recommendedLevel = "focused";
      } else if (symptomsComplexity === "moderate") {
        if (conditionsNumber === 1) recommendedLevel = "moderate";
        else if (conditionsNumber === 2) recommendedLevel = "focused";
        else recommendedLevel = "organ";
      } else if (symptomsComplexity === "focused") {
        if (conditionsNumber === 1) recommendedLevel = "focused";
        else recommendedLevel = "organ";
      } else {
        if (conditionsNumber === 3) recommendedLevel = "comprehensive";
        else recommendedLevel = "organ";
      }
    }
    
    return {
      careLevel: recommendedLevel,
      conditionsCount: conditionsNumber,
      explanation: getTriageExplanation(recommendedLevel, conditionsNumber, symptomsComplexity, supervisionNeed)
    };
  };

  const getTriageExplanation = (
    recommendedLevel: string, 
    conditionsNumber: number, 
    symptomsComplexity: string, 
    supervisionNeed: string
  ) => {
    let detail = "";
    if (recommendedLevel === "mild") {
      detail = "You have a single mild, seasonal, or acute condition that can be managed with standard constitutional support and guidelines.";
    } else if (recommendedLevel === "moderate") {
      detail = "Your condition is chronic but localized to a single primary issue (such as eczema or IBS), which fits constitutional tracking with bi-weekly coordination.";
    } else if (recommendedLevel === "focused") {
      if (symptomsComplexity === "mild" && conditionsNumber >= 3) {
        detail = "Although your symptoms are mild individually, managing 3+ co-existing complaints requires a focused systemic plan to coordinate remedies without interactions.";
      } else {
        detail = "Your primary concern involves a deep-seated target system (like bronchial asthma or severe psoriasis), which requires targeted high-potency organ-level care.";
      }
    } else if (recommendedLevel === "organ") {
      if (supervisionNeed === "high") {
        detail = "Your case requires active review of biomarkers/lab tests and specialized multi-remedy support, putting it in the Advanced Pathological care level.";
      } else {
        detail = "You have multiple chronic organ-system issues (or a single very advanced pathology) that require multi-remedy constitutional support.";
      }
    } else {
      detail = "Your case involves multiple complex chronic conditions (3+ co-existing pathologies) and/or requires direct, high-frequency medical supervision by Dr. Jethwani.";
    }
    
    return detail;
  };

  const handleApplyTriage = (recCareLevel: keyof typeof careLevelsDetails, recConditionsCount: number) => {
    setCareLevel(recCareLevel);
    setConditionsCount(recConditionsCount);
    setIsHelperOpen(false);
    
    // Save rationale for prefilling patient intake
    const rec = getTriageRecommendation();
    setTriageRecommendationExplanation(`Triage recommendation: ${careLevelsDetails[recCareLevel].title} for ${recConditionsCount} condition(s). Rationale: ${rec.explanation}`);
    
    setDurationValue(recCareLevel === "mild" ? 1 : 3);
    setBillingCycle("monthly");
    setTriageStep(1); // Reset step
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesFilter = filter === "all" || pkg.category === filter;
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const activePricing = calculatePricing(careLevel, billingCycle, durationValue, conditionsCount);

  const activeDetails = careLevelsDetails[careLevel];

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Back to Homepage Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Magnetic>
            <Link
              href="https://homeo.healthcare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the Future
            </Link>
          </Magnetic>
        </motion.div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Clinical Pricing & Packages
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Clinical Care Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold leading-relaxed"
          >
            Select a tailored consultation setup or long-term chronic treatment program. All therapeutic care programs include consultation, remedies, custom diet sheets, and shipping inside India.
          </motion.p>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="flex justify-center md:justify-start mb-12">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/5 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-md">
            <button
              onClick={() => setViewMode("dashboard")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                viewMode === "dashboard"
                  ? "bg-[#1A2421] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1A2421]"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Treatment Planner
            </button>
            <button
              onClick={() => setViewMode("catalog")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                viewMode === "catalog"
                  ? "bg-[#1A2421] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1A2421]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Traditional Catalog
            </button>
            <button
              onClick={() => setViewMode("doctorPlan")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                viewMode === "doctorPlan"
                  ? "bg-[#1A2421] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1A2421]"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Let Doctor Plan
            </button>
          </div>
        </div>

        {/* Views Content wrapper */}
        <AnimatePresence mode="wait">
          {viewMode === "dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16 mb-16"
            >
              <div id="planner-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Dashboard Left Form Controls (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Step 1: Care Level Grid */}
                  <div className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1</span>
                        <h2 className="text-xl font-bold text-[#1A2421]">Select Clinical Complexity Level</h2>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                          Homeopathic treatment scales based on complexity. Every case is unique and requirements can change over time.
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-mint/5 border border-mint/10 text-mint rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>

                    {/* AI Helper and Guidelines Toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50">
                      <div>
                        <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-mint" />
                          Unsure which care level you need?
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Use our interactive helper or view mapping guidelines</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setTriageStep(1);
                            setIsHelperOpen(true);
                          }}
                          className="px-4 py-2 rounded-full bg-[#1A2421] hover:bg-[#2b3a36] text-white text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          🩺 Help Me Decide
                        </button>
                        <button
                          onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
                          className="px-4 py-2 rounded-full border border-slate-200 bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          📋 View Guidelines
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Guidelines Drawer */}
                    <AnimatePresence>
                      {isGuidelinesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden border border-mint/20 bg-mint/[0.02] rounded-2xl p-5 space-y-4"
                        >
                          <div className="flex justify-between items-center border-b border-mint/10 pb-3">
                            <h3 className="text-sm font-black text-mint-dark uppercase tracking-wider flex items-center gap-1.5">
                              <Info className="w-4 h-4" />
                              Clinical Care Triage Guidelines
                            </h3>
                            <button
                              onClick={() => setIsGuidelinesOpen(false)}
                              className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              Hide
                            </button>
                          </div>
                          
                          <div className="space-y-3.5 text-xs">
                            <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                              Find below how common chronic and acute conditions map to our clinical complexity packages. If you are treating multiple conditions, choose the care level for your most severe symptom, and select the total count in Step 1.5.
                            </p>
                            
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="py-2 pr-4">Care Level</th>
                                    <th className="py-2 px-4">Common Mapped Conditions</th>
                                    <th className="py-2 pl-4">Included Clinical Protocol</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-[11px]">
                                   <tr>
                                     <td className="py-3 pr-4 font-black text-slate-900">🌱 Acute & Wellness Care</td>
                                     <td className="py-3 px-4">Acute cold/cough, seasonal allergies, simple hair fall, localized dandruff, minor indigestion, mild acute flares.</td>
                                     <td className="py-3 pl-4">Constitutional micro-dose remedies, basic nutritional/diet sheet, bi-weekly status checks.</td>
                                   </tr>
                                   <tr>
                                     <td className="py-3 pr-4 font-black text-[#1A2421]">⚡ Standard Chronic Care</td>
                                     <td className="py-3 px-4">Established localized eczema, chronic dry skin/acne, mild thyroid imbalance, single joint pain, basic IBS/gas issues.</td>
                                     <td className="py-3 pl-4">Deeper disease mapping, targeted remedy preparations, detailed dietary guides, fortnightly updates.</td>
                                   </tr>
                                   <tr>
                                     <td className="py-3 pr-4 font-black text-mint-dark">🎯 Deep Systemic Care</td>
                                     <td className="py-3 px-4">Bronchial asthma, chronic allergic bronchitis, severe psoriasis, alopecia areata, chronic hormonal acne with PCOS, vascular migraines.</td>
                                     <td className="py-3 pl-4">Deep target system pathology rebalancing, high-potency constitutional dilution sets, biomarker and lab report evaluations.</td>
                                   </tr>
                                   <tr>
                                     <td className="py-3 pr-4 font-black text-indigo-700">🫁 Advanced Pathological Care</td>
                                     <td className="py-3 px-4">Early-stage Chronic Kidney Disease (CKD), elevated liver enzymes/fatty liver, multi-joint chronic arthritis, autoimmune rebalancing.</td>
                                     <td className="py-3 pl-4">Multi-remedy inter-system support, routine blood report comparison timelines, detailed dietitian review integration.</td>
                                   </tr>
                                   <tr>
                                     <td className="py-3 pr-4 font-black text-rose-600">🔮 Multisystem Integrative Care</td>
                                     <td className="py-3 px-4">Treating 3+ co-existing chronic conditions (e.g. Diabetes + CKD + Arthritis) or advanced multi-system chronic autoimmune pathology.</td>
                                     <td className="py-3 pl-4">Direct medical supervision by Dr. Jethwani, high-frequency dosage adjustments, emergency acute flare-up protocols.</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">

                      {(Object.keys(careLevelsDetails) as (keyof typeof careLevelsDetails)[]).map((level) => {
                        const active = careLevel === level;
                        const details = careLevelsDetails[level];
                        const displayPrice = billingCycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
                        
                        return (
                          <div
                            key={level}
                            onClick={() => setCareLevel(level)}
                            className={`glass-panel p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                              active
                                ? "border-mint bg-mint/[0.04] ring-2 ring-mint/10"
                                : "border-slate-200/60 hover:border-slate-800 bg-white/30"
                            }`}
                          >
                            {/* Spotlight glow */}
                            <div 
                              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background: `radial-gradient(circle at 50% 50%, ${details.glowColor} 0%, transparent 70%)`
                              }}
                            />

                            <div>
                              <div className="text-2xl mb-3 flex items-center justify-between">
                                <span>{details.icon}</span>
                                {active && <div className="w-1.5 h-1.5 rounded-full bg-mint breathe" />}
                              </div>
                              <h4 className="text-sm font-bold text-[#1A2421] leading-tight mb-1">{details.title}</h4>
                              <p className="text-[9px] text-slate-500 font-semibold leading-normal line-clamp-3 mb-4">
                                {details.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-900/5">
                              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Base Rate</span>
                              <span className="text-sm font-black text-[#1A2421] font-sans">
                                ₹{displayPrice.toLocaleString("en-IN")}
                              </span>
                              <span className="text-[9px] text-slate-500 font-semibold">/{billingCycle === "weekly" ? "wk" : "mo"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 1.5: Co-existing Conditions Selector */}
                  <div className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1.5</span>
                        <h2 className="text-xl font-bold text-[#1A2421]">Co-existing Conditions</h2>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                          Do you have multiple co-existing mild/moderate conditions? Select to include dynamic coordination fee tracking.
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-mint/5 border border-mint/10 text-mint rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(() => {
                        const surchargesLookup = {
                          mild: { weekly2: 300, weekly3: 600, monthly2: 1000, monthly3: 2000 },
                          moderate: { weekly2: 500, weekly3: 1000, monthly2: 1500, monthly3: 3000 },
                          focused: { weekly2: 800, weekly3: 1600, monthly2: 2500, monthly3: 5000 },
                          organ: { weekly2: 1200, weekly3: 2400, monthly2: 3500, monthly3: 7000 },
                          comprehensive: { weekly2: 1500, weekly3: 3000, monthly2: 4500, monthly3: 9000 },
                        };
                        const activeTierSurcharges = surchargesLookup[careLevel];
                        const items = [
                          { count: 1, label: "1 Condition", surchargeText: "Standard plan coverage", surchargeInfo: "No coordination fee" },
                          { count: 2, label: "2 Conditions", surchargeText: billingCycle === "weekly" ? `+₹${activeTierSurcharges.weekly2} / week` : `+₹${activeTierSurcharges.monthly2} / month`, surchargeInfo: "Dual-condition coordination" },
                          { count: 3, label: "3+ Conditions", surchargeText: billingCycle === "weekly" ? `+₹${activeTierSurcharges.weekly3} / week` : `+₹${activeTierSurcharges.monthly3} / month`, surchargeInfo: "Complex multi-condition management" }
                        ];

                        return items.map((item) => {
                          const active = conditionsCount === item.count;
                          return (
                            <div
                              key={item.count}
                              onClick={() => setConditionsCount(item.count)}
                              className={`glass-panel p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between relative group ${
                                active
                                  ? "border-mint bg-mint/[0.04] ring-2 ring-mint/10"
                                  : "border-slate-200/60 hover:border-slate-800 bg-white/30"
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                  {active && <div className="w-1.5 h-1.5 rounded-full bg-mint breathe" />}
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold mb-3">{item.surchargeInfo}</p>
                              </div>
                              <div className="pt-2 border-t border-slate-900/5">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Surcharge</span>
                                <span className="text-xs font-black text-[#1A2421]">{item.surchargeText}</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Step 2: Duration & Billing Controls */}
                  <div className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 2</span>
                        <h2 className="text-xl font-bold text-[#1A2421]">Define Billing & Duration Options</h2>
                        <p className="text-xs text-slate-500 font-semibold mt-1">
                          Select your cycle and timeline. Long-term commitment helps optimize constitutional healing and activates duration discounts.
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-mint/5 border border-mint/10 text-mint rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Percent className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Cycle Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50">
                        <div>
                          <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Billing Frequency</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">Choose weekly or monthly billing</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/60 p-1 rounded-full border border-slate-200/50">
                          <button
                            onClick={() => handleCycleChange("weekly")}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                              billingCycle === "weekly"
                                ? "bg-[#1A2421] text-white shadow-sm"
                                : "text-slate-500 hover:text-[#1A2421]"
                            }`}
                          >
                            Weekly
                          </button>
                          <button
                            onClick={() => handleCycleChange("monthly")}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                              billingCycle === "monthly"
                                ? "bg-[#1A2421] text-white shadow-sm"
                                : "text-slate-500 hover:text-[#1A2421]"
                            }`}
                          >
                            Monthly
                            <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black tracking-normal">
                              SAVE ~17%
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Duration Buttons Selector */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Duration of Commitment</h4>
                          <span className="text-[10px] text-mint font-bold uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Active Discount: {activePricing.discountPercent}% Off
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {billingCycle === "weekly" ? (
                            // Weeks Options
                            [
                              { value: 1, label: "1 Week", desc: "No Discount" },
                              { value: 2, label: "2 Weeks", desc: "5% Discount" },
                              { value: 4, label: "4 Weeks", desc: "10% Discount" },
                              { value: 8, label: "8 Weeks", desc: "15% Discount" },
                              { value: 12, label: "12 Weeks", desc: "20% Discount" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setDurationValue(opt.value)}
                                className={`p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                  durationValue === opt.value
                                    ? "border-mint bg-mint/[0.04] text-mint-dark font-bold"
                                    : "border-slate-200/50 hover:border-slate-800 text-slate-700 bg-white/40 hover:bg-white"
                                }`}
                              >
                                <span className="text-xs block font-bold">{opt.label}</span>
                                <span className="text-[8px] text-slate-500 block mt-0.5 font-semibold">{opt.desc}</span>
                              </button>
                            ))
                          ) : (
                            // Months Options
                            [
                              { value: 1, label: "1 Month", desc: "10% Discount" },
                              { value: 2, label: "2 Months", desc: "15% Discount" },
                              { value: 3, label: "3 Months", desc: "20% Discount" },
                              { value: 6, label: "6 Months", desc: "25% Discount" },
                              { value: 12, label: "12 Months", desc: "30% Discount" }
                            ].map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setDurationValue(opt.value)}
                                className={`p-3 col-span-1 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                  durationValue === opt.value
                                    ? "border-mint bg-mint/[0.04] text-mint-dark font-bold"
                                    : "border-slate-200/50 hover:border-slate-800 text-slate-700 bg-white/40 hover:bg-white"
                                }`}
                              >
                                <span className="text-xs block font-bold">{opt.label}</span>
                                <span className="text-[8px] text-slate-500 block mt-0.5 font-semibold">{opt.desc}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Detailed Included Features Checklist */}
                  <div className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 space-y-6">
                    <h3 className="text-base font-bold text-[#1A2421] border-b border-slate-900/5 pb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-mint" />
                      Specialized Features Included in {activeDetails.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeDetails.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/20 border border-white/40">
                          <CheckCircle2 className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 font-semibold leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Right Summary Card (4 cols) */}
                <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                  <div className="glass-panel border-indigo-500/25 bg-indigo-500/[0.03] dark:bg-indigo-950/20 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg shadow-indigo-500/5">
                    {/* Glowing highlight */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={{
                        background: `radial-gradient(circle at 80% 20%, ${activeDetails.glowColor} 0%, transparent 60%)`
                      }}
                    />

                    <div className="relative space-y-6">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/50 mb-3 inline-block">
                          Active Configuration
                        </span>
                        <h3 className="text-2xl font-bold text-[#1A2421]">{activeDetails.title}</h3>
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mt-1">
                          {activeDetails.badge}
                        </span>
                      </div>

                      {/* Pricing block */}
                      <div className="p-4 bg-white/60 border border-white/80 rounded-2xl space-y-3">
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                          <span>Base rate</span>
                          <span>₹{activePricing.basePrice.toLocaleString("en-IN")} / {billingCycle === "weekly" ? "wk" : "mo"}</span>
                        </div>

                        {conditionsCount > 1 && (
                          <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                            <span>Coordination Fee ({conditionsCount === 2 ? "2 Conditions" : "3+ Conditions"})</span>
                            <span>+₹{activePricing.surcharge.toLocaleString("en-IN")} / {billingCycle === "weekly" ? "wk" : "mo"}</span>
                          </div>
                        )}

                        {conditionsCount > 1 && (
                          <div className="flex justify-between text-xs text-slate-900 font-extrabold uppercase tracking-wider border-b border-slate-900/5 pb-2">
                            <span>Adjusted Rate</span>
                            <span>₹{activePricing.adjustedBasePrice.toLocaleString("en-IN")} / {billingCycle === "weekly" ? "wk" : "mo"}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider border-b border-slate-900/5 pb-2">
                          <span>Timeline ({durationValue} {billingCycle === "weekly" ? (durationValue === 1 ? "week" : "weeks") : (durationValue === 1 ? "month" : "months")})</span>
                          <span>₹{activePricing.rawTotal.toLocaleString("en-IN")}</span>
                        </div>

                        {activePricing.discountPercent > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600 font-bold uppercase tracking-wider">
                            <span>Discount ({activePricing.discountPercent}%)</span>
                            <span>-₹{activePricing.discountAmount.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-900/5 flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-900 uppercase">Total Cost</span>
                          <div className="text-right">
                            <span className="text-3xl font-black text-[#1A2421] font-sans">
                              ₹{activePricing.finalPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[9px] text-slate-500 font-semibold block uppercase">Excludes shipping (India ₹300 | Intl at dispatch)</span>
                          </div>
                        </div>
                      </div>

                      {/* GPay Payment Visual Card */}
                      <div className="p-4 bg-white/70 border border-mint/20 rounded-2xl flex gap-3.5 relative overflow-hidden shadow-[0_4px_16px_rgba(20,184,166,0.03)] group/gpay">
                        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/gpay:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-mint/[0.02] to-transparent" />
                        <div className="w-10 h-10 bg-mint/5 border border-mint/10 text-mint rounded-xl flex items-center justify-center flex-shrink-0 font-sans font-black text-xs">
                          GPay
                        </div>
                        <div>
                          <h4 className="text-[10px] font-extrabold uppercase text-mint tracking-wider">Direct Registration Payment</h4>
                          <p className="text-xs font-bold text-[#1A2421] mt-0.5">GPay / PhonePe / Paytm:</p>
                          <p className="text-sm font-black text-mint-dark tracking-wide">8446056789</p>
                          <p className="text-[9px] text-slate-500 font-semibold leading-normal mt-1">
                            Send correct total cost via UPI to register instantly. Share transfer screenshot over WhatsApp.
                          </p>
                        </div>
                      </div>


                      {/* Action buttons */}
                      <div className="space-y-3 pt-2">
                        <Magnetic>
                          <button
                            onClick={handleSelectCalculatedPlan}
                            className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.15)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.25)] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Order Custom Plan
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Magnetic>

                        <Magnetic>
                          <button
                            type="button"
                            onClick={() => setViewMode("doctorPlan")}
                            className="w-full py-3.5 border border-[#1A2421]/25 hover:border-[#1A2421] text-[#1A2421] rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer bg-white/50 hover:bg-white/90"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            Let Doctor Plan For You
                          </button>
                        </Magnetic>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleSaveConfig}
                            className={`py-3 px-2 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              saveSuccess 
                                ? "bg-emerald-500 border-transparent text-white" 
                                : "border-slate-200 bg-white/40 hover:border-slate-800 text-slate-700"
                            }`}
                          >
                            {saveSuccess ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Saved!
                              </>
                            ) : (
                              <>
                                <Save className="w-3.5 h-3.5" />
                                Save Config
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyLink()}
                            className={`py-3 px-2 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                              shareSuccess 
                                ? "bg-[#1A2421] border-transparent text-white" 
                                : "border-slate-200 bg-white/40 hover:border-slate-800 text-slate-700"
                            }`}
                          >
                            {shareSuccess ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>

                        {shareSuccess && (
                          <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] text-slate-500 font-semibold text-center mt-2 leading-relaxed break-all p-2 rounded-xl bg-white/50 border border-slate-900/5"
                          >
                            {shareSuccess}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Clinical supervision card */}
                  <div className="glass-panel border-amber-500/20 bg-amber-500/[0.02] rounded-3xl p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100/50 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Need Clinical Guidance?</h4>
                    <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                      Unsure which care level fits your condition? Book a telehealth video call evaluation directly with Dr. Jethwani.
                    </p>
                    <Link
                      href="https://homeo.healthcare/#booking"
                      className="text-xs text-mint hover:text-mint-dark font-extrabold uppercase tracking-wider inline-flex items-center gap-1 pt-1"
                    >
                      Book Evaluation <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Select by Diagnosis / Organ System */}
              <div className="border-t border-slate-900/5 pt-16 space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold text-[#1A2421] mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-mint animate-pulse" />
                    Quick Select by Diagnosis
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Select your clinical concern or organ system below to automatically pre-configure the Treatment Planner above with the recommended care level and conditions setup.
                  </p>
                </div>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto scrollbar-none">
                  {diseaseCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveDiagnosisTab(cat.id)}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                        activeDiagnosisTab === cat.id
                          ? "bg-[#1A2421] text-white shadow-sm border border-slate-800"
                          : "border border-slate-200 bg-white/40 hover:border-slate-800 text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Disease cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {diseaseCategories
                    .find((cat) => cat.id === activeDiagnosisTab)
                    ?.conditions.map((cond, idx) => {
                      const details = careLevelsDetails[cond.careLevel];
                      const badgeClass =
                        cond.careLevel === "mild"
                          ? "bg-teal-50 text-teal-700 border-teal-100"
                          : cond.careLevel === "moderate"
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : cond.careLevel === "focused"
                          ? "bg-sky-50 text-sky-700 border-sky-100"
                          : cond.careLevel === "organ"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100";

                      return (
                        <div
                          key={idx}
                          className="glass-panel border-white/60 bg-white/40 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 relative group/card"
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-extrabold text-[#1A2421] leading-snug">{cond.name}</h4>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeClass}`}>
                                  {details.title}
                                </span>
                                <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/50">
                                  {cond.conditionsCount === 1 ? "1 Condition" : cond.conditionsCount === 2 ? "2 Conditions" : "3+ Conditions"}
                                </span>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                              {cond.rationale}
                            </p>
                          </div>

                          <div className="pt-4 mt-4 border-t border-slate-900/5">
                            <button
                              onClick={() => {
                                setCareLevel(cond.careLevel);
                                setConditionsCount(cond.conditionsCount);
                                if (!patientComplaint || patientComplaint.startsWith("Constitutional care evaluation for")) {
                                  setPatientComplaint(`Constitutional care evaluation for ${cond.name}.`);
                                }
                                const plannerElement = document.getElementById("planner-dashboard");
                                if (plannerElement) {
                                  plannerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                                }
                              }}
                              className="w-full py-2 bg-white/80 hover:bg-[#1A2421] text-slate-700 hover:text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-slate-200 hover:border-slate-800 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              Apply to Planner
                              <ArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Comparison Section */}
              <div className="border-t border-slate-900/5 pt-16 space-y-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold text-[#1A2421] mb-2 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-mint" />
                    Compare Configured Plans
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Review and compare all configurations you have saved during this session. Side-by-side comparison makes it easier to select the perfect plan before checking in.
                  </p>
                </div>

                {savedConfigs.length === 0 ? (
                  <div className="py-12 border border-dashed border-slate-300 rounded-3xl text-center space-y-3 bg-white/10">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700">No Saved Configurations</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Use the Treatment Planner above and click &quot;Save Config&quot; to add packages for comparison.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedConfigs.map((config) => {
                      const details = careLevelsDetails[config.careLevel];
                      const pricing = calculatePricing(config.careLevel, config.billingCycle, config.durationValue, config.conditionsCount || 1);
                      const durationText = config.billingCycle === "weekly"
                        ? `${config.durationValue} ${config.durationValue === 1 ? "Week" : "Weeks"}`
                        : `${config.durationValue} ${config.durationValue === 1 ? "Month" : "Months"}`;
                      
                      return (
                        <div
                          key={config.id}
                          className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                        >
                          <div className="space-y-4">
                            <div className="flex justify-between items-start border-b border-slate-900/5 pb-4">
                              <div>
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">{config.date}</span>
                                <h4 className="text-base font-bold text-slate-900 leading-tight">{details.title}</h4>
                                <span className="text-[10px] text-mint font-bold uppercase tracking-wider block mt-1">{details.badge}</span>
                              </div>
                              <span className="text-2xl">{details.icon}</span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                <span>Conditions:</span>
                                <span className="font-bold">{(config.conditionsCount || 1) === 1 ? "1 Condition" : (config.conditionsCount || 1) === 2 ? "2 Conditions" : "3+ Conditions"}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                <span>Duration:</span>
                                <span className="font-bold">{durationText}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                <span>Cycle:</span>
                                <span className="font-bold uppercase">{config.billingCycle}</span>
                              </div>
                              <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                <span>Discount:</span>
                                <span className="font-bold text-emerald-600">-{pricing.discountPercent}%</span>
                              </div>
                              <div className="flex justify-between items-baseline pt-2 border-t border-slate-900/5">
                                <span className="text-xs text-slate-900 font-bold">Total:</span>
                                <span className="text-xl font-sans font-black text-slate-900">₹{config.finalPrice.toLocaleString("en-IN")}</span>
                              </div>
                            </div>


                            {/* comparative features list */}
                            <div className="pt-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Key Included:</span>
                              <ul className="space-y-1.5">
                                {details.features.slice(0, 3).map((f, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[10px] text-slate-700 font-semibold leading-relaxed">
                                    <CheckCircle2 className="w-3 h-3 text-mint flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-2 mt-6">
                            <Magnetic>
                              <button
                                onClick={() => handleSelectSavedPlan(config)}
                                className="w-full py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                Book This Plan
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </Magnetic>

                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                onClick={() => handleLoadConfig(config)}
                                className="py-2 px-1 rounded-full border border-slate-200 bg-white/40 hover:border-slate-800 text-slate-700 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Sliders className="w-3 h-3" />
                                Load
                              </button>
                              <button
                                onClick={() => handleCopyLink(config.careLevel, config.billingCycle, config.durationValue, config.conditionsCount || 1)}
                                className="py-2 px-1 rounded-full border border-slate-200 bg-white/40 hover:border-slate-800 text-slate-700 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Share2 className="w-3 h-3" />
                                Link
                              </button>
                              <button
                                onClick={() => handleDeleteConfig(config.id)}
                                className="py-2 px-1 rounded-full border border-red-200 bg-red-500/[0.03] hover:border-red-500 text-red-600 text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {viewMode === "catalog" && (
            <motion.div
              key="catalog-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Filters and Search Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-900/5">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Packages", icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                    { id: "consultation", label: "Consultation Plans", icon: <Clock className="w-3.5 h-3.5" /> },
                    { id: "specialty", label: "Specialty Care", icon: <ShieldCheck className="w-3.5 h-3.5" /> }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setFilter(btn.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        filter === btn.id
                          ? "bg-[#1A2421] text-white shadow-sm"
                          : "glass-panel border-slate-200 hover:border-slate-800 text-slate-700 hover:text-[#1A2421] bg-white/40"
                      }`}
                    >
                      {btn.icon}
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Billing Cycle Toggle */}
                {filter !== "specialty" && (
                  <div className="flex items-center gap-2 bg-slate-900/5 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-md">
                    <button
                      onClick={() => setCatalogBillingCycle("weekly")}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        catalogBillingCycle === "weekly"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-[#1A2421]"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setCatalogBillingCycle("monthly")}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        catalogBillingCycle === "monthly"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-[#1A2421]"
                      }`}
                    >
                      Monthly
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black tracking-normal">
                        SAVE ~17%
                      </span>
                    </button>
                  </div>
                )}

                {/* Search bar */}
                <div className="relative w-full md:max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                  <input
                    type="text"
                    placeholder="Search treatment plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-6 py-2.5 rounded-full border border-slate-200 focus:border-mint bg-white/60 focus:bg-white text-xs font-semibold placeholder:text-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Packages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredPackages.map((pkg) => {
                  const borderClass = pkg.colorTheme ? pkg.colorTheme.border : "border-white/60 hover:border-white/90";
                  const bgClass = pkg.colorTheme ? pkg.colorTheme.bg : "bg-white/40";
                  const textClass = pkg.colorTheme ? pkg.colorTheme.text : "text-mint-dark";
                  
                  return (
                    <div
                      key={pkg.id}
                      className={`glass-panel ${borderClass} ${bgClass} rounded-3xl p-8 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.02)] ${
                        pkg.id === "recommended-system-care" ? "ring-2 ring-indigo-500/20" : ""
                      }`}
                    >
                      {/* Glow effect on hover */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: `radial-gradient(circle at 80% 20%, ${pkg.glowColor} 0%, transparent 60%)`
                        }}
                      />

                      <div>
                        {/* Card header */}
                        <div className="flex justify-between items-start gap-4 mb-6">
                          <div>
                            {pkg.badge && (
                              <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-3 ${
                                pkg.colorTheme 
                                  ? `${pkg.colorTheme.badgeBg} ${pkg.colorTheme.badgeText}` 
                                  : "bg-mint/10 border border-mint/20 text-mint-dark"
                              }`}>
                                {pkg.badge}
                              </span>
                            )}
                            <h3 className="text-xl font-bold text-[#1A2421] leading-tight mb-1">{pkg.title}</h3>
                            <span className="text-[10px] text-slate-700 font-bold uppercase tracking-wider block">
                              {pkg.duration}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6 pb-6 border-b border-slate-900/5">
                          {pkg.category === "consultation" ? (
                            <div className="flex flex-col">
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-[#1A2421] font-sans">
                                  {catalogBillingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly}
                                </span>
                                {(catalogBillingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly)?.startsWith("₹") && (
                                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                    / {catalogBillingCycle}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold mt-1">
                                {catalogBillingCycle === "weekly" 
                                  ? `Monthly: ${pkg.priceMonthly}` 
                                  : `Weekly: ${pkg.priceWeekly}`}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-black text-[#1A2421] font-sans">{pkg.price}</span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-6">
                          {pkg.desc}
                        </p>

                        {/* Features checklist */}
                        <ul className="space-y-3 mb-8">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold leading-relaxed">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${textClass}`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Purchase Trigger Button */}
                      <Magnetic>
                        <button
                          onClick={() => handleSelectPlan(pkg)}
                          className={`w-full py-3.5 bg-white border border-slate-200 group-hover:border-transparent rounded-full font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-inner ${
                            pkg.colorTheme
                              ? `text-[#1A2421] group-hover:bg-slate-900 group-hover:text-white`
                              : `text-[#1A2421] group-hover:bg-mint group-hover:text-white`
                          }`}
                        >
                          Select Program
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Magnetic>

                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {viewMode === "doctorPlan" && (
            <motion.div
              key="doctor-plan-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 max-w-4xl mx-auto relative"
            >
              {/* Floating ambient glow orbs for high-end aesthetics */}
              <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none rounded-[36px]">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-mint/15 to-teal-400/5 blur-[80px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/0 blur-[80px] animate-pulse" style={{ animationDuration: '10s' }} />
                <div className="absolute top-1/2 left-1/3 w-72 h-72 rounded-full bg-emerald-500/5 blur-[90px] animate-pulse" style={{ animationDuration: '12s' }} />
              </div>

              {/* Doctor Plan Intake Form */}
              <div className="glass-panel border-white/70 bg-white/30 backdrop-blur-md rounded-[32px] p-6 md:p-8 space-y-8 shadow-xl shadow-slate-900/[0.02]">
                {walkInSuccess ? (
                  <div className="text-center py-8 space-y-6">
                    <div className="w-16 h-16 bg-mint/10 border border-mint/20 text-mint rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Case Registered Successfully</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Workspace folder and case sheet have been provisioned in Google Drive.
                      </p>
                    </div>

                    <div className="p-6 border border-mint/20 bg-mint/[0.02] rounded-2xl max-w-lg mx-auto text-left space-y-4">
                      <h4 className="text-xs font-black text-[#1A2421] uppercase tracking-wider border-b border-mint/10 pb-2">
                        Patient Case Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Patient Name</span>
                          <span className="text-slate-900 font-extrabold">{walkInName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">WhatsApp Number</span>
                          <span className="text-slate-900 font-extrabold">{walkInPhone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Age / Gender</span>
                          <span className="text-slate-900 font-extrabold">{walkInAge} / {walkInGender}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Care Level</span>
                          <span className="text-slate-900 font-extrabold">{careLevelsDetails[walkInTier as keyof typeof careLevelsDetails]?.title || "Custom Treatment"}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Payable</span>
                          <span className="text-slate-900 font-extrabold">₹{getWalkInFinalPrice().toLocaleString("en-IN")}</span>
                        </div>
                        {walkInApplyMedicineAddon && (
                          <div className="col-span-2 border-t border-slate-100 pt-2 mt-1 space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Medicine Add-ons</span>
                            {walkInMedicineAddons
                              .filter(item => {
                                const amt = parseInt(item.amount);
                                return !isNaN(amt) && amt > 0;
                              })
                              .map(item => (
                                <div key={item.id} className="flex justify-between text-xs font-semibold text-slate-700">
                                  <span className="text-slate-900">{item.type}{item.details ? ` (${item.details})` : ""}</span>
                                  <span className="text-[#0f766e] font-extrabold">+₹{Number(item.amount).toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
                      {walkInResult?.sheetUrl && (
                        <a
                          href={walkInResult.sheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-[#1A2421] hover:bg-[#2b3a36] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                          Open Clinical Case Sheet
                        </a>
                      )}
                      {walkInResult?.folderUrl && (
                        <a
                          href={walkInResult.folderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-3 border border-slate-200 bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Folder className="w-4 h-4" />
                          Open Drive Folder
                        </a>
                      )}
                    </div>

                    {walkInResult?.isMock && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-left max-w-md mx-auto space-y-1.5 shadow-sm">
                        <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-wider text-amber-850">
                          <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
                          Google Workspace Offline Mode
                        </div>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-700">
                          Real folder/sheet automation is offline because the server lacks Google API credentials.
                        </p>
                        <p className="text-[10px] text-slate-500 leading-normal border-t border-amber-500/10 pt-1.5 font-sans">
                          To enable actual creation, set <code className="bg-amber-500/15 px-1 py-0.5 rounded font-bold font-mono">GOOGLE_SERVICE_ACCOUNT_KEY</code> in environment variables and share folder <code className="bg-amber-500/15 px-1 py-0.5 rounded font-bold font-mono">1UR6te8zTdXsrtsWhiuDnhpBGZPx4_Mkb</code>.
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setWalkInSuccess(false);
                          setWalkInResult(null);
                          setWalkInError(null);
                          setWalkInName("");
                          setWalkInAge("");
                          setWalkInGender("Male");
                          setWalkInPhone("");
                          setWalkInEmail("");
                          setWalkInComplaint("");
                          setWalkInType("Walk-In Appointment");
                          setWalkInTier("moderate");
                          setWalkInBillingCycle("monthly");
                          setWalkInConditionsCount(1);
                          setWalkInDurationValue(1);
                          setWalkInApplyConcession(false);
                          setWalkInConcessionType("senior");
                          setWalkInOverridePrice("");
                        }}
                        className="text-xs font-bold text-mint-dark hover:text-mint transition-colors uppercase tracking-wider cursor-pointer"
                      >
                        ← Register Another Patient
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleWalkInSubmit} className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Let Doctor Plan</span>
                      <h3 className="text-2xl font-black text-slate-900">Custom & Walk-in Case Setup</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Register a walk-in patient or initiate custom treatment. This will automatically provision a patient folder and case planning spreadsheet.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Patient Name *</label>
                        <input
                          type="text"
                          required
                          value={walkInName}
                          onChange={(e) => setWalkInName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01]"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">WhatsApp Number *</label>
                        <input
                          type="tel"
                          required
                          value={walkInPhone}
                          onChange={(e) => setWalkInPhone(e.target.value)}
                          placeholder="Phone / Mobile"
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01]"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          value={walkInEmail}
                          onChange={(e) => setWalkInEmail(e.target.value)}
                          placeholder="email@example.com (Optional)"
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Age */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Age *</label>
                        <input
                          type="number"
                          required
                          value={walkInAge}
                          onChange={(e) => setWalkInAge(e.target.value)}
                          placeholder="Age"
                          min="0"
                          max="120"
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01]"
                        />
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Gender *</label>
                        <select
                          value={walkInGender}
                          onChange={(e) => setWalkInGender(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01] cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Intake Type */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Appointment Type *</label>
                        <select
                          value={walkInType}
                          onChange={(e) => setWalkInType(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200/80 bg-white/40 backdrop-blur-sm text-sm focus:outline-none focus:border-[#1A2421] focus:ring-4 focus:ring-mint/[0.08] hover:border-slate-300 hover:bg-white/60 transition-all duration-300 shadow-inner shadow-slate-950/[0.01] cursor-pointer"
                        >
                          <option value="Walk-In Appointment">Walk-In Appointment</option>
                          <option value="Let Doctor Design Plan">Let Doctor Design Plan</option>
                          <option value="Tele-Health Consultation">Tele-Health Consultation</option>
                          <option value="Shipping / Courier Delivery">Shipping / Courier Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Care Complexity Tier Selector */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Estimated Care Complexity Level *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          {Object.entries(careLevelsDetails).map(([key, details]) => {
                            const tierTheme = {
                              mild: {
                                activeClass: "border-teal-400 bg-teal-500/[0.04] ring-1 ring-teal-300/30 text-teal-800 dark:text-teal-400 shadow-md",
                                textClass: "text-teal-700 dark:text-teal-400",
                                glow: "rgba(20,184,166,0.15)"
                              },
                              moderate: {
                                activeClass: "border-purple-400 bg-purple-500/[0.04] ring-1 ring-purple-300/30 text-purple-800 dark:text-purple-400 shadow-md",
                                textClass: "text-purple-700 dark:text-purple-400",
                                glow: "rgba(168,85,247,0.15)"
                              },
                              focused: {
                                activeClass: "border-sky-400 bg-sky-500/[0.04] ring-1 ring-sky-300/30 text-sky-800 dark:text-sky-400 shadow-md",
                                textClass: "text-sky-700 dark:text-sky-400",
                                glow: "rgba(14,165,233,0.15)"
                              },
                              organ: {
                                activeClass: "border-emerald-400 bg-emerald-500/[0.04] ring-1 ring-emerald-300/30 text-emerald-800 dark:text-emerald-400 shadow-md",
                                textClass: "text-emerald-700 dark:text-emerald-400",
                                glow: "rgba(16,185,129,0.15)"
                              },
                              comprehensive: {
                                activeClass: "border-rose-400 bg-rose-500/[0.04] ring-1 ring-rose-300/30 text-rose-800 dark:text-rose-400 shadow-md",
                                textClass: "text-rose-700 dark:text-rose-400",
                                glow: "rgba(244,63,94,0.15)"
                              }
                            }[key] || {
                              activeClass: "border-mint bg-mint/[0.04] ring-1 ring-mint/20 text-slate-900 shadow-md",
                              textClass: "text-slate-900",
                              glow: "rgba(16,185,129,0.1)"
                            };

                            const isSelected = walkInTier === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setWalkInTier(key)}
                                style={{
                                  boxShadow: isSelected ? `0 8px 24px -4px ${tierTheme.glow}, 0 4px 8px -4px ${tierTheme.glow}` : "none"
                                }}
                                className={`p-3 text-left border rounded-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 active:scale-[0.98] ${
                                  isSelected
                                    ? tierTheme.activeClass
                                    : "border-slate-200/80 hover:border-slate-400 bg-white/40 hover:bg-white/60"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full mb-1">
                                  <span className="text-lg">{details.icon}</span>
                                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full transition-colors ${
                                    isSelected ? "bg-slate-900/10 text-slate-800" : "bg-slate-900/5 text-slate-500"
                                  }`}>
                                    {key}
                                  </span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-[10px] font-black text-slate-900 leading-tight block">{details.title}</span>
                                  <span className={`text-[9px] font-black block transition-colors ${
                                    isSelected ? tierTheme.textClass : "text-mint-dark"
                                  }`}>
                                    ₹{(walkInBillingCycle === "weekly" ? details.weeklyPrice : details.monthlyPrice).toLocaleString("en-IN")}
                                    /{walkInBillingCycle === "weekly" ? "wk" : "mo"}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pricing grid & Details & Calculations Wrapper */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Selector Controls Column (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Billing Frequency Selector */}
                            <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 space-y-3 shadow-sm hover:border-slate-300 transition-all duration-300">
                              <div>
                                <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Billing Frequency</h4>
                                <p className="text-[10px] text-slate-500 font-semibold">Choose weekly or monthly billing</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-white/60 p-1 rounded-full border border-slate-200/50 w-fit">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWalkInBillingCycle("weekly");
                                    setWalkInDurationValue(1);
                                  }}
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                    walkInBillingCycle === "weekly"
                                      ? "bg-[#1A2421] text-white shadow-sm"
                                      : "text-slate-500 hover:text-[#1A2421]"
                                  }`}
                                >
                                  Weekly
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setWalkInBillingCycle("monthly");
                                    setWalkInDurationValue(1);
                                  }}
                                  className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                                    walkInBillingCycle === "monthly"
                                      ? "bg-[#1A2421] text-white shadow-sm"
                                      : "text-slate-500 hover:text-[#1A2421]"
                                  }`}
                                >
                                  Monthly
                                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black tracking-normal">
                                    SAVE ~17%
                                  </span>
                                </button>
                              </div>
                            </div>

                            {/* Conditions Selector */}
                            <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 space-y-3 shadow-sm hover:border-slate-300 transition-all duration-300">
                              <div>
                                <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Conditions Covered</h4>
                                <p className="text-[10px] text-slate-500 font-semibold">Active medical concerns to treat</p>
                              </div>
                              <div className="flex items-center gap-1.5 bg-white/60 p-1 rounded-full border border-slate-200/50 w-fit">
                                {[1, 2, 3].map((count) => (
                                  <button
                                    key={count}
                                    type="button"
                                    onClick={() => setWalkInConditionsCount(count)}
                                    className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                      walkInConditionsCount === count
                                        ? "bg-[#1A2421] text-white shadow-sm"
                                        : "text-slate-500 hover:text-[#1A2421]"
                                    }`}
                                  >
                                    {count === 3 ? "3+" : count} {count === 1 ? "Cond." : "Conds."}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Commitment Duration Selector */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider">Commitment Duration</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {(walkInBillingCycle === "weekly"
                                ? [
                                    { value: 1, label: "1 Week", desc: "No Discount" },
                                    { value: 2, label: "2 Weeks", desc: "5% Discount" },
                                    { value: 4, label: "4 Weeks", desc: "10% Discount" },
                                    { value: 8, label: "8 Weeks", desc: "15% Discount" },
                                    { value: 12, label: "12 Weeks", desc: "20% Discount" }
                                  ]
                                : [
                                    { value: 1, label: "1 Month", desc: "10% Discount" },
                                    { value: 2, label: "2 Months", desc: "15% Discount" },
                                    { value: 3, label: "3 Months", desc: "20% Discount" },
                                    { value: 6, label: "6 Months", desc: "25% Discount" },
                                    { value: 12, label: "12 Months", desc: "30% Discount" }
                                  ]
                              ).map((opt) => (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => setWalkInDurationValue(opt.value)}
                                  className={`p-2.5 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                                    walkInDurationValue === opt.value
                                      ? "border-mint bg-mint/[0.04] text-mint-dark font-bold ring-1 ring-mint/20"
                                      : "border-slate-200/60 hover:border-slate-800 text-slate-700 bg-white/40 hover:bg-white"
                                  }`}
                                >
                                  <span className="text-xs block font-bold">{opt.label}</span>
                                  <span className="text-[8px] text-slate-500 block mt-0.5 font-semibold">{opt.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Concession / Discount Override Panel */}
                          <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 space-y-4 shadow-sm hover:border-slate-300 transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-1">
                                  <Percent className="w-3.5 h-3.5 text-mint" />
                                  Concession / Discount
                                </h4>
                                <p className="text-[10px] text-slate-500 font-semibold">Apply senior, socio-economic, or custom discount</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={walkInApplyConcession}
                                  onChange={(e) => setWalkInApplyConcession(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mint"></div>
                              </label>
                            </div>

                            <AnimatePresence initial={false}>
                              {walkInApplyConcession && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="space-y-3 pt-2 border-t border-slate-200 overflow-hidden"
                                >
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Concession Type</label>
                                    <div className="flex gap-2">
                                      {[
                                        { type: "senior", label: "Senior (15%)" },
                                        { type: "compassionate", label: "Socio-Economic (30%)" },
                                        { type: "override", label: "Custom Override" }
                                      ].map((opt) => (
                                        <button
                                          key={opt.type}
                                          type="button"
                                          onClick={() => setWalkInConcessionType(opt.type as any)}
                                          className={`flex-1 py-2 text-center rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                                            walkInConcessionType === opt.type
                                              ? "bg-[#1A2421] text-white border-transparent"
                                              : "bg-white/60 text-slate-500 border-slate-200 hover:border-slate-400"
                                          }`}
                                        >
                                          {opt.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <AnimatePresence initial={false}>
                                    {walkInConcessionType === "override" && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="space-y-1 overflow-hidden"
                                      >
                                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Custom Final Price (₹) *</label>
                                        <input
                                          type="number"
                                          min="0"
                                          value={walkInOverridePrice}
                                          onChange={(e) => setWalkInOverridePrice(e.target.value)}
                                          placeholder="Enter custom price"
                                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white/50 text-sm focus:outline-none focus:border-slate-800 transition-all"
                                        />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Medicine Add-on Section */}
                          <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 space-y-4 shadow-sm hover:border-slate-300 transition-all duration-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-1">
                                  <PlusCircle className="w-3.5 h-3.5 text-mint" />
                                  Add-on for Medicines
                                </h4>
                                <p className="text-[10px] text-slate-500 font-semibold">Add extra amount for special remedies, tinctures, or oils</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={walkInApplyMedicineAddon}
                                  onChange={(e) => setWalkInApplyMedicineAddon(e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-mint"></div>
                              </label>
                            </div>

                            <AnimatePresence initial={false}>
                              {walkInApplyMedicineAddon && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.25, ease: "easeInOut" }}
                                  className="space-y-3 pt-2 border-t border-slate-200 overflow-hidden"
                                >
                                  <div className="space-y-3">
                                    {walkInMedicineAddons.map((item, idx) => (
                                      <div key={item.id} className="flex gap-2.5 items-end">
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                          <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">Medicine Type</label>
                                            <select
                                              value={item.type}
                                              onChange={(e) => {
                                                const list = [...walkInMedicineAddons];
                                                list[idx].type = e.target.value;
                                                setWalkInMedicineAddons(list);
                                              }}
                                              className="w-full p-2 py-1.5 rounded-lg border border-slate-200 bg-white/50 text-xs focus:outline-none focus:border-slate-800 transition-all font-semibold"
                                            >
                                              <option value="Dilution">Dilution (30C / 200C / 1M)</option>
                                              <option value="Mother Tincture">Mother Tincture (Q)</option>
                                              <option value="Biochemic">Biochemic / Tissue Salts</option>
                                              <option value="Trituration">Trituration / Tablets</option>
                                              <option value="External Application">External Application (Oils/Creams)</option>
                                              <option value="Specialty Remedy">Specialty Remedy / Nosode</option>
                                              <option value="Custom/Other">Other Add-on / Custom</option>
                                            </select>
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">Specific Remedy / Details</label>
                                            <input
                                              type="text"
                                              value={item.details}
                                              onChange={(e) => {
                                                const list = [...walkInMedicineAddons];
                                                list[idx].details = e.target.value;
                                                setWalkInMedicineAddons(list);
                                              }}
                                              placeholder="e.g. Thuja 200, Arnica Q"
                                              className="w-full p-2 py-1.5 rounded-lg border border-slate-200 bg-white/50 text-xs focus:outline-none focus:border-slate-800 transition-all font-semibold"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[9px] font-black text-slate-700 uppercase tracking-wider block">Add-on Amount (₹) *</label>
                                            <input
                                              type="number"
                                              min="0"
                                              value={item.amount}
                                              onChange={(e) => {
                                                const list = [...walkInMedicineAddons];
                                                list[idx].amount = e.target.value;
                                                setWalkInMedicineAddons(list);
                                              }}
                                              placeholder="e.g. 500"
                                              className="w-full p-2 py-1.5 rounded-lg border border-slate-200 bg-white/50 text-xs focus:outline-none focus:border-slate-800 transition-all font-semibold"
                                            />
                                          </div>
                                        </div>
                                        {walkInMedicineAddons.length > 1 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setWalkInMedicineAddons(walkInMedicineAddons.filter((_, i) => i !== idx));
                                            }}
                                            className="p-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 cursor-pointer transition-colors border border-red-200/25 mb-[1px]"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setWalkInMedicineAddons([...walkInMedicineAddons, { id: Math.random().toString(), type: "Dilution", details: "", amount: "" }]);
                                      }}
                                      className="w-full py-1.5 text-center rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 hover:border-slate-350 transition-all"
                                    >
                                      <Plus className="w-3.5 h-3.5 animate-pulse" />
                                      <span>Add Another Medicine Type</span>
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Selected Care Level Detail Box */}
                          {walkInTier && careLevelsDetails[walkInTier as keyof typeof careLevelsDetails] && (() => {
                            const selectedDetails = careLevelsDetails[walkInTier as keyof typeof careLevelsDetails];
                            return (
                              <div className="p-4 border-l-4 border-l-mint border-y border-r border-slate-200/60 bg-white/40 backdrop-blur-sm rounded-2xl space-y-2.5 animate-fadeIn shadow-sm hover:border-slate-300 transition-all duration-300">
                                <div className="flex items-center justify-between border-b border-mint/10 pb-2">
                                  <h4 className="text-xs font-black text-[#1A2421] uppercase tracking-wider flex items-center gap-1.5">
                                    <span>{selectedDetails.icon}</span>
                                    <span>{selectedDetails.title} Details</span>
                                  </h4>
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                                  {selectedDetails.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-1.5 border-t border-slate-100">
                                  {selectedDetails.features.map((feat, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5 text-[9px] font-extrabold uppercase tracking-tight text-slate-600">
                                      <span className="text-mint">✓</span>
                                      <span>{feat}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Calculations summary column (4 cols) */}
                        <div className="lg:col-span-4">
                          {walkInTier && careLevelsDetails[walkInTier as keyof typeof careLevelsDetails] && (() => {
                            const pricing = calculatePricing(
                              walkInTier as keyof typeof careLevelsDetails,
                              walkInBillingCycle,
                              walkInDurationValue,
                              walkInConditionsCount
                            );
                            
                            const baseConcessionPrice = (() => {
                              if (!walkInApplyConcession) return pricing.finalPrice;
                              if (walkInConcessionType === "senior") return Math.round(pricing.finalPrice * 0.85);
                              if (walkInConcessionType === "compassionate") return Math.round(pricing.finalPrice * 0.70);
                              if (walkInConcessionType === "override") {
                                const overrideVal = parseInt(walkInOverridePrice);
                                return isNaN(overrideVal) ? pricing.finalPrice : Math.max(0, overrideVal);
                              }
                              return pricing.finalPrice;
                            })();
                            const concessionDiscount = pricing.finalPrice - baseConcessionPrice;
                            
                            const addonAmount = (() => {
                              if (!walkInApplyMedicineAddon) return 0;
                              return walkInMedicineAddons.reduce((sum, item) => {
                                const amt = parseInt(item.amount);
                                return sum + (isNaN(amt) || amt < 0 ? 0 : amt);
                              }, 0);
                            })();
                            
                            const finalPrice = baseConcessionPrice + addonAmount;

                            return (
                              <div className="p-6 border border-white/60 bg-white/60 backdrop-blur-md rounded-3xl space-y-4 shadow-md sticky top-6 hover:shadow-lg transition-all duration-300">
                                <div>
                                  <span className="text-[8px] font-black text-mint uppercase tracking-wider block">Live Estimate</span>
                                  <h4 className="text-sm font-black text-slate-900 mt-0.5">Billing Calculation</h4>
                                </div>

                                <div className="space-y-2 text-xs font-semibold text-slate-700">
                                  <div className="flex justify-between">
                                    <span>Base Rate</span>
                                    <span>₹{pricing.basePrice.toLocaleString("en-IN")} / {walkInBillingCycle === "weekly" ? "wk" : "mo"}</span>
                                  </div>
                                  {pricing.surcharge > 0 && (
                                    <div className="flex justify-between text-amber-600">
                                      <span>Surcharge</span>
                                      <span>+₹{pricing.surcharge.toLocaleString("en-IN")} / {walkInBillingCycle === "weekly" ? "wk" : "mo"}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-slate-900">
                                    <span>Adjusted Rate</span>
                                    <span>₹{pricing.adjustedBasePrice.toLocaleString("en-IN")} / {walkInBillingCycle === "weekly" ? "wk" : "mo"}</span>
                                  </div>
                                  {pricing.discountPercent > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                      <span>Discount ({pricing.discountPercent}%)</span>
                                      <span>-₹{Math.round(pricing.adjustedBasePrice * walkInDurationValue * (pricing.discountPercent / 100)).toLocaleString("en-IN")}</span>
                                    </div>
                                  )}
                                  {walkInApplyConcession && concessionDiscount > 0 && (
                                    <div className="flex justify-between text-[#9333ea] font-bold">
                                      <span>
                                        Concession ({walkInConcessionType === "senior" ? "Senior 15%" : walkInConcessionType === "compassionate" ? "Socio-Economic 30%" : "Override"})
                                      </span>
                                      <span>-₹{concessionDiscount.toLocaleString("en-IN")}</span>
                                    </div>
                                  )}
                                  {walkInApplyConcession && walkInConcessionType === "override" && concessionDiscount < 0 && (
                                    <div className="flex justify-between text-amber-600 font-bold">
                                      <span>Override Increase</span>
                                      <span>+₹{Math.abs(concessionDiscount).toLocaleString("en-IN")}</span>
                                    </div>
                                  )}
                                  {walkInApplyMedicineAddon && walkInMedicineAddons.filter(item => {
                                    const amt = parseInt(item.amount);
                                    return !isNaN(amt) && amt > 0;
                                  }).map((item) => (
                                    <div key={item.id} className="flex justify-between text-emerald-600 font-bold">
                                      <span>Add-on: {item.type}{item.details ? ` (${item.details})` : ""}</span>
                                      <span>+₹{Number(item.amount).toLocaleString("en-IN")}</span>
                                    </div>
                                  ))}
                                  <div className="flex justify-between border-t-2 border-slate-900/10 pt-2 text-sm font-black text-slate-900">
                                    <span>Total Payable</span>
                                    <span className="text-mint-dark">₹{finalPrice.toLocaleString("en-IN")}</span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-semibold leading-relaxed">
                                  Includes initial case mapping, shipping, constitutional remedy supply, and priority clinical assistance.
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Main Complaint */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Symptom Complaint & History *</label>
                        <textarea
                          required
                          rows={4}
                          value={walkInComplaint}
                          onChange={(e) => setWalkInComplaint(e.target.value)}
                          placeholder="Describe symptoms, medical history, duration, and any existing treatments..."
                          className="w-full p-3 rounded-xl border border-slate-200 bg-white/50 text-sm focus:outline-none focus:border-slate-800 transition-all resize-none"
                        />
                      </div>
                    </div>

                    {walkInError && (
                      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 text-xs font-bold flex items-center gap-2 max-w-lg mx-auto">
                        <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                        <span>{walkInError}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={isWalkInSubmitting}
                        className="px-8 py-3.5 bg-mint hover:bg-mint-dark disabled:bg-mint/50 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        {isWalkInSubmitting ? (
                          <>
                            <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                            Provisioning Workspace...
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Register & Let Doctor Plan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Sub-text Notes */}
        <div className="mb-24 flex flex-col items-center text-center max-w-4xl mx-auto px-6 py-8 rounded-3xl border border-slate-200/50 bg-white/20 backdrop-blur-md">
          <p className="text-sm text-slate-700 font-bold tracking-tight mb-4">
            Treatment plans are selected according to disease complexity and level of medical supervision required.
          </p>
          <div className="h-[1px] w-12 bg-slate-200 mb-4" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Dr Narayan Jethwani MD <span className="mx-2 text-slate-300">|</span> 20+ Years Experience in Homeopathic Practice
          </p>
        </div>

        {/* Global Catalog Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-900/5 pt-20">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-mint">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Global Shipping</h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Remedies are safely packaged and shipped globally. Domestic shipping across India is ₹300 standard. International shipping is calculated by provider or self-booked.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-mint">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">High Quality Therapeutics</h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Only pure, dynamic dilutions prepared strictly in accordance with official pharmacopoeias are sourced and dispatched to patients.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-purple-500">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1A2421] mb-1">Inter-Consultation Tracking</h4>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                Patients have continuous clinical support over WhatsApp to coordinate dose changes, acute symptoms flares, or updates.
              </p>
            </div>
          </div>
        </div>

        {/* AI Helper Triage Modal */}
        <AnimatePresence>
          {isHelperOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white/90 border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsHelperOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/50 hover:bg-slate-100 cursor-pointer"
                >
                  ✕
                </button>

                {/* Progress bar */}
                {triageStep !== "result" && (
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mb-6">
                    <div
                      className="bg-mint h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(Number(triageStep) / 3) * 100}%` }}
                    />
                  </div>
                )}

                {/* Step Content */}
                {triageStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1 of 3</span>
                      <h3 className="text-xl font-bold text-slate-900">Symptom Severity & Complexity</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Select the statement that best describes your primary medical complaint.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "mild", label: "Acute or Mild Complaints", desc: "Short-term/mild issues like acute seasonal colds, mild acne, general hair fall, or minor indigestion." },
                        { key: "moderate", label: "Single Chronic Condition", desc: "A persistent long-standing issue localized to one organ/system, e.g. chronic sinusitis, mild thyroid dysfunction, localized eczema." },
                        { key: "focused", label: "Deep Constitutional / Organ System Pathology", desc: "Requires targeted management of a complex system, e.g. bronchial asthma, severe psoriasis, hormonal acne with PCOS, chronic vascular migraines." },
                        { key: "organ", label: "Severe Systemic Pathology", desc: "Advanced or multi-organ chronic complaints, e.g. Chronic Kidney Disease (CKD), liver cirrhosis, advanced rheumatoid arthritis." }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, symptomsComplexity: item.key })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.symptomsComplexity === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-800 bg-white/40"
                          }`}
                        >
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        onClick={() => setTriageStep(2)}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 2 of 3</span>
                      <h3 className="text-xl font-bold text-slate-900">Treating complaints simultaneously</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        How many conditions or active chronic concerns are you seeking support for?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { val: 1, label: "1 Condition", desc: "Focusing treatment on a single health complaint." },
                        { val: 2, label: "2 Conditions", desc: "Treating two co-existing issues simultaneously (e.g. skin + gut)." },
                        { val: 3, label: "3+ Conditions", desc: "Treating three or more overlapping complaints." }
                      ].map((item) => (
                        <div
                          key={item.val}
                          onClick={() => setTriageAnswers({ ...triageAnswers, conditionsNumber: item.val })}
                          className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all duration-200 ${
                            triageAnswers.conditionsNumber === item.val
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-800 bg-white/40"
                          }`}
                        >
                          <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold mt-2">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setTriageStep(1)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep(3)}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 3 of 3</span>
                      <h3 className="text-xl font-bold text-slate-900">Clinical Supervision Level</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Do you need active biomarker monitoring, blood report reviews, or high-frequency supervision?
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { key: "standard", label: "Standard Clinical Management", desc: "Regular progress tracking checks every 2 to 4 weeks. No immediate need for laboratory analysis integrations." },
                        { key: "high", label: "High Supervision & Medical Reviews", desc: "Requires regular blood/lab report review comparisons, multi-remedy coordination, or direct clinician oversight by Dr. Jethwani." }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, supervisionNeed: item.key })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.supervisionNeed === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-800 bg-white/40"
                          }`}
                        >
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => setTriageStep(2)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep("result")}
                        className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        Calculate Recommendation
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === "result" && (() => {
                  const rec = getTriageRecommendation();
                  const recDetails = careLevelsDetails[rec.careLevel];
                  return (
                    <div className="space-y-6">
                      <div className="text-center">
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Diagnostic Result</span>
                        <h3 className="text-2xl font-black text-slate-900">Recommended Care Setup</h3>
                      </div>

                      <div className="p-5 border border-mint/20 bg-mint/[0.03] rounded-2xl space-y-4">
                        <div className="flex justify-between items-start border-b border-mint/10 pb-3">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase bg-mint/10 text-mint-dark border border-mint/20 px-2 py-0.5 rounded-full inline-block mb-1.5">
                              {recDetails.badge}
                            </span>
                            <h4 className="text-lg font-black text-[#1A2421]">{recDetails.title}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                              For {rec.conditionsCount === 1 ? "1 Condition" : rec.conditionsCount === 2 ? "2 Conditions" : "3+ Conditions"}
                            </span>
                          </div>
                          <span className="text-3xl">{recDetails.icon}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Rationale</span>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                            {rec.explanation}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setTriageStep(3)}
                          className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                        >
                          Back
                        </button>
                        <button
                          onClick={() => handleApplyTriage(rec.careLevel, rec.conditionsCount)}
                          className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          Apply Settings to Dashboard
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Upgrade/Checkout Modal Overlay */}
        <AnimatePresence>
          {isCheckoutOpen && checkoutPlan && (
            <div 
              data-lenis-prevent
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl bg-white/95 border border-slate-200 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden my-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/50 hover:bg-slate-100 cursor-pointer z-10"
                >
                  ✕
                </button>

                {/* Stepper indicator */}
                <div className="flex items-center justify-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${checkoutStep === "intake" ? "bg-mint text-white" : "bg-mint/20 text-mint-dark"}`}>1</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Intake Form</span>
                  </div>
                  <div className="w-8 h-[1px] bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${checkoutStep === "payment" ? "bg-mint text-white" : "bg-slate-200 text-slate-500"}`}>2</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Payment</span>
                  </div>
                  <div className="w-8 h-[1px] bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${checkoutStep === "success" ? "bg-mint text-white" : "bg-slate-200 text-slate-500"}`}>3</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">Success</span>
                  </div>
                </div>

                {checkoutStep === "intake" && (
                  <div className="space-y-6">
                    <div className="text-center md:text-left">
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1 of 3</span>
                      <h3 className="text-xl font-bold text-slate-900">Patient Intake Profile</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Please provide the patient details. This information helps coordinate shipping dilutions and customize constitutional treatment.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Patient Name *</label>
                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="Full Name"
                          className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                            formErrors.patientName ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">WhatsApp Number *</label>
                        <input
                          type="tel"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                            formErrors.patientPhone ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                      </div>

                      {/* Email input */}
                      {deliveryMode === "shipping" && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Email Address *</label>
                          <input
                            type="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="email@example.com"
                            className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                              formErrors.patientEmail ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                            }`}
                          />
                        </div>
                      )}

                      {/* Age / Gender grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Age *</label>
                          <input
                            type="number"
                            value={patientAge}
                            onChange={(e) => setPatientAge(e.target.value)}
                            placeholder="Age"
                            min="0"
                            max="120"
                            className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                              formErrors.patientAge ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Gender</label>
                          <select
                            value={patientGender}
                            onChange={(e) => setPatientGender(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white/50 text-sm focus:outline-none focus:border-slate-800"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery / Collection Option */}
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Remedy Delivery / Collection *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryMode("shipping");
                              // Reset address validation errors
                              setFormErrors((prev) => {
                                const newErr = { ...prev };
                                delete newErr.patientCountry;
                                delete newErr.patientState;
                                delete newErr.patientCity;
                                delete newErr.patientAddress;
                                return newErr;
                              });
                            }}
                            className={`p-3 text-left border rounded-2xl transition-all flex flex-col justify-between cursor-pointer ${
                              deliveryMode === "shipping" 
                                ? "border-mint bg-mint/[0.02] ring-2 ring-mint/10" 
                                : "border-slate-200 hover:border-slate-400 bg-white/50"
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900">📦 Courier Shipping</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-1">Standard Courier (India ₹300 | Intl at dispatch)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryMode("walkin");
                              setPatientCountry("India");
                              setPatientState("Maharashtra");
                              setPatientCity("Pune");
                              setPatientAddress("Baner Clinic Pickup");
                            }}
                            className={`p-3 text-left border rounded-2xl transition-all flex flex-col justify-between cursor-pointer ${
                              deliveryMode === "walkin" 
                                ? "border-mint bg-mint/[0.02] ring-2 ring-mint/10" 
                                : "border-slate-200 hover:border-slate-400 bg-white/50"
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900">🚶 Walk-in Clinic</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-1">Pick up directly from Baner Clinic, Pune (Free)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeliveryMode("pickup");
                              setPatientCountry("India");
                              setPatientState("Maharashtra");
                              setPatientCity("Pune");
                              setPatientAddress("Self-Arranged Pickup");
                            }}
                            className={`p-3 text-left border rounded-2xl transition-all flex flex-col justify-between cursor-pointer ${
                              deliveryMode === "pickup" 
                                ? "border-mint bg-mint/[0.02] ring-2 ring-mint/10" 
                                : "border-slate-200 hover:border-slate-400 bg-white/50"
                            }`}
                          >
                            <span className="text-xs font-bold text-slate-900">🛵 Self-Arranged</span>
                            <span className="text-[9px] text-slate-500 font-semibold mt-1">Book your own pickup (Dunzo/Porter/Courier) (Free)</span>
                          </button>
                        </div>
                      </div>

                      {/* Shipping address fields - ONLY visible if Courier Shipping is chosen */}
                      {deliveryMode === "shipping" && (
                        <>
                          {/* Country Selection */}
                          <div className="space-y-1 animate-fadeIn">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Country *</label>
                            <select
                              value={patientCountry}
                              onChange={(e) => {
                                setPatientCountry(e.target.value);
                                setPatientState("");
                                setPatientCity("");
                                setSelectedCity("");
                                setCustomCity("");
                              }}
                              className="w-full p-3 rounded-xl border border-slate-200 bg-white/50 text-sm focus:outline-none focus:border-slate-800"
                            >
                              {shippingCountries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          {/* State / Province Selection */}
                          <div className="space-y-1 animate-fadeIn">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                              {patientCountry === "India" ? "State / Union Territory *" : "State / Province / Region *"}
                            </label>
                            {patientCountry === "India" ? (
                              <select
                                value={patientState}
                                onChange={(e) => setPatientState(e.target.value)}
                                className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                                  formErrors.patientState ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                                }`}
                              >
                                <option value="">-- Select State --</option>
                                {indianStates.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={patientState}
                                onChange={(e) => setPatientState(e.target.value)}
                                placeholder="State / Region"
                                className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                                  formErrors.patientState ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                                }`}
                              />
                            )}
                          </div>

                          {/* City Selection */}
                          <div className="space-y-1 animate-fadeIn">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">City *</label>
                            {patientCountry === "India" ? (
                              <select
                                value={selectedCity}
                                onChange={(e) => {
                                  setSelectedCity(e.target.value);
                                  if (e.target.value !== "other") {
                                    setPatientCity(e.target.value);
                                  } else {
                                    setPatientCity(customCity);
                                  }
                                }}
                                className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                                  formErrors.patientCity ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                                }`}
                              >
                                <option value="">-- Select City --</option>
                                {majorIndianCities.map((c) => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                                <option value="other">Other / Enter manually...</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={patientCity}
                                onChange={(e) => setPatientCity(e.target.value)}
                                placeholder="City"
                                className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                                  formErrors.patientCity ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                                }`}
                              />
                            )}
                          </div>

                          {/* Custom City Input / Space Filler */}
                          {patientCountry === "India" && selectedCity === "other" ? (
                            <div className="space-y-1 animate-fadeIn">
                              <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Specify City Name *</label>
                              <input
                                type="text"
                                value={customCity}
                                onChange={(e) => {
                                  setCustomCity(e.target.value);
                                  setPatientCity(e.target.value);
                                }}
                                placeholder="Enter City Name"
                                className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all ${
                                  formErrors.patientCity ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                                }`}
                              />
                            </div>
                          ) : (
                            <div className="hidden md:block" />
                          )}

                          {/* Detailed street/postal address */}
                          <div className="col-span-1 md:col-span-2 space-y-1 animate-fadeIn">
                            <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Detailed Shipping Address *</label>
                            <textarea
                              rows={2}
                              value={patientAddress}
                              onChange={(e) => setPatientAddress(e.target.value)}
                              placeholder="Building/Apartment name, Flat number, Street, Locality, Pincode/Zipcode..."
                              className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all resize-none ${
                                formErrors.patientAddress ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                              }`}
                            />
                          </div>
                        </>
                      )}

                      {/* Clinical symptoms summary */}
                      <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Symptoms / Chief Complaints *</label>
                        <textarea
                          rows={3}
                          value={patientComplaint}
                          onChange={(e) => setPatientComplaint(e.target.value)}
                          placeholder="Describe symptoms, duration of illness, and any current medications..."
                          className={`w-full p-3 rounded-xl border bg-white/50 text-sm focus:outline-none transition-all resize-none ${
                            formErrors.patientComplaint ? "border-red-500 ring-2 ring-red-100" : "border-slate-200 focus:border-slate-800"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setIsCheckoutOpen(false)}
                        className="px-6 py-3 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const errors: Record<string, boolean> = {};
                          if (!patientName.trim()) errors.patientName = true;
                          if (!patientPhone.trim()) errors.patientPhone = true;
                          if (deliveryMode === "shipping") {
                            if (!patientEmail.trim() || !patientEmail.includes("@")) errors.patientEmail = true;
                          }
                          if (!patientAge.trim()) errors.patientAge = true;
                          
                          if (deliveryMode === "shipping") {
                            if (!patientCountry.trim()) errors.patientCountry = true;
                            if (!patientState.trim()) errors.patientState = true;
                            if (!patientCity.trim()) errors.patientCity = true;
                            if (!patientAddress.trim()) errors.patientAddress = true;
                          }
                          
                          if (!patientComplaint.trim() || patientComplaint.length < 5) errors.patientComplaint = true;

                          if (Object.keys(errors).length > 0) {
                            setFormErrors(errors);
                          } else {
                            setFormErrors({});
                            setCheckoutStep("payment");
                          }
                        }}
                        className="px-8 py-3 bg-[#1A2421] hover:bg-[#2b3a36] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        Proceed to Payment
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {checkoutStep === "payment" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left side: Invoice receipt */}
                    <div className="md:col-span-5 space-y-6 border-r border-slate-100 pr-0 md:pr-8">
                      <div>
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Billing Summary</span>
                        <h4 className="text-lg font-black text-slate-900">{checkoutPlan.title}</h4>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">{checkoutPlan.description}</span>
                      </div>

                      <div className="p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50 space-y-3">
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Base Care Rate</span>
                          <span>₹{((checkoutPlan.finalPrice / (1 - (checkoutPlan.discountPercent || 0) / 100)) || checkoutPlan.finalPrice).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Conditions Setup</span>
                          <span className="text-[10px] text-slate-600 font-black text-right">{checkoutPlan.conditionsText}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase border-b border-slate-200 pb-2">
                          <span>Timeline Duration</span>
                          <span>{checkoutPlan.durationText}</span>
                        </div>
                        {checkoutPlan.discountPercent > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600 font-bold uppercase">
                            <span>Discount ({checkoutPlan.discountPercent}%)</span>
                            <span>-₹{(((checkoutPlan.finalPrice / (1 - checkoutPlan.discountPercent / 100)) * (checkoutPlan.discountPercent / 100)) || 0).toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {isSenior && (
                          <div className="flex justify-between text-xs text-[#9333ea] font-bold uppercase">
                            <span>Senior Concession (15%)</span>
                            <span>-₹{publicSeniorDiscount.toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase border-t border-slate-200/50 pt-2">
                          <span>Delivery / Shipping</span>
                          {deliveryMode === "shipping" ? (
                            patientCountry === "India" ? (
                              <span className="text-[#1A2421] font-extrabold">₹300 (Courier)</span>
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold text-right max-w-[150px] leading-tight">
                                International (calculated at dispatch)
                              </span>
                            )
                          ) : deliveryMode === "walkin" ? (
                            <span className="text-emerald-600 font-extrabold">Clinic Walk-in Pickup (Free)</span>
                          ) : (
                            <span className="text-emerald-600 font-extrabold">Self-Arranged Pickup (Free)</span>
                          )}
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-900 uppercase">Total Payable</span>
                          <div className="text-right">
                            <span className="text-2xl font-black text-[#1A2421] font-sans">₹{finalPayable.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block uppercase">
                              {deliveryMode === "shipping" ? (
                                patientCountry === "India" ? "Includes standard ₹300 shipping" : "Excludes international shipping"
                              ) : "Remedy Shipping Fee Excluded (Pickup)"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Patient metadata verification card */}
                      <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2 text-xs">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Patient Summary</span>
                        <p className="text-slate-800 font-bold">{patientName} ({patientAge} years, {patientGender})</p>
                        {deliveryMode === "shipping" ? (
                          <p className="text-slate-500 font-semibold leading-normal">
                            <span className="font-bold block text-slate-700">Shipping Address:</span>
                            {patientAddress}, {patientCity}, {patientState}, {patientCountry}
                          </p>
                        ) : deliveryMode === "walkin" ? (
                          <p className="text-slate-500 font-semibold leading-normal">
                            <span className="font-bold block text-slate-700">Collection:</span>
                            In-Person Clinic Walk-in (Baner, Pune)
                          </p>
                        ) : (
                          <p className="text-slate-500 font-semibold leading-normal">
                            <span className="font-bold block text-slate-700">Collection:</span>
                            Self-Arranged Pickup (Dunzo/Porter Courier)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right side: Payment options */}
                    <div className="md:col-span-7 space-y-6">
                      <div>
                        <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 2 of 3</span>
                        <h3 className="text-xl font-bold text-slate-900">Choose Payment Method</h3>
                      </div>

                      {/* Payment Tab Headers */}
                      <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200/50">
                        <button
                          onClick={() => setPaymentMethod("upi")}
                          className={`flex-1 py-2 text-center rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            paymentMethod === "upi" ? "bg-white text-[#1A2421] shadow-sm" : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          UPI (GPay/Paytm/PhonePe)
                        </button>
                        <button
                          onClick={() => setPaymentMethod("bank")}
                          className={`flex-1 py-2 text-center rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            paymentMethod === "bank" ? "bg-white text-[#1A2421] shadow-sm" : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          Bank Transfer (NEFT/IMPS)
                        </button>
                      </div>

                      {paymentMethod === "upi" && (() => {
                        const upiPayUrl = `upi://pay?pa=8446056789@okbizaxis&pn=Dr%20Narayan%20Jethwani&am=${finalPayable}&cu=INR&tn=${encodeURIComponent(`Plan - ${checkoutPlan.title}`)}`;
                        const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiPayUrl)}`;
                        
                        return (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-mint/20 bg-mint/[0.02] rounded-2xl">
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm flex-shrink-0">
                                <img
                                  src={qrCodeSrc}
                                  alt="UPI Payment QR Code"
                                  width={140}
                                  height={140}
                                  className="w-32 h-32"
                                  />
                              </div>
                              <div className="space-y-2 text-center sm:text-left">
                                <h5 className="text-xs font-black text-mint uppercase tracking-wider">Dynamic UPI QR Code</h5>
                                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                                  Scan using any UPI App (GPay, PhonePe, Paytm, BHIM) to pay exactly <span className="font-bold text-slate-800">₹{finalPayable.toLocaleString("en-IN")}</span> instantly.
                                </p>
                                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText("8446056789@okbizaxis");
                                    }}
                                    className="px-3 py-1.5 border border-slate-200 bg-white hover:border-slate-800 text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Copy className="w-3 h-3" />
                                    Copy UPI ID
                                  </button>
                                  <a
                                    href={upiPayUrl}
                                    className="px-3 py-1.5 bg-[#1A2421] text-white text-[9px] font-bold uppercase tracking-wider rounded-lg transition-colors hover:bg-slate-800 flex items-center gap-1.5"
                                  >
                                    Tap to Pay on Mobile
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Bank Transfer Panel */}
                      {paymentMethod === "bank" && (
                        <div className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white/40">
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">NEFT / IMPS Coordinates</h5>
                          <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 text-xs border-b border-slate-900/5 pb-2">
                            <span className="text-slate-400 font-bold uppercase text-[9px]">Account Name</span>
                            <span className="col-span-2 text-[#1A2421] font-bold text-right">Dr. Narayan Jethwani</span>

                            <span className="text-slate-400 font-bold uppercase text-[9px]">Bank Name</span>
                            <span className="col-span-2 text-[#1A2421] font-bold text-right">HDFC Bank Ltd</span>

                            <span className="text-slate-400 font-bold uppercase text-[9px]">Account Number</span>
                            <span className="col-span-2 text-[#1A2421] font-bold text-right flex items-center justify-end gap-1.5">
                              50200039742057
                              <button
                                onClick={() => navigator.clipboard.writeText("50200039742057")}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 animate-none"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </span>

                            <span className="text-slate-400 font-bold uppercase text-[9px]">IFSC Code</span>
                            <span className="col-span-2 text-[#1A2421] font-bold text-right flex items-center justify-end gap-1.5">
                              HDFC0004793
                              <button
                                onClick={() => navigator.clipboard.writeText("HDFC0004793")}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </span>

                            <span className="text-slate-400 font-bold uppercase text-[9px]">Branch / Type</span>
                            <span className="col-span-2 text-[#1A2421] font-semibold text-right">PAN Card Club Road Baner, Pune / Current Account</span>
                          </div>
                        </div>
                      )}

                      {/* Transaction reference ID input and screenshot upload */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Transaction Ref / UTR (Optional)</label>
                          <input
                            type="text"
                            value={transactionRef}
                            onChange={(e) => setTransactionRef(e.target.value)}
                            placeholder="e.g. UPI Ref, IMPS UTR, or GPay Txn ID"
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white/50 text-sm focus:outline-none focus:border-slate-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Payment Screenshot (Optional)</label>
                          {paymentScreenshot ? (
                            <div className="flex items-center justify-between p-2 rounded-xl border border-mint/25 bg-mint/[0.02] text-xs font-semibold text-slate-700 h-[46px] relative overflow-hidden">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div className="w-8 h-8 rounded bg-white border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  <img
                                    src={URL.createObjectURL(paymentScreenshot)}
                                    alt="Payment Screenshot Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="truncate max-w-[120px] font-extrabold text-slate-800">{paymentScreenshot.name}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setPaymentScreenshot(null)}
                                className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[8px] uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-1.5 h-[46px] border border-dashed border-slate-200 hover:border-slate-800 rounded-xl bg-white/50 cursor-pointer text-xs font-bold text-slate-500 hover:text-slate-800 transition-all">
                              <Plus className="w-3.5 h-3.5 text-slate-400" />
                              <span>Attach Screenshot</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setPaymentScreenshot(e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-400 font-semibold">Provide reference UTR or attach screenshot to expedite clinical registration verification.</p>

                      {/* Action buttons */}
                      <div className="flex justify-between gap-3 pt-4 border-t border-slate-100">
                        <button
                          onClick={() => setCheckoutStep("intake")}
                          className="px-6 py-3 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50 hover:bg-slate-100"
                        >
                          Back to Profile
                        </button>
                        <button
                          onClick={() => {
                            const cleanComplaint = patientComplaint.trim();
                            const billingCycleText = checkoutPlan.billingCycle === "weekly" ? "Weekly Settle" : "Monthly Commit";
                            
                            const locationText = deliveryMode === "shipping" 
                              ? `${patientAddress}, ${patientCity}, ${patientState}, ${patientCountry}`
                              : deliveryMode === "walkin"
                                ? "In-Person Walk-in (Baner Clinic, Pune)"
                                : "Self-Arranged Pickup (Dunzo/Porter/etc.)";

                            const shippingCostText = deliveryMode === "shipping"
                              ? (patientCountry === "India" ? "Domestic Standard Courier (₹300)" : "International Courier (Calculated at dispatch)")
                              : "Free Clinic/Self Pickup (₹0)";

                            const screenshotText = paymentScreenshot 
                              ? `Attached (${paymentScreenshot.name})`
                              : "Not attached (will send in chat)";

                            const message = `Hello Dr. Jethwani, I would like to register for a Clinical Treatment Program:

*PATIENT DETAILS:*
- *Name:* ${patientName} (${patientAge} Years, ${patientGender})
- *Contact:* ${patientPhone}
${deliveryMode === "shipping" ? `- *Email:* ${patientEmail}\n` : ""}- *Delivery Mode:* ${deliveryMode === "shipping" ? "Courier Shipping" : deliveryMode === "walkin" ? "Walk-in Clinic Pickup" : "Self-Arranged Pickup"}
- *Collection/Shipping Address:* ${locationText}
- *Chief Complaint:* ${cleanComplaint}

*PROGRAM SELECTION:*
- *Care Tier:* ${checkoutPlan.title} (${checkoutPlan.description})
- *Conditions Setup:* ${checkoutPlan.conditionsText}
- *Billing Cycle:* ${billingCycleText}
- *Duration:* ${checkoutPlan.durationText}
- *Program Cost:* ₹${checkoutPlan.finalPrice.toLocaleString("en-IN")} ${checkoutPlan.discountPercent > 0 ? `(with ${checkoutPlan.discountPercent}% Discount)` : ""}${isSenior ? `\n- *Senior Concession:* -₹${publicSeniorDiscount.toLocaleString("en-IN")} (15% Concession)` : ""}
- *Shipping Cost:* ${shippingCostText}
- *Total Amount:* ₹${finalPayable.toLocaleString("en-IN")}

*PAYMENT REGISTRATION:*
- *Method:* ${paymentMethod === "upi" ? "GPay / Paytm / PhonePe UPI" : "Bank IMPS / NEFT"}
- *Ref / UTR ID:* ${transactionRef.trim() || "Not provided"}
- *Screenshot:* ${screenshotText}

I have transferred the payment to your registered GPay (8446056789) or bank account. Please review my profile and confirm next clinical consultation steps.`;

                            const encodedText = encodeURIComponent(message);
                            window.open(`https://wa.me/918446056789?text=${encodedText}`, "_blank");
                            setCheckoutStep("success");
                          }}
                          className="px-8 py-3 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          Submit Order & Checkout
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {checkoutStep === "success" && (
                  <div className="text-center py-8 space-y-6 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto shadow-inner breathe">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block">Step 3 of 3</span>
                      <h3 className="text-2xl font-black text-slate-900">Registration Initiated!</h3>
                      <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                        Your intake profile and payment reference have been generated. We are ready to finalize your treatment plan.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-900/5 border border-slate-200/50 rounded-2xl text-left space-y-3 text-xs leading-relaxed text-slate-700">
                      <p className="font-bold text-[#1A2421] text-center border-b border-slate-200 pb-2">Next Steps Checklist</p>
                      <div className="flex gap-2">
                        <span className="text-mint font-black">✓</span>
                        <p><span className="font-bold">WhatsApp details sent:</span> A draft message has been opened. Hit send in WhatsApp to submit your intake details.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-mint font-black">✓</span>
                        <p><span className="font-bold">Upload transfer proof:</span> Send a screenshot of the payment transfer in that same WhatsApp chat.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-mint font-black">✓</span>
                        <p><span className="font-bold">Initial Consultation:</span> Dr. Jethwani's clinic desk will coordinate your video telehealth consultation scheduling within 24 hours.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCheckoutOpen(false);
                        setPatientName("");
                        setPatientPhone("");
                        setPatientEmail("");
                        setPatientAge("");
                        setPatientCity("");
                        setPatientState("");
                        setPatientAddress("");
                        setPatientComplaint("");
                        setTransactionRef("");
                      }}
                      className="px-8 py-3 bg-[#1A2421] hover:bg-[#2b3a36] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md w-full"
                    >
                      Close Checkout
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
