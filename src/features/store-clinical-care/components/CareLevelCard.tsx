import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Monitor, X } from "lucide-react";
import {
  ALLOWED_CARE_DURATIONS, CLINICAL_CARE_TIER_OPTIONS,
  calculateTierCarePeriodTotalPaise, calculateTierListCarePeriodTotalPaise,
  formatINRFromPaise, getTierCarePeriodLabel, getTierContinuityBenefit,
  type ClinicalCareDurationWeeks, type PreliminaryCareRecommendation, type StoreClinicalCareTierId,
} from "../domain/types";
import styles from "./CareLevelCard.module.css";
import { CARE_PLAN_DETAILS, MEMBERSHIP_ALLOWANCE, UNUSED_FEES_POLICY } from "./CarePlanContent";

interface CareLevelCardProps {
  selectedTierId: string;
  selectedDurationWeeks: ClinicalCareDurationWeeks;
  preliminaryRecommendation?: PreliminaryCareRecommendation;
  onSelectTier: (tierId: string) => void;
  onSelectDuration: (weeks: ClinicalCareDurationWeeks) => void;
  onProceedToAssessment?: () => void;
}

type GroupId = "acute" | "chronic" | "membership";
const GROUPS: { id: GroupId; title: string; note: string; ids: StoreClinicalCareTierId[] }[] = [
  { id: "acute", title: "Acute & Subacute Care", note: "Short, defined care periods · reassessment before extension", ids: ["acute_mild", "acute_wellness", "subacute"] },
  { id: "chronic", title: "Chronic Care", note: "Weekly physician-led care · review schedules agreed individually", ids: ["focused", "integrated", "complex", "advanced"] },
  { id: "membership", title: "Membership Follow-up Plans", note: "One person · one scheduled consultation per paid period · optional renewal", ids: ["membership_focused", "membership_integrated", "membership_comprehensive"] },
];

