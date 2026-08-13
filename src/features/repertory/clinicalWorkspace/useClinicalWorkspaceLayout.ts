"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

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
      leftWidth: clamp(Number(parsed.leftWidth) || defaults.leftWidth, 280, 760),
      rightWidth: clamp(Number(parsed.rightWidth) || defaults.rightWidth, 260, 620),
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
  const workspaceRef = useRef<HTMLDivElement>(null);

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
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const startX = event.clientX;
    const startWidth = side === "left" ? layout.leftWidth : layout.rightWidth;
    const workspaceWidth = workspaceRef.current?.getBoundingClientRect().width || window.innerWidth;
    const leftMaximum = Math.max(360, Math.min(760, workspaceWidth - layout.rightWidth - 420));
    const rightMaximum = Math.max(320, Math.min(620, workspaceWidth - layout.leftWidth - 420));

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      setLayout((current) => ({
        ...current,
        ...(side === "left"
          ? { leftWidth: clamp(startWidth + delta, 280, leftMaximum), leftCollapsed: false }
          : { rightWidth: clamp(startWidth - delta, 260, rightMaximum), rightCollapsed: false }),
      }));
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointercancel", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerUp);
  }, [layout.leftWidth, layout.rightWidth]);

  const resizeWithKeyboard = useCallback((side: "left" | "right", event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const amount = event.shiftKey ? 50 : 20;
    setLayout((current) => ({
      ...current,
      ...(side === "left"
        ? { leftWidth: clamp(current.leftWidth + direction * amount, 280, 760), leftCollapsed: false }
        : { rightWidth: clamp(current.rightWidth - direction * amount, 260, 620), rightCollapsed: false }),
    }));
  }, []);

  const style = useMemo(() => ({
    "--ckw-left-width": `${layout.leftCollapsed ? 0 : layout.leftWidth}px`,
    "--ckw-right-width": `${layout.rightCollapsed ? 0 : layout.rightWidth}px`,
  } as CSSProperties), [layout]);

  return {
    ...layout,
    workspaceRef,
    style,
    applyPreset,
    setCanvasMode,
    resetLayout,
    toggleLeft,
    toggleRight,
    beginLeftResize: (event: ReactPointerEvent<HTMLButtonElement>) => beginResize("left", event),
    beginRightResize: (event: ReactPointerEvent<HTMLButtonElement>) => beginResize("right", event),
    resizeLeftWithKeyboard: (event: ReactKeyboardEvent<HTMLButtonElement>) => resizeWithKeyboard("left", event),
    resizeRightWithKeyboard: (event: ReactKeyboardEvent<HTMLButtonElement>) => resizeWithKeyboard("right", event),
  };
}
