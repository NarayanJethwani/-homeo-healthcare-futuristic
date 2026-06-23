"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, Wind, Activity, Gem, HeartPulse, Baby, Brain, Shield, 
  X, ArrowRight, Dna, ShieldCheck, Heart, Sparkles 
} from "lucide-react";
import ConditionCard from "./ConditionCard";
import Magnetic from "./Magnetic";
import Portal from "./Portal";

interface ClinicalDetail {
  neurologyPath: string;
  epigeneticSusceptibility: string;
  somaticManifestation: string;
  causes: string[];
  manifestations: string[];
  stages: { phase: string; duration: string; details: string }[];
}

const clinicalProfiles: Record<string, ClinicalDetail> = {
  "Skin Disorders": {
    neurologyPath: "Immune overactivity ➔ Epidermal cell acceleration ➔ Chronic inflammation",
    epigeneticSusceptibility: "Inherited epidermal barrier defects, immune-dermal hypersensitivity, or leaky-gut metabolic burden.",
    somaticManifestation: "Eczematous plaqueing, hyper-keratinization, follicular eruptions, and vitiligo/urticaria.",
    causes: [
      "Genetics & Inherited Dysregulation",
      "Environmental Toxins & Allergens",
      "Gut Barrier Vulnerability (Leaky Gut)",
      "Emotional Stress & Adrenal Spikes"
    ],
    manifestations: [
      "Intense Pruritus (Itching)",
      "Dermal Plaqueing & Scaling",
      "Erythematous Eruptions",
      "Cellular Hyper-proliferation"
    ],
    stages: [
      { phase: "Elimination & Venting", duration: "Days 1-15", details: "Detoxification clears superficial suppressions, which can temporarily manifest as minor skin discharge as the core cleanses." },
      { phase: "Cellular Rebalancing", duration: "Days 16-45", details: "Remedies soothe hyperactive immune triggers, returning epidermal division rates to normal physiological speeds." },
      { phase: "Dermal Consolidation", duration: "Days 46+", details: "Constitutional support seals the cellular barrier, promoting healthy skin regeneration and relapse prevention." }
    ]
  },
  "Respiratory Care": {
    neurologyPath: "Vagal nerve hypersensitivity ➔ Bronchial spasms ➔ Mucosal congestion",
    epigeneticSusceptibility: "Atopic diathesis, bronchial hyper-responsiveness, or compromised mucosal immunity.",
    somaticManifestation: "Airway constriction, mucosal edema, chronic sinus congestion, and spasmodic coughing.",
    causes: [
      "Inhaled Allergens (Pollen, Dust)",
      "Vagal Nerve Irritation",
      "Chronic Mucosal Congestion",
      "Emotional Anxiety & Breath Rigidity"
    ],
    manifestations: [
      "Bronchial Constriction & Wheezing",
      "Chronic Sinus Inflammation",
      "Excessive Mucus Secretions",
      "Spasmodic Throat Irritation"
    ],
    stages: [
      { phase: "Spasmolytic Decongestion", duration: "Days 1-15", details: "Soothes the bronchial smooth muscles, relieving immediate tightness and liquefying stubborn mucus for removal." },
      { phase: "Reactivity Desensitization", duration: "Days 16-45", details: "Calms the body's over-reaction to external dust/pollen triggers, strengthening nasal mucosa membranes." },
      { phase: "Bronchial Fortification", duration: "Days 46+", details: "Constitutional remedies strengthen lung tissue elasticity and build active immunity to prevent cold recurrence." }
    ]
  },
  "Arthritis & Joints": {
    neurologyPath: "Synovial autoimmune infiltration ➔ Cartilage attrition ➔ Articular rigidity",
    epigeneticSusceptibility: "Predisposition to auto-inflammatory synovial cascades, connective tissue weakness, or metabolic crystal deposition.",
    somaticManifestation: "Joint stiffness, cartilage attrition, localized inflammation, and spinal structural rigidity.",
    causes: [
      "Autoimmune Synovial Response",
      "Uric Acid Crystalline Accumulation",
      "Cartilage Fluid Dehydration",
      "Systemic Inflammatory Cascades"
    ],
    manifestations: [
      "Severe Morning Stiffness",
      "Articular Friction & Pain",
      "Periarticular Heat & Swelling",
      "Restricted Joint Range of Motion"
    ],
    stages: [
      { phase: "Inflammation Mitigation", duration: "Days 1-15", details: "Alleviates heat and throbbing in affected joints, improving micro-circulation inside the synovial capsules." },
      { phase: "Metabolic Clearance", duration: "Days 16-45", details: "Aids the kidneys in clearing uric acid deposits, dissolving small crystalline deposits in joints." },
      { phase: "Articular Nourishment", duration: "Days 46+", details: "Nourishes the synovial lining and stimulates natural lubrication, restoring joint flexibility." }
    ]
  },
  "Kidney Stones": {
    neurologyPath: "Urinary supersaturation ➔ Crystalline nidus ➔ Ureteral spasm",
    epigeneticSusceptibility: "Familial calcium/oxalate metabolic anomalies, renal filtration stagnation, or urinary pH regulation issues.",
    somaticManifestation: "Renal colic spasms, hematuria, crystalluria, and calculus deposition in the ureters or kidneys.",
    causes: [
      "Dehydration & Mineral Supersaturation",
      "Urinary pH Imbalance",
      "Genetic Oxalate Diathesis",
      "Renal Filtration Stagnation"
    ],
    manifestations: [
      "Acute Spasmodic Renal Colic",
      "Hematuria (Microscopic blood)",
      "Urinary Urgency & Burning",
      "Calculi Deposition (Stones)"
    ],
    stages: [
      { phase: "Spasmolytic Dilation", duration: "Days 1-5", details: "Relaxes ureter walls to open pathways, easing colic spasms and facilitating stone movement." },
      { phase: "Calculus Dissolution", duration: "Days 6-30", details: "Softens the outer crystalline layers of renal stones, breaking them into flushable sandy particles." },
      { phase: "Filtration Stabilization", duration: "Days 31+", details: "Adjusts urinary pH chemistry, targeting the inherited metabolic tendency to form calculi." }
    ]
  },
  "Liver Disorders": {
    neurologyPath: "Hepatocyte lipid load ➔ Mitochondrial strain ➔ Biliary stagnation",
    epigeneticSusceptibility: "Slow hepatic cell lipid/toxin processing, biliary stagnation, or compromised mitochondrial metabolism in hepatocytes.",
    somaticManifestation: "Hepatocyte fat loading, elevated liver enzymes (SGOT/SGPT), biliary congestion, and post-meal abdominal heaviness.",
    causes: [
      "Hepatic Triglyceride Saturation",
      "Slow Hepatic Cellular Metabolism",
      "Biliary Congestion & Stones",
      "Environmental/Chemical Overload"
    ],
    manifestations: [
      "Right Quadrant Abdominal Heaviness",
      "Elevated Liver Enzymes (SGOT/SGPT)",
      "Sluggish Gallbladder Flow",
      "Chronic Post-Meal Fatigue"
    ],
    stages: [
      { phase: "Biliary Drainage", duration: "Days 1-15", details: "Stimulates bile synthesis and excretion, unloading hepatic congestion and easing bloating." },
      { phase: "Hepatocyte Regeneration", duration: "Days 16-45", details: "Triggers cellular repair of hepatocyte membranes, targeting fat deposits inside liver lobes." },
      { phase: "Metabolic Consolidation", duration: "Days 46+", details: "Optimizes basic lipid and glucose metabolism, boosting overall physical energy levels." }
    ]
  },
  "Child Health": {
    neurologyPath: "Immune system imbalance ➔ Recurrent lymphoid hypertrophy ➔ Low vitality",
    epigeneticSusceptibility: "Immature lymphatic clearance pathways, developing immune memory, or growth-spurt metabolic strain.",
    somaticManifestation: "Recurrent tonsillar swelling, middle ear effusion, seasonal sensitivities, and behavioral excitability.",
    causes: [
      "Immune Learning Impairments",
      "Seasonal Temperature Shocks",
      "Dentition & Bone Growth Demands",
      "Digestive Assimilation Deficits"
    ],
    manifestations: [
      "Recurrent Tonsillitis/Otitis",
      "Frequent Sensitivities & Colds",
      "Allergic Bronchial Reactions",
      "Sluggish Development/Assimilation"
    ],
    stages: [
      { phase: "Acute Support", duration: "Days 1-10", details: "Clears immediate inflammatory febrile states gently without disrupting childhood gut microflora." },
      { phase: "Lymphatic Decongestion", duration: "Days 11-30", details: "Shrinks swollen lymphatic nodes and tonsillar tissue, relieving chronic snoring and congestion." },
      { phase: "Constitutional Stamina", duration: "Days 31+", details: "Fortifies the child's innate vitality, preparing the defense pathways to ward off future exposures." }
    ]
  },
  "Mental Wellness": {
    neurologyPath: "HPA axis hyper-stimulation ➔ Synaptic fatigue ➔ Somatic tension",
    epigeneticSusceptibility: "Hypersensitive nervous system, neurotransmitter receptor vulnerability, or stress-axis dysregulation.",
    somaticManifestation: "Migraines, sleep fragmentation, somatic tension, panic reactions, and chronic fatigue.",
    causes: [
      "HPA Axis Over-activation",
      "Adrenal Fatigue & Cortisol Spikes",
      "Subconscious Emotional Stress",
      "Genetically Sensitive Nervous System"
    ],
    manifestations: [
      "Chronic Sleeplessness & Racing Mind",
      "General Anxious Anticipation",
      "Neurological Tension Headaches",
      "Somatic Fatigue & Burnout"
    ],
    stages: [
      { phase: "Somatic Relaxation", duration: "Days 1-15", details: "Reduces sympathetic adrenaline overdrive, promoting healthy circadian sleep rhythms." },
      { phase: "Neurotransmitter Balance", duration: "Days 16-45", details: "Re-coordinates emotional pathways, mitigating obsessive thought loops and physical panic reactions." },
      { phase: "Adaptogenic Resilience", duration: "Days 46+", details: "Strengthens baseline neurological thresholds, allowing the body to process daily stress adaptively." }
    ]
  },
  "Gut Health": {
    neurologyPath: "Enteric nervous system stress ➔ Mucosal breach ➔ Dysmotility",
    epigeneticSusceptibility: "Dysregulated brain-gut axis, mucosal tight-junction permeability, or hepatic enzyme deficiencies.",
    somaticManifestation: "Bowel dysmotility, acid regurgitation, visceral hypersensitivity, and chronic bloating.",
    causes: [
      "Brain-Gut Connection Stress",
      "Leaky Gut Barrier Breach",
      "Intestinal Bacterial Fermentation",
      "Colonic Muscle Hyper-reactivity"
    ],
    manifestations: [
      "Alternating Constipation & Diarrhea",
      "Gastric Acid Reflux & Sour Belching",
      "Abdominal Distention & Bloating",
      "Spasmodic Visceral Cramping"
    ],
    stages: [
      { phase: "Visceral Calm", duration: "Days 1-15", details: "Relaxes intestinal hyper-motility and colon muscle spasms, easing sour acid regurgitation." },
      { phase: "Mucosal Integrity Repair", duration: "Days 16-45", details: "Promotes cellular recovery of tight junctions in gut barriers, reducing autoimmune triggers." },
      { phase: "Enteric Rhythms Reset", duration: "Days 46+", details: "Rebalances enzymatic secretions and coordinates parasympathetic bowel rhythms." }
    ]
  }
};

