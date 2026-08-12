"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

export type ClinicalWorkspacePreset = "browse" | "repertorize" | "compare";
export type ClinicalCanvasMode =
  | "intake"
  | "book"
  | "rubrics"
  | "analysis"
  | "split"
  | "materia-medica"
  | "potency"
  | "timeline"
  | "review";

type ClinicalWorkspaceLayoutOptions = {
  storageKey?: string;
  defaultCanvasMode?: ClinicalCanvasMode;
};

type StoredWorkspaceLayout = {
  leftWidth: number;
  rightWidth: number;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  preset: ClinicalWorkspacePreset;
  canvasMode: ClinicalCanvasMode;
};

const STORAGE_KEY = "homeo.clinical-knowledge-workbench.layout.v1";
const DEFAULT_LAYOUT: StoredWorkspaceLayout = {
  leftWidth: 430,
  rightWidth: 340,
  leftCollapsed: false,
  rightCollapsed: false,
  preset: "repertorize",
  canvasMode: "split",
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.max(minimum, Math.min(maximum, value));

const isCanvasMode = (value: unknown): value is ClinicalCanvasMode =>
  value === "intake" ||
  value === "book" ||
  value === "rubrics" ||
  value === "analysis" ||
  value === "split" ||
  value === "materia-medica" ||
  value === "potency" ||
  value === "timeline" ||
  value === "review";

function readStoredLayout(storageKey: string, defaults: StoredWorkspaceLayout): StoredWorkspaceLayout {
  if (typeof window === "undefined") return defaults;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) || "{}") as Partial<StoredWorkspaceLayout>;
    return {
      leftWidth: clamp(Number(parsed.leftWidth) || defaults.leftWidth, 320, 560),
      rightWidth: clamp(Number(parsed.rightWidth) || defaults.rightWidth, 300, 520),
      leftCollapsed: Boolean(parsed.leftCollapsed),
      rightCollapsed: Boolean(parsed.rightCollapsed),
      preset: parsed.preset === "browse" || parsed.preset === "compare" || parsed.preset === "repertorize"
        ? parsed.preset
        : defaults.preset,
      canvasMode: isCanvasMode(parsed.canvasMode) ? parsed.canvasMode : defaults.canvasMode,
    };
  } catch {
    return defaults;
  }
}

export function useClinicalWorkspaceLayout(options: ClinicalWorkspaceLayoutOptions = {}) {
  const storageKey = options.storageKey || STORAGE_KEY;
  const defaults = useMemo<StoredWorkspaceLayout>(() => ({
    ...DEFAULT_LAYOUT,
    canvasMode: options.defaultCanvasMode || DEFAULT_LAYOUT.canvasMode,
  }), [options.defaultCanvasMode]);
  const [layout, setLayout] = useState<StoredWorkspaceLayout>(defaults);

  useEffect(() => {
    setLayout(readStoredLayout(storageKey, defaults));
  }, [defaults, storageKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(layout));
    }
  }, [layout, storageKey]);

  const applyPreset = useCallback((preset: ClinicalWorkspacePreset) => {
    setLayout((current) => {
      if (preset === "browse") {
        return { ...current, preset, canvasMode: "rubrics", leftWidth: 520, leftCollapsed: false, rightCollapsed: true };
      }
      if (preset === "compare") {
        return { ...current, preset, canvasMode: "analysis", leftWidth: 360, rightWidth: 440, leftCollapsed: false, rightCollapsed: false };
      }
      return { ...current, preset, canvasMode: "split", leftWidth: 430, rightWidth: 340, leftCollapsed: false, rightCollapsed: false };
    });
  }, []);

  const setCanvasMode = useCallback((canvasMode: ClinicalCanvasMode) => {
    setLayout((current) => ({ ...current, canvasMode }));
  }, []);

  const resetLayout = useCallback(() => setLayout(defaults), [defaults]);

  const toggleLeft = useCallback(() => {
    setLayout((current) => ({ ...current, leftCollapsed: !current.leftCollapsed }));
  }, []);

  const toggleRight = useCallback(() => {
    setLayout((current) => ({ ...current, rightCollapsed: !current.rightCollapsed }));
  }, []);

  const beginResize = useCallback((side: "left" | "right", event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1280) return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = side === "left" ? layout.leftWidth : layout.rightWidth;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      setLayout((current) => ({
        ...current,
        ...(side === "left"
          ? { leftWidth: clamp(startWidth + delta, 320, 560), leftCollapsed: false }
          : { rightWidth: clamp(startWidth - delta, 300, 520), rightCollapsed: false }),
      }));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }, [layout.leftWidth, layout.rightWidth]);

  const style = useMemo(() => ({
    "--ckw-left-width": `${layout.leftCollapsed ? 0 : layout.leftWidth}px`,
    "--ckw-right-width": `${layout.rightCollapsed ? 0 : layout.rightWidth}px`,
  } as CSSProperties), [layout]);

  return {
    ...layout,
    style,
    applyPreset,
    setCanvasMode,
    resetLayout,
    toggleLeft,
    toggleRight,
    beginLeftResize: (event: ReactPointerEvent<HTMLButtonElement>) => beginResize("left", event),
    beginRightResize: (event: ReactPointerEvent<HTMLButtonElement>) => beginResize("right", event),
  };
}
