"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Sparkles, Filter, CheckCircle2, 
  ArrowRight, ArrowLeft, Phone, MessageSquare, ShieldCheck, Truck, Clock,
  Sliders, Plus, Trash2, Share2, Copy, Save, LayoutGrid, Layers, Activity,
  Info, Percent, HelpCircle
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
    title: "Focused Care",
    priceWeekly: "₹3,000",
    priceMonthly: "₹10,000",
    category: "consultation",
    desc: "Focused homeopathic treatment for a single acute or mild chronic condition.",
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
    title: "Recommended System Care",
    priceWeekly: "₹6,000",
    priceMonthly: "₹20,000",
    category: "consultation",
    desc: "Targeted support for one primary organ system. Best for early or single-system problems.",
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
    title: "Comprehensive Care",
    priceWeekly: "₹9,000",
    priceMonthly: "₹30,000",
    category: "consultation",
    desc: "For multi-system or long-standing chronic health conditions. Includes deeper case analysis and ongoing supervision.",
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
    title: "Mild Care",
    weeklyPrice: 1200,
    monthlyPrice: 4000,
    badge: "Acute & General Support",
    icon: "🌱",
    description: "Ideal for mild chronic issues, minor acute flares, or general natural healthcare guidance.",
    features: [
      "General constitutional analysis",
      "Corrective micro-dosing remedy supply",
      "Standard dietary guide sheet",
      "WhatsApp team updates (bi-weekly)"
    ],
    glowColor: "rgba(20,184,166,0.15)"
  },
  moderate: {
    title: "Moderate Care",
    weeklyPrice: 2500,
    monthlyPrice: 8500,
    badge: "Focused Chronic Management",
    icon: "⚡",
    description: "Designed for a single chronic condition that requires active tracking and occasional dosage updates.",
    features: [
      "Single chronic condition profile mapping",
      "Constitutional remedy preparation",
      "Diet & allergen avoidance sheet",
      "Standard clinical response checkups (every 2 weeks)"
    ],
    glowColor: "rgba(168,85,247,0.15)"
  },
  focused: {
    title: "Focused Care",
    weeklyPrice: 4500,
    monthlyPrice: 15000,
    badge: "Organ System Level Care",
    icon: "🎯",
    description: "Deep management of a primary target system (e.g., lungs, digestive tract, skin, or hair).",
    features: [
      "Targeted single-organ analysis & history",
      "High-potency customized constitutional remedies",
      "Lab report reviews & medical integration",
      "Priority clinical updates over WhatsApp"
    ],
    glowColor: "rgba(14,165,233,0.15)"
  },
  organ: {
    title: "Organ System Care",
    weeklyPrice: 6500,
    monthlyPrice: 22000,
    badge: "Multi-Remedy System Support",
    icon: "🫁",
    description: "Advanced co-management of deep-rooted system pathology alongside conventional medical setups.",
    features: [
      "Advanced systemic constitutional rebalancing",
      "Multi-remedy support for organ systems",
      "Biomarker timeline mapping & monitoring",
      "Dedicated dietitian support checkups"
    ],
    glowColor: "rgba(16,185,129,0.15)"
  },
  comprehensive: {
    title: "Comprehensive Care",
    weeklyPrice: 8500,
    monthlyPrice: 28000,
    badge: "Multi-Organ Chronic Care",
    icon: "🔮",
    description: "For long-standing chronic, multi-system diseases requiring intense clinical supervision by Dr. Jethwani.",
    features: [
      "Multi-organ pathogenetic mapping",
      "Direct medical supervision by Dr. Jethwani",
      "High-frequency dosage reviews & titrations",
      "Immediate urgent care updates and guidelines"
    ],
    glowColor: "rgba(244,63,94,0.15)"
  }
};

