"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Sparkles, CheckCircle2, 
  ArrowRight, ArrowLeft, MessageSquare, ShieldCheck, Truck, Clock,
  Sliders, Plus, Trash2, Share2, Copy, Save, LayoutGrid, Layers, Activity,
  Info, Percent, HelpCircle, UserCheck, AlertTriangle,
  PlusCircle, Stethoscope, Fingerprint, BrainCircuit, CalendarCheck, Globe, Pill, ClipboardList,
  HeartPulse, ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";
import { getTreatmentRecommendation } from "@/lib/treatmentRecommendationEngine";
import { CARE_LEVELS_DETAILS, surchargesLookup as baseSurchargesLookup } from "@/lib/pricingConfig";
import { OrganSystemsDirectory } from "@/features/store-clinical-care/components/OrganSystemsDirectory";

const classicCareLevelsDetails = {
  ...CARE_LEVELS_DETAILS,
  acute_critical: {
    ...CARE_LEVELS_DETAILS.acute_critical,
    title: "Priority Acute Support",
    weeklyPrice: 5000,
    monthlyPrice: 20000,
    badge: "Priority Acute",
    icon: "🚨",
    complexityLabel: "Priority",
    description: "Urgent, high-intensity acute cases requiring daily clinical reviews, frequent remedy titration, and priority physician supervision.",
    surchargeWeekly: 1250,
    surchargeMonthly: 5000,
  },
  organ: {
    ...CARE_LEVELS_DETAILS.organ,
    title: "Advanced Pathological Care",
    weeklyPrice: 8000,
    monthlyPrice: 32000,
    badge: "Organ System Recovery",
    icon: "🫁",
    complexityLabel: "High",
    description: "Advanced recovery protocols for deep-seated pathology, including organ system rebalancing and biomarker reviews.",
    surchargeWeekly: 2000,
    surchargeMonthly: 8000,
  },
};

const surchargesLookup: Record<string, { unitWeekly: number; unitMonthly: number }> = {
  mild: { unitWeekly: 500, unitMonthly: 2000 },
  chronic_focused: { unitWeekly: 1000, unitMonthly: 4000 },
  moderate: { unitWeekly: 1500, unitMonthly: 6000 },
  focused: { unitWeekly: 3000, unitMonthly: 12000 },
  organ: { unitWeekly: 2000, unitMonthly: 8000 },
  comprehensive: { unitWeekly: 3000, unitMonthly: 12000 },
  acute_critical: { unitWeekly: 1250, unitMonthly: 5000 },
};

