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

const ACUTE_WEEKLY_PRICE = 3_000; // Focused Clinical Care (₹3,000 / wk)
const CONSTITUTIONAL_WEEKLY_PRICE = 6_000; // Integrated Clinical Care (₹6,000 / wk)
const ADVANCED_WEEKLY_PRICE = 9_000; // Complex Clinical Care (₹9,000 / wk)

export const ADDITIONAL_ACUTE_EPISODE_PRICE = 1_000;
export const PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE = 2_000;
export const COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE = 12_000; // Advanced Physician Care (₹12,000 / wk)
export const STANDARD_CARE_PERIOD_DURATIONS = [1, 2, 4, 8, 12] as const;
export const COMPLETE_HEALTH_TRANSFORMATION_DURATIONS = STANDARD_CARE_PERIOD_DURATIONS;

export const CONTINUITY_DISCOUNT_PERCENTAGE = {
  1: 0,
  2: 5,
  4: 10,
  8: 15,
  12: 20,
} as const;

export type ContinuityDurationWeeks = keyof typeof CONTINUITY_DISCOUNT_PERCENTAGE;

export function getContinuityDiscountPercentage(durationWeeks: number): number {
  return CONTINUITY_DISCOUNT_PERCENTAGE[durationWeeks as ContinuityDurationWeeks] ?? 0;
}

/**
 * Calculates the physician-confirmed professional care fee after the public
 * continuity benefit. The helper is unit-agnostic and works for rupees or paise.
 */
export function calculateContinuityCareTotal(unitPrice: number, durationWeeks: number): {
  listTotal: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
} {
  const listTotal = unitPrice * durationWeeks;
  const discountPercent = getContinuityDiscountPercentage(durationWeeks);
  const discountAmount = Math.round(listTotal * (discountPercent / 100));

  return {
    listTotal,
    discountPercent,
    discountAmount,
    total: listTotal - discountAmount,
  };
}

export const PUBLIC_CARE_LEVEL_KEYS: readonly PublicCarePathwayKey[] = [
  "mild",
  "moderate",
  "focused",
] as const;

