"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Calendar
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

  // Get learning path dynamically based on selected audience mode
  const steps = useMemo(() => {
    return currentEntity ? generateLearningPath(currentEntity, audienceMode) : [];
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
  }, [currentEntity, audienceMode]);
  
  // Find default active step index (from generation definitions)
  const defaultActiveIndex = steps.findIndex(s => s.isActive);
  const [activeStepIndex, setActiveStepIndex] = useState(defaultActiveIndex !== -1 ? defaultActiveIndex : 0);

  // Helper to parse hashes and paths
  const getHashAndPath = (href: string) => {
    const hashIdx = href.indexOf("#");
    const hash = hashIdx !== -1 ? href.substring(hashIdx) : "";
    const pathWithoutHash = hashIdx !== -1 ? href.substring(0, hashIdx) : href;
    return { hash, pathWithoutHash };
  };

  // Helper to determine if a step is a local anchor link on the current page
  const isLocalHashLink = (href: string) => {
    if (!currentEntity) return false;
    const { hash, pathWithoutHash } = getHashAndPath(href);
    if (href.startsWith("#")) return true;
    if (typeof window !== "undefined") {
      return pathWithoutHash === "" || pathWithoutHash === window.location.pathname;
    }
    return hash !== "" && (pathWithoutHash.includes(currentId) || pathWithoutHash.endsWith(currentEntity.slug));
  };

  // Click handler for local hash navigation
  const handleLocalClick = (e: React.MouseEvent | React.KeyboardEvent, href: string, idx: number) => {
    e.preventDefault();
    const { hash } = getHashAndPath(href);
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", hash);
        setActiveStepIndex(idx);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.history.pushState(null, "", window.location.pathname);
      setActiveStepIndex(idx);
    }
  };

  // Sync active step with changes to the selected audience mode
  useEffect(() => {
    const defaultIdx = steps.findIndex(s => s.isActive);
    setActiveStepIndex(defaultIdx !== -1 ? defaultIdx : 0);
  }, [audienceMode, currentId, steps]);

  // Sync active step with URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const foundIdx = steps.findIndex(s => s.href.endsWith(hash));
        if (foundIdx !== -1) {
          setActiveStepIndex(foundIdx);
        }
      } else {
        const defaultIdx = steps.findIndex(s => s.isActive);
        setActiveStepIndex(defaultIdx !== -1 ? defaultIdx : 0);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [steps]);

  if (!currentEntity) {
    return null;
  }

  const progressPercent = steps.length > 0 ? ((activeStepIndex + 1) / steps.length) * 100 : 0;

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
          <span className="font-bold">Step {activeStepIndex + 1} of {steps.length}</span>
          <span className="tracking-wide text-neutral-400 dark:text-neutral-550">
            {Array.from({ length: steps.length }).map((_, i) => i <= activeStepIndex ? "█" : "░").join("")}
            <span className="ml-2 font-bold text-teal-650 dark:text-teal-400">{Math.round(progressPercent)}%</span>
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
          const isCompleted = idx < activeStepIndex;
          const isActive = idx === activeStepIndex;
          
          // Get step entity if it's a real entity page link
          const stepSlug = step.href.split("/").pop() || "";
          const stepEntity = allEntities.find(e => e.slug === stepSlug);
          const category = stepEntity ? getClinicalCategory(stepEntity) : "general";
          const catColors = CATEGORY_COLORS[category] || CATEGORY_COLORS.general;

          const cardContent = (
            <>
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
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-600 dark:text-teal-400 hover:underline group-hover:text-teal-700 dark:group-hover:text-teal-300"
                  >
                    <span>{step.label}</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                ) : (
                  <span
                    className={`text-[11px] font-semibold hover:underline block leading-snug transition-colors ${
                      isActive 
                        ? "text-teal-600 dark:text-teal-400 font-extrabold" 
                        : "text-neutral-700 dark:text-neutral-300 group-hover:text-teal-500"
                    }`}
                  >
                    {step.label}
                  </span>
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
            </>
          );

          const baseClass = `group flex md:flex-col items-start gap-3 p-3 rounded-2xl transition-all duration-300 border flex-1 min-w-[120px] hover:bg-neutral-50/50 dark:hover:bg-white/5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-500 text-left ${
            isActive 
              ? "bg-white/40 dark:bg-white/5 border-neutral-300 dark:border-neutral-850 scale-[1.02] shadow-md relative" 
              : "border-neutral-200/50 dark:border-neutral-900/50"
          }`;

          if (isLocalHashLink(step.href)) {
            return (
              <div
                key={idx}
                tabIndex={0}
                role="button"
                onClick={(e) => handleLocalClick(e, step.href, idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLocalClick(e, step.href, idx);
                  }
                }}
                className={baseClass}
              >
                {cardContent}
              </div>
            );
          } else {
            return (
              <Link 
                key={idx}
                href={step.href}
                className={baseClass}
              >
                {cardContent}
              </Link>
            );
          }
        })}
      </div>

      {/* Next Step / Navigation advance button */}
      {activeStepIndex < steps.length - 1 && (
        <div className="flex justify-end pt-2 border-t border-neutral-200/10">
          <button
            onClick={(e) => {
              const nextIdx = activeStepIndex + 1;
              const nextStep = steps[nextIdx];
              if (isLocalHashLink(nextStep.href)) {
                handleLocalClick(e, nextStep.href, nextIdx);
              } else {
                window.location.href = nextStep.href;
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <span>Next: {steps[activeStepIndex + 1].label}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
