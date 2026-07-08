"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePatientMode } from "../context/PatientModeContext";
import { 
  CheckCircle, 
  ArrowRight, 
  User, 
  Stethoscope, 
  GraduationCap, 
  Activity, 
  Pill, 
  FlaskConical, 
  BookOpen, 
  Calendar, 
  Sparkles 
} from "lucide-react";
import { getAllKnowledgeEntities } from "../index";
import { generateLearningPath, getClinicalCategory, CATEGORY_COLORS, LearningPathStep } from "../graph/learningPathService";

interface LearningPathStepperProps {
  currentId: string;
}

export default function LearningPathStepper({ currentId }: LearningPathStepperProps) {
  const { audienceMode, setAudienceMode } = usePatientMode();
  
  // Find current entity
  const allEntities = getAllKnowledgeEntities();
  const currentEntity = allEntities.find(e => e.id === currentId);

  if (!currentEntity) {
    return null;
  }

  // Get learning path dynamically based on selected audience mode
  const steps = generateLearningPath(currentEntity, audienceMode);
  
  // Find active step index
  const activeIndex = steps.findIndex(s => s.isActive);
  const progressPercent = steps.length > 0 ? ((activeIndex + 1) / steps.length) * 100 : 0;

  // Helper to render entity type icons dynamically
  const getStepIcon = (type: LearningPathStep["type"]) => {
    switch (type) {
      case "disease":
        return <Stethoscope className="h-3.5 w-3.5" />;
      case "symptom":
        return <Activity className="h-3.5 w-3.5" />;
      case "remedy":
        return <Pill className="h-3.5 w-3.5" />;
      case "lab-test":
        return <FlaskConical className="h-3.5 w-3.5" />;
      case "info":
        return <BookOpen className="h-3.5 w-3.5" />;
      case "cta":
        return <Calendar className="h-3.5 w-3.5" />;
      default:
        return <BookOpen className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-850 rounded-3xl bg-white/5 backdrop-blur-md space-y-6 print-hide shadow-lg transition-all duration-300">
      
      {/* Top control toggle header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-extrabold tracking-widest">
            Guided Educational Journey
          </span>
          <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
            Intelligent Context-Aware Learning Path
          </h4>
        </div>

        {/* 3-way toggle for Audience Selection */}
        <div className="flex items-center gap-0.5 bg-neutral-100/80 dark:bg-neutral-950 p-1 border border-neutral-200 dark:border-neutral-900 rounded-xl shadow-inner">
          {(["patient", "student", "practitioner"] as const).map(mode => {
            const isSelected = audienceMode === mode;
            const icons = {
              patient: <User className="h-3 w-3" />,
              student: <GraduationCap className="h-3 w-3" />,
              practitioner: <Stethoscope className="h-3 w-3" />
            };
            return (
              <button
                key={mode}
                onClick={() => setAudienceMode(mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-sm"
                    : "bg-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {icons[mode]}
                <span>{mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar and Indicator */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
          <span className="font-bold">Step {activeIndex + 1} of {steps.length}</span>
          <span className="tracking-wide text-neutral-400 dark:text-neutral-500">
            {Array.from({ length: steps.length }).map((_, i) => i <= activeIndex ? "█" : "░").join("")}
            <span className="ml-2 font-bold text-teal-600 dark:text-teal-400">{Math.round(progressPercent)}%</span>
          </span>
        </div>
        <div className="w-full bg-neutral-100 dark:bg-neutral-950 h-2 rounded-full overflow-hidden relative border border-neutral-200/10">
          <div 
            className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps visualization line */}
      <div className="flex flex-col md:flex-row flex-wrap lg:flex-nowrap justify-between gap-4 pt-2">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          
          // Get step entity if it's a real entity page link
          const stepSlug = step.href.split("/").pop() || "";
          const stepEntity = allEntities.find(e => e.slug === stepSlug);
          const category = stepEntity ? getClinicalCategory(stepEntity) : "general";
          const catColors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

          return (
            <div 
              key={idx} 
              className={`flex md:flex-col items-start gap-3 p-3 rounded-2xl transition-all duration-300 border flex-1 min-w-[120px] ${
                isActive 
                  ? "bg-white/40 dark:bg-white/5 border-neutral-300 dark:border-neutral-850 scale-[1.02] shadow-md relative" 
                  : "border-transparent"
              }`}
            >
              {/* Number and icon bubble */}
              <div className="flex items-center gap-2 md:w-full md:justify-between">
                <div className={`h-8 w-8 rounded-2xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-all ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                    : isActive
                    ? `${catColors.bg} ${catColors.text} ${catColors.border} border shadow-[0_0_12px_rgba(20,184,166,0.15)]`
                    : "bg-neutral-100 dark:bg-neutral-950 text-neutral-500 border border-neutral-200 dark:border-neutral-900"
                }`}>
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>

                {/* Entity Icon Indicator */}
                <div className={`hidden md:flex items-center justify-center h-7 w-7 rounded-xl ${
                  isActive ? catColors.bg + " " + catColors.text : "text-neutral-400 dark:text-neutral-600 bg-neutral-150 dark:bg-neutral-900"
                }`}>
                  {getStepIcon(step.type)}
                </div>
              </div>
              
              {/* Step info labels */}
              <div className="space-y-1">
                {step.type === "cta" ? (
                  <Link
                    href={step.href}
                    className="group inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-600 dark:text-teal-400 hover:underline hover:text-teal-700 dark:hover:text-teal-300"
                  >
                    <span>{step.label}</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link
                    href={step.href}
                    className={`text-[11px] font-semibold hover:underline block leading-snug transition-colors ${
                      isActive 
                        ? "text-teal-600 dark:text-teal-400 font-extrabold" 
                        : "text-neutral-700 dark:text-neutral-300 hover:text-teal-500"
                    }`}
                  >
                    {step.label}
                  </Link>
                )}
                
                {/* Short descriptive labels */}
                {step.description && (
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-tight">
                    {step.description}
                  </p>
                )}

                {/* Reading time indicator */}
                {step.readingTimeMinutes !== undefined && (
                  <span className="inline-block text-[8px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 font-mono">
                    {step.readingTimeMinutes} min read
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
