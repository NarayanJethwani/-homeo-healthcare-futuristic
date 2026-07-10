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
  legacyNames: string[];
}

export const CARE_LEVELS_DETAILS: Record<"mild" | "moderate" | "focused" | "organ" | "comprehensive" | "acute_critical", CareLevelDetail> = {
  mild: {
    title: "Essential Acute & Wellness Care",
    weeklyPrice: 1500,
    monthlyPrice: 6000,
    badge: "Short-Term Support",
    icon: "🌱",
    colorClass: "text-teal-650 border-teal-200/50 bg-teal-50/50 dark:bg-teal-950/20 dark:text-teal-400",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 375,
    surchargeMonthly: 1500,
    complexityLabel: "Low",
    description: "For short-term symptoms, seasonal complaints, immunity, hair fall, and low-complexity wellness support.",
    features: [
      "General constitutional wellness analysis",
      "Corrective micro-dosing remedy supply",
      "Standard wellness dietary guide sheet",
      "WhatsApp clinical team updates (bi-weekly)"
    ],
    legacyNames: ["Acute & Wellness Care"]
  },
  moderate: {
    title: "Core Chronic Care",
    weeklyPrice: 3000,
    monthlyPrice: 12000,
    badge: "Most Patients Start Here",
    icon: "⚡",
    colorClass: "text-purple-600 border-purple-200/50 bg-purple-50/50 dark:bg-purple-950/20 dark:text-purple-400",
    glowColor: "rgba(168,85,247,0.15)",
    surchargeWeekly: 563,
    surchargeMonthly: 2250,
    complexityLabel: "Moderate",
    description: "For single-system chronic complaints requiring structured follow-up and remedy adjustment.",
    features: [
      "Single chronic condition profile mapping",
      "Targeted constitutional remedy preparation",
      "Anti-inflammatory diet & lifestyle sheets",
      "Standard clinical response monitoring checkups"
    ],
    legacyNames: ["Standard Chronic Care"]
  },
  focused: {
    title: "Deep Constitutional Care",
    weeklyPrice: 5250,
    monthlyPrice: 21000,
    badge: "Deeper Case Analysis",
    icon: "🎯",
    colorClass: "text-sky-600 border-sky-200/50 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    glowColor: "rgba(14,165,233,0.15)",
    surchargeWeekly: 938,
    surchargeMonthly: 3750,
    complexityLabel: "Moderate–High",
    description: "For long-standing, recurring, or layered chronic patterns requiring deeper constitutional analysis.",
    features: [
      "Deep-seated target system pathology analysis",
      "High-potency customized constitutional dilutions",
      "Custom anti-inflammatory & allergen guides",
      "Priority clinical checkins over WhatsApp"
    ],
    legacyNames: ["Deep Systemic Care"]
  },
  organ: {
    title: "Advanced Pathology Support",
    weeklyPrice: 7500,
    monthlyPrice: 30000,
    badge: "Report-Based Monitoring",
    icon: "🫁",
    colorClass: "text-emerald-600 border-emerald-200/50 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    glowColor: "rgba(16,185,129,0.15)",
    surchargeWeekly: 1313,
    surchargeMonthly: 5250,
    complexityLabel: "High",
    description: "For medically diagnosed conditions requiring careful monitoring, report review, and structured clinical follow-up.",
    features: [
      "Multi-remedy support for organ pathology",
      "Advanced systemic rebalancing protocols",
      "Biomarker timeline mapping & reviews",
      "Personalized organ-support lifestyle sheets"
    ],
    legacyNames: ["Advanced Pathological Care"]
  },
  comprehensive: {
    title: "Multisystem Integrative Care",
    weeklyPrice: 10500,
    monthlyPrice: 42000,
    badge: "Best for Complex Cases",
    icon: "🔮",
    colorClass: "text-indigo-600 border-indigo-200/50 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
    glowColor: "rgba(99,102,241,0.15)",
    surchargeWeekly: 1688,
    surchargeMonthly: 6750,
    complexityLabel: "Comprehensive",
    description: "For complex cases involving multiple body systems, multiple active concerns, and higher clinical coordination.",
    features: [
      "Multi-organ pathogenetic profile mapping",
      "Direct clinical supervision by Dr. Jethwani",
      "High-frequency dosage titrations & reviews",
      "Direct priority clinical assistance channel"
    ],
    legacyNames: ["Multisystem Integrative Care"]
  },
  acute_critical: {
    title: "Intensive Acute Priority Care",
    weeklyPrice: 6250,
    monthlyPrice: 25000,
    badge: "Priority Acute Support",
    icon: "🚨",
    colorClass: "text-rose-600 border-rose-200/50 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
    glowColor: "rgba(239,68,68,0.15)",
    surchargeWeekly: 1250,
    surchargeMonthly: 5000,
    complexityLabel: "Intensive",
    description: "For suitable acute cases requiring priority homeopathic support and closer short-term follow-up. Not a replacement for emergency medical care, hospitalization, or life-saving treatment. In emergencies, seek immediate medical attention.",
    features: [
      "Daily doctor clinical review and check-ins",
      "Intensive daily remedy titration and support",
      "Emergency/priority WhatsApp communication channel",
      "Detailed case study and Organon-guided repertorization"
    ],
    legacyNames: ["Acute Critical Care"]
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

export type CareLevelKey = "mild" | "moderate" | "focused" | "organ" | "comprehensive" | "acute_critical";

export function normalizeCareLevelName(input: string): CareLevelKey {
  if (!input) return "moderate";
  const clean = input.toLowerCase().trim();
  
  if (clean === "mild" || clean === "moderate" || clean === "focused" || clean === "organ" || clean === "comprehensive" || clean === "acute_critical") {
    return clean as CareLevelKey;
  }
  
  if (clean.includes("critical") || clean.includes("emergency") || clean.includes("intensive") || clean.includes("priority")) {
    return "acute_critical";
  }
  if (clean.includes("wellness") || clean.includes("essential") || clean.includes("mild") || clean.includes("acute")) {
    return "mild";
  }
  if (clean.includes("standard") || clean.includes("chronic") || clean.includes("core")) {
    return "moderate";
  }
  if (clean.includes("deep") || clean.includes("systemic") || clean.includes("constitutional") || clean.includes("focused")) {
    return "focused";
  }
  if (clean.includes("organ") || clean.includes("advanced") || clean.includes("pathology") || clean.includes("pathological")) {
    return "organ";
  }
  if (clean.includes("comprehensive") || clean.includes("multisystem") || clean.includes("integrative")) {
    return "comprehensive";
  }
  
  return "moderate";
}

export function getCareLevelDisplayName(keyOrName: string): string {
  const key = normalizeCareLevelName(keyOrName);
  return CARE_LEVELS_DETAILS[key].title;
}

export function getCareLevelDisplayNameWithIcon(keyOrName: string): string {
  const key = normalizeCareLevelName(keyOrName);
  const detail = CARE_LEVELS_DETAILS[key];
  return `${detail.icon} ${detail.title}`;
}
