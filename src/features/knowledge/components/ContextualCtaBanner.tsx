"use client";

import React from "react";
import Link from "next/link";
import { usePatientMode } from "../context/PatientModeContext";
import { CalendarDays, Stethoscope, ArrowRight, ShieldCheck } from "lucide-react";

export default function ContextualCtaBanner() {
  const { audienceMode } = usePatientMode();

  if (audienceMode === "patient") {
    return (
      <div className="p-6 border border-teal-500/20 bg-teal-500/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 print-hide shadow-[0_4px_20px_rgba(20,184,166,0.05)]">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal-650 dark:text-teal-400 font-mono">Patient Clinical Support</span>
          <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">Seeking Expert Consultation?</h4>
          <p className="text-xs text-neutral-500 max-w-xl">
            Book an online video session with Dr. Narayan Jethwani to get an individualized constitutional homeopathic protocol tailored to your case.
          </p>
        </div>
        <a
          href="/contact"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 hover:bg-teal-600 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <CalendarDays className="h-4 w-4" /> Book Consultation <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  if (audienceMode === "student") {
    return (
      <div className="p-6 border border-indigo-500/20 bg-indigo-500/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 print-hide shadow-[0_4px_20px_rgba(99,102,241,0.05)]">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-650 dark:text-indigo-400 font-mono">Student Learning Center</span>
          <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">Deepen Your Repertory Practice</h4>
          <p className="text-xs text-neutral-500 max-w-xl">
            Register to join our online academic training workshops, review active case studies, and study classical organon philosophy with peers.
          </p>
        </div>
        <Link
          href="/knowledge/case-studies"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 hover:bg-indigo-600 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          Explore Case Studies <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Practitioner Mode CTA
  return (
    <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8 print-hide shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-650 dark:text-emerald-400 font-mono">Secure Clinician Access</span>
        <h4 className="text-sm font-bold text-neutral-850 dark:text-neutral-50">Secure Clinical OS Integration</h4>
        <p className="text-xs text-neutral-500 max-w-xl">
          Authorized medical team members can access treatment planning pipelines, secure records, and the clinical repertory explorer.
        </p>
      </div>
      <a
        href="/admin/login"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:bg-emerald-650 active:scale-95 transition-all shrink-0 cursor-pointer"
      >
        <Stethoscope className="h-4 w-4" /> Open Clinical OS <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
