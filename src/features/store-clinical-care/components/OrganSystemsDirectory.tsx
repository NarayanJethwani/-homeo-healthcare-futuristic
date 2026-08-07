import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Activity,
  Sparkles,
  Heart,
  ShieldAlert,
  Flame,
  Wind,
  ShieldCheck,
  Zap,
  Brain,
  Moon,
  Sparkles as SkinIcon,
  Bone,
  User,
  Baby,
} from "lucide-react";
import { SPECIALTY_CLINICAL_AREAS, type SpecialtyClinicalArea } from "@/lib/specialtyPrograms";
import { calculatePreliminaryCareRecommendation } from "../services/careRecommendationEngine";
import { EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT } from "../domain/types";

interface OrganSystemsDirectoryProps {
  selectedAreaIds?: string[];
  selectedCondition?: string;
  onSelectAreasAndCondition: (selectedAreas: string[], conditionName: string) => void;
  onProceedToAssessment: () => void;
  onProceedToTiers: () => void;
}

const organIconsMap: Record<string, React.ReactNode> = {
  "heart-circulation": <Heart className="w-5 h-5 text-rose-500" aria-hidden="true" />,
  "hormones-metabolism": <Flame className="w-5 h-5 text-emerald-500" aria-hidden="true" />,
  "digestive-liver": <ShieldCheck className="w-5 h-5 text-emerald-600" aria-hidden="true" />,
  "lungs-breathing": <Wind className="w-5 h-5 text-cyan-500" aria-hidden="true" />,
  "allergy-immunity": <Zap className="w-5 h-5 text-lime-500" aria-hidden="true" />,
  "kidney-urinary": <ShieldAlert className="w-5 h-5 text-amber-500" aria-hidden="true" />,
  "brain-nerves": <Brain className="w-5 h-5 text-purple-500" aria-hidden="true" />,
  "emotional-sleep": <Moon className="w-5 h-5 text-indigo-500" aria-hidden="true" />,
  "skin-hair-nails": <SkinIcon className="w-5 h-5 text-teal-500" aria-hidden="true" />,
  "joints-muscles": <Bone className="w-5 h-5 text-orange-500" aria-hidden="true" />,
  "womens-health": <User className="w-5 h-5 text-rose-400" aria-hidden="true" />,
  pediatrics: <Baby className="w-5 h-5 text-blue-500" aria-hidden="true" />,
};

