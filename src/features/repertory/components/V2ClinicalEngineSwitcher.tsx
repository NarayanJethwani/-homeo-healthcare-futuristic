"use client";

import { Activity, GitCompareArrows, ShieldCheck } from "lucide-react";
import { ClinicalEngineMode } from "../liveMode";
import { ClinicalSafetyBadge } from "./ClinicalSafetyBadge";

interface V2ClinicalEngineSwitcherProps {
  mode: ClinicalEngineMode;
  onModeChange: (mode: ClinicalEngineMode) => void;
}

const MODES: Array<{ id: ClinicalEngineMode; label: string; icon: typeof Activity }> = [
  { id: "v1", label: "V1 Classic", icon: ShieldCheck },
  { id: "compare", label: "Compare V1 vs V2", icon: GitCompareArrows },
  { id: "v2-live", label: "V2 Clinical", icon: Activity },
];

export function V2ClinicalEngineSwitcher({ mode, onModeChange }: V2ClinicalEngineSwitcherProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Clinical Engine</div>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
            {MODES.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onModeChange(item.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-transparent text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <ClinicalSafetyBadge />
      </div>
    </div>
  );
}
