"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Users, FileText, ArrowRight, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Clock, CreditCard, Video } from "lucide-react";
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
  
  // Track expanded card IDs locally for progressive disclosure
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const displayQueue = queue;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenPatient = (id: string) => {
    onSelectPatient(id);
    setActiveTab("patients");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30";
      case "High":
        return "bg-amber-50 text-amber-800 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30";
      default:
        return "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-850 rounded-[20px] border border-slate-205 dark:border-slate-800 animate-pulse space-y-3">
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
      <div className="bg-rose-50 dark:bg-rose-955/20 border border-rose-200 dark:border-rose-900/60 p-6 rounded-[24px] flex items-center justify-between select-none">
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
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-202/80 dark:border-slate-800/80 shadow-xs space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 select-none">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
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
          {displayQueue.map((pat) => {
            const isExpanded = !!expandedCardIds[pat.id];
            
            return (
              <div
                key={pat.id}
                onClick={(e) => toggleExpand(pat.id, e)}
                className={`p-4 bg-slate-50 dark:bg-slate-850/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 border border-slate-202/50 dark:border-slate-800 rounded-[20px] flex flex-col justify-between gap-3 select-text relative cursor-pointer transition-all ${
                  reduceMotion ? "" : "hover:-translate-y-0.5 duration-200"
                }`}
              >
                {/* Header Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100/60 dark:border-slate-800/40 pb-2">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-850 dark:text-slate-105">{pat.name}</h4>
                      <span className="text-[9.5px] text-slate-400 dark:text-slate-550 font-bold mt-0.5 block">
                        {pat.age} y/o • {pat.gender}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase ${getPriorityColor(pat.priority)}`}>
                        {pat.priority}
                      </span>
                      <button
                        onClick={(e) => toggleExpand(pat.id, e)}
                        className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 cursor-pointer border-none bg-transparent text-slate-400 outline-none"
                        aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Core Grid: High-density visual metrics displayed by default */}
                  <div className="grid grid-cols-3 gap-x-2 gap-y-1 mt-2.5 text-[9.5px] text-slate-600 dark:text-slate-450 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <div className="text-[8px] text-slate-400 font-semibold uppercase leading-none">Last Visit</div>
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">{pat.lastVisit}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <div className="text-[8px] text-slate-400 font-semibold uppercase leading-none">Remedy</div>
                        <div className="font-extrabold text-slate-800 dark:text-slate-200 truncate mt-0.5 max-w-[80px]" title={pat.currentRemedy}>
                          {pat.currentRemedy}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <div className="text-[8px] text-slate-400 font-semibold uppercase leading-none">Payment</div>
                        <div className={`font-extrabold uppercase text-[8.5px] mt-0.5 ${
                          pat.paymentStatus === "Paid"
                            ? "text-emerald-600 dark:text-emerald-450"
                            : pat.paymentStatus === "Partial"
                            ? "text-amber-600 dark:text-amber-450"
                            : "text-rose-600 dark:text-rose-455"
                        }`}>
                          {pat.paymentStatus}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progressive Disclosure Section (Collapsible Details) */}
                  {isExpanded && (
                    <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
                      {/* Chief Complaint */}
                      <div className="text-[10px] text-slate-655 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 border border-slate-202/60 dark:border-slate-800 p-2.5 rounded-xl">
                        <span className="font-extrabold text-slate-450 dark:text-slate-550 mr-1.5">Chief Complaint:</span>
                        {pat.complaint}
                      </div>

                      {/* Expanded Details Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9.5px] text-slate-600 dark:text-slate-450">
                        <div>
                          <span className="text-slate-400 dark:text-slate-550">Patient ID (UHID):</span>{" "}
                          <span className="font-bold text-slate-850 dark:text-slate-200">{pat.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-550">Follow-up Due:</span>{" "}
                          <span className="font-bold text-slate-850 dark:text-slate-200">{pat.followUpDue}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-550">Assigned Doc:</span>{" "}
                          <span className="font-bold text-slate-850 dark:text-slate-200 truncate">{pat.assignedDoctor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 dark:text-slate-550">Intake Stage:</span>{" "}
                          <span className="font-extrabold text-slate-750 dark:text-slate-350">{pat.stage}</span>
                        </div>
                      </div>

                      {/* Pending reports */}
                      {pat.pendingReports && pat.pendingReports.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8.5px] font-extrabold text-slate-400 dark:text-slate-550 flex items-center gap-1 shrink-0">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span>Pending Reports:</span>
                          </span>
                          {pat.pendingReports.map((rep, idx) => (
                            <span
                              key={idx}
                              className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-750 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold text-slate-550 dark:text-slate-450"
                            >
                              {rep}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Consultation & Open Case Action Buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/clinical/consultation?patientId=${encodeURIComponent(pat.id)}`}
                          onClick={(e) => e.stopPropagation()}
                          className={`px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-[9px] font-extrabold cursor-pointer flex items-center gap-1 shadow-sm transition-all ${
                            reduceMotion ? "" : "active:scale-98"
                          }`}
                        >
                          <Video className="w-3 h-3" />
                          <span>Start Consultation</span>
                        </Link>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPatient(pat.id);
                          }}
                          className={`px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 rounded-xl text-[9px] font-extrabold cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none transition-all ${
                            reduceMotion ? "" : "active:scale-98"
                          }`}
                          aria-label={`Open case files for patient ${pat.name}`}
                        >
                          <span>Open Case Workspace</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[20px] space-y-2 select-none">
          <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Intake queue is empty</div>
          <p className="text-[10px] text-slate-450 dark:text-slate-600 max-w-xs mx-auto">
            No patients currently registered in the clinical intake cycle.
          </p>
        </div>
      )}
    </div>
  );
}
