export type CareLevelKey =
  | "mild"
  | "moderate"
  | "focused"
  | "organ"
  | "comprehensive"
  | "acute_critical";

export type PublicCarePathwayKey = "mild" | "moderate" | "focused";

export interface CareLevelDetail {
  title: string;
  subtitle?: string;
  weeklyPrice: number;
  monthlyPrice: number;
  badge: string;
  icon: string;
  complexityLabel: string;
  description: string;
  scopeMessage: string;
  bestFor: string[];
  features: string[];
  durations: readonly number[];
  defaultDurationWeeks: number;
  glowColor: string;
  surchargeWeekly: number;
  surchargeMonthly: number;
  colorClass?: string;
  legacyNames: string[];
  pricePrefix?: "From";
  clinicianConfirmationRequired?: boolean;
}

const ACUTE_WEEKLY_PRICE = 2_000;
const CONSTITUTIONAL_WEEKLY_PRICE = 3_000;
const ADVANCED_WEEKLY_PRICE = 5_000;

export const ADDITIONAL_ACUTE_EPISODE_PRICE = 1_000;
export const PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE = 2_000;
export const COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE = 10_000;
export const COMPLETE_HEALTH_TRANSFORMATION_DURATIONS = [2, 4, 8, 12] as const;

export const PUBLIC_CARE_LEVEL_KEYS: readonly PublicCarePathwayKey[] = [
  "mild",
  "moderate",
  "focused",
] as const;

