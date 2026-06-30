"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { generateFAQSchema } from "../schemas/jsonLdSchemas";

interface LocalizedFAQItem {
  question: Record<string, string> | string;
  answer: Record<string, string> | string;
}

interface FAQBlockProps {
  faqs: LocalizedFAQItem[];
  locale?: string;
}

export default function FAQBlock({ faqs, locale = "en" }: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  // Resolve localized strings for search and display
  const resolvedFaqs = faqs.map(faq => {
    const question = typeof faq.question === "string" ? faq.question : (faq.question[locale] || faq.question["en"] || "");
    const answer = typeof faq.answer === "string" ? faq.answer : (faq.answer[locale] || faq.answer["en"] || "");
    return { question, answer };
  });

  const schemaJson = generateFAQSchema(resolvedFaqs);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="my-8">
      {/* Inject Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 mb-6">
        <HelpCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" /> Frequently Asked Questions
      </h3>

      <div className="space-y-4">
        {resolvedFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-neutral-500/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-5 text-left font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-500/5 transition-colors duration-200"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-neutral-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-neutral-500/5" : "max-h-0"
                }`}
              >
                <div className="p-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
