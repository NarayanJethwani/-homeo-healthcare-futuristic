export type ReaderTheme = "light" | "sepia" | "dark";
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

export const THEME_CSS_VARIABLES: Record<ReaderTheme, { bg: string; text: string; border: string }> = {
  light: { bg: "#ffffff", text: "#1e293b", border: "#e2e8f0" },
  sepia: { bg: "#FAF7F0", text: "#3E301F", border: "#E5DFC9" },
  dark: { bg: "#090D10", text: "#C5D0CD", border: "#1e293b" },
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

  if (["light", "sepia", "dark"].includes(prefs.theme)) {
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
