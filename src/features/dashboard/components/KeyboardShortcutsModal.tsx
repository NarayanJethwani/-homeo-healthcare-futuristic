"use client";

import React, { useEffect, useRef } from "react";
import { X, Keyboard } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: KeyboardShortcutsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap and Escape listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on mount
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ["⌘", "K"], desc: "Open Global Command Search" },
    { keys: ["⌘", "["], desc: "Toggle Navigation Sidebar collapse" },
    { keys: ["Esc"], desc: "Dismiss open modals, menus, and overlays" },
    { keys: ["↑", "↓"], desc: "Navigate command palette and menu listings" },
    { keys: ["Enter"], desc: "Confirm selection / Trigger active action" },
    { keys: ["?"], desc: "Toggle this Keyboard Shortcuts help board" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-modal-title"
        className="relative w-full max-w-md bg-white dark:bg-[#1D2B3E] border border-slate-205 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-800 dark:text-slate-200 transition-all select-none dashboard-dropdown-dark"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850/60 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 text-teal-650 dark:text-teal-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <h2 id="shortcuts-modal-title" className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 cursor-pointer border-none bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-teal-555 outline-none dashboard-focus-ring"
            aria-label="Close keyboard shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
          {shortcuts.map((shortcut, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between text-xs py-1"
            >
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                {shortcut.desc}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {shortcut.keys.map((key, keyIdx) => (
                  <kbd 
                    key={keyIdx}
                    className="inline-flex items-center justify-center px-2 py-1 min-w-[24px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-lg text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 shadow-xs"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-850/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-750 text-white rounded-xl text-xs font-bold border-none transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-teal-555 outline-none dashboard-focus-ring"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
