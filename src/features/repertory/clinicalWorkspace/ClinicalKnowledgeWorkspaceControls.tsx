"use client";

import { Activity, BookOpen, Columns3, ChevronLeft, ChevronRight, FlaskConical, Library, ListTree, RotateCcw, Sliders, Users, Mic2, History, ShieldCheck } from "lucide-react";
import type { ClinicalCanvasMode, ClinicalWorkspacePreset } from "./useClinicalWorkspaceLayout";

type Props = {
  preset: ClinicalWorkspacePreset;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  canvasMode: ClinicalCanvasMode;
  onPresetChange: (preset: ClinicalWorkspacePreset) => void;
  onCanvasModeChange: (mode: ClinicalCanvasMode) => void;
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onReset: () => void;
  identityLabel?: string;
  statusLabel?: string;
  leftPanelLabel?: string;
  modeItems?: ClinicalWorkspaceModeItem[];
};

export type ClinicalWorkspaceModeItem = {
  id: ClinicalCanvasMode;
  label: string;
  icon: typeof Activity;
};

const presets: Array<{ id: ClinicalWorkspacePreset; label: string; icon: typeof Activity }> = [
  { id: "browse", label: "Browse", icon: Sliders },
  { id: "repertorize", label: "Repertorize", icon: Activity },
  { id: "compare", label: "Compare", icon: Users },
];

export const JETHWANI_CLINICAL_CANVAS_MODES: ClinicalWorkspaceModeItem[] = [
  { id: "intake", label: "Intake", icon: Mic2 },
  { id: "book", label: "Clinical Book", icon: BookOpen },
  { id: "rubrics", label: "Rubrics", icon: ListTree },
  { id: "analysis", label: "Analysis", icon: Activity },
  { id: "materia-medica", label: "Materia", icon: Library },
  { id: "potency", label: "Potency", icon: FlaskConical },
  { id: "timeline", label: "Timeline", icon: History },
  { id: "review", label: "Review", icon: ShieldCheck },
  { id: "split", label: "Split", icon: Columns3 },
];

export function ClinicalKnowledgeWorkspaceControls({
  preset,
  leftCollapsed,
  rightCollapsed,
  canvasMode,
  onPresetChange,
  onCanvasModeChange,
  onToggleLeft,
  onToggleRight,
  onReset,
  identityLabel = "Clinical Knowledge Workbench",
  statusLabel = "Workspace preview",
  leftPanelLabel = "Sources",
  modeItems,
}: Props) {
  const resolvedModes: ClinicalWorkspaceModeItem[] = modeItems || [
    { id: "book", label: "Book", icon: BookOpen },
    { id: "rubrics", label: "Rubrics", icon: ListTree },
    { id: "analysis", label: "Analysis", icon: Activity },
    { id: "materia-medica", label: "Materia", icon: Library },
    { id: "potency", label: "Potency", icon: FlaskConical },
    { id: "split", label: "Split", icon: Columns3 },
  ];
  return (
    <div className="ckw-toolbar" aria-label="Clinical knowledge workspace controls">
      <div className="ckw-toolbar__identity">
        <span className="ckw-toolbar__eyebrow">{identityLabel}</span>
        <span className="ckw-toolbar__status">{statusLabel}</span>
      </div>

      <div className="ckw-toolbar__presets" role="group" aria-label="Workspace layout presets">
        {presets.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onPresetChange(id)}
            className={preset === id ? "is-active" : ""}
            aria-pressed={preset === id}
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="ckw-toolbar__modes" role="group" aria-label="Workbench canvas mode">
        {resolvedModes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onCanvasModeChange(id)}
            className={canvasMode === id ? "is-active" : ""}
            aria-pressed={canvasMode === id}
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="ckw-toolbar__panel-actions">
        <button type="button" onClick={onToggleLeft} aria-pressed={!leftCollapsed} title="Show or hide repertory navigator">
          {leftCollapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
          {leftPanelLabel}
        </button>
        <button type="button" onClick={onToggleRight} aria-pressed={!rightCollapsed} title="Show or hide clinical inspector">
          Inspector
          {rightCollapsed ? <ChevronLeft aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
        </button>
        <button type="button" onClick={onReset} title="Restore default workspace layout">
          <RotateCcw aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}
