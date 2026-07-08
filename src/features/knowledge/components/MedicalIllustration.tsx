"use client";

import React from "react";

interface MedicalIllustrationProps {
  slug: string;
}

export default function MedicalIllustration({ slug }: MedicalIllustrationProps) {
  switch (slug) {
    case "hypothyroidism":
    case "hashimoto-thyroiditis":
    case "hyperthyroidism":
      return (
        <div className="my-8 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-sm shadow-sm print:border-neutral-400 print:bg-transparent">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 print:text-neutral-700">
            Clinical Diagram: Hypothalamic-Pituitary-Thyroid (HPT) Feedback Axis
          </h4>
          <div className="w-full flex justify-center">
            <svg 
              viewBox="0 0 800 350" 
              className="w-full max-w-2xl h-auto text-neutral-850 dark:text-neutral-200"
              aria-label="Hypothalamic-Pituitary-Thyroid Axis Diagram"
            >
              {/* Definitions for Gradients and Markers */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-teal-600 dark:fill-teal-400" />
                </marker>
                <marker id="inhibit-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" className="fill-rose-500" />
                </marker>
                <linearGradient id="gradient-hpt" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Background */}
              <rect width="100%" height="100%" rx="16" fill="url(#gradient-hpt)" className="stroke-neutral-500/10" strokeWidth="1" />

              {/* Hypothalamus Node */}
              <g transform="translate(100, 40)">
                <rect width="160" height="50" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="80" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:fill-neutral-100">Hypothalamus</text>
                <text x="80" y="40" textAnchor="middle" className="text-[10px] fill-neutral-500">Secretes TRH</text>
              </g>

              {/* Pituitary Node */}
              <g transform="translate(100, 150)">
                <rect width="160" height="55" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="80" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:fill-neutral-100">Anterior Pituitary</text>
                <text x="80" y="40" textAnchor="middle" className="text-[10px] fill-neutral-500">Secretes TSH</text>
              </g>

              {/* Thyroid Node */}
              <g transform="translate(100, 260)">
                <rect width="160" height="55" rx="8" className="fill-teal-500/10 dark:fill-teal-500/5 stroke-teal-500/30" strokeWidth="2" />
                <text x="80" y="25" textAnchor="middle" className="text-xs font-extrabold fill-teal-700 dark:fill-teal-300">Thyroid Gland</text>
                <text x="80" y="42" textAnchor="middle" className="text-[10px] fill-teal-600/80 dark:fill-teal-400/80">Releases T4 & T3</text>
              </g>

              {/* Output Target Tissue Node */}
              <g transform="translate(480, 260)">
                <rect width="180" height="55" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Systemic Metabolism</text>
                <text x="90" y="42" textAnchor="middle" className="text-[10px] fill-neutral-500">Target tissues & Mitochondria</text>
              </g>

              {/* Path Connections */}
              {/* TRH Stimulates Pituitary */}
              <path d="M 180 90 L 180 142" fill="none" strokeWidth="2" className="stroke-teal-600 dark:stroke-teal-400" markerEnd="url(#arrow)" />
              <text x="195" y="120" className="text-[10px] font-bold fill-teal-600 dark:fill-teal-400">TRH (+)</text>

              {/* TSH Stimulates Thyroid */}
              <path d="M 180 205 L 180 252" fill="none" strokeWidth="2" className="stroke-teal-600 dark:stroke-teal-400" markerEnd="url(#arrow)" />
              <text x="195" y="235" className="text-[10px] font-bold fill-teal-600 dark:fill-teal-400">TSH (+)</text>

              {/* Thyroid Hormone Target */}
              <path d="M 260 287 L 472 287" fill="none" strokeWidth="2" className="stroke-teal-600 dark:stroke-teal-400" markerEnd="url(#arrow)" />
              <text x="366" y="278" textAnchor="middle" className="text-[10px] fill-neutral-500">Free T4 / Free T3</text>

              {/* Negative Feedback Loops */}
              {/* Up to Pituitary */}
              <path d="M 260 287 L 380 287 L 380 177 L 270 177" fill="none" strokeWidth="1.5" className="stroke-rose-500" strokeDasharray="4 3" markerEnd="url(#inhibit-arrow)" />
              
              {/* Up to Hypothalamus */}
              <path d="M 380 177 L 380 65 L 270 65" fill="none" strokeWidth="1.5" className="stroke-rose-500" strokeDasharray="4 3" markerEnd="url(#inhibit-arrow)" />
              
              <text x="390" y="115" className="text-[10px] font-bold fill-rose-500">Negative Feedback (-)</text>
              <text x="310" y="58" className="text-[9px] fill-rose-500">High T4/T3 inhibits TRH</text>
              <text x="310" y="170" className="text-[9px] fill-rose-500">High T4/T3 inhibits TSH</text>
            </svg>
          </div>
          <p className="text-[11px] text-neutral-500 mt-3 text-center leading-relaxed">
            In primary hypothyroidism, destruction of the thyroid gland limits T4 production, removing the negative feedback loop and driving compensatory TSH elevation.
          </p>
        </div>
      );

    case "tsh":
      return (
        <div className="my-8 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-sm shadow-sm print:border-neutral-400 print:bg-transparent">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 print:text-neutral-700">
            TSH Laboratory Reference Ranges & Clinical Interpretation
          </h4>
          <div className="w-full flex justify-center">
            <svg 
              viewBox="0 0 800 240" 
              className="w-full max-w-2xl h-auto text-neutral-850 dark:text-neutral-200"
              aria-label="TSH Range Chart"
            >
              {/* Chart Scale */}
              <g transform="translate(50, 120)">
                {/* Baseline Axis */}
                <line x1="0" y1="0" x2="700" y2="0" stroke="currentColor" strokeWidth="2" />

                {/* Hyperthyroid Range Box */}
                <rect x="0" y="-40" width="150" height="40" fill="#f43f5e" fillOpacity="0.15" />
                <text x="75" y="-18" textAnchor="middle" className="text-[10px] font-bold fill-rose-600">Suppressed</text>

                {/* Optimal Euthyroid Box */}
                <rect x="150" y="-40" width="250" height="40" fill="#10b981" fillOpacity="0.15" />
                <text x="275" y="-18" textAnchor="middle" className="text-[10px] font-bold fill-emerald-600">Optimal Range</text>

                {/* Mild / Subclinical Hypo Box */}
                <rect x="400" y="-40" width="180" height="40" fill="#f59e0b" fillOpacity="0.15" />
                <text x="490" y="-18" textAnchor="middle" className="text-[10px] font-bold fill-amber-600">Subclinical Hypo</text>

                {/* Overt Hypo Box */}
                <rect x="580" y="-40" width="120" height="40" fill="#ef4444" fillOpacity="0.15" />
                <text x="640" y="-18" textAnchor="middle" className="text-[10px] font-bold fill-red-600">Overt Hypo</text>

                {/* Tick Marks & Labels */}
                {/* 0.0 mIU/L */}
                <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="2" />
                <text x="0" y="24" textAnchor="middle" className="text-[10px] font-mono">0.0</text>

                {/* 0.45 mIU/L */}
                <line x1="150" y1="0" x2="150" y2="8" stroke="currentColor" strokeWidth="2" />
                <text x="150" y="24" textAnchor="middle" className="text-[10px] font-mono">0.45</text>

                {/* 2.5 mIU/L (Target) */}
                <line x1="280" y1="0" x2="280" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="280" y="24" textAnchor="middle" className="text-[9px] font-mono fill-neutral-500">2.5 (Target)</text>

                {/* 4.5 mIU/L */}
                <line x1="400" y1="0" x2="400" y2="8" stroke="currentColor" strokeWidth="2" />
                <text x="400" y="24" textAnchor="middle" className="text-[10px] font-mono">4.5</text>

                {/* 10.0 mIU/L */}
                <line x1="580" y1="0" x2="580" y2="8" stroke="currentColor" strokeWidth="2" />
                <text x="580" y="24" textAnchor="middle" className="text-[10px] font-mono">10.0</text>

                {/* Arrow to end */}
                <path d="M 700 0 L 690 -5 M 700 0 L 690 5" stroke="currentColor" strokeWidth="2" />
                <text x="690" y="24" textAnchor="middle" className="text-[10px] font-mono">mIU/L</text>
              </g>

              {/* Title & Notes */}
              <text x="400" y="30" textAnchor="middle" className="text-xs font-bold fill-neutral-800 dark:fill-neutral-100">TSH Spectrum (mIU/L)</text>
            </svg>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 text-center leading-relaxed">
            Note: Standard diagnostic range for adults is typically 0.45 - 4.5 mIU/L. Values outside these boundaries warrant Free T4 evaluation.
          </p>
        </div>
      );

    case "gerd":
      return (
        <div className="my-8 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-sm shadow-sm print:border-neutral-400 print:bg-transparent">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 print:text-neutral-700">
            Anatomical Vector: Lower Esophageal Sphincter (LES) Competence
          </h4>
          <div className="w-full flex justify-center">
            <svg 
              viewBox="0 0 800 280" 
              className="w-full max-w-2xl h-auto text-neutral-850 dark:text-neutral-200"
              aria-label="GERD Anatomical Vector Diagram"
            >
              {/* Esophagus & Stomach Illustration */}
              <defs>
                <linearGradient id="stomach-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f87171" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="acid-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a3e635" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#84cc16" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Normal Esophageal-Stomach Junction (Left) */}
              <g transform="translate(50, 0)">
                <text x="150" y="30" textAnchor="middle" className="text-xs font-bold fill-emerald-600">Normal Physiology</text>
                
                {/* Esophagus */}
                <path d="M 130 50 L 130 140 A 20 20 0 0 0 150 160 L 250 170" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 170 50 L 170 120 A 40 40 0 0 1 210 160 L 250 240" fill="none" stroke="currentColor" strokeWidth="4" />

                {/* Stomach Base Outline */}
                <path d="M 250 170 A 50 50 0 0 1 300 220 L 290 260 A 60 60 0 0 1 180 240" fill="url(#stomach-gradient)" stroke="currentColor" strokeWidth="2" />

                {/* Closed LES Valve */}
                <ellipse cx="150" cy="135" rx="14" ry="7" className="fill-emerald-500 stroke-emerald-600" />
                <text x="100" y="138" className="text-[9px] fill-neutral-500">LES Closed</text>
                
                {/* Acid Level (Normal, kept down) */}
                <path d="M 195 210 Q 250 200 280 220 L 270 250 A 30 30 0 0 1 190 238 Z" fill="url(#acid-gradient)" />
                <text x="230" y="230" className="text-[9px] font-bold fill-lime-700">Acid Pools In Stomach</text>
              </g>

              {/* Reflux / Incompetent LES Junction (Right) */}
              <g transform="translate(420, 0)">
                <text x="150" y="30" textAnchor="middle" className="text-xs font-bold fill-rose-600">GERD Pathophysiology</text>

                {/* Esophagus */}
                <path d="M 130 50 L 130 140 A 20 20 0 0 0 150 160 L 250 170" fill="none" stroke="currentColor" strokeWidth="4" />
                <path d="M 170 50 L 170 120 A 40 40 0 0 1 210 160 L 250 240" fill="none" stroke="currentColor" strokeWidth="4" />

                {/* Stomach Base Outline */}
                <path d="M 250 170 A 50 50 0 0 1 300 220 L 290 260 A 60 60 0 0 1 180 240" fill="url(#stomach-gradient)" stroke="currentColor" strokeWidth="2" />

                {/* Open/Incompetent LES Valve */}
                <ellipse cx="150" cy="135" rx="18" ry="4" className="fill-rose-400 stroke-rose-500" />
                <text x="90" y="138" className="text-[9px] fill-rose-600 font-bold">LES Relaxed</text>

                {/* Reflux Acid Vector (escaping up) */}
                <path d="M 148 90 L 152 90 L 158 135 Q 230 160 280 200 L 270 250 A 30 30 0 0 1 190 238 Z" fill="url(#acid-gradient)" />
                
                {/* Reflux Vector Arrow */}
                <path d="M 150 120 L 150 85" fill="none" stroke="#f43f5e" strokeWidth="2" />
                <text x="170" y="100" className="text-[9px] font-bold fill-rose-600">Acid Regurgitation</text>
              </g>
            </svg>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 text-center leading-relaxed">
            Heartburn occurs when transient relaxations of the LES permit retrograde passage of hydrochloric acid and pepsin into the unprotected esophageal lumen.
          </p>
        </div>
      );

    case "migraine":
      return (
        <div className="my-8 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-sm shadow-sm print:border-neutral-400 print:bg-transparent">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 print:text-neutral-700">
            Neurovascular Model: Trigeminal Nerve Pathway Activation
          </h4>
          <div className="w-full flex justify-center">
            <svg 
              viewBox="0 0 800 280" 
              className="w-full max-w-2xl h-auto text-neutral-850 dark:text-neutral-200"
              aria-label="Migraine Neurovascular Axis Diagram"
            >
              {/* Brain Stem & Trigeminal Node */}
              <g transform="translate(50, 40)">
                <rect width="180" height="60" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Trigeminal Ganglion</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-rose-500 font-semibold">Releases CGRP peptide</text>
              </g>

              {/* Dural Blood Vessel Node */}
              <g transform="translate(450, 40)">
                <rect width="180" height="60" rx="8" className="fill-rose-500/10 dark:fill-rose-500/5 stroke-rose-500/30" strokeWidth="2" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Dural Blood Vessels</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-rose-600 font-semibold">Vasodilation & Inflammation</text>
              </g>

              {/* Thalamus / Cortical Perception Node */}
              <g transform="translate(250, 180)">
                <rect width="200" height="60" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="100" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Thalamus & Cortex</text>
                <text x="100" y="42" textAnchor="middle" className="text-[9px] fill-rose-600 font-extrabold">Unilateral Pulsating Pain</text>
              </g>

              {/* Path Connections */}
              {/* Ganglion activates vessels */}
              <path d="M 230 70 L 442 70" fill="none" strokeWidth="2" className="stroke-rose-450" />
              <text x="336" y="60" textAnchor="middle" className="text-[9px] fill-neutral-500">Neurogenic activation</text>

              {/* Vessels alert Thalamus */}
              <path d="M 540 100 L 540 210 L 460 210" fill="none" strokeWidth="1.5" className="stroke-neutral-500" strokeDasharray="3 3" />
              <text x="530" y="160" textAnchor="middle" className="text-[9px] fill-neutral-500">Sensory transmission</text>

              {/* Retrograde feedback axis */}
              <path d="M 140 100 L 140 210 L 242 210" fill="none" strokeWidth="1.5" className="stroke-neutral-500" strokeDasharray="3 3" />
            </svg>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 text-center leading-relaxed">
            Trigeminal sensory activation stimulates the release of vasoactive neuropeptides (CGRP), inducing painful neurogenic dural vasodilation.
          </p>
        </div>
      );

    case "nux-vomica":
      return (
        <div className="my-8 border border-neutral-250 dark:border-neutral-850 rounded-2xl bg-white/40 dark:bg-neutral-900/40 p-6 backdrop-blur-sm shadow-sm print:border-neutral-400 print:bg-transparent">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 print:text-neutral-700">
            Botanical Source Path & Neuro-Digestive Action Vector
          </h4>
          <div className="w-full flex justify-center">
            <svg 
              viewBox="0 0 800 240" 
              className="w-full max-w-2xl h-auto text-neutral-850 dark:text-neutral-200"
              aria-label="Nux Vomica Action Axis Diagram"
            >
              {/* Botanical Source Node */}
              <g transform="translate(40, 90)">
                <rect width="180" height="60" rx="8" className="fill-teal-500/10 dark:fill-teal-500/5 stroke-teal-500/30" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-teal-700 dark:fill-teal-350">Strychnos nux-vomica</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-neutral-500">Seeds containing Strychnine</text>
              </g>

              {/* CNS Target Node */}
              <g transform="translate(310, 30)">
                <rect width="180" height="60" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Spinal Cord & CNS</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-neutral-500">Hyper-reflexia & Sensitiveness</text>
              </g>

              {/* Gastric Target Node */}
              <g transform="translate(310, 150)">
                <rect width="180" height="60" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-100">Portal / Gastric System</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-neutral-500">Spasmodic urges & Congestion</text>
              </g>

              {/* Clinical Indications Outcome */}
              <g transform="translate(580, 90)">
                <rect width="180" height="60" rx="8" className="fill-neutral-100 dark:fill-neutral-800 stroke-neutral-500/20" strokeWidth="1.5" />
                <text x="90" y="25" textAnchor="middle" className="text-xs font-bold fill-neutral-850 dark:text-neutral-150">Clinical Keynotes</text>
                <text x="90" y="42" textAnchor="middle" className="text-[9px] fill-rose-600 font-semibold">Ineffectual stool urges</text>
              </g>

              {/* Connection Paths */}
              <path d="M 220 120 L 260 120 L 260 60 L 302 60" fill="none" strokeWidth="1.5" className="stroke-teal-600 dark:stroke-teal-400" />
              <path d="M 220 120 L 260 120 L 260 180 L 302 180" fill="none" strokeWidth="1.5" className="stroke-teal-600 dark:stroke-teal-400" />
              
              <path d="M 490 60 L 530 60 L 530 120 L 572 120" fill="none" strokeWidth="1.5" className="stroke-neutral-500" strokeDasharray="3 3" />
              <path d="M 490 180 L 530 180 L 530 120 L 572 120" fill="none" strokeWidth="1.5" className="stroke-neutral-500" strokeDasharray="3 3" />
            </svg>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2 text-center leading-relaxed">
            Phytotherapeutic alkaloids map to nerve synapses, explaining classical keynote symptoms of sensory over-reactivity and spasmodic visceral constriction.
          </p>
        </div>
      );

    default:
      return null;
  }
}
