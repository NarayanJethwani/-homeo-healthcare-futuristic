import React from "react";
import { Maximize2, Minimize2, Type, Columns, AlignJustify } from "lucide-react";
import { ReaderPreferences, ReaderTheme, ReaderFontSize, ReaderLineHeight, ReaderColumnWidth } from "../../reader/preferences";

type ReaderToolbarProps = {
  preferences: ReaderPreferences;
  onPreferenceChange: (prefs: ReaderPreferences | ((prev: ReaderPreferences) => ReaderPreferences)) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
};

export const ReaderToolbar: React.FC<ReaderToolbarProps> = ({
  preferences,
  onPreferenceChange,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const updatePreference = <K extends keyof ReaderPreferences>(key: K, value: ReaderPreferences[K]) => {
    onPreferenceChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-[var(--reader-surface)] text-[var(--reader-text)] border border-[var(--reader-border)] p-2.5 rounded-2xl select-none shadow-sm">
      
      {/* Theme selection */}
      <div className="flex items-center bg-[var(--reader-control)] p-0.5 rounded-lg border border-[var(--reader-border)]">
        {(["light", "sepia", "forest", "dark"] as ReaderTheme[]).map((theme) => (
          <button
            key={theme}
            onClick={() => updatePreference("theme", theme)}
            aria-pressed={preferences.theme === theme}
            title={`${theme.charAt(0).toUpperCase()}${theme.slice(1)} reading theme`}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
              preferences.theme === theme
                ? "bg-[var(--reader-accent-surface)] text-[var(--reader-accent)] font-extrabold"
                : "text-[var(--reader-muted)] hover:text-[var(--reader-text)]"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-[var(--reader-border)] hidden sm:block" />

      {/* Font Size Selection */}
      <div className="flex items-center gap-1.5">
        <Type size={14} className="text-[var(--reader-muted)]" />
        <div className="flex items-center bg-[var(--reader-control)] p-0.5 rounded-lg border border-[var(--reader-border)]">
          {(["sm", "base", "lg", "xl", "2xl"] as ReaderFontSize[]).map((sz) => (
            <button
              key={sz}
              onClick={() => updatePreference("fontSize", sz)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.fontSize === sz
                ? "bg-[var(--reader-accent-surface)] text-[var(--reader-accent)] font-extrabold"
                : "text-[var(--reader-muted)] hover:text-[var(--reader-text)]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-[var(--reader-border)] hidden sm:block" />

      {/* Line Height Selection */}
      <div className="flex items-center gap-1.5">
        <AlignJustify size={14} className="text-[var(--reader-muted)]" />
        <div className="flex items-center bg-[var(--reader-control)] p-0.5 rounded-lg border border-[var(--reader-border)]">
          {(["normal", "relaxed", "loose"] as ReaderLineHeight[]).map((lh) => (
            <button
              key={lh}
              onClick={() => updatePreference("lineHeight", lh)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.lineHeight === lh
                ? "bg-[var(--reader-accent-surface)] text-[var(--reader-accent)] font-extrabold"
                : "text-[var(--reader-muted)] hover:text-[var(--reader-text)]"
              }`}
            >
              {lh}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-[var(--reader-border)] hidden sm:block" />

      {/* Column Width Selection */}
      <div className="flex items-center gap-1.5">
        <Columns size={14} className="text-[var(--reader-muted)]" />
        <div className="flex items-center bg-[var(--reader-control)] p-0.5 rounded-lg border border-[var(--reader-border)]">
          {(["narrow", "medium", "wide"] as ReaderColumnWidth[]).map((cw) => (
            <button
              key={cw}
              onClick={() => updatePreference("columnWidth", cw)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.columnWidth === cw
                ? "bg-[var(--reader-accent-surface)] text-[var(--reader-accent)] font-extrabold"
                : "text-[var(--reader-muted)] hover:text-[var(--reader-text)]"
              }`}
            >
              {cw}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-[var(--reader-border)]" />

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
        className="flex items-center justify-center p-1.5 rounded-lg bg-[var(--reader-control)] border border-[var(--reader-border)] text-[var(--reader-muted)] hover:text-[var(--reader-accent)] transition-all focus:outline-none cursor-pointer"
      >
        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>

    </div>
  );
};
export default ReaderToolbar;
