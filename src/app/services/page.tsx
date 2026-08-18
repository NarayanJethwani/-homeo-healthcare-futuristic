"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Wind, Brain, Activity, Sparkles, Shield, Baby, 
  Dna, ShieldCheck, ShieldAlert, ShieldOff, Sprout, X, ArrowRight, ArrowLeft,
  BookOpen, Layers, Stethoscope, Clock, CheckCircle2, AlertTriangle, FileCode, HelpCircle,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Copy, Check
} from "lucide-react";
import ConditionCard from "@/components/ConditionCard";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";
import { getSpecialtyProfileByTitle, SpecialtyProfile } from "@/features/knowledge/content/specialtyProfiles";

export default function ServicesPage() {
  const router = useRouter();
  const [selectedCondition, setSelectedCondition] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "root-cause" | "symptoms" | "journey" | "faqs" | "graph">("overview");
  
  // Reading Experience & Readability Controls (14px to 24px)
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(0); // -1: 14px, 0: 16px, 1: 18px, 2: 20px, 3: 22px, 4: 24px
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [graphViewMode, setGraphViewMode] = useState<"visual" | "json">("visual");

  const getReaderFontSize = (level: number): string => {
    switch (level) {
      case -1: return "14px";
      case 0: return "16px";
      case 1: return "18px";
      case 2: return "20px";
      case 3: return "22px";
      case 4: return "24px";
      default: return "16px";
    }
  };

  const conditionsList = [
    {
      title: "Heart & Cardiovascular",
      desc: "Supportive care for people with hypertension, palpitations or cholesterol concerns alongside medical evaluation and monitoring.",
      icon: <Heart className="w-5 h-5 text-rose-500" />,
      tags: ["Hypertension", "Palpitations", "Cholesterol", "Recovery"],
      glowColor: "radial-gradient(circle at center, rgba(244,63,94,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Lungs & Respiratory",
      desc: "Supportive care for asthma, COPD, chronic bronchitis and sinus symptoms without replacing prescribed inhalers or specialist care.",
      icon: <Wind className="w-5 h-5 text-cyan-500" />,
      tags: ["Asthma", "COPD", "Sinusitis", "Bronchitis"],
      glowColor: "radial-gradient(circle at center, rgba(6,182,212,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Neuro & Mental Health",
      desc: "Supportive care for recurring migraine, anxiety, mild low mood and sleep difficulty, with referral for warning signs.",
      icon: <Brain className="w-5 h-5 text-indigo-500" />,
      tags: ["Migraine", "Anxiety", "Insomnia", "Stress"],
      glowColor: "radial-gradient(circle at center, rgba(99,102,241,0.4) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Joints & Spine",
      desc: "Supportive symptom and wellbeing care for osteoarthritis, rheumatoid arthritis, gout, spondylosis and back pain.",
      icon: <Activity className="w-5 h-5 text-amber-500" />,
      tags: ["Arthritis", "Gout", "Spondylosis", "Back Pain"],
      glowColor: "radial-gradient(circle at center, rgba(245,158,11,0.4) 0%, rgba(244,63,94,0.2) 50%, transparent 100%)",
    },
    {
      title: "Skin Disorders",
      desc: "Individualized supportive care for people living with eczema, psoriasis, acne and vitiligo.",
      icon: <Sparkles className="w-5 h-5 text-teal-500" />,
      tags: ["Eczema", "Psoriasis", "Acne", "Vitiligo"],
      glowColor: "radial-gradient(circle at center, rgba(20,184,166,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)",
    },
    {
      title: "Digestive Health",
      desc: "Supportive care for IBS, recurring acidity, GERD and digestive symptoms after appropriate assessment.",
      icon: <Shield className="w-5 h-5 text-emerald-500" />,
      tags: ["IBS", "Acidity", "GERD", "Colitis"],
      glowColor: "radial-gradient(circle at center, rgba(16,185,129,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Paediatric Care",
      desc: "Age-appropriate supportive care for recurring childhood concerns after clinical assessment and safeguarding review.",
      icon: <Baby className="w-5 h-5 text-amber-600" />,
      tags: ["Immunity", "Tonsils", "Growth", "Behavior"],
      glowColor: "radial-gradient(circle at center, rgba(217,119,6,0.35) 0%, rgba(16,185,129,0.2) 50%, transparent 100%)",
    },
    {
      title: "Hormonal & Thyroid",
      desc: "Supportive care for people managing thyroid disorders, PCOS, diabetes or weight concerns with ongoing medical monitoring.",
      icon: <Dna className="w-5 h-5 text-purple-500" />,
      tags: ["Thyroid", "PCOS", "Diabetes", "Metabolism"],
      glowColor: "radial-gradient(circle at center, rgba(168,85,247,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 100%)",
    },
    {
      title: "Autoimmune Disorders",
      desc: "Adjunctive wellbeing support for people under specialist care for lupus, Hashimoto's thyroiditis, rheumatoid disease or CKD.",
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      tags: ["Lupus", "Hashimoto's", "CKD Support", "RA"],
      glowColor: "radial-gradient(circle at center, rgba(239,68,68,0.35) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)",
    },
    {
      title: "Allergies",
      desc: "Supportive care for allergic rhinitis and recurring urticaria; severe or food-related reactions require conventional allergy planning.",
      icon: <ShieldOff className="w-5 h-5 text-orange-500" />,
      tags: ["Rhinitis", "Food Allergy", "Urticaria", "Dust"],
      glowColor: "radial-gradient(circle at center, rgba(249,115,22,0.35) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
    {
      title: "Integrative Cancer Care",
      desc: "Adjunctive wellbeing support only with the oncology team informed. It never replaces cancer treatment or urgent oncology advice.",
      icon: <Sprout className="w-5 h-5 text-lime-600" />,
      tags: ["Supportive", "Chemo Support", "Nausea", "Fatigue"],
      glowColor: "radial-gradient(circle at center, rgba(132,204,22,0.4) 0%, rgba(20,184,166,0.2) 50%, transparent 100%)",
    },
  ];

  const fullProfile = selectedCondition ? getSpecialtyProfileByTitle(selectedCondition.title) : null;

  const handleBeginTreatment = () => {
    router.push("/#booking");
  };

  const differentiators = [
    {
      title: "Evidence-Based Protocol",
      desc: "Clinical decisions documented with clear goals, symptom measures and appropriate investigations; evidence limits are discussed honestly.",
      icon: <ShieldCheck className="w-6 h-6 text-mint" />
    },
    {
      title: "True Individualisation",
      desc: "Same diagnosis, different remedies. Every prescription based on your complete constitutional picture.",
      icon: <Dna className="w-6 h-6 text-aqua" />
    },
    {
      title: "20+ Years Experience",
      desc: "More than two decades of clinical practice involving acute and complex chronic presentations at Pune clinics.",
      icon: <Sparkles className="w-6 h-6 text-lavender-dark" />
    },
    {
      title: "Integrative Approach",
      desc: "Designed as adjunctive care. Existing medicines are not stopped or changed without the prescribing clinician.",
      icon: <Heart className="w-6 h-6 text-rose-500" />
    },
    {
      title: "Online Consultations",
      desc: "High-quality video consultations and clinical tracking for patients across India and worldwide.",
      icon: <Wind className="w-6 h-6 text-cyan-500" />
    },
    {
      title: "Ethical Practice",
      desc: "Realistic expectations, documented consent, safety-net advice and referral when a case falls outside scope.",
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
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-mint/20 hover:border-mint/60 bg-mint/5 hover:bg-mint/10 text-mint-dark hover:text-[#0c6b5e] text-xs font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Home
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
            Clinical Services & Condition Architecture
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
            Individualized physician-led homeopathic care for suitable acute and chronic concerns, with clear boundaries for urgent and specialist care.
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
                onClick={() => {
                  setSelectedCondition(cond);
                  setActiveTab("overview");
                }}
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
            onClick={handleBeginTreatment}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/90 border border-mint/30 shadow-[0_4px_12px_rgba(20,184,166,0.05)] text-mint">
              <Sparkles className="w-5 h-5 text-mint" />
            </div>
            <div className="mt-4 flex-grow flex flex-col justify-end">
              <h3 className="text-xl font-bold text-[#1A2421] mb-2 leading-none">Not Listed Here?</h3>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed mb-4">
                Request a physician review so we can clarify suitability, required investigations and the safest next step.
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
              Our approach combines individualized homeopathic assessment with documented goals, planned review and appropriate conventional referral.
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

      {/* Slide-over 20-Section Digital Clinic Drawer */}
      <Portal>
        <AnimatePresence>
          {selectedCondition && fullProfile && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCondition(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-md z-50 pointer-events-auto"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className={
                isFullScreen
                  ? "fixed inset-0 w-full h-full bg-[#FAF9F6] dark:bg-slate-900 z-[60] flex flex-col pointer-events-auto overflow-hidden transition-all duration-300"
                  : "fixed right-0 top-0 bottom-0 w-full sm:w-[680px] md:w-[760px] lg:w-[840px] bg-[#FAF9F6]/95 dark:bg-slate-900/95 border-l border-white/50 dark:border-slate-800 z-[51] shadow-2xl flex flex-col pointer-events-auto overflow-hidden transition-all duration-300"
              }
            >
              {/* Drawer Header */}
              <div className="p-4 md:p-6 border-b border-slate-900/5 dark:border-slate-800/40 bg-white/90 backdrop-blur-md sticky top-0 z-10 space-y-4">
                {/* Header Title + Reading Experience Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-mint/10 border border-mint/20 shadow-sm text-mint shrink-0">
                      {selectedCondition.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1A2421] leading-tight mb-0.5">{fullProfile.title}</h3>
                      <span className="text-[10px] text-mint font-bold uppercase tracking-wider">{fullProfile.shortSubtitle}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Reading Controls Toolbar: Font Size, Zoom, Fullscreen */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
                      {/* Font Size (-A / +A up to 24px) */}
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg p-0.5 border border-slate-200/60 dark:border-slate-800">
                        <button
                          onClick={() => setFontSizeLevel(prev => Math.max(-1, prev - 1))}
                          className="px-2 py-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-mint hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Decrease font size (-A)"
                        >
                          -A
                        </button>
                        <span className="px-2 text-xs font-mono text-mint-dark dark:text-mint font-extrabold select-none min-w-[42px] text-center">
                          {getReaderFontSize(fontSizeLevel)}
                        </span>
                        <button
                          onClick={() => setFontSizeLevel(prev => Math.min(4, prev + 1))}
                          className="px-2 py-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-mint hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Increase font size (+A up to 24px)"
                        >
                          +A
                        </button>
                      </div>

                      {/* Zoom Toggle */}
                      <button
                        onClick={() => setIsZoomed(prev => !prev)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isZoomed 
                            ? "bg-mint text-white border-mint shadow-sm" 
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:border-mint"
                        }`}
                        title="Toggle Reading Magnification (Zoom)"
                      >
                        {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline text-[10px]">{isZoomed ? "1.2x" : "Zoom"}</span>
                      </button>

                      {/* Full Screen Mode Toggle */}
                      <button
                        onClick={() => setIsFullScreen(prev => !prev)}
                        className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isFullScreen 
                            ? "bg-mint text-white border-mint shadow-sm" 
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800 hover:border-mint"
                        }`}
                        title={isFullScreen ? "Exit Full Screen Mode" : "Expand to Full Screen"}
                      >
                        {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        <span className="hidden sm:inline text-[10px]">{isFullScreen ? "Drawer" : "Full Screen"}</span>
                      </button>
                    </div>

                    {/* Close Drawer Button */}
                    <button
                      onClick={() => {
                        setSelectedCondition(null);
                        setIsFullScreen(false);
                      }}
                      className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-800 flex items-center justify-center transition-colors group cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4 text-slate-500 group-hover:text-slate-800" />
                    </button>
                  </div>
                </div>

                {/* Tab Bar Navigation */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "overview" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Overview & Personas
                  </button>
                  <button
                    onClick={() => setActiveTab("root-cause")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "root-cause" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Root Cause & Axis
                  </button>
                  <button
                    onClick={() => setActiveTab("symptoms")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "symptoms" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Symptoms & Risks
                  </button>
                  <button
                    onClick={() => setActiveTab("journey")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "journey" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    Journey & Lifestyle
                  </button>
                  <button
                    onClick={() => setActiveTab("faqs")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "faqs" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    FAQs
                  </button>
                  <button
                    onClick={() => setActiveTab("graph")}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      activeTab === "graph" ? "bg-mint text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    AI Knowledge Graph
                  </button>
                </div>
              </div>

              {/* Reader Scalable CSS Overrides */}
              <style jsx global>{`
                .reader-scalable-content p,
                .reader-scalable-content span:not(.no-scale),
                .reader-scalable-content div.p-3,
                .reader-scalable-content div.p-4,
                .reader-scalable-content div.p-5,
                .reader-scalable-content li {
                  font-size: inherit !important;
                  line-height: 1.65 !important;
                }
              `}</style>

              {/* Drawer Scrollable Content with Dynamic Font Size & Zoom */}
              <div 
                data-lenis-prevent
                style={{
                  fontSize: getReaderFontSize(fontSizeLevel),
                  zoom: isZoomed ? 1.15 : 1,
                }}
                className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 select-text transition-all duration-200 text-slate-800 dark:text-slate-200"
              >
                
                {/* TAB 1: OVERVIEW & PERSONAS */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Hero Description */}
                    <div className="p-5 rounded-2xl bg-mint/5 border border-mint/20 text-slate-800 font-medium">
                      <span className="font-bold text-mint-dark dark:text-mint block mb-2 uppercase tracking-wider text-[11px] no-scale">Clinical Hero Synopsis</span>
                      <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.65" }}>
                        {fullProfile.heroDescription}
                      </p>
                    </div>

                    {/* Pathological Overview */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <BookOpen className="w-4 h-4 text-mint" />
                        Clinical Overview & Progression
                      </h4>
                      <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.65" }} className="text-slate-700 dark:text-slate-300 font-normal">
                        {fullProfile.overview}
                      </p>
                    </div>

                    {/* Who Can Benefit Personas */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <Stethoscope className="w-4 h-4 text-mint" />
                        Who Can Benefit — Patient Personas
                      </h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">✓ Newly Diagnosed</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.whoCanBenefit.newlyDiagnosed}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">✓ Chronic Sufferers</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.whoCanBenefit.chronicSufferers}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">✓ Recurrent Cases</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.whoCanBenefit.recurrentCases}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">✓ Complementary Care Patients</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.whoCanBenefit.complementaryCare}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">✓ Patients Managing Medication Side Effects</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.whoCanBenefit.medicationSideEffects}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: ROOT CAUSE & DRIVERS */}
                {activeTab === "root-cause" && (
                  <div className="space-y-6">
                    {/* Root Cause Mapping Axis */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <Dna className="w-4 h-4 text-mint animate-pulse" />
                        Root-Cause Mapping Axis
                      </h4>
                      
                      <div className="glass-panel border-white/60 bg-white/60 dark:bg-slate-900/60 p-6 rounded-3xl relative space-y-4">
                        <div>
                          <span className="block text-[11px] text-slate-500 font-extrabold uppercase tracking-wide mb-1 no-scale">1. Epigenetic Susceptibility</span>
                          <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-800 dark:text-slate-200 font-medium">{fullProfile.rootCauseAxis.epigeneticSusceptibility}</p>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                          <span className="block text-[11px] text-slate-500 font-extrabold uppercase tracking-wide mb-1 no-scale">2. Functional Axis Flow</span>
                          <div style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="bg-mint/10 dark:bg-mint/20 p-4 rounded-xl border border-mint/30 font-mono text-mint-dark dark:text-mint font-bold leading-relaxed">
                            {fullProfile.rootCauseAxis.functionalAxis}
                          </div>
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                          <span className="block text-[11px] text-slate-500 font-extrabold uppercase tracking-wide mb-1 no-scale">3. Somatic / Clinical Manifestation</span>
                          <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-800 dark:text-slate-200 font-medium">{fullProfile.rootCauseAxis.clinicalManifestation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Underlying Biological Drivers */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <Layers className="w-4 h-4 text-mint" />
                        Underlying Biological Drivers (10 Factors)
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {fullProfile.underlyingBiologicalDrivers.map((driver, i) => (
                          <div key={i} style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.5" }} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                            <span className="w-6 h-6 rounded-full bg-mint/10 text-mint text-xs font-bold flex items-center justify-center shrink-0 no-scale">{i + 1}</span>
                            <span>{driver}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: SYMPTOMS & RISKS */}
                {activeTab === "symptoms" && (
                  <div className="space-y-6">
                    {/* Common Symptoms Array */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <Activity className="w-4 h-4 text-mint" />
                        Symptom Spectrum & Categorization
                      </h4>
                      <div className="space-y-3">
                        <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl">
                          <span className="text-[11px] font-bold uppercase text-emerald-800 dark:text-emerald-400 tracking-wider block mb-2 no-scale">Most Common Symptoms</span>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                            {fullProfile.symptoms.mostCommon.map((s, i) => (
                              <li key={i} style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
                          <span className="text-[11px] font-bold uppercase text-amber-800 dark:text-amber-400 tracking-wider block mb-2 no-scale">Moderate Symptoms</span>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                            {fullProfile.symptoms.moderate.map((s, i) => (
                              <li key={i} style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl">
                          <span className="text-[11px] font-bold uppercase text-rose-800 dark:text-rose-400 tracking-wider block mb-2 no-scale">Advanced Symptoms</span>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc list-inside">
                            {fullProfile.symptoms.advanced.map((s, i) => (
                              <li key={i} style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Associated Conditions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider no-scale">Associated Co-existing Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {fullProfile.associatedConditions.map((c, i) => (
                          <span key={i} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full font-semibold text-slate-700 dark:text-slate-300">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider no-scale">Multifactorial Risk Factors</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Lifestyle</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.riskFactors.lifestyle.join(", ")}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Genetic</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.riskFactors.genetic.join(", ")}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Environmental</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.riskFactors.environmental.join(", ")}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Metabolic</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.riskFactors.metabolic.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: JOURNEY & LIFESTYLE */}
                {activeTab === "journey" && (
                  <div className="space-y-6">
                    {/* Expected Treatment Journey Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                        <Clock className="w-4 h-4 text-mint" />
                        Expected Treatment Journey Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex gap-4">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-mint-dark dark:text-mint shrink-0">Week 1</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-700 dark:text-slate-300">{fullProfile.expectedTreatmentJourney.week1}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex gap-4">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-mint-dark dark:text-mint shrink-0">Month 1</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-700 dark:text-slate-300">{fullProfile.expectedTreatmentJourney.month1}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex gap-4">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-mint-dark dark:text-mint shrink-0">Month 3</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-700 dark:text-slate-300">{fullProfile.expectedTreatmentJourney.month3}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex gap-4">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-mint-dark dark:text-mint shrink-0">Month 6</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-700 dark:text-slate-300">{fullProfile.expectedTreatmentJourney.month6}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle Recommendations */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider no-scale">Lifestyle Integration Pillars</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Dietary Strategy</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.lifestyleRecommendations.diet}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Exercise & Movement</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.lifestyleRecommendations.exercise}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Sleep Hygiene</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.lifestyleRecommendations.sleep}</span>
                        </div>
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Stress Reduction</span>
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400 block">{fullProfile.lifestyleRecommendations.stress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: FAQS */}
                {activeTab === "faqs" && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                      <HelpCircle className="w-4 h-4 text-mint" />
                      Frequently Asked Questions
                    </h4>
                    <div className="space-y-4">
                      {fullProfile.faqs.map((faq, i) => (
                        <div key={i} className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2 shadow-sm">
                          <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold text-slate-900 dark:text-slate-100 block">{faq.question}</span>
                          <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }} className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                        </div>
                      ))}
                    </div>

                    {/* Disclaimer */}
                    <div className="p-5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-amber-900 dark:text-amber-300 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="font-bold block mb-1">Medical Safety Disclaimer</span>
                        <p style={{ fontSize: getReaderFontSize(fontSizeLevel), lineHeight: "1.6" }}>{fullProfile.medicalDisclaimer}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: AI KNOWLEDGE GRAPH */}
                {activeTab === "graph" && (
                  <div className="space-y-6">
                    {/* Header with View Toggle (Visual Graph vs Raw JSON) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-mint/10 text-mint flex items-center justify-center font-bold shrink-0">
                          <Dna className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider no-scale">
                            AI Knowledge Graph & Taxonomy
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium no-scale">
                            Semantic entity mappings for clinical RAG & search indexing
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Toggle Buttons */}
                        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                          <button
                            onClick={() => setGraphViewMode("visual")}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                              graphViewMode === "visual"
                                ? "bg-mint text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                          >
                            Visual Graph
                          </button>
                          <button
                            onClick={() => setGraphViewMode("json")}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                              graphViewMode === "json"
                                ? "bg-mint text-white shadow-sm"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                            }`}
                          >
                            Raw JSON
                          </button>
                        </div>

                        {graphViewMode === "json" && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(JSON.stringify(fullProfile.knowledgeGraph, null, 2));
                              setCopiedJson(true);
                              setTimeout(() => setCopiedJson(false), 2000);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-mint/10 hover:bg-mint/20 border border-mint/30 text-mint-dark dark:text-mint text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedJson ? "Copied" : "Copy"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* VISUAL GRAPH DISPLAY */}
                    {graphViewMode === "visual" ? (
                      <div className="space-y-6">
                        {/* Central Entity Hub Node */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-mint/10 via-teal-50/40 to-emerald-50/20 dark:from-slate-800 dark:to-slate-900 border border-mint/30 shadow-sm relative overflow-hidden">
                          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <span className="px-3 py-1 rounded-full bg-mint text-white text-[10px] font-extrabold uppercase tracking-wider mb-2 inline-block no-scale">
                                Central Entity Node
                              </span>
                              <h3 style={{ fontSize: getReaderFontSize(fontSizeLevel + 1) }} className="font-extrabold text-slate-900 dark:text-slate-100">
                                {fullProfile.knowledgeGraph.condition}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-mint-dark dark:text-mint bg-white/90 dark:bg-slate-900/90 px-3.5 py-2 rounded-xl border border-mint/20 shadow-xs">
                              <Sparkles className="w-4 h-4 text-mint shrink-0" />
                              <span>{fullProfile.knowledgeGraph.symptoms.length + fullProfile.knowledgeGraph.triggers.length + fullProfile.knowledgeGraph.riskFactors.length} Knowledge Nodes</span>
                            </div>
                          </div>
                        </div>

                        {/* Systems Involved & Clinical Pathways Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Organ Systems Involved */}
                          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                              <Activity className="w-4 h-4 text-indigo-500" />
                              Physiological Systems & Axes
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {fullProfile.knowledgeGraph.systemsInvolved.map((sys, idx) => (
                                <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-300 font-bold border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                  {sys}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Clinical Pathways */}
                          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 no-scale">
                              <Layers className="w-4 h-4 text-emerald-500" />
                              Clinical Therapeutic Pathways
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {fullProfile.knowledgeGraph.clinicalPathways.map((path, idx) => (
                                <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                  {path}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Symptoms, Triggers & Risk Factors Node Triad */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Symptoms Nodes */}
                          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <span className="text-[11px] font-extrabold uppercase text-rose-700 dark:text-rose-400 tracking-wider block no-scale">
                              Symptom Nodes ({fullProfile.knowledgeGraph.symptoms.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {fullProfile.knowledgeGraph.symptoms.map((sym, idx) => (
                                <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl font-bold border border-rose-200/60 dark:border-rose-900/40">
                                  {sym}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Environmental Triggers */}
                          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <span className="text-[11px] font-extrabold uppercase text-amber-700 dark:text-amber-400 tracking-wider block no-scale">
                              Trigger Nodes ({fullProfile.knowledgeGraph.triggers.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {fullProfile.knowledgeGraph.triggers.map((trig, idx) => (
                                <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 rounded-xl font-bold border border-amber-200/60 dark:border-amber-900/40">
                                  {trig}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Risk Factors */}
                          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm">
                            <span className="text-[11px] font-extrabold uppercase text-purple-700 dark:text-purple-400 tracking-wider block no-scale">
                              Risk Factor Nodes ({fullProfile.knowledgeGraph.riskFactors.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {fullProfile.knowledgeGraph.riskFactors.map((rf, idx) => (
                                <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 rounded-xl font-bold border border-purple-200/60 dark:border-purple-900/40">
                                  {rf}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Semantic Tags Footer */}
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider no-scale">
                            <BookOpen className="w-4 h-4 text-mint" />
                            AI Semantic Search Tags
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {fullProfile.knowledgeGraph.tags.map((tag, idx) => (
                              <span key={idx} style={{ fontSize: getReaderFontSize(fontSizeLevel) }} className="px-3.5 py-1 bg-white dark:bg-slate-900 border border-mint/30 text-mint-dark dark:text-mint rounded-full font-bold shadow-2xs">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* RAW JSON VIEW */
                      <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono overflow-x-auto shadow-inner border border-slate-800" style={{ fontSize: getReaderFontSize(fontSizeLevel) }}>
                        <pre>{JSON.stringify(fullProfile.knowledgeGraph, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Drawer Footer booking CTA */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-sm border-t border-slate-900/5 dark:border-slate-800/40 flex flex-col items-center">
                <Magnetic>
                  <button
                    onClick={handleBeginTreatment}
                    className="w-full py-4 bg-mint hover:bg-mint-dark text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    {fullProfile.microcopy.appointmentCta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Magnetic>
                <span className="text-[10px] text-slate-500 font-semibold mt-3 italic">
                  {fullProfile.microcopy.trustBadge}
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
