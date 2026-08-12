"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, ExternalLink, FlaskConical, ShieldAlert } from "lucide-react";
import { REMEDIES_METADATA } from "@/lib/repertoryData";

type Props = {
  remedy?: string | null;
  patientName?: string | null;
  onStageDraft: (draft: { remedy: string; potency: string; repetition: string; note: string }) => void;
};

const POTENCIES = ["6X", "12X", "6C", "12C", "30C", "200C", "1M", "10M", "LM1"];

export function PotencySelectionHelper({ remedy, patientName, onStageDraft }: Props) {
  const [context, setContext] = useState("uncertain");
  const [redFlags, setRedFlags] = useState("unknown");
  const [vulnerableGroup, setVulnerableGroup] = useState("unknown");
  const [standardCareReviewed, setStandardCareReviewed] = useState(false);
  const [productVerified, setProductVerified] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [potency, setPotency] = useState("");
  const [repetition, setRepetition] = useState("Single administration; reassess before repetition");
  const [staged, setStaged] = useState(false);

  const blockedReasons = useMemo(() => {
    const reasons: string[] = [];
    if (!remedy) reasons.push("Select and inspect a remedy first.");
    if (!patientName) reasons.push("Link an active patient before preparing a prescription draft.");
    if (redFlags === "yes") reasons.push("Urgent or red-flag symptoms require appropriate medical evaluation; this workflow cannot proceed.");
    if (redFlags === "unknown") reasons.push("Complete the urgent-care and red-flag review.");
    if (vulnerableGroup === "unknown") reasons.push("Confirm whether the patient is in a vulnerable group.");
    if (!standardCareReviewed) reasons.push("Confirm that evidence-based care and current treatment have been reviewed.");
    if (!productVerified) reasons.push("Verify product identity, labeling, quality and jurisdictional requirements.");
    if (!consentConfirmed) reasons.push("Confirm informed consent and documentation.");
    if (!potency) reasons.push("The clinician must select a potency; the system will not infer one from repertory scores.");
    return reasons;
  }, [consentConfirmed, patientName, potency, productVerified, redFlags, remedy, standardCareReviewed, vulnerableGroup]);

  const stageDraft = () => {
    if (!remedy || blockedReasons.length) return;
    const fullName = REMEDIES_METADATA[remedy]?.fullName || remedy;
    onStageDraft({
      remedy: fullName,
      potency,
      repetition,
      note: `Clinician-selected draft. Context: ${context}. Vulnerable group review: ${vulnerableGroup}. No automated potency recommendation was used.`,
    });
    setStaged(true);
  };

  return (
    <section className="potency-helper" aria-labelledby="potency-helper-title">
      <header>
        <div><span>Clinician-controlled draft workflow</span><h3 id="potency-helper-title"><FlaskConical aria-hidden="true" /> Potency selection and handoff</h3><p>Repertory rank never determines potency. This helper documents the clinician’s independent selection and safety review.</p></div>
        <div className="potency-helper__identity"><span>Active remedy</span><strong>{remedy ? (REMEDIES_METADATA[remedy]?.fullName || remedy) : "None selected"}</strong><small>{patientName ? `Patient: ${patientName}` : "No linked patient"}</small></div>
      </header>

      <div className="potency-helper__regulatory">
        <ShieldAlert aria-hidden="true" />
        <div><strong>Safety boundary</strong><p>Homeopathic products are not FDA-approved for any use and have not been demonstrated to meet FDA standards for safety, effectiveness and quality. Do not delay or replace appropriate medical assessment or treatment.</p></div>
        <a href="https://www.fda.gov/consumers/consumer-updates/what-does-fda-approve-part-2" target="_blank" rel="noreferrer">FDA information <ExternalLink aria-hidden="true" /></a>
      </div>

      <div className="potency-helper__grid">
        <section>
          <h4>1. Clinical safety review</h4>
          <label>Case context<select value={context} onChange={(event) => setContext(event.target.value)}><option value="uncertain">Uncertain / under evaluation</option><option value="acute">Acute presentation</option><option value="chronic">Chronic presentation</option><option value="follow-up">Follow-up after previous prescription</option></select></label>
          <label>Urgent symptoms or red flags reviewed?<select value={redFlags} onChange={(event) => setRedFlags(event.target.value)}><option value="unknown">Not yet reviewed</option><option value="no">Reviewed—none identified</option><option value="yes">Yes—urgent evaluation required</option></select></label>
          <label>Pregnancy, infancy, child, frailty or other vulnerable group?<select value={vulnerableGroup} onChange={(event) => setVulnerableGroup(event.target.value)}><option value="unknown">Not yet confirmed</option><option value="no">No</option><option value="yes">Yes—additional review documented</option></select></label>
          <label className="potency-helper__check"><input type="checkbox" checked={standardCareReviewed} onChange={(event) => setStandardCareReviewed(event.target.checked)} /><span><strong>Standard-care review completed</strong><small>Diagnosis, concurrent treatments and need for referral have been considered.</small></span></label>
        </section>

        <section>
          <h4>2. Clinician selection</h4>
          <fieldset><legend>Potency notation</legend><div className="potency-helper__potencies">{POTENCIES.map((item) => <button key={item} type="button" className={potency === item ? "is-active" : ""} onClick={() => setPotency(item)} aria-pressed={potency === item}>{item}</button>)}</div></fieldset>
          <p className="potency-helper__notation"><strong>Notation only:</strong> X, C and LM describe dilution/preparation scales. Their position in this list is not a claim of relative effectiveness, safety or clinical strength.</p>
          <label>Repetition plan<input value={repetition} onChange={(event) => setRepetition(event.target.value)} /></label>
          <label className="potency-helper__check"><input type="checkbox" checked={productVerified} onChange={(event) => setProductVerified(event.target.checked)} /><span><strong>Product verified</strong><small>Label, manufacturer, ingredients, route, expiry and local requirements reviewed.</small></span></label>
          <label className="potency-helper__check"><input type="checkbox" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} /><span><strong>Consent and documentation confirmed</strong><small>Benefits, uncertainties, alternatives and escalation advice documented.</small></span></label>
        </section>

        <section>
          <h4>3. Handoff readiness</h4>
          {blockedReasons.length ? <div className="potency-helper__blocked"><AlertTriangle aria-hidden="true" /><strong>Draft not ready</strong><ul>{blockedReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div> : <div className="potency-helper__ready"><CheckCircle2 aria-hidden="true" /><strong>Ready to stage for clinician review</strong><p>This will populate the existing case-entry fields. It will not save, sign, dispense or communicate a prescription.</p></div>}
          <div className="potency-helper__draft"><span>Draft preview</span><strong>{remedy ? (REMEDIES_METADATA[remedy]?.fullName || remedy) : "Remedy required"} {potency || "—"}</strong><p>{repetition}</p></div>
          <button type="button" className="potency-helper__stage" disabled={blockedReasons.length > 0} onClick={stageDraft}><ClipboardCheck aria-hidden="true" /> Stage clinician-selected draft</button>
          {staged && <p className="potency-helper__staged"><CheckCircle2 aria-hidden="true" /> Draft staged in Case Entry. Review it there before signing.</p>}
        </section>
      </div>
    </section>
  );
}
