import React, { useState, useMemo } from "react";
import {
  Stethoscope,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  ShieldCheck,
  Percent,
} from "lucide-react";
import {
  CLINICAL_CARE_TIER_OPTIONS,
  formatINRFromPaise,
  getClinicPaymentConfiguration,
  type ClinicalCareDurationWeeks,
  type OfficialClinicalQuotation,
  type SanitizedAssessmentResponseDTO,
} from "../domain/types";
import {
  calculateItemizedPharmacyQuotation,
  buildWhatsAppQuotationPayload,
} from "../services/careRecommendationEngine";

interface PhysicianQuotationBuilderProps {
  assessmentResponse: SanitizedAssessmentResponseDTO;
  patientPhone?: string;
}

export const PhysicianQuotationBuilder: React.FC<PhysicianQuotationBuilderProps> = ({
  assessmentResponse,
  patientPhone = "918446056789",
}) => {
  const rec = assessmentResponse.preliminaryRecommendation;
  const paymentConfig = getClinicPaymentConfiguration();

  // Clinician Controls State
  const [tierId, setTierId] = useState<string>(rec.suggestedTierId || "integrated");
  const [durationWeeks, setDurationWeeks] = useState<ClinicalCareDurationWeeks>(
    (assessmentResponse.preferredDurationWeeks || 4) as ClinicalCareDurationWeeks
  );
  const [specialBrandedINR, setSpecialBrandedINR] = useState<number>(0);
  const [courierINR, setCourierINR] = useState<number>(350);

  // Senior Citizen Concession State
  const [seniorCitizenEligible, setSeniorCitizenEligible] = useState<boolean>(false);
  const [seniorApprovedBy, setSeniorApprovedBy] = useState<string>("Dr. N. Jethwani");
  const [seniorReason, setSeniorReason] = useState<string>("Age 60+ Senior Citizen Care Support");

  // Socio-Economic Concession State
  const [socioEconomicPercent, setSocioEconomicPercent] = useState<number>(0);
  const [socioApprovedBy, setSocioApprovedBy] = useState<string>("Dr. N. Jethwani");
  const [socioReason, setSocioReason] = useState<string>("Approved Clinical Concession");

  const [clinicalNotes, setClinicalNotes] = useState<string>("");

  const quotationBreakdown = useMemo(() => {
    return calculateItemizedPharmacyQuotation({
      tierId,
      durationWeeks,
      specialBrandedMedicinesPaise: Math.round(specialBrandedINR * 100),
      courierFeePaise: Math.round(courierINR * 100),
      seniorCitizenEligible,
      seniorCitizenApprovedBy: seniorApprovedBy,
      seniorCitizenReason: seniorReason,
      socioEconomicPercent,
      socioEconomicApprovedBy: socioApprovedBy,
      socioEconomicReason: socioReason,
      clinicalNotes,
    });
  }, [
    tierId,
    durationWeeks,
    specialBrandedINR,
    courierINR,
    seniorCitizenEligible,
    seniorApprovedBy,
    seniorReason,
    socioEconomicPercent,
    socioApprovedBy,
    socioReason,
    clinicalNotes,
  ]);

  const officialQuotation: OfficialClinicalQuotation = useMemo(() => {
    const tier = CLINICAL_CARE_TIER_OPTIONS[tierId] || CLINICAL_CARE_TIER_OPTIONS.integrated;
    return {
      quotationId: `QTN-${new Date().getFullYear()}-${assessmentResponse.submissionId.slice(-6)}`,
      submissionId: assessmentResponse.submissionId,
      patientName: assessmentResponse.patientName,
      phone: patientPhone,
      tierId,
      tierName: tier.name,
      durationWeeks,
      breakdown: quotationBreakdown,
      paymentWorkflow: {
        paymentProvider: "manual",
        paymentStatus: "quotation_sent",
        clinicUpiId: paymentConfig.upiId,
        clinicBankDetails: paymentConfig.bankDetails,
      },
      createdAt: new Date().toISOString(),
    };
  }, [assessmentResponse, patientPhone, tierId, durationWeeks, quotationBreakdown, paymentConfig]);

  const whatsappPayload = useMemo(() => {
    return buildWhatsAppQuotationPayload(officialQuotation);
  }, [officialQuotation]);

  return (
    <div className="rounded-3xl border border-mint/30 bg-white/95 backdrop-blur-md p-6 md:p-8 shadow-xl mb-12 space-y-8">
      {/* Clinician Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-mint bg-mint/10 px-3 py-1 rounded-full">
            Authorized Clinician & Care Coordinator Tool
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#1A2421] mt-2 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-mint" aria-hidden="true" />
            Official Clinical Care Quotation Builder
          </h3>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Review preliminary recommendation, configure pharmacy items and governed concessions, then generate WhatsApp payment instructions.
          </p>
        </div>

        <div className="text-right text-xs">
          <span className="font-bold text-slate-400 block">Submission Reference</span>
          <span className="font-mono font-bold text-mint-dark text-sm">{assessmentResponse.submissionId}</span>
        </div>
      </div>

      {/* Advisory Complexity Score Review */}
      <div className="p-5 rounded-2xl bg-mint/5 border border-mint/20 text-xs space-y-2">
        <span className="font-bold text-[#1A2421] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-mint" aria-hidden="true" />
          Internal Advisory Assessment Result (Clinician Only):
        </span>
        <p className="font-semibold text-slate-700">
          Suggested Pathway: <strong className="text-mint-dark">{rec.suggestedTierName}</strong> — Complexity Score: {rec.complexityScore} ({rec.selectedOrganCount} Organ Systems Selected)
        </p>
        <p className="text-slate-500 italic">{rec.rationale}</p>
      </div>

      {/* Clinician Override Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Tier Selection */}
        <div>
          <label htmlFor="tier-select" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
            Final Care Pathway Tier *
          </label>
          <select
            id="tier-select"
            value={tierId}
            onChange={(e) => setTierId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
          >
            {Object.values(CLINICAL_CARE_TIER_OPTIONS).map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} (₹{t.weeklyRateINR.toLocaleString("en-IN")}/wk)
              </option>
            ))}
          </select>
        </div>

        {/* Duration Selection */}
        <div>
          <label htmlFor="duration-select" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
            Care Duration *
          </label>
          <select
            id="duration-select"
            value={durationWeeks}
            onChange={(e) => setDurationWeeks(Number(e.target.value) as ClinicalCareDurationWeeks)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
          >
            <option value={1}>1 Week</option>
            <option value={2}>2 Weeks</option>
            <option value={4}>4 Weeks (Recommended)</option>
            <option value={8}>8 Weeks</option>
            <option value={12}>12 Weeks</option>
          </select>
        </div>

        {/* Special Branded Medicines */}
        <div>
          <label htmlFor="branded-inr" className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-2">
            Special Branded Medicines (₹)
          </label>
          <input
            id="branded-inr"
            type="number"
            min={0}
            value={specialBrandedINR}
            onChange={(e) => setSpecialBrandedINR(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-bold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
          />
        </div>
      </div>

      {/* Governed Concessions Section */}
      <div className="pt-4 border-t border-slate-200/80 space-y-4">
        <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2">
          <Percent className="w-4 h-4 text-mint" aria-hidden="true" />
          Governed Clinical Concessions (Clinician Approval Required)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Senior Citizen Concession */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <label className="flex items-center gap-2 font-bold text-xs text-[#1A2421] cursor-pointer">
              <input
                type="checkbox"
                checked={seniorCitizenEligible}
                onChange={(e) => setSeniorCitizenEligible(e.target.checked)}
                className="w-4 h-4 rounded text-mint focus:ring-mint"
              />
              <span>Senior Citizen Support (10% Concession)</span>
            </label>

            {seniorCitizenEligible && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={seniorApprovedBy}
                  onChange={(e) => setSeniorApprovedBy(e.target.value)}
                  placeholder="Approved By (Clinician Name)"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-mint"
                />
                <input
                  type="text"
                  value={seniorReason}
                  onChange={(e) => setSeniorReason(e.target.value)}
                  placeholder="Mandatory Audit Reason"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-mint"
                />
              </div>
            )}
          </div>

          {/* Socio-Economic Support Concession */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <label htmlFor="socio-pct" className="block text-xs font-bold text-[#1A2421]">
              Socio-Economic Support Concession
            </label>
            <select
              id="socio-pct"
              value={socioEconomicPercent}
              onChange={(e) => setSocioEconomicPercent(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold outline-none focus:border-mint"
            >
              <option value={0}>None (0%)</option>
              <option value={10}>10% Approved Concession</option>
              <option value={20}>20% Approved Concession</option>
              <option value={30}>30% Approved Concession (Max)</option>
            </select>

            {socioEconomicPercent > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={socioApprovedBy}
                  onChange={(e) => setSocioApprovedBy(e.target.value)}
                  placeholder="Approved By (Clinician Name)"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-mint"
                />
                <input
                  type="text"
                  value={socioReason}
                  onChange={(e) => setSocioReason(e.target.value)}
                  placeholder="Mandatory Audit Reason"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold outline-none focus:border-mint"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Quotation Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-mint">
          Itemized Official Clinical Quotation
        </span>

        <dl className="space-y-2 text-xs font-semibold">
          <div className="flex justify-between">
            <dt className="text-slate-400">List Professional Care Fee ({durationWeeks} wks)</dt>
            <dd className="font-bold">{formatINRFromPaise(quotationBreakdown.listProfessionalFeePaise)}</dd>
          </div>
          {quotationBreakdown.continuityDiscountPaise > 0 && <div className="flex justify-between text-emerald-400"><dt>Continuity Care Benefit ({quotationBreakdown.continuityDiscountPercent}%)</dt><dd>-{formatINRFromPaise(quotationBreakdown.continuityDiscountPaise)}</dd></div>}
          <div className="flex justify-between"><dt className="text-slate-400">Professional Care Fee After Benefit</dt><dd className="font-bold">{formatINRFromPaise(quotationBreakdown.professionalFeePaise)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Routine Homeopathic Medicines</dt>
            <dd className="font-bold text-mint">Included</dd>
          </div>

          {quotationBreakdown.concessions.map((c, i) => (
            <div key={i} className="flex justify-between text-emerald-400">
              <dt>
                {c.type === "senior_citizen" ? "Senior Citizen Support (10%)" : `Socio-Economic Support (${c.percentage}%)`}
              </dt>
              <dd>-{formatINRFromPaise(c.amountPaise)}</dd>
            </div>
          ))}

          {quotationBreakdown.specialBrandedMedicinesPaise > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate-400">Special Branded Medicines</dt>
              <dd className="font-bold">{formatINRFromPaise(quotationBreakdown.specialBrandedMedicinesPaise)}</dd>
            </div>
          )}

          {quotationBreakdown.courierFeePaise > 0 && (
            <div className="flex justify-between">
              <dt className="text-slate-400">Courier & Dispatch</dt>
              <dd className="font-bold">{formatINRFromPaise(quotationBreakdown.courierFeePaise)}</dd>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black">
            <dt>Total Amount</dt>
            <dd className="text-mint">{quotationBreakdown.finalTotalFormatted}</dd>
          </div>
        </dl>

        <div className="text-[11px] text-slate-400 space-y-1">
          <p>• UPI Payment ID: <code className="text-white font-mono">{paymentConfig.upiId}</code></p>
          <p>• Bank Details: <code className="text-white font-mono">{paymentConfig.bankDetails}</code></p>
        </div>
      </div>

      {/* Action Button: Send Payment Details via WhatsApp */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <a
          href={whatsappPayload.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>Send Payment Details via WhatsApp</span>
        </a>

        <span className="text-[11px] font-semibold text-slate-500">
          Generates pre-formatted quotation message with UPI QR payment details.
        </span>
      </div>
    </div>
  );
};
