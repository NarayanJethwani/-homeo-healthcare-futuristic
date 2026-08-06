import React from "react";
import { CheckCircle, FileText, HeartHandshake } from "lucide-react";
import type { SanitizedAssessmentResponseDTO } from "../domain/types";

interface SubmissionSuccessViewProps {
  response: SanitizedAssessmentResponseDTO;
  onReset: () => void;
}

export const SubmissionSuccessView: React.FC<SubmissionSuccessViewProps> = ({
  response,
  onReset,
}) => {
  return (
    <div className="max-w-2xl mx-auto my-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center shadow-lg shadow-emerald-900/5">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 shadow-inner">
        <CheckCircle className="w-8 h-8" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Submission Received for Physician Review
      </h2>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
        {response.message}
      </p>

      {/* Submission Details Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 text-left text-xs text-slate-700 space-y-3 mb-6 shadow-sm">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Submission Reference:</span>
          <span className="font-mono font-bold text-slate-900">{response.submissionId}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Patient Name:</span>
          <span className="font-bold text-slate-900">{response.patientName}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Primary Health Area:</span>
          <span className="font-bold text-slate-900">{response.mainHealthArea}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Planned Care Period:</span>
          <span className="font-bold text-slate-900">{response.preferredDurationWeeks} Weeks</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span className="font-semibold text-slate-500">Estimated Total Amount:</span>
          <span className="font-extrabold text-slate-900 text-sm">{response.totalEstimatedAmountFormatted}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="font-semibold text-slate-500">Current Status:</span>
          <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px] bg-emerald-100 px-2 py-0.5 rounded">
            Submitted for Physician Review
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/80 text-xs text-slate-600 mb-6 flex items-start gap-3 text-left">
        <HeartHandshake className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block mb-0.5">What Happens Next?</span>
          Your assigned classical homeopathic physician will review your clinical history and lab records. Our care team will reach out directly to share your individualized Clinical Care Recommendation.
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
      >
        Submit Another Clinical Care Request
      </button>
    </div>
  );
};
