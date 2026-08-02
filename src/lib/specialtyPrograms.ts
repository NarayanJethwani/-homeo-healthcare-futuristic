import {
  COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
  CARE_LEVELS_DETAILS,
} from "@/lib/pricingConfig";
import type { OrganSystemBreadth } from "@/components/PatientPricingPlanner";

export type SpecialtyAccent =
  | "rose"
  | "emerald"
  | "teal"
  | "lime"
  | "amber"
  | "indigo"
  | "orange"
  | "cyan"
  | "purple";

export type SpecialtyTierKey = "constitutional" | "advanced" | "complete";

export interface SpecialtySupportTier {
  key: SpecialtyTierKey;
  title: string;
  weeklyPrice: number;
  durations: readonly number[];
  assignmentGuidance: string;
}

export interface SpecialtyClinicalArea {
  id: string;
  title: string;
  specialties: readonly string[];
  description: string;
  conditions: readonly string[];
  supportBoundary: string;
  urgentBoundary?: string;
  allowedTierKeys: readonly SpecialtyTierKey[];
  badge?: string;
  accent: SpecialtyAccent;
}

export interface SpecialtySelection {
  areaId: string;
  condition: string;
  organSystemBreadth: OrganSystemBreadth;
}

export interface SpecialtyAssessmentRequest {
  kind: "clinical-assessment";
  paymentAllowed: false;
  areaId: string;
  title: string;
  condition: string;
  organSystemBreadth: OrganSystemBreadth;
  allowedTierKeys: readonly SpecialtyTierKey[];
  durationText: "Physician-recommended after assessment";
}

export const SPECIALTY_SUPPORT_TIERS: Record<SpecialtyTierKey, SpecialtySupportTier> = {
  constitutional: {
    key: "constitutional",
    title: "Constitutional Specialty Support",
    weeklyPrice: CARE_LEVELS_DETAILS.moderate.weeklyPrice,
    durations: [2, 4, 8, 12],
    assignmentGuidance: "Stable chronic or recurring concerns needing planned constitutional follow-up.",
  },
  advanced: {
    key: "advanced",
    title: "Advanced Specialty Support",
    weeklyPrice: CARE_LEVELS_DETAILS.focused.weeklyPrice,
    durations: [2, 4, 8, 12],
    assignmentGuidance: "Layered or long-standing cases needing deeper review and closer monitoring.",
  },
  complete: {
    key: "complete",
    title: "Complete Health Transformation",
    weeklyPrice: COMPLETE_HEALTH_TRANSFORMATION_WEEKLY_PRICE,
    durations: [2, 4, 8, 12],
    assignmentGuidance: "Exceptionally intensive cases needing frequent review and direct physician supervision.",
  },
};

const STANDARD_TIERS: readonly SpecialtyTierKey[] = ["constitutional", "advanced", "complete"];
const HIGH_COORDINATION_TIERS: readonly SpecialtyTierKey[] = ["advanced", "complete"];

