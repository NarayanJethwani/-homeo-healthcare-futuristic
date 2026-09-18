import type { StoreClinicalCareTierId } from "../domain/types";

// Patient-facing descriptions; no changes to clinical entities or pricing rules.
export const CARE_PLAN_DETAILS: Record<StoreClinicalCareTierId, { scope: string; casework: string; review: string }> = {
  acute_mild: { scope: "One mild, recent concern", casework: "Focused symptom history, case analysis and individual prescribing", review: "Review within 2 days; reassess before extension" },
  acute_wellness: { scope: "A recent concern needing a longer review window", casework: "Symptom history, case analysis and prescription review as needed", review: "Review within 4 days; reassess before extension" },
  subacute: { scope: "A persisting concern needing reassessment", casework: "History and progress review to guide the next care decision", review: "Review within 1 week; agree whether further care is needed" },
  focused: { scope: "One principal chronic concern or organ system", casework: "Case history and analysis; constitutional care where appropriate", review: "Planned weekly follow-up of the agreed concern" },
  integrated: { scope: "Related concerns involving two organ systems", casework: "Combined case analysis and constitutional care across related concerns", review: "Review progress across both systems; schedule agreed with your doctor" },
  complex: { scope: "Multiple organ systems with a more complex history or findings", casework: "Detailed case analysis, repertorisation and constitutional review as needed", review: "Review each agreed concern, relevant reports and prescription changes" },
  advanced: { scope: "Extensive multi-system care requiring greater review and coordination", casework: "Comprehensive case analysis and constitutional review alongside report assessment", review: "Individual review schedule; coordination or referral when required" },
  membership_focused: { scope: "One agreed mild, stable concern", casework: "Review the existing case and constitutional prescription where appropriate", review: "One scheduled consultation per paid period" },
  membership_integrated: { scope: "Related mild, stable concerns involving two organ systems", casework: "Integrated case review and constitutional follow-up across both systems", review: "One scheduled consultation per paid period covering the agreed concerns" },
  membership_comprehensive: { scope: "Multiple mild, stable concerns across organ systems as required", casework: "Broader history and report review; case analysis and constitutional reassessment as needed", review: "One scheduled consultation per paid period reviewing all agreed concerns" },
};

export const HOMEOPATHIC_SERVICES = [
  { title: "Case history", description: "Your current concerns, past health, family history, daily habits and previous treatment, as relevant to the case." },
  { title: "Case analysis", description: "Review of the symptom pattern, its effect on daily life and the relevant clinical findings or reports." },
  { title: "Repertorisation & remedy comparison", description: "When appropriate, symptoms are organised using a homeopathic reference index and compared with remedy descriptions to inform prescribing." },
  { title: "Constitutional care", description: "An individualised homeopathic approach that considers the broader personal symptom pattern, where appropriate to your case." },
  { title: "Follow-up & reassessment", description: "Review progress, assess new concerns and decide whether to continue, change the plan, refer or complete care." },
  { title: "Prescribed homeopathic medicines", description: "Routine medicines prescribed and dispensed by Homeo Healthcare for the agreed care period are included." },
];

export { MEMBERSHIP_ALLOWANCE, UNUSED_FEES_POLICY } from "../services/carePlanPolicy";
