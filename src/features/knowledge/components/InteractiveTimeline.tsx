"use client";

import React, { useState } from "react";
import { KnowledgeEntity, TimelineStage } from "../types";
import { Activity, Clock, FileText, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

interface InteractiveTimelineProps {
  entity: KnowledgeEntity;
}

export default function InteractiveTimeline({ entity }: InteractiveTimelineProps) {
  const isDisease = entity.entityType === "disease";
  const isLab = entity.entityType === "lab-test";

  // Hide for other types
  if (!isDisease && !isLab) return null;

  // Set default timeline stages if not explicitly defined in the entity content
  const defaultDiseaseTimeline: TimelineStage[] = [
    {
      stage: "risk-factors",
      title: "Risk Factors & Triggers",
      description: "Underlying clinical predispositions, familial autoimmune markers, genetic anomalies, or environmental catalysts that establish susceptibility.",
      pearl: "Early screening of relatives with similar patterns is highly recommended."
    },
    {
      stage: "early-symptoms",
      title: "Early Symptoms",
      description: "Prodromal onset phase. Subtle physiological shifts, mild fatigue, low-grade homeostatic disruptions that often go unrecognized.",
      pearl: "Clinicians should look for multiple sub-clinical keynotes presenting together."
    },
    {
      stage: "progression",
      title: "Active Progression",
      description: "Full clinical manifestation of the pathology. Manifests with clear physiological, diagnostic, or biochemical changes.",
      pearl: "Diagnostic testing is most conclusive during this active baseline phase."
    },
    {
      stage: "complications",
      title: "Potential Complications",
      description: "Unchecked trajectory outcomes. Irreversible tissue damage, glandular dysfunction, or critical systemic deterioration.",
      pearl: "Red flag symptoms are frequently triggered in this stage."
    },
    {
      stage: "recovery",
      title: "Recovery Pathway",
      description: "Therapeutic resolution phase. Gradual reduction in systemic reactivity, symptomatic relief, and return of cellular homeostatic balance.",
      pearl: "Observe Hering's Law of Cure during structural recovery phases."
    },
    {
      stage: "monitoring",
      title: "Long-term Monitoring",
      description: "Preventative control phase. Periodic diagnostic lab checks, constitutional follow-up consultations, and lifestyle optimization.",
      pearl: "Ensure annual serum test reviews to prevent silent pathology recurrence."
    }
  ];

  const defaultLabTimeline: TimelineStage[] = [
    {
      stage: "clinical-workflow",
      title: "1. Clinical Indication",
      description: "Ordering protocols based on clinical indications, presenting symptoms, or screening guidelines.",
      pearl: "Order when screening for primary organ dysfunctions or monitoring active treatment efficacy."
    },
    {
      stage: "patient-preparation",
      title: "2. Patient Preparation",
      description: "Pre-analytical requirements such as overnight fasting, temporary cessation of specific supplements, or morning collection timing.",
      pearl: "Ensuring proper patient compliance is critical for accurate baseline results."
    },
    {
      stage: "sample-collection",
      title: "3. Specimen Collection",
      description: "Standard venipuncture guidelines, specimen container requirements, and preservation constraints.",
      pearl: "Immediate laboratory transport is required to prevent sample degradation."
    },
    {
      stage: "interpretation",
      title: "4. Lab Interpretation",
      description: "Evaluation of raw numeric values against age/gender-adjusted reference ranges, including borderline deviations.",
      pearl: "Compare with previous parameters to establish individual longitudinal trends."
    },
    {
      stage: "follow-up-investigation",
      title: "5. Follow-up Reflexes",
      description: "Recommended confirmation assays or reflex panels to run if results are significantly abnormal.",
      pearl: "Abnormal values always require clinical validation alongside active patient symptoms."
    }
  ];

  // Retrieve timeline stages from database entity, falling back to defaults
  const stages = entity.clinicalTimeline || (isDisease ? defaultDiseaseTimeline : defaultLabTimeline);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStage = stages[activeIndex];

  if (!currentStage) return null;

  return (
    <div className="my-8 rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-md print:border-neutral-400 print:bg-transparent">
      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 mb-4 border-b border-neutral-500/5 pb-2 print:text-neutral-900">
        <Activity className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        {isDisease ? "Disease Progression Timeline" : "Laboratory Interpretation Workflow"}
      </h3>

      {/* Horizontal Timeline Track */}
      <div className="relative flex justify-between items-center mb-8 overflow-x-auto pb-4 pt-2">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-250 dark:bg-neutral-800 -translate-y-1/2 z-0 hidden sm:block" />

        {stages.map((stg, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <button
              key={stg.stage}
              onClick={() => setActiveIndex(index)}
              className="relative z-10 flex flex-col items-center group focus:outline-none min-w-[80px]"
            >
              <div 
                className={`h-9 w-9 rounded-full flex items-center justify-between border-2 transition-all duration-300 ${
                  isActive 
                    ? "bg-teal-600 border-teal-600 text-white scale-110 shadow-md shadow-teal-500/20" 
                    : isPast 
                    ? "bg-teal-500/10 border-teal-500 text-teal-600" 
                    : "bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:border-neutral-400"
                }`}
              >
                <div className="w-full text-center flex items-center justify-center">
                  {isPast ? <CheckCircle className="h-4.5 w-4.5" /> : <span className="text-xs font-bold">{index + 1}</span>}
                </div>
              </div>
              <span className={`text-[10px] font-bold mt-2 text-center transition-colors max-w-[90px] ${
                isActive ? "text-teal-600 dark:text-teal-400 font-extrabold" : "text-neutral-500 dark:text-neutral-450"
              }`}>
                {stg.title.split(" ").slice(0, 2).join(" ")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      <div className="rounded-xl border border-neutral-500/10 bg-neutral-500/5 p-5 transition-all duration-300">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-teal-600 dark:text-teal-400">
              Stage {activeIndex + 1} of {stages.length}
            </span>
            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {currentStage.title}
            </h4>
          </div>
          <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
        </div>
        
        <p className="text-xs text-neutral-750 dark:text-neutral-350 leading-relaxed mb-4">
          {currentStage.description}
        </p>

        {currentStage.pearl && (
          <div className="flex gap-2 p-3 rounded-lg bg-teal-500/5 border border-teal-500/10 text-xs">
            <AlertTriangle className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="text-neutral-800 dark:text-neutral-300 italic">
              <strong>Clinical Pearl:</strong> {currentStage.pearl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
