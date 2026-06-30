"use client";

import React, { useMemo } from "react";
import { Users, FileText, ArrowRight, ShieldAlert, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { Patient } from "../types";
import { usePatientQueue } from "../hooks/usePatientQueue";

interface PatientQueueProps {
  patients?: Patient[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

export default function PatientQueue({
  patients = [],
  onSelectPatient,
  setActiveTab,
  isLoading = false,
  error = null,
  onRetry,
  reduceMotion = false,
}: PatientQueueProps) {
  const { queue } = usePatientQueue(patients);
  const displayQueue = queue.length > 0 ? queue : [
    {
      id: "pat-rahul-01",
      name: "Rahul Sharma",
      age: "34",
      gender: "Male",
      complaint: "Suppressed Eczema & Chronic Asthma flares",
      priority: "Critical",
      lastVisit: "Today 10:30 AM",
      assignedDoctor: "Dr. Narayan Jethwani",
      currentRemedy: "Sulphur 30C (Miasmatic)",
      followUpDue: "Jul 14, 2026",
      outstandingReports: "2 files",
      paymentStatus: "Paid",
      stage: "Intake Pending",
      pendingReports: ["IgE Panel", "Absolute Eosinophils"],
    },
    {
      id: "pat-meera-02",
      name: "Meera Jethwani",
      age: "62",
      gender: "Female",
      complaint: "Severe GERD & Autonomic Dysregulation",
      priority: "High",
      lastVisit: "Today 11:45 AM",
      assignedDoctor: "Dr. Narayan Jethwani",
      currentRemedy: "Nux Vomica 200C",
      followUpDue: "Jul 18, 2026",
      outstandingReports: "2 files",
      paymentStatus: "Partial",
      stage: "Report Analyzer",
      pendingReports: ["TSH Axis", "Fasting Glucose"],
    },
    {
      id: "pat-kabir-03",
      name: "Baby Kabir",
      age: "5",
      gender: "Male",
      complaint: "Dry Psoric Skin Itching & eruptions",
      priority: "Medium",
      lastVisit: "Yesterday",
      assignedDoctor: "Dr. Jethwani",
      currentRemedy: "Graphites 6C",
      followUpDue: "Jul 22, 2026",
      outstandingReports: "1 file",
      paymentStatus: "Unpaid",
      stage: "Outreach Pending",
      pendingReports: ["CBC Count"],
    },
  ];

  const handleOpenPatient = (id: string) => {
    onSelectPatient(id);
    setActiveTab("patients");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30";
      case "High":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-455 border border-amber-100 dark:border-amber-900/30";
      default:
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-455 border border-blue-100 dark:border-blue-900/30";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-205 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-5/6 bg-slate-150 dark:bg-slate-850 rounded" />
              <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[32px] flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-650" />
          <span className="text-xs font-bold text-rose-850 dark:text-rose-350">
            Error loading intake queue: {error}
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 bg-rose-650 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1.5 border-none focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-500" />
          <span>Patient Intake Queue</span>
        </h3>
        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
          Active cases: {displayQueue.length}
        </span>
      </div>

      {/* Patient Cards Stack */}
      {displayQueue.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {displayQueue.map((pat) => (
            <div
              key={pat.id}
              className={`p-5 bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-3xl flex flex-col justify-between gap-4 select-text relative transition-all ${
                reduceMotion ? "" : "hover:-translate-y-0.5 hover:shadow-xs duration-300"
              }`}
            >
              {/* Header info */}
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/50 pb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-105">{pat.name}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5 block">
                      {pat.age} y/o • {pat.gender}
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${getPriorityColor(pat.priority)}`}>
                    {pat.priority}
                  </span>
                </div>

                {/* Chief Complaint */}
                <div className="mt-3 text-[11px] text-slate-655 dark:text-slate-400 leading-relaxed">
                  <span className="font-extrabold text-slate-450 dark:text-slate-550 mr-1">Complaint:</span>
                  {pat.complaint}
                </div>

                {/* High-Density Key-Value Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-450">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">UHID:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pat.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Remedy:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate inline-block max-w-[110px] align-bottom">
                      {pat.currentRemedy}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Last Visit:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pat.lastVisit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Follow-up:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{pat.followUpDue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Assigned:</span>{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate inline-block max-w-[110px] align-bottom">
                      {pat.assignedDoctor}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">Payment:</span>{" "}
                    <span
                      className={`font-extrabold uppercase text-[9px] ${
                        pat.paymentStatus === "Paid"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : pat.paymentStatus === "Partial"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-rose-600 dark:text-rose-455"
                      }`}
                    >
                      {pat.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Pending reports */}
                {pat.pendingReports && pat.pendingReports.length > 0 && (
                  <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-550 flex items-center gap-1 shrink-0">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Outstanding Reports:</span>
                    </span>
                    {pat.pendingReports.slice(0, 2).map((rep, idx) => (
                      <span
                        key={idx}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 px-1.5 py-0.5 rounded text-[8.5px] font-mono font-bold text-slate-500 dark:text-slate-400"
                      >
                        {rep}
                      </span>
                    ))}
                    {pat.pendingReports.length > 2 && (
                      <span className="text-[8px] font-bold text-slate-400">+{pat.pendingReports.length - 2} more</span>
                    )}
                  </div>
                )}
              </div>

              {/* Stage and Action */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-[10px] gap-2 flex-wrap select-none">
                <div>
                  <div className="text-[9.5px] text-slate-400 dark:text-slate-500 font-semibold">
                    Current Stage: <span className="font-extrabold text-slate-750 dark:text-slate-350">{pat.stage}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPatient(pat.id)}
                  className={`px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-955/20 text-slate-700 dark:text-slate-400 hover:text-teal-650 dark:hover:text-teal-400 border border-slate-250 dark:border-slate-700 hover:border-teal-250 dark:hover:border-teal-900/50 rounded-xl text-[9.5px] font-extrabold cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                    reduceMotion ? "" : "active:scale-98"
                  }`}
                  aria-label={`Open case files for patient ${pat.name}`}
                >
                  <span>Open Case</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 select-none">
          <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Intake queue is empty</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-xs mx-auto">
            No patients currently registered in the clinical intake cycle.
          </p>
        </div>
      )}
    </div>
  );
}
