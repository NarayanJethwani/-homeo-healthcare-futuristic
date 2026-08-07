import React, { useState, useMemo } from "react";
import { Search, CheckCircle2, ChevronRight, Stethoscope, Activity, Sparkles } from "lucide-react";
import { SPECIALTY_CLINICAL_AREAS, type SpecialtyClinicalArea } from "@/lib/specialtyPrograms";

interface OrganSystemsDirectoryProps {
  selectedAreaId?: string;
  selectedCondition?: string;
  onSelectAreaAndCondition: (areaTitle: string, conditionName: string) => void;
  onProceedToTiers: () => void;
}

export const OrganSystemsDirectory: React.FC<OrganSystemsDirectoryProps> = ({
  selectedAreaId,
  selectedCondition,
  onSelectAreaAndCondition,
  onProceedToTiers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAreaId, setActiveAreaId] = useState<string | null>(selectedAreaId || null);
  const [activeCondition, setActiveCondition] = useState<string>(selectedCondition || "");
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

  const activeArea = useMemo(
    () => SPECIALTY_CLINICAL_AREAS.find((a) => a.id === activeAreaId) || null,
    [activeAreaId]
  );

  const handleSelectArea = (area: SpecialtyClinicalArea) => {
    setActiveAreaId(area.id);
    setActiveCondition("");
    setCustomConcern("");
    onSelectAreaAndCondition(area.title, "");
  };

  const handleSelectCondition = (areaTitle: string, cond: string) => {
    setActiveCondition(cond);
    const resolvedCond = cond === "Other or not sure" ? (customConcern || "General Assessment") : cond;
    onSelectAreaAndCondition(areaTitle, resolvedCond);
  };

  return (
    <section aria-labelledby="organ-systems-heading" className="mb-12">
      {/* Section Header & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-mint uppercase tracking-widest flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5" aria-hidden="true" />
            Organ Systems & Specialty Clinical Care
          </span>
          <h2 id="organ-systems-heading" className="font-serif text-3xl md:text-4xl font-bold text-[#1A2421]">
            Explore Primary Organ Systems & Health Conditions
          </h2>
          <p className="text-sm font-semibold text-slate-600 leading-relaxed mt-2">
            Homeopathic care is formulated for your complete symptom profile. Browse our specialty organ system areas or search by your familiar condition below.
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

      {/* Organ System Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {filteredAreas.map((area) => {
          const isSelected = activeAreaId === area.id;
          return (
            <div
              key={area.id}
              onClick={() => handleSelectArea(area)}
              className={`cursor-pointer rounded-3xl border p-6 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-mint bg-mint/[0.06] shadow-md ring-2 ring-mint/20"
                  : "border-slate-200/80 bg-white/70 hover:border-mint/40 hover:bg-white/90 shadow-sm"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-mint bg-mint/10 px-2.5 py-1 rounded-full">
                    {area.specialties.join(", ")}
                  </span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />}
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
                    <span className="text-[10px] font-bold text-mint bg-mint/5 px-2 py-0.5 rounded-md">
                      +{area.conditions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Condition Selector Panel for Selected Organ System */}
      {activeArea && (
        <div className="rounded-3xl border border-mint/30 bg-white/90 backdrop-blur-md p-6 md:p-8 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-6">
            <div>
              <span className="text-xs font-bold text-mint uppercase tracking-widest block mb-1">
                Selected Organ System
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A2421] flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-mint" aria-hidden="true" />
                {activeArea.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">{activeArea.supportBoundary}</p>
            </div>

            <button
              type="button"
              onClick={onProceedToTiers}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mint hover:bg-mint-dark text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0"
            >
              <span>View Care Tiers Below</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <label className="block text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-3">
            Select Your Primary Condition or Concern in {activeArea.title}:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {activeArea.conditions.map((cond) => {
              const isCondSelected = activeCondition === cond;
              return (
                <button
                  key={cond}
                  type="button"
                  onClick={() => handleSelectCondition(activeArea.title, cond)}
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
              onClick={() => handleSelectCondition(activeArea.title, "Other or not sure")}
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
                  onSelectAreaAndCondition(activeArea.title, e.target.value || "Other or not sure");
                }}
                placeholder="e.g., Unspecified gastrointestinal discomfort, joint stiffness..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20"
              />
            </div>
          )}

          {activeCondition && (
            <div className="mt-6 p-4 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-mint shrink-0" aria-hidden="true" />
                <span className="text-xs font-bold text-[#1A2421]">
                  Selected: <span className="text-mint-dark">{activeArea.title}</span> — {" "}
                  <span className="underline">{activeCondition === "Other or not sure" ? (customConcern || activeCondition) : activeCondition}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onProceedToTiers}
                className="text-xs font-extrabold text-mint hover:text-mint-dark underline uppercase tracking-wider shrink-0"
              >
                Proceed to Care Tiers ↓
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
