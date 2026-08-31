"use client";

import React from "react";
import { Calendar, Clock, ArrowRight, ClipboardCheck, AlertTriangle, RefreshCw, MapPin, Stethoscope, UserRound } from "lucide-react";
import type { ClinicalAppointment } from "@/lib/appointmentService";

interface TodayScheduleProps {
  appointments?: ClinicalAppointment[];
  onSelectPatient: (id: string) => void;
  setActiveTab: (tabId: any) => void;
  onUpdateStatus?: (appointment: ClinicalAppointment, status: "checked-in" | "completed") => void;
  onReschedule?: (appointment: ClinicalAppointment) => void;
  onCancel?: (appointment: ClinicalAppointment) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  reduceMotion?: boolean;
}

const localDay = (value: string) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date(value));
const formatTime = (value: string) => new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(value));
const typeLabel = (value: ClinicalAppointment["type"]) => value === "report-review" ? "Report review" : value.replace("-", " ");

export default function TodaySchedule({ appointments = [], onSelectPatient, setActiveTab, onUpdateStatus, onReschedule, onCancel, isLoading = false, error = null, onRetry }: TodayScheduleProps) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const todayAppointments = appointments.filter((appointment) => localDay(appointment.startsAt) === today && !["cancelled", "no-show"].includes(appointment.status));
  const handleOpenPatient = (patientId: string) => { onSelectPatient(patientId); setActiveTab("patients"); };

  if (isLoading) return <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-xs"><div className="h-4 w-40 animate-pulse rounded bg-slate-100" /><div className="mt-4 space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-50" />)}</div></div>;
  if (error) return <div className="flex items-center justify-between rounded-[24px] border border-rose-200 bg-rose-50 p-6"><span className="flex items-center gap-3 text-xs font-bold text-rose-800"><AlertTriangle className="h-5 w-5" />Unable to load clinical schedule: {error}</span>{onRetry && <button onClick={onRetry} className="rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white"><RefreshCw className="mr-1 inline h-3 w-3" />Retry</button>}</div>;

  return <div className="space-y-4 rounded-[24px] border border-slate-202 bg-white p-5 shadow-xs dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800"><h3 className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200"><Calendar className="h-4 w-4 text-teal-500" />Today&apos;s Clinical Schedule</h3><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 dark:bg-slate-800">{todayAppointments.length} scheduled</span></div>
    {todayAppointments.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead><tr className="border-b text-[8.5px] font-extrabold uppercase tracking-wider text-slate-400"><th className="pb-3 pl-2">Patient</th><th className="pb-3">Time</th><th className="pb-3">Purpose</th><th className="pb-3">Clinician / room</th><th className="pb-3">Scheduled by</th><th className="pb-3">Status</th><th className="pb-3 pr-2 text-right">Action</th></tr></thead><tbody>{todayAppointments.map((appointment) => {
      const duration = Math.round((Date.parse(appointment.endsAt) - Date.parse(appointment.startsAt)) / 60_000);
      return <tr key={appointment.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800"><td className="py-3 pl-2 font-bold text-slate-800 dark:text-slate-100">{appointment.patientName}<span className="mt-0.5 block text-[9px] font-medium capitalize text-slate-400">{typeLabel(appointment.type)}</span></td><td className="py-3 font-mono text-[10px] text-slate-600"><Clock className="mr-1 inline h-3 w-3 text-slate-400" />{formatTime(appointment.startsAt)}<span className="ml-1 text-slate-400">· {duration}m</span></td><td className="max-w-[180px] truncate py-3 text-slate-600" title={appointment.notes}>{appointment.notes || "—"}</td><td className="py-3 text-[10px] text-slate-600"><span className="block font-bold"><Stethoscope className="mr-1 inline h-3 w-3 text-slate-400" />{appointment.doctorName}</span><span className="text-slate-400"><MapPin className="mr-1 inline h-3 w-3" />{appointment.room || "—"}</span></td><td className="py-3 text-[10px] text-slate-600"><span className="block font-bold"><UserRound className="mr-1 inline h-3 w-3 text-slate-400" />{appointment.scheduledBy.name}</span><span className="text-slate-400">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }).format(new Date(appointment.createdAt))}</span></td><td className="py-3"><span className="rounded-full bg-sky-50 px-2 py-0.5 text-[8px] font-extrabold uppercase text-sky-700">{appointment.status}</span></td><td className="py-3 pr-2 text-right"><div className="inline-flex gap-1"><button onClick={() => handleOpenPatient(appointment.patientId)} className="rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-600">Open <ArrowRight className="inline h-3 w-3" /></button>{appointment.status === "scheduled" && <><button onClick={() => onReschedule?.(appointment)} className="rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-600">Move</button><button onClick={() => onCancel?.(appointment)} className="rounded-lg bg-rose-50 px-2 py-1 text-[9px] font-bold text-rose-700">Cancel</button></>}{appointment.status === "scheduled" && onUpdateStatus && <button onClick={() => onUpdateStatus(appointment, "checked-in")} className="rounded-lg bg-teal-50 px-2 py-1 text-[9px] font-bold text-teal-700">Check in</button>}{appointment.status === "checked-in" && onUpdateStatus && <button onClick={() => onUpdateStatus(appointment, "completed")} className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Complete</button>}</div></td></tr>;
    })}</tbody></table></div> : <div className="rounded-[20px] border border-dashed border-slate-200 p-8 text-center"><ClipboardCheck className="mx-auto h-8 w-8 text-slate-300" /><div className="mt-2 text-xs font-bold text-slate-500">No appointments scheduled today</div><p className="mt-1 text-[10px] text-slate-400">Book a visit from Schedule Visit. This panel never invents appointments.</p></div>}
  </div>;
}
