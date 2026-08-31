"use client";

import React, { useMemo, useState } from "react";
import type { Patient } from "../types";
import type { ClinicalAppointment } from "@/lib/appointmentService";

type AppointmentSchedulerModalProps = {
  patients: Patient[];
  appointment?: ClinicalAppointment | null;
  onClose: () => void;
  onScheduled: () => Promise<void> | void;
};

const localDateTime = (date: Date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
};

export default function AppointmentSchedulerModal({ patients, appointment, onClose, onScheduled }: AppointmentSchedulerModalProps) {
  const defaultStart = useMemo(() => {
    const date = new Date();
    date.setMinutes(0, 0, 0);
    date.setHours(date.getHours() + 1);
    return localDateTime(date);
  }, []);
  const [patientId, setPatientId] = useState(appointment?.patientId || "");
  const [startsAt, setStartsAt] = useState(appointment ? localDateTime(new Date(appointment.startsAt)) : defaultStart);
  const [duration, setDuration] = useState(appointment ? String(Math.round((Date.parse(appointment.endsAt) - Date.parse(appointment.startsAt)) / 60_000)) : "30");
  const [type, setType] = useState<ClinicalAppointment["type"]>(appointment?.type || "follow-up");
  const [room, setRoom] = useState(appointment?.room || "Consultation Room 1");
  const [notes, setNotes] = useState(appointment?.notes || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const patient = patients.find((item) => item.id === patientId);
    if (!patient) return setError("Select a registered patient.");
    const start = new Date(startsAt);
    const end = new Date(start.getTime() + Number(duration) * 60_000);
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/appointments", {
        method: appointment ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(appointment ? { id: appointment.id, action: "reschedule" } : { patientId: patient.id, patientName: patient.name, type }),
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
          room,
          notes,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not save the visit.");
      await onScheduled();
      onClose();
    } catch (reason: any) {
      setError(reason.message || "Could not schedule the visit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Schedule visit">
      <form onSubmit={submit} className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">{appointment ? "Reschedule visit" : "Schedule visit"}</h2><p className="mt-1 text-xs text-slate-500">The dashboard records booking provenance and schedule changes.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100">Close</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-xs font-semibold text-slate-700">Patient<select required disabled={Boolean(appointment)} value={patientId} onChange={(event) => setPatientId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"><option value="">Choose a registered patient</option>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} · {patient.id}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-700">Date and time<input required type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
          <label className="text-xs font-semibold text-slate-700">Duration<select value={duration} onChange={(event) => setDuration(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option></select></label>
          <label className="text-xs font-semibold text-slate-700">Visit type<select value={type} onChange={(event) => setType(event.target.value as ClinicalAppointment["type"])} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="intake">Intake</option><option value="follow-up">Follow-up</option><option value="report-review">Report review</option><option value="emergency">Emergency</option></select></label>
          <label className="text-xs font-semibold text-slate-700">Room / mode<input value={room} onChange={(event) => setRoom(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" /></label>
          <label className="sm:col-span-2 text-xs font-semibold text-slate-700">Clinical purpose / notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1.5 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Reason for the visit" /></label>
        </div>
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button disabled={saving || patients.length === 0} className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : appointment ? "Save new time" : "Schedule visit"}</button></div>
      </form>
    </div>
  );
}
