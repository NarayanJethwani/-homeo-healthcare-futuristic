import React, { useEffect } from "react";
import { ReaderPreferences, ReaderTheme, ReaderFontSize } from "../../reader/preferences";

type ReaderKeyboardShortcutsProps = {
  preferences: ReaderPreferences;
  onPreferenceChange: (prefs: ReaderPreferences | ((prev: ReaderPreferences) => ReaderPreferences)) => void;
  onClose: () => void;
  isFullscreen: boolean;
  onExitFullscreen: () => void;
  isActive: boolean;
};

export const ReaderKeyboardShortcuts: React.FC<ReaderKeyboardShortcutsProps> = ({
  preferences,
  onPreferenceChange,
  onClose,
  isFullscreen,
  onExitFullscreen,
  isActive,
}) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Skip if user is typing inside text input fields, textarea, or selects
      const activeEl = document.activeElement;
      if (activeEl) {
        const tag = activeEl.tagName.toLowerCase();
        if (
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          activeEl.getAttribute("contenteditable") === "true"
        ) {
          return;
        }
      }

      // 2. Bypass browser zoom shortcuts (Ctrl / Command modifiers with +, -, 0)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (e.key) {
        // Close / Escape back to library
        case "Escape":
          if (isFullscreen) {
            onExitFullscreen();
          } else {
            onClose();
          }
          break;

        // Theme swap cycle ('t' / 'T')
        case "t":
        case "T":
          e.preventDefault();
          const themes: ReaderTheme[] = ["light", "sepia", "forest", "dark"];
          const nextThemeIdx = (themes.indexOf(preferences.theme) + 1) % themes.length;
          onPreferenceChange((prev) => ({ ...prev, theme: themes[nextThemeIdx] }));
          break;

        // Font scale enlargement ('f' / 'F')
        case "f":
        case "F":
          e.preventDefault();
          const fontSizes: ReaderFontSize[] = ["sm", "base", "lg", "xl", "2xl"];
          const nextFontSizeIdx = (fontSizes.indexOf(preferences.fontSize) + 1) % fontSizes.length;
          onPreferenceChange((prev) => ({ ...prev, fontSize: fontSizes[nextFontSizeIdx] }));
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [preferences, onPreferenceChange, onClose, isFullscreen, onExitFullscreen, isActive]);

  return null; // Shortcut component has no visual UI representation
};
export default ReaderKeyboardShortcuts;
