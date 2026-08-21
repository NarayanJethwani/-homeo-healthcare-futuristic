"use client";

import React, { useState } from "react";
import { AnatomySystemId } from "../data/medicalAcademyData";
import { SYSTEM_3D_REGISTRY, SubOrganItem } from "../render/system3DRegistry";
import { SYSTEM_DETAILED_KNOWLEDGE } from "../data/systemDetailedKnowledgeData";
import { REMEDY_TROPISM_DATA } from "../data/remedyTropismData";
import { 
  Sparkles, 
  RotateCcw, 
  Eye, 
  Layers, 
  Activity, 
  Check, 
  Info, 
  Compass, 
  Maximize2,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

interface SystemSpecific3DViewerProps {
  systemId: AnatomySystemId;
  activeSubOrganId: string | null;
  onSubOrganSelect: (subOrganId: string | null) => void;
  activeRemedyTropismId: string | null;
  onRemedyTropismSelect: (remedyId: string | null) => void;
}

export const SystemSpecific3DViewer: React.FC<SystemSpecific3DViewerProps> = ({
  systemId,
  activeSubOrganId,
  onSubOrganSelect,
  activeRemedyTropismId,
  onRemedyTropismSelect,
}) => {
  const [resetToken, setResetToken] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnatomyInfo, setShowAnatomyInfo] = useState(true);

  const config = SYSTEM_3D_REGISTRY[systemId] || SYSTEM_3D_REGISTRY.cardiovascular;
  const detailedKnowledge = SYSTEM_DETAILED_KNOWLEDGE[systemId];
  const activeRemedy = activeRemedyTropismId ? REMEDY_TROPISM_DATA[activeRemedyTropismId] : null;

  // Selected sub organ
  const activeSubOrgan = config.subOrgans.find((s) => s.id === activeSubOrganId) || config.subOrgans[0];
  const activeStructureDetail = detailedKnowledge?.structures.find(
    (s) => s.subOrganId === activeSubOrgan?.id || s.id === activeSubOrgan?.id
  );

  const handleReset = () => {
    setResetToken((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-3">
      {/* 1. Header Bar: System identity & Quick status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <span 
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-xs"
            style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}
          >
            {activeSubOrgan?.icon || "🔬"}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold tracking-tight text-slate-950 dark:text-white sm:text-base">
                {config.name}
              </h3>
              <span 
                className="hidden sm:inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border"
                style={{ 
                  backgroundColor: `${config.accentColor}15`, 
                  color: config.accentColor,
                  borderColor: `${config.accentColor}30`
                }}
              >
                {config.badge}
              </span>
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Viewport Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowAnatomyInfo(!showAnatomyInfo)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${
              showAnatomyInfo 
                ? "border-teal-500/50 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-700" 
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            }`}
            title="Toggle Sub-Organ Informer Card"
          >
            <Info className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Informer</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Reset 3D camera orientation"
          >
            <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Organ Quick Focus Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1 scrollbar-thin">
        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500 shrink-0">
          <Compass className="h-3 w-3 text-teal-500" /> Focus:
        </span>
        {config.subOrgans.map((sub) => {
          const isSelected = activeSubOrgan?.id === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSubOrganSelect(sub.id)}
              className={`group flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "border-teal-500 bg-slate-900 text-white shadow-sm dark:bg-teal-500 dark:text-slate-950 dark:border-teal-400"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-xs">{sub.icon}</span>
              <span>{sub.name.split(" ")[0]}</span>
              {isSelected && <Check className="h-3 w-3 ml-0.5 text-teal-400 dark:text-slate-950" />}
            </button>
          );
        })}
      </div>

      {/* 3. 3D Spatial Interactive Canvas */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-slate-300/80 bg-slate-950 shadow-inner dark:border-slate-800 flex-1 min-h-[580px] lg:min-h-[640px]">
        <iframe
          key={`${systemId}-${resetToken}`}
          title={`${config.name} 3D Interactive Model`}
          src={config.modelUrl}
          className="h-[580px] lg:h-[640px] w-full border-0 bg-slate-950"
          loading="lazy"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />

        {/* Top-Left Floating Badge */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur">
            <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: config.accentColor }} />
            <span>Dedicated 3D {config.name.split(" ")[0]} Model</span>
          </div>

          {activeSubOrgan && (
            <div className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/85 px-3 py-1 text-[10px] font-semibold text-teal-300 backdrop-blur w-fit">
              <span>{activeSubOrgan.icon}</span>
              <span>Target: {activeSubOrgan.name}</span>
            </div>
          )}
        </div>

        {/* Top-Right Interaction Legend */}
        <div className="pointer-events-none absolute right-4 top-4 rounded-xl border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[10px] font-mono text-slate-400 backdrop-blur hidden sm:block">
          🖱️ Drag: Rotate · Scroll: Zoom · Right-Click: Pan
        </div>

        {/* Active Organotropism Remedy Glowing Aura Banner */}
        {activeRemedy && (
          <div className="absolute top-16 left-4 right-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/90 p-3 shadow-xl backdrop-blur text-amber-100 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Organotropism Active: {activeRemedy.remedyName}
                  </span>
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-200">
                    Affinity: {activeRemedy.overallAffinityIntensity}%
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/90 line-clamp-1">
                  {activeRemedy.targetOrgans[0]?.clinicalKeynotes || activeRemedy.targetOrgans[0]?.pathologicalEffect}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemedyTropismSelect(null)}
              className="shrink-0 rounded-lg bg-amber-900/60 px-2 py-1 text-[10px] font-semibold text-amber-300 hover:bg-amber-800 transition"
            >
              Clear
            </button>
          </div>
        )}

        {/* Bottom Sub-Organ Micro-Informer Card */}
        {showAnatomyInfo && activeSubOrgan && (
          <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-slate-700/80 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur text-white transition-all">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{activeSubOrgan.icon}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {activeSubOrgan.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      📍 {activeSubOrgan.focusHint}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {activeSubOrgan.description}
                  </p>
                </div>
              </div>

              {activeStructureDetail && (
                <div className="flex shrink-0 flex-col gap-1 border-t border-slate-800 pt-2 md:border-t-0 md:border-l md:pl-4 md:pt-0 text-[11px]">
                  <div className="text-slate-400">
                    <span className="font-semibold text-teal-400">Vascular:</span> {activeStructureDetail.vascularSupply.split(";")[0]}
                  </div>
                  <div className="text-slate-400">
                    <span className="font-semibold text-teal-400">Innervation:</span> {activeStructureDetail.innervation.split(";")[0]}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
