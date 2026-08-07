import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  ChevronRight,
  Stethoscope,
  Activity,
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
  Eye,
  Activity as AgeingIcon,
  Crosshair,
  RefreshCw,
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

interface OrganSystemTheme {
  borderUnselected: string;
  bgUnselected: string;
  hoverUnselected: string;
  borderSelected: string;
  bgSelected: string;
  ringSelected: string;
  shadowSelected: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  chipBg: string;
  chipText: string;
}

const organThemesMap: Record<string, OrganSystemTheme> = {
  "heart-circulation": {
    borderUnselected: "border-rose-200/90",
    bgUnselected: "bg-rose-50/40",
    hoverUnselected: "hover:border-rose-300 hover:bg-rose-50/80",
    borderSelected: "border-rose-500",
    bgSelected: "bg-rose-500/10",
    ringSelected: "ring-2 ring-rose-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(244,63,94,0.2)]",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    badgeBg: "bg-rose-100/90 border border-rose-200",
    badgeText: "text-rose-900",
    chipBg: "bg-rose-100/70",
    chipText: "text-rose-900",
  },
  "hormones-metabolism": {
    borderUnselected: "border-amber-200/90",
    bgUnselected: "bg-amber-50/40",
    hoverUnselected: "hover:border-amber-300 hover:bg-amber-50/80",
    borderSelected: "border-amber-500",
    bgSelected: "bg-amber-500/10",
    ringSelected: "ring-2 ring-amber-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(245,158,11,0.2)]",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100/90 border border-amber-200",
    badgeText: "text-amber-900",
    chipBg: "bg-amber-100/70",
    chipText: "text-amber-900",
  },
  "digestive-liver": {
    borderUnselected: "border-emerald-200/90",
    bgUnselected: "bg-emerald-50/40",
    hoverUnselected: "hover:border-emerald-300 hover:bg-emerald-50/80",
    borderSelected: "border-emerald-500",
    bgSelected: "bg-emerald-500/10",
    ringSelected: "ring-2 ring-emerald-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(16,185,129,0.2)]",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-100/90 border border-emerald-200",
    badgeText: "text-emerald-900",
    chipBg: "bg-emerald-100/70",
    chipText: "text-emerald-900",
  },
  "lungs-breathing": {
    borderUnselected: "border-sky-200/90",
    bgUnselected: "bg-sky-50/40",
    hoverUnselected: "hover:border-sky-300 hover:bg-sky-50/80",
    borderSelected: "border-sky-500",
    bgSelected: "bg-sky-500/10",
    ringSelected: "ring-2 ring-sky-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(14,165,233,0.2)]",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-100/90 border border-sky-200",
    badgeText: "text-sky-900",
    chipBg: "bg-sky-100/70",
    chipText: "text-sky-900",
  },
  "allergy-immunity": {
    borderUnselected: "border-violet-200/90",
    bgUnselected: "bg-violet-50/40",
    hoverUnselected: "hover:border-violet-300 hover:bg-violet-50/80",
    borderSelected: "border-violet-500",
    bgSelected: "bg-violet-500/10",
    ringSelected: "ring-2 ring-violet-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(139,92,246,0.2)]",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    badgeBg: "bg-violet-100/90 border border-violet-200",
    badgeText: "text-violet-900",
    chipBg: "bg-violet-100/70",
    chipText: "text-violet-900",
  },
  "kidney-urinary": {
    borderUnselected: "border-blue-200/90",
    bgUnselected: "bg-blue-50/40",
    hoverUnselected: "hover:border-blue-300 hover:bg-blue-50/80",
    borderSelected: "border-blue-500",
    bgSelected: "bg-blue-500/10",
    ringSelected: "ring-2 ring-blue-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(59,130,246,0.2)]",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-100/90 border border-blue-200",
    badgeText: "text-blue-900",
    chipBg: "bg-blue-100/70",
    chipText: "text-blue-900",
  },
  "brain-nerves": {
    borderUnselected: "border-fuchsia-200/90",
    bgUnselected: "bg-fuchsia-50/40",
    hoverUnselected: "hover:border-fuchsia-300 hover:bg-fuchsia-50/80",
    borderSelected: "border-fuchsia-500",
    bgSelected: "bg-fuchsia-500/10",
    ringSelected: "ring-2 ring-fuchsia-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(217,70,239,0.2)]",
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
    badgeBg: "bg-fuchsia-100/90 border border-fuchsia-200",
    badgeText: "text-fuchsia-900",
    chipBg: "bg-fuchsia-100/70",
    chipText: "text-fuchsia-900",
  },
  "emotional-sleep": {
    borderUnselected: "border-indigo-200/90",
    bgUnselected: "bg-indigo-50/40",
    hoverUnselected: "hover:border-indigo-300 hover:bg-indigo-50/80",
    borderSelected: "border-indigo-500",
    bgSelected: "bg-indigo-500/10",
    ringSelected: "ring-2 ring-indigo-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(99,102,241,0.2)]",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    badgeBg: "bg-indigo-100/90 border border-indigo-200",
    badgeText: "text-indigo-900",
    chipBg: "bg-indigo-100/70",
    chipText: "text-indigo-900",
  },
  "skin-hair-nails": {
    borderUnselected: "border-teal-200/90",
    bgUnselected: "bg-teal-50/40",
    hoverUnselected: "hover:border-teal-300 hover:bg-teal-50/80",
    borderSelected: "border-teal-500",
    bgSelected: "bg-teal-500/10",
    ringSelected: "ring-2 ring-teal-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(20,184,166,0.2)]",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    badgeBg: "bg-teal-100/90 border border-teal-200",
    badgeText: "text-teal-900",
    chipBg: "bg-teal-100/70",
    chipText: "text-teal-900",
  },
  "joints-spine-mobility": {
    borderUnselected: "border-orange-200/90",
    bgUnselected: "bg-orange-50/40",
    hoverUnselected: "hover:border-orange-300 hover:bg-orange-50/80",
    borderSelected: "border-orange-500",
    bgSelected: "bg-orange-500/10",
    ringSelected: "ring-2 ring-orange-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(249,115,22,0.2)]",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badgeBg: "bg-orange-100/90 border border-orange-200",
    badgeText: "text-orange-900",
    chipBg: "bg-orange-100/70",
    chipText: "text-orange-900",
  },
  "womens-health": {
    borderUnselected: "border-pink-200/90",
    bgUnselected: "bg-pink-50/40",
    hoverUnselected: "hover:border-pink-300 hover:bg-pink-50/80",
    borderSelected: "border-pink-500",
    bgSelected: "bg-pink-500/10",
    ringSelected: "ring-2 ring-pink-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(236,72,153,0.2)]",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    badgeBg: "bg-pink-100/90 border border-pink-200",
    badgeText: "text-pink-900",
    chipBg: "bg-pink-100/70",
    chipText: "text-pink-900",
  },
  ent: {
    borderUnselected: "border-cyan-200/90",
    bgUnselected: "bg-cyan-50/40",
    hoverUnselected: "hover:border-cyan-300 hover:bg-cyan-50/80",
    borderSelected: "border-cyan-500",
    bgSelected: "bg-cyan-500/10",
    ringSelected: "ring-2 ring-cyan-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(6,182,212,0.2)]",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    badgeBg: "bg-cyan-100/90 border border-cyan-200",
    badgeText: "text-cyan-900",
    chipBg: "bg-cyan-100/70",
    chipText: "text-cyan-900",
  },
  "eye-comfort": {
    borderUnselected: "border-indigo-200/90",
    bgUnselected: "bg-indigo-50/40",
    hoverUnselected: "hover:border-indigo-300 hover:bg-indigo-50/80",
    borderSelected: "border-indigo-500",
    bgSelected: "bg-indigo-500/10",
    ringSelected: "ring-2 ring-indigo-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(99,102,241,0.2)]",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    badgeBg: "bg-indigo-100/90 border border-indigo-200",
    badgeText: "text-indigo-900",
    chipBg: "bg-indigo-100/70",
    chipText: "text-indigo-900",
  },
  "child-adolescent": {
    borderUnselected: "border-amber-200/90",
    bgUnselected: "bg-amber-50/40",
    hoverUnselected: "hover:border-amber-300 hover:bg-amber-50/80",
    borderSelected: "border-amber-500",
    bgSelected: "bg-amber-500/10",
    ringSelected: "ring-2 ring-amber-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(245,158,11,0.2)]",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    badgeBg: "bg-amber-100/90 border border-amber-200",
    badgeText: "text-amber-900",
    chipBg: "bg-amber-100/70",
    chipText: "text-amber-900",
  },
  "healthy-ageing": {
    borderUnselected: "border-purple-200/90",
    bgUnselected: "bg-purple-50/40",
    hoverUnselected: "hover:border-purple-300 hover:bg-purple-50/80",
    borderSelected: "border-purple-500",
    bgSelected: "bg-purple-500/10",
    ringSelected: "ring-2 ring-purple-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(168,85,247,0.2)]",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-100/90 border border-purple-200",
    badgeText: "text-purple-900",
    chipBg: "bg-purple-100/70",
    chipText: "text-purple-900",
  },
  "cancer-wellbeing": {
    borderUnselected: "border-lime-200/90",
    bgUnselected: "bg-lime-50/40",
    hoverUnselected: "hover:border-lime-300 hover:bg-lime-50/80",
    borderSelected: "border-lime-500",
    bgSelected: "bg-lime-500/10",
    ringSelected: "ring-2 ring-lime-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(132,204,22,0.2)]",
    iconBg: "bg-lime-100",
    iconColor: "text-lime-700",
    badgeBg: "bg-lime-100/90 border border-lime-200",
    badgeText: "text-lime-900",
    chipBg: "bg-lime-100/70",
    chipText: "text-lime-900",
  },
  "infection-recovery": {
    borderUnselected: "border-orange-200/90",
    bgUnselected: "bg-orange-50/40",
    hoverUnselected: "hover:border-orange-300 hover:bg-orange-50/80",
    borderSelected: "border-orange-500",
    bgSelected: "bg-orange-500/10",
    ringSelected: "ring-2 ring-orange-500/30",
    shadowSelected: "shadow-[0_14px_40px_rgba(249,115,22,0.2)]",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    badgeBg: "bg-orange-100/90 border border-orange-200",
    badgeText: "text-orange-900",
    chipBg: "bg-orange-100/70",
    chipText: "text-orange-900",
  },
};