export const CARE_LEVELS_DETAILS: Record<CareLevelKey, CareLevelDetail> = {
  mild: {
    title: "Focused Clinical Care",
    subtitle: "Coordinated physician care for specific, localized, or early-stage health concerns",
    weeklyPrice: ACUTE_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(ACUTE_WEEKLY_PRICE, 4).total,
    badge: "Focused Care",
    icon: "🌱",
    colorClass: "text-teal-700 border-teal-200/60 bg-teal-50/70",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Focused",
    description: "Coordinated physician care for specific, localized, or early-stage health concerns.",
    scopeMessage: "Single primary health concern or localized follow-up care is included. Confirmed by treating physician.",
    bestFor: ["Single primary health concern", "Localized symptoms", "Focused follow-up care"],
    features: [
      "Physician consultation and clinical assessment",
      "Individualized treatment plan",
      "Routine homeopathic medicines included",
      "Standard follow-up during the care period",
    ],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 1,
    legacyNames: ["Essential Acute & Wellness Care", "Acute & Wellness Care", "Focused Care"],
  },
  moderate: {
    title: "Integrated Clinical Care",
    subtitle: "Comprehensive care managing multiple interrelated systems and constitutional balance",
    weeklyPrice: CONSTITUTIONAL_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(CONSTITUTIONAL_WEEKLY_PRICE, 4).total,
    badge: "Recommended",
    icon: "⚡",
    colorClass: "text-sky-700 border-sky-200/60 bg-sky-50/70",
    glowColor: "rgba(14,165,233,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Integrated",
    description: "Comprehensive care managing multiple interrelated systems and constitutional balance.",
    scopeMessage: "Multiple related health conditions requiring constitutional synthesis are included within agreed scope.",
    bestFor: ["Multiple related health conditions", "Established chronic conditions", "Constitutional care synthesis"],
    features: [
      "Comprehensive constitutional case-taking",
      "Interrelated organ systems evaluation",
      "Personalized treatment planning",
      "Regular progress review & guidance",
    ],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 4,
    legacyNames: ["Core Chronic Care", "Standard Chronic Care", "Constitutional Care"],
  },
  focused: {
    title: "Complex Clinical Care",
    subtitle: "Intensive physician supervision for long-standing, multi-layered pathological conditions",
    weeklyPrice: ADVANCED_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(ADVANCED_WEEKLY_PRICE, 4).total,
    badge: "Complex Care",
    icon: "🎯",
    colorClass: "text-violet-700 border-violet-200/60 bg-violet-50/70",
    glowColor: "rgba(139,92,246,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Complex",
    description: "Intensive physician supervision for long-standing, multi-layered pathological conditions.",
    scopeMessage: "₹9,000/week care fee. Chronic, long-standing, or multi-systemic pathological concerns requiring enhanced supervision.",
    bestFor: ["Chronic multi-systemic conditions", "Long-standing pathological patterns", "Closer planned follow-up"],
    features: [
      "Advanced constitutional & pathological assessment",
      "Clinically relevant conditions within agreed scope",
      "Coordinated multi-system treatment planning",
      "Enhanced physician supervision & follow-up",
    ],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 4,
    pricePrefix: "From",
    clinicianConfirmationRequired: true,
    legacyNames: ["Deep Constitutional Care", "Deep Systemic Care", "Advanced Constitutional Care"],
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
    title: "Advanced Physician Care",
    subtitle: "Our most comprehensive physician-led program for high-complexity cases requiring frequent monitoring",
    weeklyPrice: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE, 4).total,
    badge: "Advanced Care",
    icon: "🔮",
    complexityLabel: "Advanced",
    description: "Close clinical oversight, frequent reviews, and specialized treatment planning for high-complexity cases.",
    scopeMessage: "All clinically relevant conditions within agreed individual scope are included. Close clinical oversight and direct physician supervision.",
    bestFor: ["High-complexity cases", "Frequent physician monitoring & adjustment", "Direct physician supervision"],
    features: ["Comprehensive constitutional assessment", "Individualized care scope", "High-frequency monitoring", "Direct physician guidance"],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 4,
    glowColor: "rgba(245,158,11,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    legacyNames: ["Complete Health Transformation", "Multisystem Integrative Care", "Advanced Physician Care"],
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
    scopeMessage: "Add to Focused Clinical Care for ₹2,000 per week. This is not emergency medical care.",
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
  listCareTotal: number;
  continuityDiscountPercent: number;
  continuityDiscountTotal: number;
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
  const continuity = calculateContinuityCareTotal(detail.weeklyPrice, selection.durationWeeks);
  const baseCareTotal = continuity.total;
  const additionalAcuteEpisodeTotal = isAcute && selection.additionalAcuteEpisode
    ? ADDITIONAL_ACUTE_EPISODE_PRICE
    : 0;
  const priorityAcuteSupportTotal = isAcute && selection.priorityAcuteSupport
    ? PRIORITY_ACUTE_SUPPORT_WEEKLY_PRICE * selection.durationWeeks
    : 0;
  return {
    listCareTotal: continuity.listTotal,
    continuityDiscountPercent: continuity.discountPercent,
    continuityDiscountTotal: continuity.discountAmount,
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
  if (!COMPLETE_HEALTH_TRANSFORMATION_DURATIONS.includes(durationWeeks as 1 | 2 | 4 | 8 | 12)) {
    throw new Error(`Unsupported duration for Advanced Physician Care Program: ${durationWeeks} weeks`);
  }

  const continuity = calculateContinuityCareTotal(COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE, durationWeeks);
  const baseCareTotal = continuity.total;
  return {
    listCareTotal: continuity.listTotal,
    continuityDiscountPercent: continuity.discountPercent,
    continuityDiscountTotal: continuity.discountAmount,
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
  if (clean.includes("advanced physician") || clean.includes("complete") || clean.includes("multisystem")) return "comprehensive";
  if (clean.includes("pathology") || clean.includes("records")) return "organ";
  if (clean.includes("priority") || clean.includes("critical") || clean.includes("intensive acute")) return "acute_critical";
  if (clean.includes("complex") || clean.includes("advanced") || clean.includes("deep") || clean.includes("systemic")) return "focused";
  if (clean.includes("integrated") || clean.includes("constitutional") || clean.includes("chronic") || clean.includes("core") || clean.includes("standard")) return "moderate";
  if (clean.includes("focused clinical") || clean.includes("wellness") || clean.includes("essential") || clean.includes("acute")) return "mild";
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

export function buildGoogleSheetsCareRateFormula(
  careLevelCell = "A4",
): string {
  const rate = (weekly: number) => `${weekly}`;
  const has = (term: string) => `ISNUMBER(SEARCH("${term}", ${careLevelCell}))`;

  return `=IF(OR(${has("Advanced Physician")}, ${has("Complete")}, ${has("Multisystem")}), ${rate(CARE_LEVELS_DETAILS.comprehensive.weeklyPrice)}, IF(OR(${has("Case-Specific")}, ${has("Records")}, ${has("Pathology Support")}), 0, IF(OR(${has("Priority")}, ${has("Critical")}), ${rate(CARE_LEVELS_DETAILS.acute_critical.weeklyPrice)}, IF(OR(${has("Complex Clinical")}, ${has("Advanced Constitutional")}, ${has("Deep")}, ${has("Systemic")}), ${rate(CARE_LEVELS_DETAILS.focused.weeklyPrice)}, IF(OR(${has("Integrated Clinical")}, ${has("Constitutional")}, ${has("Chronic")}, ${has("Core")}), ${rate(CARE_LEVELS_DETAILS.moderate.weeklyPrice)}, IF(OR(${has("Focused Clinical")}, ${has("Wellness")}, ${has("Acute")}, ${has("Essential")}), ${rate(CARE_LEVELS_DETAILS.mild.weeklyPrice)}, 0))))))`;
}

export function buildGoogleSheetsCarePeriodWeeksFormula(
  billingCycleCell = "B4",
  durationCell = "C4",
): string {
  return `IF(${billingCycleCell}="Monthly", ${durationCell}*4, ${durationCell})`;
}

export function buildGoogleSheetsContinuityBenefitFormula(
  listTotalCell = "B10",
  billingCycleCell = "B4",
  durationCell = "C4",
): string {
  const weeks = buildGoogleSheetsCarePeriodWeeksFormula(billingCycleCell, durationCell);
  return `=${listTotalCell}*IF(${weeks}=2, 5%, IF(${weeks}=4, 10%, IF(${weeks}=8, 15%, IF(${weeks}=12, 20%, 0))))`;
}