export const SPECIALTY_CLINICAL_AREAS: readonly SpecialtyClinicalArea[] = [
  {
    id: "heart-circulation",
    title: "Heart & Circulation Support",
    specialties: ["Cardiology"],
    description: "Supportive constitutional care for stable cardiovascular symptoms and risk-factor wellbeing alongside prescribed medical care.",
    conditions: ["Hypertension", "Stable palpitations", "Lipid concerns", "Circulation symptoms", "Post-cardiac-event wellbeing"],
    supportBoundary: "Prescribed cardiovascular medicines and cardiology follow-up continue unless the treating physician changes them.",
    urgentBoundary: "Chest pain, fainting, severe breathlessness, new weakness, or suspected stroke requires emergency assessment.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "rose",
  },
  {
    id: "hormones-metabolism",
    title: "Hormones & Metabolism Support",
    specialties: ["Endocrinology"],
    description: "Constitutional support for metabolic and hormonal symptom patterns alongside standard monitoring and treatment.",
    conditions: ["Diabetes wellbeing", "Thyroid disorders", "Metabolic concerns", "Weight-related symptoms", "PCOS-related symptoms"],
    supportBoundary: "This program does not replace insulin, thyroid medicine, glucose monitoring, or endocrinology care.",
    urgentBoundary: "Severe high or low glucose symptoms, confusion, dehydration, or breathing difficulty requires urgent medical care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "emerald",
  },
  {
    id: "digestive-liver",
    title: "Digestive & Liver Support",
    specialties: ["Gastroenterology", "Hepatology"],
    description: "Whole-person assessment for recurring digestive, bowel, and stable liver-related symptom patterns.",
    conditions: ["GERD or reflux", "Gastritis", "Irritable bowel syndrome", "Constipation", "Bloating", "Fatty-liver wellbeing"],
    supportBoundary: "Endoscopy, imaging, liver monitoring, and specialist treatment remain essential when medically indicated.",
    urgentBoundary: "Vomiting blood, black stools, jaundice, severe abdominal pain, or unexplained weight loss requires prompt medical assessment.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "emerald",
  },
  {
    id: "lungs-breathing",
    title: "Lungs & Breathing Support",
    specialties: ["Pulmonology"],
    description: "Support for recurring respiratory symptoms alongside inhalers, investigations, and respiratory specialist care when prescribed.",
    conditions: ["Asthma symptom support", "Recurring bronchitis", "Chronic cough", "Wheeze", "Post-infection respiratory recovery"],
    supportBoundary: "Do not stop inhalers or prescribed respiratory medicines without the treating physician.",
    urgentBoundary: "Severe breathlessness, blue lips, low oxygen, chest pain, or inability to speak normally is an emergency.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "cyan",
  },
  {
    id: "allergy-immunity",
    title: "Allergy & Immune Support",
    specialties: ["Immunology"],
    description: "Constitutional assessment for recurring allergy symptoms and stable immune-related concerns.",
    conditions: ["Allergic rhinitis", "Recurring hives", "Environmental allergies", "Food-reaction history", "Stable inflammatory symptoms"],
    supportBoundary: "Known allergens, prescribed rescue medicines, and specialist immunology plans remain in place.",
    urgentBoundary: "Throat swelling, breathing difficulty, collapse, or suspected anaphylaxis requires emergency treatment.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "lime",
  },
  {
    id: "kidney-urinary",
    title: "Kidney & Urinary Support",
    specialties: ["Nephrology", "Urology"],
    description: "Supportive care for recurring urinary symptoms and stable kidney-related wellbeing alongside appropriate investigations.",
    conditions: ["Recurring urinary symptoms", "Stone-recurrence support", "Prostate-related urinary symptoms", "Bladder discomfort", "Renal wellbeing"],
    supportBoundary: "Kidney-function monitoring, antibiotics, procedures, and nephrology or urology treatment are not replaced.",
    urgentBoundary: "Inability to pass urine, fever with flank pain, blood in urine, severe swelling, or reduced urine output needs urgent assessment.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "amber",
  },
  {
    id: "brain-nerves",
    title: "Brain, Nerves & Headache Support",
    specialties: ["Neurology"],
    description: "Supportive constitutional care for recurring neurological symptoms after appropriate medical evaluation.",
    conditions: ["Migraine", "Recurring headache", "Neuralgia symptoms", "Tremor symptoms", "Chronic fatigue", "Post-stroke wellbeing"],
    supportBoundary: "Neurology assessment, imaging, seizure medicines, and stroke-prevention treatment continue as prescribed.",
    urgentBoundary: "Sudden weakness, facial droop, speech difficulty, seizure, confusion, or the worst sudden headache requires emergency care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "purple",
  },
  {
    id: "emotional-sleep",
    title: "Emotional Health, Sleep & Stress",
    specialties: ["Psychiatry"],
    description: "Support for stable anxiety, mood, sleep, stress, and attention-related symptoms within coordinated care.",
    conditions: ["Anxiety symptoms", "Low mood", "Insomnia", "Stress-related symptoms", "Attention difficulties", "Burnout"],
    supportBoundary: "Psychiatric medicines and psychotherapy continue unless the treating mental-health professional changes them.",
    urgentBoundary: "Suicidal thoughts, self-harm risk, severe agitation, psychosis, or inability to remain safe requires immediate crisis care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "indigo",
  },
  {
    id: "skin-hair-nails",
    title: "Skin, Hair & Nail Support",
    specialties: ["Dermatology"],
    description: "Constitutional assessment for recurring skin, scalp, hair, and nail concerns.",
    conditions: ["Eczema", "Psoriasis", "Recurring hives", "Vitiligo", "Acne", "Alopecia", "Chronic dandruff"],
    supportBoundary: "Dermatology diagnosis, infection treatment, biopsies, and prescribed medicines remain important when indicated.",
    urgentBoundary: "Rapidly spreading rash, facial swelling, blistering, fever with rash, or severe drug reaction requires urgent care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "teal",
  },
  {
    id: "joints-spine-mobility",
    title: "Joints, Spine & Mobility Support",
    specialties: ["Rheumatology", "Orthopedics"],
    description: "Supportive care for chronic pain, stiffness, inflammatory symptoms, and mobility concerns.",
    conditions: ["Osteoarthritis", "Rheumatoid-arthritis support", "Gout", "Back or neck pain", "Joint stiffness", "Mobility concerns"],
    supportBoundary: "Disease-modifying medicines, imaging, surgery advice, and physiotherapy continue when prescribed.",
    urgentBoundary: "New limb weakness, loss of bladder or bowel control, major injury, hot swollen joint with fever, or suspected fracture needs urgent care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "orange",
  },
  {
    id: "womens-health",
    title: "Women’s Health Support",
    specialties: ["Gynecology"],
    description: "Individual constitutional support for recurring menstrual, hormonal, and menopausal symptoms.",
    conditions: ["Menstrual concerns", "PCOS-related symptoms", "Menopause symptoms", "Recurring discharge symptoms", "Pelvic-pain history"],
    supportBoundary: "Pregnancy care, contraception, fertility evaluation, cancer screening, and gynecological procedures are separate medical services.",
    urgentBoundary: "Heavy bleeding, severe pelvic pain, fainting, pregnancy-related pain, or suspected ectopic pregnancy requires urgent assessment.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "rose",
  },
  {
    id: "ent",
    title: "Ear, Nose & Throat Support",
    specialties: ["ENT"],
    description: "Constitutional support for recurring upper-respiratory and ear, nose, or throat symptom patterns.",
    conditions: ["Recurring sinus symptoms", "Allergic rhinitis", "Recurring tonsil symptoms", "Ear discomfort", "Hoarseness", "Post-nasal drip"],
    supportBoundary: "Hearing tests, antibiotics, drainage, imaging, and ENT procedures remain necessary when indicated.",
    urgentBoundary: "Breathing obstruction, sudden hearing loss, severe neck swelling, drooling, or inability to swallow needs urgent medical care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "cyan",
  },
  {
    id: "eye-comfort",
    title: "Eye Comfort Support",
    specialties: ["Ophthalmology"],
    description: "Support for stable recurring eye-comfort and allergy symptoms after appropriate eye examination.",
    conditions: ["Dry-eye symptoms", "Eye allergy symptoms", "Recurring stye", "Eye strain", "Stable watering or irritation"],
    supportBoundary: "This does not replace eye-pressure checks, retinal examination, surgery, or ophthalmology treatment.",
    urgentBoundary: "Sudden vision loss, eye injury, severe pain, flashes with new floaters, or a red painful eye requires urgent ophthalmology care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "indigo",
  },
  {
    id: "child-adolescent",
    title: "Child & Adolescent Support",
    specialties: ["Pediatrics"],
    description: "Age-appropriate constitutional assessment for recurring stable symptoms in children and adolescents.",
    conditions: ["Recurring respiratory symptoms", "Digestive concerns", "Skin concerns", "Sleep difficulties", "General wellbeing", "Adolescent stress"],
    supportBoundary: "Vaccination, growth monitoring, prescribed medicines, and pediatric assessment continue as recommended.",
    urgentBoundary: "Breathing difficulty, dehydration, persistent lethargy, seizure, stiff neck, or a very unwell child needs urgent pediatric care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "amber",
  },
  {
    id: "healthy-ageing",
    title: "Healthy Ageing & Multisystem Support",
    specialties: ["Geriatrics"],
    description: "Coordinated support for older adults living with several stable conditions, frailty, or a high treatment burden.",
    conditions: ["Multiple stable conditions", "Frailty support", "Mobility and sleep concerns", "Appetite and wellbeing", "Treatment-burden review"],
    supportBoundary: "Medication changes remain the responsibility of the prescribing clinicians; care coordination requires patient consent.",
    urgentBoundary: "New confusion, falls with injury, sudden weakness, chest pain, severe breathlessness, or rapid decline requires urgent assessment.",
    allowedTierKeys: HIGH_COORDINATION_TIERS,
    badge: "Coordinated care",
    accent: "purple",
  },
  {
    id: "cancer-wellbeing",
    title: "Cancer Wellbeing Support",
    specialties: ["Oncology"],
    description: "Adjunctive symptom and wellbeing support during or after conventional oncology care; never a replacement for cancer treatment.",
    conditions: ["Treatment-side-effect support", "Appetite and sleep wellbeing", "Fatigue support", "Recovery wellbeing", "Caregiver-supported monitoring"],
    supportBoundary: "Oncology treatment, surveillance, investigations, and all cancer medicines continue under the oncology team.",
    urgentBoundary: "Fever during chemotherapy, uncontrolled vomiting, bleeding, severe pain, breathing difficulty, or sudden deterioration requires urgent oncology advice.",
    allowedTierKeys: HIGH_COORDINATION_TIERS,
    badge: "Oncology-led care continues",
    accent: "lime",
  },
  {
    id: "infection-recovery",
    title: "Infection Recovery Support",
    specialties: ["Infectious Diseases"],
    description: "Recovery-oriented constitutional support after appropriate diagnosis and medical management of an infection.",
    conditions: ["Post-viral fatigue", "Recovery after respiratory infection", "Recurring infection history", "Appetite and sleep recovery", "Convalescence"],
    supportBoundary: "This program is not for replacing antibiotics, antivirals, diagnostic testing, isolation advice, or infectious-disease treatment.",
    urgentBoundary: "High fever with deterioration, breathing difficulty, confusion, severe dehydration, stiff neck, or sepsis warning signs need urgent care.",
    allowedTierKeys: STANDARD_TIERS,
    accent: "orange",
  },
] as const;

