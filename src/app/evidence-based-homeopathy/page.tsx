"use client";

import { motion } from "framer-motion";
import { 
  BookOpen, Compass, BarChart, Users, Heart, ShieldAlert,
  ArrowRight, FileText, Settings, ClipboardList, CheckCircle2
} from "lucide-react";
import PotencySimulator from "@/components/PotencySimulator";
import { useRouter } from "next/navigation";
import Magnetic from "@/components/Magnetic";

export default function EvidenceBasedHomeopathyPage() {
  const router = useRouter();
  const pillars = [
    {
      num: "01",
      title: "Classical Foundation",
      desc: "Kent’s Repertory, Boericke’s Materia Medica, and Allen’s Keynotes form the bedrock. Classical principles enhanced — never discarded — by evidence.",
      icon: <BookOpen className="w-5 h-5 text-mint" />
    },
    {
      num: "02",
      title: "Scientific Integration",
      desc: "Remedies validated against RCTs, systematic reviews, and observational studies. Where evidence exists, it guides — where it doesn’t, classical principles lead.",
      icon: <Compass className="w-5 h-5 text-aqua" />
    },
    {
      num: "03",
      title: "Outcome Measurement",
      desc: "Quality-of-life scales, biomarker tracking, and validated symptom severity instruments demonstrate real, measurable clinical improvement.",
      icon: <BarChart className="w-5 h-5 text-lavender-dark" />
    },
    {
      num: "04",
      title: "Individualisation",
      desc: "Two patients with identical diagnoses receive different remedies. The totality of symptoms — physical, mental, emotional — determines the prescription.",
      icon: <Users className="w-5 h-5 text-rose-500" />
    },
    {
      num: "05",
      title: "Integrative Safety",
      desc: "Treatment designed to work alongside conventional care. No dangerous interactions. Patient safety is non-negotiable.",
      icon: <Heart className="w-5 h-5 text-teal-500" />
    },
    {
      num: "06",
      title: "Ethical Transparency",
      desc: "Honest prognosis. Realistic expectations. Clear communication of what homeopathy can — and cannot — achieve.",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600" />
    }
  ];

  const processSteps = [
    {
      num: "01",
      title: "Comprehensive Case Taking",
      time: "60–90 Minutes",
      desc: "Mapping the complete disease picture — onset, modalities, concomitants, miasmatic background, mental-emotional state, physical generals, and family history.",
      icon: <FileText className="w-5 h-5 text-mint" />
    },
    {
      num: "02",
      title: "Repertorisation & Analysis",
      time: "Clinical Evaluation",
      desc: "The case is systematically repertorised and the most similar remedy — the simillimum — identified using classical methodology supported by modern Materia Medica.",
      icon: <Settings className="w-5 h-5 text-aqua" />
    },
    {
      num: "03",
      title: "Prescription & Instructions",
      time: "Custom Dosage Formulation",
      desc: "Precise remedy, potency, dose, frequency, and lifestyle guidance. Patient fully briefed on what to expect including initial aggravation and improvement timelines.",
      icon: <ClipboardList className="w-5 h-5 text-lavender-dark" />
    },
    {
      num: "04",
      title: "Follow-Up & Outcome Tracking",
      time: "Outcome Measurement",
      desc: "Scheduled follow-ups assess progress against baseline. Biomarkers reviewed where available. Treatment adjusted as the case evolves toward deep, sustained cure.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    }
  ];

  const handleBookClick = () => {
    router.push("/#booking");
  };

  const handleExploreConditions = () => {
    router.push("/services");
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto z-10 relative">
        
        {/* Page Hero Header */}
        <div className="max-w-4xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Our Clinical Framework
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] mb-6 leading-tight"
          >
            Evidence-Based Homeopathy Redefined.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base md:text-lg text-slate-700 font-semibold leading-relaxed mb-8 max-w-3xl"
          >
            A rigorous clinical framework integrating 200 years of classical homeopathic wisdom with modern scientific research, biomarker tracking, and measurable patient outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Magnetic>
              <button
                onClick={handleBookClick}
                className="glass-panel border-mint/20 hover:border-mint bg-mint text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm shadow-mint/10"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={handleExploreConditions}
                className="glass-panel border-slate-200 hover:border-slate-800 text-[#1A2421] bg-white/40 px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
              >
                Meet the Doctor
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Six Pillars Grid */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Core Philosophy</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              Six Pillars of Evidence-Based Practice
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              We operate at the interface of historical therapeutics and contemporary medical scrutiny, ensuring safety and objective clarity at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((p, idx) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-panel border-white/60 bg-white/40 p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="absolute top-4 right-6 text-4xl font-black text-slate-900/5 select-none font-sans">
                  {p.num}
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1A2421] mb-3">{p.title}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Clinical Process */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Methodology</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              From First Consultation to Measurable Recovery
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Our clinical protocol is systematic, ensuring every case is thoroughly documented, mapped, and mathematically repertorised to arrive at the simillimum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-panel border-white/60 bg-white/30 p-6 rounded-3xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-xs font-black text-mint/30 uppercase tracking-widest font-mono">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A2421] mb-1">{step.title}</h3>
                  <span className="text-[10px] text-mint font-bold uppercase tracking-wider block mb-3">
                    {step.time}
                  </span>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive Simulator Section */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Active Demonstration</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              Understanding Potency Dilution
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Homeopathic remedies are prepared through serial dilution and succussion (vigorous kinetic agitation), creating bio-resonant liquid structures that match physical organ systems. Slide the control to visualize.
            </p>
          </div>
          
          <PotencySimulator />
        </div>

        {/* Action Call Section */}
        <div className="glass-panel border-mint/20 bg-mint/5 p-12 rounded-[40px] text-center max-w-4xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute w-[200px] h-[200px] rounded-full bg-mint/10 opacity-30 blur-[40px] -top-10 -right-10 pointer-events-none" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-aqua/5 opacity-20 blur-[40px] -bottom-10 -left-10 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest bg-white border border-mint/20 px-3 py-1 rounded-full shadow-sm">
              Begin Clinical Care
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421]">
              Ready for Homeopathy That Actually Measures Results?
            </h2>
            <p className="text-xs md:text-sm text-slate-700 font-semibold leading-relaxed max-w-lg mx-auto">
              Book a comprehensive online or in-clinic consultation with Dr. Narayan Jethwani and receive a detailed diagnostic treatment plan.
            </p>
            <div className="flex justify-center pt-2">
              <Magnetic>
                <button
                  onClick={handleBookClick}
                  className="bg-mint hover:bg-mint-dark text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(20,184,166,0.2)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Schedule Your Case Taking
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
