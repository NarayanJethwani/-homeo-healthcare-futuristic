"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Compass, BarChart, Users, Heart, ShieldAlert,
  ArrowRight, ArrowLeft, FileText, Settings, ClipboardList, CheckCircle2,
  X
} from "lucide-react";
import PotencySimulator from "@/components/PotencySimulator";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";
import Portal from "@/components/Portal";

export default function EvidenceBasedHomeopathyPage() {
  const router = useRouter();
  const [selectedPillar, setSelectedPillar] = useState<typeof pillars[0] | null>(null);

  const pillars = [
    {
      num: "01",
      title: "Classical Foundation",
      desc: "Kent’s Repertory, Boericke’s Materia Medica, and Allen’s Keynotes form the bedrock. Classical principles enhanced — never discarded — by evidence.",
      icon: <BookOpen className="w-5 h-5 text-mint" />,
      extended: {
        corePhilosophy: "Similia Similibus Curentur (Like cures like) using single, individualized remedies in minimum doses. We preserve the integrity of classical homeopathic methodology while modernizing its clinical application.",
        clinicalLiterature: [
          "Kent's Repertory of the Homeopathic Materia Medica (Symptom classification)",
          "Boericke's Pocket Manual of Homoeopathic Materia Medica (Remedy affinity profiles)",
          "Allen's Keynotes & Characteristics (Identifying guiding symptoms)"
        ],
        clinicalDiagnostics: [
          "Translating patient subjective symptoms into modern clinical pathology terms.",
          "Cross-referencing repertory rubrics with current ICD-10 diagnostic categories."
        ],
        caseReasoning: "A patient presenting with shifting arthritic joint pains. Classically, we identify key modalities (aggravation in a warm room, relief from cool air). Instead of prescribing broad anti-inflammatories, we select Pulsatilla, matching the unique individual presentation.",
        remSelection: "Remedies are sourced from certified laboratories complying strictly with HPUS (Homoeopathic Pharmacopoeia of the United States) standards, ensuring exact dilutions."
      }
    },
    {
      num: "02",
      title: "Scientific Integration",
      desc: "Remedies validated against RCTs, systematic reviews, and observational studies. Where evidence exists, it guides — where it doesn’t, classical principles lead.",
      icon: <Compass className="w-5 h-5 text-aqua" />,
      extended: {
        corePhilosophy: "We bridge the gap between historical empirical observations and modern scientific standards, reviewing clinical trials and nanoscience research to justify remedy choices.",
        clinicalLiterature: [
          "Cochrane Systematic Reviews on high-dilution therapeutics",
          "PubMed/MEDLINE clinical trials (RCTs) for acute and chronic conditions",
          "Nanoscience research journals detailing nanoparticle retention in serial dilutions"
        ],
        clinicalDiagnostics: [
          "Monitoring cellular responses and inflammatory mediators post-treatment.",
          "Verifying remedy actions through in-vitro and in-vivo research data."
        ],
        caseReasoning: "In cases of allergic rhinitis, we integrate clinical trial evidence of Galphimia Glauca. If the patient's individual presentation aligns, the remedy is selected with double validation: symptom similarity and trial efficacy.",
        remSelection: "Nanoparticle theory reveals that serial dilution combined with succussion (agitation) produces stable nanoparticles of the starting material, which interface with cellular signal pathways."
      }
    },
    {
      num: "03",
      title: "Outcome Measurement",
      desc: "Quality-of-life scales, biomarker tracking, and validated symptom severity instruments demonstrate real, measurable clinical improvement.",
      icon: <BarChart className="w-5 h-5 text-lavender-dark" />,
      extended: {
        corePhilosophy: "We believe clinical success must be objective and measurable. Subjective improvement is verified through validated scoring scales, laboratory analysis, and radiological progress.",
        clinicalLiterature: [
          "Glasgow Homeopathic Hospital Outcome Scale (GHHOS)",
          "SF-36 Quality of Life Health Survey",
          "Visual Analog Scales (VAS) for pain and symptom severity tracking"
        ],
        clinicalDiagnostics: [
          "Biomarkers: CRP, ESR, HbA1c, Thyroid Panel (TSH, FT3, FT4), Liver/Kidney profiles.",
          "Imaging: Pre- and post-treatment Ultrasonography, MRI, CT, and X-ray comparisons."
        ],
        caseReasoning: "A patient with Rheumatoid Arthritis tracks pain on a daily VAS scale. Concurrently, inflammatory markers (CRP and ESR) are measured monthly. Treatment success is defined by a simultaneous drop in both symptom scores and serum inflammatory levels.",
        remSelection: "Remedy adjustments are guided directly by objective data trends, reducing potency when biomarkers stabilize and increasing it if progression halts."
      }
    },
    {
      num: "04",
      title: "Individualisation",
      desc: "Two patients with identical diagnoses receive different remedies. The totality of symptoms — physical, mental, emotional — determines the prescription.",
      icon: <Users className="w-5 h-5 text-rose-500" />,
      extended: {
        corePhilosophy: "We treat the patient who has the disease, not just the disease. Every individual has a unique genetic, environmental, and emotional constitution that shapes their pathology.",
        clinicalLiterature: [
          "Hahnemann's Organon of Medicine (Aphorisms 83-104 on case taking)",
          "Miasmatic diagnosis guides (Psora, Sycosis, Syphilis, Tubercular)",
          "Constitutional remedy profiles from Materia Medica"
        ],
        clinicalDiagnostics: [
          "Complete lifestyle, dietary, and psychological stress mapping.",
          "Evaluating hereditary miasmatic backgrounds through detailed multi-generational history."
        ],
        caseReasoning: "Two patients present with clinically diagnosed Eczema. Patient A is warm, irritable, and worse from scratching at night; they receive Sulphur. Patient B is chilly, anxious, and relieved by warm applications; they receive Arsenicum Album. Identical disease, opposite remedies.",
        remSelection: "Remedy selection integrates physical generals (food cravings, sleep posture, thermal status) with mental-emotional states, ensuring a perfect constitutional match."
      }
    },
    {
      num: "05",
      title: "Integrative Safety",
      desc: "Treatment designed to work alongside conventional care. No dangerous interactions. Patient safety is non-negotiable.",
      icon: <Heart className="w-5 h-5 text-teal-500" />,
      extended: {
        corePhilosophy: "We promote a collaborative, integrative model. Our treatments do not interfere with conventional prescriptions (antibiotics, steroids, chemotherapeutics) and have no toxic side effects.",
        clinicalLiterature: [
          "Pharmacovigilance guidelines for complementary medicine",
          "Inter-system medical interaction studies",
          "Standard red-flag clinical warning metrics"
        ],
        clinicalDiagnostics: [
          "Routine safety panels (Complete Blood Count, Liver/Kidney function monitoring).",
          "Screening for adverse events or target organ toxicity."
        ],
        caseReasoning: "A patient undergoing chemotherapy receives homeopathic support to manage nausea and fatigue. The micro-diluted remedies do not bind to oncological drug receptor sites, ensuring zero chemical interference while supporting cellular recovery.",
        remSelection: "Strict compliance with safety protocols. If a patient shows signs of acute surgical emergency or severe infection, we halt homeopathic adjustment and refer them immediately to conventional emergency care."
      }
    },
    {
      num: "06",
      title: "Ethical Transparency",
      desc: "Honest prognosis. Realistic expectations. Clear communication of what homeopathy can — and cannot — achieve.",
      icon: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
      extended: {
        corePhilosophy: "Integrity is our primary clinical value. We establish clear boundaries of care, explaining to patients what is therapeutically achievable and when referral is required.",
        clinicalLiterature: [
          "Medical ethics guidelines in complementary medicine",
          "Prognostic criteria for structural vs. functional pathology",
          "Patient consent and therapeutic communication manuals"
        ],
        clinicalDiagnostics: [
          "Pre-treatment structural assessment to evaluate pathology depth.",
          "Standardized informed consent documentation outlining clinical goals."
        ],
        caseReasoning: "A patient with advanced osteoarthritic joint destruction seeks treatment. We clarify that we cannot regrow eroded cartilage (structural limitation), but we can target pain management and improve mobility (functional capability).",
        remSelection: "Honest advice on treatment duration. If no measurable improvement in symptoms or biomarkers is observed within 3-6 months, we reassess the case, consult our protocol database, or recommend alternative care."
      }
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
    <div className="pt-32 pb-24 px-0 relative">
      


      <div className="max-w-7xl mx-auto z-10 relative px-6">
        
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
            className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-[#1A2421] dark:text-white mb-6 leading-tight"
          >
            Evidence-Based Homeopathy Redefined.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-base md:text-lg text-slate-700 dark:text-slate-300 font-semibold leading-relaxed mb-8 max-w-3xl"
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
                className="bg-mint hover:bg-mint-dark text-white px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_8px_30px_rgba(20,184,166,0.25)] hover:shadow-[0_8px_35px_rgba(20,184,166,0.35)] hover:scale-[1.02] active:scale-[0.98] animate-float-p1"
              >
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={handleExploreConditions}
                className="glass-panel border-slate-200 hover:border-slate-800 text-[#1A2421] dark:text-white bg-white/40 px-8 py-4 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer"
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
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] dark:text-white mt-2 mb-4">
              Six Pillars of Evidence-Based Practice
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
              We operate at the interface of historical therapeutics and contemporary medical scrutiny. Click any pillar to view detailed clinical literature standards, validations, and case examples.
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
                onClick={() => setSelectedPillar(p)}
                className="glass-panel border-white/60 bg-white/40 p-8 rounded-3xl relative overflow-hidden cursor-pointer hover:border-mint/40 hover:shadow-lg hover:shadow-mint/2 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="absolute top-4 right-6 text-4xl font-black text-slate-900/5 select-none font-sans">
                    {p.num}
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 shadow-sm">
                    {p.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-3 group-hover:text-mint transition-colors">{p.title}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed mb-4">{p.desc}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-mint font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                  Explore Reference Details
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* The Clinical Process */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Methodology</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] dark:text-white mt-2 mb-4">
              From First Consultation to Measurable Recovery
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
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
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-xs font-black text-mint/30 uppercase tracking-widest font-mono">
                      Step {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#1A2421] dark:text-white mb-1">{step.title}</h3>
                  <span className="text-[10px] text-mint font-bold uppercase tracking-wider block mb-3">
                    {step.time}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Diagnostics Validation Gallery */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-16">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Clinical Validation</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] dark:text-white mt-2 mb-4">
              Biomarker & Diagnostic Monitoring
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
              We utilize state-of-the-art laboratory testing and radiological imaging to monitor tissue recovery, track inflammation levels, and scientifically document your recovery path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Modality 1: Lab Reports */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel border-white/60 bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/images/diagnostic_reports.png"
                    alt="Clinical Pathology Reports"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-mint/90 px-3 py-1 rounded-full uppercase tracking-wider">
                    Pathology
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-2">Biomarker & Lab Reports</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    Routine checking of immunological indicators (IgE, ANA), inflammatory levels (CRP, ESR), HbA1c for metabolic control, and organ profiles (LFT, KFT) to map physiological progress.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Modality 2: MRI Scans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel border-white/60 bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/images/diagnostic_mri.png"
                    alt="Magnetic Resonance Imaging"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-aqua/90 px-3 py-1 rounded-full uppercase tracking-wider">
                    MRI Scan
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-2">Magnetic Resonance Imaging</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    High-resolution soft tissue scan structures to validate changes in structural conditions, chronic joint inflammation, ligament status, and disk compressions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Modality 3: CT Scan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel border-white/60 bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/images/diagnostic_ct.png"
                    alt="Computed Tomography Scan"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-lavender-dark/95 px-3 py-1 rounded-full uppercase tracking-wider">
                    CT Imaging
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-2">Computed Tomography (CT)</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    Detailed cross-sectional imaging used to inspect bone structures, deep abdominal tissue densities, and track pulmonary changes in chronic respiratory conditions.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Modality 4: X-Ray */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel border-white/60 bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full md:col-span-2 lg:col-span-1 lg:max-w-none"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/images/diagnostic_xray.png"
                    alt="Digital X-Ray"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">
                    Digital X-Ray
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-2">Digital Radiography (X-Ray)</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    Rapid radiographic tracking for pulmonary consolidation, joint alignment changes, bone mineralization, and monitoring spinal osteophyte progression.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Modality 5: Clinical Lab */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel border-white/60 bg-white/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full md:col-span-2 lg:col-span-2 lg:max-w-none"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src="/images/diagnostic_lab.png"
                    alt="Clinical Pathology Laboratory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded-full uppercase tracking-wider">
                    Pathology Lab
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A2421] dark:text-white mb-2">Advanced Pathology Laboratory</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                    Our partner diagnostic labs run highly automated blood assays and urine chemistries, ensuring that your baseline metrics are tracked with maximum clinical precision.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Interactive Simulator Section */}
        <div className="mb-28 border-t border-slate-900/5 pt-20">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest">Active Demonstration</span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] dark:text-white mt-2 mb-4">
              Understanding Potency Dilution
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
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
            <span className="text-[10px] text-mint font-bold uppercase tracking-widest bg-white dark:bg-slate-900 border border-mint/20 px-3 py-1 rounded-full shadow-sm">
              Begin Clinical Care
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#1A2421] dark:text-white">
              Ready for Homeopathy That Actually Measures Results?
            </h2>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed max-w-lg mx-auto">
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

      {/* Side Panel Drawer */}
      <Portal>
        <AnimatePresence>
          {selectedPillar && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPillar(null)}
              className="fixed inset-0 z-40 bg-[#1A2421]/30 backdrop-blur-sm pointer-events-auto"
            />
          )}

          {selectedPillar && (
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-white dark:bg-[#0f172a] shadow-2xl p-6 md:p-10 flex flex-col justify-between overflow-y-auto pointer-events-auto border-l border-slate-100 dark:border-slate-800"
            >
              <div>
                {/* Header Row */}
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-850 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900/5 dark:bg-white/5 flex items-center justify-center text-slate-800 dark:text-slate-200">
                      {selectedPillar.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-mint uppercase tracking-widest font-mono">
                        Pillar {selectedPillar.num}
                      </span>
                      <h3 className="text-xl font-bold text-[#1A2421] dark:text-white leading-tight">
                        {selectedPillar.title}
                      </h3>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPillar(null)}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-[#1A2421] dark:hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Body Content */}
                <div className="space-y-6 text-left">
                  {/* Section 1: Core Philosophy */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2421] dark:text-white uppercase tracking-wider mb-2">
                      Core Clinical Philosophy
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                      {selectedPillar.extended.corePhilosophy}
                    </p>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Section 2: Clinical Literature */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2421] dark:text-white uppercase tracking-wider mb-2">
                      Standards & Reference Literature
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedPillar.extended.clinicalLiterature.map((lit, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex gap-2 items-start">
                          <span className="text-mint font-bold mt-0.5">•</span>
                          <span>{lit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Section 3: Clinical Diagnostics */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2421] dark:text-white uppercase tracking-wider mb-2">
                      Diagnostic Validation Methods
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedPillar.extended.clinicalDiagnostics.map((diag, idx) => (
                        <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex gap-2 items-start">
                          <span className="text-mint font-bold mt-0.5">•</span>
                          <span>{diag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Section 4: Clinical Case Reasoning */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2421] dark:text-white uppercase tracking-wider mb-2">
                      Clinical Case Reasoning Example
                    </h4>
                    <div className="bg-[#FAF9F6] dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold italic">
                        "{selectedPillar.extended.caseReasoning}"
                      </p>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Section 5: Remedy Selection */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1A2421] dark:text-white uppercase tracking-wider mb-2">
                      Remedy Standardization & Potency Policy
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                      {selectedPillar.extended.remSelection}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8">
                <button
                  onClick={() => setSelectedPillar(null)}
                  className="w-full bg-[#1A2421] dark:bg-mint hover:bg-mint dark:hover:bg-mint-dark text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-full transition-all cursor-pointer text-center"
                >
                  Close Reference Sheet
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>

    </div>
  );
}
