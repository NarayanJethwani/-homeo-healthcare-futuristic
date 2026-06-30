"use client";

import React from "react";
import { Calendar, User, Clock, ArrowRight, ClipboardCheck } from "lucide-react";

interface Appointment {
  id: string;
  name: string;
  age?: string;
  time: string;
  purpose: string;
  priority: "Critical" | "Important" | "Informational";
  status: "Waiting" | "Upcoming" | "Completed";
  patientId: string;
}

interface TodayScheduleProps {
  patients: any[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  isLoading?: boolean;
}

export default function TodaySchedule({
  patients,
  onSelectPatient,
  setActiveTab,
  isLoading = false,
}: TodayScheduleProps) {
  // Map or mock appointments from patient registry
  const appointments: Appointment[] = React.useMemo(() => {
    if (patients.length === 0) return [];

    // Map first 4 patients to today's schedule slots
    return patients.slice(0, 4).map((p, idx) => {
      const times = ["10:30 AM", "11:45 AM", "02:00 PM", "04:30 PM"];
      const purposes = [
        "Chronic Asthma & Eczema Review",
        "Severe GERD & Gastric Assessment",
        "Thyroid Axis Follow-up Evaluation",
        "Acute Throat and Congestion Flare",
      ];
      const priorities: ("Critical" | "Important" | "Informational")[] = [
        "Critical",
        "Important",
        "Informational",
        "Critical",
      ];
      const statuses: ("Waiting" | "Upcoming" | "Completed")[] = [
        "Waiting",
        "Upcoming",
        "Upcoming",
        "Completed",
      ];

      return {
        id: p.id,
        name: p.name,
        age: p.age,
        time: times[idx % times.length],
        purpose: purposes[idx % purposes.length],
        priority: priorities[idx % priorities.length],
        status: statuses[idx % statuses.length],
        patientId: p.id,
      };
    });
  }, [patients]);

  const handleOpenPatient = (patientId: string) => {
    onSelectPatient(patientId);
    setActiveTab("patients");
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 text-rose-650 dark:text-rose-450";
      case "Important":
        return "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30 text-amber-700 dark:text-amber-450";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/30 text-blue-650 dark:text-blue-450";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Waiting":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      default:
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center justify-between p-3 border-b border-slate-50 dark:border-slate-850">
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-2.5 w-44 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-250 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Today's Clinical Schedule</span>
        </h3>
        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
          {appointments.length} Patients Scheduled
        </span>
      </div>

      {appointments.length > 0 ? (
        <div className="overflow-x-auto select-text">
          <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <thead>
              <tr className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">
                <th className="pb-3 pl-2">Patient</th>
                <th className="pb-3">Time</th>
                <th className="pb-3">Consultation Purpose</th>
                <th className="pb-3">Priority</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-850">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pl-2 font-bold text-slate-850 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div>{apt.name}</div>
                        {apt.age && (
                          <span className="text-[10px] text-slate-400 font-semibold">{apt.age} y/o</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-500 dark:text-slate-400 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.time}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {apt.purpose}
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${getPriorityClass(apt.priority)}`}>
                      {apt.priority}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusClass(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      onClick={() => handleOpenPatient(apt.patientId)}
                      className="px-3 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-900/50 rounded-xl text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Case</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <ClipboardCheck className="w-8 h-8 text-slate-350 dark:text-slate-700 mx-auto" />
          <div className="text-xs font-bold text-slate-500">No appointments scheduled today</div>
          <p className="text-[10px] text-slate-400 dark:text-slate-600 max-w-sm mx-auto">
            All consultations for today have been completed or there are no bookings active in the planner.
          </p>
        </div>
      )}
    </div>
  );
}
