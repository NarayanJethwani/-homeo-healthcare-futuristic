export type ReaderTheme = "light" | "sepia" | "forest" | "dark";
export type ReaderFontSize = "sm" | "base" | "lg" | "xl" | "2xl";
export type ReaderLineHeight = "normal" | "relaxed" | "loose";
export type ReaderColumnWidth = "narrow" | "medium" | "wide";

export type ReaderPreferences = {
  theme: ReaderTheme;
  fontSize: ReaderFontSize;
  lineHeight: ReaderLineHeight;
  columnWidth: ReaderColumnWidth;
};

export const DEFAULT_PREFERENCES: ReaderPreferences = {
  theme: "light",
  fontSize: "base",
  lineHeight: "normal",
  columnWidth: "medium",
};

export type ReaderThemePalette = {
  bg: string;
  surface: string;
  control: string;
  text: string;
  muted: string;
  subtle: string;
  border: string;
  accent: string;
  accentSurface: string;
};

export const THEME_CSS_VARIABLES: Record<ReaderTheme, ReaderThemePalette> = {
  light: {
    bg: "#ffffff",
    surface: "#f8fafc",
    control: "#ffffff",
    text: "#172033",
    muted: "#475569",
    subtle: "#94a3b8",
    border: "#cbd5e1",
    accent: "#92400e",
    accentSurface: "#fef3c7",
  },
  sepia: {
    bg: "#FAF7F0",
    surface: "#f3ecdc",
    control: "#fffdf8",
    text: "#3E301F",
    muted: "#6b5135",
    subtle: "#9a8266",
    border: "#d6c8ad",
    accent: "#8a3f0a",
    accentSurface: "#f4dfb6",
  },
  forest: {
    bg: "#10231B",
    surface: "#173329",
    control: "#0D1F18",
    text: "#EDF7F0",
    muted: "#B9CCBF",
    subtle: "#82998A",
    border: "#42614F",
    accent: "#9BD3A7",
    accentSurface: "#234A35",
  },
  dark: {
    bg: "#090D10",
    surface: "#111827",
    control: "#020617",
    text: "#e2e8f0",
    muted: "#a8b3c2",
    subtle: "#64748b",
    border: "#334155",
    accent: "#fbbf24",
    accentSurface: "#3b2a0b",
  },
};

export const FONT_SIZE_MAPPING: Record<ReaderFontSize, string> = {
  sm: "13px",
  base: "15px",
  lg: "18px",
  xl: "21px",
  "2xl": "24px",
};

export const LINE_HEIGHT_MAPPING: Record<ReaderLineHeight, string> = {
  normal: "1.5",
  relaxed: "1.75",
  loose: "2.0",
};

export const COLUMN_WIDTH_MAPPING: Record<ReaderColumnWidth, string> = {
  narrow: "36rem",  // max-w-xl
  medium: "48rem",  // max-w-3xl
  wide: "64rem",    // max-w-5xl
};

export function validatePreferences(prefs: any): ReaderPreferences {
  const result = { ...DEFAULT_PREFERENCES };
  
  if (!prefs || typeof prefs !== "object") return result;

  if (["light", "sepia", "forest", "dark"].includes(prefs.theme)) {
    result.theme = prefs.theme;
  }
  if (["sm", "base", "lg", "xl", "2xl"].includes(prefs.fontSize)) {
    result.fontSize = prefs.fontSize;
  }
  if (["normal", "relaxed", "loose"].includes(prefs.lineHeight)) {
    result.lineHeight = prefs.lineHeight;
  }
  if (["narrow", "medium", "wide"].includes(prefs.columnWidth)) {
    result.columnWidth = prefs.columnWidth;
  }

  return result;
}
