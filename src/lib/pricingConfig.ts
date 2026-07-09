export interface CareLevelDetail {
  title: string;
  weeklyPrice: number;
  monthlyPrice: number;
  badge: string;
  icon: string;
  complexityLabel: string;
  description: string;
  features: string[];
  glowColor: string;
  surchargeWeekly: number;
  surchargeMonthly: number;
  colorClass?: string;
}

export const CARE_LEVELS_DETAILS: Record<"mild" | "moderate" | "focused" | "organ" | "comprehensive" | "acute_critical", CareLevelDetail> = {
  mild: {
    title: "Acute & Wellness Care",
    weeklyPrice: 1500,
    monthlyPrice: 6000,
    badge: "Acute & General Support",
    icon: "🌱",
    colorClass: "text-teal-650 border-teal-200/50 bg-teal-50/50 dark:bg-teal-950/20 dark:text-teal-400",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 375,
    surchargeMonthly: 1500,
    complexityLabel: "Low",
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
    weeklyPrice: 3000,
    monthlyPrice: 12000,
    badge: "Focused Chronic Management",
    icon: "⚡",
    colorClass: "text-purple-600 border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 dark:text-purple-400",
    glowColor: "rgba(168,85,247,0.15)",
    surchargeWeekly: 563,
    surchargeMonthly: 2250,
    complexityLabel: "Moderate",
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
    weeklyPrice: 5250,
    monthlyPrice: 21000,
    badge: "Complex Chronic Therapy",
    icon: "🎯",
    colorClass: "text-sky-600 border-sky-200/50 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    glowColor: "rgba(14,165,233,0.15)",
    surchargeWeekly: 938,
    surchargeMonthly: 3750,
    complexityLabel: "Moderate–High",
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
    weeklyPrice: 7500,
    monthlyPrice: 30000,
    badge: "Organ System Recovery",
    icon: "🫁",
    colorClass: "text-emerald-600 border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    surchargeWeekly: 1313,
    surchargeMonthly: 5250,
    complexityLabel: "High",
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
    weeklyPrice: 10500,
    monthlyPrice: 42000,
    badge: "Multi-Organ Intensive Care",
    icon: "🔮",
    colorClass: "text-indigo-600 border-indigo-200/50 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    surchargeWeekly: 1688,
    surchargeMonthly: 6750,
    complexityLabel: "Comprehensive",
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
    weeklyPrice: 6250,
    monthlyPrice: 25000,
    badge: "Intensive Daily Supervision",
    icon: "🚨",
    colorClass: "text-rose-600 border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
    glowColor: "rgba(239,68,68,0.15)",
    surchargeWeekly: 1250,
    surchargeMonthly: 5000,
    complexityLabel: "Intensive",
    description: "For urgent, high-intensity acute cases requiring daily tracking, frequent remedy adjustments, and intensive physician study.",
    features: [
      "Daily doctor clinical review and check-ins",
      "Intensive daily remedy titration and support",
      "Emergency/priority WhatsApp communication channel",
      "Detailed case study and Organon-guided repertorization"
    ]
  }
};

export const surchargesLookup = {
  mild: { unitWeekly: 375, unitMonthly: 1500 },
  moderate: { unitWeekly: 563, unitMonthly: 2250 },
  focused: { unitWeekly: 938, unitMonthly: 3750 },
  acute_critical: { unitWeekly: 1250, unitMonthly: 5000 },
  organ: { unitWeekly: 1313, unitMonthly: 5250 },
  comprehensive: { unitWeekly: 1688, unitMonthly: 6750 }
};
