"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, FileText, HeartHandshake, Lock, Globe, 
  Truck, CreditCard, AlertTriangle, Calendar, CheckCircle2,
  Mail, Phone, ShieldAlert, ArrowRight, ArrowLeft, BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

type TabType = "privacy" | "terms" | "telehealth";

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("privacy");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#terms") {
        setActiveTab("terms");
      } else if (hash === "#telehealth") {
        setActiveTab("telehealth");
      } else {
        setActiveTab("privacy");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update hash silently without scrolling
    window.history.pushState(null, "", `#${tab}`);
  };

  const handleBookConsultation = () => {
    router.push("/#booking");
  };

  return (
    <div className="pt-32 pb-24 px-6 relative">
      <div className="max-w-4xl mx-auto z-10 relative">
        
        {/* Back to Homepage Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex justify-center"
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
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold text-mint uppercase tracking-widest mb-4 inline-flex items-center gap-1.5 justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-mint breathe" />
            Legal & Ethical Framework
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#1A2421] mb-6"
          >
            Patient Care Agreements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-sm md:text-base text-slate-700 font-semibold leading-relaxed max-w-2xl mx-auto"
          >
            Transparency, clinical safety, and data security form the core foundation of our relationship with patients. Review our policies below.
          </motion.p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="glass-panel border-white/60 bg-white/40 p-1.5 rounded-full flex gap-1 shadow-sm">
            {(["privacy", "terms", "telehealth"] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              const labels = {
                privacy: "Privacy Policy",
                terms: "Terms & Conditions",
                telehealth: "Telehealth Consent",
              };
              const icons = {
                privacy: <ShieldCheck className="w-4 h-4" />,
                terms: <FileText className="w-4 h-4" />,
                telehealth: <HeartHandshake className="w-4 h-4" />,
              };
              return (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-white bg-mint shadow-sm shadow-mint/20"
                      : "text-slate-700 hover:text-mint"
                  }`}
                >
                  {icons[tab]}
                  <span>{labels[tab]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="glass-panel border-white/70 bg-white/50 p-8 md:p-12 rounded-[36px] shadow-[0_12px_40px_rgba(20,184,166,0.02)] min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 select-text"
              >
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1A2421] mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-mint" /> Clinical Data Privacy Framework
                  </h2>
                  <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mb-6">
                    Last Updated: May 2026
                  </p>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-6">
                    We hold the confidentiality of your medical history and health data with the utmost seriousness. In alignment with global medical ethics and digital personal data protection protocols (DPDP / DISHA regulations), this policy describes how we collect, store, and protect your information.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-900/5">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-4 h-4 text-mint" /> Data We Collect
                    </h3>
                    <ul className="text-xs text-slate-700 font-semibold space-y-2 leading-relaxed pl-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-mint flex-shrink-0 mt-0.5" />
                        <span><strong>Demographic Profile:</strong> Full name, age, contact numbers, email, and shipping address.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-mint flex-shrink-0 mt-0.5" />
                        <span><strong>Clinical Metrics:</strong> Complete physical generals (appetite, sleep, thermal profiles), emotional diatheses, and family genetic history.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-mint flex-shrink-0 mt-0.5" />
                        <span><strong>Laboratory Reports:</strong> Diagnostic blood markers, hormone levels, scans, and past prescriptions.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-aqua-dark" /> Clinical Purpose
                    </h3>
                    <ul className="text-xs text-slate-700 font-semibold space-y-2 leading-relaxed pl-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-aqua flex-shrink-0 mt-0.5" />
                        <span><strong>Constitutional Repertorisation:</strong> Cross-referencing symptoms across classical homeopathic repertories to pinpoint your constitutional remedy.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-aqua flex-shrink-0 mt-0.5" />
                        <span><strong>Biomarker Tracking:</strong> Measuring objective clinical progress across your treatment cycles.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-aqua flex-shrink-0 mt-0.5" />
                        <span><strong>Remedy Logistics:</strong> Compounding and shipping personalized medication to your coordinates.</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-900/5">
                  <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider">
                    Our Five Core Security Safeguards
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">1. Encryption-at-Rest</h4>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                        All patient medical records, digital case files, and uploaded scans are stored on encrypted clinical servers.
                      </p>
                    </div>
                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">2. Access Controls</h4>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                        Access is restricted strictly to Dr. Narayan Jethwani and credentialed clinical assistants under NDAs.
                      </p>
                    </div>
                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">3. Zero Data Sharing</h4>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                        We never sell, rent, or distribute medical history to pharmaceutical companies or marketing brokers.
                      </p>
                    </div>
                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">4. Secure Logistics</h4>
                      <p className="text-[11px] text-slate-700 font-semibold leading-relaxed">
                        Shipping partners only receive delivery details; no patient medical records are ever attached.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-amber-500/20 bg-amber-500/5 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Patient Rights
                  </h4>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    Under health data protection acts, you have the absolute right to request a full copy of your clinical files, request correcting diagnostic history details, or request total deletion of your communication records (subject to clinical record-keeping legal durations). Contact <a href="mailto:narayan.jethwani@gmail.com" className="text-mint underline cursor-pointer font-bold">narayan.jethwani@gmail.com</a> for requests.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "terms" && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 select-text"
              >
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1A2421] mb-2 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-mint" /> Clinical Terms & Conditions
                  </h2>
                  <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mb-6">
                    Last Updated: May 2026
                  </p>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-6">
                    By booking an online or in-person consultation through homeo.healthcare or Ramkrishna Homeopathic Consultancy, you agree to comply with and be bound by the following clinical terms and policies.
                  </p>
                </div>

                <div className="space-y-6 pt-4 border-t border-slate-900/5 font-semibold">
                  <div className="flex gap-4 items-start">
                    <Calendar className="w-5 h-5 text-mint flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1">
                        1. Consultation & Booking Terms
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        A clinical slot constitutes a dedicated medical evaluation window. New-case consultations span 60-90 minutes, and follow-ups span 15-30 minutes. Appointments cancelled or rescheduled at least 24 hours prior to the slot receive a full refund. Cancellations made under 24 hours are subject to a rescheduling fee.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <Truck className="w-5 h-5 text-aqua-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1">
                        2. Remedy Shipping & Logistics
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        As medications are custom-prepared for your specific constitutional profile at our Baner pharmacy, dispatch occurs within 24-48 business hours post-consultation. Domestic delivery (within India) requires 3-5 business days. International shipping (USA, UK, Europe, Australia, UAE) requires 7-14 business days. Custom duty compliance, where applicable, is handled in partnership with the courier.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <CreditCard className="w-5 h-5 text-lavender-dark flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1">
                        3. Refund and Pharmacy Purity Policy
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Under global pharmaceutical and clinical safety guidelines, custom-prepared dilutions and constitutional remedy packages once shipped cannot be returned or refunded. For multi-month packages, clinical cancellation is eligible for a pro-rata refund for the remaining consultation months, minus the cost of remedies already manufactured and dispatched.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <BookOpen className="w-5 h-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#1A2421] uppercase tracking-wider mb-1">
                        4. Intellectual Property
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        The scientific dilution calculators, clinical simulators, potency animations, and text grids hosted on homeo.healthcare are copyrighted works of Dr. Narayan Jethwani. Unauthorised copying, reproduction, or use of these digital tools is strictly prohibited.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "telehealth" && (
              <motion.div
                key="telehealth"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 select-text"
              >
                <div>
                  <h2 className="text-2xl font-serif font-semibold text-[#1A2421] mb-2 flex items-center gap-2">
                    <HeartHandshake className="w-6 h-6 text-mint" /> Telehealth Consent Framework
                  </h2>
                  <p className="text-xs text-slate-700 font-bold uppercase tracking-wider mb-6">
                    Last Updated: May 2026
                  </p>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed mb-6">
                    This agreement details the scope, limitations, and requirements of digital homeopathic care. Please review this framework thoroughly before initiating your online consultations.
                  </p>
                </div>

                <div className="p-6 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Telehealth Limitations & Emergencies
                  </h4>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    <strong>Telehealth is NOT designed or structured to address acute medical emergencies.</strong> If you are experiencing sudden severe respiratory failure, heart attack symptoms, severe anaphylactic shock, stroke, or major physical trauma, you must immediately contact your regional emergency services or proceed to the nearest physical emergency room.
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-900/5 font-semibold">
                  <h3 className="text-sm font-bold text-[#1A2421] uppercase tracking-wider">
                    Telehealth Agreements & Consent
                  </h3>
                  
                  <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">1. Consent to Digital Consultation</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        You consent to receive clinical consultation and homeopathic remedy recommendations via video channels (WhatsApp Video, Google Meet, Zoom) or phone calls. You understand that tele-homeopathy relies heavily on verbal descriptions of symptoms and uploaded lab reports.
                      </p>
                    </div>

                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">2. Diagnostic Truthfulness & Records</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        You agree to provide complete and accurate history, including current conventional medications, supplements, pregnancy status, and chronic diagnoses. Incomplete reporting may result in incorrect symptom repertorisation and inappropriate remedy selection.
                      </p>
                    </div>

                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">3. Integrative Therapeutics</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        Our homeopathic treatments operate constitutionally to support your vitality and run safely alongside conventional medicine. We never advise stopping your conventional medications (e.g. insulin, cardiac drugs, thyroid supplements) unilaterally. Any modifications should be done in consultation with your primary physician.
                      </p>
                    </div>

                    <div className="p-5 border border-white/60 bg-white/40 rounded-2xl">
                      <h4 className="text-xs font-bold text-[#1A2421] mb-1">4. Response Variation Disclaimer</h4>
                      <p className="text-[11px] text-slate-700 font-semibold">
                        Homeopathic remedy action works by stimulating natural vital reflexes. The speed and depth of healing are individual, depending on pathology duration, age, and systemic blocks. No guaranteed cure timeline is claimed, though statistical outcome tracking guides our clinical reviews.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-900/5">
                  <p className="text-xs text-slate-700 font-bold italic text-center">
                    By submitting the booking scheduler on this site or initiating treatment, you confirm that you have read, understood, and consented to these Telehealth and Medical Privacy rules.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Panel for Patient Booking */}
        <div className="glass-panel border-white/60 bg-white/30 rounded-[32px] p-8 md:p-12 mt-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-3 max-w-xl">
            <span className="text-[9px] text-mint font-bold uppercase tracking-wider border border-mint/20 bg-white px-2.5 py-1 rounded-full inline-block">
              Clinical Support
            </span>
            <h3 className="text-2xl font-bold text-[#1A2421]">Need Clarification on Policies?</h3>
            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
              If you have any questions regarding your medical data storage, consent frameworks, or shipment details, our support desk is ready to help.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Magnetic>
              <button
                onClick={handleBookConsultation}
                className="bg-mint hover:bg-mint-dark text-white font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-full shadow-sm shadow-mint/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Schedule Consultation <ArrowRight className="w-4 h-4" />
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </div>
  );
}