export const CareLevelCard: React.FC<CareLevelCardProps> = ({ selectedTierId, selectedDurationWeeks, preliminaryRecommendation, onSelectTier, onSelectDuration, onProceedToAssessment }) => {
  const safeId = (Object.hasOwn(CLINICAL_CARE_TIER_OPTIONS, selectedTierId) ? selectedTierId : "focused") as StoreClinicalCareTierId;
  const tier = CLINICAL_CARE_TIER_OPTIONS[safeId];
  const [presenting, setPresenting] = useState(false);
  const [groupId, setGroupId] = useState<GroupId>("acute");
  const dialog = useRef<HTMLDialogElement>(null);
  const blocked = preliminaryRecommendation?.blockedBySafetyGate === true;
  const period = getTierCarePeriodLabel(safeId, selectedDurationWeeks);
  const total = calculateTierCarePeriodTotalPaise(safeId, selectedDurationWeeks);
  const listTotal = calculateTierListCarePeriodTotalPaise(safeId, selectedDurationWeeks);
  const benefit = getTierContinuityBenefit(safeId, selectedDurationWeeks);
  const durationTierId = tier.family === "chronic" ? safeId : "focused";
  const durationTier = CLINICAL_CARE_TIER_OPTIONS[durationTierId];
  const durationTotal = calculateTierCarePeriodTotalPaise(durationTierId, selectedDurationWeeks);
  const durationListTotal = calculateTierListCarePeriodTotalPaise(durationTierId, selectedDurationWeeks);
  const durationBenefit = getTierContinuityBenefit(durationTierId, selectedDurationWeeks);
  const membershipTierId = tier.family === "membership" ? safeId : "membership_focused";
  const membershipTier = CLINICAL_CARE_TIER_OPTIONS[membershipTierId];
  const membershipDurationWeeks = selectedDurationWeeks === 2 ? 2 : 4;

  useEffect(() => {
    if (presenting) dialog.current?.showModal();
    else dialog.current?.close();
  }, [presenting]);

  const selectGroup = (id: GroupId, presentation = false) => {
    setGroupId(id);
    if (!presentation) document.getElementById(`care-group-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const requestReview = () => {
    setPresenting(false);
    onProceedToAssessment?.();
  };
  const durationCalculator = () => (
    <div className={`${styles.calculator} ${styles.chronicCalculator}`} data-tier={durationTierId} aria-label="Chronic care duration calculator">
      <div>
        <p className={styles.eyebrow}>Chronic care period</p>
        <h4>Choose your care period</h4>
        <p>{durationTier.name} · the physician confirms the final duration and care scope.</p>
      </div>
      <div className={styles.calculatorChoices}>
        {ALLOWED_CARE_DURATIONS.map(weeks => {
          const itemTotal = calculateTierCarePeriodTotalPaise(durationTierId, weeks);
          const itemListTotal = calculateTierListCarePeriodTotalPaise(durationTierId, weeks);
          const itemBenefit = getTierContinuityBenefit(durationTierId, weeks);
          return <button type="button" key={weeks} aria-pressed={selectedDurationWeeks === weeks} onClick={() => { if (tier.family !== "chronic") onSelectTier(durationTierId); onSelectDuration(weeks); }}>
            <strong>{weeks} {weeks === 1 ? "week" : "weeks"}</strong>
            <span>{formatINRFromPaise(itemTotal)}</span>
            <small>{itemBenefit > 0 ? `${itemBenefit}% continuity benefit` : "Standard rate"}</small>
            {itemBenefit > 0 && <small className={styles.listPrice}>{formatINRFromPaise(itemListTotal)}</small>}
          </button>;
        })}
      </div>
      <div className={styles.calculatorTotal}>
        <span>Selected total · {getTierCarePeriodLabel(durationTierId, selectedDurationWeeks)}</span>
        <strong>{formatINRFromPaise(durationTotal)}</strong>
        {durationBenefit > 0 && <small>{formatINRFromPaise(durationListTotal)} less {durationBenefit}% continuity benefit</small>}
      </div>
    </div>
  );
  const membershipPaymentOptions = () => (
    <div className={`${styles.calculator} ${styles.membershipCalculator}`} data-tier={membershipTierId} aria-label="Membership payment options">
      <div>
        <p className={styles.eyebrow}>Membership payment period</p>
        <h4>Choose a convenient payment period</h4>
        <p>{membershipTier.name} · the physician confirms that membership follow-up is suitable.</p>
      </div>
      <div className={styles.calculatorChoices}>
        {([2, 4] as const).map(weeks => {
          const isTwoWeeks = weeks === 2;
          const payment = calculateTierCarePeriodTotalPaise(membershipTierId, weeks);
          return <button type="button" key={weeks} aria-pressed={membershipDurationWeeks === weeks} onClick={() => { if (tier.family !== "membership") onSelectTier(membershipTierId); onSelectDuration(weeks); }}>
            <strong>{isTwoWeeks ? "2 weeks" : "Calendar month"}</strong>
            <span>{formatINRFromPaise(payment)}</span>
            <small>{isTwoWeeks ? "Lower upfront payment" : "One calendar month of care"}</small>
          </button>;
        })}
      </div>
      <div className={styles.calculatorTotal}>
        <span>Selected payment · {getTierCarePeriodLabel(membershipTierId, membershipDurationWeeks)}</span>
        <strong>{formatINRFromPaise(calculateTierCarePeriodTotalPaise(membershipTierId, membershipDurationWeeks))}</strong>
        <small>One person · one scheduled consultation in this period</small>
      </div>
      <p className={styles.paymentExplanation}>{MEMBERSHIP_ALLOWANCE} Two consecutive 2-week periods cost {formatINRFromPaise((membershipTier.twoWeekRatePaise || 0) * 2)} for 28 days and include two consultations. A calendar month costs {formatINRFromPaise(membershipTier.weeklyRatePaise)} and includes one consultation.</p>
    </div>
  );
  const groupCards = (group: typeof GROUPS[number], presentation = false) => (
    <section key={group.id} id={presentation ? undefined : `care-group-${group.id}`} className={styles.group} aria-label={group.title}>
      <div className={styles.groupHeading}><div><p className={styles.eyebrow}>{group.id === "acute" ? "01 · Short-term care" : group.id === "chronic" ? "02 · Ongoing care" : "03 · Lower-intensity follow-up"}</p><h3>{group.title}</h3><p>{group.note}</p></div></div>
      <div className={`${styles.cards} ${group.id === "chronic" ? styles.four : styles.three}`}>
        {group.ids.map(id => {
          const plan = CLINICAL_CARE_TIER_OPTIONS[id];
          const details = CARE_PLAN_DETAILS[id];
          const selected = id === safeId;
          return <button type="button" key={id} data-tier={id} aria-pressed={selected} onClick={() => { onSelectTier(id); if (plan.family === "membership" && tier.family !== "membership") onSelectDuration(4); }} className={`${styles.card} ${selected ? styles.selected : ""}`}>
            <span className={styles.planName}>{plan.name}</span>
            <span className={styles.price}>{formatINRFromPaise(plan.weeklyRatePaise)}</span>
            <span className={styles.period}>{plan.family === "chronic" ? "per person / week" : plan.family === "membership" ? "per person / calendar month" : `complete ${getTierCarePeriodLabel(id, 1)} care period`}</span>
            {plan.family === "membership" && plan.twoWeekRatePaise && <span className={styles.paymentOption}>{formatINRFromPaise(plan.twoWeekRatePaise)} for 2 weeks</span>}
            <span className={styles.rows}>
              <span><small>CARE SCOPE</small>{details.scope}</span>
              <span><small>CASE ANALYSIS &amp; CARE</small>{details.casework}</span>
              <span><small>FOLLOW-UP</small>{details.review}</span>
            </span>
            <span className={styles.select}>{selected ? "Selected plan ✓" : "Select plan"}</span>
          </button>;
        })}
      </div>
      {group.id === "chronic" && <p className={styles.groupNote}>Your doctor agrees the organ systems and concerns covered, considering case history, pathological findings and review needs. Case analysis, repertorisation and constitutional prescribing are used where appropriate at every level. Organ count alone does not determine the fee; referral may be required.</p>}
      {group.id === "chronic" && durationCalculator()}
      {group.id === "chronic" && <p className={styles.groupNote}>As you improve, your doctor may recommend less frequent follow-up or completing care. Before prepaying, read the <a href="#care-payment-policy" className="font-bold underline underline-offset-4" onClick={() => setPresenting(false)}>unused-fee and family-adjustment policy</a>.</p>}
      {group.id === "membership" && membershipPaymentOptions()}
      {group.id === "membership" && <p className={styles.groupNote}>Membership includes case review, constitutional follow-up where appropriate, routine prescribed medicines and brief clarification of existing instructions during clinic hours. New acute concerns are separately assessed and charged. Renewal is optional; care can finish when follow-up is no longer needed. Membership is not insurance or unlimited care.</p>}
      <p className={styles.included}><CheckCircle2 size={16} aria-hidden="true" /> Routine individually prescribed homeopathic medicines included · additional fees agreed before payment.</p>
    </section>
  );

  return <section id="care-pathways-pricing" aria-labelledby="care-pathways-heading" className={styles.root}>
    <div className={styles.intro}><div><p className={styles.eyebrow}>Care plans & professional fees</p><h2 id="care-pathways-heading">The right level of care, clearly explained.</h2><p>Compare the concerns covered, case analysis and follow-up. Your doctor confirms the scope and review schedule before payment.</p></div><button type="button" className={styles.presentationButton} onClick={() => { setGroupId(GROUPS.find(g => g.ids.includes(safeId))?.id || "acute"); setPresenting(true); }}><Monitor size={18} /> Presentation view</button></div>
    <nav className={styles.nav} aria-label="Care plan sections">{GROUPS.map(g => <button type="button" key={g.id} onClick={() => selectGroup(g.id)}>{g.title}</button>)}</nav>
    {blocked && <p role="alert" className={styles.warning}>Urgent or uncertain warning signs require clinical assessment before a plan is requested. These plans are not emergency services.</p>}
    {GROUPS.map(g => groupCards(g))}
    <div className={styles.summary}>
      <div>
        <p className={styles.eyebrow}>Your selected plan</p><h3>{tier.name}</h3><p>{period}{tier.family === "membership" ? " · one person · optional renewal" : " · physician-confirmed scope"}</p>
        {tier.family === "chronic" ? <details className={styles.duration}><summary>Care period & continuity benefits · {period}</summary><div className={styles.durationButtons}>{ALLOWED_CARE_DURATIONS.map(weeks => <button type="button" key={weeks} aria-pressed={selectedDurationWeeks === weeks} onClick={() => onSelectDuration(weeks)}>{weeks} {weeks === 1 ? "week" : "weeks"}<small>{getTierContinuityBenefit(safeId, weeks) || 0}% benefit</small></button>)}</div></details> : <p className={styles.groupNote}>{tier.family === "membership" ? `${period} of follow-up for one person, including one scheduled consultation. Renewal is optional. Weekly continuity discounts do not apply.` : "Fixed care period. No continuity discount; reassessment before renewal or extension."}</p>}
      </div>
      <div className={styles.total}><span>Estimated care fee · {period}</span><strong>{formatINRFromPaise(total)}</strong>{benefit > 0 && <small>{formatINRFromPaise(listTotal)} less {benefit}% continuity benefit</small>}<button type="button" disabled={blocked} onClick={requestReview}>{blocked ? "Urgent assessment required" : "Request physician review"}<ArrowRight size={16} /></button><small>No payment now. Your doctor confirms suitability and the final fee. Outcomes vary.</small></div>
    </div>
    <div id="care-payment-policy" className={styles.beforePayment}>
      <h3>Before choosing a longer care period</h3>
      <p>Your doctor reviews whether to continue active care, move to membership or complete care. A longer payment period does not mean you need treatment for its entire duration.</p>
      <p><strong>Unused fees &amp; family adjustment:</strong> {UNUSED_FEES_POLICY}</p>
      <p><strong>Need help with affordability?</strong> Senior citizens and people facing financial hardship can request an individual concession review. Your care needs still determine the suitable plan.</p>
    </div>
    <dialog ref={dialog} onClose={() => setPresenting(false)} className={styles.presentation} aria-label="Care plan presentation">
      <div className={styles.presentationHeader}><strong>Homeo Healthcare <span>Care plans & fees</span></strong><button type="button" onClick={() => setPresenting(false)} aria-label="Close presentation"><X size={22} /></button></div>
      <nav className={styles.nav} aria-label="Presentation groups">{GROUPS.map(g => <button type="button" aria-pressed={groupId === g.id} key={g.id} onClick={() => selectGroup(g.id, true)}>{g.title}</button>)}</nav>
      {groupCards(GROUPS.find(g => g.id === groupId)!, true)}
      <div className={styles.presentationFooter}><span>Selected: <strong>{tier.name}</strong> · {formatINRFromPaise(total)} / {period}</span><button type="button" disabled={blocked} onClick={requestReview}>{blocked ? "Urgent assessment required" : "Request physician review"}<ArrowRight size={16} /></button></div>
    </dialog>
  </section>;
};
