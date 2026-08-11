import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Activity,
  Baby,
  Bone,
  Brain,
  CheckCircle2,
  ChevronRight,
  Eye,
  Flame,
  Heart,
  Moon,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { SPECIALTY_CLINICAL_AREAS } from "@/lib/specialtyPrograms";
import { EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT } from "../domain/types";
import { calculatePreliminaryCareRecommendation } from "../services/careRecommendationEngine";
import { HealthConcernDetailDialog } from "./HealthConcernDetailDialog";

interface OrganSystemsDirectoryProps {
  selectedAreaIds: string[];
  selectedCondition: string;
  onSelectionChange: (areaIds: string[], areaTitles: string[], conditionName: string) => void;
  onContinueToPathways: () => void;
  onProceedToAssessment: () => void;
}

interface ConcernVisual {
  icon: LucideIcon;
  accent: string;
  image: string;
}

const DEFAULT_VISUAL: ConcernVisual = { icon: Stethoscope, accent: "#0f766e", image: "/images/health-concerns-3d.webp" };

const CONCERN_VISUALS: Record<string, ConcernVisual> = {
  "heart-circulation": { icon: Heart, accent: "#e11d48", image: "/images/cardiovascular-hypertension-lipids-featured.png" },
  "hormones-metabolism": { icon: Flame, accent: "#d97706", image: "/images/complete-thyroid-featured.png" },
  "digestive-liver": { icon: ShieldCheck, accent: "#059669", image: "/images/fatty-liver-regeneration-featured.png" },
  "lungs-breathing": { icon: Wind, accent: "#0284c7", image: "/images/asthma-bronchospasms-featured.png" },
  "allergy-immunity": { icon: Zap, accent: "#7c3aed", image: "/images/autoimmune_cellular_featured_new.png" },
  "kidney-urinary": { icon: Activity, accent: "#2563eb", image: "/images/kidney_pathology_featured_new.png" },
  "brain-nerves": { icon: Brain, accent: "#9333ea", image: "/images/migraine_article_hero.png" },
  "emotional-sleep": { icon: Moon, accent: "#4f46e5", image: "/images/neurobiology-stress-anxiety-featured.png" },
  "skin-hair-nails": { icon: Sparkles, accent: "#0d9488", image: "/images/chronic-skin-pathology-featured.png" },
  "joints-spine-mobility": { icon: Bone, accent: "#ea580c", image: "/images/joint-bone-health-featured.png" },
  "womens-health": { icon: User, accent: "#db2777", image: "/images/pcos-pcod-reversal-featured.png" },
  ent: { icon: Wind, accent: "#0891b2", image: "/images/allergic-rhinitis-sinusitis-featured.png" },
  "eye-comfort": { icon: Eye, accent: "#4f46e5", image: "/images/eye-comfort-3d.webp" },
  "child-adolescent": { icon: Baby, accent: "#ca8a04", image: "/images/pediatric-immunity-tonsils-featured.png" },
  "healthy-ageing": { icon: Activity, accent: "#7e22ce", image: "/images/healthy-ageing-3d.webp" },
  "cancer-wellbeing": { icon: ShieldCheck, accent: "#4d7c0f", image: "/images/constitutional-immunotherapy-cancer-featured.png" },
  "infection-recovery": { icon: RefreshCw, accent: "#c2410c", image: "/images/viral_infection_featured_new.png" },
};

