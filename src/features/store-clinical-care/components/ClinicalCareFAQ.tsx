import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is included in a membership follow-up plan?",
    answer: "Membership is for one person. Focused Membership is ₹3,000 for 2 weeks or ₹5,000 per calendar month for one agreed concern and one consultation up to 30 minutes. Integrated Membership is ₹6,000 for 2 weeks or ₹10,000 per calendar month for two related mild, stable concerns and one consultation up to 60 minutes. Comprehensive Membership is ₹12,000 for 2 weeks or ₹20,000 per calendar month for multiple stable concerns and one detailed scheduled consultation. Routine individually prescribed homeopathic medicines and brief clarification of existing instructions during clinic hours are included. It is not insurance or unlimited care. Extra acute care is separately assessed and charged under the acute plans. Delivery, additional services, cancellation and any applicable credit terms are agreed before payment.",
  },
  {
    question: "Can I move to membership after improvement?",
    answer: "Yes, when your physician confirms that monthly follow-up is appropriate. Renewal is optional and based on continuing need. You may complete care when follow-up is no longer needed, or be reassessed for a more frequent care plan if your needs increase. Membership does not replace other clinicians’ treatment; do not stop prescribed medicines without consulting the prescribing clinician.",
  },
  {
    question: "How is my care level and recommended pathway determined?",
    answer:
      "Your physician considers the concerns and organ systems involved, pathological findings, records, and the review or coordination required. These inform the agreed scope; organ count or diagnosis does not automatically multiply the fee. Acute, subacute, chronic and monthly follow-up options serve different needs.",
  },
  {
    question: "Are routine homeopathic medicines included in the care fee?",
    answer:
      "Yes. Every Clinical Care Recommendation includes complete routine homeopathic medicines prescribed and dispensed by Homeo Healthcare for your agreed care period.",
  },
  {
    question: "Is payment requested during the initial assessment submission?",
    answer:
      "No. No payment is requested when you submit your assessment. You will receive an official Clinical Care Quotation after your physician reviews your case.",
  },
  {
    question: "What happens after I accept the official quotation?",
    answer:
      "Upon acceptance, you receive payment instructions via WhatsApp or bank transfer. Once payment is verified by finance, your treatment schedule and medicine dispatch begin immediately.",
  },
  {
    question: "Are concessions available for senior citizens or specific needs?",
    answer:
      "Yes. Senior citizens (Age 60+) and patients with specific socio-economic needs can receive governed concessions subject to physician and care coordinator approval.",
  },
];

export const ClinicalCareFAQ: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section aria-labelledby="faq-heading" className="mb-12">
      <div className="max-w-3xl mb-8">
        <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2 mb-1">
          <HelpCircle className="w-4 h-4 text-mint" aria-hidden="true" />
          Frequently Asked Questions
        </span>
        <h2 id="faq-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#1A2421]">
          Physician-Led Care Questions
        </h2>
        <p className="text-sm font-semibold text-slate-600 mt-2">
          Clear answers regarding clinical assessment, care fees, and physician supervision.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div
              key={idx}
              className="rounded-3xl border border-slate-200/80 bg-white/70 backdrop-blur-md p-6 transition-all duration-200"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between gap-4 text-left text-base font-bold text-[#1A2421] outline-none"
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
                )}
              </button>

              {isOpen && (
                <p className="mt-4 pt-4 border-t border-slate-200/60 text-xs font-semibold text-slate-600 leading-relaxed animate-fadeIn">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