const defaultTheme: OrganSystemTheme = {
  borderUnselected: "border-teal-200/90",
  bgUnselected: "bg-teal-50/40",
  hoverUnselected: "hover:border-teal-300 hover:bg-teal-50/80",
  borderSelected: "border-teal-500",
  bgSelected: "bg-teal-500/10",
  ringSelected: "ring-2 ring-teal-500/30",
  shadowSelected: "shadow-[0_14px_40px_rgba(20,184,166,0.2)]",
  iconBg: "bg-teal-100",
  iconColor: "text-teal-600",
  badgeBg: "bg-teal-100/90 border border-teal-200",
  badgeText: "text-teal-900",
  chipBg: "bg-teal-100/70",
  chipText: "text-teal-900",
};

const getOrganTheme = (id: string): OrganSystemTheme => {
  return organThemesMap[id] || defaultTheme;
};

const getOrganIcon = (id: string, iconColor: string): React.ReactNode => {
  switch (id) {
    case "heart-circulation":
      return <Heart className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "hormones-metabolism":
      return <Flame className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "digestive-liver":
      return <ShieldCheck className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "lungs-breathing":
      return <Wind className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "allergy-immunity":
      return <Zap className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "kidney-urinary":
      return <ShieldAlert className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "brain-nerves":
      return <Brain className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "emotional-sleep":
      return <Moon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "skin-hair-nails":
      return <SkinIcon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "joints-spine-mobility":
      return <Bone className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "womens-health":
      return <User className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "ent":
      return <Wind className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "eye-comfort":
      return <Eye className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "child-adolescent":
      return <Baby className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "healthy-ageing":
      return <AgeingIcon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "cancer-wellbeing":
      return <Crosshair className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    case "infection-recovery":
      return <RefreshCw className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
    default:
      return <Stethoscope className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />;
  }
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

      {/* Organ System Cards Grid with Distinct Curated Medical Color Palettes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {filteredAreas.map((area) => {
          const isSelected = activeAreaIds.includes(area.id);
          const theme = getOrganTheme(area.id);
          const icon = getOrganIcon(area.id, theme.iconColor);

          return (
            <div
              key={area.id}
              onClick={() => toggleSelectArea(area)}
              className={`cursor-pointer rounded-3xl border p-6 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between ${
                isSelected
                  ? `${theme.borderSelected} ${theme.bgSelected} ${theme.ringSelected} ${theme.shadowSelected}`
                  : `${theme.borderUnselected} ${theme.bgUnselected} ${theme.hoverUnselected} shadow-sm`
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-3 rounded-2xl shadow-sm border border-white/80 ${theme.iconBg}`}>
                      {icon}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
                      {area.specialties.join(", ")}
                    </span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className={`w-6 h-6 shrink-0 ${theme.iconColor}`} aria-hidden="true" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-300/80 bg-white shrink-0" />
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
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.chipBg} ${theme.chipText}`}
                    >
                      {cond}
                    </span>
                  ))}
                  {area.conditions.length > 3 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${theme.chipBg} ${theme.chipText}`}>
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
