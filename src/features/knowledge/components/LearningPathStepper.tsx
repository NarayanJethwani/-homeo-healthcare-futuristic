"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePatientMode } from "../context/PatientModeContext";
import { Award, CheckCircle, ArrowRight, User, Stethoscope } from "lucide-react";

interface Step {
  label: string;
  href?: string;
  isActive: boolean;
}

interface LearningPathStepperProps {
  currentId: string;
}

export default function LearningPathStepper({ currentId }: LearningPathStepperProps) {
  const { audienceMode } = usePatientMode();
  const [journeyType, setJourneyType] = useState<"patient" | "practitioner">(
    audienceMode === "practitioner" ? "practitioner" : "patient"
  );

  // Mapped pathways based on current active ID
  let steps: Step[] = [];

  if (journeyType === "patient") {
    // Patient Path
    steps = [
      { label: "Heartburn Symptom", href: "/knowledge/symptoms/heartburn", isActive: currentId === "S0001" },
      { label: "GERD Disease Profile", href: "/knowledge/diseases/gerd", isActive: currentId === "D0001" },
      { label: "Lifestyle Advice", href: "/knowledge/diet-lifestyle", isActive: false },
      { label: "Nux Vomica Remedy", href: "/knowledge/remedies/nux-vomica", isActive: currentId === "R0002" },
      { label: "CBC Lab Test", href: "/knowledge/lab-tests/cbc", isActive: currentId === "L0001" }
    ];
  } else {
    // Practitioner Path
    steps = [
      { label: "GERD Clinical Profile", href: "/knowledge/diseases/gerd", isActive: currentId === "D0001" },
      { label: "Differential Diagnostics", href: "/knowledge/compare/gerd-vs-gastritis", isActive: false },
      { label: "Symptom presentation", href: "/knowledge/symptoms/heartburn", isActive: currentId === "S0001" },
      { label: "Remedy Comparison", href: "/knowledge/compare/nux-vomica-vs-lycopodium", isActive: false },
      { label: "Scientific Research", href: "/knowledge/research", isActive: false }
    ];
  }

  // Find active step index
  const activeIndex = steps.findIndex(s => s.isActive);

  return (
    <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 backdrop-blur-md space-y-4 print-hide">
      
      {/* Top control toggle */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold tracking-wider">Guided Journey</span>
          <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Recommended Learning Path</h4>
        </div>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 border border-neutral-200 dark:border-neutral-900 rounded-xl">
          <button
            onClick={() => setJourneyType("patient")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              journeyType === "patient"
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                : "bg-transparent text-neutral-500"
            }`}
          >
            <User className="h-3 w-3" /> Patient Path
          </button>
          <button
            onClick={() => setJourneyType("practitioner")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
              journeyType === "practitioner"
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                : "bg-transparent text-neutral-500"
            }`}
          >
            <Stethoscope className="h-3 w-3" /> Practitioner Path
          </button>
        </div>
      </div>

      {/* Steps visualization line */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2 pt-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <React.Fragment key={idx}>
              {/* Step bubble */}
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                    : isActive
                    ? "bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/45 animate-pulse"
                    : "bg-neutral-100 dark:bg-neutral-950 text-neutral-500 border border-neutral-200 dark:border-neutral-900"
                }`}>
                  {isCompleted ? <CheckCircle className="h-3.5 w-3.5" /> : idx + 1}
                </div>
                
                {step.href ? (
                  <Link
                    href={step.href}
                    className={`text-[11px] font-semibold hover:underline ${
                      isActive ? "text-teal-600 dark:text-teal-400 font-bold" : "text-neutral-600 dark:text-neutral-350"
                    }`}
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span className="text-[11px] font-semibold text-neutral-500">{step.label}</span>
                )}
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-neutral-300 dark:text-neutral-850 hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
}
