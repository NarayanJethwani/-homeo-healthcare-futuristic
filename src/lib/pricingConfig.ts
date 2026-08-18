export type CareLevelKey =
  | "mild"
  | "chronic_focused"
  | "moderate"
  | "focused"
  | "organ"
  | "comprehensive"
  | "acute_critical";

export type PublicCarePathwayKey = "mild" | "chronic_focused" | "moderate" | "focused";

export const CARE_PLAN_CATALOG_VERSION = "care-plan-catalog-v3";

export type CarePlanId =
  | "acute_mild_3d"
  | "acute_wellness_7d"
  | "chronic_focused_1w"
  | "chronic_integrated_1w"
  | "chronic_complex_1w"
  | "chronic_advanced_1w";

export type CarePlanFamily = "acute" | "chronic";
export type CarePlanDurationUnit = "day" | "week";

export interface CarePlanDefinition {
  id: CarePlanId;
  family: CarePlanFamily;
  title: string;
  price: number;
  durationValue: number;
  durationUnit: CarePlanDurationUnit;
  legacyCareLevelKey: Extract<CareLevelKey, "mild" | "chronic_focused" | "moderate" | "focused" | "comprehensive">;
  scope: string;
  reassessmentRequired: boolean;
  emergencyCare: false;
}

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

const ACUTE_WELLNESS_WEEKLY_PRICE = 2_000; // Acute Wellness Care (from ₹2,000 / wk)
const CHRONIC_FOCUSED_WEEKLY_PRICE = 3_000; // Focused Clinical Care (₹3,000 / wk)
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
  "chronic_focused",
  "moderate",
  "focused",
] as const;

