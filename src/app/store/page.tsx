"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, Sparkles, Filter, CheckCircle2, 
  ArrowRight, ArrowLeft, Phone, MessageSquare, ShieldCheck, Truck, Clock 
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

export default function StorePage() {
  // CONFIGURATION: Replace this base URL with your existing website's checkout path
  // E.g., "https://www.homeo.healthcare/checkout/" or "https://www.homoe.healthcare/checkout/"
  const SHOP_BASE_URL = "https://shop.homeo.healthcare/checkout/";

  const [filter, setFilter] = useState<"all" | "consultation" | "specialty">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");

  const filteredPackages = packages.filter((pkg) => {
    const matchesFilter = filter === "all" || pkg.category === filter;
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleSelectPlan = (pkg: Package) => {
    // Generate text message for WhatsApp pre-fill
    let message = "";
    if (pkg.category === "consultation") {
      const cyclePrice = billingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly;
      message = `Hello Dr. Jethwani, I am interested in booking the "${pkg.title}" consultation plan on a ${billingCycle} basis (${cyclePrice}). Could you guide me on the registration process?`;
    } else {
      message = `Hello Dr. Jethwani, I am interested in booking the "${pkg.title}" (${pkg.duration}). Could you guide me on the registration process?`;
    }
    const encodedText = encodeURIComponent(message);
    window.open(`https://wa.me/918446056789?text=${encodedText}`, "_blank");
  };

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
        <div className="max-w-3xl mb-16">
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
                    ? "bg-mint text-white shadow-sm shadow-mint/10"
                    : "glass-panel border-slate-200 hover:border-slate-800 text-slate-700 hover:text-[#1A2421] bg-white/40"
                }`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>

          {/* Billing Cycle Toggle (only show if not strictly on specialty filter) */}
          {filter !== "specialty" && (
            <div className="flex items-center gap-2 bg-slate-900/5 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-md">
              <button
                onClick={() => setBillingCycle("weekly")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 ${
                  billingCycle === "weekly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-[#1A2421]"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                  billingCycle === "monthly"
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
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg) => {
              const borderClass = pkg.colorTheme ? pkg.colorTheme.border : "border-white/60 hover:border-white/90";
              const bgClass = pkg.colorTheme ? pkg.colorTheme.bg : "bg-white/40";
              const textClass = pkg.colorTheme ? pkg.colorTheme.text : "text-mint-dark";
              
              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                              {billingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly}
                            </span>
                            {(billingCycle === "weekly" ? pkg.priceWeekly : pkg.priceMonthly)?.startsWith("₹") && (
                              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                / {billingCycle}
                              </span>
                            )}
                          </div>
                          {/* Alternative price under it in smaller text */}
                          <span className="text-[10px] text-slate-500 font-semibold mt-1">
                            {billingCycle === "weekly" 
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

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

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
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm text-aqua">
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
              <h4 className="text-sm font-bold text-slate-900 mb-1">Inter-Consultation Tracking</h4>
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
