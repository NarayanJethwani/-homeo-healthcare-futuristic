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
    <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl select-none">
      
      {/* Theme selection */}
      <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
        {(["light", "sepia", "dark"] as ReaderTheme[]).map((theme) => (
          <button
            key={theme}
            onClick={() => updatePreference("theme", theme)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
              preferences.theme === theme
                ? "bg-amber-500 text-slate-950 font-extrabold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-800 hidden sm:block" />

      {/* Font Size Selection */}
      <div className="flex items-center gap-1.5">
        <Type size={14} className="text-slate-500" />
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          {(["sm", "base", "lg", "xl", "2xl"] as ReaderFontSize[]).map((sz) => (
            <button
              key={sz}
              onClick={() => updatePreference("fontSize", sz)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.fontSize === sz
                  ? "bg-slate-800 text-amber-500 font-extrabold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-slate-800 hidden sm:block" />

      {/* Line Height Selection */}
      <div className="flex items-center gap-1.5">
        <AlignJustify size={14} className="text-slate-500" />
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          {(["normal", "relaxed", "loose"] as ReaderLineHeight[]).map((lh) => (
            <button
              key={lh}
              onClick={() => updatePreference("lineHeight", lh)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.lineHeight === lh
                  ? "bg-slate-800 text-amber-500 font-extrabold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {lh}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-slate-800 hidden sm:block" />

      {/* Column Width Selection */}
      <div className="flex items-center gap-1.5">
        <Columns size={14} className="text-slate-500" />
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          {(["narrow", "medium", "wide"] as ReaderColumnWidth[]).map((cw) => (
            <button
              key={cw}
              onClick={() => updatePreference("columnWidth", cw)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all focus:outline-none cursor-pointer ${
                preferences.columnWidth === cw
                  ? "bg-slate-800 text-amber-500 font-extrabold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {cw}
            </button>
          ))}
        </div>
      </div>

      <div className="h-4 w-px bg-slate-800" />

      {/* Fullscreen Toggle */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
        className="flex items-center justify-center p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-500 transition-all focus:outline-none cursor-pointer"
      >
        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>

    </div>
  );
};
export default ReaderToolbar;