export const OrganSystemsDirectory: React.FC<OrganSystemsDirectoryProps> = ({
  selectedAreaIds,
  selectedCondition,
  onSelectionChange,
  onContinueToPathways,
  onProceedToAssessment,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customConcern, setCustomConcern] = useState("");
  const [activeInfoAreaId, setActiveInfoAreaId] = useState<string | null>(null);

  const filteredAreas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return SPECIALTY_CLINICAL_AREAS;
    return SPECIALTY_CLINICAL_AREAS.filter((area) =>
      [area.title, area.description, ...area.specialties, ...area.conditions]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const activeAreas = useMemo(
    () => SPECIALTY_CLINICAL_AREAS.filter((area) => selectedAreaIds.includes(area.id)),
    [selectedAreaIds]
  );

  const selectedConditions = useMemo(
    () => Array.from(new Set(activeAreas.flatMap((area) => area.conditions))),
    [activeAreas]
  );

  const recommendation = useMemo(
    () => calculatePreliminaryCareRecommendation({ selectedOrganSystems: activeAreas.map((area) => area.title) }),
    [activeAreas]
  );

  const activeInfoArea = useMemo(
    () => SPECIALTY_CLINICAL_AREAS.find((area) => area.id === activeInfoAreaId),
    [activeInfoAreaId]
  );

  const toggleArea = (areaId: string) => {
    const nextIds = selectedAreaIds.includes(areaId)
      ? selectedAreaIds.filter((id) => id !== areaId)
      : [...selectedAreaIds, areaId];
    const nextAreas = SPECIALTY_CLINICAL_AREAS.filter((area) => nextIds.includes(area.id));
    onSelectionChange(nextIds, nextAreas.map((area) => area.title), selectedCondition);
  };

  const selectCondition = (condition: string) => {
    onSelectionChange(selectedAreaIds, activeAreas.map((area) => area.title), condition);
  };

  return (
    <section aria-labelledby="organ-systems-heading" className="mb-12 space-y-8">
      <div className="health-concerns-hero relative isolate overflow-hidden rounded-[2rem] border border-emerald-900/20 bg-[#071f1a] shadow-[0_24px_80px_rgba(4,47,38,0.2)]">
        <Image
          src="/images/health-concerns-3d.webp"
          alt="Three-dimensional visualization of interconnected human organ systems"
          fill
          priority={false}
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-[64%_center] opacity-85"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#061b17_0%,rgba(6,27,23,0.96)_34%,rgba(6,27,23,0.34)_70%,rgba(6,27,23,0.08)_100%)]" />
        <div className="relative z-10 flex min-h-[380px] max-w-2xl flex-col justify-center px-7 py-10 text-white md:px-12">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
            <Activity className="h-4 w-4" aria-hidden="true" /> Whole-person clinical discovery
          </span>
          <h2 id="organ-systems-heading" className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-tight md:text-5xl">
            Explore by health concern
          </h2>
          <p className="mt-4 max-w-lg text-sm font-semibold leading-relaxed text-emerald-50/90">
            Start with the area that concerns you most. Add related areas when needed, then review a suggested care pathway with a physician.
          </p>
          <div className="mt-7 grid max-w-lg grid-cols-3 gap-3 text-[10px] font-bold text-emerald-50">
            {["Search concerns", "Select health areas", "Review with physician"].map((step, index) => (
              <div key={step} className="rounded-2xl border border-white/15 bg-black/20 px-3 py-3 backdrop-blur-sm">
                <span className="mb-1 block text-emerald-300">0{index + 1}</span>{step}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-mint">Health areas & common concerns</span>
          <h3 className="mt-2 font-serif text-3xl font-bold text-[#1A2421]">What would you like help with?</h3>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
            Select one primary area and any related areas. This guides your starting point; it does not provide a diagnosis.
          </p>
        </div>
        <div className="relative w-full lg:max-w-md">
          <label htmlFor="organ-search" className="sr-only">Search health areas and common concerns</label>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            id="organ-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search migraine, digestion, skin..."
            className="w-full rounded-full border border-slate-200 bg-white/90 py-4 pl-11 pr-5 text-xs font-bold text-[#1A2421] shadow-sm outline-none transition-all focus:border-mint focus:ring-2 focus:ring-mint/20"
          />
        </div>
      </div>

      {selectedAreaIds.length > 0 && (
        <div className="rounded-3xl border border-mint/30 bg-mint/[0.07] p-5 md:flex md:items-center md:justify-between md:gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-mint-dark">
              {selectedAreaIds.length} {selectedAreaIds.length === 1 ? "health area" : "health areas"} selected
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">Suggested starting point: {recommendation.suggestedTierName}</h3>
            <p className="mt-1 max-w-3xl text-xs font-semibold leading-relaxed text-slate-600">{recommendation.rationale}</p>
          </div>
          <button type="button" onClick={onContinueToPathways} className="mt-4 inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-mint px-6 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-md md:mt-0">
            Continue to care pathways <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredAreas.map((area) => {
          const selected = selectedAreaIds.includes(area.id);
          const visual = CONCERN_VISUALS[area.id] || DEFAULT_VISUAL;
          const Icon = visual.icon;
          return (
            <article
              key={area.id}
              data-selected={selected}
              className="health-concern-card group flex h-full flex-col overflow-hidden rounded-3xl border text-left transition-all hover:-translate-y-1"
              style={{ "--concern-accent": visual.accent } as React.CSSProperties}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#071f1a]">
                <Image src={visual.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="scale-110 object-cover opacity-35 blur-xl" aria-hidden="true" />
                <Image src={visual.image} alt={`Clinical visualization for ${area.title}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-contain p-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-sm">{area.specialties[0]}</span>
                {selected && <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-white shadow-md"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Selected</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="flex items-start justify-between gap-4">
                  <span className="health-concern-icon inline-flex rounded-2xl p-3"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">{area.conditions.length} common concerns</span>
                </span>
                <h4 className="mt-4 font-serif text-xl font-bold text-[#1A2421]">{area.title}</h4>
                <p className="mt-2 line-clamp-3 text-xs font-semibold leading-relaxed text-slate-600">{area.description}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {area.conditions.slice(0, 2).map((condition) => <span key={condition} className="health-concern-chip rounded-full px-2.5 py-1 text-[9px] font-bold">{condition}</span>)}
                  <span className="health-concern-chip rounded-full px-2.5 py-1 text-[9px] font-bold">+{Math.max(area.conditions.length - 2, 0)} more</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4">
                  <button type="button" onClick={() => toggleArea(area.id)} className={`rounded-full px-3 py-2.5 text-[9px] font-black uppercase tracking-wider transition-colors ${selected ? "border border-mint bg-mint/10 text-mint-dark" : "bg-mint text-white"}`}>
                    {selected ? "Remove area" : "Select area"}
                  </button>
                  <button type="button" onClick={() => setActiveInfoAreaId(area.id)} className="rounded-full border border-slate-200 bg-white px-3 py-2.5 text-[9px] font-black uppercase tracking-wider text-slate-700 transition-colors hover:border-mint hover:text-mint-dark">
                    Learn more
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredAreas.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm font-bold text-[#1A2421]">No exact match found.</p>
          <p className="mt-1 text-xs font-semibold text-slate-600">Try a broader term, or select “Other or not sure” after choosing the closest health area.</p>
        </div>
      )}

      {activeAreas.length > 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="border-b border-slate-200 pb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-mint">Optional detail</span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-[#1A2421]">Choose a common condition or concern</h3>
            <p className="mt-1 text-xs font-semibold text-slate-600">This helps your physician prepare for the review. You can still explain everything in your own words.</p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedConditions.map((condition) => (
              <button key={condition} type="button" aria-pressed={selectedCondition === condition} onClick={() => selectCondition(condition)} className={`rounded-2xl border p-3.5 text-left text-xs font-bold transition-all ${selectedCondition === condition ? "border-mint bg-mint/10 text-mint-dark ring-1 ring-mint/30" : "border-slate-200 bg-white text-slate-700 hover:border-mint/60"}`}>
                {condition}
              </button>
            ))}
            <button type="button" aria-pressed={selectedCondition === "Other or not sure"} onClick={() => selectCondition("Other or not sure")} className={`rounded-2xl border p-3.5 text-left text-xs font-bold transition-all ${selectedCondition === "Other or not sure" ? "border-mint bg-mint/10 text-mint-dark ring-1 ring-mint/30" : "border-slate-200 bg-white text-slate-700 hover:border-mint/60"}`}>
              Other or not sure
            </button>
          </div>

          {selectedCondition === "Other or not sure" && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <label htmlFor="custom-concern-input" className="mb-2 block text-xs font-bold text-[#1A2421]">Describe the concern in your own words</label>
              <input id="custom-concern-input" value={customConcern} onChange={(event) => { setCustomConcern(event.target.value); onSelectionChange(selectedAreaIds, activeAreas.map((area) => area.title), event.target.value || "Other or not sure"); }} placeholder="For example: recurring discomfort after meals" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-[#1A2421] outline-none focus:border-mint focus:ring-2 focus:ring-mint/20" />
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[11px] font-semibold leading-relaxed text-slate-500">{EXPLICIT_PHYSICIAN_AUTHORITY_STATEMENT}</p>
            <button type="button" onClick={onProceedToAssessment} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1A2421] px-6 py-3 text-[10px] font-black uppercase tracking-wider text-white">
              Request physician review <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {activeInfoArea && (
        <HealthConcernDetailDialog
          area={activeInfoArea}
          imageSrc={(CONCERN_VISUALS[activeInfoArea.id] || DEFAULT_VISUAL).image}
          selected={selectedAreaIds.includes(activeInfoArea.id)}
          selectedCondition={selectedCondition}
          onSelectArea={() => {
            if (!selectedAreaIds.includes(activeInfoArea.id)) toggleArea(activeInfoArea.id);
          }}
          onSelectCondition={(condition) => {
            const nextIds = selectedAreaIds.includes(activeInfoArea.id) ? selectedAreaIds : [...selectedAreaIds, activeInfoArea.id];
            const nextAreas = SPECIALTY_CLINICAL_AREAS.filter((area) => nextIds.includes(area.id));
            onSelectionChange(nextIds, nextAreas.map((area) => area.title), condition);
          }}
          onContinueToPathways={() => {
            setActiveInfoAreaId(null);
            onContinueToPathways();
          }}
          onClose={() => setActiveInfoAreaId(null)}
        />
      )}
    </section>
  );
};