export default function Conditions() {
  const [selectedCondition, setSelectedCondition] = useState<any | null>(null);

  const conditionsData = [
    {
      title: "Skin Disorders",
      desc: "Gentle, non-suppressive constitutional therapies to heal eczema, psoriasis, acne, and stubborn chronic dermatitis.",
      icon: <Layers className="w-5 h-5 text-mint-dark" />,
      tags: ["Eczema", "Psoriasis", "Acne", "Dermatitis"],
      glowColor: "radial-gradient(circle at center, rgba(20,184,166,0.4) 0%, rgba(168,85,247,0.2) 50%, rgba(6,182,212,0.05) 75%, transparent 100%)",
    },
    {
      title: "Respiratory Care",
      desc: "Strengthen respiratory immunity and alleviate asthma, chronic allergies, bronchitis, and sinus inflammation.",
      icon: <Wind className="w-5 h-5 text-aqua-dark" />,
      tags: ["Asthma", "Allergies", "Sinusitis", "Bronchitis"],
      glowColor: "radial-gradient(circle at center, rgba(6,182,212,0.4) 0%, rgba(246,128,148,0.25) 50%, rgba(245,158,11,0.05) 75%, transparent 100%)",
    },
    {
      title: "Arthritis & Joints",
      desc: "Manage pain and reduce joint inflammation organically to restore mobility in osteoarthritis and rheumatoid conditions.",
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      tags: ["Joint Pain", "Gout", "Osteo-Arthritis", "Rheumatoid"],
      glowColor: "radial-gradient(circle at center, rgba(245,158,11,0.35) 0%, rgba(244,63,94,0.25) 50%, rgba(20,184,166,0.05) 75%, transparent 100%)",
    },
    {
      title: "Kidney Stones",
      desc: "Natural dissolution of renal calculi and crystalline deposits, offering relief without invasive interventions.",
      icon: <Gem className="w-5 h-5 text-sky-dark" />,
      tags: ["Renal Stones", "Dysuria", "Uric Acid", "Calculi"],
      glowColor: "radial-gradient(circle at center, rgba(14,165,233,0.4) 0%, rgba(168,85,247,0.25) 50%, rgba(20,184,166,0.05) 75%, transparent 100%)",
    },
    {
      title: "Liver Disorders",
      desc: "Stimulate hepatic cell rejuvenation and treat fatty liver, sluggish digestion, and metabolic disorders.",
      icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
      tags: ["Fatty Liver", "Jaundice", "Sluggish Liver", "Detox"],
      glowColor: "radial-gradient(circle at center, rgba(244,63,94,0.35) 0%, rgba(168,85,247,0.25) 55%, rgba(6,182,212,0.05) 75%, transparent 100%)",
    },
    {
      title: "Child Health",
      desc: "Safe, sweet remedies to build innate immunity, treat pediatric asthma, tonsillitis, and behavioral dynamics.",
      icon: <Baby className="w-5 h-5 text-emerald-600" />,
      tags: ["Immunity", "Tonsillitis", "Dentition", "Allergies"],
      glowColor: "radial-gradient(circle at center, rgba(16,185,129,0.4) 0%, rgba(6,182,212,0.25) 50%, rgba(245,158,11,0.05) 75%, transparent 100%)",
    },
    {
      title: "Mental Wellness",
      desc: "Restore calm and neurological balance. Address chronic stress, anxiety, sleep issues, and mild depression.",
      icon: <Brain className="w-5 h-5 text-lavender-dark" />,
      tags: ["Anxiety", "Insomnia", "Stress", "Depression"],
      glowColor: "radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(14,165,233,0.25) 50%, rgba(244,63,94,0.05) 75%, transparent 100%)",
    },
    {
      title: "Gut Health",
      desc: "Calm hypersensitive tracts to relieve IBS, acid reflux, chronic indigestion, and gut-barrier vulnerabilities.",
      icon: <Shield className="w-5 h-5 text-indigo-600" />,
      tags: ["IBS", "Acidity", "Reflux", "Indigestion"],
      glowColor: "radial-gradient(circle at center, rgba(99,102,241,0.35) 0%, rgba(20,184,166,0.25) 50%, rgba(245,158,11,0.05) 75%, transparent 100%)",
    },
  ];

  const activeProfile = selectedCondition ? clinicalProfiles[selectedCondition.title] : null;

  const handleBeginTreatment = () => {
    if (!selectedCondition) return;

    // Dispatch event to pre-fill booking section
    const prefillEvent = new CustomEvent("prefill-booking", {
      detail: {
        category: selectedCondition.title,
        symptomsPrefill: `Seeking constitutional treatment for ${selectedCondition.title}. Focus areas: ${selectedCondition.tags.join(", ")}. Primary interest lies in resolving long-term underlying causes and restoring vitality.`,
      },
    });

    window.dispatchEvent(prefillEvent);
    setSelectedCondition(null); // Close drawer
  };

  return (
    <section id="conditions" className="relative py-28 px-6 bg-white/20">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Specialized Treatments
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Root-Cause Therapeutics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base text-slate-700 font-semibold leading-relaxed"
          >
            Unlike conventional treatments that focus on suppressing symptoms, advanced homeopathy targets your underlying constitutional vulnerability, working in harmony with your body&apos;s natural self-healing mechanisms.
          </motion.p>
        </div>

        {/* Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conditionsData.map((cond, idx) => (
            <motion.div
              key={cond.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 1,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ConditionCard
                title={cond.title}
                desc={cond.desc}
                icon={cond.icon}
                tags={cond.tags}
                glowColor={cond.glowColor}
                onClick={() => setSelectedCondition(cond)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide-over Detail Drawer */}
      <Portal>
        <AnimatePresence>
          {selectedCondition && activeProfile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCondition(null)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-40 pointer-events-auto"
            />
          )}

          {selectedCondition && activeProfile && (
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-[#FAF9F6]/95 dark:bg-slate-900/95 border-l border-white/50 dark:border-slate-800 z-50 shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 md:p-8 border-b border-slate-900/5 dark:border-slate-800/40 flex items-center justify-between bg-white/70 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm">
                    {selectedCondition.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A2421] leading-none mb-1">{selectedCondition.title}</h3>
                    <span className="text-[10px] text-mint font-bold uppercase tracking-wider">Clinical Profile</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCondition(null)}
                  className="w-10 h-10 rounded-full border border-slate-200 hover:border-slate-800 flex items-center justify-center transition-colors group cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div 
                data-lenis-prevent
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 select-text"
              >
                
                {/* 1. Root Cause Mapping Graphic */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Dna className="w-4 h-4 text-mint animate-pulse" />
                    Root-Cause Mapping Axis
                  </h4>
                  
                  {/* SVG/HTML visual workflow representation */}
                  <div className="glass-panel border-white/60 bg-white/50 p-6 rounded-3xl relative">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-mint/3 via-transparent to-lavender/3 pointer-events-none" />
                    
                    <div className="relative flex flex-col gap-4 text-xs font-semibold">
                      {/* Node 1: Genetics */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center text-[10px] text-mint font-bold mt-0.5 shadow-[0_2px_8px_rgba(20,184,166,0.15)]">1</div>
                        <div>
                          <span className="block text-[10px] text-slate-700 font-extrabold uppercase tracking-wide">Epigenetic Susceptibility</span>
                          <span className="text-slate-800">{activeProfile.epigeneticSusceptibility}</span>
                        </div>
                      </div>

                      {/* Connection Line */}
                      <div className="w-0.5 h-4 bg-gradient-to-b from-mint to-aqua ml-2.5" />

                      {/* Node 2: Nervous Axis */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-aqua/10 border border-aqua/20 flex items-center justify-center text-[10px] text-aqua-dark dark:text-aqua font-bold mt-0.5 shadow-[0_2px_8px_rgba(6,182,212,0.15)]">2</div>
                        <div>
                          <span className="block text-[10px] text-slate-700 font-extrabold uppercase tracking-wide">Neurological / Vital Pathway</span>
                          <code className="block font-mono text-[9px] text-[#0E7490] dark:text-aqua mt-1 bg-white/70 px-2 py-1 rounded border border-slate-900/5 max-w-full overflow-x-auto whitespace-pre-wrap">
                            {activeProfile.neurologyPath}
                          </code>
                        </div>
                      </div>

                      {/* Connection Line */}
                      <div className="w-0.5 h-4 bg-gradient-to-b from-aqua to-lavender ml-2.5" />

                      {/* Node 3: Manifestation */}
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-lavender/10 border border-lavender/20 flex items-center justify-center text-[10px] text-lavender-dark dark:text-lavender font-bold mt-0.5 shadow-[0_2px_8px_rgba(168,85,247,0.15)]">3</div>
                        <div>
                          <span className="block text-[10px] text-slate-700 font-extrabold uppercase tracking-wide">Somatic Manifestation</span>
                          <span className="text-slate-800">{activeProfile.somaticManifestation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pathological Variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Primary Triggers */}
                  <div className="p-5 border border-white/60 bg-white/50 rounded-2xl">
                    <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                      Core Triggers
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-800 font-semibold list-disc list-inside">
                      {activeProfile.causes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagnostic Presentation */}
                  <div className="p-5 border border-white/60 bg-white/50 rounded-2xl">
                    <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Symptom Array
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-800 font-semibold list-disc list-inside">
                      {activeProfile.manifestations.map((m) => (
                        <li key={m}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. Three-Phase Clinical Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-mint animate-pulse" />
                    Three-Phase Recovery Pathway
                  </h4>

                  <div className="relative border-l border-slate-900/5 pl-6 ml-3 space-y-6">
                    {activeProfile.stages.map((stg, idx) => {
                      const colors = [
                        { bg: "bg-mint/10 border-mint/20 text-mint-dark dark:text-mint", dot: "bg-mint" },
                        { bg: "bg-aqua/10 border-aqua/20 text-aqua-dark dark:text-aqua", dot: "bg-aqua" },
                        { bg: "bg-lavender/10 border-lavender/20 text-lavender-dark dark:text-lavender", dot: "bg-lavender" }
                      ][idx];
                      return (
                        <div key={stg.phase} className="relative">
                          {/* Timeline node */}
                          <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center`}>
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                          </div>

                          <div className="glass-panel border-white/60 bg-white/40 p-5 rounded-2xl">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h5 className="text-xs font-bold text-slate-900 leading-none">{stg.phase}</h5>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${colors.bg}`}>
                                {stg.duration}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                              {stg.details}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer booking CTA */}
              <div className="p-6 md:p-8 bg-white/70 backdrop-blur-sm border-t border-slate-900/5 dark:border-slate-800/40 flex flex-col items-center">
                <Magnetic>
                  <button
                    onClick={handleBeginTreatment}
                    className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Schedule Treatment for {selectedCondition.title}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Magnetic>
                <span className="text-[10px] text-slate-700 font-semibold mt-3 italic">
                  Initiates constitutional profiling setup in consultation form.
                </span>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </section>
  );
}
