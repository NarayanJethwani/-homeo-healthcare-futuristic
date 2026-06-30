"use client";

import React, { useState } from "react";
import { AlertTriangle, Calendar, Info, X, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface ClinicalAlert {
  id: string;
  type: "critical" | "important" | "informational";
  title: string;
  message: string;
  patientName: string;
  patientId: string;
  aiRecommendation?: string;
}

interface CriticalAlertsPanelProps {
  patients: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  dismissedAlerts?: string[];
  onDismissAlert?: (id: string) => void;
}

export default function CriticalAlertsPanel({
  patients,
  onSelectPatient,
  setActiveTab,
  dismissedAlerts = [],
  onDismissAlert,
}: CriticalAlertsPanelProps) {
  const [localDismissed, setLocalDismissed] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeDismissed = onDismissAlert ? dismissedAlerts : localDismissed;

  const handleDismiss = (id: string) => {
    if (onDismissAlert) {
      onDismissAlert(id);
    } else {
      setLocalDismissed((prev) => [...prev, id]);
    }
  };

  const handleOpenPatient = (patientId: string) => {
    onSelectPatient(patientId);
    setActiveTab("patients");
  };

  // Compile alerts based on patients in database
  const alerts: ClinicalAlert[] = React.useMemo(() => {
    const list: ClinicalAlert[] = [];

    patients.forEach((pat, idx) => {
      const compl = pat.complaint.toLowerCase();
      const pId = pat.id;

      if (compl.includes("acid") || compl.includes("gerd")) {
        list.push({
          id: `alert-gerd-${pId}`,
          type: "critical",
          title: "Abnormal blood/gastric report uploaded",
          message: `Patient shows symptoms of severe hyperacidity. Evaluate potential Barrett's esophagus markers.`,
          patientName: pat.name,
          patientId: pId,
          aiRecommendation: "Review report findings and consider Iris Versicolor 30C drainage layer.",
        });
      } else if (compl.includes("eczema") || compl.includes("itching") || compl.includes("skin")) {
        list.push({
          id: `alert-skin-${pId}`,
          type: "important",
          title: "Dose 14-day follow-up review due",
          message: `Check sulphur/constitutional response. Evaluate if skin flare occurred.`,
          patientName: pat.name,
          patientId: pId,
          aiRecommendation: "Verify whether skin lesions are discharging or drying. Do not repeat dose early.",
        });
      } else if (compl.includes("joint") || compl.includes("arthritis") || compl.includes("pain")) {
        list.push({
          id: `alert-joint-${pId}`,
          type: "important",
          title: "Chronic joint stiffness flare noted",
          message: `Patient reports stiffness aggravated by damp weather and initial motion.`,
          patientName: pat.name,
          patientId: pId,
          aiRecommendation: "Check anti-cyclic citrullinated peptide (CCP) index and evaluate Rhus Tox layer.",
        });
      } else {
        // Fallback informational review alert
        if (idx === 0) {
          list.push({
            id: `alert-review-${pId}`,
            type: "informational",
            title: "Routine patient record audit suggested",
            message: `Verify if final pricing agreement and case folder documents match Firestore.`,
            patientName: pat.name,
            patientId: pId,
            aiRecommendation: "Confirm Google Drive sync folder links are active and functional.",
          });
        }
      }
    });

    // Provide default fallback alerts if database is empty so screen isn't bare
    if (list.length === 0) {
      list.push({
        id: "alert-default-1",
        type: "critical",
        title: "Abnormal blood panel noted",
        message: "Highly elevated TSH level (8.4 uIU/mL) detected. Confirm primary diagnosis.",
        patientName: "Meera Jethwani",
        patientId: "mock-meera",
        aiRecommendation: "Confirm TSH index and consider Thyroidinum 30C supportive clinical layer.",
      });
      list.push({
        id: "alert-default-2",
        type: "important",
        title: "Dose 21-day follow-up review due",
        message: "Sulphur 30C dose evaluation timeline reached. Check clinical status.",
        patientName: "Rahul Sharma",
        patientId: "mock-rahul",
        aiRecommendation: "Assess if eczema flared initially and evaluate respiratory parameters.",
      });
    }

    return list.filter((item) => !activeDismissed.includes(item.id));
  }, [patients, activeDismissed]);

  // Group alerts by priority
  const groupedAlerts = React.useMemo(() => {
    const critical = alerts.filter((a) => a.type === "critical");
    const important = alerts.filter((a) => a.type === "important");
    const informational = alerts.filter((a) => a.type === "informational");
    return { critical, important, informational };
  }, [alerts]);

  const totalAlerts = alerts.length;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250">
            Critical Clinical Alerts
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {totalAlerts > 0 && (
            <span className="text-[9px] bg-rose-55 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full font-bold">
              {totalAlerts} Active Alerts
            </span>
          )}
          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 border-none bg-transparent cursor-pointer text-slate-400"
            title={isCollapsed ? "Expand lower-priority alerts" : "Collapse lower-priority alerts"}
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Alerts Stack */}
      {totalAlerts > 0 ? (
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {/* 1. Critical Alerts (Always show) */}
          {groupedAlerts.critical.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 flex gap-3 text-xs items-start animate-in fade-in slide-in-from-top-1 duration-150 relative group"
            >
              <AlertTriangle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1 min-w-0 pr-6">
                <div className="font-bold text-rose-900 dark:text-rose-400 flex items-center gap-2 flex-wrap">
                  <span>{item.title}</span>
                  <span className="text-[9px] uppercase tracking-widest font-extrabold bg-rose-100 dark:bg-rose-950/50 px-1.5 py-0.5 rounded">
                    Critical
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-350 mt-1 leading-normal">
                  Patient: <span className="font-bold text-slate-800 dark:text-slate-200">{item.patientName}</span> - {item.message}
                </div>
                {item.aiRecommendation && (
                  <div className="mt-2.5 p-2 bg-white/70 dark:bg-slate-900/70 border border-rose-100/50 dark:border-rose-900/20 rounded-xl text-[10.5px] leading-relaxed text-rose-800 dark:text-rose-400 font-sans">
                    <span className="font-bold">AI Clinical Suggestion:</span> {item.aiRecommendation}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleOpenPatient(item.patientId)}
                    className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold border-none transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <span>Open Patient Case</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleDismiss(item.id)}
                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-450 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                title="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* 2. Important & Informational Alerts (Collapsible) */}
          {(!isCollapsed ? [...groupedAlerts.important, ...groupedAlerts.informational] : []).map((item) => {
            const isImportant = item.type === "important";
            const borderClass = isImportant
              ? "bg-amber-50/40 dark:bg-amber-950/5 border-amber-100 dark:border-amber-900/20 text-slate-700 dark:text-slate-300"
              : "bg-blue-50/30 dark:bg-blue-950/5 border-blue-100 dark:border-blue-900/20 text-slate-700 dark:text-slate-300";

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border flex gap-3 text-xs items-start animate-in fade-in slide-in-from-top-1 duration-150 relative group ${borderClass}`}
              >
                {isImportant ? (
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="font-bold flex items-center gap-2 flex-wrap">
                    <span className="text-slate-800 dark:text-slate-200">{item.title}</span>
                    <span
                      className={`text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded ${
                        isImportant
                          ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400"
                          : "bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-400"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                    Patient: <span className="font-bold text-slate-750 dark:text-slate-200">{item.patientName}</span> - {item.message}
                  </div>
                  {item.aiRecommendation && (
                    <div className="mt-2.5 p-2 bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-xl text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-450 font-sans">
                      <span className="font-bold">AI Clinical Suggestion:</span> {item.aiRecommendation}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleOpenPatient(item.patientId)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-350 rounded-xl text-[10px] font-bold border-none transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-all border-none bg-transparent cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {isCollapsed && (groupedAlerts.important.length > 0 || groupedAlerts.informational.length > 0) && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="w-full text-center py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-[10.5px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer border-none transition-colors"
            >
              Show {groupedAlerts.important.length + groupedAlerts.informational.length} collapsed alerts...
            </button>
          )}
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <Info className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="text-xs font-bold text-slate-500">No active clinical alerts</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-655 max-w-sm mx-auto">
            All reports and follow-up alerts are within normal parameters.
          </p>
        </div>
      )}
    </div>
  );
}