export const SPECIALTY_ORGAN_SYSTEMS = Array.from(
  new Set(SPECIALTY_CLINICAL_AREAS.flatMap((area) => area.specialties)),
);

const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function calculateSpecialtyTierTotal(tierKey: SpecialtyTierKey, durationWeeks: number): number {
  const tier = SPECIALTY_SUPPORT_TIERS[tierKey];
  if (!tier.durations.includes(durationWeeks)) {
    throw new Error(`Unsupported duration for ${tier.title}: ${durationWeeks} weeks`);
  }
  return tier.weeklyPrice * durationWeeks;
}

export function formatSpecialtyTierTotal(tierKey: SpecialtyTierKey, durationWeeks: number): string {
  return formatPrice(calculateSpecialtyTierTotal(tierKey, durationWeeks));
}

export function findSpecialtyArea(areaId: string): SpecialtyClinicalArea | undefined {
  return SPECIALTY_CLINICAL_AREAS.find((area) => area.id === areaId);
}

export function createSpecialtyAssessmentRequest(selection: SpecialtySelection): SpecialtyAssessmentRequest {
  const area = findSpecialtyArea(selection.areaId);
  if (!area) throw new Error(`Unknown specialty clinical area: ${selection.areaId}`);
  const condition = selection.condition.trim();
  if (!condition) throw new Error(`A condition or concern is required for ${area.id}`);

  return {
    kind: "clinical-assessment",
    paymentAllowed: false,
    areaId: area.id,
    title: area.title,
    condition,
    organSystemBreadth: selection.organSystemBreadth,
    allowedTierKeys: area.allowedTierKeys,
    durationText: "Physician-recommended after assessment",
  };
}