export const CARE_PLAN_CATALOG: Record<CarePlanId, CarePlanDefinition> = {
  acute_mild_3d: {
    id: "acute_mild_3d",
    family: "acute",
    title: "Mild Acute Care",
    price: 1_000,
    durationValue: 3,
    durationUnit: "day",
    legacyCareLevelKey: "mild",
    scope: "Short physician-reviewed support for one suitable mild, non-emergency acute concern.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
  acute_wellness_7d: {
    id: "acute_wellness_7d",
    family: "acute",
    title: "Acute Wellness Care",
    price: 2_000,
    durationValue: 7,
    durationUnit: "day",
    legacyCareLevelKey: "mild",
    scope: "Seven-day physician-reviewed support for a suitable non-emergency acute concern.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
  chronic_focused_1w: {
    id: "chronic_focused_1w",
    family: "chronic",
    title: "Focused Clinical Care",
    price: 3_000,
    durationValue: 1,
    durationUnit: "week",
    legacyCareLevelKey: "chronic_focused",
    scope: "Focused physician-led care for one defined, non-emergency concern requiring a weekly care period.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
  chronic_integrated_1w: {
    id: "chronic_integrated_1w",
    family: "chronic",
    title: "Integrated Chronic Care",
    price: 6_000,
    durationValue: 1,
    durationUnit: "week",
    legacyCareLevelKey: "moderate",
    scope: "Integrated physician-led care for related chronic concerns requiring closer review.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
  chronic_complex_1w: {
    id: "chronic_complex_1w",
    family: "chronic",
    title: "Complex Chronic Care",
    price: 9_000,
    durationValue: 1,
    durationUnit: "week",
    legacyCareLevelKey: "focused",
    scope: "Enhanced physician supervision for complex chronic care within an agreed scope.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
  chronic_advanced_1w: {
    id: "chronic_advanced_1w",
    family: "chronic",
    title: "Advanced Chronic Care",
    price: 12_000,
    durationValue: 1,
    durationUnit: "week",
    legacyCareLevelKey: "comprehensive",
    scope: "Advanced physician-led care with frequent monitoring for high-workload chronic cases.",
    reassessmentRequired: true,
    emergencyCare: false,
  },
};

export const CARE_PLAN_IDS = Object.keys(CARE_PLAN_CATALOG) as CarePlanId[];

export function getCarePlan(planId: CarePlanId): CarePlanDefinition {
  return CARE_PLAN_CATALOG[planId];
}

export function formatCarePlanDuration(plan: Pick<CarePlanDefinition, "durationValue" | "durationUnit">): string {
  return `${plan.durationValue} ${plan.durationValue === 1 ? plan.durationUnit : `${plan.durationUnit}s`}`;
}

export function calculateCarePlanTotal(planId: CarePlanId, chronicDurationWeeks = 1) {
  const plan = getCarePlan(planId);
  if (plan.family === "acute") {
    if (chronicDurationWeeks !== 1) throw new Error(`${plan.title} is a fixed ${formatCarePlanDuration(plan)} plan`);
    return { listTotal: plan.price, discountPercent: 0, discountAmount: 0, total: plan.price };
  }
  if (!STANDARD_CARE_PERIOD_DURATIONS.includes(chronicDurationWeeks as ContinuityDurationWeeks)) {
    throw new Error(`Unsupported duration for ${plan.title}: ${chronicDurationWeeks} weeks`);
  }
  return calculateContinuityCareTotal(plan.price, chronicDurationWeeks);
}

export const CARE_LEVELS_DETAILS: Record<CareLevelKey, CareLevelDetail> = {
  mild: {
    title: "Acute Wellness Care",
    subtitle: "Short, physician-reviewed support for suitable non-emergency acute concerns and focused wellness follow-up",
    weeklyPrice: ACUTE_WELLNESS_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(ACUTE_WELLNESS_WEEKLY_PRICE, 4).total,
    badge: "Starts at ₹2,000/week",
    icon: "🌱",
    colorClass: "text-teal-700 border-teal-200/60 bg-teal-50/70",
    glowColor: "rgba(20,184,166,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Acute & wellness",
    description: "Short, physician-reviewed support for suitable non-emergency acute concerns and focused wellness follow-up.",
    scopeMessage: "Starts at ₹2,000 per week for one physician-confirmed, non-emergency acute concern or a focused wellness follow-up. Red flags require urgent assessment or referral before a plan or quotation is created.",
    bestFor: ["Suitable non-emergency acute concerns", "One focused wellness goal", "Short physician-reviewed follow-up"],
    features: [
      "Physician consultation and clinical assessment",
      "Individualized treatment plan",
      "Documented safety and red-flag review",
      "Standard follow-up during the confirmed care period",
    ],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 1,
    legacyNames: ["Essential Acute & Wellness Care", "Acute & Wellness Care"],
    pricePrefix: "From",
  },
  chronic_focused: {
    title: "Focused Clinical Care",
    subtitle: "Focused physician-led care for one defined subacute, acute-transition, or chronic concern",
    weeklyPrice: CHRONIC_FOCUSED_WEEKLY_PRICE,
    monthlyPrice: calculateContinuityCareTotal(CHRONIC_FOCUSED_WEEKLY_PRICE, 4).total,
    badge: "Focused",
    icon: "🌿",
    colorClass: "text-emerald-700 border-emerald-200/60 bg-emerald-50/70",
    glowColor: "rgba(16,185,129,0.15)",
    surchargeWeekly: 0,
    surchargeMonthly: 0,
    complexityLabel: "Focused clinical",
    description: "Focused physician-led care for one defined, non-emergency concern requiring standard weekly follow-up.",
    scopeMessage: "₹3,000 per week for a physician-confirmed focused clinical care period. Suitable cases may be subacute, transitioning from acute care, or chronic.",
    bestFor: ["One defined non-emergency concern", "Subacute, acute-transition, or chronic care", "Standard scheduled follow-up"],
    features: ["Physician assessment", "Documented care scope", "Individualized plan", "Scheduled reassessment"],
    durations: STANDARD_CARE_PERIOD_DURATIONS,
    defaultDurationWeeks: 1,
    legacyNames: ["Focused Chronic Care", "Focused Care"],
    clinicianConfirmationRequired: true,
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
    scopeMessage: "Optional physician-assigned support alongside Acute Wellness Care for ₹2,000 per week. This is not emergency medical care and is never added automatically.",
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
  chronic_focused: { unitWeekly: 0, unitMonthly: 0 },
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

  if (["mild", "chronic_focused", "moderate", "focused", "organ", "comprehensive", "acute_critical"].includes(clean)) {
    return clean as CareLevelKey;
  }
  if (clean.includes("advanced physician") || clean.includes("advanced chronic") || clean.includes("complete") || clean.includes("multisystem")) return "comprehensive";
  if (clean.includes("pathology") || clean.includes("records")) return "organ";
  if (clean.includes("priority") || clean.includes("critical") || clean.includes("intensive acute")) return "acute_critical";
  if (clean.includes("complex") || clean.includes("advanced") || clean.includes("deep") || clean.includes("systemic")) return "focused";
  if (clean.includes("focused chronic") || clean.includes("focused clinical") || clean === "focused care") return "chronic_focused";
  if (clean.includes("integrated") || clean.includes("constitutional") || clean.includes("core") || clean.includes("standard chronic")) return "moderate";
  if (clean.includes("wellness") || clean.includes("essential") || clean.includes("acute")) return "mild";
  return "moderate";
}

export function toPublicCarePathway(input: string): PublicCarePathwayKey {
  const normalized = normalizeCareLevelName(input);
  if (normalized === "mild") return "mild";
  if (normalized === "chronic_focused") return "chronic_focused";
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

  return `=IF(OR(${has("Advanced Physician")}, ${has("Advanced Chronic")}, ${has("Complete")}, ${has("Multisystem")}), ${rate(CARE_LEVELS_DETAILS.comprehensive.weeklyPrice)}, IF(OR(${has("Case-Specific")}, ${has("Records")}, ${has("Pathology Support")}), 0, IF(OR(${has("Priority")}, ${has("Critical")}), ${rate(CARE_LEVELS_DETAILS.acute_critical.weeklyPrice)}, IF(OR(${has("Complex Clinical")}, ${has("Complex Chronic")}, ${has("Advanced Constitutional")}, ${has("Deep")}, ${has("Systemic")}), ${rate(CARE_LEVELS_DETAILS.focused.weeklyPrice)}, IF(OR(${has("Integrated Clinical")}, ${has("Integrated Chronic")}, ${has("Constitutional")}, ${has("Core")}), ${rate(CARE_LEVELS_DETAILS.moderate.weeklyPrice)}, IF(OR(${has("Focused Chronic")}, ${has("Focused Clinical")}), ${rate(CARE_LEVELS_DETAILS.chronic_focused.weeklyPrice)}, IF(OR(${has("Acute Wellness")}, ${has("Mild Acute")}, ${has("Wellness")}, ${has("Acute")}, ${has("Essential")}), ${rate(CARE_LEVELS_DETAILS.mild.weeklyPrice)}, 0)))))))`;
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
