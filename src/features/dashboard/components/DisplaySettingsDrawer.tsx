"use client";

import React, { useEffect } from "react";
import { X, Sun, Moon, Info } from "lucide-react";

interface DisplaySettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  globalFontSize: "S" | "M" | "L" | "XL";
  setGlobalFontSize: (size: "S" | "M" | "L" | "XL") => void;
  globalLayoutZoom: number;
  setGlobalLayoutZoom: (zoom: number | ((prev: number) => number)) => void;
  globalReadingWidth: "standard" | "wide" | "full";
  setGlobalReadingWidth: (width: "standard" | "wide" | "full") => void;
  theme: "light" | "dark" | "system";
  toggleTheme: () => void;
  reduceMotion: boolean;
  setReduceMotion: (val: boolean) => void;
}

export default function DisplaySettingsDrawer({
  isOpen,
  onClose,
  globalFontSize,
  setGlobalFontSize,
  globalLayoutZoom,
  setGlobalLayoutZoom,
  globalReadingWidth,
  setGlobalReadingWidth,
  theme,
  toggleTheme,
  reduceMotion,
  setReduceMotion,
}: DisplaySettingsDrawerProps) {
  // Listen for Escape key to close the drawer (Accessibility)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-[90] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[91] flex flex-col transform transition-transform duration-300 ease-out select-none text-slate-800 dark:text-slate-250 ${
          reduceMotion ? "transition-none" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Display settings panel"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">Display Settings</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
              Customize dashboard visual accessibility.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8.5 h-8.5 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Close settings drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                  theme === "light"
                    ? "bg-teal-50/50 dark:bg-teal-950/20 border-teal-500 text-teal-650 dark:text-teal-400"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-350"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                  theme === "dark"
                    ? "bg-teal-50/50 dark:bg-teal-950/20 border-teal-500 text-teal-650 dark:text-teal-400"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50 text-slate-600 dark:text-slate-350"
                }`}
              >
                <Moon className="w-4 h-4 text-violet-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Font Sizer */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Text Sizing
            </label>
            <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {(["S", "M", "L", "XL"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setGlobalFontSize(size)}
                  className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                    globalFontSize === size
                      ? "bg-white dark:bg-slate-800 text-teal-650 dark:text-teal-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                      : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-200 border-none bg-transparent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 flex items-start gap-1 px-1 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>Adjusts typography size to reduce eye strain over long clinical hours.</span>
            </p>
          </div>

          {/* Zoom Level */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interface Zoom
            </label>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-850 px-4 py-2 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <button
                onClick={() => setGlobalLayoutZoom((prev) => Math.max(80, prev - 5))}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold w-12 text-center text-slate-700 dark:text-slate-350">
                {globalLayoutZoom}%
              </span>
              <button
                onClick={() => setGlobalLayoutZoom((prev) => Math.min(130, prev + 5))}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Page Width */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Content Width
            </label>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-850 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {(["standard", "wide", "full"] as const).map((width) => (
                <button
                  key={width}
                  onClick={() => setGlobalReadingWidth(width)}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                    globalReadingWidth === width
                      ? "bg-white dark:bg-slate-800 text-teal-650 dark:text-teal-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                      : "text-slate-450 hover:text-slate-700 dark:hover:text-slate-250 border-none bg-transparent"
                  }`}
                >
                  {width === "standard" ? "Comfort" : width === "wide" ? "Wide" : "Full"}
                </button>
              ))}
            </div>
          </div>

          {/* Motion Adjustments */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Motion Settings
            </label>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Reduced Motion</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5">
                  Minimize transition animations.
                </div>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-11 h-6 rounded-full p-0.5 cursor-pointer border-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                  reduceMotion ? "bg-teal-500" : "bg-slate-255 dark:bg-slate-700"
                }`}
                role="switch"
                aria-checked={reduceMotion}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                    reduceMotion ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 text-[10px] text-slate-450 dark:text-slate-500 text-center leading-normal">
          Dr. Jethwani’s Clinical OS v2.0
          <br />
          Built for seamless clinic orchestration.
        </div>
      </div>
    </>
  );
}
