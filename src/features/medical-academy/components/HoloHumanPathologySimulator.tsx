"use client";

import React, { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Flame, HeartPulse, Stethoscope, ChevronRight } from "lucide-react";

export interface PathologyCondition {
  id: string;
  name: string;
  system: string;
  healthyState: string;
  diseasedState: string;
  pathophysiology: string;
  miasmaticClassification: "Psora" | "Sycosis" | "Syphilis" | "Tubercular";
  clinicalRemedyCorrelations: string[];
}

export const PATHOLOGY_CONDITIONS: PathologyCondition[] = [
  {
    id: "coronary_atherosclerosis",
    name: "Coronary Atherosclerosis & Thrombosis",
    system: "Cardiovascular",
    healthyState: "Patent, elastic coronary artery with smooth endothelial lining.",
    diseasedState: "Sub-intimal lipid core accumulation, fibrous plaque, calcification, and luminal narrowing.",
    pathophysiology: "Endothelial injury leading to LDL oxidation, foam cell proliferation, and progressive stenosis.",
    miasmaticClassification: "Sycosis",
    clinicalRemedyCorrelations: ["Cactus Grandiflorus", "Crataegus Oxyacantha", "Baryta Muriatica", "Aurum Metallicum"],
  },
  {
    id: "bronchial_asthma",
    name: "Bronchial Asthma & Airway Remodeling",
    system: "Respiratory",
    healthyState: "Relaxed bronchial smooth muscle with open, clear airway lumen.",
    diseasedState: "Hypertrophied smooth muscle, mucosal edema, goblet cell hyperplasia, and thick mucus plug.",
    pathophysiology: "Type I IgE-mediated hypersensitivity reaction with eosinophilic airway infiltration.",
    miasmaticClassification: "Psora",
    clinicalRemedyCorrelations: ["Arsenicum Album", "Blatta Orientalis", "Ipecacuanha", "Medorrhinum"],
  },
  {
    id: "knee_osteoarthritis",
    name: "Knee Joint Osteoarthritis & Cartilage Loss",
    system: "Skeletal / Articular",
    healthyState: "Intact hyaline articular cartilage with smooth synovial lubricated gliding.",
    diseasedState: "Complete cartilage fibrillation, subchondral bone eburnation, and marginal osteophytes.",
    pathophysiology: "Mechanical wear and inflammatory cytokine release degrading chondrocyte extracellular matrix.",
    miasmaticClassification: "Sycosis",
    clinicalRemedyCorrelations: ["Rhus Toxicodendron", "Bryonia Alba", "Causticum", "Calcarea Fluorica"],
  },
  {
    id: "hepatic_cirrhosis",
    name: "Hepatic Steatosis & Cirrhotic Fibrosis",
    system: "Digestive / Hepatic",
    healthyState: "Uniform hepatic lobules with radiating hepatocyte cords and patent sinusoids.",
    diseasedState: "Regenerative micronodules surrounded by dense fibrous collagen bands and portal hypertension.",
    pathophysiology: "Chronic hepatic stellate cell activation leading to progressive extracellular collagen deposition.",
    miasmaticClassification: "Syphilis",
    clinicalRemedyCorrelations: ["Lycopodium Clavatum", "Chelidonium Majus", "Phosphorus", "Carduus Marianus"],
  },
  {
    id: "diabetic_nephropathy",
    name: "Diabetic Nephropathy & Glomerulosclerosis",
    system: "Renal",
    healthyState: "Delicate glomerular basement membrane with healthy fenestrated capillaries and podocytes.",
    diseasedState: "Diffuse Kimmelstiel-Wilson nodular glomerulosclerosis and podocyte effacement.",
    pathophysiology: "Advanced glycation end-products (AGEs) inducing microvascular hyperfiltration and sclerosis.",
    miasmaticClassification: "Syphilis",
    clinicalRemedyCorrelations: ["Serum Anguillae", "Apis Mellifica", "Syzygium Jambolanum", "Uranium Nitricum"],
  },
];

export default function HoloHumanPathologySimulator() {
  const [selectedConditionId, setSelectedConditionId] = useState<string>("coronary_atherosclerosis");
  const [progressionValue, setProgressionValue] = useState<number>(50); // 0 (Healthy) to 100 (Severe Disease)

  const activeCondition = PATHOLOGY_CONDITIONS.find((c) => c.id === selectedConditionId) || PATHOLOGY_CONDITIONS[0];

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              HoloHuman™ 3D Pathology & Disease Progression Simulator
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive Healthy vs. Diseased tissue morphing & clinical remedy correlations
            </p>
          </div>
        </div>

        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          600+ Simulation Models
        </span>
      </div>

      {/* Condition Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {PATHOLOGY_CONDITIONS.map((cond) => (
          <button
            key={cond.id}
            type="button"
            onClick={() => {
              setSelectedConditionId(cond.id);
              setProgressionValue(50);
            }}
            className={`flex min-w-max items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition border ${
              selectedConditionId === cond.id
                ? "bg-slate-950 text-white border-slate-950 shadow-sm dark:bg-teal-500 dark:text-slate-950 dark:border-teal-400"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/60 dark:text-slate-400 dark:border-slate-800"
            }`}
          >
            <span>{cond.name}</span>
          </button>
        ))}
      </div>

      {/* Disease Progression Slider */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Healthy Baseline (0%)
          </span>
          <span className="font-mono text-sm text-slate-900 dark:text-white">
            Progression: <strong className="text-rose-600 dark:text-rose-400">{progressionValue}%</strong>
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-4 w-4" /> Advanced Pathology (100%)
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progressionValue}
          onChange={(e) => setProgressionValue(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 accent-slate-900 dark:accent-white"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
            <strong className="block text-[11px] uppercase tracking-wider mb-1 font-mono text-emerald-700 dark:text-emerald-400">
              Healthy Anatomical State:
            </strong>
            <p className="text-[11px] leading-relaxed">{activeCondition.healthyState}</p>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
            <strong className="block text-[11px] uppercase tracking-wider mb-1 font-mono text-rose-700 dark:text-rose-400">
              Active Pathological Alteration ({progressionValue}%):
            </strong>
            <p className="text-[11px] leading-relaxed">{activeCondition.diseasedState}</p>
          </div>
        </div>
      </div>

      {/* Clinical Intelligence & Homeopathic Correlations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
            Pathophysiology
          </span>
          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
            {activeCondition.pathophysiology}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
            Miasmatic Burden Layer
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800">
              {activeCondition.miasmaticClassification} Miasm
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-1">
            Keynote Remedies
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {activeCondition.clinicalRemedyCorrelations.map((rem) => (
              <span
                key={rem}
                className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 border border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800"
              >
                {rem}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
