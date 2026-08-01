export interface SpecialtyPriceRange {
  minimum: number;
  maximum: number;
}

export interface SpecialtyProgram {
  id: string;
  title: string;
  priceRange: SpecialtyPriceRange;
  description: string;
  features: readonly string[];
  durationLabel: string;
  badge?: string;
  accent: "rose" | "emerald" | "teal" | "lime" | "amber" | "indigo" | "orange" | "cyan" | "purple";
}

export interface SpecialtyAssessmentRequest {
  kind: "clinical-assessment";
  paymentAllowed: false;
  programId: string;
  title: string;
  priceRange: SpecialtyPriceRange;
  durationText: "Physician-recommended after assessment";
}

export const SPECIALTY_PROGRAMS: readonly SpecialtyProgram[] = [
  {
    id: "heart-care",
    title: "Supportive Heart Care",
    priceRange: { minimum: 6_000, maximum: 10_000 },
    description: "Supportive care for people managing hypertension, cardiac palpitations, or lipid concerns alongside conventional medical care.",
    features: ["Cardiovascular symptom review", "Blood-pressure and lipid tracking", "Lifestyle guidance", "Coordination with the treating cardiologist"],
    durationLabel: "Chronic care support",
    accent: "rose",
  },
  {
    id: "diabease",
    title: "DiabEaseCare Program",
    priceRange: { minimum: 6_000, maximum: 10_000 },
    description: "Supportive constitutional care for people managing diabetes and related symptoms alongside standard medical treatment.",
    features: ["Metabolic symptom review", "Neuropathy symptom monitoring", "HbA1c progress tracking", "Lifestyle and foot-care guidance"],
    durationLabel: "Chronic care support",
    accent: "emerald",
  },
  {
    id: "hair-care",
    title: "Homeo Hair Care",
    priceRange: { minimum: 6_000, maximum: 10_000 },
    description: "Constitutional assessment for alopecia, chronic dandruff, and stress- or hormone-associated hair concerns.",
    features: ["Scalp and hair-history assessment", "Constitutional case review", "Hormonal and thyroid history review", "Personalized hair-care guidance"],
    durationLabel: "Hair vitality support",
    accent: "teal",
  },
  {
    id: "cancer-care",
    title: "Supportive Cancer Care Services",
    priceRange: { minimum: 9_000, maximum: 75_000 },
    description: "Adjunctive symptom and wellbeing support during conventional oncology treatment; not a replacement for oncology care.",
    features: ["Treatment-side-effect symptom review", "Appetite and wellbeing support", "Close clinical monitoring", "Coordination with the treating oncology team"],
    durationLabel: "Oncology support",
    badge: "Clinical specialty",
    accent: "lime",
  },
  {
    id: "pediatric-care",
    title: "Homeo Pediatric Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Child-focused constitutional assessment for recurring respiratory, skin, digestive, and general wellbeing concerns.",
    features: ["Child-friendly case-taking", "Growth and development history", "Recurring-symptom tracking", "Parent guidance and follow-up"],
    durationLabel: "Pediatric wellness support",
    accent: "amber",
  },
  {
    id: "hypertension",
    title: "Supportive Hypertension Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Supportive care for blood-pressure symptoms and lifestyle factors alongside physician-prescribed treatment.",
    features: ["Blood-pressure profile review", "Stress and sleep assessment", "Symptom monitoring", "Cardiovascular lifestyle guidance"],
    durationLabel: "Blood-pressure support",
    accent: "indigo",
  },
  {
    id: "joints-care",
    title: "Homeo Joints Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Constitutional assessment and symptom support for arthritis, gout, stiffness, and mobility concerns.",
    features: ["Pain and stiffness assessment", "Mobility tracking", "Relevant report review", "Personalized activity guidance"],
    durationLabel: "Joint mobility support",
    accent: "orange",
  },
  {
    id: "skin-care",
    title: "Homeo Skin Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Constitutional assessment for psoriasis, chronic eczema, hives, vitiligo, and recurring skin concerns.",
    features: ["Skin-history assessment", "Trigger and treatment review", "Progress photography guidance", "Coordinated follow-up"],
    durationLabel: "Dermatology support",
    accent: "teal",
  },
  {
    id: "lungs-care",
    title: "Homeo Lungs Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Supportive constitutional care for recurring respiratory and allergy symptoms alongside appropriate medical treatment.",
    features: ["Respiratory-history assessment", "Allergy trigger review", "Symptom and report tracking", "Safety-focused follow-up"],
    durationLabel: "Respiratory support",
    accent: "cyan",
  },
  {
    id: "digestive-care",
    title: "Homeo Digestive Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Constitutional assessment for IBS, reflux, constipation, and recurring digestive symptoms.",
    features: ["Digestive symptom timeline", "Diet and trigger review", "Relevant report assessment", "Bowel-pattern tracking"],
    durationLabel: "Digestive health support",
    accent: "emerald",
  },
  {
    id: "neuro-care",
    title: "Homeo Neuro Care",
    priceRange: { minimum: 6_000, maximum: 20_000 },
    description: "Supportive constitutional care for recurring headaches, neuralgia symptoms, sleep disturbance, and fatigue.",
    features: ["Neurological symptom history", "Headache and sleep tracking", "Medication and report review", "Safety-focused follow-up"],
    durationLabel: "Neurological symptom support",
    accent: "purple",
  },
] as const;

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function formatSpecialtyPriceRange(range: SpecialtyPriceRange): string {
  return `${formatPrice(range.minimum)}–${formatPrice(range.maximum)}`;
}

export function createSpecialtyAssessmentRequest(program: SpecialtyProgram): SpecialtyAssessmentRequest {
  if (!Number.isFinite(program.priceRange.minimum) || !Number.isFinite(program.priceRange.maximum)) {
    throw new Error(`Invalid specialty price range for ${program.id}`);
  }
  if (program.priceRange.minimum < 0 || program.priceRange.maximum < program.priceRange.minimum) {
    throw new Error(`Invalid specialty price range for ${program.id}`);
  }

  return {
    kind: "clinical-assessment",
    paymentAllowed: false,
    programId: program.id,
    title: program.title,
    priceRange: { ...program.priceRange },
    durationText: "Physician-recommended after assessment",
  };
}
