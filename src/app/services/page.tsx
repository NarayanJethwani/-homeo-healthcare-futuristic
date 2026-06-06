"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Wind, Brain, Activity, Sparkles, Shield, Baby, 
  Dna, ShieldCheck, ShieldAlert, ShieldOff, Sprout, X, ArrowRight, ArrowLeft 
} from "lucide-react";
import ConditionCard from "@/components/ConditionCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";

interface ClinicalDetail {
  neurologyPath: string;
  epigeneticSusceptibility: string;
  somaticManifestation: string;
  causes: string[];
  manifestations: string[];
  stages: { phase: string; duration: string; details: string }[];
}

const clinicalProfiles: Record<string, ClinicalDetail> = {
  "Heart & Cardiovascular": {
    neurologyPath: "Autonomic imbalance ➔ Vascular resistance ➔ Arterial hypertension",
    epigeneticSusceptibility: "Hereditary risk for arterial stiffness, mineral transport defects, or autonomic hyper-reactivity.",
    somaticManifestation: "Elevated blood pressure, vascular remodeling, cardiac rhythm fluctuations, and arterial wall stress.",
    causes: [
      "Chronic stress & HPA axis overdrive",
      "Endothelial lining dysfunction",
      "Metabolic lipid loading",
      "Genetic cardiovascular diathesis"
    ],
    manifestations: [
      "Elevated arterial pressure (Hypertension)",
      "Cardiac palpitations & tachycardia",
      "Atherosclerotic plaque markers",
      "Decreased cardiovascular stamina"
    ],
    stages: [
      { phase: "Vaso-regulation stabilization", duration: "Days 1-15", details: "Calms autonomic vascular excitability, stabilizing arterial tension spikes naturally." },
      { phase: "Myocardial fortification", duration: "Days 16-45", details: "Improves cardiac muscle efficiency and arterial elasticity, reducing workload." },
      { phase: "Endothelial reconditioning", duration: "Days 46+", details: "Addresses metabolic factors to maintain healthy lipid levels and prevent relapse." }
    ]
  },
  "Lungs & Respiratory": {
    neurologyPath: "Vagal nerve hyper-reactivity ➔ Bronchial spasm ➔ Mucosal congestion",
    epigeneticSusceptibility: "Atopic diathesis, bronchial hyper-responsiveness, or compromised mucosal immunity.",
    somaticManifestation: "Airway constriction, mucosal edema, chronic sinus congestion, and spasmodic coughing.",
    causes: [
      "Inhaled environmental triggers",
      "Chronic mucosal inflammation",
      "Hyper-reactive bronchial reflexes",
      "Hereditary atopic diathesis"
    ],
    manifestations: [
      "Asthma spasms & wheezing",
      "COPD bronchial limitations",
      "Sinusitis & mucosal blockages",
      "Allergic rhinitis & sneezing"
    ],
    stages: [
      { phase: "Spasmolytic ventilation", duration: "Days 1-15", details: "Relaxes bronchial smooth muscles, clearing trapped secretions and restoring easy breathing." },
      { phase: "Mucosal desensitization", duration: "Days 16-45", details: "Calms hyper-reactive reflexes to environmental pollen, dust, and cold air." },
      { phase: "Respiratory fortification", duration: "Days 46+", details: "Fortifies bronchial cellular immunity and improves alveolar gas exchange." }
    ]
  },
  "Neuro & Mental Health": {
    neurologyPath: "HPA axis hyper-activation ➔ Neurotransmitter depletion ➔ Somatic fatigue",
    epigeneticSusceptibility: "Hypersensitive nervous system, neurotransmitter receptor vulnerability, or stress-axis dysregulation.",
    somaticManifestation: "Migraines, sleep fragmentation, somatic tension, panic reactions, and chronic fatigue.",
    causes: [
      "Chronic neurological distress",
      "Adrenal exhaustion & cortisol spikes",
      "Subconscious emotional trauma",
      "Genetically sensitive nervous system"
    ],
    manifestations: [
      "Chronic migraines",
      "Anxious anticipation & panic",
      "Persistent insomnia",
      "Cognitive fog & somatic fatigue"
    ],
    stages: [
      { phase: "Somatic decompression", duration: "Days 1-15", details: "Gently tones down sympathetic overdrive, restoring restorative sleep patterns." },
      { phase: "Neuro-chemical harmonization", duration: "Days 16-45", details: "Rebalances enteric-brain pathways, reducing migraine frequency and anxiety loops." },
      { phase: "Neurological resilience", duration: "Days 46+", details: "Strengthens constitutional threshold, allowing the nervous system to handle daily stressors." }
    ]
  },
  "Joints & Spine": {
    neurologyPath: "Synovial autoimmune infiltration ➔ Cartilage attrition ➔ Articular stiffness",
    epigeneticSusceptibility: "Predisposition to auto-inflammatory synovial cascades, connective tissue weakness, or metabolic crystal deposition.",
    somaticManifestation: "Joint stiffness, cartilage attrition, localized inflammation, and spinal structural rigidity.",
    causes: [
      "Autoimmune synovial reactions",
      "Uric acid crystal deposition",
      "Cartilage hydration deficit",
      "Systemic skeletal inflammation"
    ],
    manifestations: [
      "Rheumatoid arthritis stiffness",
      "Osteoarthritis friction",
      "Gouty crystalline pain",
      "Spondylosis & spinal rigidity"
    ],
    stages: [
      { phase: "Articular de-congestion", duration: "Days 1-15", details: "Alleviates acute periarticular heat and swelling, easing initial stiffness." },
      { phase: "Skeletal metabolic balance", duration: "Days 16-45", details: "Assists renal clearance of inflammatory markers and dissolves micro-crystal deposits." },
      { phase: "Synovial restoration", duration: "Days 46+", details: "Nourishes the synovial membrane and cartilage cells, improving joint mobility." }
    ]
  },
  "Skin Disorders": {
    neurologyPath: "Immune hyper-vigilance ➔ Dermal cell acceleration ➔ Chronic inflammation",
    epigeneticSusceptibility: "Inherited epidermal barrier defects, immune-dermal hypersensitivity, or leaky-gut metabolic burden.",
    somaticManifestation: "Eczematous plaqueing, hyper-keratinization, follicular eruptions, and vitiligo/urticaria.",
    causes: [
      "Genetics & inherited dysregulation",
      "Gut barrier permeability (Leaky Gut)",
      "Environmental toxin buildup",
      "Emotional stress triggers"
    ],
    manifestations: [
      "Eczematous itching & redness",
      "Psoriatic plaque scaling",
      "Chronic acne eruptions",
      "Vitiligo & urticaria (hives)"
    ],
    stages: [
      { phase: "Superficial detoxification", duration: "Days 1-15", details: "Enables natural elimination channels, sometimes showing mild outward venting." },
      { phase: "Dermal cell normalization", duration: "Days 16-45", details: "Reduces rapid epidermal turn-over rates, soothing inflamed skin layers." },
      { phase: "Epidermal barrier seal", duration: "Days 46+", details: "Restores skin hydration reserves and seals the barrier, protecting against future triggers." }
    ]
  },
  "Digestive Health": {
    neurologyPath: "Enteric nervous system stress ➔ Mucosal breach ➔ Gastrointestinal dysmotility",
    epigeneticSusceptibility: "Dysregulated brain-gut axis, mucosal tight-junction permeability, or hepatic enzyme deficiencies.",
    somaticManifestation: "Bowel dysmotility, acid regurgitation, visceral hypersensitivity, and chronic bloating.",
    causes: [
      "Brain-gut axis dysregulation",
      "Intestinal dysbiosis & fermentation",
      "Mucosal barrier breach",
      "Gastric enzyme deficits"
    ],
    manifestations: [
      "Irritable Bowel Syndrome (IBS)",
      "Acid reflux & GERD",
      "Chronic constipation or colitis",
      "Sluggish liver metabolism"
    ],
    stages: [
      { phase: "Visceral spasmolysis", duration: "Days 1-15", details: "Soothes hyperactive bowel contractions and regulates gastric acid secretion." },
      { phase: "Mucosal barrier repair", duration: "Days 16-45", details: "Promotes cellular healing of intestinal walls, reducing systemic immune load." },
      { phase: "Digestive rhythm reset", duration: "Days 46+", details: "Optimizes enzymatic outputs and coordinates healthy parasympathetic digestion." }
    ]
  },
  "Paediatric Care": {
    neurologyPath: "Immune learning delays ➔ Lymphatic hypertrophy ➔ Low constitutional vitality",
    epigeneticSusceptibility: "Immature lymphatic clearance pathways, developing immune memory, or growth-spurt metabolic strain.",
    somaticManifestation: "Recurrent tonsillar swelling, middle ear effusion, seasonal sensitivities, and behavioral excitability.",
    causes: [
      "Innate immune immaturity",
      "Recurrent chemical exposure",
      "Digestive assimilation issues",
      "Physical growth spurt demands"
    ],
    manifestations: [
      "Recurrent tonsillitis & otitis",
      "Childhood asthma & allergies",
      "Growth and developmental delays",
      "Behavioral hyper-excitability"
    ],
    stages: [
      { phase: "Acute immune support", duration: "Days 1-10", details: "Resolves current febrile and inflammatory symptoms gently, preserving gut flora." },
      { phase: "Lymphatic drainage", duration: "Days 11-30", details: "Reduces enlargement in tonsils and adenoid tissues, improving sleep breathing." },
      { phase: "Constitutional strengthening", duration: "Days 31+", details: "Builds long-term immune resilience, decreasing seasonal sensitivity." }
    ]
  },
  "Hormonal & Thyroid": {
    neurologyPath: "Neuroendocrine axis strain ➔ Glandular hyposecretion ➔ Metabolic slowing",
    epigeneticSusceptibility: "Vulnerability in the hypothalamic-pituitary-adrenal/thyroid feedback loops, or insulin-receptor signaling anomalies.",
    somaticManifestation: "Thyroid hormone fluctuations, ovarian follicular stagnation (PCOS), blood glucose instability, and metabolic slowing.",
    causes: [
      "Pituitary-adrenal communication blocks",
      "Autoimmune thyroiditis triggers",
      "Ovarian/testicular axis stagnation",
      "Cellular insulin resistance"
    ],
    manifestations: [
      "Hypothyroidism & sluggishness",
      "PCOS menstrual irregularity",
      "Diabetes metabolic instability",
      "Unexplained weight gain"
    ],
    stages: [
      { phase: "Endocrine sensitization", duration: "Days 1-15", details: "Restores cell receptor responsiveness to circulating hormone levels." },
      { phase: "Glandular cell repair", duration: "Days 16-45", details: "Stimulates target organs (thyroid, ovaries, pancreas) to self-regulate outputs." },
      { phase: "Neuroendocrine balance", duration: "Days 46+", details: "Synchronizes the master feedback loops to maintain lasting hormonal harmony." }
    ]
  },
  "Autoimmune Disorders": {
    neurologyPath: "Loss of immune self-tolerance ➔ Multi-system cellular targeting ➔ Chronic tissue degradation",
    epigeneticSusceptibility: "Deficient immune self-tolerance, HLA-gene markers, or chronic sub-clinical antigenic triggers.",
    somaticManifestation: "Multisystem cellular self-attack, auto-antibody spikes, systemic organ inflammation, and tissue degradation.",
    causes: [
      "Deep inherited genetic diathesis",
      "Environmental toxic overload",
      "Persistent sub-clinical viral triggers",
      "Severe psychological stress"
    ],
    manifestations: [
      "Systemic lupus (SLE) markers",
      "Hashimoto's thyroid flares",
      "Psoriatic joint flares",
      "Chronic kidney disease (CKD) support"
    ],
    stages: [
      { phase: "Immune flare mitigation", duration: "Days 1-20", details: "Calms hyper-inflammatory cascades, protecting vital tissues from acute damage." },
      { phase: "Immunological recalibration", duration: "Days 21-60", details: "Retrains immune cells to recognize self-tissues, reducing autoantibody counts." },
      { phase: "Deep cellular repair", duration: "Days 61+", details: "Constitutional remedies build cellular integrity to keep autoimmunity in check." }
    ]
  },
  "Allergies": {
    neurologyPath: "Mast cell hypersensitivity ➔ IgE-mediated histamine release ➔ Mucosal hyper-secretion",
    epigeneticSusceptibility: "Mast-cell hyper-excitability, IgE hyper-production tendencies, or sluggish phase-II liver clearance.",
    somaticManifestation: "Immediate histaminic responses, chronic hives, allergic rhinitis, and food-protein intolerances.",
    causes: [
      "Genetically high atopic load",
      "Compromised mucosal lining",
      "Repeated antigen sensitization",
      "Liver detoxification sluggishness"
    ],
    manifestations: [
      "Persistent allergic rhinitis",
      "Food & protein intolerances",
      "Dust & mold sensitivities",
      "Chronic urticaria (hives)"
    ],
    stages: [
      { phase: "Mast cell stabilization", duration: "Days 1-15", details: "Reduces histaminic response and hyper-secretion from eyes and nose." },
      { phase: "Antigen desensitization", duration: "Days 16-45", details: "Retrains immunological recognition of common environmental proteins." },
      { phase: "Mucosal barrier sealing", duration: "Days 46+", details: "Fortifies the epithelial barriers in respiratory and gastrointestinal tracts." }
    ]
  },
  "Integrative Cancer Care": {
    neurologyPath: "Cellular microenvironment stagnation ➔ Low vital force ➔ Toxic accumulation",
    epigeneticSusceptibility: "Cellular microenvironment stagnation, mitochondrial metabolic decline, or systemic toxic load.",
    somaticManifestation: "Severe treatment-induced fatigue, mucosal radiation burns, cachexia, and overall vital force depletion.",
    causes: [
      "Systemic tissue dysregulation",
      "Chemo/radiation side effects",
      "Toxic burden from disease cachexia",
      "Profound emotional & vital depletion"
    ],
    manifestations: [
      "Chemotherapy-induced fatigue",
      "Radiation burns & pain",
      "Cancer-associated nausea & anorexia",
      "Post-surgical recovery fatigue"
    ],
    stages: [
      { phase: "Symptom mitigation", duration: "Days 1-15", details: "Relieves nausea, pain, and fatigue, improving appetite and basic daily comfort." },
      { phase: "Vital force resuscitation", duration: "Days 16-45", details: "Stimulates cellular energy production and tones down inflammatory cytokine release." },
      { phase: "Constitutional support", duration: "Days 46+", details: "Strengthens immune defense systems, safely running alongside conventional treatments." }
    ]
  }
};

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState<any | null>(null);

  const conditionsList = [
    {
      title: "Heart & Cardiovascular",
      desc: "Autonomic regulation for hypertension, palpitations, cholesterol management, and post-cardiac recovery support.",
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      tags: ["Hypertension", "Palpitations", "Cholesterol", "Recovery"],
      glowColor: "radial-gradient(circle at center, rgba(244,63,94,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Lungs & Respiratory",
      desc: "Strengthen respiratory immunity and alleviate asthma, COPD, chronic bronchitis, and sinusitis organically.",
      icon: <Wind className="w-5 h-5 text-cyan-500" />,
      tags: ["Asthma", "COPD", "Sinusitis", "Bronchitis"],
      glowColor: "radial-gradient(circle at center, rgba(6,182,212,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Neuro & Mental Health",
      desc: "Address chronic migraines, anxiety, mild depression, sleep disturbances, and neurological tension.",
      icon: <Brain className="w-5 h-5 text-indigo-500" />,
      tags: ["Migraine", "Anxiety", "Insomnia", "Stress"],
      glowColor: "radial-gradient(circle at center, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Joints & Spine",
      desc: "Reduce joint inflammation and friction in osteoarthritis, rheumatoid arthritis, gout, and spondylosis.",
      icon: <Activity className="w-5 h-5 text-amber-500" />,
      tags: ["Arthritis", "Gout", "Spondylosis", "Back Pain"],
      glowColor: "radial-gradient(circle at center, rgba(245,158,11,0.4) 0%, rgba(244,63,94,0.2) 50%, transparent 100%)",
    },
    {
      title: "Skin Disorders",
      desc: "Gentle, non-suppressive constitutional therapies to heal eczema, psoriasis, acne, and vitiligo at the roots.",
      icon: <Sparkles className="w-5 h-5 text-teal-500" />,
      tags: ["Eczema", "Psoriasis", "Acne", "Vitiligo"],
      glowColor: "radial-gradient(circle at center, rgba(20,184,166,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
    },
    {
      title: "Digestive Health",
      desc: "Calm hypersensitive GI tracts to manage IBS, chronic acidity, GERD, colitis, and sluggish liver issues.",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      tags: ["IBS", "Acidity", "GERD", "Colitis"],
      glowColor: "radial-gradient(circle at center, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Paediatric Care",
      desc: "Safe, sweet constitutional remedies to build immunity, manage recurrent tonsillitis, asthma, and growth dynamics.",
      icon: <Baby className="w-5 h-5 text-amber-600" />,
      tags: ["Immunity", "Tonsils", "Growth", "Behavior"],
      glowColor: "radial-gradient(circle at center, rgba(217,119,6,0.35) 0%, rgba(16,185,129,0.2) 50%, transparent 100%)",
    },
    {
      title: "Hormonal & Thyroid",
      desc: "Endocrine balance for hypothyroidism, hyperthyroidism, PCOS, and supportive care for diabetes and weight.",
      icon: <Dna className="w-5 h-5 text-purple-500" />,
      tags: ["Thyroid", "PCOS", "Diabetes", "Metabolism"],
      glowColor: "radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 100%)",
    },
    {
      title: "Autoimmune Disorders",
      desc: "Calm systemic auto-responses in lupus, Hashimoto's thyroiditis, and offer supportive care for CKD.",
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      tags: ["Lupus", "Hashimoto's", "CKD Support", "RA"],
      glowColor: "radial-gradient(circle at center, rgba(239,68,68,0.35) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Allergies",
      desc: "Desensitize immune reactions to pollen, dust, food, and chronic hives (urticaria) permanently.",
      icon: <ShieldOff className="w-5 h-5 text-orange-500" />,
      tags: ["Rhinitis", "Food Allergy", "Urticaria", "Dust"],
      glowColor: "radial-gradient(circle at center, rgba(249,115,22,0.35) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Integrative Cancer Care",
      desc: "Supportive homeopathic care alongside oncology to mitigate side effects of chemo and radiation.",
      icon: <Sprout className="w-5 h-5 text-lime-600" />,
      tags: ["Supportive", "Chemo Support", "Nausea", "Fatigue"],
      glowColor: "radial-gradient(circle at center, rgba(132,204,22,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
  ];

  const activeProfile = selectedCondition ? clinicalProfiles[selectedCondition.title] : null;

  const handleBookConsultation = () => {
    // Redirect to home and scroll to booking section
    router.push("/#booking");
  };

  const handleBeginTreatment = () => {
    if (!selectedCondition) return;
    // Redirect to home and scroll to booking
    router.push("/#booking");
  };

  const differentiators = [
    {
      title: "Evidence-Based Protocol",
      desc: "Classical homeopathy validated by modern clinical research. Outcomes tracked with measurable parameters.",
      icon: <ShieldCheck className="w-6 h-6 text-mint" />
    },
    {
      title: "True Individualisation",
      desc: "Same diagnosis, different remedies. Every prescription based on your complete constitutional picture.",
      icon: <Dna className="w-6 h-6 text-aqua" />
    },
    {
      title: "20+ Years Experience",
      desc: "10,000+ patients treated. Complex, multi-system chronic cases successfully managed at Pune clinics.",
      icon: <Sparkles className="w-6 h-6 text-lavender-dark" />
    },
    {
      title: "Integrative Approach",
      desc: "Works safely alongside conventional medications. We collaborate with your existing medical specialists.",
      icon: <Heart className="w-6 h-6 text-rose-500" />
    },
    {
      title: "Online Consultations",
      desc: "High-quality video consultations and clinical tracking for patients across India and worldwide.",
      icon: <Wind className="w-6 h-6 text-cyan-500" />
    },
    {
      title: "Ethical Practice",
      desc: "Honest clinical prognosis. No false promises. We tell you exactly what results to expect.",
      icon: <Shield className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Back to Homepage Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Magnetic>
            <Link
              href="https://homeo.healthcare"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to the Future
            </Link>
          </Magnetic>
        </motion.div>

        {/* Page Hero Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Clinical Services
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Conditions We Specialise In
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base md:text-lg text-slate-700 font-semibold leading-relaxed"
          >
            Providing individualised, root-cause homeopathic care for chronic, complex, and recurring health conditions across all ages and organ systems.
          </motion.p>
        </div>

        {/* 11 Conditions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-28">
          {conditionsList.map((cond, idx) => (
            <motion.div
              key={cond.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: idx * 0.05,
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
          
          {/* Custom Not Listed Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[300px] w-full rounded-[28px] glass-panel border-mint/20 hover:border-mint/60 bg-mint/5 p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300"
            onClick={handleBookConsultation}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 border border-mint/30 shadow-[0_4px_12px_rgba(20,184,166,0.05)] text-mint">
              <Sparkles className="w-5 h-5 text-mint" />
            </div>
            <div className="mt-4 flex-grow flex flex-col justify-end">
              <h3 className="text-xl font-bold text-[#1A2421] mb-2 leading-none">Not Listed Here?</h3>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-4">
                We handle broad spectrum multi-system chronic ailments. Book a direct consultation for clinical diagnostics.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-mint group-hover:translate-x-1 transition-transform">
                Book Consultation <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Differentiators Section */}
        <div className="border-t border-slate-900/5 pt-24 mb-16">
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mb-4">
              What Makes Us Different
            </h2>
            <p className="text-sm md:text-base text-slate-700 font-semibold leading-relaxed">
              At Ramkrishna Homeopathic Consultancy, we redefine classical homeopathic healing through clinical rigor, patient-centered timelines, and modern scientific indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentiators.map((diff, idx) => (
              <motion.div
                key={diff.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-panel border-white/60 bg-white/40 p-6 rounded-3xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-5 shadow-sm">
                  {diff.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1A2421] mb-2">{diff.title}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{diff.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Slide-over Detail Drawer */}
      <Portal>
        <AnimatePresence>
          {selectedCondition && activeProfile && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCondition(null)}
              className="fixed inset-0 bg-slate-900/10 backdrop-blur-md z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[540px] bg-[#FAF9F6]/95 dark:bg-slate-900/95 border-l border-white/50 dark:border-slate-800 z-[51] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
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
                  
                  <div className="glass-panel border-white/60 bg-white/50 p-6 rounded-3xl relative">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-mint/3 via-transparent to-lavender/3 pointer-events-none" />
                    
                    <div className="relative flex flex-col gap-4 text-xs font-semibold">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center text-[10px] text-mint font-bold mt-0.5 shadow-[0_2px_8px_rgba(20,184,166,0.15)]">1</div>
                        <div>
                          <span className="block text-[10px] text-slate-700 font-extrabold uppercase tracking-wide">Epigenetic Susceptibility</span>
                          <span className="text-slate-800">{activeProfile.epigeneticSusceptibility}</span>
                        </div>
                      </div>

                      <div className="w-0.5 h-4 bg-gradient-to-b from-mint to-aqua ml-2.5" />

                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-aqua/10 border border-aqua/20 flex items-center justify-center text-[10px] text-aqua-dark dark:text-aqua font-bold mt-0.5 shadow-[0_2px_8px_rgba(6,182,212,0.15)]">2</div>
                        <div>
                          <span className="block text-[10px] text-slate-700 font-extrabold uppercase tracking-wide">Neurological / Vital Pathway</span>
                          <code className="block font-mono text-[9px] text-[#0E7490] dark:text-aqua mt-1 bg-white/70 px-2 py-1 rounded border border-slate-900/5 max-w-full overflow-x-auto whitespace-pre-wrap font-bold">
                            {activeProfile.neurologyPath}
                          </code>
                        </div>
                      </div>

                      <div className="w-0.5 h-4 bg-gradient-to-b from-mint to-aqua ml-2.5" />

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-semibold">
                  <div className="p-5 border border-white/60 bg-white/50 rounded-2xl">
                    <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                      Core Triggers
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside">
                      {activeProfile.causes.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 border border-white/60 bg-white/50 rounded-2xl">
                    <h5 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      Symptom Array
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-800 list-disc list-inside">
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
          </>
        )}
      </AnimatePresence>
      </Portal>
    </div>
  );
}
