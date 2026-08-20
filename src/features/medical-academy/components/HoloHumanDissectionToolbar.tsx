"use client";

import React, { useState } from "react";
import {
  Scissors,
  Layers,
  MapPin,
  Ruler,
  Eye,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Flame,
} from "lucide-react";

export interface DissectionToolbarProps {
  peelDepth: number; // 0 to 100
  onPeelDepthChange: (depth: number) => void;
  activeClippingPlane: "none" | "sagittal" | "coronal" | "axial";
  onClippingPlaneChange: (plane: "none" | "sagittal" | "coronal" | "axial") => void;
  xrayGhostMode: boolean;
  onXrayGhostModeToggle: () => void;
  themeMode: "dark" | "light";
  onThemeModeToggle: () => void;
  activeRemedyTropismId: string | null;
  onRemedyTropismSelect: (remedyId: string | null) => void;
  onResetView: () => void;
}

export default function HoloHumanDissectionToolbar({
  peelDepth,
  onPeelDepthChange,
  activeClippingPlane,
  onClippingPlaneChange,
  xrayGhostMode,
  onXrayGhostModeToggle,
  themeMode,
  onThemeModeToggle,
  activeRemedyTropismId,
  onRemedyTropismSelect,
  onResetView,
}: DissectionToolbarProps) {
  const [activeTool, setActiveTool] = useState<"peel" | "scalpel" | "remedy" | null>("peel");

  const LAYER_MILESTONES = [
    { label: "Skin (0%)", value: 0 },
    { label: "Fascia (20%)", value: 20 },
    { label: "Muscle (40%)", value: 40 },
    { label: "Organs (60%)", value: 60 },
    { label: "Vascular (80%)", value: 80 },
    { label: "Skeleton (100%)", value: 100 },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 text-white shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400">
            <Layers className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold tracking-tight text-slate-100">
            Dissection & Studio Controls
          </span>
        </div>

        {/* Quick Utility Toggles */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onXrayGhostModeToggle}
            title={xrayGhostMode ? "Disable X-Ray Ghosting" : "Enable X-Ray Ghosting (15% Opacity Context)"}
            className={`flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition ${
              xrayGhostMode
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>X-Ray</span>
          </button>

          <button
            type="button"
            onClick={onThemeModeToggle}
            title={`Switch to ${themeMode === "dark" ? "Medical Studio Daylight" : "Clinical Cyber-Dark"}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {themeMode === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-indigo-300" />}
          </button>

          <button
            type="button"
            onClick={onResetView}
            title="Reset Anatomy View & Cameras"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tool Selector Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTool("peel")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
            activeTool === "peel" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Layer Peeler
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("scalpel")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
            activeTool === "scalpel" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Scissors className="h-3.5 w-3.5" /> 3D Scalpel
        </button>
        <button
          type="button"
          onClick={() => setActiveTool("remedy")}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition ${
            activeTool === "remedy" ? "bg-teal-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Flame className="h-3.5 w-3.5 text-amber-400" /> 3D Tropism
        </button>
      </div>

      {/* Dynamic Tool Sub-panels */}
      {activeTool === "peel" && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
            <span>Peel Depth (Superficial $\rightarrow$ Deep):</span>
            <span className="font-mono font-bold text-teal-400">{peelDepth}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={peelDepth}
            onChange={(e) => onPeelDepthChange(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-teal-500"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>Skin</span>
            <span>Fascia</span>
            <span>Muscle</span>
            <span>Viscera</span>
            <span>Vascular</span>
            <span>Skeleton</span>
          </div>
        </div>
      )}

      {activeTool === "scalpel" && (
        <div className="space-y-2 pt-1">
          <p className="text-[10px] text-slate-400">Select Sectional Clipping Plane:</p>
          <div className="grid grid-cols-4 gap-1">
            {(["none", "sagittal", "coronal", "axial"] as const).map((plane) => (
              <button
                key={plane}
                type="button"
                onClick={() => onClippingPlaneChange(plane)}
                className={`rounded-lg py-1.5 text-[11px] font-bold capitalize transition border ${
                  activeClippingPlane === plane
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                {plane === "none" ? "Full 3D" : plane}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTool === "remedy" && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Overlay Remedy Organotropism Aura:</span>
            {activeRemedyTropismId && (
              <button
                type="button"
                onClick={() => onRemedyTropismSelect(null)}
                className="text-[9px] text-rose-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "nux_vomica", label: "Nux Vomica" },
              { id: "lycopodium", label: "Lycopodium" },
              { id: "apis_mellifica", label: "Apis Mell." },
              { id: "phosphorus", label: "Phosphorus" },
              { id: "cactus_grandiflorus", label: "Cactus Grand." },
            ].map((remedy) => (
              <button
                key={remedy.id}
                type="button"
                onClick={() => onRemedyTropismSelect(activeRemedyTropismId === remedy.id ? null : remedy.id)}
                className={`truncate rounded-lg py-1.5 px-1.5 text-[10px] font-bold transition border ${
                  activeRemedyTropismId === remedy.id
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm"
                    : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                }`}
              >
                {remedy.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
