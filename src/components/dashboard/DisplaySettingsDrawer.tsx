"use client";

import React from "react";
import { X, Sun, Moon, Info } from "lucide-react";

interface DisplaySettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  globalFontSize: "S" | "M" | "L" | "XL";
  setGlobalFontSize: (size: "S" | "M" | "L" | "XL") => void;
  globalLayoutZoom: number;
  setGlobalLayoutZoom: (zoom: number | ((prev: number) => number)) => void;
  globalReadingWidth: "standard" | "wide" | "borderless";
  setGlobalReadingWidth: (width: "standard" | "wide" | "borderless") => void;
  theme: "light" | "dark";
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
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-[91] flex flex-col transform transition-transform duration-300 ease-out select-none text-slate-800 dark:text-slate-200 ${
          reduceMotion ? "transition-none" : ""
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold">Display Settings</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mt-0.5">
              Customize dashboard visual accessibility.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 transition-colors cursor-pointer border-none bg-transparent"
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
                className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === "light"
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  theme === "dark"
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-600"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50"
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
                  className={`py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    globalFontSize === size
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-250 border-none bg-transparent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-505 flex items-start gap-1 px-1">
              <Info className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
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
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
              >
                -
              </button>
              <span className="text-xs font-mono font-bold w-12 text-center">
                {globalLayoutZoom}%
              </span>
              <button
                onClick={() => setGlobalLayoutZoom((prev) => Math.min(130, prev + 5))}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
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
              {(["standard", "wide", "borderless"] as const).map((width) => (
                <button
                  key={width}
                  onClick={() => setGlobalReadingWidth(width)}
                  className={`py-2 rounded-xl text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    globalReadingWidth === width
                      ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-none bg-transparent"
                  }`}
                >
                  {width === "standard" ? "Std" : width === "wide" ? "Wide" : "Full"}
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
                <div className="text-xs font-bold">Reduced Motion</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  Minimize transition animations.
                </div>
              </div>
              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className={`w-11 h-6 rounded-full p-0.5 cursor-pointer border-none transition-colors duration-200 ${
                  reduceMotion ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
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
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/50 text-[10px] text-slate-400 dark:text-slate-500 text-center leading-normal">
          Dr. Jethwani’s Clinical OS v2.0
          <br />
          Built for seamless clinic orchestration.
        </div>
      </div>
    </>
  );
}
