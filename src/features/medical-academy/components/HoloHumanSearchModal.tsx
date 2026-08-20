"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Sparkles,
  Layers,
  HeartPulse,
  Flame,
  Microscope,
  ArrowRight,
  Eye,
} from "lucide-react";
import { REMEDY_TROPISM_DATA } from "../data/remedyTropismData";
import { PATHOLOGY_CONDITIONS } from "./HoloHumanPathologySimulator";

export interface SearchResultItem {
  id: string;
  category: "organ" | "pathology" | "remedy" | "histology";
  title: string;
  subtitle: string;
  systemName: string;
  badge: string;
  extraDetails?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Organs
  { id: "heart_lv", category: "organ", title: "Left Ventricle", subtitle: "Cardiovascular > Heart > Chambers", systemName: "Cardiovascular", badge: "Organ" },
  { id: "heart_mitral", category: "organ", title: "Mitral (Bicuspid) Valve", subtitle: "Cardiovascular > Heart > Valves", systemName: "Cardiovascular", badge: "Valve" },
  { id: "kidney_glomerulus", category: "organ", title: "Renal Glomerulus & Podocytes", subtitle: "Renal > Nephron > Filtration", systemName: "Renal", badge: "Micro-Structure" },
  { id: "liver_parenchyma", category: "organ", title: "Hepatic Lobules & Portal Triad", subtitle: "Digestive > Liver > Micro-anatomy", systemName: "Digestive", badge: "Parenchyma" },
  { id: "biceps_brachii", category: "organ", title: "Biceps Brachii (Long & Short Head)", subtitle: "Muscular > Upper Limb > Anterior Flexors", systemName: "Muscular", badge: "Muscle" },
  { id: "cranial_nerve_10", category: "organ", title: "Vagus Nerve (Cranial Nerve X)", subtitle: "Nervous > Cranial Nerves > Parasympathetic", systemName: "Nervous", badge: "Cranial Nerve" },
  { id: "thyroid_gland", category: "organ", title: "Thyroid Gland (Isthmus & Lobes)", subtitle: "Endocrine > Neck Viscera", systemName: "Endocrine", badge: "Endocrine" },
  { id: "femur_bone", category: "organ", title: "Femur (Head, Greater Trochanter & Shaft)", subtitle: "Skeletal > Lower Extremity", systemName: "Skeletal", badge: "Bone" },

  // Pathologies
  ...PATHOLOGY_CONDITIONS.map((p) => ({
    id: p.id,
    category: "pathology" as const,
    title: p.name,
    subtitle: `${p.system} · ${p.miasmaticClassification} Miasm`,
    systemName: p.system,
    badge: "Pathology",
    extraDetails: p.pathophysiology,
  })),

  // Remedies
  ...Object.values(REMEDY_TROPISM_DATA).map((r) => ({
    id: r.id,
    category: "remedy" as const,
    title: r.remedyName,
    subtitle: `${r.commonName} · ${r.miasmaticDominance} · ${r.overallAffinityIntensity}% Tropism`,
    systemName: r.targetOrgans.map((o) => o.structureName).join(", "),
    badge: "3D Tropism",
    extraDetails: r.targetOrgans[0]?.clinicalKeynotes,
  })),

  // Histology
  { id: "intercalated_discs", category: "histology", title: "Intercalated Discs & Gap Junctions", subtitle: "Cardiovascular > Cardiac Muscle Histology", systemName: "Cardiovascular", badge: "Histology" },
  { id: "podocytes_filtration", category: "histology", title: "Podocyte Foot Processes & Slit Diaphragm", subtitle: "Renal > Glomerular Membrane", systemName: "Renal", badge: "Histology" },
  { id: "myelin_sheath", category: "histology", title: "Schwann Cell Myelin Sheath", subtitle: "Nervous > Peripheral Axon Sheath", systemName: "Nervous", badge: "Histology" },
];

export interface HoloHumanSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (item: SearchResultItem) => void;
}

export default function HoloHumanSearchModal({
  isOpen,
  onClose,
  onSelectResult,
}: HoloHumanSearchModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle handled by parent
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    return SEARCH_DATABASE.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.systemName.toLowerCase().includes(q) ||
        (item.extraDetails && item.extraDetails.toLowerCase().includes(q))
      );
    }).slice(0, 12);
  }, [query, activeCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-16 sm:pt-24 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
          <Search className="h-5 w-5 text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search structure, disease simulation, remedy tropism, or histology... (⌘K)"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-2 py-1 text-[11px] font-mono text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 border-b border-slate-800/80 bg-slate-950/60 px-4 py-2 text-xs overflow-x-auto">
          {[
            { id: "all", label: "All Items" },
            { id: "organ", label: "🫀 Organs & Structures" },
            { id: "pathology", label: "🩺 Pathologies (600+)" },
            { id: "remedy", label: "🌿 Remedy Tropisms" },
            { id: "histology", label: "🔬 Histology & Cells" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`min-w-max rounded-lg px-2.5 py-1 text-[11px] font-bold transition border ${
                activeCategory === cat.id
                  ? "bg-teal-500/20 border-teal-500/50 text-teal-300"
                  : "border-transparent text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching anatomical structure or clinical concept found. Try another term.
            </div>
          ) : (
            filteredResults.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectResult(item);
                  onClose();
                }}
                className="group flex w-full items-center justify-between rounded-2xl p-3 text-left transition hover:bg-slate-800/80 focus:bg-slate-800/80 focus:outline-none"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition">
                    {item.category === "organ" && <Layers className="h-4 w-4" />}
                    {item.category === "pathology" && <HeartPulse className="h-4 w-4" />}
                    {item.category === "remedy" && <Flame className="h-4 w-4" />}
                    {item.category === "histology" && <Microscope className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white group-hover:text-teal-300 transition truncate">
                        {item.title}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                    {item.extraDetails && (
                      <p className="mt-0.5 text-[10px] text-slate-500 line-clamp-1 italic">
                        {item.extraDetails}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-teal-400 transition shrink-0 ml-2">
                  <span>Isolate & Zoom</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-4 py-2.5 text-[10px] text-slate-500 font-mono">
          <span>Search-to-Isolate · Applies 15% X-Ray Opacity Ghosting</span>
          <span>HoloHuman™ Knowledge Base</span>
        </div>
      </div>
    </div>
  );
}
