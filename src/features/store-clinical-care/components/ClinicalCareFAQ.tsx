import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

import { MEMBERSHIP_ALLOWANCE, UNUSED_FEES_POLICY } from "./CarePlanContent";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  { question: "How do I choose a plan?", answer: "Start with a recent concern, an ongoing problem or stable follow-up. Your doctor reviews your history, the organ systems involved, relevant reports and the follow-up needed before confirming the plan. You do not need to diagnose yourself or choose a level before asking for help." },
  { question: "What is included in a membership follow-up plan?", answer: "Membership is for one person with mild, stable concerns suitable for lower-intensity care. It includes case review, constitutional follow-up where appropriate, routine prescribed homeopathic medicines and brief clarification of existing instructions during clinic hours. Focused covers one agreed concern, Integrated covers related concerns involving two organ systems, and Comprehensive covers multiple agreed organ systems as required. New acute care is assessed and charged separately. Membership is not insurance or unlimited care." },
  { question: "How many consultations are included in two weeks or a month?", answer: MEMBERSHIP_ALLOWANCE + " Consultation length follows the needs of the agreed case; the plans are compared by care scope rather than a fixed minute allowance. Additional consultations or a need for more frequent care require reassessment and an agreed quotation." },
  { question: "Can I move to membership after improvement, or finish care?", answer: "Your doctor can recommend membership when the concern is stable and less frequent review is appropriate. Improvement alone does not automatically determine the plan. You can complete care when follow-up is no longer needed; renewal is optional. Do not stop or change another clinician’s prescribed treatment without consulting them." },
  { question: "What happens to unused fees if I finish early or change plans?", answer: UNUSED_FEES_POLICY + " Discuss this before choosing a longer prepaid period. A family member needs their own assessment and suitable plan; memberships remain individual." },
  { question: "I am returning with a new concern. Do I need a new assessment?", answer: "Yes. We use your previous records and assess the new concern afresh, including whether it is related to an earlier problem. Your previous plan does not automatically restart. Your doctor recommends acute care, chronic care or membership according to the current need." },
  { question: "Can I request a concession or start directly with membership?", answer: "Senior citizens aged 60 and above and people facing financial hardship can request a private concession review. Direct membership is possible if the doctor finds it suitable. If more active care is needed, a concession can be considered for that plan. Any approved concession and the final fee are confirmed before payment." },
  { question: "Are medicines, delivery and other products included?", answer: "Routine homeopathic medicines prescribed and dispensed by Homeo Healthcare are included for the agreed period. Specialised or branded products, courier charges and additional services may cost extra. Any additional fee is explained and agreed before payment." },
  { question: "How do consultation and support arrangements work?", answer: "Consultations are by appointment. In-person or online review is arranged according to suitability; some concerns require examination, investigations or referral. Brief clarification of existing instructions is available during clinic hours, rather than continuous monitoring. Contact the clinic to confirm current hours and availability." },
  { question: "What happens after I request a review?", answer: "The four-step form prepares a WhatsApp message for you to review and send to the clinic. Completing the form alone does not send the request. Your doctor then reviews the information, confirms any assessment needed and shares the care scope and quotation. Payment, appointment and medicine delivery arrangements are confirmed with you before care begins." },
];

export const ClinicalCareFAQ: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

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
          Questions before you choose
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
                aria-expanded={isOpen}
                aria-controls={`care-faq-${idx}`}
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
                <p id={`care-faq-${idx}`} className="mt-4 pt-4 border-t border-slate-200/60 text-sm font-semibold text-slate-600 leading-relaxed animate-fadeIn">
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