export default function StorePage() {
  const [viewMode, setViewMode] = useState<"dashboard" | "catalog">("dashboard");

  // Calculator states
  const [careLevel, setCareLevel] = useState<"mild" | "moderate" | "focused" | "organ" | "comprehensive">("focused");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [durationValue, setDurationValue] = useState<number>(1); // Default to 1 period (1 month or 4 weeks depending on cycle)
  const [conditionsCount, setConditionsCount] = useState<number>(1); // 1, 2, or 3

  // Saved configs list
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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


  const calculatePricing = (
    level: keyof typeof careLevelsDetails,
    cycle: "weekly" | "monthly",
    duration: number,
    conditions: number = 1
  ) => {
    const details = careLevelsDetails[level];
    const basePrice = cycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
    
    // Coordination surcharge for co-existing conditions:
    // 1 Condition: base rate
    // 2 Conditions: +500/week or +1500/month coordination fee
    // 3+ Conditions: +1000/week or +3000/month coordination fee
    let surcharge = 0;
    if (conditions === 2) {
      surcharge = cycle === "weekly" ? 500 : 1500;
    } else if (conditions >= 3) {
      surcharge = cycle === "weekly" ? 1000 : 3000;
    }

    const adjustedBasePrice = basePrice + surcharge;
    const rawTotal = adjustedBasePrice * duration;
    
    // Equivalent weeks
    const equivalentWeeks = cycle === "weekly" ? duration : duration * 4;
    
    let discountPercent = 0;
    if (equivalentWeeks >= 12) {
      discountPercent = 20;
    } else if (equivalentWeeks >= 8) {
      discountPercent = 15;
    } else if (equivalentWeeks >= 4) {
      discountPercent = 10;
    } else if (equivalentWeeks >= 2) {
      discountPercent = 5;
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
      
    const message = `Hello Dr. Jethwani, I have calculated my constitutional treatment plan using the interactive dashboard:
- Care Level: ${details.title} (${details.badge})
- Conditions: ${conditionsText}
- Billing Cycle: ${billingCycle}
- Duration: ${durationText}
- Total Price: ₹${pricing.finalPrice.toLocaleString("en-IN")} (after ${pricing.discountPercent}% discount)

*Payment Info:*
- GPay / PhonePe / Paytm Number: 8446056789
(Please make the GPay transfer and share screenshot)

Could you guide me on the next clinical steps to register, confirm my payment, and start this treatment?`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/918446056789?text=${encodedText}`, "_blank");
  };

  const handleSelectPlan = (pkg: Package) => {
    let message = "";
    if (pkg.category === "consultation") {
      const cyclePrice = catalogBillingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly;
      message = `Hello Dr. Jethwani, I am interested in booking the "${pkg.title}" consultation plan on a ${catalogBillingCycle} basis (${cyclePrice}).

*Payment Info:*
- GPay / PhonePe / Paytm Number: 8446056789

Could you guide me on the registration process and payment steps?`;
    } else {
      message = `Hello Dr. Jethwani, I am interested in booking the "${pkg.title}" (${pkg.duration}).

*Payment Info:*
- GPay / PhonePe / Paytm Number: 8446056789

Could you guide me on the registration process and payment steps?`;
    }
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/918446056789?text=${encodedText}`, "_blank");
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
      
    const message = `Hello Dr. Jethwani, I have calculated my constitutional treatment plan and compared it using the dashboard:
- Care Level: ${details.title} (${details.badge})
- Conditions: ${conditionsText}
- Billing Cycle: ${config.billingCycle}
- Duration: ${durationText}
- Total Price: ₹${pricing.finalPrice.toLocaleString("en-IN")} (after ${pricing.discountPercent}% discount)

*Payment Info:*
- GPay / PhonePe / Paytm Number: 8446056789
(Please make the GPay transfer and share screenshot)

Could you guide me on the registration process and payment steps?`;

    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/918446056789?text=${encodedText}`, "_blank");
  };

  const handleLoadConfig = (config: SavedConfig) => {
    setCareLevel(config.careLevel);
    setBillingCycle(config.billingCycle);
    setDurationValue(config.durationValue);
    setConditionsCount(config.conditionsCount || 1);
    setViewMode("dashboard");
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
          </div>
        </div>

        {/* Views Content wrapper */}
        <AnimatePresence mode="wait">
          {viewMode === "dashboard" ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-16 mb-16"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
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
                      {[
                        { count: 1, label: "1 Condition", surchargeText: "Standard plan coverage", surchargeInfo: "No coordination fee" },
                        { count: 2, label: "2 Conditions", surchargeText: billingCycle === "weekly" ? "+₹500 / week" : "+₹1,500 / month", surchargeInfo: "Dual-condition coordination" },
                        { count: 3, label: "3+ Conditions", surchargeText: billingCycle === "weekly" ? "+₹1,000 / week" : "+₹3,000 / month", surchargeInfo: "Complex multi-condition management" }
                      ].map((item) => {
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
                      })}
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
                              { value: 3, label: "3 Months", desc: "20% Discount" }
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
                            <span className="text-[10px] text-slate-500 font-semibold block uppercase">All Inclusive</span>
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
                                onClick={() => handleCopyLink(config.careLevel, config.billingCycle, config.durationValue)}
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
          ) : (
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
                Remedies are safely packaged and shipped globally. Domestic delivery is covered within plan cost. International shipping calculated at dispatch.
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
      </div>
    </div>
  );
}