export const CARE_LEVELS_DETAILS: Record<CareLevelKey, CareLevelDetail> = {
  mild: {
    title: "Acute & Wellness Care",
    weeklyPrice: ACUTE_WEEKLY_PRICE,
    monthlyPrice: ACUTE_WEEKLY_PRICE * 4,
    badge: "Short-term care",
    icon: "🌱",
    colorClass: "text-teal-700 border-teal-200/60 bg-teal-50/70",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Focused",
    description: "For a new, short-term illness or one acute episode needing timely physician guidance.",
    scopeMessage: "One acute episode is included. A separate, unrelated acute episode during the same care period can be assessed for ₹1,000.",
    bestFor: ["New or short-term symptoms", "Seasonal illness", "One acute episode"],
    features: [
      "Physician consultation and clinical assessment",
      "Individualized treatment plan",
      "One acute episode within the selected period",
      "Standard follow-up during the care period",
    ],
    durations: [1, 2, 4],
    defaultDurationWeeks: 1,
    legacyNames: ["Essential Acute & Wellness Care", "Acute & Wellness Care"],
  },
  moderate: {
    title: "Constitutional Care",
    subtitle: "Personalized care for chronic and recurring health conditions",
    weeklyPrice: CONSTITUTIONAL_WEEKLY_PRICE,
    monthlyPrice: CONSTITUTIONAL_WEEKLY_PRICE * 4,
    badge: "Recommended",
    icon: "⚡",
    colorClass: "text-purple-700 border-purple-200/60 bg-purple-50/70",
    glowColor: "rgba(168,85,247,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Ongoing",
    description: "For chronic or recurring symptoms that benefit from a whole-person constitutional case assessment.",
    scopeMessage: "Clinically related symptoms are considered together within the constitutional case. There is no automatic per-symptom charge.",
    bestFor: ["Recurring symptoms", "Established chronic conditions", "Related constitutional symptoms"],
    features: [
      "Comprehensive constitutional case-taking",
      "Clinically related symptoms included",
      "Personalized treatment planning",
      "Regular progress review",
    ],
    durations: [2, 4, 8, 12],
    defaultDurationWeeks: 4,
    legacyNames: ["Core Chronic Care", "Standard Chronic Care"],
  },
  focused: {
    title: "Advanced Constitutional Care",
    weeklyPrice: ADVANCED_WEEKLY_PRICE,
    monthlyPrice: ADVANCED_WEEKLY_PRICE * 4,
    badge: "Physician-guided scope",
    icon: "🎯",
    colorClass: "text-sky-700 border-sky-200/60 bg-sky-50/70",
    glowColor: "rgba(14,165,233,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Advanced",
    description: "For stable, long-standing, or layered cases requiring deeper review and closer planned follow-up.",
    scopeMessage: "₹5,000/week is the starting care fee. Clinically relevant conditions are included within the agreed scope, with no automatic symptom or organ-system charge. Any advanced records review is shown separately before treatment.",
    bestFor: ["Stable complex conditions", "Long-standing patterns", "Closer planned follow-up"],
    features: [
      "Advanced constitutional assessment",
      "Clinically relevant conditions within agreed scope",
      "Coordinated treatment planning",
      "Enhanced physician follow-up",
    ],
    durations: [2, 4, 8, 12],
    defaultDurationWeeks: 4,
    pricePrefix: "From",
    clinicianConfirmationRequired: true,
    legacyNames: ["Deep Constitutional Care", "Deep Systemic Care", "Advanced Recovery"],
  },
  organ: {
    title: "Case-Specific Clinical Support",
    weeklyPrice: 0,
    monthlyPrice: 0,
    badge: "Physician-assigned",
    icon: "🫁",
    complexityLabel: "Assessment",
    description: "Additional physician work assigned only when a case needs support beyond the confirmed pathway scope.",
    scopeMessage: "The physician may quote additional support for extended records review, closer monitoring, care coordination, or specially prescribed medicines. Nothing is added automatically.",
    bestFor: ["Extended records review", "Closer monitoring", "Care coordination"],
    features: ["Itemized clinical scope", "Doctor-entered fee", "Patient approval before billing", "No automatic surcharge"],
    durations: [1],
    defaultDurationWeeks: 1,
    glowColor: "rgba(16,185,129,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    legacyNames: ["Advanced Pathology Support", "Advanced Pathological Care", "Advanced Records & Pathology Review"],
    clinicianConfirmationRequired: true,
  },
  comprehensive: {
    title: "Complete Health Transformation Program",
    weeklyPrice: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
    monthlyPrice: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE * 4,
    badge: "Clinician-assigned",
    icon: "🔮",
    complexityLabel: "Comprehensive",
    description: "Our most comprehensive individual program for exceptionally intensive cases requiring frequent review, coordinated adjustments, and direct physician supervision.",
    scopeMessage: "All clinically relevant conditions within the agreed individual scope are included. Duration is assigned only after physician assessment; outcomes depend on individual clinical response.",
    bestFor: ["Exceptionally intensive cases", "Frequent clinical adjustments", "Direct physician supervision"],
    features: ["Comprehensive constitutional assessment", "Individualized care scope", "High-frequency monitoring", "Direct physician guidance"],
    durations: [2, 4, 8, 12],
    defaultDurationWeeks: 2,
    glowColor: "rgba(99,102,241,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    legacyNames: ["Complete Health Transformation", "Multisystem Integrative Care"],
    clinicianConfirmationRequired: true,
  },
  acute_critical: {
    title: "Priority Acute Support",
    weeklyPrice: PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE,
    monthlyPrice: PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE * 4,
    badge: "Care add-on",
    icon: "🚨",
    complexityLabel: "Priority",
    description: "Faster access and closer short-term monitoring for suitable acute cases.",
    scopeMessage: "Add to Acute & Wellness Care for ₹2,000 per week. This is not emergency medical care.",
    bestFor: ["Priority appointment access", "Closer short-term monitoring", "Suitable acute cases"],
    features: ["Priority access", "Defined response window", "Closer monitoring", "Physician-directed use"],
    durations: [1, 2, 4],
    defaultDurationWeeks: 1,
    glowColor: "rgba(239,68,68,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    legacyNames: ["Intensive Acute Priority Care", "Acute Critical Care"],
    clinicianConfirmationRequired: true,
  },
};