export const OrganSystemsDirectory: React.FC<OrganSystemsDirectoryProps> = ({
  selectedAreaIds = [],
  selectedCondition = "",
  onSelectAreasAndCondition,
  onProceedToAssessment,
  onProceedToTiers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAreaIds, setActiveAreaIds] = useState<string[]>(selectedAreaIds);
  const [activeCondition, setActiveCondition] = useState<string>(selectedCondition);
  const [customConcern, setCustomConcern] = useState("");

  const filteredAreas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SPECIALTY_CLINICAL_AREAS;
    return SPECIALTY_CLINICAL_AREAS.filter((area) =>
      [area.title, area.description, ...area.specialties, ...area.conditions].some((val) =>
        val.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  const activeAreas = useMemo(
    () => SPECIALTY_CLINICAL_AREAS.filter((a) => activeAreaIds.includes(a.id)),
    [activeAreaIds]
  );

  const preliminaryRec = useMemo(() => {
    const areaTitles = activeAreas.map((a) => a.title);
    return calculatePreliminaryCareRecommendation({
      selectedOrganSystems: areaTitles,
    });
  }, [activeAreas]);

  const toggleSelectArea = (area: SpecialtyClinicalArea) => {
    let nextIds: string[];
    if (activeAreaIds.includes(area.id)) {
      nextIds = activeAreaIds.filter((id) => id !== area.id);
    } else {
      nextIds = [...activeAreaIds, area.id];
    }
    setActiveAreaIds(nextIds);
    const selectedTitles = SPECIALTY_CLINICAL_AREAS.filter((a) => nextIds.includes(a.id)).map((a) => a.title);
    onSelectAreasAndCondition(selectedTitles, activeCondition);
  };

  const handleSelectCondition = (cond: string) => {
    setActiveCondition(cond);
    const resolvedCond = cond === "Other or not sure" ? (customConcern || "General Assessment") : cond;
    const selectedTitles = activeAreas.map((a) => a.title);
    onSelectAreasAndCondition(selectedTitles, resolvedCond);
  };

  return (
    <section aria-labelledby="organ-systems-heading" className="mb-12">
      {/* Section Header & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-mint" aria-hidden="true" />
            Organ Systems & Specialty Triage
          </span>
          <h2 id="organ-systems-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#1A2421]">
            Explore Organ Systems & Health Conditions
          </h2>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-2">
            Select one or more organ systems relevant to your health concerns. Our system will generate a preliminary care recommendation for physician review.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="organ-search" className="sr-only">
            Search organ systems and health conditions
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
          <input
            id="organ-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search diabetes, migraine, skin, digestion..."
            className="w-full rounded-full border border-slate-200 bg-white/90 backdrop-blur-md py-3.5 pl-11 pr-5 text-xs font-bold text-[#1A2421] placeholder-slate-400 outline-none focus:border-mint focus:ring-2 focus:ring-mint/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Dynamic Multi-Organ Complexity Indicator Banner */}
      {activeAreaIds.length > 0 && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-mint/15 via-white/80 to-teal-50/80 border border-mint/30 shadow-md backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-mint text-white px-3 py-1 rounded-full">
                {activeAreaIds.length} {activeAreaIds.length === 1 ? "Organ System" : "Organ Systems"} Selected
              </span>
              <span className="text-xs font-bold text-mint-dark">
                Preliminary Care Recommendation: <span className="underline">{preliminaryRec.suggestedTierName}</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              {preliminaryRec.rationale}
            </p>
            <p className="text-[11px] font-semibold italic text-slate-500 border-t border-slate-200/60 pt-2">
              {EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onProceedToAssessment}
              className="px-6 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
            >
              <span>Begin Assessment</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Organ System Cards Grid with Micro-Interactions & Hover Lift */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredAreas.map((area) => {
          const isSelected = activeAreaIds.includes(area.id);
          const icon = organIconsMap[area.id] || <Stethoscope className="w-5 h-5 text-mint" aria-hidden="true" />;

          return (
            <div
              key={area.id}
              onClick={() => toggleSelectArea(area)}
              className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                isSelected
                  ? "border-mint bg-mint/[0.08] shadow-md ring-2 ring-mint/30"
                  : "border-slate-200/80 bg-white/70 hover:border-mint/40 hover:bg-white/90 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 rounded-2xl bg-white/90 shadow-sm border border-slate-100">
                      {icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                      {area.specialties.join(", ")}
                    </span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-mint shrink-0" aria-hidden="true" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                  )}
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1A2421] mb-2">{area.title}</h3>
                <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-4">{area.description}</p>
              </div>

              {/* Conditions Chip List Preview */}
              <div className="pt-3 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  Conditions Covered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {area.conditions.slice(0, 3).map((cond) => (
                    <span
                      key={cond}
                      className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {cond}
                    </span>
                  ))}
                  {area.conditions.length > 3 && (
                    <span className="text-[10px] font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-md">
                      +{area.conditions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conditions Selector Panel for Selected Systems */}
      {activeAreas.length > 0 && (
        <div className="rounded-3xl border border-mint/30 bg-white/90 backdrop-blur-md p-6 md:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold text-mint uppercase tracking-widest block mb-1">
                Step 3: Specific Condition Selection
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A2421]">
                Select Specific Condition or Concern
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Showing primary conditions across your {activeAreas.length} selected organ {activeAreas.length === 1 ? "system" : "systems"}:
              </p>
            </div>

            <button
              type="button"
              onClick={onProceedToAssessment}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              <span>Continue to Clinical Assessment</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {activeAreas.flatMap((area) => area.conditions).map((cond) => {
              const isCondSelected = activeCondition === cond;
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => handleSelectCondition(cond)}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    isCondSelected
                      ? "border-mint bg-mint/15 text-mint-dark ring-2 ring-mint/30 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{cond}</span>
                  {isCondSelected && <CheckCircle2 className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleSelectCondition("Other or not sure")}
              className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeCondition === "Other or not sure"
                  ? "border-mint bg-mint/15 text-mint-dark ring-2 ring-mint/30 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span>Other or not sure</span>
              {activeCondition === "Other or not sure" && (
                <CheckCircle2 className="w-4 h-4 text-mint shrink-0" aria-hidden="true" />
              )}
            </button>
          </div>

          {activeCondition === "Other or not sure" && (
            <div className="mt-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <label htmlFor="custom-concern-input" className="block text-xs font-bold text-[#1A2421] mb-2">
                Specify your health concern:
              </label>
              <input
                id="custom-concern-input"
                type="text"
                value={customConcern}
                onChange={(e) => {
                  setCustomConcern(e.target.value);
                  const selectedTitles = activeAreas.map((a) => a.title);
                  onSelectAreasAndCondition(selectedTitles, e.target.value || "Other or not sure");
                }}
                placeholder="e.g., Unspecified gastrointestinal discomfort, joint stiffness..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