const careLevelsDetails = classicCareLevelsDetails;

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
    id: "wellness-care",
    title: "Acute & Wellness Care",
    priceWeekly: "₹2,000",
    priceMonthly: "₹7,200",
    category: "consultation",
    desc: "Ideal for general immunity, hair fall, seasonal acute complaints, or general wellness guidance.",
    features: [
      "General constitutional wellness analysis",
      "Corrective micro-dosing remedy supply",
      "Standard wellness dietary guide sheet",
      "WhatsApp clinical team updates (bi-weekly)"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(20,184,166,0.15)",
    colorTheme: {
      text: "text-teal-700 dark:text-teal-400",
      border: "border-teal-200/80 hover:border-teal-400/80 dark:border-teal-950 dark:hover:border-teal-800",
      bg: "bg-teal-500/[0.04] dark:bg-teal-950/20",
      badgeBg: "bg-teal-105 dark:bg-teal-950/40 border border-teal-200/50",
      badgeText: "text-teal-700 dark:text-teal-300",
      glow: "rgba(20,184,166,0.15)"
    },
    productIdWeekly: "wellness_care_weekly",
    productIdMonthly: "wellness_care_monthly"
  },
  {
    id: "standard-chronic-care",
    title: "Standard Chronic Care",
    priceWeekly: "₹3,000",
    priceMonthly: "₹10,800",
    category: "consultation",
    desc: "Designed for a single chronic condition (e.g. eczema, IBS, thyroid) requiring active tracking and bi-weekly checks.",
    features: [
      "Single chronic condition profile mapping",
      "Targeted constitutional remedy preparation",
      "Anti-inflammatory diet & lifestyle sheets",
      "Standard clinical response monitoring checkups"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(168,85,247,0.15)",
    colorTheme: {
      text: "text-purple-750 dark:text-purple-400",
      border: "border-purple-200/80 hover:border-purple-400/80 dark:border-purple-950 dark:hover:border-purple-800",
      bg: "bg-purple-500/[0.04] dark:bg-purple-950/20",
      badgeBg: "bg-purple-100 dark:bg-purple-950/40 border border-purple-200/50",
      badgeText: "text-purple-700 dark:text-purple-300",
      glow: "rgba(168,85,247,0.15)"
    },
    productIdWeekly: "standard_care_weekly",
    productIdMonthly: "standard_care_monthly"
  },
  {
    id: "focused-care",
    title: "Integrated Clinical Care",
    priceWeekly: "₹6,000",
    priceMonthly: "₹21,600",
    category: "consultation",
    desc: "Deep homeopathic treatment for complex chronic or systemic health conditions (e.g. asthma, migraine, severe eczema).",
    features: [
      "Targeted single-condition evaluation",
      "Custom constitutional remedy preparation",
      "Standard diet & allergen avoidance instructions",
      "Standard clinical response monitoring"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(14,165,233,0.15)",
    colorTheme: {
      text: "text-sky-700 dark:text-sky-400",
      border: "border-sky-200/80 hover:border-sky-400/80 dark:border-sky-950 dark:hover:border-sky-800",
      bg: "bg-sky-500/[0.04] dark:bg-sky-950/20",
      badgeBg: "bg-sky-100 dark:bg-sky-950/40 border border-sky-200/50",
      badgeText: "text-sky-700 dark:text-sky-300",
      glow: "rgba(14,165,233,0.15)"
    },
    productIdWeekly: "focused_care_weekly",
    productIdMonthly: "focused_care_monthly"
  },
  {
    id: "critical-care",
    title: "Priority Acute Support",
    priceWeekly: "₹5,000",
    priceMonthly: "₹20,000",
    category: "consultation",
    desc: "For urgent, high-intensity acute cases requiring daily tracking, frequent remedy adjustments, and intensive physician study.",
    features: [
      "Daily doctor clinical review and check-ins",
      "Intensive daily remedy titration and support",
      "Emergency/priority WhatsApp communication channel",
      "Detailed case study and Organon-guided repertorization"
    ],
    duration: "Flexible Billing",
    badge: "🚨 Daily Check-ins",
    glowColor: "rgba(239,68,68,0.15)",
    colorTheme: {
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-200/80 hover:border-rose-400/80 dark:border-rose-950 dark:hover:border-rose-800",
      bg: "bg-rose-500/[0.04] dark:bg-rose-950/20",
      badgeBg: "bg-rose-100 dark:bg-rose-950/40 border border-rose-200/50",
      badgeText: "text-rose-700 dark:text-rose-300",
      glow: "rgba(239,68,68,0.15)"
    },
    productIdWeekly: "critical_care_weekly",
    productIdMonthly: "critical_care_monthly"
  },
  {
    id: "recommended-system-care",
    title: "Advanced Pathological Care",
    priceWeekly: "₹8,000",
    priceMonthly: "₹32,000",
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
    glowColor: "rgba(16,185,129,0.15)",
    colorTheme: {
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-250 hover:border-emerald-400/80 dark:border-emerald-950 dark:hover:border-emerald-800 shadow-sm shadow-emerald-500/5",
      bg: "bg-emerald-500/[0.04] dark:bg-emerald-950/20",
      badgeBg: "bg-emerald-600 dark:bg-emerald-500 border border-emerald-700",
      badgeText: "text-white",
      glow: "rgba(16,185,129,0.2)"
    },
    productIdWeekly: "system_care_weekly",
    productIdMonthly: "system_care_monthly"
  },
  {
    id: "comprehensive-care",
    title: "Multisystem Integrative Care",
    priceWeekly: "₹12,000",
    priceMonthly: "₹43,200",
    category: "consultation",
    desc: "High-intensity multi-organ care program under direct physician supervision for advanced chronic diseases.",
    features: [
      "Deeper multi-system constitutional evaluation",
      "Deeper chronic pathology case reviews",
      "High-frequency dosage reviews & titration",
      "Ongoing supervision by clinical team"
    ],
    duration: "Flexible Billing",
    glowColor: "rgba(99,102,241,0.15)",
    colorTheme: {
      text: "text-indigo-700 dark:text-indigo-400",
      border: "border-indigo-200/80 hover:border-indigo-400/80 dark:border-indigo-950 dark:hover:border-indigo-800",
      bg: "bg-indigo-500/[0.04] dark:bg-indigo-950/20",
      badgeBg: "bg-indigo-100 dark:bg-indigo-950/40 border border-indigo-200/50",
      badgeText: "text-indigo-700 dark:text-indigo-300",
      glow: "rgba(99,102,241,0.15)"
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
  careLevel: keyof typeof careLevelsDetails;
  billingCycle: "weekly" | "monthly";
  durationValue: number;
  finalPrice: number;
  date: string;
  conditionsCount: number;
}


// careLevelsDetails is imported from centralized config above

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
  careLevel: "mild" | "moderate" | "focused" | "organ" | "comprehensive" | "acute_critical";
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

const DOCTOR_PLAN_CATEGORIES = [
  { id: "all", label: "All Concerns" },
  { id: "digestive", label: "Digestive & Gut" },
  { id: "respiratory", label: "Respiratory & ENT" },
  { id: "skin", label: "Skin & Hair" },
  { id: "joints", label: "Bones & Joints" },
  { id: "metabolic", label: "Metabolic & Thyroid" },
  { id: "neuro", label: "Stress & Headaches" },
  { id: "women", label: "Women's Health" },
  { id: "pediatric", label: "Child Health" },
];

const POPULAR_DOCTOR_PLAN_CONCERNS = [
  { id: "acidity", label: "Acidity / GERD", category: "digestive", system: "Digestive", level: "mild" },
  { id: "ibs", label: "Chronic IBS", category: "digestive", system: "Digestive", level: "moderate" },
  { id: "fatty-liver", label: "Fatty Liver", category: "digestive", system: "Digestive", level: "organ" },
  { id: "sinusitis", label: "Recurrent Sinusitis / Allergy", category: "respiratory", system: "Respiratory & ENT", level: "moderate" },
  { id: "asthma", label: "Bronchial Asthma", category: "respiratory", system: "Respiratory & ENT", level: "focused" },
  { id: "eczema", label: "Chronic Eczema / Dermatitis", category: "skin", system: "Skin & Hair", level: "moderate" },
  { id: "psoriasis", label: "Psoriasis", category: "skin", system: "Skin & Hair", level: "focused" },
  { id: "hair-fall", label: "Hair Fall / Alopecia", category: "skin", system: "Skin & Hair", level: "mild" },
  { id: "joint-pain", label: "Knee / Joint Pain (Arthritis)", category: "joints", system: "Bones & Joints", level: "moderate" },
  { id: "cervical", label: "Cervical / Lumbar Spondylosis", category: "joints", system: "Bones & Joints", level: "moderate" },
  { id: "migraine", label: "Vascular Migraine / Headaches", category: "neuro", system: "Stress & Neuro", level: "focused" },
  { id: "insomnia", label: "Stress / Sleep Disturbances", category: "neuro", system: "Stress & Neuro", level: "mild" },
  { id: "thyroid", label: "Hypothyroidism (Hashimoto's)", category: "metabolic", system: "Metabolic & Endocrine", level: "focused" },
  { id: "pcos", label: "PCOS / Irregular Cycles", category: "women", system: "Women's Health", level: "focused" },
  { id: "uti", label: "Recurrent UTI / Renal Spasms", category: "metabolic", system: "Urology", level: "moderate" },
  { id: "pediatric", label: "Frequent Colds / Tonsillitis", category: "pediatric", system: "Child Health", level: "mild" }
];

export default function StorePage() {
  const [mainDiscoveryTab, setMainDiscoveryTab] = useState<"plans" | "concerns">("plans");
  const [viewMode, setViewMode] = useState<"dashboard" | "catalog" | "doctorPlan" | "triage">("dashboard");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedAreaTitles, setSelectedAreaTitles] = useState<string[]>([]);
  const [selectedConditionName, setSelectedConditionName] = useState<string>("");
  const [walkInPatientId, setWalkInPatientId] = useState<string>("");
  const [walkInSheetUrl, setWalkInSheetUrl] = useState<string>("");
  const [walkInFolderUrl, setWalkInFolderUrl] = useState<string>("");

  // Calculator states
  const [careLevel, setCareLevel] = useState<keyof typeof careLevelsDetails>("mild");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("weekly");
  const [durationValue, setDurationValue] = useState<number>(4); // Default to weekly cycle, 4 weeks
  const [conditionsCount, setConditionsCount] = useState<number>(1); // 1, 2, 3, 4, 5

  // Saved configs list
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // AI Helper and Guidelines states
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [triageStep, setTriageStep] = useState<number | "result">(1);
  const [triageAnswers, setTriageAnswers] = useState({
    symptomsComplexity: "moderate", // 'mild' | 'moderate' | 'focused' | 'organ' | 'acute_critical'
    conditionsNumber: 1, // 1 | 2 | 3 | 4 | 5
    supervisionNeed: "standard" // 'standard' | 'high' | 'urgent'
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
  
  // Doctor Plan / Presentation states
  const [walkInName, setWalkInName] = useState("");
  const [walkInTier, setWalkInTier] = useState("chronic_focused");
  const [walkInBillingCycle, setWalkInBillingCycle] = useState<"weekly" | "monthly">("weekly");
  const [walkInConditionsCount, setWalkInConditionsCount] = useState<number>(1);
  const [walkInDurationValue, setWalkInDurationValue] = useState<number>(4);
  const [walkInSelectedConcerns, setWalkInSelectedConcerns] = useState<string[]>([]);
  const [walkInConcernCategory, setWalkInConcernCategory] = useState<string>("all");
  const [doctorPlanCopied, setDoctorPlanCopied] = useState(false);
  
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
    careLevel?: keyof typeof careLevelsDetails;
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
  const [catalogDuration, setCatalogDuration] = useState<number>(1);

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

      if (modeParam === "catalog" || modeParam === "dashboard" || modeParam === "doctorPlan" || modeParam === "triage" || modeParam === "helper") {
        setViewMode(modeParam === "helper" ? "triage" : modeParam as any);
      }
      
      if (levelParam && ["mild", "moderate", "focused", "organ", "comprehensive", "acute_critical"].includes(levelParam)) {
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
        if (val >= 1 && val <= 5) {
          setConditionsCount(val);
        }
      }
    } catch (e) {
      console.error("Error parsing URL parameters:", e);
    }
  }, []);

  // Lock body scroll when checkout modal or triage helper is open to prevent double scrollbars and layout shifts
  useEffect(() => {
    if (isCheckoutOpen || isHelperOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCheckoutOpen, isHelperOpen]);

  const toggleWalkInConcern = (concernLabel: string) => {
    setWalkInSelectedConcerns((prev) => {
      const exists = prev.includes(concernLabel);
      const next = exists ? prev.filter((c) => c !== concernLabel) : [...prev, concernLabel];
      const count = Math.min(5, Math.max(1, next.length));
      setWalkInConditionsCount(count);
      return next;
    });
  };

  const clearWalkInConcerns = () => {
    setWalkInSelectedConcerns([]);
    setWalkInConditionsCount(1);
  };

  const handleHealthConcernSelection = (areaIds: string[], areaTitles: string[], conditionName: string) => {
    setSelectedAreaIds(areaIds);
    setSelectedAreaTitles(areaTitles);
    setSelectedConditionName(conditionName);
    if (areaTitles.length > 0) {
      const count = Math.min(5, Math.max(1, areaTitles.length));
      setConditionsCount(count);
      setWalkInConditionsCount(count);
      if (count >= 3) {
        setCareLevel("comprehensive");
        setWalkInTier("comprehensive");
      } else if (count === 2) {
        setCareLevel("focused");
        setWalkInTier("focused");
      } else {
        setCareLevel("moderate");
        setWalkInTier("moderate");
      }
      if (conditionName) {
        setWalkInSelectedConcerns((prev) => 
          prev.includes(conditionName) ? prev : [...prev, conditionName]
        );
      }
    }
  };

  const showCarePathways = () => {
    setMainDiscoveryTab("plans");
    setViewMode("dashboard");
    window.setTimeout(() => {
      const el = document.getElementById("treatment-planner-core");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }, 60);
  };

  const showDoctorPlan = () => {
    setMainDiscoveryTab("plans");
    setViewMode("doctorPlan");
    window.setTimeout(() => {
      const el = document.getElementById("doctor-plan-core");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }, 60);
  };

  const calculatePricing = (
    level: keyof typeof careLevelsDetails,
    cycle: "weekly" | "monthly",
    duration: number,
    conditions: number = 1
  ) => {
    const details = careLevelsDetails[level];
    const weeklyBase = details.weeklyPrice;
    
    // Express Acute Care (3 Days) support: duration 0.5 represents the 3-day course
    if (cycle === "weekly" && duration === 0.5) {
      const expressBase = level === "mild" ? 1000 : Math.round(weeklyBase * 0.5);
      const tierSurcharges = surchargesLookup[level] || {
        unitWeekly: Math.round(weeklyBase * 0.25),
        unitMonthly: Math.round(weeklyBase * 0.25) * 4,
      };
      const expressSurcharge = conditions > 1 ? Math.round((conditions - 1) * tierSurcharges.unitWeekly * 0.5) : 0;
      const rawTotal = expressBase + expressSurcharge;
      return {
        basePrice: expressBase,
        surcharge: expressSurcharge,
        adjustedBasePrice: rawTotal,
        rawTotal,
        discountPercent: 0,
        discountAmount: 0,
        finalPrice: rawTotal,
      };
    }

    // Unified math: Monthly base is strictly 4x weekly rate, avoiding double discounting
    const basePrice = cycle === "weekly" ? weeklyBase : weeklyBase * 4;

    let surcharge = 0;
    if (conditions > 1) {
      const tierSurcharges = surchargesLookup[level] || {
        unitWeekly: Math.round(weeklyBase * 0.25),
        unitMonthly: Math.round(weeklyBase * 0.25) * 4,
      };
      const weeklyUnit = tierSurcharges.unitWeekly;
      const unit = cycle === "weekly" ? weeklyUnit : weeklyUnit * 4;
      surcharge = (conditions - 1) * unit;
    }

    const adjustedBasePrice = basePrice + surcharge;
    const rawTotal = adjustedBasePrice * duration;
    
    // Equivalent weeks (1 month = 4 weeks)
    const equivalentWeeks = cycle === "weekly" ? duration : duration * 4;
    
    let discountPercent = 0;
    if (equivalentWeeks >= 48) {
      discountPercent = 30; // 1 Year (12 Mos / 48 Wks)
    } else if (equivalentWeeks >= 24) {
      discountPercent = 25; // 6 Months (24 Wks)
    } else if (equivalentWeeks >= 12) {
      discountPercent = 20; // 3 Months (12 Wks)
    } else if (equivalentWeeks >= 8) {
      discountPercent = 15; // 2 Months (8 Wks)
    } else if (equivalentWeeks >= 4) {
      discountPercent = 10; // 1 Month (4 Wks)
    } else {
      discountPercent = 0; // 1-2 Weeks
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
    const conditionsText = conditionsCount === 1 
      ? "1 Cond." 
      : conditionsCount === 2 
        ? "2 Cond." 
        : conditionsCount === 3 
          ? "3 Cond." 
          : conditionsCount === 4 
            ? "4 Cond." 
            : "5+ Cond.";

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

  const getDoctorPlanWhatsAppText = () => {
    const tierKey = (walkInTier in careLevelsDetails ? walkInTier : "chronic_focused") as keyof typeof careLevelsDetails;
    const details = careLevelsDetails[tierKey] || careLevelsDetails.chronic_focused;
    const pricing = calculatePricing(tierKey, walkInBillingCycle, walkInDurationValue, walkInConditionsCount);

    const isExpressAcute = tierKey === "mild" && walkInDurationValue === 0.5;
    const planTitle = isExpressAcute ? "Express Acute Care (3 Days)" : details.title;
    const protocolBadge = isExpressAcute ? "Targeted Acute Protocol · ₹1,000" : (details.badge || details.subtitle || "");

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
    const cycleText = walkInBillingCycle === "weekly" ? (isExpressAcute ? "3-Day Course" : "Weekly") : "Monthly";
    const durationText = isExpressAcute
      ? "3 Days"
      : `${walkInDurationValue} ${walkInBillingCycle === "weekly" ? (walkInDurationValue === 1 ? "Week" : "Weeks") : (walkInDurationValue === 1 ? "Month" : "Months")}`;
    const daysText = walkInBillingCycle === "weekly"
      ? (walkInDurationValue === 0.5 ? 3 : walkInDurationValue * 7)
      : walkInDurationValue * 30;
    const dailyRate = Math.round(finalPrice / daysText);
    const concernsList = walkInSelectedConcerns.length > 0
      ? walkInSelectedConcerns.join(", ")
      : `${walkInConditionsCount} Condition(s) Scope`;
    const patientHeader = walkInName.trim() ? `*Patient:* ${walkInName.trim()}\n` : "";

    return `🌿 *Homeo Healthcare — Physician Treatment Plan*\n` +
      `----------------------------------------\n` +
      patientHeader +
      `*Clinical Care Program:* ${planTitle}\n` +
      `*Protocol:* ${protocolBadge}\n` +
      `*Targeted Health Concerns:* ${concernsList}\n` +
      `*Care Duration:* ${durationText} (${daysText} Days — ${cycleText})\n` +
      `----------------------------------------\n` +
      `*Itemized Care Investment:*\n` +
      `• Base Clinical Care: ₹${pricing.basePrice.toLocaleString("en-IN")}/${isExpressAcute ? "3 days" : (walkInBillingCycle === "weekly" ? "wk" : "mo")}\n` +
      (pricing.surcharge > 0 ? `• Multi-Concern Coordination: +₹${pricing.surcharge.toLocaleString("en-IN")}/${isExpressAcute ? "3 days" : (walkInBillingCycle === "weekly" ? "wk" : "mo")}\n` : "") +
      (pricing.discountPercent > 0 ? `• Continuity Benefit (${pricing.discountPercent}%): -₹${pricing.discountAmount.toLocaleString("en-IN")}\n` : "") +
      (walkInApplyConcession && concessionDiscount > 0 ? `• Clinical Concession: -₹${concessionDiscount.toLocaleString("en-IN")}\n` : "") +
      (walkInApplyMedicineAddon && addonAmount > 0 ? `• Specialty Remedies Add-on: +₹${addonAmount.toLocaleString("en-IN")}\n` : "") +
      `----------------------------------------\n` +
      `*Total Treatment Investment: ₹${finalPrice.toLocaleString("en-IN")}*\n` +
      `*Daily Care Equivalent: ₹${dailyRate}/day*\n` +
      `----------------------------------------\n` +
      `*Clinical Dispensing & Regimen:*\n` +
      `✓ Physician-Directed Proprietary Acute Formulations Included\n` +
      `✓ Customized Regimen (Numbered Morning, Evening & SOS Titration Vials)\n` +
      `✓ Targeted Anti-Inflammatory / Diet Guidance Sheet\n` +
      `✓ Doorstep Express Courier Dispatch Across India\n` +
      `✓ Clinical Review & Reassessment Included\n\n` +
      `Dr. Narayan Jethwani MD | Homeo Healthcare\n` +
      `https://homeo.healthcare`;
  };

  const handleShareDoctorPlanWhatsApp = () => {
    const text = getDoctorPlanWhatsAppText();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleCopyDoctorPlanQuotation = () => {
    const text = getDoctorPlanWhatsAppText();
    navigator.clipboard.writeText(text);
    setDoctorPlanCopied(true);
    setTimeout(() => setDoctorPlanCopied(false), 2500);
  };

  const handleSaveDoctorPlanPreset = () => {
    const tierKey = (walkInTier in careLevelsDetails ? walkInTier : "chronic_focused") as keyof typeof careLevelsDetails;
    const details = careLevelsDetails[tierKey];
    const finalPrice = getWalkInFinalPrice();
    const isExpressAcute = tierKey === "mild" && walkInDurationValue === 0.5;
    const planTitle = isExpressAcute ? "Express Acute Care (3 Days)" : details.title;
    const durationText = isExpressAcute
      ? "3 Days"
      : `${walkInDurationValue} ${walkInBillingCycle === "weekly" ? (walkInDurationValue === 1 ? "Week" : "Weeks") : (walkInDurationValue === 1 ? "Month" : "Months")}`;
    const conditionsText = walkInConditionsCount === 1 ? "1 Concern" : `${walkInConditionsCount} Concerns`;

    const newConfig: SavedConfig = {
      id: Math.random().toString(36).substring(2, 9),
      name: `Doctor Plan: ${planTitle} (${conditionsText}, ${durationText})`,
      careLevel: tierKey,
      billingCycle: walkInBillingCycle,
      durationValue: walkInDurationValue,
      conditionsCount: walkInConditionsCount,
      finalPrice,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    const updated = [...savedConfigs, newConfig];
    setSavedConfigs(updated);
    try {
      localStorage.setItem("homeo_saved_configs", JSON.stringify(updated));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error("Error saving preset:", e);
    }
  };

  const handleResetDoctorPlan = () => {
    setWalkInTier("chronic_focused");
    setWalkInBillingCycle("weekly");
    setWalkInDurationValue(4);
    setWalkInConditionsCount(1);
    setWalkInSelectedConcerns([]);
    setWalkInConcernCategory("all");
    setWalkInApplyConcession(false);
    setWalkInConcessionType("senior");
    setWalkInOverridePrice("");
    setWalkInApplyMedicineAddon(false);
    setWalkInMedicineAddons([{ id: "1", type: "Dilution", details: "", amount: "" }]);
    setWalkInName("");
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
        : conditionsCount === 3
          ? "3 co-existing conditions"
          : conditionsCount === 4
            ? "4 co-existing conditions"
            : "5+ co-existing conditions";
      
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
        : (config.conditionsCount || 1) === 3
          ? "3 co-existing conditions"
          : (config.conditionsCount || 1) === 4
            ? "4 co-existing conditions"
            : "5+ co-existing conditions";

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
    
    let recommendedLevel: "mild" | "moderate" | "focused" | "organ" | "comprehensive" | "acute_critical" = "focused";
    
    if (supervisionNeed === "urgent" || symptomsComplexity === "acute_critical") {
      recommendedLevel = "acute_critical";
    } else if (supervisionNeed === "high") {
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
        if (conditionsNumber >= 3) recommendedLevel = "comprehensive";
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
    if (recommendedLevel === "acute_critical") {
      detail = "Your case is an urgent acute case requiring daily clinical monitoring, frequent remedy adjustments, and priority supervision.";
    } else if (recommendedLevel === "mild") {
      detail = "You have a single mild, seasonal, or acute condition that can be managed with standard constitutional support and guidelines.";
    } else if (recommendedLevel === "moderate") {
      detail = "Your condition is chronic but localized to a single primary issue (such as eczema or IBS), which fits constitutional tracking with bi-weekly coordination.";
    } else if (recommendedLevel === "focused") {
      if (symptomsComplexity === "mild" && conditionsNumber >= 3) {
        detail = "Although your symptoms are mild individually, managing multiple co-existing complaints requires a focused systemic plan to coordinate remedies without interactions.";
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
    setViewMode("dashboard");
    
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

  const recommendation = getTreatmentRecommendation(
    careLevel,
    conditionsCount,
    durationValue,
    billingCycle
  );

  return (
    <div className="store-care-page pt-28 pb-24 px-4 md:px-8 lg:px-12 relative">
      <div className="w-full z-10 relative">
        
        {/* Back to Homepage Button & Physician Portal */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center justify-between flex-wrap gap-4"
        >
          <Magnetic>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
            </Link>
          </Magnetic>

          <a
            href="/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200/80 bg-white/70 hover:bg-white text-slate-700 text-xs font-bold tracking-wide transition-all shadow-xs"
          >
            <Stethoscope className="w-3.5 h-3.5 text-mint" />
            <span>Physician Portal (Sheets Treatment Planner)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </motion.div>

        {/* Top Discovery Tabs (Matching frontend homeo.healthcare store) */}
        <div className="mb-10 scroll-mt-28 rounded-[1.75rem] border border-slate-200/80 bg-white/80 backdrop-blur-md p-2 shadow-sm">
          <div role="tablist" aria-label="Choose how to begin" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              id="compare-plans-tab"
              type="button"
              role="tab"
              aria-selected={mainDiscoveryTab === "plans"}
              onClick={() => {
                setMainDiscoveryTab("plans");
                if (viewMode === "catalog" || viewMode === "doctorPlan" || viewMode === "triage") {
                  // Maintain active sub-mode
                } else {
                  setViewMode("dashboard");
                }
              }}
              className={`flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-left transition-all duration-300 cursor-pointer ${
                mainDiscoveryTab === "plans"
                  ? "bg-[#1A2421] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                className={`rounded-xl p-2.5 transition-colors ${
                  mainDiscoveryTab === "plans" ? "bg-white/10 text-mint" : "bg-mint/10 text-mint-dark"
                }`}
              >
                <Sliders className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <strong className="block text-sm font-bold">Compare Plans & Fees</strong>
                <span
                  className={`mt-0.5 block text-[10px] font-semibold ${
                    mainDiscoveryTab === "plans" ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  See care scope, payment periods and fees
                </span>
              </span>
            </button>

            <button
              id="explore-concerns-tab"
              type="button"
              role="tab"
              aria-selected={mainDiscoveryTab === "concerns"}
              onClick={() => setMainDiscoveryTab("concerns")}
              className={`flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-left transition-all duration-300 cursor-pointer ${
                mainDiscoveryTab === "concerns"
                  ? "bg-[#1A2421] text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span
                className={`rounded-xl p-2.5 transition-colors ${
                  mainDiscoveryTab === "concerns" ? "bg-white/10 text-mint" : "bg-mint/10 text-mint-dark"
                }`}
              >
                <HeartPulse className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="flex items-center gap-2 text-sm font-bold">
                  Explore by Health Concern
                  {selectedAreaIds.length > 0 && (
                    <span className="rounded-full bg-mint px-2 py-0.5 text-[9px] text-white">
                      {selectedAreaIds.length}
                    </span>
                  )}
                </strong>
                <span
                  className={`mt-0.5 block text-[10px] font-semibold ${
                    mainDiscoveryTab === "concerns" ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  Browse organ systems and common conditions
                </span>
              </span>
            </button>
          </div>
        </div>

        {mainDiscoveryTab === "concerns" ? (
          <div className="mb-20">
            <OrganSystemsDirectory
              selectedAreaIds={selectedAreaIds}
              selectedCondition={selectedConditionName}
              onSelectionChange={handleHealthConcernSelection}
              onContinueToPathways={showCarePathways}
              onProceedToAssessment={showDoctorPlan}
            />
          </div>
        ) : (
          <>
            {/* Page Hero Header */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-xs font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 breathe" />
                Clinical Pricing & Packages
              </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-slate-950 dark:text-white mb-6"
          >
            Clinical Care Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed max-w-4xl"
          >
            Personalized physician-led homeopathic care with structured follow-up and treatment planning. Starting from ₹2,000/week, billed with flexible weekly and monthly options. Choose longer care duration to receive continuity benefits. All therapeutic care programs include consultation, remedies, custom diet sheets, and shipping inside India.
          </motion.p>
        </div>

        {/* Mode Switcher Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full border-2 border-slate-200 dark:border-slate-700 backdrop-blur-md z-0 relative">
            <button
              onClick={() => setViewMode("triage")}
              className={`relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                viewMode === "triage"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {viewMode === "triage" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Sparkles className="w-3.5 h-3.5" />
              Help Me Plan
            </button>
            <button
              onClick={() => setViewMode("dashboard")}
              className={`relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                viewMode === "dashboard"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {viewMode === "dashboard" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Sliders className="w-3.5 h-3.5" />
              Treatment Planner
            </button>
            <button
              onClick={() => setMainDiscoveryTab("concerns")}
              className="relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
            >
              <HeartPulse className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Explore Concerns
            </button>
            <button
              onClick={() => setViewMode("catalog")}
              className={`relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                viewMode === "catalog"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {viewMode === "catalog" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <LayoutGrid className="w-3.5 h-3.5" />
              Traditional Catalog
            </button>
            <button
              onClick={() => setViewMode("doctorPlan")}
              className={`relative px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer z-10 ${
                viewMode === "doctorPlan"
                  ? "text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              {viewMode === "doctorPlan" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <UserCheck className="w-3.5 h-3.5" />
              Let Doctor Plan
            </button>
          </div>
          <Magnetic>
            <Link
              href="/store/plans"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-teal-600 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950 dark:hover:bg-teal-900 text-teal-950 dark:text-teal-200 text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
            >
              📊 Compare Tiers & Savings
            </Link>
          </Magnetic>
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
              className="space-y-12 mb-16"
            >
              {/* Section: Clinical Credentials - Why Patients Choose Homeo Healthcare */}
              <div className="space-y-8 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-[32px]">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <span className="text-xs font-black text-teal-800 dark:text-teal-400 tracking-widest uppercase bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 px-3.5 py-1 rounded-full">
                    Clinical Credentials
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                    Why Patients Choose Homeo Healthcare
                  </h2>
                  <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    Experience physician-led, AI-enhanced, individualized homeopathic care designed for long-term health—not one-size-fits-all treatment.
                  </p>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">20+ Years of Clinical Experience</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Extensive experience managing acute, chronic, and complex conditions with individualized homeopathy.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <Fingerprint className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Individualized Constitutional Treatment</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Personalized care plans tailored to your unique symptom profile, constitution, and health goals.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Physician-Designed AI Clinical Intelligence</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Advanced AI assists analysis and planning while every recommendation remains supervised by a physician.
                      </p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Continuous Treatment Monitoring</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Regular reviews ensure medicines and treatment strategies are refined throughout your care.
                      </p>
                    </div>
                  </div>

                  {/* Card 5 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Regular Physician Follow-ups</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Scheduled consultations ensure treatment remains aligned with your clinical progress.
                      </p>
                    </div>
                  </div>

                  {/* Card 6 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Worldwide Online Care</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Secure teleconsultations and medicine delivery support patients in India and worldwide.
                      </p>
                    </div>
                  </div>

                  {/* Card 7 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Personalized Medicine Adjustments</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Prescriptions are adjusted whenever clinically appropriate rather than remaining fixed.
                      </p>
                    </div>
                  </div>

                  {/* Card 8 */}
                  <div className="border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 rounded-2xl py-4 px-5 flex gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="text-sm font-black text-slate-950 dark:text-white">Transparent Treatment Planning</h3>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                        Understand your care level, treatment duration, follow-up schedule, and investment upfront.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Highlight Panel */}
                <div className="border-2 border-teal-200 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 rounded-3xl p-6 md:p-8 space-y-4 text-center relative overflow-hidden shadow-sm">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-950 dark:text-white">Our Commitment to Personalized Care</h3>
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed max-w-4xl mx-auto">
                      At Homeo Healthcare, treatment recommendations are based on your individual clinical needs, expected follow-up intensity, and long-term care requirements—not standardized packages. Every care program is designed by Dr. Narayan Jethwani and supported by AI-assisted clinical decision support to enhance consistency, transparency, and patient understanding.
                    </p>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs font-black text-teal-900 dark:text-teal-200">
                    <span className="flex items-center gap-1">✓ Physician-Led</span>
                    <span className="flex items-center gap-1">✓ Personalized</span>
                    <span className="flex items-center gap-1">✓ AI-Assisted</span>
                    <span className="flex items-center gap-1">✓ Transparent Care Planning</span>
                  </div>
                </div>

                {/* Slim Trust Strip - Visual Bridge */}
                <div className="border-y border-slate-200 dark:border-slate-800 py-4 bg-slate-100/80 dark:bg-slate-850 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="font-black text-slate-950 dark:text-white">Trusted by patients for:</span>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-semibold">
                    <span className="flex items-center gap-1.5">🌍 Worldwide Online Consultations</span>
                    <span className="flex items-center gap-1.5">🧬 Personalized Constitutional Care</span>
                    <span className="flex items-center gap-1.5">🤖 AI-Assisted Clinical Intelligence</span>
                    <span className="flex items-center gap-1.5">👨‍⚕️ Physician-Led Treatment Planning</span>
                    <span className="flex items-center gap-1.5">📈 Continuous Progress Monitoring</span>
                  </div>
                </div>
              </div>

              {/* Clinical Recommendation Engine Header Label */}
              <div className="flex flex-col gap-1.5 text-left px-1 mt-4">
                <span className="text-sm font-black text-indigo-950 dark:text-indigo-200 flex items-center gap-2 tracking-wide">
                  🧠 Physician-Guided Clinical Treatment Recommendation Engine
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  AI-assisted recommendations based on your selected clinical requirements. Final treatment plan is confirmed after physician consultation.
                </p>
              </div>

              <div id="planner-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Dashboard Left Form Controls (8 cols) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Step 1: Care Level Grid */}
                  <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest block mb-1.5">Step 1</span>
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Select Recommended Care Intensity</h2>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                          Homeopathic treatment scales based on required care intensity. Every case is unique and requirements can change over time.
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5" />
                      </div>
                    </div>

                    {/* AI Helper and Guidelines Toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                          Unsure which care level you need?
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">Use our interactive helper or view mapping guidelines</p>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        <button
                          onClick={() => {
                            setTriageStep(1);
                            setViewMode("triage");
                          }}
                          className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                        >
                          🩺 Help Me Plan
                        </button>
                        <button
                          onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
                          className="px-5 py-2.5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
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

                          <div className="space-y-4 text-xs">
                            <p className="text-[11px] text-slate-655 font-semibold leading-relaxed">
                              The table below maps common chronic and acute conditions to our clinical care tiers. If treating multiple conditions, choose the tier for your <strong>most complex</strong> complaint, then select the total condition count in the planner. Additional care fees apply per additional condition beyond the primary concern (starting at ₹500/wk or ₹2,000/mo for Acute Wellness, ₹1,000/wk for Focused Chronic, scaled by tier complexity).
                            </p>

                            {/* Conditions count guide */}
                            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                              {[
                                { count: "1", label: "Single", desc: "One active complaint", color: "bg-slate-100 text-slate-700" },
                                { count: "2", label: "Dual", desc: "e.g. Thyroid + Skin", color: "bg-blue-50 text-blue-700" },
                                { count: "3", label: "Triple", desc: "e.g. DM + HTN + Skin", color: "bg-amber-50 text-amber-700" },
                                { count: "4", label: "Quad", desc: "e.g. 4 co-morbidities", color: "bg-orange-50 text-orange-700" },
                                { count: "5+", label: "Multi", desc: "Complex poly-morbid", color: "bg-rose-50 text-rose-700" },
                              ].map(({ count, label, desc, color }) => (
                                <div key={count} className={`rounded-xl p-2.5 text-center ${color}`}>
                                  <span className="block text-xl font-black">{count}</span>
                                  <span className="block text-[9px] font-bold uppercase">{label}</span>
                                  <span className="block text-[8px] font-semibold opacity-80 mt-0.5">{desc}</span>
                                </div>
                              ))}
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="border-b-2 border-slate-300 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                    <th className="py-2.5 pr-4 whitespace-nowrap">Care Level</th>
                                    <th className="py-2.5 px-4">Common Mapped Conditions</th>
                                    <th className="py-2.5 px-4 whitespace-nowrap">
                                      {billingCycle === "weekly" ? "Weekly Rate" : "Monthly Rate (4 Wks)"}
                                    </th>
                                    <th className="py-2.5 pl-4">Included Protocol</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200 text-xs">
                                  {[
                                    {
                                      key: "mild",
                                      icon: "🌱",
                                      name: "Acute & Wellness",
                                      conditions: "Acute cold/cough, seasonal allergies, simple hair fall, minor indigestion, mild flares.",
                                      weeklyPrice: 2000,
                                      monthlyPrice: 7200,
                                      protocol: "Constitutional micro-dose remedies, basic diet sheet, bi-weekly check-ins. (Express 3-Day Protocol available: ₹1,000)",
                                      textColor: "text-slate-950 dark:text-white",
                                    },
                                    {
                                      key: "chronic_focused",
                                      icon: "🌿",
                                      name: "Focused Chronic (Standard)",
                                      conditions: "Chronic eczema, dry skin/acne, mild thyroid, single joint pain, IBS/gas.",
                                      weeklyPrice: 3000,
                                      monthlyPrice: 10800,
                                      protocol: "Disease mapping, targeted remedies, detailed dietary guide, fortnightly reports.",
                                      textColor: "text-teal-900 dark:text-teal-200",
                                    },
                                    {
                                      key: "moderate",
                                      icon: "⚡",
                                      name: "Integrated Clinical",
                                      conditions: "Multiple interrelated health conditions, constitutional cases, dual system involvement (e.g. Thyroid + Skin).",
                                      weeklyPrice: 6000,
                                      monthlyPrice: 21600,
                                      protocol: "Constitutional care synthesis, interrelated organ systems evaluation, personalized treatment plan.",
                                      textColor: "text-sky-900 dark:text-sky-300",
                                    },
                                    {
                                      key: "focused",
                                      icon: "🎯",
                                      name: "Deep Systemic (Complex)",
                                      conditions: "Bronchial asthma, severe psoriasis, alopecia areata, PCOS-acne, vascular migraines.",
                                      weeklyPrice: 9000,
                                      monthlyPrice: 32400,
                                      protocol: "Deep organ-level pathology protocol, high-potency dilutions, lab report evaluation.",
                                      textColor: "text-emerald-900 dark:text-emerald-200",
                                    },
                                    {
                                      key: "organ",
                                      icon: "🫁",
                                      name: "Advanced Pathological",
                                      conditions: "Early CKD, fatty liver/elevated enzymes, multi-joint chronic arthritis, autoimmune rebalancing.",
                                      weeklyPrice: 8000,
                                      monthlyPrice: 32000,
                                      protocol: "Multi-remedy inter-system support, periodic blood report comparison, dietitian integration.",
                                      textColor: "text-indigo-900 dark:text-indigo-200",
                                    },
                                    {
                                      key: "comprehensive",
                                      icon: "🔮",
                                      name: "Multisystem Integrative",
                                      conditions: "3+ co-existing conditions (e.g. DM + CKD + RA), advanced poly-chronic autoimmune cases.",
                                      weeklyPrice: 12000,
                                      monthlyPrice: 43200,
                                      protocol: "Direct Dr. Jethwani supervision, high-frequency dosage adjustments, acute flare protocols.",
                                      textColor: "text-rose-900 dark:text-rose-300",
                                    },
                                    {
                                      key: "acute_critical",
                                      icon: "🚨",
                                      name: "Priority Acute Support",
                                      conditions: "Urgent acute illness — high fever, acute asthma attacks, acute renal crisis, emergency post-surgical support.",
                                      weeklyPrice: 5000,
                                      monthlyPrice: 20000,
                                      protocol: "Daily clinical monitoring, frequent remedy titration, priority WhatsApp supervision by Dr. Jethwani.",
                                      textColor: "text-red-900 dark:text-red-200",
                                    },
                                  ].map((row) => {
                                    const isSelected = careLevel === row.key;
                                    return (
                                      <tr
                                        key={row.key}
                                        onClick={() => {
                                          setCareLevel(row.key as keyof typeof careLevelsDetails);
                                          if (row.key !== "mild" && durationValue === 0.5) setDurationValue(1);
                                        }}
                                        className={`cursor-pointer transition-all duration-200 ${
                                          isSelected
                                            ? "bg-teal-50 dark:bg-teal-950/60 ring-2 ring-teal-500/40 shadow-xs"
                                            : row.key === "acute_critical"
                                            ? "bg-red-50/50 hover:bg-red-50/80"
                                            : "hover:bg-slate-100/70"
                                        }`}
                                      >
                                        <td className={`py-3 pr-4 font-black whitespace-nowrap ${row.textColor}`}>
                                          <div className="flex items-center gap-1.5">
                                            <span>{row.icon}</span>
                                            <span>{row.name}</span>
                                            {isSelected && (
                                              <span className="ml-1 text-[10px] bg-teal-700 text-white px-2 py-0.5 rounded-full font-black">
                                                Active
                                              </span>
                                            )}
                                          </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">{row.conditions}</td>
                                        <td className="py-3 px-4 font-black text-slate-950 dark:text-white whitespace-nowrap">
                                          <span className="block font-black text-sm">
                                            {billingCycle === "weekly"
                                              ? `₹${row.weeklyPrice.toLocaleString("en-IN")}/wk`
                                              : `₹${row.monthlyPrice.toLocaleString("en-IN")}/mo`}
                                          </span>
                                          <span className="block text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                            {billingCycle === "weekly"
                                              ? `₹${row.monthlyPrice.toLocaleString("en-IN")}/mo (4 wks)`
                                              : `₹${row.weeklyPrice.toLocaleString("en-IN")}/wk`}
                                          </span>
                                        </td>
                                        <td className="py-3 pl-4 text-slate-800 dark:text-slate-200 font-medium">{row.protocol}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center justify-between flex-wrap gap-2">
                              <span>* Additional Care Coordination fee applies per active condition beyond 1, scaled by clinical complexity. Weekly and monthly billing available.</span>
                              <span className="text-teal-900 dark:text-teal-200 font-black">Click any row to select care level</span>
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(Object.keys(careLevelsDetails) as (keyof typeof careLevelsDetails)[]).map((level) => {
                        const active = careLevel === level;
                        const details = careLevelsDetails[level];
                        const displayPrice = billingCycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
                        
                        return (
                          <button
                            type="button"
                            key={level}
                            onClick={() => {
                              setCareLevel(level);
                              if (level !== "mild" && durationValue === 0.5) setDurationValue(1);
                            }}
                            className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.97] relative group overflow-hidden ${
                              active
                                ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 ring-2 ring-teal-500/30 shadow-md"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900/60"
                            }`}
                          >
                            <span className="text-2xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform duration-200">
                              {details.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-slate-950 dark:text-white leading-tight truncate">{details.title}</h4>
                              <span className="text-xs font-black text-teal-800 dark:text-teal-300 font-sans block mt-1">
                                ₹{displayPrice.toLocaleString("en-IN")}/{billingCycle === "weekly" ? "wk" : "mo"}
                              </span>
                            </div>
                            {active && <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-teal-600 animate-pulse" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Care Level details & features */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={careLevel}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 border-l-4 border-l-teal-600 border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 rounded-2xl space-y-3.5 shadow-sm text-left"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xl">{activeDetails.icon}</span>
                            <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">{activeDetails.title} Details</h4>
                            
                            {/* Care Intensity Badge with Tooltip */}
                            <div className="flex items-center gap-1.5 bg-teal-100/90 dark:bg-teal-950/70 border border-teal-300 dark:border-teal-700 px-3 py-1 rounded-full text-xs font-black text-teal-900 dark:text-teal-200 relative group cursor-help select-none shrink-0 w-fit">
                              <span>Care Intensity: {activeDetails.complexityLabel}</span>
                              <HelpCircle className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 shrink-0" />

                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-60 p-3.5 bg-slate-900 text-white text-[10px] font-semibold leading-relaxed rounded-2xl shadow-xl border border-white/10 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 z-50 text-left">
                                Care Intensity reflects the expected level of physician supervision, follow-up intensity, treatment customization, and coordination required for this care program. It does not indicate disease severity.
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                          {activeDetails.description}
                        </p>
                        
                        {/* Features mini grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                          {activeDetails.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-black uppercase tracking-wide text-slate-900 dark:text-slate-100">
                              <span className="text-teal-700 dark:text-teal-400 font-black">✓</span>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Why this plan? Explanation Panel */}
                    <motion.div
                      key={`why-this-plan-${careLevel}-${conditionsCount}-${durationValue}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 border-2 border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl space-y-2 mt-4 text-left shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-indigo-950 dark:text-indigo-200 font-black text-xs uppercase tracking-wider">
                        <Info className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                        <span>Why this plan?</span>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {recommendation.patientExplanation}
                      </p>
                    </motion.div>
                  </div>

                  {/* Steps 1.5 & 2 Side-by-Side Wrapper */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Step 1.5: Active Health Concerns Selector */}
                    <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest block mb-1.5">Step 1.5</span>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Active Health Concerns</h2>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                              Select the number of concurrent active health concerns you wish to address. Multi-concern tracking scales physician analysis time.
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5">
                          {(() => {
                            const activeTierSurcharges = surchargesLookup[careLevel] || {
                              unitWeekly: Math.round((careLevelsDetails[careLevel]?.weeklyPrice || 2000) * 0.25),
                              unitMonthly: Math.round((careLevelsDetails[careLevel]?.weeklyPrice || 2000) * 0.25) * 4,
                            };
                            const items = [
                              { count: 1, label: "1 Health Concern", surchargeText: "Included", surchargeInfo: "Base plan" },
                              { count: 2, label: "2 Health Concerns", surchargeText: billingCycle === "weekly" ? `+₹${activeTierSurcharges.unitWeekly.toLocaleString("en-IN")}/wk` : `+₹${activeTierSurcharges.unitMonthly.toLocaleString("en-IN")}/mo`, surchargeInfo: "Dual-concern coordination" },
                              { count: 3, label: "3 Health Concerns", surchargeText: billingCycle === "weekly" ? `+₹${(activeTierSurcharges.unitWeekly * 2).toLocaleString("en-IN")}/wk` : `+₹${(activeTierSurcharges.unitMonthly * 2).toLocaleString("en-IN")}/mo`, surchargeInfo: "Triple-concern coordination" },
                              { count: 4, label: "4 Health Concerns", surchargeText: billingCycle === "weekly" ? `+₹${(activeTierSurcharges.unitWeekly * 3).toLocaleString("en-IN")}/wk` : `+₹${(activeTierSurcharges.unitMonthly * 3).toLocaleString("en-IN")}/mo`, surchargeInfo: "Quad-concern coordination" },
                              { count: 5, label: "5+ Health Concerns", surchargeText: billingCycle === "weekly" ? `+₹${(activeTierSurcharges.unitWeekly * 4).toLocaleString("en-IN")}/wk` : `+₹${(activeTierSurcharges.unitMonthly * 4).toLocaleString("en-IN")}/mo`, surchargeInfo: "Multi-concern integration" }
                            ];

                            return items.map((item) => {
                              const active = conditionsCount === item.count;
                              return (
                                <button
                                  type="button"
                                  key={item.count}
                                  onClick={() => setConditionsCount(item.count)}
                                  className={`px-4.5 py-3.5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98] ${
                                    active
                                      ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-500/20 font-black shadow-sm"
                                      : "border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/60 hover:bg-slate-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                      active ? "border-teal-600 bg-teal-600" : "border-slate-400 bg-white"
                                    }`}>
                                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <div className="text-left">
                                      <span className="text-sm font-black text-slate-950 dark:text-white block leading-tight">{item.label}</span>
                                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold block mt-0.5 uppercase tracking-wider">{item.surchargeInfo}</span>
                                    </div>
                                  </div>
                                  <span className="text-xs font-black text-teal-800 dark:text-teal-300 font-sans">
                                    {item.surchargeText}
                                  </span>
                                </button>
                              );
                            });
                          })()}
                        </div>
                        {conditionsCount > 1 && (
                          <p className="text-xs text-amber-900 dark:text-amber-200 font-bold leading-relaxed bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-4 rounded-2xl text-left">
                            Additional health concerns may require increased physician time, individualized treatment planning, and coordinated follow-up. The Clinical Complexity Adjustment reflects the additional care required.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Step 2: Duration & Billing Controls */}
                    <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between shadow-sm">
                      <div className="space-y-6">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-xs font-black text-teal-800 dark:text-teal-400 uppercase tracking-widest block mb-1.5">Step 2</span>
                            <h2 className="text-2xl font-black text-slate-950 dark:text-white tracking-tight">Billing & Duration Selection</h2>
                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                              Personalized physician-led homeopathic care with structured follow-up and treatment planning. Choose longer care duration to receive continuity benefits.
                            </p>
                          </div>
                          <div className="w-10 h-10 bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Percent className="w-5 h-5" />
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Cycle Selector */}
                          <div className="p-4.5 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Care Billing Option</h4>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mt-0.5">Weekly billing vs discounted monthly care billing</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-300 dark:border-slate-700 w-fit relative z-0">
                              <button
                                type="button"
                                onClick={() => handleCycleChange("weekly")}
                                className={`relative px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 ${
                                  billingCycle === "weekly"
                                    ? "text-white"
                                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                                }`}
                              >
                                {billingCycle === "weekly" && (
                                  <motion.div
                                    layoutId="billingCycleTab"
                                    className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                )}
                                Weekly
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCycleChange("monthly")}
                                className={`relative px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 cursor-pointer z-10 ${
                                  billingCycle === "monthly"
                                    ? "text-white"
                                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                                }`}
                              >
                                {billingCycle === "monthly" && (
                                  <motion.div
                                    layoutId="billingCycleTab"
                                    className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                )}
                                Monthly
                              </button>
                            </div>
                          </div>

                          {/* Duration selector */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Recommended Treatment Duration</h4>
                              <span className="text-xs text-teal-800 dark:text-teal-400 font-black uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Continuity Benefit: {activePricing.discountPercent}% Off
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(() => {
                                const opts = billingCycle === "weekly"
                                  ? (careLevel === "mild"
                                      ? [
                                          { value: 0.5, label: "3 Days", desc: "Express Acute Care (Targeted Acute Protocol)", discount: "0%" },
                                          { value: 1, label: "1 Week", desc: "Baseline acute care", discount: "0%" },
                                          { value: 2, label: "2 Weeks", desc: "Short-term relief option", discount: "0%" },
                                          { value: 4, label: "4 Weeks", desc: "1 Month equivalent stabilization", discount: "10%" },
                                          { value: 8, label: "8 Weeks", desc: "Intermediate chronic therapy", discount: "15%" },
                                          { value: 12, label: "12 Weeks", desc: "Complete systemic course", discount: "20%" }
                                        ]
                                      : [
                                          { value: 1, label: "1 Week", desc: "Baseline acute care", discount: "0%" },
                                          { value: 2, label: "2 Weeks", desc: "Short-term relief option", discount: "0%" },
                                          { value: 4, label: "4 Weeks", desc: "1 Month equivalent stabilization", discount: "10%" },
                                          { value: 8, label: "8 Weeks", desc: "Intermediate chronic therapy", discount: "15%" },
                                          { value: 12, label: "12 Weeks", desc: "Complete systemic course", discount: "20%" }
                                        ]
                                    )
                                  : [
                                      { value: 1, label: "1 Month", desc: "Baseline chronic cycle", discount: "10%" },
                                      { value: 2, label: "2 Months", desc: "Stabilization healing phase", discount: "15%" },
                                      { value: 3, label: "3 Months", desc: "Constitutional systemic recovery", discount: "20%" },
                                      { value: 6, label: "6 Months", desc: "Intensive chronic restoration", discount: "25%" },
                                      { value: 12, label: "12 Months", desc: "Annual premium protection plan", discount: "30%" }
                                    ];

                                return opts.map((opt, idx) => {
                                  const isSelected = durationValue === opt.value;
                                  const optPricing = calculatePricing(careLevel, billingCycle, opt.value, conditionsCount);
                                  const isLast = idx === opts.length - 1;

                                  if (isLast) {
                                    return (
                                      <button
                                        type="button"
                                        key={opt.value}
                                        onClick={() => setDurationValue(opt.value)}
                                        className={`sm:col-span-2 p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-lg active:scale-[0.99] relative overflow-hidden ${
                                          isSelected
                                            ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 ring-2 ring-teal-500/25 shadow-md"
                                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-white hover:border-slate-400"
                                        }`}
                                      >
                                        <div className="flex items-start gap-3.5 relative z-10">
                                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all flex-shrink-0 ${
                                            isSelected ? "border-teal-600 bg-teal-600" : "border-slate-400 bg-white"
                                          }`}>
                                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                          </div>
                                          <div className="text-left">
                                            <div className="flex flex-wrap items-center gap-2">
                                              <span className="text-sm font-black text-slate-950 dark:text-white leading-tight block">{opt.label}</span>
                                              {opt.discount !== "0%" && (
                                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                                  {opt.discount} Benefit
                                                </span>
                                              )}
                                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                                ⭐ Best Value
                                              </span>
                                            </div>
                                            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-1.5 leading-relaxed">{opt.desc}</span>
                                          </div>
                                        </div>
                                        <div className="text-left sm:text-right relative z-10 flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 border-slate-200 dark:border-slate-800 pt-2.5 sm:pt-0">
                                          <div>
                                            <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider block sm:inline mr-1.5 sm:mr-0">Investment </span>
                                            <span className="text-lg font-black text-slate-950 dark:text-white font-sans">
                                              ₹{optPricing.finalPrice.toLocaleString("en-IN")}
                                            </span>
                                          </div>
                                          <span className="text-xs text-teal-800 dark:text-teal-300 font-black uppercase tracking-wider mt-0.5 block">
                                            ₹{Math.round(optPricing.finalPrice / opt.value).toLocaleString("en-IN")}/{billingCycle === "weekly" ? "wk" : "mo"} avg
                                          </span>
                                        </div>
                                      </button>
                                    );
                                  }

                                  return (
                                    <button
                                      type="button"
                                      key={opt.value}
                                      onClick={() => setDurationValue(opt.value)}
                                      className={`p-4.5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between gap-3.5 cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.98] relative overflow-hidden ${
                                        isSelected
                                          ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 ring-2 ring-teal-500/20 shadow-md"
                                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-white hover:border-slate-400"
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="text-left">
                                          <span className="text-sm font-black text-slate-950 dark:text-white leading-tight block">{opt.label}</span>
                                          <span className="text-xs text-slate-700 dark:text-slate-300 font-medium block mt-1 leading-normal">{opt.desc}</span>
                                        </div>
                                        <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                                          isSelected ? "border-teal-600 bg-teal-600" : "border-slate-400 bg-white"
                                        }`}>
                                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </div>
                                      </div>
                                      <div className="flex flex-col gap-1 text-left border-t border-slate-200 dark:border-slate-800 pt-2.5 mt-auto">
                                        <div className="flex items-baseline justify-between gap-2">
                                          <span className="text-base font-black text-slate-950 dark:text-white font-sans">
                                            ₹{optPricing.finalPrice.toLocaleString("en-IN")}
                                          </span>
                                          {opt.discount !== "0%" && (
                                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                              {opt.discount} Benefit
                                            </span>
                                          )}
                                        </div>
                                        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                                          ₹{Math.round(optPricing.finalPrice / opt.value).toLocaleString("en-IN")}/{billingCycle === "weekly" ? "wk" : "mo"}
                                        </span>
                                      </div>
                                    </button>
                                  );
                            });
                          })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* Dashboard Right Summary Card (4 cols) */}
                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                  <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
                    {/* Glowing highlight */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-40"
                    />
                    <div className="relative space-y-6">
                      <div className="space-y-3">
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700 uppercase tracking-wider inline-block">
                          Active Configuration
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">{activeDetails.title}</h3>
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wide block">
                          {activeDetails.badge}
                        </span>
                      </div>

                      {/* Recommendation Summary */}
                      <div className="p-4.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-3.5 text-left">
                        <div className="flex items-center gap-1.5 text-slate-950 dark:text-white font-black text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <span>Clinical Care Summary</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs font-medium text-slate-800 dark:text-slate-200">
                          <div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Recommended Program</span>
                            <span className="text-slate-950 dark:text-white font-black text-sm block leading-tight">{recommendation.recommendedProgram}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Care Complexity</span>
                            <span className="text-slate-950 dark:text-white font-black text-sm block leading-tight">{activeDetails.complexityLabel}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Suggested Follow-up</span>
                            <span className="text-slate-950 dark:text-white font-black text-sm block leading-tight">{recommendation.followUpFrequency}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Recommended Care Period</span>
                            <span className="text-slate-950 dark:text-white font-black text-sm block leading-tight">
                              {durationValue === 0.5 ? "3 Days" : `${durationValue} ${billingCycle === "weekly" ? (durationValue === 1 ? "Week" : "Weeks") : (durationValue === 1 ? "Month" : "Months")}`}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[11px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wide block mb-0.5">Active Health Concerns</span>
                            <span className="text-slate-950 dark:text-white font-black text-sm block leading-tight">
                              {conditionsCount} {conditionsCount === 1 ? "Concern" : "Concerns"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="p-4.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-3 text-left">
                        <div className="text-xs text-slate-950 dark:text-white font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2">
                          Treatment Investment Summary
                        </div>
                        <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200 font-bold tracking-wide">
                          <span>Clinical Care Fee</span>
                          <span className="font-black text-slate-950 dark:text-white">₹{activePricing.basePrice.toLocaleString("en-IN")} / {durationValue === 0.5 ? "3 days" : (billingCycle === "weekly" ? "wk" : "mo")}</span>
                        </div>

                        {conditionsCount > 1 && (
                          <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200 font-bold tracking-wide">
                            <span>Clinical Complexity Adjustment ({conditionsCount} Concerns)</span>
                            <span className="font-black text-slate-950 dark:text-white">+₹{activePricing.surcharge.toLocaleString("en-IN")} / {durationValue === 0.5 ? "3 days" : (billingCycle === "weekly" ? "wk" : "mo")}</span>
                          </div>
                        )}

                        {conditionsCount > 1 && (
                          <div className="flex justify-between text-xs text-slate-950 dark:text-white font-black tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span>Personalized Care Investment</span>
                            <span>₹{activePricing.adjustedBasePrice.toLocaleString("en-IN")} / {durationValue === 0.5 ? "3 days" : (billingCycle === "weekly" ? "wk" : "mo")}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-xs text-slate-800 dark:text-slate-200 font-bold tracking-wide">
                          <span>Recommended Care Period ({durationValue === 0.5 ? "3 Days" : `${durationValue} ${billingCycle === "weekly" ? (durationValue === 1 ? "week" : "weeks") : (durationValue === 1 ? "month" : "months")}`})</span>
                          <span className="font-black text-slate-950 dark:text-white">₹{activePricing.rawTotal.toLocaleString("en-IN")}</span>
                        </div>

                        {activePricing.discountPercent > 0 && (
                          <div className="flex justify-between text-xs text-emerald-900 dark:text-emerald-200 font-black tracking-wide bg-emerald-100/90 dark:bg-emerald-950/70 p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                            <span>Continuity of Care Benefit ({activePricing.discountPercent}%)</span>
                            <span>-₹{activePricing.discountAmount.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-bold tracking-wide">
                            <span>Care Period</span>
                            <span className="text-slate-950 dark:text-white font-black">{durationValue === 0.5 ? 3 : (billingCycle === "weekly" ? durationValue * 7 : durationValue * 30)} Days</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-bold tracking-wide border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span>Equivalent Daily Care Investment</span>
                            <span className="text-emerald-800 dark:text-emerald-400 font-black">₹{Math.round(activePricing.finalPrice / (durationValue === 0.5 ? 3 : (billingCycle === "weekly" ? durationValue * 7 : durationValue * 30)))}/day</span>
                          </div>
                        </div>

                        <div className="pt-1 flex justify-between items-baseline">
                          <span className="text-sm font-black text-slate-950 dark:text-white tracking-wide">Your Treatment Investment</span>
                          <div className="text-right">
                            <motion.span
                              key={activePricing.finalPrice}
                              initial={{ scale: 0.95, opacity: 0.8 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 350, damping: 15 }}
                              className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white font-sans block"
                            >
                              ₹{activePricing.finalPrice.toLocaleString("en-IN")}
                            </motion.span>
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold block uppercase tracking-wide mt-1">Excludes shipping (India ₹300 | Intl at dispatch)</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Adjuster Grid Component */}
                      <div className="p-4.5 bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200/80 dark:border-slate-700 rounded-2xl space-y-4 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Billing Frequency Card */}
                          <div className="flex flex-col justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Care Billing Option</h4>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mt-0.5">Weekly vs Monthly Option</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-300 dark:border-slate-700 w-fit relative z-0">
                              <button
                                type="button"
                                onClick={() => handleCycleChange("weekly")}
                                className={`relative px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 ${
                                  billingCycle === "weekly"
                                    ? "text-white"
                                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                                }`}
                              >
                                {billingCycle === "weekly" && (
                                  <motion.div
                                    layoutId="presetBillingCycleTab"
                                    className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                )}
                                Weekly
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCycleChange("monthly")}
                                className={`relative px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer z-10 ${
                                  billingCycle === "monthly"
                                    ? "text-white"
                                    : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                                }`}
                              >
                                {billingCycle === "monthly" && (
                                  <motion.div
                                    layoutId="presetBillingCycleTab"
                                    className="absolute inset-0 bg-[#1A2421] rounded-full -z-10 shadow-sm"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                  />
                                )}
                                Monthly
                              </button>
                              
                              <span className="absolute -top-3.5 -right-3 px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider">
                                SAVE 10–30%
                              </span>
                            </div>
                          </div>

                          {/* Conditions Covered Card */}
                          <div className="flex flex-col justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Active Health Concerns</h4>
                              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mt-0.5">Active Concerns</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((count) => {
                                const label = count === 5 ? "5+" : `${count}`;
                                const active = conditionsCount === count;
                                return (
                                  <button
                                    type="button"
                                    key={count}
                                    onClick={() => setConditionsCount(count)}
                                    className={`w-7 h-7 rounded-lg border-2 text-xs font-black transition-all duration-200 cursor-pointer flex items-center justify-center hover:-translate-y-0.5 active:scale-95 ${
                                      active
                                        ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                                        : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 hover:border-slate-500"
                                    }`}
                                  >
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Recommended Treatment Duration Row */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                          <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">Recommended Treatment Duration</h4>
                          <div className={`grid ${billingCycle === "weekly" && careLevel === "mild" ? "grid-cols-6" : "grid-cols-5"} gap-1.5`}>
                            {(() => {
                              const opts = billingCycle === "weekly"
                                ? (careLevel === "mild"
                                    ? [
                                        { value: 0.5, label: "3 Days", discount: "₹1k" },
                                        { value: 1, label: "1 Wk", discount: "0%" },
                                        { value: 2, label: "2 Wks", discount: "0%" },
                                        { value: 4, label: "4 Wks", discount: "10%" },
                                        { value: 8, label: "8 Wks", discount: "15%" },
                                        { value: 12, label: "12 Wks", discount: "20%" }
                                      ]
                                    : [
                                        { value: 1, label: "1 Wk", discount: "0%" },
                                        { value: 2, label: "2 Wks", discount: "0%" },
                                        { value: 4, label: "4 Wks", discount: "10%" },
                                        { value: 8, label: "8 Wks", discount: "15%" },
                                        { value: 12, label: "12 Wks", discount: "20%" }
                                      ]
                                  )
                                : [
                                    { value: 1, label: "1 Mo", discount: "10%" },
                                    { value: 2, label: "2 Mos", discount: "15%" },
                                    { value: 3, label: "3 Mos", discount: "20%" },
                                    { value: 6, label: "6 Mos", discount: "25%" },
                                    { value: 12, label: "12 Mos", discount: "30%" }
                                  ];

                              return opts.map((opt) => {
                                const isSelected = durationValue === opt.value;
                                return (
                                  <button
                                    type="button"
                                    key={opt.value}
                                    onClick={() => setDurationValue(opt.value)}
                                    className={`py-2 px-1 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                                      isSelected
                                        ? "border-teal-600 text-teal-900 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/60 ring-1 ring-teal-500/20 font-black"
                                        : "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:border-slate-400"
                                    }`}
                                  >
                                    <span className="block text-[11px] font-black leading-tight">{opt.label}</span>
                                    <span className={`block text-[8.5px] font-black uppercase mt-0.5 ${
                                      isSelected ? "text-teal-700 dark:text-teal-400" : "text-slate-500 dark:text-slate-400"
                                    }`}>
                                      {opt.discount}
                                    </span>
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* GPay Payment Visual Card */}
                      <div className="p-4.5 bg-white dark:bg-slate-800/80 border-2 border-teal-200 dark:border-teal-800 rounded-2xl flex gap-3.5 relative overflow-hidden shadow-sm group/gpay">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 rounded-xl flex items-center justify-center flex-shrink-0 font-sans font-black text-xs">
                          GPay
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-teal-900 dark:text-teal-200 tracking-wider">Direct Registration Payment</h4>
                          <p className="text-xs font-bold text-slate-950 dark:text-white mt-0.5">GPay / PhonePe / Paytm / UPI:</p>
                          <p className="text-base font-black text-teal-800 dark:text-teal-300 tracking-wider">{process.env.NEXT_PUBLIC_PAYMENT_PHONE || "8446056789"}</p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-normal mt-1">
                            Send correct total cost via UPI to register instantly. Share transfer screenshot over WhatsApp.
                          </p>
                        </div>
                      </div>


                      {/* Action buttons */}
                      <div className="space-y-3 pt-2">
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold text-center leading-relaxed max-w-xs mx-auto mb-2">
                          Every treatment program begins with a physician consultation to confirm your personalized care plan.
                        </p>
                        <Magnetic>
                          <button
                            onClick={handleSelectCalculatedPlan}
                            className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white rounded-full font-black uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            Order & Proceed to Payment
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </Magnetic>

                        <Magnetic>
                          <a
                            href="/admin/login"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3.5 border-2 border-slate-900 dark:border-slate-300 text-slate-950 dark:text-white rounded-full font-black uppercase tracking-wider text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
                          >
                            <UserCheck className="w-4 h-4" />
                            Doctor Portal: Login to Plan
                          </a>
                        </Magnetic>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={handleSaveConfig}
                            className={`py-3 px-2 rounded-full border-2 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                              saveSuccess 
                                ? "bg-emerald-600 border-transparent text-white" 
                                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-800 text-slate-900 dark:text-white"
                            }`}
                          >
                            {saveSuccess ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Saved!
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save Config
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyLink()}
                            className={`py-3 px-2 rounded-full border-2 text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                              shareSuccess 
                                ? "bg-slate-950 border-transparent text-white" 
                                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-800 text-slate-900 dark:text-white"
                            }`}
                          >
                            {shareSuccess ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Share2 className="w-4 h-4" />
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

          {viewMode === "triage" && (
            <motion.div
              key="triage-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 w-full relative mb-16"
            >
              {/* Floating ambient glow orbs for high-end aesthetics */}
              <div className="absolute inset-0 -z-20 overflow-hidden rounded-[36px] pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-mint/15 to-teal-400/5 blur-[80px] animate-pulse" style={{ animationDuration: "8s" }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/0 blur-[80px] animate-pulse" style={{ animationDuration: "10s" }} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Question Steps */}
                <div className="lg:col-span-7 glass-panel border-white/70 bg-white/30 backdrop-blur-md rounded-[32px] p-6 md:p-8 space-y-6 shadow-xl shadow-slate-900/[0.02]">
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
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1 of 3 · Complexity</span>
                      <h3 className="text-xl font-bold text-slate-900">How complex is your primary complaint?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Select the option that best matches your main health concern. This determines the base care tier.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          key: "mild",
                          icon: "🌱",
                          label: "Acute or Mild Complaints",
                          desc: "Short-term/mild issues that flare and resolve.",
                          examples: "Seasonal cold, mild acne, general hair fall, minor indigestion, skin allergy flare.",
                          tier: "→ Acute & Wellness Care",
                          tierColor: "text-slate-650"
                        },
                        {
                          key: "moderate",
                          icon: "⚡",
                          label: "Single Chronic Condition",
                          desc: "A persistent long-standing issue confined to one organ/system.",
                          examples: "Chronic sinusitis, localized eczema, mild hypothyroidism, IBS, single joint arthritis.",
                          tier: "→ Standard Chronic Care",
                          tierColor: "text-slate-700"
                        },
                        {
                          key: "focused",
                          icon: "🎯",
                          label: "Deep Organ System Pathology",
                          desc: "Complex systemic condition requiring targeted constitutional management.",
                          examples: "Bronchial asthma, severe psoriasis, PCOS, vascular migraines, hormonal acne.",
                          tier: "→ Deep Systemic Care",
                          tierColor: "text-mint-dark"
                        },
                        {
                          key: "organ",
                          icon: "🫁",
                          label: "Severe / Multi-Organ Pathology",
                          desc: "Advanced chronic disease affecting multiple systems or with serious biomarkers.",
                          examples: "Early CKD, fatty liver, RA, ankylosing spondylitis, autoimmune conditions.",
                          tier: "→ Advanced Pathological Care",
                          tierColor: "text-indigo-650"
                        },
                        {
                          key: "acute_critical",
                          icon: "🚨",
                          label: "Urgent / Critical Acute Condition",
                          desc: "Acute urgent illness requiring daily monitoring and priority intervention.",
                          examples: "Acute asthma attack, high uncontrolled fever, post-surgical recovery, acute renal flare.",
                          tier: "→ Acute Critical Care",
                          tierColor: "text-red-650"
                        }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, symptomsComplexity: item.key })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.symptomsComplexity === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20 shadow-xs"
                              : "border-slate-200/60 hover:border-slate-800 bg-white/40 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold ${item.tierColor} whitespace-nowrap`}>{item.tier}</span>
                              </div>
                              <p className="text-[10px] text-slate-650 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.symptomsComplexity === item.key && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setTriageStep(2)}
                        disabled={!triageAnswers.symptomsComplexity}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 2 of 3 · Conditions Count</span>
                      <h3 className="text-xl font-bold text-slate-900">How many conditions are you treating?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Count each distinct active chronic complaint you want addressed simultaneously. Additional care coordination fee applies per extra concern beyond 1 (scaled by tier complexity).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        {
                          val: 1,
                          label: "1 Condition",
                          icon: "①",
                          desc: "Single focused complaint.",
                          examples: "Only eczema. Only thyroid. Only sinusitis. Only PCOS.",
                          surcharge: "Included in base plan",
                          color: "text-slate-655"
                        },
                        {
                          val: 2,
                          label: "2 Conditions",
                          icon: "②",
                          desc: "Two co-existing conditions being treated simultaneously.",
                          examples: "Thyroid + Skin. PCOS + Acne. Diabetes + Joint Pain. Sinusitis + Asthma.",
                          surcharge: "+ Additional Care Fee (Dual Care)",
                          color: "text-blue-605"
                        },
                        {
                          val: 3,
                          label: "3 Conditions",
                          icon: "③",
                          desc: "Three concurrent complaints requiring coordinated management.",
                          examples: "DM + HTN + Skin. Thyroid + PCOS + Hair. Asthma + Eczema + IBS.",
                          surcharge: "+ Additional Care Fee (Triple Care)",
                          color: "text-amber-605"
                        },
                        {
                          val: 4,
                          label: "4 Conditions",
                          icon: "④",
                          desc: "Four overlapping health concerns managed together.",
                          examples: "DM + CKD + HTN + Skin. PCOS + Thyroid + Gut + Migraines.",
                          surcharge: "+ Additional Care Fee (Quad Care)",
                          color: "text-orange-605"
                        },
                        {
                          val: 5,
                          label: "5+ Conditions",
                          icon: "⑤",
                          desc: "Complex poly-morbid case with 5 or more active complaints.",
                          examples: "DM + CKD + RA + HTN + Skin/Gut. Advanced multisystem chronic presentations.",
                          surcharge: "+ Additional Care Fee (Multi-Care)",
                          color: "text-rose-605"
                        }
                      ].map((item) => (
                        <div
                          key={item.val}
                          onClick={() => setTriageAnswers({ ...triageAnswers, conditionsNumber: item.val })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.conditionsNumber === item.val
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20 shadow-xs"
                              : "border-slate-200/60 hover:border-slate-800 bg-white/40 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black shrink-0 ${item.color}`}>{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 ${item.color}`}>{item.surcharge}</span>
                              </div>
                              <p className="text-[10px] text-slate-655 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.conditionsNumber === item.val && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0 shadow-sm">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setTriageStep(1)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50 hover:bg-white"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep(3)}
                        disabled={!triageAnswers.conditionsNumber}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 3 of 3 · Supervision</span>
                      <h3 className="text-xl font-bold text-slate-900">What level of medical oversight do you need?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        This determines how actively Dr. Jethwani monitors, adjusts remedies, and reviews your lab reports during treatment.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          key: "standard",
                          icon: "📋",
                          label: "Standard Clinical Management",
                          desc: "Progress tracking every 2–4 weeks. No urgent lab reviews needed.",
                          examples: "Most chronic wellness conditions. Stable eczema, IBS, hair fall, mild thyroid.",
                          badge: "Most common",
                          badgeColor: "bg-slate-100 text-slate-650"
                        },
                        {
                          key: "high",
                          icon: "🔬",
                          label: "High Supervision & Medical Reviews",
                          desc: "Requires regular blood/lab report reviews, multi-remedy coordination, or direct Dr. Jethwani oversight.",
                          examples: "CKD, autoimmune RA, fatty liver with enzymes, post-surgical support, advanced hormonal cases.",
                          badge: "Lab monitoring",
                          badgeColor: "bg-blue-50 text-blue-700"
                        },
                        {
                          key: "urgent",
                          icon: "🚨",
                          label: "Urgent / Daily Clinical Coordination",
                          desc: "Daily clinical reviews, immediate dosage adjustments, and priority WhatsApp access to Dr. Jethwani.",
                          examples: "Acute critical illness, high fever, acute asthma attacks, acute renal episodes, emergency flares.",
                          badge: "Priority access",
                          badgeColor: "bg-red-50 text-red-700"
                        }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, supervisionNeed: item.key })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.supervisionNeed === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20 shadow-xs"
                              : "border-slate-200/60 hover:border-slate-800 bg-white/40 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
                              </div>
                              <p className="text-[10px] text-slate-650 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.supervisionNeed === item.key && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setTriageStep(2)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50 hover:bg-white"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep("result")}
                        disabled={!triageAnswers.supervisionNeed}
                        className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
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

                      {/* Result Card */}
                      <div className="border border-mint/20 bg-gradient-to-br from-mint/[0.04] to-transparent rounded-2xl overflow-hidden shadow-sm">
                        {/* Header */}
                        <div className="p-5 flex justify-between items-start border-b border-mint/10">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase bg-mint/10 text-mint-dark border border-mint/20 px-2 py-0.5 rounded-full inline-block mb-1.5">
                              {recDetails.badge}
                            </span>
                            <h4 className="text-xl font-black text-[#1A2421]">{recDetails.title}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                              For {rec.conditionsCount === 1 ? "1 Condition" : rec.conditionsCount === 2 ? "2 Conditions" : rec.conditionsCount === 3 ? "3 Conditions" : rec.conditionsCount === 4 ? "4 Conditions" : "5+ Conditions"}
                            </span>
                          </div>
                          <span className="text-4xl">{recDetails.icon}</span>
                        </div>

                        {/* Pricing preview */}
                        <div className="grid grid-cols-2 border-b border-mint/10">
                          <div className="p-4 border-r border-mint/10">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Rate</span>
                            <span className="text-xl font-black text-[#1A2421]">₹{recDetails.monthlyPrice.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block">/month</span>
                          </div>
                          <div className="p-4">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Weekly Rate</span>
                            <span className="text-xl font-black text-[#1A2421]">₹{recDetails.weeklyPrice.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block">/week</span>
                          </div>
                        </div>

                        {/* Rationale */}
                        <div className="p-4 space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Rationale</span>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                            {rec.explanation}
                          </p>
                        </div>

                        {/* What's included chips */}
                        <div className="px-4 pb-4">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Included In This Plan</span>
                          <div className="flex flex-wrap gap-1.5">
                            {recDetails.features.slice(0, 5).map((f: string, i: number) => (
                              <span key={i} className="text-[9px] font-semibold bg-white border border-slate-200 text-slate-650 px-2 py-0.5 rounded-full">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between gap-3 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setTriageStep(3)}
                          className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50 hover:bg-white"
                        >
                          Adjust Answers
                        </button>
                        <button
                          onClick={() => handleApplyTriage(rec.careLevel, rec.conditionsCount)}
                          className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          Apply Configuration to Planner
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
                </div>

                {/* Right: Sticky Care Level Reference Panel */}
                <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
                  <div className="glass-panel border-white/70 bg-white/40 backdrop-blur-md rounded-[32px] p-6 shadow-xl shadow-slate-900/[0.02]">
                    <div className="mb-4">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-mint block mb-1">Care Level Reference</span>
                      <h4 className="text-base font-bold text-[#1A2421]">All Plan Tiers &amp; Rates</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Your answers will auto-select the right tier below.</p>
                    </div>
                    <div className="space-y-2.5">
                      {(Object.keys(careLevelsDetails) as (keyof typeof careLevelsDetails)[]).map((level) => {
                        const d = careLevelsDetails[level];
                        return (
                          <div key={level} className="p-3.5 rounded-2xl border border-slate-100 bg-white/60 flex items-center justify-between gap-3 hover:border-mint/40 hover:bg-mint/[0.02] transition-all duration-200">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xl shrink-0">{d.icon}</span>
                              <div className="min-w-0">
                                <span className="text-[10px] font-black text-[#1A2421] block leading-tight truncate">{d.title}</span>
                                <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 truncate">{d.badge}</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-[#1A2421] block">₹{d.monthlyPrice.toLocaleString("en-IN")}<span className="text-[9px] font-semibold text-slate-400">/mo</span></span>
                              <span className="text-[9px] font-semibold text-slate-400 block">₹{d.weeklyPrice.toLocaleString("en-IN")}/wk</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                        💡 Commitment discounts apply: <span className="text-emerald-600 font-bold">10% off 1 month → 30% off 12 months.</span> Per extra condition: +₹375–₹1,688/wk depending on tier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Select by Diagnosis / Organ System */}
              <div className="border-t border-slate-900/5 pt-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A2421] mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-mint animate-pulse" />
                    Quick Select by Diagnosis
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Select your clinical concern or organ system below to automatically pre-configure the Treatment Planner with the recommended care level and conditions setup.
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
                                   {cond.conditionsCount === 1 
                                     ? "1 Condition" 
                                     : cond.conditionsCount === 2 
                                       ? "2 Conditions" 
                                       : cond.conditionsCount === 3
                                         ? "3 Conditions"
                                         : cond.conditionsCount === 4
                                           ? "4 Conditions"
                                           : "5+ Conditions"}
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
                                setViewMode("dashboard");
                                setTimeout(() => {
                                  const plannerElement = document.getElementById("planner-dashboard");
                                  if (plannerElement) {
                                    plannerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }
                                }, 100);
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
                      onClick={() => { setCatalogBillingCycle("weekly"); setCatalogDuration(1); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        catalogBillingCycle === "weekly"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-[#1A2421]"
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => { setCatalogBillingCycle("monthly"); setCatalogDuration(1); }}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                        catalogBillingCycle === "monthly"
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-[#1A2421]"
                      }`}
                    >
                      Monthly
                      <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black tracking-normal">
                        SAVE 10–30%
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

                  // For consultation plans, compute live pricing from careLevelsDetails
                  const careLevelKey = pkg.id === "wellness-care" ? "mild"
                    : pkg.id === "standard-chronic-care" ? "moderate"
                    : pkg.id === "focused-care" ? "focused"
                    : pkg.id === "critical-care" ? "acute_critical"
                    : pkg.id === "recommended-system-care" ? "organ"
                    : pkg.id === "comprehensive-care" ? "comprehensive"
                    : null;

                  const catalogDurationOpts = catalogBillingCycle === "weekly"
                    ? [
                        { value: 1, label: "1 Wk", discount: "0%" },
                        { value: 2, label: "2 Wks", discount: "0%" },
                        { value: 4, label: "1 Mo", discount: "10%" },
                        { value: 8, label: "2 Mos", discount: "15%" },
                        { value: 12, label: "3 Mos", discount: "20%" },
                      ]
                    : [
                        { value: 1, label: "1 Mo", discount: "10%" },
                        { value: 2, label: "2 Mos", discount: "15%" },
                        { value: 3, label: "3 Mos", discount: "20%" },
                        { value: 6, label: "6 Mos", discount: "25%" },
                        { value: 12, label: "12 Mos", discount: "30%" },
                      ];

                  const activeCatalogPricing = careLevelKey
                    ? calculatePricing(careLevelKey as keyof typeof careLevelsDetails, catalogBillingCycle, catalogDuration, 1)
                    : null;

                  return (
                    <div
                      key={pkg.id}
                      className={`glass-panel ${borderClass} ${bgClass} rounded-3xl p-7 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.02)] ${
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
                        <div className="flex justify-between items-start gap-4 mb-5">
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

                        <div className="mb-5 pb-5 border-b border-slate-900/5">
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
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-500 font-semibold">
                                  {catalogBillingCycle === "weekly" 
                                    ? `Monthly: ${pkg.priceMonthly}` 
                                    : `Weekly: ${pkg.priceWeekly}`}
                                </span>
                                {activeCatalogPricing && activeCatalogPricing.discountPercent > 0 && (
                                  <span className="text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                    {activeCatalogPricing.discountPercent}% off applied
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-2xl font-black text-[#1A2421] font-sans">{pkg.price}</span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-5">
                          {pkg.desc}
                        </p>

                        {/* Features checklist */}
                        <ul className="space-y-2.5 mb-6">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold leading-relaxed">
                              <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${textClass}`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Monthly Duration Grid (consultation packages only) */}
                        {pkg.category === "consultation" && careLevelKey && (
                          <div className="mb-5 p-4 rounded-2xl bg-white/50 border border-slate-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">Commitment Duration</span>
                              {activeCatalogPricing && (
                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">
                                  Total: ₹{activeCatalogPricing.finalPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-5 gap-1.5">
                              {catalogDurationOpts.map((opt) => {
                                const isSelDur = catalogDuration === opt.value;
                                const optPrice = calculatePricing(careLevelKey as keyof typeof careLevelsDetails, catalogBillingCycle, opt.value, 1);
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setCatalogDuration(opt.value)}
                                    title={`Total: ₹${optPrice.finalPrice.toLocaleString("en-IN")} (${opt.discount} off)`}
                                    className={`py-1.5 px-0.5 rounded-xl border text-center transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-sm active:scale-95 ${
                                      isSelDur
                                        ? "border-mint bg-mint/5 ring-1 ring-mint/20"
                                        : "border-slate-200 bg-white/70 hover:border-slate-800"
                                    }`}
                                  >
                                    <span className={`block text-[9.5px] font-black leading-tight ${isSelDur ? "text-[#0f766e]" : "text-slate-800"}`}>{opt.label}</span>
                                    <span className={`block text-[7px] font-black uppercase mt-0.5 ${isSelDur ? "text-mint" : "text-slate-400"}`}>
                                      {opt.discount}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
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
              id="doctor-plan-core"
              key="doctor-plan-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 w-full relative mb-16"
            >
              {/* Floating ambient glow orbs */}
              <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none rounded-[36px]">
                <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-400/5 blur-[80px]" />
                <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/0 blur-[80px]" />
              </div>

              {/* Top Doctor Presentation Header & Actions */}
              <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Physician Presentation Mode
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 hidden sm:inline">
                      Laptop Screen Friendly · Interactive Explainer
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    Doctor Treatment Plan & Care Scope
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-4xl">
                    Selection-friendly clinical planning tool for consulting physicians to explain treatment pathways, multi-system coordination, and continuity benefits directly to patients.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end flex-wrap">
                  <button
                    type="button"
                    onClick={handleResetDoctorPlan}
                    className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-900 dark:text-white text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Reset to default selections"
                  >
                    <span>↺ Reset</span>
                  </button>
                  <a
                    href="/admin/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#1A2421] hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Admin EMR Login</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                  </a>
                </div>
              </div>

              {/* 2-Column Responsive Layout for Laptop Screens */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column (7 cols lg, 8 cols xl): Selection-Friendly Doctor Controls */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4 text-left">
                  
                  {/* 1. Care Complexity Level */}
                  <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <span>1. Clinical Care Complexity Level</span>
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          Select the clinical depth and medical supervision tier matching the patient&apos;s pathology:
                        </p>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
                        7 Tiers Available
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {Object.entries(careLevelsDetails).map(([key, details]) => {
                        const isSelected = walkInTier === key;
                        const weeklyRate = details.weeklyPrice;
                        const monthlyRate = details.monthlyPrice;
                        const displayedRate = walkInBillingCycle === "weekly" ? `₹${weeklyRate.toLocaleString("en-IN")}/wk` : `₹${monthlyRate.toLocaleString("en-IN")}/mo`;
                        const secondaryRate = walkInBillingCycle === "weekly" ? `₹${monthlyRate.toLocaleString("en-IN")}/mo (4 wks)` : `₹${weeklyRate.toLocaleString("en-IN")}/wk`;

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setWalkInTier(key);
                              if (key !== "mild" && walkInDurationValue === 0.5) {
                                setWalkInDurationValue(1);
                              }
                            }}
                            className={`p-3.5 text-left border-2 rounded-xl transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5 relative overflow-hidden group ${
                              isSelected
                                ? "border-teal-600 bg-teal-50/80 dark:bg-teal-950/40 text-teal-950 dark:text-white font-black ring-2 ring-teal-500/30 shadow-sm"
                                : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900/60 hover:bg-slate-50 text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-xl p-1 bg-white dark:bg-slate-800 rounded-lg shadow-2xs border border-slate-200 dark:border-slate-700">{details.icon}</span>
                                <div>
                                  <span className="text-xs font-black leading-tight block text-slate-950 dark:text-white">
                                    {details.title}
                                  </span>
                                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-extrabold uppercase tracking-wider block mt-0.5">
                                    {details.complexityLabel || "Standard"} Care
                                  </span>
                                  {key === "mild" && (
                                    <span className="text-[8.5px] font-black text-teal-900 bg-teal-100 border border-teal-300 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                      Express 3-Day available (₹1,000)
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                                  ✓
                                </span>
                              )}
                            </div>

                            <div className="flex items-baseline justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                              <span className="text-xs font-black text-teal-800 dark:text-teal-300 font-sans">
                                {displayedRate}
                              </span>
                              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">
                                {secondaryRate}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Tier Clinical Summary */}
                    {careLevelsDetails[walkInTier as keyof typeof careLevelsDetails] && (
                      <div className="p-3.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-left flex items-start gap-2.5">
                        <span className="text-teal-700 dark:text-teal-400 text-base leading-none mt-0.5">ℹ</span>
                        <div className="text-xs text-slate-850 dark:text-slate-200 space-y-0.5 leading-relaxed font-medium">
                          <p>
                            <strong className="font-black text-slate-950 dark:text-white">Included Protocol:</strong> {careLevelsDetails[walkInTier as keyof typeof careLevelsDetails].description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Billing Frequency & Care Commitment Duration */}
                  <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      
                      {/* Frequency Toggle */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <span>2. Billing Frequency</span>
                          </h4>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase">
                            Weekly or Monthly
                          </span>
                        </div>
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-full border border-slate-300 dark:border-slate-700 w-fit">
                          <button
                            type="button"
                            onClick={() => {
                              setWalkInBillingCycle("weekly");
                              setWalkInDurationValue(4);
                            }}
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              walkInBillingCycle === "weekly"
                                ? "bg-[#1A2421] text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
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
                            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                              walkInBillingCycle === "monthly"
                                ? "bg-[#1A2421] text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                            }`}
                          >
                            Monthly — Save 10–30%
                          </button>
                        </div>
                      </div>

                      {/* Care Duration Recommendation */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
                            Commitment Duration
                          </h4>
                          <span className="text-xs text-teal-800 dark:text-teal-300 font-black uppercase tracking-wider">
                            Save up to 30% with continuity
                          </span>
                        </div>
                        <div className={`grid ${walkInBillingCycle === "weekly" && walkInTier === "mild" ? "grid-cols-6" : "grid-cols-5"} gap-1.5`}>
                          {(walkInBillingCycle === "weekly"
                            ? (walkInTier === "mild"
                                ? [
                                    { value: 0.5, label: "3 Days", desc: "₹1,000" },
                                    { value: 1, label: "1 Wk", desc: "0%" },
                                    { value: 2, label: "2 Wks", desc: "0%" },
                                    { value: 4, label: "4 Wks", desc: "10%" },
                                    { value: 8, label: "8 Wks", desc: "15%" },
                                    { value: 12, label: "12 Wks", desc: "20%" },
                                  ]
                                : [
                                    { value: 1, label: "1 Wk", desc: "0%" },
                                    { value: 2, label: "2 Wks", desc: "0%" },
                                    { value: 4, label: "4 Wks", desc: "10%" },
                                    { value: 8, label: "8 Wks", desc: "15%" },
                                    { value: 12, label: "12 Wks", desc: "20%" },
                                  ]
                              )
                            : [
                                { value: 1, label: "1 Mo", desc: "10%" },
                                { value: 2, label: "2 Mos", desc: "15%" },
                                { value: 3, label: "3 Mos", desc: "20%" },
                                { value: 6, label: "6 Mos", desc: "25%" },
                                { value: 12, label: "12 Mos", desc: "30%" }
                              ]
                          ).map((opt) => (
                            <button
                              type="button"
                              key={opt.value}
                              onClick={() => setWalkInDurationValue(opt.value)}
                              className={`py-2 px-1 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                                walkInDurationValue === opt.value
                                  ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-950 dark:text-teal-100 font-black ring-1 ring-teal-500/30"
                                  : "border-slate-200 dark:border-slate-700 hover:border-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800"
                              }`}
                            >
                              <span className="text-xs block font-black leading-none">{opt.label}</span>
                              <span className={`text-[9px] block mt-1 leading-none font-bold font-sans ${
                                walkInDurationValue === opt.value ? "text-teal-800 dark:text-teal-300" : "text-slate-500 dark:text-slate-400"
                              }`}>{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. Health Concerns to Address & Multi-System Scope */}
                  <div className="bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 p-5 md:p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <span>3. Health Concerns & Multi-System Scope</span>
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700">
                            {walkInConditionsCount === 1 ? "1 Primary Concern" : `${walkInConditionsCount} Concerns (Multi-System)`}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                          Select the active health complaints to cover simultaneously under this care program:
                        </p>
                      </div>
                      {walkInSelectedConcerns.length > 0 && (
                        <button
                          type="button"
                          onClick={clearWalkInConcerns}
                          className="text-xs font-black text-rose-700 hover:text-rose-900 transition-colors uppercase tracking-wider cursor-pointer"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Selected Concerns Active Strip */}
                    {walkInSelectedConcerns.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2.5 bg-teal-50/80 dark:bg-teal-950/60 rounded-xl border border-teal-200 dark:border-teal-800">
                        {walkInSelectedConcerns.map((concern) => (
                          <span
                            key={concern}
                            className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-lg bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-teal-950 dark:text-teal-100 shadow-2xs"
                          >
                            <span>{concern}</span>
                            <button
                              type="button"
                              onClick={() => toggleWalkInConcern(concern)}
                              className="hover:text-rose-600 transition-colors cursor-pointer text-slate-400 font-black text-xs leading-none"
                              title="Remove concern"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {DOCTOR_PLAN_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setWalkInConcernCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer ${
                            walkInConcernCategory === cat.id
                              ? "bg-[#1A2421] text-white shadow-xs"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Popular Condition Chips (Selection-Friendly Grid) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/70 dark:bg-slate-800/60">
                      {POPULAR_DOCTOR_PLAN_CONCERNS.filter(
                        (item) => walkInConcernCategory === "all" || item.category === walkInConcernCategory
                      ).map((item) => {
                        const isSelected = walkInSelectedConcerns.includes(item.label);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleWalkInConcern(item.label)}
                            className={`p-2.5 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? "border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-950 dark:text-teal-100 font-black ring-1 ring-teal-500/30"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 text-slate-850 dark:text-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs leading-tight font-black">{item.label}</span>
                              {isSelected && (
                                <span className="w-3.5 h-3.5 rounded-full bg-teal-700 text-white flex items-center justify-center text-[9px] shrink-0 font-black">
                                  ✓
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold mt-1">
                              {item.system}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Manual Condition Count Pill Bar */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider block">
                          Total Concerns to Coordinate
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">
                          Auto-calculated from selection or click count:
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 w-full sm:w-auto">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const isCurrent = walkInConditionsCount === val;
                          const tierSurchargeUnit = surchargesLookup[walkInTier]?.unitWeekly || 500;
                          const surchargeText = val > 1 ? `+₹${((val - 1) * tierSurchargeUnit).toLocaleString("en-IN")}` : "Base";
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setWalkInConditionsCount(val)}
                              className={`px-3 py-1.5 rounded-xl text-center transition-all duration-200 cursor-pointer border-2 flex flex-col items-center ${
                                isCurrent
                                  ? "bg-[#1A2421] text-white border-transparent shadow-xs"
                                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-800"
                              }`}
                            >
                              <span className="text-xs font-black">{val === 5 ? "5+" : val}</span>
                              <span className={`text-[9px] font-bold leading-none mt-0.5 ${isCurrent ? "text-teal-300" : "text-slate-500"}`}>
                                {surchargeText}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Multi-System Coordination Notice */}
                    {walkInConditionsCount > 1 && (
                      <div className="p-3.5 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-left flex items-start gap-2.5">
                        <span className="text-teal-700 dark:text-teal-400 text-base leading-none mt-0.5">ℹ</span>
                        <p className="text-xs text-slate-850 dark:text-slate-200 font-medium leading-relaxed">
                          <strong className="font-black text-slate-950 dark:text-white">Dual/Multi-System Care Active ({walkInConditionsCount} Concerns):</strong>{" "}
                          Treating multiple co-existing complaints across organ systems requires cross-repertorization, synergistic remedy balancing, and closer clinical supervision by the consulting doctor.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 4. Clinical Concessions & Specialty Remedies (Selection-Friendly) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    
                    {/* Concessions / Discounts */}
                    <div className="p-4 md:p-5 bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Percent className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            Clinical Concession
                          </h4>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-0.5">Senior, socio-economic, or doctor override</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={walkInApplyConcession}
                            onChange={(e) => setWalkInApplyConcession(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                        </label>
                      </div>

                      {walkInApplyConcession && (
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { type: "senior", label: "Senior (15%)" },
                              { type: "compassionate", label: "Socio (30%)" },
                              { type: "override", label: "Override (₹)" }
                            ].map((opt) => (
                              <button
                                key={opt.type}
                                type="button"
                                onClick={() => setWalkInConcessionType(opt.type as any)}
                                className={`py-2 px-1.5 text-center rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 cursor-pointer ${
                                  walkInConcessionType === opt.type
                                    ? "bg-[#1A2421] text-white border-transparent shadow-xs"
                                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-800"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>

                          {walkInConcessionType === "override" && (
                            <div className="pt-1">
                              <input
                                type="number"
                                min="0"
                                value={walkInOverridePrice}
                                onChange={(e) => setWalkInOverridePrice(e.target.value)}
                                placeholder="Enter custom price in ₹"
                                className="w-full p-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-black text-slate-950 dark:text-white focus:outline-none focus:border-teal-600 shadow-2xs"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Specialized Medicine Add-ons */}
                    <div className="p-4 md:p-5 bg-white/95 dark:bg-slate-900/95 border-2 border-slate-200/90 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <PlusCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            Specialty Remedies
                          </h4>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-0.5">Mother tinctures, biochemic salts, or high dilutions</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={walkInApplyMedicineAddon}
                            onChange={(e) => setWalkInApplyMedicineAddon(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
                        </label>
                      </div>

                      {walkInApplyMedicineAddon && (
                        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { type: "Mother Tincture", details: "Mother Tincture (Q)", amount: "350" },
                              { type: "Biochemic", details: "Biochemic Tissue Salts", amount: "250" },
                              { type: "High Potency", details: "1M/10M Dilution", amount: "400" },
                              { type: "External", details: "External Oil/Application", amount: "300" }
                            ].map((preset) => (
                              <button
                                key={preset.details}
                                type="button"
                                onClick={() => {
                                  setWalkInMedicineAddons((prev) => [
                                    ...prev.filter(p => p.details !== preset.details),
                                    { id: Math.random().toString(), type: preset.type, details: preset.details, amount: preset.amount }
                                  ]);
                                }}
                                className="px-2.5 py-1.5 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-teal-600 rounded-lg text-[10px] font-black text-slate-900 dark:text-slate-100 cursor-pointer transition-colors"
                              >
                                + {preset.details} (₹{preset.amount})
                              </button>
                            ))}
                          </div>

                          {walkInMedicineAddons.filter(m => m.details).length > 0 && (
                            <div className="space-y-1 pt-1">
                              {walkInMedicineAddons.filter(m => m.details).map((addon, idx) => (
                                <div key={addon.id || idx} className="flex items-center justify-between text-xs bg-teal-50 dark:bg-teal-950/70 px-2.5 py-1.5 rounded-lg border border-teal-200 dark:border-teal-800 text-teal-950 dark:text-teal-100 font-black">
                                  <span>{addon.details}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span>+₹{addon.amount}</span>
                                    <button
                                      type="button"
                                      onClick={() => setWalkInMedicineAddons(prev => prev.filter((_, i) => i !== idx))}
                                      className="text-slate-400 hover:text-rose-600 font-black cursor-pointer text-sm leading-none"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

                {/* Right Column (5 cols lg, 4 cols xl): Sticky Patient Presentation Summary Card */}
                <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-3.5">
                  {(() => {
                    const tierKey = (walkInTier in careLevelsDetails ? walkInTier : "chronic_focused") as keyof typeof careLevelsDetails;
                    const details = careLevelsDetails[tierKey] || careLevelsDetails.chronic_focused;
                    const isExpressAcute = tierKey === "mild" && walkInDurationValue === 0.5;
                    const pricing = calculatePricing(tierKey, walkInBillingCycle, walkInDurationValue, walkInConditionsCount);

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
                    const totalDays = walkInBillingCycle === "weekly" ? (walkInDurationValue === 0.5 ? 3 : walkInDurationValue * 7) : walkInDurationValue * 30;
                    const dailyCost = Math.round(finalPrice / totalDays);
                    const durationLabel = walkInDurationValue === 0.5 ? "3 Days" : `${walkInDurationValue} ${walkInBillingCycle === "weekly" ? (walkInDurationValue === 1 ? "Week" : "Weeks") : (walkInDurationValue === 1 ? "Month" : "Months")}`;

                    return (
                      <div className="p-5 md:p-6 border-2 border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl space-y-4 shadow-xl text-left">
                        
                        {/* Quotation Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 dark:text-teal-200 bg-teal-100 dark:bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-300 dark:border-teal-700">
                                {isExpressAcute ? "Targeted Acute Protocol · ₹1,000" : "Live Care Quotation"}
                              </span>
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white mt-1 tracking-tight">
                              {isExpressAcute ? "Express Acute Care (3 Days)" : details.title}
                            </h4>
                          </div>
                          <span className="text-2xl p-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">{details.icon}</span>
                        </div>

                        {/* Optional Patient Name Input for Quotation Personalization */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                            Patient Name / Ref (Optional)
                          </label>
                          <input
                            type="text"
                            value={walkInName}
                            onChange={(e) => setWalkInName(e.target.value)}
                            placeholder="e.g. Patient Full Name"
                            className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-950 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all shadow-2xs"
                          />
                        </div>

                        {/* Scope Summary Badge */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl space-y-1 text-xs">
                          <div className="flex justify-between items-center text-[10px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider">
                            <span>Clinical Care Scope</span>
                            <span className="text-xs font-black text-teal-900 dark:text-teal-200 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-300 dark:border-teal-700">{walkInConditionsCount} {walkInConditionsCount === 1 ? "Condition" : "Conditions"}</span>
                          </div>
                          <p className="text-xs font-black text-slate-950 dark:text-white line-clamp-2">
                            {walkInSelectedConcerns.length > 0 
                              ? walkInSelectedConcerns.join(", ") 
                              : `${isExpressAcute ? "Express Acute Care" : details.title} protocol`}
                          </p>
                        </div>

                        {/* Financial Line Items */}
                        <div className="space-y-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">
                          <div className="flex justify-between items-center">
                            <span>Base Clinical Care Fee</span>
                            <span className="font-black text-slate-950 dark:text-white font-sans text-xs">
                              ₹{pricing.basePrice.toLocaleString("en-IN")} / {isExpressAcute ? "3 days" : (walkInBillingCycle === "weekly" ? "wk" : "mo")}
                            </span>
                          </div>

                          {pricing.surcharge > 0 && (
                            <div className="flex justify-between items-center text-teal-900 dark:text-teal-300">
                              <span>Multi-Concern Coordination</span>
                              <span className="font-black font-sans text-xs">
                                +₹{pricing.surcharge.toLocaleString("en-IN")} / {isExpressAcute ? "3 days" : (walkInBillingCycle === "weekly" ? "wk" : "mo")}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2 text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider text-[11px]">
                            <span>Care Period Total ({durationLabel})</span>
                            <span className="font-sans text-slate-950 dark:text-white font-black text-xs">₹{pricing.rawTotal.toLocaleString("en-IN")}</span>
                          </div>

                          {pricing.discountPercent > 0 && (
                            <div className="flex justify-between items-center text-emerald-900 dark:text-emerald-200 font-black text-xs bg-emerald-100 dark:bg-emerald-950/70 p-2 rounded-lg border border-emerald-300 dark:border-emerald-700">
                              <span>Continuity Benefit ({pricing.discountPercent}%):</span>
                              <span className="font-sans font-black">-₹{pricing.discountAmount.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          {walkInApplyConcession && concessionDiscount > 0 && (
                            <div className="flex justify-between items-center text-purple-900 dark:text-purple-200 font-black text-xs bg-purple-100 dark:bg-purple-950/70 p-2 rounded-lg border border-purple-300 dark:border-purple-700">
                              <span>
                                {walkInConcessionType === "senior"
                                  ? "Senior Citizen Concession (15%)"
                                  : walkInConcessionType === "compassionate"
                                    ? "Socio-Economic Subsidy (30%)"
                                    : "Clinical Concession Override"}
                              </span>
                              <span className="font-sans font-black">-₹{concessionDiscount.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          {walkInApplyMedicineAddon && addonAmount > 0 && (
                            <div className="flex justify-between items-center text-teal-900 dark:text-teal-200 font-black text-xs bg-teal-100 dark:bg-teal-950/70 p-2 rounded-lg border border-teal-300 dark:border-teal-700">
                              <span>Specialty Medicines Add-on</span>
                              <span className="font-sans font-black">+₹{addonAmount.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider">
                              <span>Treatment Duration</span>
                              <span className="text-slate-950 dark:text-white font-black text-xs">{totalDays} Days</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300 font-black uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 pb-2 items-center">
                              <span>Daily Equivalent</span>
                              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-black font-sans text-xs border border-emerald-300 dark:border-emerald-700">
                                ₹{dailyCost}/day
                              </span>
                            </div>
                          </div>

                          {/* Total Payable Prominent Display */}
                          <div className="flex justify-between border-t-2 border-slate-300 dark:border-slate-700 pt-3 text-sm font-black text-slate-950 dark:text-white items-baseline">
                            <span>Total Treatment Investment</span>
                            <motion.span
                              key={finalPrice}
                              initial={{ scale: 0.95, opacity: 0.8 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-slate-950 dark:text-white font-sans text-2xl sm:text-3xl font-black tracking-tight"
                            >
                              ₹{finalPrice.toLocaleString("en-IN")}
                            </motion.span>
                          </div>
                        </div>

                        {/* Inclusions Bullet List */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                          <span className="font-black text-slate-950 dark:text-white uppercase tracking-wider block text-xs">
                            All Care Programs Include:
                          </span>
                          <div className="grid grid-cols-2 gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs">
                            <div>✓ Full Case Mapping</div>
                            <div>✓ Constitutional Remedies</div>
                            <div>✓ Custom Diet Sheet</div>
                            <div>✓ Free India Delivery</div>
                          </div>
                        </div>

                        {/* Doctor Action Buttons */}
                        <div className="space-y-2 pt-2">
                          <button
                            type="button"
                            onClick={handleShareDoctorPlanWhatsApp}
                            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-black uppercase tracking-wider text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Share Plan on WhatsApp</span>
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={handleCopyDoctorPlanQuotation}
                              className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              {doctorPlanCopied ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 dark:text-emerald-300">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                                  <span>Copy Quotation</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleSaveDoctorPlanPreset}
                              className="py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-wider text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <Save className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                              <span>Save Preset</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}

        {/* Pricing Sub-text Notes */}
        <div className="mb-24 flex flex-col items-center text-center max-w-4xl mx-auto px-6 py-8 rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-md">
          <p className="text-base text-slate-950 dark:text-white font-black tracking-tight mb-3">
            Treatment plans are selected according to disease complexity and level of medical supervision required.
          </p>
          <div className="h-[2px] w-16 bg-teal-600 mb-3" />
          <p className="text-xs text-slate-800 dark:text-slate-200 font-black uppercase tracking-wider">
            Dr Narayan Jethwani MD <span className="mx-2 text-slate-400">|</span> 20+ Years Experience in Homeopathic Practice
          </p>
        </div>

        {/* Global Catalog Inclusions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t-2 border-slate-200 dark:border-slate-800 pt-16">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950 border-2 border-teal-200 dark:border-teal-800 flex items-center justify-center flex-shrink-0 shadow-sm text-teal-800 dark:text-teal-300">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white mb-1.5">Global Shipping</h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                Remedies are safely packaged and shipped globally. Domestic shipping across India is ₹300 standard. International shipping is calculated by provider or self-booked.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center flex-shrink-0 shadow-sm text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white mb-1.5">High Quality Therapeutics</h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                Only pure, dynamic dilutions prepared strictly in accordance with official pharmacopoeias are sourced and dispatched to patients.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 border-2 border-purple-200 dark:border-purple-800 flex items-center justify-center flex-shrink-0 shadow-sm text-purple-800 dark:text-purple-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950 dark:text-white mb-1.5">Inter-Consultation Tracking</h4>
              <p className="text-xs text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                Patients have continuous clinical support over WhatsApp to coordinate dose changes, acute symptoms flares, or updates.
              </p>
            </div>
          </div>
        </div>

        {/* AI Helper Triage Modal */}
        <Portal>
          <AnimatePresence>
            {isHelperOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsHelperOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-850 cursor-pointer"
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
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 1 of 3 · Complexity</span>
                      <h3 className="text-xl font-bold text-slate-900">How complex is your primary complaint?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Select the option that best matches your main health concern. This determines the base care tier.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          key: "mild",
                          icon: "🌱",
                          label: "Acute or Mild Complaints",
                          desc: "Short-term/mild issues that flare and resolve.",
                          examples: "Seasonal cold, mild acne, general hair fall, minor indigestion, skin allergy flare.",
                          tier: "→ Acute & Wellness Care",
                          tierColor: "text-slate-600"
                        },
                        {
                          key: "moderate",
                          icon: "⚡",
                          label: "Single Chronic Condition",
                          desc: "A persistent long-standing issue confined to one organ/system.",
                          examples: "Chronic sinusitis, localized eczema, mild hypothyroidism, IBS, single joint arthritis.",
                          tier: "→ Standard Chronic Care",
                          tierColor: "text-slate-700"
                        },
                        {
                          key: "focused",
                          icon: "🎯",
                          label: "Deep Organ System Pathology",
                          desc: "Complex systemic condition requiring targeted constitutional management.",
                          examples: "Bronchial asthma, severe psoriasis, PCOS, vascular migraines, hormonal acne.",
                          tier: "→ Deep Systemic Care",
                          tierColor: "text-mint-dark"
                        },
                        {
                          key: "organ",
                          icon: "🫁",
                          label: "Severe / Multi-Organ Pathology",
                          desc: "Advanced chronic disease affecting multiple systems or with serious biomarkers.",
                          examples: "Early CKD, fatty liver, RA, ankylosing spondylitis, autoimmune conditions.",
                          tier: "→ Advanced Pathological Care",
                          tierColor: "text-indigo-600"
                        },
                        {
                          key: "acute_critical",
                          icon: "🚨",
                          label: "Urgent / Critical Acute Condition",
                          desc: "Acute urgent illness requiring daily monitoring and priority intervention.",
                          examples: "Acute asthma attack, high uncontrolled fever, post-surgical recovery, acute renal flare.",
                          tier: "→ Acute Critical Care",
                          tierColor: "text-red-600"
                        }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, symptomsComplexity: item.key })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.symptomsComplexity === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-300 bg-white/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold ${item.tierColor} whitespace-nowrap`}>{item.tier}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.symptomsComplexity === item.key && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setTriageStep(2)}
                        disabled={!triageAnswers.symptomsComplexity}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 2 of 3 · Conditions Count</span>
                      <h3 className="text-xl font-bold text-slate-900">How many conditions are you treating?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Count each distinct active chronic complaint you want addressed simultaneously. Additional care coordination fee applies per extra concern beyond 1 (scaled by tier complexity).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        {
                          val: 1,
                          label: "1 Condition",
                          icon: "①",
                          desc: "Single focused complaint.",
                          examples: "Only eczema. Only thyroid. Only sinusitis. Only PCOS.",
                          surcharge: "Included in base plan",
                          color: "text-slate-600"
                        },
                        {
                          val: 2,
                          label: "2 Conditions",
                          icon: "②",
                          desc: "Two co-existing conditions being treated simultaneously.",
                          examples: "Thyroid + Skin. PCOS + Acne. Diabetes + Joint Pain. Sinusitis + Asthma.",
                          surcharge: "+ Additional Care Fee (Dual Care)",
                          color: "text-blue-600"
                        },
                        {
                          val: 3,
                          label: "3 Conditions",
                          icon: "③",
                          desc: "Three concurrent complaints requiring coordinated management.",
                          examples: "DM + HTN + Skin. Thyroid + PCOS + Hair. Asthma + Eczema + IBS.",
                          surcharge: "+ Additional Care Fee (Triple Care)",
                          color: "text-amber-600"
                        },
                        {
                          val: 4,
                          label: "4 Conditions",
                          icon: "④",
                          desc: "Four overlapping health concerns managed together.",
                          examples: "DM + CKD + HTN + Skin. PCOS + Thyroid + Gut + Migraines.",
                          surcharge: "+ Additional Care Fee (Quad Care)",
                          color: "text-orange-600"
                        },
                        {
                          val: 5,
                          label: "5+ Conditions",
                          icon: "⑤",
                          desc: "Complex poly-morbid case with 5 or more active complaints.",
                          examples: "DM + CKD + RA + HTN + Skin/Gut. Advanced multisystem chronic presentations.",
                          surcharge: "+ Additional Care Fee (Multi-Care)",
                          color: "text-rose-600"
                        }
                      ].map((item) => (
                        <div
                          key={item.val}
                          onClick={() => setTriageAnswers({ ...triageAnswers, conditionsNumber: item.val })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.conditionsNumber === item.val
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-300 bg-white/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black shrink-0 ${item.color}`}>{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 ${item.color}`}>{item.surcharge}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.conditionsNumber === item.val && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setTriageStep(1)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep(3)}
                        disabled={!triageAnswers.conditionsNumber}
                        className="px-6 py-2.5 bg-[#1A2421] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Next Step
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {triageStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Step 3 of 3 · Supervision</span>
                      <h3 className="text-xl font-bold text-slate-900">What level of medical oversight do you need?</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        This determines how actively Dr. Jethwani monitors, adjusts remedies, and reviews your lab reports during treatment.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        {
                          key: "standard",
                          icon: "📋",
                          label: "Standard Clinical Management",
                          desc: "Progress tracking every 2–4 weeks. No urgent lab reviews needed.",
                          examples: "Most chronic wellness conditions. Stable eczema, IBS, hair fall, mild thyroid.",
                          badge: "Most common",
                          badgeColor: "bg-slate-100 text-slate-600"
                        },
                        {
                          key: "high",
                          icon: "🔬",
                          label: "High Supervision & Medical Reviews",
                          desc: "Requires regular blood/lab report reviews, multi-remedy coordination, or direct Dr. Jethwani oversight.",
                          examples: "CKD, autoimmune RA, fatty liver with enzymes, post-surgical support, advanced hormonal cases.",
                          badge: "Lab monitoring",
                          badgeColor: "bg-blue-50 text-blue-700"
                        },
                        {
                          key: "urgent",
                          icon: "🚨",
                          label: "Urgent / Daily Clinical Coordination",
                          desc: "Daily clinical reviews, immediate dosage adjustments, and priority WhatsApp access to Dr. Jethwani.",
                          examples: "Acute critical illness, high fever, acute asthma attacks, acute renal episodes, emergency flares.",
                          badge: "Priority access",
                          badgeColor: "bg-red-50 text-red-700"
                        }
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setTriageAnswers({ ...triageAnswers, supervisionNeed: item.key })}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                            triageAnswers.supervisionNeed === item.key
                              ? "border-mint bg-mint/[0.04] ring-1 ring-mint/20"
                              : "border-slate-200 hover:border-slate-300 bg-white/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 flex-wrap">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.label}</h4>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>{item.badge}</span>
                              </div>
                              <p className="text-[10px] text-slate-600 font-semibold mt-0.5">{item.desc}</p>
                              <p className="text-[9px] text-slate-400 font-semibold mt-1 italic">e.g. {item.examples}</p>
                            </div>
                            {triageAnswers.supervisionNeed === item.key && (
                              <div className="w-4 h-4 rounded-full bg-mint flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setTriageStep(2)}
                        className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setTriageStep("result")}
                        disabled={!triageAnswers.supervisionNeed}
                        className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Calculate My Recommendation
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

                      {/* Result Card */}
                      <div className="border border-mint/20 bg-gradient-to-br from-mint/[0.04] to-transparent rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="p-5 flex justify-between items-start border-b border-mint/10">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase bg-mint/10 text-mint-dark border border-mint/20 px-2 py-0.5 rounded-full inline-block mb-1.5">
                              {recDetails.badge}
                            </span>
                            <h4 className="text-xl font-black text-[#1A2421]">{recDetails.title}</h4>
                            <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">
                              For {rec.conditionsCount === 1 ? "1 Condition" : rec.conditionsCount === 2 ? "2 Conditions" : rec.conditionsCount === 3 ? "3 Conditions" : rec.conditionsCount === 4 ? "4 Conditions" : "5+ Conditions"}
                            </span>
                          </div>
                          <span className="text-4xl">{recDetails.icon}</span>
                        </div>

                        {/* Pricing preview */}
                        <div className="grid grid-cols-2 border-b border-mint/10">
                          <div className="p-4 border-r border-mint/10">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Rate</span>
                            <span className="text-xl font-black text-[#1A2421]">₹{recDetails.monthlyPrice.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block">/month</span>
                          </div>
                          <div className="p-4">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Weekly Rate</span>
                            <span className="text-xl font-black text-[#1A2421]">₹{recDetails.weeklyPrice.toLocaleString("en-IN")}</span>
                            <span className="text-[9px] text-slate-500 font-semibold block">/week</span>
                          </div>
                        </div>

                        {/* Rationale */}
                        <div className="p-4 space-y-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Clinical Rationale</span>
                          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                            {rec.explanation}
                          </p>
                        </div>

                        {/* What's included chips */}
                        <div className="px-4 pb-4">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Included In This Plan</span>
                          <div className="flex flex-wrap gap-1.5">
                            {recDetails.features.slice(0, 5).map((f: string, i: number) => (
                              <span key={i} className="text-[9px] font-semibold bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between gap-3 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => setTriageStep(3)}
                          className="px-6 py-2.5 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-slate-700 bg-white/50"
                        >
                          Adjust Answers
                        </button>
                        <button
                          onClick={() => handleApplyTriage(rec.careLevel, rec.conditionsCount)}
                          className="px-6 py-2.5 bg-mint hover:bg-mint-dark text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          Apply This Plan
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
        </Portal>

        {/* Upgrade/Checkout Modal Overlay */}
        <Portal>
          <AnimatePresence>
            {isCheckoutOpen && checkoutPlan && (
              <div 
                data-lenis-prevent
                className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:py-12 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 md:p-8 relative overflow-hidden my-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-850 cursor-pointer z-10"
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
                          <span>Clinical Care Fee</span>
                          <span>₹{((checkoutPlan.finalPrice / (1 - (checkoutPlan.discountPercent || 0) / 100)) || checkoutPlan.finalPrice).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase">
                          <span>Active Health Concerns</span>
                          <span className="text-[10px] text-slate-600 font-black text-right">{checkoutPlan.conditionsText ? checkoutPlan.conditionsText.replace("Condition", "Concern") : ""}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase border-b border-slate-200 pb-2">
                          <span>Recommended Care Period</span>
                          <span>{checkoutPlan.durationText}</span>
                        </div>
                        {checkoutPlan.discountPercent > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600 font-bold uppercase">
                            <span>Continuity of Care Benefit ({checkoutPlan.discountPercent}%)</span>
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
                        const upiPayUrl = `upi://pay?pa=${process.env.NEXT_PUBLIC_PAYMENT_UPI || "8446056789@hdfc"}&pn=Dr%20Narayan%20Jethwani&am=${finalPayable}&cu=INR&tn=${encodeURIComponent(`Plan - ${checkoutPlan.title}`)}`;
                        const qrCodeSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiPayUrl)}`;
                        
                        return (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-mint/20 bg-mint/[0.02] rounded-2xl">
                              <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm flex-shrink-0">
                                <Image
                                  src={qrCodeSrc}
                                  alt="UPI Payment QR Code"
                                  width={140}
                                  height={140}
                                  unoptimized
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
                                      navigator.clipboard.writeText(process.env.NEXT_PUBLIC_PAYMENT_UPI || "8446056789@hdfc");
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
                                <div className="w-8 h-8 rounded bg-white border border-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center relative">
                                  <Image
                                    src={URL.createObjectURL(paymentScreenshot)}
                                    alt="Payment Screenshot Preview"
                                    fill
                                    sizes="32px"
                                    unoptimized
                                    className="object-cover"
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

I have transferred the payment to your registered GPay (${process.env.NEXT_PUBLIC_PAYMENT_PHONE || "8446056789"}) or bank account. Please review my profile and confirm next clinical consultation steps.`;

                            const encodedText = encodeURIComponent(message);
                            window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918446056789"}?text=${encodedText}`, "_blank");
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
        </Portal>
      </div>
    </div>
  );
}