export const surchargesLookup: Record<CareLevelKey, { unitWeekly: number; unitMonthly: number }> = {
  mild: { unitWeekly: 0, unitMonthly: 0 },
  moderate: { unitWeekly: 0, unitMonthly: 0 },
  focused: { unitWeekly: 0, unitMonthly: 0 },
  organ: { unitWeekly: 0, unitMonthly: 0 },
  comprehensive: { unitWeekly: 0, unitMonthly: 0 },
  acute_critical: { unitWeekly: 0, unitMonthly: 0 },
};

export interface CarePriceSelection {
  pathway: PublicCarePathwayKey;
  durationWeeks: number;
  additionalAcuteEpisode?: boolean;
  priorityAcuteSupport?: boolean;
}

export interface CarePriceSummary {
  baseCareTotal: number;
  additionalAcuteEpisodeTotal: number;
  priorityAcuteSupportTotal: number;
  total: number;
}

export function calculateCarePrice(selection: CarePriceSelection): CarePriceSummary {
  const detail = CARE_LEVELS_DETAILS[selection.pathway];
  if (!detail.durations.includes(selection.durationWeeks)) {
    throw new Error(`Unsupported duration for ${detail.title}: ${selection.durationWeeks} weeks`);
  }

  const isAcute = selection.pathway === "mild";
  const baseCareTotal = detail.weeklyPrice * selection.durationWeeks;
  const additionalAcuteEpisodeTotal = isAcute && selection.additionalAcuteEpisode
    ? ADDITIONAL_ACUTE_EPISODE_PRICE
    : 0;
  const priorityAcuteSupportTotal = isAcute && selection.priorityAcuteSupport
    ? PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE * selection.durationWeeks
    : 0;
  return {
    baseCareTotal,
    additionalAcuteEpisodeTotal,
    priorityAcuteSupportTotal,
    total:
      baseCareTotal +
      additionalAcuteEpisodeTotal +
      priorityAcuteSupportTotal,
  };
}

export function calculateCompleteHealthTransformationPrice(durationWeeks: number): CarePriceSummary {
  if (!COMPLETE_HEALTH_TRANSFORMATION_DURATIONS.includes(durationWeeks as 2 | 4 | 8 | 12)) {
    throw new Error(`Unsupported duration for Complete Health Transformation Program: ${durationWeeks} weeks`);
  }

  const baseCareTotal = COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE * durationWeeks;
  return {
    baseCareTotal,
    additionalAcuteEpisodeTotal: 0,
    priorityAcuteSupportTotal: 0,
    total: baseCareTotal,
  };
}

export function normalizeCareLevelName(input: string): CareLevelKey {
  if (!input) return "moderate";
  const clean = input.toLowerCase().trim();

  if (["mild", "moderate", "focused", "organ", "comprehensive", "acute_critical"].includes(clean)) {
    return clean as CareLevelKey;
  }
  if (clean.includes("complete") || clean.includes("multisystem") || clean.includes("integrative")) return "comprehensive";
  if (clean.includes("pathology") || clean.includes("records")) return "organ";
  if (clean.includes("priority") || clean.includes("critical") || clean.includes("intensive acute")) return "acute_critical";
  if (clean.includes("advanced") || clean.includes("deep") || clean.includes("systemic")) return "focused";
  if (clean.includes("constitutional") || clean.includes("chronic") || clean.includes("core") || clean.includes("standard")) return "moderate";
  if (clean.includes("wellness") || clean.includes("essential") || clean.includes("acute")) return "mild";
  return "moderate";
}

export function toPublicCarePathway(input: string): PublicCarePathwayKey {
  const normalized = normalizeCareLevelName(input);
  if (normalized === "mild") return "mild";
  if (normalized === "moderate") return "moderate";
  return "focused";
}

export function getCareLevelDisplayName(keyOrName: string): string {
  return CARE_LEVELS_DETAILS[normalizeCareLevelName(keyOrName)].title;
}

export function getCareLevelDisplayNameWithIcon(keyOrName: string): string {
  const detail = CARE_LEVELS_DETAILS[normalizeCareLevelName(keyOrName)];
  return `${detail.icon} ${detail.title}`;
}
