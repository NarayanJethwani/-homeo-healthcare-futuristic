"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, Info, Activity, Sparkles, 
  HelpCircle, Percent, Clock, Phone, AlertCircle, TrendingUp
} from "lucide-react";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

const careLevelsDetails = {
  mild: {
    title: "Acute & Wellness Care",
    weeklyPrice: 1200,
    monthlyPrice: 4800,
    badge: "Acute & General Support",
    icon: "🌱",
    colorClass: "text-teal-600 border-teal-200/50 bg-teal-50/50 dark:bg-teal-950/20 dark:text-teal-400",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 300,
    surchargeMonthly: 1200,
    description: "Ideal for general immunity, hair fall, seasonal acute complaints, or general wellness guidance.",
    features: [
      "General constitutional wellness analysis",
      "Corrective micro-dosing remedy supply",
      "Standard wellness dietary guide sheet",
      "WhatsApp clinical team updates (bi-weekly)"
    ]
  },
  moderate: {
    title: "Standard Chronic Care",
    weeklyPrice: 2400,
    monthlyPrice: 9600,
    badge: "Focused Chronic Management",
    icon: "⚡",
    colorClass: "text-purple-600 border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 dark:text-purple-400",
    glowColor: "rgba(168,85,247,0.15)",
    surchargeWeekly: 450,
    surchargeMonthly: 1800,
    description: "Designed for a single chronic condition (e.g. eczema, IBS, thyroid) requiring active tracking and bi-weekly checks.",
    features: [
      "Single chronic condition profile mapping",
      "Targeted constitutional remedy preparation",
      "Anti-inflammatory diet & lifestyle sheets",
      "Standard clinical response monitoring checkups"
    ]
  },
  focused: {
    title: "Deep Systemic Care",
    weeklyPrice: 4200,
    monthlyPrice: 16800,
    badge: "Complex Chronic Therapy",
    icon: "🎯",
    colorClass: "text-sky-600 border-sky-200/50 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    glowColor: "rgba(14,165,233,0.15)",
    surchargeWeekly: 750,
    surchargeMonthly: 3000,
    description: "Deep management of complex chronic or systemic health conditions (e.g. asthma, migraine, severe eczema).",
    features: [
      "Deep-seated target system pathology analysis",
      "High-potency customized constitutional dilutions",
      "Custom anti-inflammatory & allergen guides",
      "Priority clinical checkins over WhatsApp"
    ]
  },
  organ: {
    title: "Advanced Pathological Care",
    weeklyPrice: 6000,
    monthlyPrice: 24000,
    badge: "Organ System Recovery",
    icon: "🫁",
    colorClass: "text-emerald-600 border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    surchargeWeekly: 1050,
    surchargeMonthly: 4200,
    description: "Advanced recovery protocols for deep-seated pathology, including organ system rebalancing and biomarker reviews.",
    features: [
      "Multi-remedy support for organ pathology",
      "Advanced systemic rebalancing protocols",
      "Biomarker timeline mapping & reviews",
      "Personalized organ-support lifestyle sheets"
    ]
  },
  comprehensive: {
    title: "Multisystem Integrative Care",
    weeklyPrice: 8400,
    monthlyPrice: 33600,
    badge: "Multi-Organ Intensive Care",
    icon: "🔮",
    colorClass: "text-indigo-600 border-indigo-200/50 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    surchargeWeekly: 1350,
    surchargeMonthly: 5400,
    description: "For long-standing, multi-system chronic pathologies requiring intensive clinical supervision by Dr. Jethwani.",
    features: [
      "Multi-organ pathogenetic profile mapping",
      "Direct clinical supervision by Dr. Jethwani",
      "High-frequency dosage titrations & reviews",
      "Direct priority clinical assistance channel"
    ]
  },
  acute_critical: {
    title: "Acute Critical Care",
    weeklyPrice: 5000,
    monthlyPrice: 20000,
    badge: "Intensive Daily Supervision",
    icon: "🚨",
    colorClass: "text-rose-600 border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
    glowColor: "rgba(239,68,68,0.15)",
    surchargeWeekly: 1000,
    surchargeMonthly: 4000,
    description: "For urgent, high-intensity acute cases requiring daily tracking, frequent remedy adjustments, and intensive physician study.",
    features: [
      "Daily doctor clinical review and check-ins",
      "Intensive daily remedy titration and support",
      "Emergency/priority WhatsApp communication channel",
      "Detailed case study and Organon-guided repertorization"
    ]
  }
};

