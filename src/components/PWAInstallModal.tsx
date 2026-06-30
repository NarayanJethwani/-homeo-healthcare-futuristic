"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Share, Plus, Smartphone, Download, Check } from "lucide-react";
import Image from "next/image";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
}

export default function PWAInstallModal({ isOpen, onClose, isIOS }: PWAInstallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-md bg-white/90 dark:bg-[#0B132B]/90 backdrop-blur-xl border border-mint/20 dark:border-mint/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(20,184,166,0.15)] overflow-hidden z-10"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-mint/10 dark:bg-mint/5 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-lavender/10 dark:bg-lavender/5 blur-2xl pointer-events-none" />

            {/* Header Controls */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-300 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-mint/10 dark:bg-mint/15 border border-mint/20 overflow-hidden shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Homeo Healthcare Logo"
                  width={48}
                  height={48}
                  className="object-contain p-1"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#1A2421] dark:text-zinc-100">
                  Install Homeo Healthcare
                </h3>
                <p className="text-xs text-mint font-semibold uppercase tracking-widest mt-1">
                  PWA Web Application
                </p>
              </div>
              <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed max-w-sm">
                Add Homeo Healthcare to your home screen for quick, one-tap access to advanced personalized healing and clinical precision.
              </p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="mt-8 space-y-5">
              {isIOS ? (
                <>
                  <div className="flex gap-4 items-start bg-slate-500/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-mint/10 dark:bg-mint/25 text-mint flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                        Tap the Share button
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed">
                        Tap the Share icon <Share className="inline-block w-4 h-4 text-mint mx-0.5" /> in the Safari toolbar (at the bottom or top of your screen).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-slate-500/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-mint/10 dark:bg-mint/25 text-mint flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        Add to Home Screen
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed">
                        Scroll down the sharing options menu and tap <span className="font-semibold text-slate-800 dark:text-zinc-200">Add to Home Screen</span> <Plus className="inline-block w-4 h-4 text-mint border border-mint/20 rounded mx-0.5" />.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-slate-500/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-mint/10 dark:bg-mint/25 text-mint flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        Confirm Installation
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed">
                        Tap <span className="font-bold text-mint">Add</span> in the top-right corner of the popup to finalize.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4 items-start bg-slate-500/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-mint/10 dark:bg-mint/25 text-mint flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
                        Open Browser Menu
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed">
                        Click on your browser's menu option (usually three vertical dots in the top-right or bottom toolbar).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start bg-slate-500/5 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-mint/10 dark:bg-mint/25 text-mint flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        Select Install App
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-zinc-400 leading-relaxed">
                        Tap <span className="font-semibold text-slate-800 dark:text-zinc-200">Install app</span> or <span className="font-semibold text-slate-800 dark:text-zinc-200">Add to Home screen</span>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* OK / Got it CTA */}
            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-mint hover:bg-mint-dark text-white rounded-2xl text-sm font-bold tracking-wide uppercase transition-all duration-300 shadow-md shadow-mint/10 hover:shadow-mint/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Got it, thanks
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
