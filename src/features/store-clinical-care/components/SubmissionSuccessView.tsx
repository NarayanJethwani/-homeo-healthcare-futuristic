import React from "react";
import { CheckCircle, HeartHandshake, MessageCircle, ArrowRight } from "lucide-react";
import type { SanitizedAssessmentResponseDTO } from "../domain/types";
import { buildPatientWhatsAppReviewLink } from "../services/careRecommendationEngine";

interface SubmissionSuccessViewProps {
  response: SanitizedAssessmentResponseDTO;
  onReset: () => void;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  response,
  onReset,
}) => {
  const whatsappPayload = buildPatientWhatsAppReviewLink({
    patientName: response.patientName,
    submissionId: response.submissionId,
    selectedTierName: response.preliminaryRecommendation.suggestedTierName,
    preferredDurationWeeks: response.preferredDurationWeeks,
    totalEstimatedAmountFormatted: response.totalEstimatedAmountFormatted,
    mainHealthArea: response.mainHealthArea,
  });

  return (
    <div className="max-w-2xl mx-auto my-12 rounded-3xl border border-mint/20 bg-white/90 backdrop-blur-md p-8 md:p-10 text-center shadow-xl">
      <div className="mx-auto w-16 h-16 rounded-full bg-mint/10 text-mint-dark flex items-center justify-center mb-6 shadow-inner">
        <CheckCircle className="w-8 h-8 text-mint" />
      </div>

      <h2 className="font-serif text-3xl font-bold text-[#1A2421] mb-3">
        Submission Received for Physician Review
      </h2>

      <p className="text-sm font-semibold text-slate-700 leading-relaxed mb-6">
        {response.message}
      </p>

      {/* Direct WhatsApp Doctor Assistance CTA */}
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 mb-6 text-left space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
            <MessageCircle className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-bold text-emerald-950 text-sm block">Direct Doctor Assistance & WhatsApp Review</span>
            <span className="text-xs text-emerald-800 font-semibold">
              Connect directly with Dr. Jethwani (+91 8446056789) for immediate clinical guidance.
            </span>
          </div>
        </div>

        <a
          href={whatsappPayload.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <MessageCircle className="w-4 h-4" aria-hidden="true" />
          <span>Continue to Physician Review on WhatsApp (8446056789)</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>

      {/* Submission Details Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 text-left text-xs font-semibold text-slate-700 space-y-3 mb-6 shadow-sm">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Submission Reference:</span>
          <span className="font-mono font-bold text-[#1A2421]">{response.submissionId}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Patient Name:</span>
          <span className="font-bold text-[#1A2421]">{response.patientName}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Primary Health Area:</span>
          <span className="font-bold text-[#1A2421]">{response.mainHealthArea}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Planned Care Period:</span>
          <span className="font-bold text-[#1A2421]">{response.preferredDurationWeeks} Weeks</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="text-slate-500">Estimated Total Amount:</span>
          <span className="font-extrabold text-[#1A2421] text-sm">{response.totalEstimatedAmountFormatted}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Current Status:</span>
          <span className="font-bold text-mint-dark uppercase tracking-wider text-[10px] bg-mint/10 px-2.5 py-1 rounded-full">
            Submitted for Physician Review
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-mint/5 border border-mint/20 text-xs text-slate-700 mb-6 flex items-start gap-3 text-left">
        <HeartHandshake className="w-5 h-5 text-mint shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1A2421] block mb-0.5">What Happens Next?</span>
          Your assigned classical homeopathic physician will review your clinical history and lab records. Our care team will reach out directly to share your individualized Clinical Care Recommendation.
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3.5 rounded-full bg-[#1A2421] text-white text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
      >
        Submit Another Clinical Care Request
      </button>
    </div>
  );
};
