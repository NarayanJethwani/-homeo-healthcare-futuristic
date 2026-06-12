"use client";

import { motion } from "framer-motion";
import { 
  Award, BookOpen, CheckCircle, ShieldCheck, Heart, 
  MapPin, ArrowRight, ArrowLeft, Activity 
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function DoctorProfilePage() {
  const router = useRouter();
  const credentials = [
    { title: "Nashik University MD (Hom.)", desc: "Doctor of Medicine (3 Years clinical postgraduate specialization)." },
    { title: "Nashik University BHMS", desc: "Bachelor of Homoeopathic Medicine and Surgery (5 & half Years degree)." },
    { title: "Kent's Repertory Expert", desc: "Advanced expertise in classical case analysis and symptom repertorisation." },
    { title: "20+ Years Practice", desc: "Directing clinical care at Ramkrishna Homeopathy Consultancy since April 2005." },
    { title: "10k+ Patients Treated", desc: "Clinical management of acute and complex multi-system chronic conditions." },
    { title: "Evidence-Based Pioneer", desc: "Integrating modern biomarker reporting with classical homeopathy." }
  ];

  const philosophyItems = [
    {
      title: "Classical Repertorisation",
      desc: "Kent’s Repertory, Boericke’s Materia Medica, and Allen’s Keynotes form the absolute bedrock of every clinical evaluation.",
      icon: <BookOpen className="w-5 h-5 text-mint" />
    },
    {
      title: "Modern Clinical Evidence",
      desc: "Classical wisdom is integrated with contemporary biomarker tracking, laboratory reviews, and structured patient outcomes.",
      icon: <Activity className="w-5 h-5 text-aqua" />
    },
    {
      title: "Constitutional Prescribing",
      desc: "Remedies target physical generals, mental-emotional pathways, and miasmatic/hereditary predispositions.",
      icon: <Award className="w-5 h-5 text-lavender-dark" />
    },
    {
      title: "Integrative Collaboration",
      desc: "Designed to operate safely alongside conventional treatments. We never advise stopping prior medications unilaterally.",
      icon: <Heart className="w-5 h-5 text-rose-500" />
    },
    {
      title: "Measurable Outcomes",
      desc: "Clinical progress is monitored via validated quality-of-life questionnaires, symptom indices, and lab diagnostics.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      title: "Ethical Transparency",
      desc: "Clear, honest prognosis. Realistic expectations. Complete transparency regarding treatment limits and timelines.",
      icon: <CheckCircle className="w-5 h-5 text-teal-500" />
    }
  ];

  const stats = [
    { value: "20+", label: "Years Experience" },
    { value: "10k+", label: "Patients Treated" },
    { value: "100+", label: "Conditions Treated" },
    { value: "0%", label: "Side Effects" }
  ];

  const handleWhatsAppChat = () => {
    window.open("https://wa.me/918446056789", "_blank");
  };

  const handleBookConsultation = () => {
    router.push("/#booking");
  };

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

        {/* Profile Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
          
          {/* Left Column: Stats & Visual Panel */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="glass-panel border-white/60 bg-white/40 p-8 rounded-[36px] relative overflow-hidden"
            >
              <div className="absolute w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-mint/10 to-transparent blur-[40px] -top-10 -left-10 pointer-events-none" />
              
              {/* Doctor Profile Image Container */}
              <div className="w-full aspect-[4/5] rounded-2xl border border-slate-200/60 overflow-hidden relative shadow-md group mb-8">
                <Image
                  src="/images/dr_jethwani_profile.png"
                  alt="Dr. Narayan B. Jethwani"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {/* Subtle dark gradient overlay at the bottom for caption overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <h4 className="text-xl font-serif font-bold text-white">Dr. Narayan B. Jethwani</h4>
                  <p className="text-xs font-bold text-mint uppercase tracking-wider mt-0.5">BHMS · MD (Hom.)</p>
                  <p className="text-[10px] text-white/85 font-medium mt-2.5 italic max-w-xs leading-relaxed">
                    "Healing is not about suppressing a chemical reading; it is about restoring the core vitality of the human system."
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 border border-white/60 bg-white/50 rounded-2xl text-center">
                    <span className="block text-2xl font-extrabold text-[#1A2421]">{s.value}</span>
                    <span className="text-[9px] text-slate-700 font-bold uppercase tracking-wider">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Narrative Biography */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
                20+ Years Clinical Practice
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
              >
                Meet the Doctor
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="space-y-6 text-sm text-slate-700 font-semibold leading-relaxed"
              >
                <p>
                  Dr. Narayan B. Jethwani is a distinguished homeopathic physician with over two decades of clinical practice at <strong className="text-[#1A2421]">Ramkrishna Homeopathic Consultancy</strong> in Baner, Pune.
                </p>
                <p>
                  Having treated thousands of patients suffering from complex, chronic, and multi-systemic disorders, Dr. Jethwani pioneered the <strong className="text-[#1A2421]">Evidence-Based Homeopathy</strong> framework. This methodology bridges the profound healing principles of classical homeopathy with objective biomarker reporting and modern outcome measures.
                </p>
                <p>
                  He specializes in evaluating deep-seated constitutional blocks and prescribing remedies that restore systemic equilibrium, without creating dependency or chemical side effects.
                </p>
              </motion.div>
            </div>

            {/* Quick Credentials List */}
            <div className="border-t border-slate-900/5 pt-8">
              <h3 className="text-base font-bold text-[#1A2421] mb-4">Credentials & Milestones</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credentials.map((cred, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900 leading-none mb-1">{cred.title}</span>
                      <span className="text-[10px] text-slate-700 font-semibold">{cred.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Magnetic>
                <button
                  onClick={handleBookConsultation}
                  className="bg-mint hover:bg-mint-dark text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-sm shadow-mint/10 transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={handleWhatsAppChat}
                  className="glass-panel border-[#0F766E]/20 text-[#0F766E] bg-[#0F766E]/5 hover:bg-[#0F766E]/10 px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2"
                >
                  WhatsApp Dr. Jethwani
                </button>
              </Magnetic>
            </div>
          </div>

        </div>

        {/* Clinical Philosophy */}
        <div className="border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Clinical Philosophy</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] mt-2 mb-4">
              Evidence-Based Homeopathic Practice
            </h2>
            <p className="text-sm text-slate-700 font-semibold leading-relaxed">
              Every prescription uniquely crafted. Every outcome carefully measured. We adhere to rigorous standards to ensure the highest fidelity of clinical diagnostics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {philosophyItems.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="glass-panel border-white/60 bg-white/40 p-8 rounded-3xl"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-[#1A2421] mb-2">{item.title}</h3>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Practice Locations Summary Card */}
        <div className="glass-panel border-white/60 bg-white/30 rounded-[32px] p-8 md:p-12 mt-24 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-3 max-w-xl">
            <span className="text-[9px] text-mint font-bold uppercase tracking-wider border border-mint/20 bg-white px-2 py-0.5 rounded-full">OPD Clinics</span>
            <h3 className="text-2xl font-bold text-[#1A2421]">Ramkrishna Homeopathic Consultancy</h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              Dr. Narayan Jethwani holds OPD hours across two clinics in Baner, Pune: Pyramid Axis (Main Consultation Center) and Seema Park. Confirm appointments prior to visiting.
            </p>
          </div>
          <div className="flex gap-4">
            <Magnetic>
              <button
                onClick={() => router.push("/contact-us")}
                className="glass-panel border-slate-200 hover:border-slate-800 text-[#1A2421] bg-white/50 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              >
                View Map & Directions <MapPin className="w-4 h-4" />
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
}