export default function PlansComparisonPage() {
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [calculatorLevel, setCalculatorLevel] = useState<keyof typeof careLevelsDetails>("focused");
  const [calculatorConditions, setCalculatorConditions] = useState<number>(1);
  const [calculatorDuration, setCalculatorDuration] = useState<number>(3); // 3 months default

  // Calculate pricing values
  const calculatePricingForWidget = (
    level: keyof typeof careLevelsDetails,
    cycle: "weekly" | "monthly",
    duration: number,
    conditions: number
  ) => {
    const details = careLevelsDetails[level];
    const basePrice = cycle === "weekly" ? details.weeklyPrice : details.monthlyPrice;
    const unitSurcharge = cycle === "weekly" ? details.surchargeWeekly : details.surchargeMonthly;
    
    const surcharge = conditions > 1 ? (conditions - 1) * unitSurcharge : 0;
    const adjustedBasePrice = basePrice + surcharge;
    const rawTotal = adjustedBasePrice * duration;
    
    const equivalentWeeks = cycle === "weekly" ? duration : duration * 4;
    let discountPercent = 0;
    if (equivalentWeeks >= 48) discountPercent = 30;
    else if (equivalentWeeks >= 24) discountPercent = 25;
    else if (equivalentWeeks >= 12) discountPercent = 20;
    else if (equivalentWeeks >= 8) discountPercent = 15;
    else if (equivalentWeeks >= 4) discountPercent = 10;
    else if (equivalentWeeks >= 2) discountPercent = 5;

    const discountAmount = Math.round((rawTotal * discountPercent) / 100);
    const finalPrice = rawTotal - discountAmount;
    const totalDays = cycle === "weekly" ? duration * 7 : duration * 30;
    const dailyEquivalent = Math.round(finalPrice / totalDays);

    return {
      basePrice,
      surcharge,
      rawTotal,
      discountPercent,
      discountAmount,
      finalPrice,
      totalDays,
      dailyEquivalent
    };
  };

  const widgetPricing = calculatePricingForWidget(calculatorLevel, billingCycle, calculatorDuration, calculatorConditions);

  return (
    <div className="pt-32 pb-24 px-6 relative bg-gradient-mesh min-h-screen">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Magnetic>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Treatment Planner
            </Link>
          </Magnetic>
        </motion.div>

        {/* Hero Header */}
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Comparison & Savings
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Care Tiers Matrix
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold leading-relaxed"
          >
            Review our care tiers side-by-side to understand how pricing scales with clinical complexity, conditions covered, and supervision requirements. Compare equivalent daily costs and loyalty savings.
          </motion.p>
        </div>

        {/* Billing Cycle Selector Toggle */}
        <div className="flex justify-center md:justify-start mb-12">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/5 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-md">
            <button
              onClick={() => setBillingCycle("weekly")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                billingCycle === "weekly"
                  ? "bg-[#1A2421] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1A2421]"
              }`}
            >
              Weekly Pricing
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                billingCycle === "monthly"
                  ? "bg-[#1A2421] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#1A2421]"
              }`}
            >
              Monthly Commits
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-black tracking-normal">
                SAVE 10–30%
              </span>
            </button>
          </div>
        </div>

        {/* Matrix Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(careLevelsDetails).map(([key, details], idx) => {
            const isWeekly = billingCycle === "weekly";
            const price = isWeekly ? details.weeklyPrice : details.monthlyPrice;
            const cycleText = isWeekly ? "/ week" : "/ month";
            
            // Calculate savings vs weekly
            const weeklyEquivalent = details.weeklyPrice * 4.33;
            const savings = weeklyEquivalent - details.monthlyPrice;
            const savingsPercent = Math.round((savings / weeklyEquivalent) * 100);

            const dayRate = Math.round(price / (isWeekly ? 7 : 30));

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-mint/30 transition-all duration-300 relative overflow-hidden group"
                style={{
                  boxShadow: `0 8px 32px 0 ${details.glowColor}`
                }}
              >
                {/* Background glow design */}
                <div 
                  className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" 
                  style={{ backgroundColor: details.glowColor }} 
                />

                <div className="space-y-6">
                  {/* Header Badge */}
                  <div className="flex justify-between items-start gap-4">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${details.colorClass}`}>
                      {details.badge}
                    </span>
                    <span className="text-3xl">{details.icon}</span>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1A2421] mb-2">{details.title}</h3>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#1A2421]">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase">{cycleText}</span>
                    </div>
                    
                    {/* Day rate breakdown */}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider mt-2.5">
                      <Clock className="w-3.5 h-3.5 text-mint" />
                      <span>Equivalent: <span className="text-emerald-700 font-extrabold">₹{dayRate}/day</span></span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-slate-500 leading-relaxed min-h-[48px]">
                    {details.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-slate-900/5">
                    <h4 className="text-[10px] font-black text-[#1A2421] uppercase tracking-wider">Clinical Protocol:</h4>
                    <ul className="space-y-2 text-xs font-semibold text-slate-600">
                      {details.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Surcharges & Savings Bottom Footer */}
                <div className="mt-8 pt-4 border-t border-slate-900/5 space-y-3">
                  {/* Monthly savings badge */}
                  {!isWeekly && (
                    <div className="flex justify-between items-center bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-emerald-600" />
                        Monthly Savings
                      </span>
                      <span className="font-extrabold">Save {savingsPercent}% (~₹{Math.round(savings).toLocaleString("en-IN")})</span>
                    </div>
                  )}

                  {/* Coordination surcharge */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Extra Cond. Surcharge</span>
                    <span className="text-slate-800 font-extrabold">
                      +₹{(isWeekly ? details.surchargeWeekly : details.surchargeMonthly).toLocaleString("en-IN")} / {isWeekly ? "wk" : "mo"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Explanation: Why Coordination Surcharges Exist */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 mb-16 space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A2421] uppercase tracking-wider">Multi-Condition Coordination Fees</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Coordinating multiple co-existing diseases requires linear complexity scaling. Here is why we charge condition surcharges:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-semibold leading-relaxed">
            <div className="space-y-2 p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">1. Repertory Synthesis complexity</span>
              <p>
                Every co-existing disease introduces dozens of additional symptom rubrics. Aligning them requires organic, constitutional remedy mapping to find a single, matching similimum without producing adverse secondary symptoms.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">2. Dosage Titration & Adjustments</span>
              <p>
                As remedies act, one condition might improve while another flares up (remedy reaction). Dr. Jethwani must adjust potencies, repetition schedule, and intercurrent remedies constantly to control all symptoms.
              </p>
            </div>
            <div className="space-y-2 p-4 bg-slate-900/5 rounded-2xl border border-slate-200/50">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">3. Case Supervision Hours</span>
              <p>
                Patient files with 3 or more conditions have detailed progress reviews, clinical timelines, and laboratory tracking reports. This requires 2-3x more physician hours than standard wellness support.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loyalty Discounts & Savings Interactive Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Widget Selector inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 glass-panel border-white/60 bg-white/40 rounded-3xl p-6 md:p-8 space-y-6"
          >
            <div>
              <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Savings Calculator</span>
              <h2 className="text-xl font-bold text-[#1A2421]">Interactive Plan Estimator</h2>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Simulate different program durations to view loyalty discounts and daily cost breakdowns.
              </p>
            </div>
            {/* Select Care Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2421] uppercase tracking-wider block">1. Care Program Level</label>
              <select
                value={calculatorLevel}
                onChange={(e) => setCalculatorLevel(e.target.value as keyof typeof careLevelsDetails)}
                className="w-full bg-white/80 border border-slate-200/60 p-3 rounded-2xl text-xs font-bold text-[#1A2421] focus:ring-1 focus:ring-mint outline-none transition-all duration-300 cursor-pointer"
              >
                {Object.entries(careLevelsDetails).map(([key, details]) => (
                  <option key={key} value={key}>
                    {details.icon} {details.title} (₹{billingCycle === "weekly" ? details.weeklyPrice : details.monthlyPrice}/{billingCycle === "weekly" ? "wk" : "mo"} base)
                  </option>
                ))}
              </select>
            </div>

            {/* Select Billing Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2421] uppercase tracking-wider block">2. Billing Frequency</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("weekly");
                    setCalculatorDuration(1); // Reset duration to 1 Wk
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 border cursor-pointer ${
                    billingCycle === "weekly"
                      ? "bg-[#1A2421] text-white border-[#1A2421] shadow-sm"
                      : "bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white"
                  }`}
                >
                  Weekly Pricing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBillingCycle("monthly");
                    setCalculatorDuration(3); // Reset duration to 3 Mos
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 border flex items-center justify-center gap-1.5 cursor-pointer ${
                    billingCycle === "monthly"
                      ? "bg-[#1A2421] text-white border-[#1A2421] shadow-sm"
                      : "bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white"
                  }`}
                >
                  Monthly Commits
                  <span className={`text-[7px] px-1 py-0.5 rounded-full font-black ${
                    billingCycle === "monthly"
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-500/15 text-emerald-700"
                  }`}>
                    SAVE 10–30%
                  </span>
                </button>
              </div>
            </div>

            {/* Select Conditions covered */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2421] uppercase tracking-wider block">3. Conditions Covered</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCalculatorConditions(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 border cursor-pointer ${
                      calculatorConditions === num
                        ? "bg-[#1A2421] text-white border-[#1A2421] shadow-sm"
                        : "bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white"
                    }`}
                  >
                    {num === 5 ? "5+" : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A2421] uppercase tracking-wider block">
                4. Commitment Duration ({calculatorDuration} {billingCycle === "weekly" ? (calculatorDuration === 1 ? "Week" : "Weeks") : (calculatorDuration === 1 ? "Month" : "Months")})
              </label>
              <div className="flex gap-2">
                {(billingCycle === "weekly" ? [1, 2, 4, 8, 12] : [1, 2, 3, 6, 12]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setCalculatorDuration(dur)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 border cursor-pointer ${
                      calculatorDuration === dur
                        ? "bg-[#1A2421] text-white border-[#1A2421] shadow-sm"
                        : "bg-white/60 text-slate-600 border-slate-200/50 hover:bg-white"
                    }`}
                  >
                    {dur} {billingCycle === "weekly" ? "Wk" : "Mo"}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calculator Results Display Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 glass-panel border-[#1a2421]/10 bg-[#1A2421]/[0.02] rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-bold text-mint uppercase tracking-widest block mb-1">Result Summary</span>
              <h3 className="text-lg font-serif font-bold text-[#1A2421]">{careLevelsDetails[calculatorLevel].title}</h3>
              <p className="text-xs text-slate-500 font-semibold">For {calculatorConditions === 1 ? "1 Condition" : `${calculatorConditions === 5 ? "5+" : calculatorConditions} Conditions`}</p>
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-900/5">
              <div className="flex justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>Base Rate ({billingCycle === "weekly" ? "Weekly" : "Monthly"})</span>
                <span>₹{widgetPricing.basePrice.toLocaleString("en-IN")}</span>
              </div>
              
              {widgetPricing.surcharge > 0 && (
                <div className="flex justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <span>Coordination Surcharge</span>
                  <span>+₹{widgetPricing.surcharge.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-900/5 pb-2">
                <span>Timeline ({calculatorDuration} {billingCycle === "weekly" ? "weeks" : "months"})</span>
                <span>₹{widgetPricing.rawTotal.toLocaleString("en-IN")}</span>
              </div>

              {widgetPricing.discountAmount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-extrabold uppercase tracking-wider">
                  <span>Loyalty Discount ({widgetPricing.discountPercent}%)</span>
                  <span>-₹{widgetPricing.discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider pt-2">
                <span>Care Period</span>
                <span className="text-slate-800 font-bold">{widgetPricing.totalDays} Days</span>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span>Day Cost Equivalent</span>
                <span className="text-emerald-700 font-bold">₹{widgetPricing.dailyEquivalent} / day</span>
              </div>
            </div>

            {/* Total Block */}
            <div className="pt-4 border-t border-slate-900/5 flex justify-between items-baseline mt-4">
              <span className="text-xs font-black text-slate-900 uppercase">Estimated Total</span>
              <div className="text-right">
                <span className="text-3xl font-black text-[#1A2421] font-sans">
                  ₹{widgetPricing.finalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Direct Planner Link button */}
            <div className="pt-6">
              <Link
                href={`/store?careLevel=${calculatorLevel}&billingCycle=${billingCycle}&durationValue=${calculatorDuration}&conditionsCount=${calculatorConditions}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#1A2421] hover:bg-[#2b3a36] text-white rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer"
              >
                Apply Configuration to Planner <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
