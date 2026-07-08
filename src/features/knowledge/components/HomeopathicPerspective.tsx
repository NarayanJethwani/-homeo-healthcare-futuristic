"use client";

import React, { useState } from "react";
import { BookOpen, AlertTriangle, ShieldCheck, Heart } from "lucide-react";
import { KnowledgeEntity } from "../types";

interface HomeopathicPerspectiveProps {
  entity: KnowledgeEntity;
}

export default function HomeopathicPerspective({ entity }: HomeopathicPerspectiveProps) {
  const hp = entity.homeopathicPerspective;
  const legacyConv = entity.content?.conventionalManagement;
  const legacyHomeo = entity.content?.homeopathicApproach;

  const [activeTab, setActiveTab] = useState<"conv" | "homeo" | "const" | "limits">("conv");

  if (!hp && !legacyConv && !legacyHomeo) {
    return null; // Gracefully hide if no data exists
  }

  // Fallback for pages that don't have the new structured clinical perspective
  if (!hp) {
    return (
      <div id="homeopathic-perspective" className="border-t border-neutral-500/5 pt-6 scroll-mt-24">
        <div className="p-5 border border-neutral-200 dark:border-neutral-850 rounded-2xl bg-white/5 space-y-4">
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 border-b border-neutral-500/5 pb-2">
            <BookOpen className="h-5 w-5 text-rose-500" /> Treatment Approaches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legacyConv && (
              <div className="space-y-2">
                <h4 className="font-bold text-neutral-850 dark:text-neutral-200 text-xs uppercase tracking-wider">Conventional Management</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-405 leading-relaxed">{legacyConv}</p>
              </div>
            )}
            {legacyHomeo && (
              <div className="space-y-2">
                <h4 className="font-bold text-teal-650 dark:text-teal-400 text-xs uppercase tracking-wider">Homeopathic Approach</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-405 leading-relaxed">{legacyHomeo}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="homeopathic-perspective" className="border-t border-neutral-500/5 pt-6 scroll-mt-24 space-y-4">
      <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        <Heart className="h-5 w-5 text-teal-600 dark:text-teal-400" /> Homeopathic Clinical Perspective
      </h3>

      <div className="border border-neutral-200 dark:border-neutral-850 rounded-3xl overflow-hidden bg-white/10 dark:bg-neutral-950/10 backdrop-blur-md">
        {/* Tab Headers */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-850 bg-neutral-100/50 dark:bg-neutral-900/50 flex-wrap">
          <button
            onClick={() => setActiveTab("conv")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "conv"
                ? "border-teal-500 text-teal-650 dark:text-teal-400 bg-white/50 dark:bg-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Conventional Understanding
          </button>
          <button
            onClick={() => setActiveTab("homeo")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "homeo"
                ? "border-teal-500 text-teal-650 dark:text-teal-400 bg-white/50 dark:bg-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Homeopathic Interpretation
          </button>
          <button
            onClick={() => setActiveTab("const")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "const"
                ? "border-teal-500 text-teal-650 dark:text-teal-400 bg-white/50 dark:bg-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Constitutional & Individualization
          </button>
          <button
            onClick={() => setActiveTab("limits")}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider flex-1 text-center transition-colors cursor-pointer border-b-2 ${
              activeTab === "limits"
                ? "border-rose-500 text-rose-650 dark:text-rose-400 bg-white/50 dark:bg-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            Clinical Limitations
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 min-h-[140px]">
          {activeTab === "conv" && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-400 dark:text-neutral-500 block">
                Standard Medical Consensus
              </span>
              <p className="text-xs md:text-sm">{hp.conventionalUnderstanding}</p>
            </div>
          )}

          {activeTab === "homeo" && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-teal-600 dark:text-teal-400 block">
                Vitalist & Miasmatic Interpretation
              </span>
              <p className="text-xs md:text-sm">{hp.homeopathicInterpretation}</p>
            </div>
          )}

          {activeTab === "const" && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-500 block mb-1">
                  Constitutional Typology
                </span>
                <p className="text-xs md:text-sm">{hp.constitutionalConsiderations}</p>
              </div>
              <div className="border-t border-neutral-500/5 pt-3">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-500 block mb-1">
                  Individualization Strategy
                </span>
                <p className="text-xs md:text-sm">{hp.individualization}</p>
              </div>
            </div>
          )}

          {activeTab === "limits" && (
            <div className="space-y-3 p-4 border border-rose-500/10 bg-rose-500/5 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-400 font-bold uppercase tracking-wider">
                <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> Scope of Homeopathic Intervention
              </div>
              <p className="text-xs md:text-sm text-neutral-800 dark:text-neutral-300">
                {hp.limitations}
              </p>
            </div>
          )}
        </div>

        {/* Permanent Educational and Safety Limitations Footer */}
        <div className="bg-amber-500/5 dark:bg-amber-500/3 border-t border-neutral-200 dark:border-neutral-850 p-4 text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
          <p className="leading-relaxed">
            <strong className="text-neutral-850 dark:text-neutral-200 font-bold uppercase tracking-wider text-[9px] block mb-0.5">Educational Note:</strong> 
            This information is compiled from classical homeopathic literature and modern clinical reviews for general educational reference. Individualized homeopathic care relies on strict constitutional matching and should be guided by a certified practitioner.
          </p>
          <p className="leading-relaxed border-t border-neutral-500/5 pt-2">
            <strong className="text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-[9px] block mb-0.5">Clinical Warning & Limitations:</strong>
            Homeopathic therapy is complementary and does NOT replace emergency medical care, acute surgical interventions, or essential conventional drug replacement regimens (such as insulin or thyroid hormones). If you present with red flag symptoms, seek immediate professional urgent care.
          </p>
        </div>
      </div>
    </div>
  );
}
